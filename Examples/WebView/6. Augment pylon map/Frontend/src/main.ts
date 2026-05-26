import proj4 from "proj4";

export {};

type HostBridge = Record<string, (...args: any[]) => unknown>;

type AugmentRuntime = {
  version: string;
  startedAt: string;
  hostAvailable(): boolean;
  callHost<T = unknown>(method: string, ...args: any[]): Promise<T>;
  waitForElement(selectors: string | string[], timeoutMs?: number): Promise<Element>;
  refresh(): Promise<void>;
  destroy(): void;
};

type GeoPoint = {
  lat: number;
  lon: number;
  clientX: number;
  clientY: number;
};

type BngPoint = {
  x: number;
  y: number;
};

declare global {
  interface Window {
    __augmentPylonMap__?: AugmentRuntime;
    chrome?: any;
  }
}

const VERSION = "0.1.0";
const ROOT_ID = "stdvba-augment-pylon-root";
const STYLE_ID = "stdvba-augment-pylon-style";
const MENU_ID = "stdvba-augment-pylon-menu";
const EPSG_27700 = "EPSG:27700";
const MENU_MARGIN = 10;

proj4.defs(
  EPSG_27700,
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs"
);

let domObserver: MutationObserver | null = null;
let mapHost: Element | null = null;
let boundMapTargets = new Set<EventTarget>();
let drawModeActive = false;
let lastContextPoint: GeoPoint | null = null;
let lastContextBng: BngPoint | null = null;
let activeLinePoints: GeoPoint[] = [];
let completedLinePoints: GeoPoint[][] = [];
let menuVisible = false;
let lastMiddleCapture = "";
let projectionCache: unknown[] = [];
let projectionCacheAt = 0;
let scribbleBaseMapCache: unknown = null;
let scribbleBaseMapCacheAt = 0;
let nativeLeafletMap: Record<string, unknown> | null = null;
let nativeLeafletLayers: unknown[] = [];

function getHostBridge(): HostBridge | null {
  return (window as any)?.chrome?.webview?.hostObjects?.vba ?? null;
}

function hostAvailable(): boolean {
  return !!getHostBridge();
}

async function callHost<T = unknown>(method: string, ...args: any[]): Promise<T> {
  const bridge = getHostBridge();
  if (!bridge || typeof bridge[method] !== "function") {
    throw new Error(`Host method not available: ${method}`);
  }
  const result = bridge[method](...args);
  return await Promise.resolve(result as T);
}

function whenDocumentReady(): Promise<void> {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
  });
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${ROOT_ID} {
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: min(320px, calc(100vw - 24px));
      padding: 8px 10px;
      border-radius: 999px;
      background: rgba(17, 24, 39, 0.92);
      color: #f8fafc;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.35);
      font: 12px/1.2 "Segoe UI", Arial, sans-serif;
      pointer-events: none;
    }

    #${ROOT_ID}[data-tone="warn"] {
      background: rgba(146, 64, 14, 0.94);
    }

    #${ROOT_ID} .augment-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      padding: 0 8px;
      border-radius: 999px;
      background: rgba(96, 165, 250, 0.25);
      color: #bfdbfe;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    #${ROOT_ID} .augment-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #${MENU_ID} {
      position: fixed;
      min-width: 280px;
      max-width: min(360px, calc(100vw - 20px));
      background: rgba(17, 24, 39, 0.98);
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 10px;
      box-shadow: 0 14px 36px rgba(2, 6, 23, 0.55);
      color: #e2e8f0;
      font: 13px/1.3 "Segoe UI", Arial, sans-serif;
      z-index: 2147483647;
      padding: 8px;
      display: none;
      user-select: none;
    }

    #${MENU_ID}[data-open="true"] {
      display: block;
    }

    #${MENU_ID} .ctx-coords {
      display: grid;
      gap: 3px;
      margin-bottom: 8px;
      padding: 6px 8px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.18);
      color: #cbd5e1;
      font-size: 12px;
    }

    #${MENU_ID} .ctx-sep {
      border-top: 1px solid rgba(148, 163, 184, 0.2);
      margin: 6px 0;
    }

    #${MENU_ID} .ctx-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #f8fafc;
      text-align: left;
      font: inherit;
      padding: 8px;
      cursor: pointer;
    }

    #${MENU_ID} .ctx-item:hover:not(:disabled),
    #${MENU_ID} .ctx-item:focus-visible:not(:disabled) {
      outline: none;
      background: rgba(96, 165, 250, 0.2);
    }

    #${MENU_ID} .ctx-item:disabled {
      opacity: 0.45;
      cursor: default;
    }

    #${MENU_ID} .ctx-icon {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    #${MENU_ID} .ctx-item[data-kind="line"] .ctx-line-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #f59e0b;
      flex-shrink: 0;
    }

    #${MENU_ID} .ctx-item[data-kind="line"][data-active="true"] .ctx-line-dot {
      background: #10b981;
    }

  `;

  const parent = document.head || document.documentElement;
  parent.appendChild(style);
}

function ensureBadge(): HTMLDivElement | null {
  if (!document.body) return null;

  let badge = document.getElementById(ROOT_ID) as HTMLDivElement | null;
  if (badge) return badge;

  badge = document.createElement("div");
  badge.id = ROOT_ID;
  badge.innerHTML = `
    <span class="augment-pill">TS</span>
    <span class="augment-text"></span>
  `;
  document.body.appendChild(badge);
  return badge;
}

function updateBadge(message: string, tone: "ok" | "warn" = "ok") {
  ensureStyles();
  const badge = ensureBadge();
  if (!badge) return;

  badge.dataset.tone = tone;
  const text = badge.querySelector(".augment-text");
  if (text) text.textContent = message;
}

function ensureContextMenu(): HTMLDivElement | null {
  if (!document.body) return null;

  let menu = document.getElementById(MENU_ID) as HTMLDivElement | null;
  if (menu) return menu;

  menu = document.createElement("div");
  menu.id = MENU_ID;
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <div class="ctx-coords" aria-label="Coordinates">
      <div data-role="coord-x">X: unavailable</div>
      <div data-role="coord-y">Y: unavailable</div>
    </div>
    <div class="ctx-sep"></div>
    <button type="button" class="ctx-item" data-action="google" data-kind="google" role="menuitem">
      <img class="ctx-icon" alt="" src="https://www.google.com/favicon.ico" />
      <span>View in Google Maps</span>
    </button>
    <button type="button" class="ctx-item" data-action="toggle-line" data-kind="line" data-active="false" role="menuitem">
      <span class="ctx-line-dot" aria-hidden="true"></span>
      <span data-role="line-label">Start line</span>
    </button>
  `;
  document.body.appendChild(menu);
  return menu;
}

function findPrimaryMapHost(): Element | null {
  const selectors = ["canvas", "#map", "[id*='map']", "[class*='map']", "main"];

  for (const selector of selectors) {
    const match = document.querySelector(selector);
    if (match) return match;
  }

  return document.body;
}

function collectMapTargets(): EventTarget[] {
  const targets = new Set<EventTarget>();
  const selectors = ["canvas", "#map", "[id*='map']", "[class*='map']", "main"];

  targets.add(document);
  targets.add(document.documentElement);

  for (const selector of selectors) {
    for (const node of document.querySelectorAll(selector)) {
      targets.add(node);
    }
  }

  for (const frame of document.querySelectorAll("iframe")) {
    try {
      const frameDoc = frame.contentDocument;
      if (!frameDoc) continue;
      targets.add(frameDoc);
      targets.add(frameDoc.documentElement);
      for (const selector of selectors) {
        for (const node of frameDoc.querySelectorAll(selector)) {
          targets.add(node);
        }
      }
    } catch {
      // Cross-origin frame; cannot access internals.
    }
  }

  return Array.from(targets);
}

function describeTarget(): string {
  const target = findPrimaryMapHost();
  if (!target) return "page";
  const element = target as HTMLElement;
  if (element.id) return `#${element.id}`;
  if (element.classList.length > 0) return `.${element.classList[0]}`;
  return element.tagName.toLowerCase();
}

function waitForElement(selectors: string | string[], timeoutMs = 15000): Promise<Element> {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];

  for (const selector of selectorList) {
    const match = document.querySelector(selector);
    if (match) return Promise.resolve(match);
  }

  return new Promise((resolve, reject) => {
    let done = false;
    let timeoutHandle: number | undefined;

    const finish = (value?: Element, error?: Error) => {
      if (done) return;
      done = true;
      observer.disconnect();
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
      if (error) reject(error);
      else if (value) resolve(value);
    };

    const observer = new MutationObserver(() => {
      for (const selector of selectorList) {
        const match = document.querySelector(selector);
        if (match) {
          finish(match);
          return;
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    timeoutHandle = window.setTimeout(() => {
      finish(undefined, new Error(`Timed out waiting for ${selectorList.join(", ")}`));
    }, timeoutMs);
  });
}

function toBng(lat: number, lon: number): BngPoint | null {
  try {
    const [x, y] = proj4("EPSG:4326", EPSG_27700, [lon, lat]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  } catch {
    return null;
  }
}

function roundBng(value: number): number {
  return Math.round(value);
}

function getNumericPair(candidate: unknown): { lat: number; lon: number } | null {
  if (!candidate || typeof candidate !== "object") return null;
  const source = candidate as Record<string, unknown>;

  const fromMethods =
    typeof source.lat === "function" && typeof source.lng === "function"
      ? { lat: Number((source.lat as () => unknown)()), lon: Number((source.lng as () => unknown)()) }
      : null;
  if (fromMethods && Number.isFinite(fromMethods.lat) && Number.isFinite(fromMethods.lon)) {
    return fromMethods;
  }

  const latCandidates = [source.lat, source.latitude];
  const lonCandidates = [source.lng, source.lon, source.longitude, source.lnglat && (source.lnglat as any).lng];

  for (const latValue of latCandidates) {
    for (const lonValue of lonCandidates) {
      const lat = Number(latValue);
      const lon = Number(lonValue);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon };
      }
    }
  }

  return null;
}

function getScribbleBaseMap(): Record<string, unknown> | null {
  const now = Date.now();
  if (now - scribbleBaseMapCacheAt < 2000 && scribbleBaseMapCache) {
    return scribbleBaseMapCache as Record<string, unknown>;
  }

  const windowLike = window as unknown as Record<string, unknown>;
  const sm = windowLike.sm as Record<string, unknown> | undefined;
  if (!sm || typeof sm.getBaseAPIMap !== "function") {
    scribbleBaseMapCache = null;
    scribbleBaseMapCacheAt = now;
    return null;
  }

  try {
    const baseMap = (sm.getBaseAPIMap as () => unknown)();
    if (baseMap && (typeof baseMap === "object" || typeof baseMap === "function")) {
      scribbleBaseMapCache = baseMap;
      scribbleBaseMapCacheAt = now;
      return baseMap as Record<string, unknown>;
    }
  } catch {
    // Ignore and continue with fallbacks.
  }

  scribbleBaseMapCache = null;
  scribbleBaseMapCacheAt = now;
  return null;
}

function isLatLonInRange(lat: number, lon: number): boolean {
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

function webMercatorToLatLon(x: number, y: number): { lat: number; lon: number } | null {
  const originShift = 20037508.34;
  const lon = (x / originShift) * 180;
  let lat = (y / originShift) * 180;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !isLatLonInRange(lat, lon)) return null;
  return { lat, lon };
}

function parseCoordinatePair(first: number, second: number): { lat: number; lon: number } | null {
  if (!Number.isFinite(first) || !Number.isFinite(second)) return null;

  if (Math.abs(first) <= 180 && Math.abs(second) <= 90) {
    return { lat: second, lon: first };
  }
  if (Math.abs(first) <= 90 && Math.abs(second) <= 180) {
    return { lat: first, lon: second };
  }
  return webMercatorToLatLon(first, second);
}

function parseLatLonLike(candidate: unknown): { lat: number; lon: number } | null {
  const direct = getNumericPair(candidate);
  if (direct && isLatLonInRange(direct.lat, direct.lon)) return direct;

  if (Array.isArray(candidate) && candidate.length >= 2) {
    return parseCoordinatePair(Number(candidate[0]), Number(candidate[1]));
  }

  if (!candidate || typeof candidate !== "object") return null;
  const source = candidate as Record<string, unknown>;

  if (Array.isArray(source.coordinates) && source.coordinates.length >= 2) {
    const parsed = parseCoordinatePair(Number(source.coordinates[0]), Number(source.coordinates[1]));
    if (parsed) return parsed;
  }

  if (source.geometry && typeof source.geometry === "object") {
    const geometry = source.geometry as Record<string, unknown>;
    if (Array.isArray(geometry.coordinates) && geometry.coordinates.length >= 2) {
      const parsed = parseCoordinatePair(Number(geometry.coordinates[0]), Number(geometry.coordinates[1]));
      if (parsed) return parsed;
    }
  }

  if ("x" in source && "y" in source) {
    const parsed = parseCoordinatePair(Number(source.x), Number(source.y));
    if (parsed) return parsed;
  }

  return null;
}

function readLatLonFromPath(event: Event): { lat: number; lon: number } | null {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  for (const item of path) {
    const direct = getNumericPair(item);
    if (direct) return direct;
    if (item && typeof item === "object" && "dataset" in item) {
      const dataset = (item as HTMLElement).dataset;
      if (!dataset) continue;
      const lat = Number(dataset.lat ?? dataset.latitude);
      const lon = Number(dataset.lon ?? dataset.lng ?? dataset.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon };
      }
    }
  }
  return null;
}

function findReferenceElement(event: MouseEvent): HTMLElement | null {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  for (const item of path) {
    if (!(item instanceof HTMLElement)) continue;
    const rect = item.getBoundingClientRect();
    if (rect.width > 50 && rect.height > 50) return item;
  }
  const host = mapHost;
  if (host instanceof HTMLElement) return host;
  return document.documentElement;
}

function getLocalPixel(event: MouseEvent): { x: number; y: number } {
  const reference = findReferenceElement(event);
  const rect = reference?.getBoundingClientRect();
  if (!rect) return { x: event.clientX, y: event.clientY };
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function gatherProjectionCandidates(): unknown[] {
  const now = Date.now();
  if (now - projectionCacheAt < 2000 && projectionCache.length > 0) {
    return projectionCache;
  }

  const roots: unknown[] = [];
  const windowLike = window as unknown as Record<string, unknown>;
  const seedKeys = [
    "map",
    "scribblemaps",
    "ScribbleMapsAPIs",
    "ScribbleMapCore",
    "MapSingleton",
    "viewport"
  ];
  for (const key of seedKeys) {
    if (key in windowLike) roots.push(windowLike[key]);
  }
  for (const key of Object.keys(windowLike)) {
    if (!/(map|scribble|esri|arcgis|view)/i.test(key)) continue;
    roots.push(windowLike[key]);
    if (roots.length > 120) break;
  }

  const methodNames = [
    "containerPointToLatLng",
    "getCoordinateFromPixel",
    "getLonLatFromPixel",
    "pixelToLngLat",
    "unproject",
    "fromPointToLatLng",
    "screenToGeo",
    "pointToLatLng",
    "xyToLngLat",
    "toLatLng"
  ];

  const seen = new Set<unknown>();
  const queue: Array<{ value: unknown; depth: number }> = roots.map((value) => ({ value, depth: 0 }));
  const hits: unknown[] = [];

  while (queue.length > 0 && hits.length < 80) {
    const current = queue.shift();
    if (!current) break;
    const { value, depth } = current;
    if (!value || (typeof value !== "object" && typeof value !== "function")) continue;
    if (seen.has(value)) continue;
    seen.add(value);

    const source = value as Record<string, unknown>;
    if (methodNames.some((name) => typeof source[name] === "function")) {
      hits.push(value);
    }

    if (depth >= 2) continue;
    for (const [key, child] of Object.entries(source)) {
      if (!child || (typeof child !== "object" && typeof child !== "function")) continue;
      if (!/(map|view|proj|coord|geo|scribble|layer|engine)/i.test(key)) continue;
      queue.push({ value: child, depth: depth + 1 });
    }
  }

  projectionCache = hits;
  projectionCacheAt = now;
  return projectionCache;
}

function callProjectionMethod(
  source: Record<string, unknown>,
  methodName: string,
  localX: number,
  localY: number,
  event: MouseEvent
): { lat: number; lon: number } | null {
  const method = source[methodName];
  if (typeof method !== "function") return null;
  const fn = method as (...args: any[]) => unknown;

  const argSets: any[][] = [
    [[localX, localY]],
    [{ x: localX, y: localY }],
    [localX, localY],
    [{ clientX: event.clientX, clientY: event.clientY, x: localX, y: localY }]
  ];

  for (const args of argSets) {
    try {
      const result = fn.apply(source, args);
      const parsed = parseLatLonLike(result);
      if (parsed) return parsed;
    } catch {
      // Try next shape.
    }
  }

  return null;
}

function extractLatLonFromProjection(event: MouseEvent): { lat: number; lon: number } | null {
  const { x, y } = getLocalPixel(event);
  const methodNames = [
    "containerPointToLatLng",
    "getCoordinateFromPixel",
    "getLonLatFromPixel",
    "pixelToLngLat",
    "unproject",
    "fromPointToLatLng",
    "screenToGeo",
    "pointToLatLng",
    "xyToLngLat",
    "toLatLng"
  ];

  for (const candidate of gatherProjectionCandidates()) {
    if (!candidate || (typeof candidate !== "object" && typeof candidate !== "function")) continue;
    const source = candidate as Record<string, unknown>;

    for (const methodName of methodNames) {
      const parsed = callProjectionMethod(source, methodName, x, y, event);
      if (parsed) return parsed;
    }
  }

  return null;
}

function extractLatLonFromScribbleBaseMap(event: MouseEvent): { lat: number; lon: number } | null {
  const baseMap = getScribbleBaseMap();
  if (!baseMap) return null;

  const mouseEventToLatLng = baseMap.mouseEventToLatLng;
  if (typeof mouseEventToLatLng === "function") {
    try {
      const result = (mouseEventToLatLng as (ev: MouseEvent) => unknown).call(baseMap, event);
      const parsed = parseLatLonLike(result);
      if (parsed) return parsed;
    } catch {
      // Fall through.
    }
  }

  const mouseEventToContainerPoint = baseMap.mouseEventToContainerPoint;
  const containerPointToLatLng = baseMap.containerPointToLatLng;
  if (typeof mouseEventToContainerPoint === "function" && typeof containerPointToLatLng === "function") {
    try {
      const point = (mouseEventToContainerPoint as (ev: MouseEvent) => unknown).call(baseMap, event);
      const result = (containerPointToLatLng as (pt: unknown) => unknown).call(baseMap, point);
      const parsed = parseLatLonLike(result);
      if (parsed) return parsed;
    } catch {
      // Fall through.
    }
  }

  if (typeof containerPointToLatLng === "function") {
    const { x, y } = getLocalPixel(event);
    try {
      const result = (containerPointToLatLng as (pt: unknown) => unknown).call(baseMap, { x, y });
      const parsed = parseLatLonLike(result);
      if (parsed) return parsed;
    } catch {
      // Fall through.
    }
  }

  return null;
}

function extractLatLon(event: MouseEvent): { lat: number; lon: number } | null {
  const fromEvent = getNumericPair(event as unknown);
  if (fromEvent) return fromEvent;

  const detail = getNumericPair((event as unknown as { detail?: unknown }).detail);
  if (detail) return detail;

  const latLng = getNumericPair((event as unknown as { latLng?: unknown }).latLng);
  if (latLng) return latLng;

  const fromScribbleBaseMap = extractLatLonFromScribbleBaseMap(event);
  if (fromScribbleBaseMap) return fromScribbleBaseMap;

  const fromPath = readLatLonFromPath(event);
  if (fromPath) return fromPath;

  return extractLatLonFromProjection(event);
}

function toGeoPoint(event: MouseEvent): GeoPoint | null {
  const coords = extractLatLon(event);
  if (!coords) return null;
  return {
    lat: coords.lat,
    lon: coords.lon,
    clientX: event.clientX,
    clientY: event.clientY
  };
}

function getMenuElements() {
  const menu = ensureContextMenu();
  if (!menu) return null;
  const coordX = menu.querySelector("[data-role='coord-x']") as HTMLElement | null;
  const coordY = menu.querySelector("[data-role='coord-y']") as HTMLElement | null;
  const googleBtn = menu.querySelector("[data-action='google']") as HTMLButtonElement | null;
  const lineBtn = menu.querySelector("[data-action='toggle-line']") as HTMLButtonElement | null;
  const lineLabel = menu.querySelector("[data-role='line-label']") as HTMLElement | null;

  if (!coordX || !coordY || !googleBtn || !lineBtn || !lineLabel) return null;
  return { menu, coordX, coordY, googleBtn, lineBtn, lineLabel };
}

function updateMenuContent() {
  const refs = getMenuElements();
  if (!refs) return;

  if (lastContextBng) {
    refs.coordX.textContent = `X: ${roundBng(lastContextBng.x)}`;
    refs.coordY.textContent = `Y: ${roundBng(lastContextBng.y)}`;
  } else {
    refs.coordX.textContent = "X: unavailable";
    refs.coordY.textContent = "Y: unavailable";
  }

  refs.googleBtn.disabled = !lastContextPoint;
  refs.lineBtn.dataset.active = drawModeActive ? "true" : "false";
  refs.lineLabel.textContent = drawModeActive ? "Stop line" : "Start line";
  refs.lineBtn.disabled = !drawModeActive && !lastContextPoint;
}

function showContextMenu(clientX: number, clientY: number) {
  const refs = getMenuElements();
  if (!refs) return;
  updateMenuContent();

  refs.menu.dataset.open = "true";
  menuVisible = true;

  const menuRect = refs.menu.getBoundingClientRect();
  const maxX = window.innerWidth - menuRect.width - MENU_MARGIN;
  const maxY = window.innerHeight - menuRect.height - MENU_MARGIN;
  const left = Math.max(MENU_MARGIN, Math.min(clientX, maxX));
  const top = Math.max(MENU_MARGIN, Math.min(clientY, maxY));

  refs.menu.style.left = `${left}px`;
  refs.menu.style.top = `${top}px`;
}

function hideContextMenu() {
  const refs = getMenuElements();
  if (!refs) return;
  refs.menu.dataset.open = "false";
  menuVisible = false;
}

function clonePoint(point: GeoPoint): GeoPoint {
  return {
    lat: point.lat,
    lon: point.lon,
    clientX: point.clientX,
    clientY: point.clientY
  };
}

function sameLocation(a: GeoPoint, b: GeoPoint): boolean {
  return Math.abs(a.lat - b.lat) < 0.0000001 && Math.abs(a.lon - b.lon) < 0.0000001;
}

function appendLinePoint(point: GeoPoint) {
  const tail = activeLinePoints[activeLinePoints.length - 1];
  if (!tail || !sameLocation(tail, point)) {
    activeLinePoints.push(clonePoint(point));
  }
}

function renderLineOverlay() {
  const baseMap = getScribbleBaseMap();
  if (!baseMap) {
    clearNativeLeafletOverlay();
    return;
  }
  if (!renderNativeLeafletOverlay(baseMap)) {
    clearNativeLeafletOverlay();
  }
}

function canRenderNativeLeaflet(baseMap: Record<string, unknown> | null): boolean {
  if (!baseMap) return false;
  const windowLike = window as unknown as Record<string, unknown>;
  const leaflet = windowLike.L as Record<string, unknown> | undefined;
  if (!leaflet || typeof leaflet.polyline !== "function") return false;
  return typeof baseMap.addLayer === "function" && typeof baseMap.removeLayer === "function";
}

function clearNativeLeafletOverlay() {
  if (!nativeLeafletMap || nativeLeafletLayers.length === 0) {
    nativeLeafletMap = null;
    nativeLeafletLayers = [];
    return;
  }

  const removeLayer = nativeLeafletMap.removeLayer;
  if (typeof removeLayer === "function") {
    for (const layer of nativeLeafletLayers) {
      try {
        (removeLayer as (layer: unknown) => void).call(nativeLeafletMap, layer);
      } catch {
        // Ignore missing/removed layers during cleanup.
      }
    }
  }

  nativeLeafletMap = null;
  nativeLeafletLayers = [];
}

function renderNativeLeafletOverlay(baseMap: Record<string, unknown>): boolean {
  if (!canRenderNativeLeaflet(baseMap)) return false;

  const windowLike = window as unknown as Record<string, unknown>;
  const leaflet = windowLike.L as Record<string, unknown>;
  const polylineFactory = leaflet.polyline as (
    latLngs: Array<[number, number]>,
    options: Record<string, unknown>
  ) => unknown;
  const addLayer = baseMap.addLayer as (layer: unknown) => void;
  const removeLayer = baseMap.removeLayer as (layer: unknown) => void;

  const nextLayers: unknown[] = [];
  const createLayer = (points: GeoPoint[], state: "active" | "final") => {
    if (points.length < 2) return;
    const latLngs: Array<[number, number]> = points.map((point) => [point.lat, point.lon]);
    const layer = polylineFactory(latLngs, {
      color: state === "active" ? "#f59e0b" : "#ff00ff",
      weight: 3,
      opacity: state === "active" ? 1 : 0.9,
      lineJoin: "round",
      lineCap: "round",
      dashArray: state === "active" ? "8 6" : undefined
    });
    addLayer.call(baseMap, layer);
    nextLayers.push(layer);
  };

  for (const line of completedLinePoints) {
    createLayer(line, "final");
  }
  if (drawModeActive) {
    createLayer(activeLinePoints, "active");
  }

  const previousMap = nativeLeafletMap;
  const previousLayers = nativeLeafletLayers;
  if (previousMap && typeof previousMap.removeLayer === "function") {
    for (const layer of previousLayers) {
      try {
        (previousMap.removeLayer as (layer: unknown) => void).call(previousMap, layer);
      } catch {
        // Ignore if already removed.
      }
    }
  } else if (typeof removeLayer === "function") {
    for (const layer of previousLayers) {
      try {
        removeLayer.call(baseMap, layer);
      } catch {
        // Ignore if already removed.
      }
    }
  }

  nativeLeafletMap = baseMap;
  nativeLeafletLayers = nextLayers;
  return true;
}

function unbindBaseMapRenderEvents() {
  // Native Leaflet layers follow map transforms without manual redraw hooks.
}

function bindBaseMapRenderEvents() {
  // Kept for call-site stability. No-op in native-only mode.
}

function startLine() {
  if (!lastContextPoint) return;
  drawModeActive = true;
  activeLinePoints = [clonePoint(lastContextPoint)];
  updateMenuContent();
  renderLineOverlay();
}

function stopLine() {
  if (!drawModeActive) return;

  const tail = activeLinePoints[activeLinePoints.length - 1];
  if (lastContextPoint && (!tail || !sameLocation(tail, lastContextPoint))) {
    appendLinePoint(lastContextPoint);
  }

  const finalizedLine = activeLinePoints.map(clonePoint);
  drawModeActive = false;
  activeLinePoints = [];

  if (finalizedLine.length >= 2) {
    completedLinePoints.push(finalizedLine);
    const shape = {
      type: "LineString",
      coordinates: finalizedLine.map((point) => [point.lon, point.lat])
    };
    console.log("New line shape", shape);
  }

  updateMenuContent();
  renderLineOverlay();
}

function openInGoogleMaps() {
  if (!lastContextPoint) return;
  const url = `https://maps.google.com?q=${lastContextPoint.lat},${lastContextPoint.lon}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function handleMenuClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  const actionNode = target?.closest("[data-action]") as HTMLElement | null;
  if (!actionNode) return;

  const action = actionNode.dataset.action;
  if (action === "google") {
    openInGoogleMaps();
    hideContextMenu();
    return;
  }

  if (action === "toggle-line") {
    if (drawModeActive) {
      stopLine();
    } else {
      startLine();
    }
    hideContextMenu();
  }
}

function processMiddleClick(event: MouseEvent) {
  if (!drawModeActive || event.button !== 1) return;

  const fingerprint = `${event.type}:${event.clientX}:${event.clientY}:${Math.floor(event.timeStamp)}`;
  if (lastMiddleCapture === fingerprint) return;
  lastMiddleCapture = fingerprint;

  const point = toGeoPoint(event);
  if (!point) return;

  appendLinePoint(point);
  renderLineOverlay();
  event.preventDefault();
  event.stopPropagation();
}

function handleMapContextMenu(event: MouseEvent) {
  event.preventDefault();

  const updateContextPoint = () => {
    const point = toGeoPoint(event);
    lastContextPoint = point ? clonePoint(point) : null;
    lastContextBng = point ? toBng(point.lat, point.lon) : null;
    updateMenuContent();
  };

  updateContextPoint();
  if (!lastContextPoint) {
    window.setTimeout(updateContextPoint, 0);
  }

  showContextMenu(event.clientX, event.clientY);
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!menuVisible) return;
  const menu = document.getElementById(MENU_ID);
  if (!menu) return;
  const target = event.target as Node | null;
  if (!target || !menu.contains(target)) {
    hideContextMenu();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    hideContextMenu();
  }
}

function handleWindowChanged() {
  hideContextMenu();
  renderLineOverlay();
}

function bindContextMenuEvents() {
  const menu = ensureContextMenu();
  if (!menu) return;
  menu.removeEventListener("click", handleMenuClick as EventListener);
  menu.addEventListener("click", handleMenuClick as EventListener);
}

function unbindMapHostEvents() {
  if (boundMapTargets.size === 0) {
    mapHost = null;
    return;
  }

  for (const target of boundMapTargets) {
    target.removeEventListener("contextmenu", handleMapContextMenu as EventListener, true);
    target.removeEventListener("mousedown", processMiddleClick as EventListener, true);
    target.removeEventListener("auxclick", processMiddleClick as EventListener, true);
  }

  boundMapTargets.clear();
  mapHost = null;
}

function bindMapHostEvents() {
  mapHost = findPrimaryMapHost();
  bindBaseMapRenderEvents();

  const nextTargets = new Set<EventTarget>(collectMapTargets());
  if (mapHost) {
    nextTargets.add(mapHost);
  }

  const sameSize = nextTargets.size === boundMapTargets.size;
  let unchanged = sameSize;
  if (unchanged) {
    for (const target of nextTargets) {
      if (!boundMapTargets.has(target)) {
        unchanged = false;
        break;
      }
    }
  }
  if (unchanged) return;

  unbindMapHostEvents();

  for (const target of nextTargets) {
    target.addEventListener("contextmenu", handleMapContextMenu as EventListener, true);
    target.addEventListener("mousedown", processMiddleClick as EventListener, true);
    target.addEventListener("auxclick", processMiddleClick as EventListener, true);
    boundMapTargets.add(target);
  }
}

function resetState() {
  drawModeActive = false;
  lastContextPoint = null;
  lastContextBng = null;
  activeLinePoints = [];
  completedLinePoints = [];
  menuVisible = false;
  lastMiddleCapture = "";
  scribbleBaseMapCache = null;
  scribbleBaseMapCacheAt = 0;
  clearNativeLeafletOverlay();
}

async function mount() {
  await whenDocumentReady();
  ensureStyles();
  ensureBadge();
  ensureContextMenu();
  bindContextMenuEvents();

  try {
    await waitForElement(["canvas", "#map", "[id*='map']", "[class*='map']", "main"], 15000);
  } catch {
    // Keep running even if we cannot find the host early.
  }
  bindMapHostEvents();
  bindBaseMapRenderEvents();

  document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
  document.addEventListener("pointerdown", handleDocumentPointerDown, true);
  document.removeEventListener("keydown", handleKeyDown, true);
  document.addEventListener("keydown", handleKeyDown, true);
  window.removeEventListener("resize", handleWindowChanged);
  window.addEventListener("resize", handleWindowChanged);
  window.removeEventListener("scroll", handleWindowChanged, true);
  window.addEventListener("scroll", handleWindowChanged, true);

  const message = hostAvailable()
    ? `Augment active on ${describeTarget()}`
    : `Augment active (host bridge unavailable)`;

  updateBadge(message, hostAvailable() ? "ok" : "warn");
  updateMenuContent();
  renderLineOverlay();
  document.documentElement.dataset.augmentPylonMap = "ready";

  if (domObserver) domObserver.disconnect();
  domObserver = new MutationObserver(() => {
    if (!document.getElementById(ROOT_ID)) {
      updateBadge(message, hostAvailable() ? "ok" : "warn");
    }
    if (!document.getElementById(MENU_ID)) {
      ensureContextMenu();
      bindContextMenuEvents();
      updateMenuContent();
    }
    bindMapHostEvents();
  });
  domObserver.observe(document.documentElement, { childList: true, subtree: true });
}

function destroy() {
  if (domObserver) {
    domObserver.disconnect();
    domObserver = null;
  }

  unbindMapHostEvents();
  unbindBaseMapRenderEvents();
  document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
  document.removeEventListener("keydown", handleKeyDown, true);
  window.removeEventListener("resize", handleWindowChanged);
  window.removeEventListener("scroll", handleWindowChanged, true);

  document.getElementById(ROOT_ID)?.remove();
  document.getElementById(MENU_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  resetState();
  delete document.documentElement.dataset.augmentPylonMap;
  delete window.__augmentPylonMap__;
}

const existingRuntime = window.__augmentPylonMap__;

if (existingRuntime) {
  void existingRuntime.refresh();
} else {
  window.__augmentPylonMap__ = {
    version: VERSION,
    startedAt: new Date().toISOString(),
    hostAvailable,
    callHost,
    waitForElement,
    refresh: mount,
    destroy
  };

  void mount();
}
