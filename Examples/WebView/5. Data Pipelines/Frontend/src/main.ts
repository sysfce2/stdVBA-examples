import { ClassicPreset, NodeEditor } from "rete";
import { AreaPlugin } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { LitPlugin, Presets as LitPresets } from "@retejs/lit-plugin";
import { getDOMSocketPosition } from "rete-render-utils";
import { getRoute, setRoute } from "./router";

type HostPipelineSummary = { id: string; name: string; updatedAt?: string };
type NodeConfig = { type: string; params: Record<string, any> };
type JoinBinding = { alias: string; returnOne: boolean; rightFields: string[] };
type LambdaCompletionContext = { rowFields: string[]; joins: JoinBinding[] };
type RenamePair = { from: string; to: string };

const defaultPipeline = {
  schemaVersion: 1,
  nodes: [] as any[],
  connections: [] as any[]
};

const state = {
  editor: null as any,
  area: null as any,
  nodeConfigs: new Map<string, NodeConfig>(),
  selectedNodeId: "",
  configPanelOpen: false,
  suppressGraphConfigRefresh: false,
  pipelineId: "",
  pipelines: [] as HostPipelineSummary[],
  workbookTables: [] as { name: string; sheet: string }[],
  workbookSheets: [] as string[],
  contextMenuPos: { x: 200, y: 150 },
  contextMenuNodeId: "",
  lastPreviewRows: [] as Record<string, any>[]
};

const tableSocket = new ClassicPreset.Socket("table");

const nodeTypes = [
  { value: "source.table",        label: "Get Excel Table" },
  { value: "source.range",        label: "Get Excel Range" },
  { value: "source.csv",          label: "Get CSV" },
  { value: "source.json",         label: "Get JSON" },
  { value: "transform.filter",    label: "Filter" },
  { value: "transform.reverse",   label: "Reverse" },
  { value: "transform.unique",    label: "Unique" },
  { value: "transform.forEach",   label: "ForEach" },
  { value: "transform.fieldAdd",  label: "Field Add" },
  { value: "transform.fieldUpdate", label: "Field Update" },
  { value: "transform.fieldUpdateStatic", label: "Field Update Static" },
  { value: "transform.fieldExpand", label: "Field Expand" },
  { value: "transform.select",    label: "Select Fields" },
  { value: "transform.fieldsRemove", label: "Remove Fields" },
  { value: "transform.fieldsRename", label: "Rename Fields" },
  { value: "transform.join",      label: "Join" },
  { value: "transform.concat",    label: "Concat" },
  { value: "transform.clone",     label: "Clone" },
  { value: "transform.groupBy",   label: "Group By Field" },
  { value: "transform.groupByKey", label: "Group By Key" },
  { value: "sink.exportTable",    label: "Export To Table" },
  { value: "sink.exportCsv",      label: "Export To CSV" },
  { value: "sink.exportJson",     label: "Export To JSON" },
  { value: "sink.preview",        label: "Preview" }
];

function isSourceNode(type: string) {
  return type.startsWith("source.");
}

function isSinkNode(type: string) {
  return type.startsWith("sink.");
}

function fileBaseName(path: string): string {
  const normalized = String(path || "").replace(/\\/g, "/").trim();
  const parts = normalized.split("/");
  return parts[parts.length - 1] || "";
}

// ── DOM helpers ──────────────────────────────────────────

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  if (!el) throw new Error(`Missing element: ${id}`);
  return el;
}

async function callHost<T = any>(method: string, ...args: any[]): Promise<T> {
  const bridge = (window as any)?.chrome?.webview?.hostObjects?.vba;
  if (!bridge || typeof bridge[method] !== "function") {
    throw new Error(`Host method not available: ${method}`);
  }
  const result = bridge[method](...args);
  return await Promise.resolve(result);
}

/** Yield after a native file dialog so the host can read the chosen path reliably. */
function yieldToHost() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function setStatus(message: string, isError = false) {
  const text = byId<HTMLSpanElement>("statusText");
  text.textContent = message;
  const bar = byId<HTMLDivElement>("status");
  if (isError) bar.classList.add("error");
  else bar.classList.remove("error");
}

// ── View management ──────────────────────────────────────

function showView(name: "home" | "editor") {
  byId("homeView").style.display   = name === "home"   ? "" : "none";
  byId("editorView").style.display = name === "editor" ? "" : "none";
}

// ── Config panel ─────────────────────────────────────────

function showConfigPanel(open: boolean) {
  const panel = byId<HTMLDivElement>("configPanel");
  if (open) panel.classList.add("open");
  else panel.classList.remove("open");
  state.configPanelOpen = open;
}

let disposeConfigPanelEditors: (() => void) | null = null;

function disposeNodeConfigEditors() {
  if (!disposeConfigPanelEditors) return;
  disposeConfigPanelEditors();
  disposeConfigPanelEditors = null;
}

// ── Context menu ─────────────────────────────────────────

function contextMenuSections(): HTMLElement[] {
  return [
    byId<HTMLDivElement>("contextMenuNodeActions"),
    byId<HTMLDivElement>("contextMenuAddNodes")
  ];
}

function resetContextMenuFilter() {
  const menu = byId<HTMLDivElement>("contextMenu");
  menu.querySelectorAll(".ctx-item").forEach((item) => {
    item.classList.remove("ctx-item-hidden");
  });
  menu.querySelectorAll(".ctx-group, .ctx-divider").forEach((el) => {
    el.classList.remove("ctx-group-hidden", "ctx-divider-hidden");
  });
}

function updateContextMenuDividers(container: HTMLElement) {
  const children = Array.from(container.children);
  const isVisibleGroup = (el: Element | undefined) =>
    !!el?.classList.contains("ctx-group") && !el.classList.contains("ctx-group-hidden");

  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (!el.classList.contains("ctx-divider")) continue;

    let prevGroup: Element | undefined;
    for (let j = i - 1; j >= 0; j--) {
      if (children[j].classList.contains("ctx-group")) {
        prevGroup = children[j];
        break;
      }
    }
    let nextGroup: Element | undefined;
    for (let j = i + 1; j < children.length; j++) {
      if (children[j].classList.contains("ctx-group")) {
        nextGroup = children[j];
        break;
      }
    }
    el.classList.toggle(
      "ctx-divider-hidden",
      !isVisibleGroup(prevGroup) || !isVisibleGroup(nextGroup)
    );
  }
}

function applyContextMenuFilter(query?: string) {
  const q = (query ?? byId<HTMLInputElement>("contextMenuSearch").value).trim().toLowerCase();

  for (const section of contextMenuSections()) {
    if (section.style.display === "none") continue;

    section.querySelectorAll<HTMLElement>(".ctx-item").forEach((item) => {
      const label = item.textContent?.trim().toLowerCase() ?? "";
      item.classList.toggle("ctx-item-hidden", !!q && !label.includes(q));
    });

    section.querySelectorAll<HTMLElement>(".ctx-group").forEach((group) => {
      const hasVisible = Array.from(group.querySelectorAll(".ctx-item")).some(
        (item) => !item.classList.contains("ctx-item-hidden")
      );
      group.classList.toggle("ctx-group-hidden", !hasVisible);
    });

    if (section.id === "contextMenuAddNodes") {
      updateContextMenuDividers(section);
    }
  }
}

function positionContextMenu(menu: HTMLDivElement, clientX: number, clientY: number) {
  const menuW = menu.offsetWidth || 200;
  const menuH = menu.offsetHeight || 280;
  const x = clientX + menuW > window.innerWidth ? window.innerWidth - menuW - 8 : clientX;
  const y = clientY + menuH > window.innerHeight ? window.innerHeight - menuH - 8 : clientY;
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
}

function showContextMenu(clientX: number, clientY: number, mode: "add" | "node") {
  const menu = byId<HTMLDivElement>("contextMenu");
  const search = byId<HTMLInputElement>("contextMenuSearch");
  const nodeActions = byId<HTMLDivElement>("contextMenuNodeActions");
  const addNodes = byId<HTMLDivElement>("contextMenuAddNodes");

  search.value = "";
  resetContextMenuFilter();

  nodeActions.style.display = mode === "node" ? "" : "none";
  addNodes.style.display = mode === "add" ? "" : "none";
  menu.setAttribute("aria-label", mode === "node" ? "Node actions" : "Add node");
  menu.style.display = "flex";

  requestAnimationFrame(() => {
    positionContextMenu(menu, clientX, clientY);
    search.focus({ preventScroll: true });
    search.select();
  });
}

function isNodeContextMenuTarget(event: MouseEvent) {
  const target = event.target as Element | null;
  return !!target?.closest("rete-node");
}

function hideContextMenu() {
  const menu = byId<HTMLDivElement>("contextMenu");
  menu.style.display = "none";
  const search = byId<HTMLInputElement>("contextMenuSearch");
  search.value = "";
  resetContextMenuFilter();
}

// ── Pipeline graph helpers ───────────────────────────────

function emptyGraph() {
  return JSON.parse(JSON.stringify(defaultPipeline));
}

function getDefaultParams(type: string): Record<string, any> {
  switch (type) {
    case "source.table":
      return { tableName: "", fields: [] as string[], workbookMode: "me", workbookPath: "" };
    case "source.range":
      return {
        sheetName: "",
        rangeAddress: "",
        headers: true,
        fields: [] as string[],
        workbookMode: "me",
        workbookPath: ""
      };
    case "source.csv":
    case "source.json":
      return { filePath: "", fields: [] as string[] };
    case "transform.fieldAdd":  return { fieldName: "", expression: "$1.FieldName" };
    case "transform.fieldUpdate": return { fieldName: "", expression: "$1.FieldName" };
    case "transform.fieldUpdateStatic": return { fieldName: "", value: "" };
    case "transform.fieldExpand": return { fieldName: "" };
    case "transform.join":      return { leftField: "", rightField: "", alias: "", returnOne: false };
    case "transform.groupBy":   return { fieldName: "", virtualName: "group" };
    case "transform.groupByKey": return { expression: "$1.FieldName", keyName: "groupKey", virtualName: "group" };
    case "transform.forEach": return { expression: "let $1.item(\"FieldName\") = $1.item(\"FieldName\")" };
    case "transform.unique": return { expression: "$1.FieldName" };
    case "transform.fieldsRename": return { renames: [] as RenamePair[] };
    case "transform.reverse":
    case "transform.clone":
      return {};
    case "transform.concat":
      return {};
    case "transform.select":    return { fieldsCsv: "" };
    case "transform.fieldsRemove": return { fieldsCsv: "" };
    case "transform.filter":    return { expression: "$1.FieldName <> \"\"" };
    case "sink.exportTable":    return { sheetName: "", tableName: "", workbookMode: "me" };
    case "sink.exportCsv":
    case "sink.exportJson":
      return { filePath: "" };
    default: return {};
  }
}

function getNodePosition(nodeId: string): { x: number; y: number } | undefined {
  const view = state.area?.nodeViews?.get?.(String(nodeId));
  if (view?.position && typeof view.position.x === "number" && typeof view.position.y === "number") {
    return { x: view.position.x, y: view.position.y };
  }
  return undefined;
}

/** Node types whose table input comes from a connection, not the config panel. */
function hasWiredTableInput(type: string) {
  return type.startsWith("transform.");
}

function getNodeLabel(type: string) {
  return nodeTypes.find((n) => n.value === type)?.label ?? type;
}

function getNodeDisplayLabel(type: string, params?: Record<string, any>) {
  if (type === "source.table") {
    const tableName = String(params?.tableName || "").trim();
    return tableName ? `${getNodeLabel(type)} '${tableName}'` : getNodeLabel(type);
  }
  if (type === "source.range") {
    const sheetName = String(params?.sheetName || "").trim();
    const rangeAddress = String(params?.rangeAddress || "").trim();
    const target = [sheetName, rangeAddress].filter(Boolean).join("!");
    return target ? `${getNodeLabel(type)} '${target}'` : getNodeLabel(type);
  }
  if (type === "source.csv" || type === "source.json") {
    const name = fileBaseName(String(params?.filePath || ""));
    return name ? `${getNodeLabel(type)} '${name}'` : getNodeLabel(type);
  }
  if (type === "sink.exportCsv" || type === "sink.exportJson") {
    const name = fileBaseName(String(params?.filePath || ""));
    return name ? `${getNodeLabel(type)} '${name}'` : getNodeLabel(type);
  }
  return getNodeLabel(type);
}

/** Rete/Lit keeps the first node payload reference; inject a fresh label for canvas rendering. */
function withVisualNodeLabel(payload: any) {
  const nodeId = String(payload?.id ?? "");
  const cfg = state.nodeConfigs.get(nodeId);
  if (!cfg) return payload;
  const label = getNodeDisplayLabel(cfg.type, cfg.params);
  return Object.assign({}, payload, { label });
}

/** Rete only recalculates output sockets on resize; also refresh inputs when node height changes. */
let pipelineSocketPositionWatcher: ReturnType<typeof getDOMSocketPosition> | undefined;
let pipelineSocketResizePatchApplied = false;

function getPipelineSocketPositionWatcher() {
  if (!pipelineSocketPositionWatcher) {
    pipelineSocketPositionWatcher = getDOMSocketPosition();
  }
  return pipelineSocketPositionWatcher;
}

function patchSocketPositionWatcherForInputResize(watcher: ReturnType<typeof getDOMSocketPosition>) {
  if (pipelineSocketResizePatchApplied) return;
  const area = (watcher as any).area;
  if (!area) return;
  pipelineSocketResizePatchApplied = true;
  area.addPipe(async (context: any) => {
    if (context?.type !== "noderesized") return context;
    const nodeId = String(context.data?.id ?? "");
    if (!nodeId) return context;
    const sockets = (watcher as any).sockets;
    const items = sockets.snapshot().filter(
      (item: any) => item.nodeId === nodeId && item.side === "input"
    );
    await Promise.all(
      items.map(async (item: any) => {
        const position = await watcher.calculatePosition(nodeId, item.side, item.key, item.element);
        if (position) item.position = position;
      })
    );
    if (items.length > 0) {
      (watcher as any).emitter.emit({ nodeId });
    }
    return context;
  });
}

const nodeResizeObservers = new Map<string, ResizeObserver>();

function attachNodeResizeObserver(area: any, nodeId: string) {
  const host = area.nodeViews?.get?.(nodeId)?.element?.querySelector?.("rete-node") as HTMLElement | null;
  if (!host) return;

  let observer = nodeResizeObservers.get(nodeId);
  if (!observer) {
    observer = new ResizeObserver(() => {
      void area.emit({
        type: "noderesized",
        data: { id: nodeId, size: { width: host.offsetWidth, height: host.offsetHeight } }
      });
    });
    nodeResizeObservers.set(nodeId, observer);
  } else {
    observer.disconnect();
  }
  observer.observe(host);
}

function detachNodeResizeObserver(nodeId: string) {
  const observer = nodeResizeObservers.get(nodeId);
  if (!observer) return;
  observer.disconnect();
  nodeResizeObservers.delete(nodeId);
}

function setupNodeResizeSync(area: any) {
  area.addPipe((context: any) => {
    if (context?.type === "rendered" && context.data?.type === "node") {
      const nodeId = String(context.data.payload?.id ?? "");
      if (nodeId) attachNodeResizeObserver(area, nodeId);
    }
    if (context?.type === "noderemoved") {
      detachNodeResizeObserver(String(context.data?.id ?? ""));
    }
    return context;
  });
}

function createPipelineRenderPreset() {
  const socketPositionWatcher = getPipelineSocketPositionWatcher();
  const classic = LitPresets.classic.setup({ socketPositionWatcher });
  return {
    attach: (plugin: any) => {
      classic.attach?.(plugin);
      patchSocketPositionWatcherForInputResize(socketPositionWatcher);
    },
    render(context: any, plugin: any) {
      if (context?.data?.type === "node" && context.data.payload) {
        context = {
          ...context,
          data: { ...context.data, payload: withVisualNodeLabel(context.data.payload) }
        };
      }
      return classic.render(context, plugin);
    },
    update(context: any, plugin: any) {
      if (context?.data?.type === "node" && context.data.payload) {
        context = {
          ...context,
          data: { ...context.data, payload: withVisualNodeLabel(context.data.payload) }
        };
      }
      const result = classic.update(context, plugin);
      if (!result?.data || context?.data?.type !== "node") return result;
      return { ...result, data: withVisualNodeLabel(result.data) };
    }
  };
}

async function syncNodeDisplayLabel(nodeId: string) {
  const cfg = state.nodeConfigs.get(nodeId);
  if (!cfg?.type || !state.editor || !state.area) return;
  const node = (state.editor.getNodes() as any[]).find((n) => String(n.id) === nodeId);
  if (!node) return;
  const label = getNodeDisplayLabel(cfg.type, cfg.params);
  node.label = label;
  await state.area.update("node", nodeId);
  // Label changes grow the node; wait for layout then refresh connection anchors.
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  attachNodeResizeObserver(state.area, nodeId);
  await state.area.emit({
    type: "noderesized",
    data: { id: nodeId, size: { width: 0, height: 0 } }
  });
  if (state.selectedNodeId === nodeId) {
    byId<HTMLHeadingElement>("configPanelTitle").textContent = label;
  }
}

function getUpstreamNodeId(nodeId: string, input: "main" | "left" | "right"): string | undefined {
  const connections = state.editor?.getConnections?.() ?? [];
  const match = connections.find((conn: any) => {
    const targetId = String(typeof conn.target === "object" ? conn.target.id : conn.target);
    return targetId === String(nodeId) && String(conn.targetInput ?? "main") === input;
  });
  if (!match) return undefined;
  return String(typeof match.source === "object" ? match.source.id : match.source);
}

function parseCsvFields(csv: string): string[] {
  return String(csv || "")
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

function uniqueFields(fields: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const field of fields) {
    const key = String(field).trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function resolveInputTableName(nodeId: string, input: "main" | "left" | "right"): string {
  const upstreamId = getUpstreamNodeId(nodeId, input);
  if (!upstreamId) return "";
  return resolveNodeTableName(upstreamId);
}

function resolveNodeTableName(nodeId: string, visited = new Set<string>()): string {
  if (!nodeId || visited.has(nodeId)) return "";
  visited.add(nodeId);
  const cfg = state.nodeConfigs.get(nodeId);
  if (!cfg) return "";
  const { type, params } = cfg;
  if (type === "source.table") return String(params.tableName || "").trim();
  if (type === "source.range") {
    const sheet = String(params.sheetName || "").trim();
    const address = String(params.rangeAddress || "").trim();
    return [sheet, address].filter(Boolean).join("!");
  }
  if (type === "source.csv" || type === "source.json") return fileBaseName(String(params.filePath || ""));
  if (type === "transform.join") return resolveInputTableName(nodeId, "left");
  if (type === "transform.concat") return resolveInputTableName(nodeId, "main");
  if (type.startsWith("transform.")) return resolveInputTableName(nodeId, "main");
  return "";
}

function resolveJoinAlias(nodeId: string, params: Record<string, any>): string {
  const configured = String(params.alias || "").trim();
  if (configured) return configured;
  const inferred = resolveInputTableName(nodeId, "right");
  return inferred || "join";
}

function resolveNodeFields(nodeId: string, visited = new Set<string>()): string[] {
  if (!nodeId || visited.has(nodeId)) return [];
  visited.add(nodeId);

  const cfg = state.nodeConfigs.get(nodeId);
  if (!cfg) return [];
  const { type, params } = cfg;

  switch (type) {
    case "source.table":
      return uniqueFields(Array.isArray(params.fields) ? params.fields.map(String) : []);
    case "source.range":
    case "source.csv":
    case "source.json":
      return uniqueFields(Array.isArray(params.fields) ? params.fields.map(String) : []);
    case "transform.fieldAdd": {
      const upstreamId = getUpstreamNodeId(nodeId, "main");
      const fields = resolveNodeFields(String(upstreamId || ""), visited);
      const newField = String(params.fieldName || "").trim();
      if (newField && !fields.includes(newField)) fields.push(newField);
      return uniqueFields(fields);
    }
    case "transform.fieldUpdate":
    case "transform.fieldUpdateStatic":
    case "transform.forEach":
    case "transform.reverse":
    case "transform.unique":
    case "transform.clone":
    case "transform.filter":
    case "transform.fieldExpand": {
      const upstreamId = getUpstreamNodeId(nodeId, "main");
      return resolveNodeFields(String(upstreamId || ""), visited);
    }
    case "transform.select": {
      const upstreamId = getUpstreamNodeId(nodeId, "main");
      const upstream = resolveNodeFields(String(upstreamId || ""), visited);
      const selected = parseCsvFields(params.fieldsCsv).concat(Array.isArray(params.fields) ? params.fields.map(String) : []);
      if (selected.length === 0) return upstream;
      return selected.filter((field) => upstream.includes(field));
    }
    case "transform.fieldsRemove": {
      const upstreamId = getUpstreamNodeId(nodeId, "main");
      const upstream = resolveNodeFields(String(upstreamId || ""), visited);
      const removed = new Set(parseCsvFields(params.fieldsCsv).map((field) => field.toLowerCase()));
      if (removed.size === 0) return upstream;
      return upstream.filter((field) => !removed.has(field.toLowerCase()));
    }
    case "transform.fieldsRename": {
      const upstreamId = getUpstreamNodeId(nodeId, "main");
      const upstream = resolveNodeFields(String(upstreamId || ""), visited);
      const renames = Array.isArray(params.renames) ? params.renames : [];
      const renameMap = new Map<string, string>();
      for (const rename of renames) {
        const from = String(rename?.from || "").trim();
        const to = String(rename?.to || "").trim();
        if (from && to) renameMap.set(from.toLowerCase(), to);
      }
      return uniqueFields(upstream.map((field) => renameMap.get(field.toLowerCase()) || field));
    }
    case "transform.groupBy": {
      const fieldName = String(params.fieldName || "").trim();
      return fieldName ? [fieldName] : [];
    }
    case "transform.groupByKey": {
      const keyName = String(params.keyName || "").trim();
      return keyName ? [keyName] : [];
    }
    case "transform.join": {
      const leftId = getUpstreamNodeId(nodeId, "left");
      const leftFields = resolveNodeFields(String(leftId || ""), visited);
      const alias = resolveJoinAlias(nodeId, params);
      return uniqueFields(leftFields.concat(["join", alias]));
    }
    case "transform.concat": {
      const mainId = getUpstreamNodeId(nodeId, "main");
      const appendId = getUpstreamNodeId(nodeId, "right");
      const mainFields = resolveNodeFields(String(mainId || ""), visited);
      const appendFields = resolveNodeFields(String(appendId || ""), visited);
      return uniqueFields(mainFields.concat(appendFields));
    }
    default:
      return [];
  }
}

function resolveInputFields(nodeId: string, input: "main" | "left" | "right"): string[] {
  const upstreamId = getUpstreamNodeId(nodeId, input);
  if (!upstreamId) return [];
  return resolveNodeFields(upstreamId);
}

function collectJoinsAlongMainPath(nodeId: string, visited = new Set<string>()): JoinBinding[] {
  if (!nodeId || visited.has(nodeId)) return [];
  visited.add(nodeId);

  const cfg = state.nodeConfigs.get(nodeId);
  if (!cfg) return [];

  if (cfg.type === "transform.join") {
    const alias = resolveJoinAlias(nodeId, cfg.params);
    const rightFields = resolveInputFields(nodeId, "right");
    const leftId = getUpstreamNodeId(nodeId, "left");
    const upstream = collectJoinsAlongMainPath(String(leftId || ""), visited);
    return upstream.concat([{ alias, returnOne: !!cfg.params.returnOne, rightFields: uniqueFields(rightFields) }]);
  }

  const nextId = getUpstreamNodeId(nodeId, "main");
  return collectJoinsAlongMainPath(String(nextId || ""), visited);
}

function collectJoinsUpstream(nodeId: string): JoinBinding[] {
  const upstreamId = getUpstreamNodeId(nodeId, "main");
  return collectJoinsAlongMainPath(String(upstreamId || ""));
}

function resolveLambdaContext(nodeId: string): LambdaCompletionContext {
  return {
    rowFields: uniqueFields(resolveInputFields(nodeId, "main")),
    joins: collectJoinsUpstream(nodeId)
  };
}

function createVisualNode(type: string, params?: Record<string, any>) {
  const node = new ClassicPreset.Node(getNodeDisplayLabel(type, params)) as any;
  node.meta = { type };

  if (!isSourceNode(type)) {
    if (type === "transform.join") {
      node.addInput("left",  new ClassicPreset.Input(tableSocket, "Left"));
      node.addInput("right", new ClassicPreset.Input(tableSocket, "Right"));
    } else if (type === "transform.concat") {
      node.addInput("main", new ClassicPreset.Input(tableSocket, "Main"));
      node.addInput("right", new ClassicPreset.Input(tableSocket, "Append"));
    } else {
      node.addInput("main", new ClassicPreset.Input(tableSocket, "Input"));
    }
  }

  if (!isSinkNode(type)) {
    node.addOutput("out", new ClassicPreset.Output(tableSocket, "Table"));
  }
  return node;
}

// ── Editor lifecycle ─────────────────────────────────────

async function initializeEditor() {
  disposeNodeConfigEditors();

  if (state.area?.destroy)   await state.area.destroy();
  if (state.editor?.destroy) await state.editor.destroy();

  const container = byId<HTMLDivElement>("editor");
  container.innerHTML = "";

  const editor     = new (NodeEditor as any)();
  const area       = new (AreaPlugin as any)(container);
  const connection = new (ConnectionPlugin as any)();
  const render     = new (LitPlugin as any)();

  connection.addPreset(ConnectionPresets.classic.setup());
  render.addPreset(createPipelineRenderPreset());

  editor.use(area);
  area.use(connection);
  area.use(render);
  setupNodeResizeSync(area);

  // Node click → open config panel
  area.addPipe((ctx: any) => {
    if (ctx.type === "nodepicked") {
      selectNode(String(ctx.data.id));
    }
    if (ctx.type === "contextmenu") {
      const { event, context } = ctx.data ?? {};
      if (!event) return ctx;
      event.preventDefault();

      const rect = container.getBoundingClientRect();
      const transform = (area as any)?.area?.transform ?? { x: 0, y: 0, k: 1 };
      state.contextMenuPos = {
        x: (event.clientX - rect.left - transform.x) / transform.k,
        y: (event.clientY - rect.top - transform.y) / transform.k
      };

      if (context !== "root" && context?.id != null) {
        state.contextMenuNodeId = String(context.id);
        showContextMenu(event.clientX, event.clientY, "node");
        return ctx;
      }

      if (context === "root" && !isNodeContextMenuTarget(event)) {
        state.contextMenuNodeId = "";
        showContextMenu(event.clientX, event.clientY, "add");
      }
    }
    return ctx;
  });
  editor.addPipe((ctx: any) => {
    if (ctx.type === "connectioncreated" || ctx.type === "connectionremoved" || ctx.type === "noderemoved") {
      if (shouldRefreshConfigPanelOnGraphChange()) void renderNodeConfigPanel();
    }
    return ctx;
  });

  state.editor = editor;
  state.area   = area;
  state.nodeConfigs.clear();
  state.selectedNodeId = "";
  pipelineSocketPositionWatcher = undefined;
  pipelineSocketResizePatchApplied = false;
  for (const nodeId of nodeResizeObservers.keys()) detachNodeResizeObserver(nodeId);

  showConfigPanel(false);
}

function shouldRefreshConfigPanelOnGraphChange(): boolean {
  if (!state.selectedNodeId || !state.configPanelOpen || state.suppressGraphConfigRefresh) return false;
  const cfg = state.nodeConfigs.get(state.selectedNodeId);
  if (!cfg || isSourceNode(cfg.type)) return false;
  return true;
}

async function deleteNode(nodeId: string) {
  const id = String(nodeId || "");
  if (!id || !state.editor) return;

  const connections = (state.editor.getConnections?.() ?? []).filter((conn: any) => {
    const sourceId = String(typeof conn.source === "object" ? conn.source.id : conn.source);
    const targetId = String(typeof conn.target === "object" ? conn.target.id : conn.target);
    return sourceId === id || targetId === id;
  });

  const closingSelected = state.selectedNodeId === id;
  state.suppressGraphConfigRefresh = true;
  try {
    for (const conn of connections) {
      await state.editor.removeConnection(conn.id);
    }
    await state.editor.removeNode(id);
    detachNodeResizeObserver(id);
    state.nodeConfigs.delete(id);
  } finally {
    state.suppressGraphConfigRefresh = false;
  }

  if (closingSelected) {
    state.selectedNodeId = "";
    showConfigPanel(false);
    disposeNodeConfigEditors();
  } else if (shouldRefreshConfigPanelOnGraphChange()) {
    void renderNodeConfigPanel();
  }
}

async function addNode(type: string, params?: Record<string, any>, position?: { x: number; y: number }) {
  const mergedParams = { ...getDefaultParams(type), ...(params || {}) };
  const node = createVisualNode(type, mergedParams);
  const nodeId = String(node.id);
  state.nodeConfigs.set(nodeId, { type, params: mergedParams });
  await state.editor.addNode(node);
  if (position && state.area?.translate) await state.area.translate(node.id, position);
  await syncNodeDisplayLabel(nodeId);
  selectNode(nodeId);
}

function selectNode(nodeId: string) {
  const id = String(nodeId);
  if (state.configPanelOpen && state.selectedNodeId === id) return;

  state.selectedNodeId = id;
  const cfg = state.nodeConfigs.get(id);
  byId<HTMLHeadingElement>("configPanelTitle").textContent = cfg
    ? getNodeDisplayLabel(cfg.type, cfg.params)
    : "Properties";
  void renderNodeConfigPanel();
  showConfigPanel(true);
}

// ── Workbook data loaders ────────────────────────────────

async function loadWorkbookTables() {
  try {
    const raw = await callHost<string>("ListWorkbookTablesJson");
    state.workbookTables = JSON.parse(String(raw || "[]"));
  } catch { state.workbookTables = []; }
}

async function loadWorkbookSheets() {
  try {
    const raw = await callHost<string>("ListWorkbookSheetsJson");
    state.workbookSheets = JSON.parse(String(raw || "[]"));
  } catch { state.workbookSheets = []; }
}

function sourceTableWorkbookPath(params: Record<string, any>): string {
  return String(params.workbookMode || "me") === "other" ? String(params.workbookPath || "").trim() : "";
}

async function listTablesForWorkbook(workbookPath = ""): Promise<{ name: string; sheet: string }[]> {
  try {
    const path = workbookPath.trim();
    const raw = path
      ? await callHost<string>("ListWorkbookTablesJson", path)
      : await callHost<string>("ListWorkbookTablesJson");
    return JSON.parse(String(raw || "[]"));
  } catch {
    return [];
  }
}

async function getTableFields(tableName: string, workbookPath = ""): Promise<string[]> {
  if (!tableName) return [];
  try {
    const path = workbookPath.trim();
    const raw = path
      ? await callHost<string>("ListTableFieldsJson", tableName, path)
      : await callHost<string>("ListTableFieldsJson", tableName);
    return JSON.parse(String(raw || "[]"));
  } catch {
    return [];
  }
}

async function getFileFields(type: "source.csv" | "source.json", filePath: string): Promise<string[]> {
  const path = String(filePath || "").trim();
  if (!path) return [];
  try {
    const method = type === "source.csv" ? "ListCsvFieldsJson" : "ListJsonFieldsJson";
    const raw = await callHost<string>(method, path);
    return JSON.parse(String(raw || "[]"));
  } catch {
    return [];
  }
}

async function getRangeFields(
  sheetName: string,
  rangeAddress: string,
  workbookPath = "",
  headers = true
): Promise<string[]> {
  const normalizedSheet = String(sheetName || "").trim();
  const normalizedRange = String(rangeAddress || "").trim();
  if (!normalizedSheet || !normalizedRange) return [];
  try {
    const path = workbookPath.trim();
    const raw = path
      ? await callHost<string>("ListRangeFieldsJson", normalizedSheet, normalizedRange, path, !!headers)
      : await callHost<string>("ListRangeFieldsJson", normalizedSheet, normalizedRange, "", !!headers);
    return JSON.parse(String(raw || "[]"));
  } catch {
    return [];
  }
}

// ── Config panel rendering ───────────────────────────────

const workbookModeOptions = [
  { value: "me", label: "This workbook (me)" },
  { value: "other", label: "Another workbook" }
] as const;

function renderLabeledSelect(
  id: string,
  options: readonly { value: string; label: string }[],
  selected: string,
  onChange: (v: string) => void
) {
  const sel = document.createElement("select");
  sel.id = id;
  for (const opt of options) {
    const item = document.createElement("option");
    item.value = opt.value;
    item.textContent = opt.label;
    sel.appendChild(item);
  }
  sel.value = selected || options[0]?.value || "";
  sel.onchange = () => onChange(sel.value);
  return sel;
}

function renderFilePathInput(
  id: string,
  value: string,
  onChange: (v: string, meta?: { fromPicker?: boolean }) => void,
  options: { placeholder: string; extension: string; browseTitle: string }
) {
  const wrap = document.createElement("div");
  wrap.className = "cfg-workbook-path";

  const text = document.createElement("input");
  text.type = "text";
  text.id = id;
  text.value = value || "";
  text.placeholder = options.placeholder;
  // Use change (commit/blur), not input — WebView2 can fire input when the value is set programmatically.
  text.onchange = () => onChange(text.value);

  const file = document.createElement("button");
  file.type = "button";
  file.className = "cfg-workbook-file";
  file.title = options.browseTitle;
  file.textContent = "Browse...";
  file.onclick = async () => {
    try {
      const path = await callHost<string>("PickFile", options.extension);
      if (path) {
        text.value = path;
        onChange(path, { fromPicker: true });
      }
    } catch {
      /* cancelled */
    }
  };

  wrap.appendChild(text);
  wrap.appendChild(file);
  return wrap;
}

function renderWorkbookPathInput(id: string, value: string, onChange: (v: string) => void) {
  return renderFilePathInput(id, value, onChange, {
    placeholder: "C:\\path\\to\\workbook.xlsx",
    extension: "xlsx;xlsm;xls;xlsb",
    browseTitle: "Choose workbook file"
  });
}

function renderSelect(id: string, options: string[], selected: string, onChange: (v: string) => void) {
  const sel = document.createElement("select");
  sel.id = id;
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "— select —";
  sel.appendChild(blank);
  for (const opt of options) {
    const item = document.createElement("option");
    item.value = opt;
    item.textContent = opt;
    sel.appendChild(item);
  }
  sel.value = selected || "";
  sel.onchange = () => onChange(sel.value);
  return sel;
}

function renderFieldSelect(id: string, fields: string[], selected: string, onChange: (v: string) => void) {
  const normalized = uniqueFields(fields);
  const sel = renderSelect(id, normalized, selected, onChange);
  sel.disabled = normalized.length === 0;
  return sel;
}

function renderInput(id: string, value: string, onChange: (v: string) => void) {
  const inp = document.createElement("input");
  inp.id = id;
  inp.type = "text";
  inp.value = value || "";
  inp.oninput = () => onChange(inp.value);
  return inp;
}

function renderCheckbox(id: string, checked: boolean, onChange: (v: boolean) => void) {
  const cb = document.createElement("input");
  cb.id = id;
  cb.type = "checkbox";
  cb.checked = checked;
  cb.onchange = () => onChange(cb.checked);
  return cb;
}

function renderActionButton(label: string, onClick: () => void | Promise<void>, disabled = false) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-secondary cfg-action-btn";
  btn.textContent = label;
  btn.disabled = disabled;
  btn.onclick = () => void onClick();
  return btn;
}

function renderFieldChecklist(id: string, fields: string[], selected: Set<string>, onChange: (fields: string[]) => void) {
  const wrap = document.createElement("div");
  wrap.id = id;
  wrap.className = "cfg-field-list";
  for (const field of uniqueFields(fields)) {
    const row = document.createElement("label");
    row.className = "cfg-field-list-item";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = selected.has(field);
    cb.onchange = () => {
      if (cb.checked) selected.add(field);
      else selected.delete(field);
      onChange(fields.filter((name) => selected.has(name)));
    };
    const text = document.createElement("span");
    text.textContent = field;
    row.appendChild(cb);
    row.appendChild(text);
    wrap.appendChild(row);
  }
  return wrap;
}

function renderRenamePairs(
  id: string,
  fields: string[],
  pairs: RenamePair[],
  onChange: (pairs: RenamePair[]) => void
) {
  const wrap = document.createElement("div");
  wrap.id = id;
  wrap.className = "cfg-rename-list";

  const normalizedPairs = pairs.filter((pair) => String(pair?.from || "").trim().length > 0 || String(pair?.to || "").trim().length > 0);
  const data = normalizedPairs.length > 0 ? normalizedPairs : [{ from: "", to: "" }];

  const emit = () =>
    onChange(
      data
        .map((pair) => ({ from: String(pair.from || "").trim(), to: String(pair.to || "").trim() }))
        .filter((pair) => pair.from.length > 0 || pair.to.length > 0)
    );

  const renderRows = () => {
    wrap.innerHTML = "";

    data.forEach((pair, idx) => {
      const row = document.createElement("div");
      row.className = "cfg-rename-row";

      const from = renderFieldSelect(`renameFrom${idx}`, fields, pair.from, (v) => {
        pair.from = v;
        emit();
      });
      const to = renderInput(`renameTo${idx}`, pair.to, (v) => {
        pair.to = v;
        emit();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cfg-rename-remove";
      remove.textContent = "×";
      remove.title = "Remove rename rule";
      remove.onclick = () => {
        data.splice(idx, 1);
        if (data.length === 0) data.push({ from: "", to: "" });
        emit();
        renderRows();
      };

      row.appendChild(from);
      row.appendChild(to);
      row.appendChild(remove);
      wrap.appendChild(row);
    });

    const addBtn = renderActionButton("Add rename rule", () => {
      data.push({ from: "", to: "" });
      renderRows();
      emit();
    });
    wrap.appendChild(addBtn);
  };

  renderRows();
  return wrap;
}

function renderPreviewRows(rows: Record<string, any>[]) {
  const container = byId<HTMLDivElement>("previewGrid");
  const meta = byId<HTMLParagraphElement>("previewMeta");
  container.innerHTML = "";
  if (!Array.isArray(rows) || rows.length === 0) {
    container.innerHTML = '<div class="preview-grid-empty">No rows returned.</div>';
    meta.textContent = "No preview rows were returned by the pipeline.";
    return;
  }
  const fields = uniqueFields(rows.flatMap((row) => Object.keys(row || {})));
  meta.textContent = `Showing ${rows.length} row${rows.length === 1 ? "" : "s"} from the final preview node.`;

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const field of fields) {
    const th = document.createElement("th");
    th.textContent = field;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const field of fields) {
      const td = document.createElement("td");
      const value = (row as any)?.[field];
      td.textContent = value == null ? "" : String(value);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  container.appendChild(table);
}

function addField(container: HTMLElement, label: string, input: HTMLElement) {
  const wrap = document.createElement("div");
  wrap.className = "cfg-field";
  const title = document.createElement("span");
  title.textContent = label;
  wrap.appendChild(title);
  wrap.appendChild(input);
  container.appendChild(wrap);
}

function addHelp(container: HTMLElement, message: string) {
  const help = document.createElement("p");
  help.className = "cfg-help";
  help.textContent = message;
  container.appendChild(help);
}

async function renderLambdaEditorField(
  panel: HTMLElement,
  label: string,
  value: string,
  onChange: (value: string) => void,
  targetNodeId: string,
  opts?: { multiline?: boolean }
) {
  const expressionHolder = document.createElement("div");
  addField(panel, label, expressionHolder);
  const { createLambdaEditor, disposeLambdaEditors } = await import("./lambdaEditor");
  if (targetNodeId !== state.selectedNodeId) return;
  disposeConfigPanelEditors = disposeLambdaEditors;
  const createContextEditor = createLambdaEditor as unknown as (
    container: HTMLElement,
    value: string,
    onChange: (v: string) => void,
    getContext: () => LambdaCompletionContext,
    options?: { multiline?: boolean }
  ) => Promise<void>;
  await createContextEditor(
    expressionHolder,
    value,
    onChange,
    () => resolveLambdaContext(targetNodeId),
    { multiline: !!opts?.multiline }
  );
}

async function renderNodeConfigPanel() {
  const panel = byId<HTMLDivElement>("nodeConfig");
  disposeNodeConfigEditors();
  panel.innerHTML = "";

  if (!state.selectedNodeId) return;
  const cfg = state.nodeConfigs.get(state.selectedNodeId);
  if (!cfg) return;

  const { params, type } = cfg;
  const tableNames = state.workbookTables.map((t) => t.name);
  const sheetNames = state.workbookSheets;
  const mainFields = resolveInputFields(state.selectedNodeId, "main");

  if (type === "source.table") {
    const workbookMode = String(params.workbookMode || "me");
    const isOtherWorkbook = workbookMode === "other";
    const workbookPath = sourceTableWorkbookPath(params);

    addField(
      panel,
      "Workbook",
      renderLabeledSelect("srcWbMode", workbookModeOptions, workbookMode, (v) => {
        params.workbookMode = v;
        if (v !== "other") params.workbookPath = "";
        params.tableName = "";
        params.fields = [];
        void renderNodeConfigPanel();
      })
    );

    if (isOtherWorkbook) {
      addField(
        panel,
        "Workbook file",
        renderWorkbookPathInput("srcWbPath", String(params.workbookPath || ""), (v) => {
          params.workbookPath = v;
          params.tableName = "";
          params.fields = [];
          void renderNodeConfigPanel();
        })
      );
    }

    const tableNames = (
      isOtherWorkbook && workbookPath
        ? await listTablesForWorkbook(workbookPath)
        : state.workbookTables
    ).map((t) => t.name);

    const tableName = String(params.tableName || "").trim();
    addField(panel, "Table", renderSelect("tableName", tableNames, params.tableName, (v) => {
      params.tableName = v;
      void (async () => {
        params.fields = await getTableFields(v, workbookPath);
        await syncNodeDisplayLabel(state.selectedNodeId);
        await renderNodeConfigPanel();
      })();
    }));
    addField(
      panel,
      "Columns",
      renderActionButton(
        "Refresh fields",
        async () => {
          const name = String(params.tableName || "").trim();
          if (!name) return;
          params.fields = await getTableFields(name, workbookPath);
          await syncNodeDisplayLabel(state.selectedNodeId);
          await renderNodeConfigPanel();
        },
        !tableName
      )
    );
    const fields: string[] = Array.isArray(params.fields) ? params.fields : [];
    addHelp(
      panel,
      isOtherWorkbook && !workbookPath
        ? "Choose a workbook file to list its tables."
        : fields.length > 0
          ? `${fields.length} column${fields.length === 1 ? "" : "s"}: ${fields.join(", ")}`
          : tableName
            ? "No columns found — refresh after editing the table in Excel."
            : "Select a table to load columns."
    );
    return;
  }

  if (type === "source.range") {
    const workbookMode = String(params.workbookMode || "me");
    const isOtherWorkbook = workbookMode === "other";
    const workbookPath = sourceTableWorkbookPath(params);
    const sheetName = String(params.sheetName || "").trim();
    const rangeAddress = String(params.rangeAddress || "").trim();

    addField(
      panel,
      "Workbook",
      renderLabeledSelect("srcRangeWbMode", workbookModeOptions, workbookMode, (v) => {
        params.workbookMode = v;
        if (v !== "other") params.workbookPath = "";
        params.fields = [];
        void renderNodeConfigPanel();
      })
    );

    if (isOtherWorkbook) {
      addField(
        panel,
        "Workbook file",
        renderWorkbookPathInput("srcRangeWbPath", String(params.workbookPath || ""), (v) => {
          params.workbookPath = v;
          params.fields = [];
          void renderNodeConfigPanel();
        })
      );
    }

    if (isOtherWorkbook) {
      addField(panel, "Sheet", renderInput("srcRangeSheet", String(params.sheetName || ""), (v) => (params.sheetName = v)));
    } else {
      addField(panel, "Sheet", renderSelect("srcRangeSheet", sheetNames, params.sheetName, (v) => (params.sheetName = v)));
    }
    addField(panel, "Range", renderInput("srcRangeAddress", String(params.rangeAddress || ""), (v) => (params.rangeAddress = v)));
    addField(panel, "Headers in first row", renderCheckbox("srcRangeHeaders", params.headers !== false, (v) => (params.headers = v)));
    addField(
      panel,
      "Columns",
      renderActionButton(
        "Refresh fields",
        async () => {
          params.fields = await getRangeFields(
            String(params.sheetName || ""),
            String(params.rangeAddress || ""),
            sourceTableWorkbookPath(params),
            params.headers !== false
          );
          await syncNodeDisplayLabel(state.selectedNodeId);
          await renderNodeConfigPanel();
        },
        !sheetName || !rangeAddress
      )
    );
    const fields: string[] = Array.isArray(params.fields) ? params.fields : [];
    addHelp(
      panel,
      fields.length > 0
        ? `${fields.length} column${fields.length === 1 ? "" : "s"}: ${fields.join(", ")}`
        : "Select a sheet and range, then refresh fields."
    );
    return;
  }

  if (type === "source.csv" || type === "source.json") {
    const isCsv = type === "source.csv";
    const filePath = String(params.filePath || "").trim();
    const loadFields = async (path = String(params.filePath || "").trim()) => {
      const trimmed = String(path || "").trim();
      if (!trimmed) return;
      params.fields = await getFileFields(type, trimmed);
      await syncNodeDisplayLabel(state.selectedNodeId);
      await renderNodeConfigPanel();
    };
    const applyFilePath = async (nextPath: string, meta?: { fromPicker?: boolean }) => {
      const trimmed = String(nextPath || "").trim();
      const prevPath = String(params.filePath || "").trim();
      const pathChanged = trimmed !== prevPath;
      params.filePath = nextPath;

      if (!trimmed) {
        params.fields = [];
        await syncNodeDisplayLabel(state.selectedNodeId);
        await renderNodeConfigPanel();
        return;
      }

      // Panel re-render can re-notify with the same path; keep columns we already loaded.
      if (!pathChanged && Array.isArray(params.fields) && params.fields.length > 0) {
        await renderNodeConfigPanel();
        return;
      }

      if (meta?.fromPicker) await yieldToHost();
      await loadFields(trimmed);
    };

    addField(
      panel,
      "File",
      renderFilePathInput(
        isCsv ? "srcCsvPath" : "srcJsonPath",
        filePath,
        (v, meta) => void applyFilePath(v, meta),
        {
          placeholder: isCsv ? "C:\\path\\to\\data.csv" : "C:\\path\\to\\data.json",
          extension: isCsv ? "csv" : "json",
          browseTitle: isCsv ? "Choose CSV file" : "Choose JSON file"
        }
      )
    );
    addField(
      panel,
      "Columns",
      renderActionButton(
        "Refresh fields",
        () => void loadFields(),
        !filePath
      )
    );
    const fields: string[] = Array.isArray(params.fields) ? params.fields : [];
    addHelp(
      panel,
      fields.length > 0
        ? `${fields.length} column${fields.length === 1 ? "" : "s"}: ${fields.join(", ")}`
        : filePath
          ? "No columns found — refresh after editing the file."
          : isCsv
            ? "Select a CSV file to load columns."
            : "Select a JSON file to load columns."
    );
    return;
  }

  if (type === "transform.fieldAdd") {
    addField(panel, "Field Name", renderInput("faField", params.fieldName, (v) => (params.fieldName = v)));
    if (mainFields.length > 0) addHelp(panel, `Input fields: ${mainFields.join(", ")}`);
    const targetNodeId = state.selectedNodeId;
    await renderLambdaEditorField(
      panel,
      "Expression",
      String(params.expression || ""),
      (v) => (params.expression = v),
      targetNodeId
    );
    return;
  }

  if (type === "transform.fieldUpdate") {
    addField(panel, "Field Name", renderFieldSelect("fuField", mainFields, params.fieldName, (v) => (params.fieldName = v)));
    const targetNodeId = state.selectedNodeId;
    await renderLambdaEditorField(
      panel,
      "Expression",
      String(params.expression || ""),
      (v) => (params.expression = v),
      targetNodeId
    );
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.fieldUpdateStatic") {
    addField(panel, "Field Name", renderFieldSelect("fusField", mainFields, params.fieldName, (v) => (params.fieldName = v)));
    addField(panel, "Value", renderInput("fusValue", String(params.value ?? ""), (v) => (params.value = v)));
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.fieldExpand") {
    addField(panel, "Field Name", renderFieldSelect("feField", mainFields, params.fieldName, (v) => (params.fieldName = v)));
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.join") {
    const leftFields = resolveInputFields(state.selectedNodeId, "left");
    const rightFields = resolveInputFields(state.selectedNodeId, "right");
    addField(panel, "Left Field",  renderFieldSelect("jlField", leftFields, params.leftField,  (v) => (params.leftField  = v)));
    addField(panel, "Right Field", renderFieldSelect("jrField", rightFields, params.rightField, (v) => (params.rightField = v)));
    addField(panel, "Alias",       renderInput("jAlias",  params.alias,      (v) => (params.alias = v)));
    addField(panel, "Return One",  renderCheckbox("jOne",  !!params.returnOne,(v) => (params.returnOne = v)));
    if (leftFields.length === 0 || rightFields.length === 0) addHelp(panel, "Connect both left and right table inputs to choose fields.");
    return;
  }

  if (type === "transform.groupBy") {
    addField(panel, "Field", renderFieldSelect("gbField", mainFields, params.fieldName, (v) => (params.fieldName = v)));
    addField(panel, "Virtual Name", renderInput("gbVirt", params.virtualName, (v) => (params.virtualName = v)));
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.groupByKey") {
    addField(panel, "Key Name", renderInput("gbkName", params.keyName, (v) => (params.keyName = v)));
    addField(panel, "Virtual Name", renderInput("gbkVirt", params.virtualName, (v) => (params.virtualName = v)));
    const targetNodeId = state.selectedNodeId;
    await renderLambdaEditorField(
      panel,
      "Key Expression",
      String(params.expression || ""),
      (v) => (params.expression = v),
      targetNodeId
    );
    return;
  }

  if (type === "transform.select") {
    const selected = new Set(parseCsvFields(params.fieldsCsv));
    addField(panel, "Fields", renderFieldChecklist("selFields", mainFields, selected, (fields) => {
      params.fieldsCsv = fields.join(", ");
    }));
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.fieldsRemove") {
    const selected = new Set(parseCsvFields(params.fieldsCsv));
    addField(panel, "Fields To Remove", renderFieldChecklist("removeFields", mainFields, selected, (fields) => {
      params.fieldsCsv = fields.join(", ");
    }));
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.fieldsRename") {
    const renames = Array.isArray(params.renames) ? params.renames : [];
    addField(panel, "Rename Rules", renderRenamePairs("renamePairs", mainFields, renames, (pairs) => {
      params.renames = pairs;
    }));
    if (mainFields.length === 0) addHelp(panel, "Connect a table input to choose fields.");
    return;
  }

  if (type === "transform.filter") {
    const targetNodeId = state.selectedNodeId;
    await renderLambdaEditorField(
      panel,
      "Expression",
      String(params.expression || ""),
      (v) => (params.expression = v),
      targetNodeId
    );
    return;
  }

  if (type === "transform.unique") {
    const targetNodeId = state.selectedNodeId;
    await renderLambdaEditorField(
      panel,
      "Key Expression",
      String(params.expression || ""),
      (v) => (params.expression = v),
      targetNodeId
    );
    return;
  }

  if (type === "transform.forEach") {
    const targetNodeId = state.selectedNodeId;
    await renderLambdaEditorField(
      panel,
      "Expression",
      String(params.expression || ""),
      (v) => (params.expression = v),
      targetNodeId,
      { multiline: true }
    );
    addHelp(panel, "Use one or more lambda statements. This node mutates each input row.");
    return;
  }

  if (type === "transform.concat") {
    const appendFields = resolveInputFields(state.selectedNodeId, "right");
    if (mainFields.length > 0) addHelp(panel, `Main fields: ${mainFields.join(", ")}`);
    if (appendFields.length > 0) addHelp(panel, `Append fields: ${appendFields.join(", ")}`);
    if (mainFields.length === 0 || appendFields.length === 0) {
      addHelp(panel, "Connect both Main and Append table inputs.");
    }
    return;
  }

  if (type === "transform.clone") {
    addHelp(panel, "Creates a deep clone of the incoming table so downstream edits do not affect upstream rows.");
    return;
  }

  if (type === "transform.reverse") {
    addHelp(panel, "Reverses row order.");
    return;
  }

  if (type === "sink.exportTable") {
    addField(panel, "Workbook",   renderSelect("expMode",  ["me","new"],  params.workbookMode, (v) => (params.workbookMode = v)));
    addField(panel, "Sheet",      renderSelect("expSheet", sheetNames,    params.sheetName,    (v) => (params.sheetName    = v)));
    addField(panel, "Table Name", renderInput ("expTable", params.tableName, (v) => (params.tableName = v)));
    return;
  }

  if (type === "sink.exportCsv" || type === "sink.exportJson") {
    const isCsv = type === "sink.exportCsv";
    addField(
      panel,
      "File",
      renderFilePathInput(
        isCsv ? "expCsvPath" : "expJsonPath",
        String(params.filePath || ""),
        (v) => {
          params.filePath = v;
          void syncNodeDisplayLabel(state.selectedNodeId);
        },
        {
          placeholder: isCsv ? "C:\\path\\to\\output.csv" : "C:\\path\\to\\output.json",
          extension: isCsv ? "csv" : "json",
          browseTitle: isCsv ? "Choose CSV output file" : "Choose JSON output file"
        }
      )
    );
    if (mainFields.length > 0) addHelp(panel, `Input fields: ${mainFields.join(", ")}`);
    else addHelp(panel, "Connect a table input to export data.");
    return;
  }

  const note = document.createElement("p");
  note.style.cssText = "color:var(--fg-muted);font-size:12px;";
  note.textContent = "No configuration needed for this node.";
  panel.appendChild(note);
}

// ── Serialization ────────────────────────────────────────

function serializeGraph() {
  const nodes = (state.editor?.getNodes?.() ?? []).map((node: any) => {
    const cfg    = state.nodeConfigs.get(String(node.id));
    const params = { ...(cfg?.params ?? {}) };

    if (cfg?.type === "transform.select" || cfg?.type === "transform.fieldsRemove") {
      params.fields = String(params.fieldsCsv || "")
        .split(",").map((x: string) => x.trim()).filter((x: string) => x.length > 0);
      delete params.fieldsCsv;
    }

    if (cfg?.type === "transform.fieldsRename") {
      const renames = Array.isArray(params.renames) ? params.renames : [];
      params.renames = renames
        .map((pair: RenamePair) => ({ from: String(pair?.from || "").trim(), to: String(pair?.to || "").trim() }))
        .filter((pair: RenamePair) => pair.from.length > 0 && pair.to.length > 0);
    }

    if (cfg?.type && hasWiredTableInput(cfg.type)) {
      delete params.tableName;
      delete params.leftTableName;
      delete params.rightTableName;
    }

    const nodeId = String(node.id);
    const pos    = getNodePosition(nodeId);
    return {
      id: nodeId,
      type: cfg?.type ?? "unknown",
      params,
      ...(pos ? { x: pos.x, y: pos.y } : {})
    };
  });

  const connections = (state.editor?.getConnections?.() ?? []).map((conn: any, i: number) => ({
    id:    String(conn.id ?? `c${i + 1}`),
    from:  String(typeof conn.source === "object" ? conn.source.id : conn.source),
    to:    String(typeof conn.target === "object" ? conn.target.id : conn.target),
    input: String(conn.targetInput ?? "main")
  }));

  return { schemaVersion: 1, nodes, connections };
}

async function applyGraph(graph: any) {
  await initializeEditor();
  const oldToNew = new Map<string, string>();

  let fallbackY = 0;
  for (const node of graph.nodes ?? []) {
    const position =
      typeof node.x === "number" && typeof node.y === "number"
        ? { x: node.x, y: node.y }
        : { x: 80, y: 80 + fallbackY };
    fallbackY += 120;

    const params = { ...(node.params ?? {}) };
    if ((node.type === "transform.select" || node.type === "transform.fieldsRemove") && Array.isArray(params.fields) && !params.fieldsCsv) {
      params.fieldsCsv = params.fields.join(", ");
      delete params.fields;
    }
    if (node.type === "source.table" && params.tableName && (!Array.isArray(params.fields) || params.fields.length === 0)) {
      params.fields = await getTableFields(String(params.tableName), sourceTableWorkbookPath(params));
    }
    if (
      (node.type === "source.csv" || node.type === "source.json") &&
      params.filePath &&
      (!Array.isArray(params.fields) || params.fields.length === 0)
    ) {
      params.fields = await getFileFields(node.type, String(params.filePath));
    }
    if (
      node.type === "source.range" &&
      params.sheetName &&
      params.rangeAddress &&
      (!Array.isArray(params.fields) || params.fields.length === 0)
    ) {
      params.fields = await getRangeFields(
        String(params.sheetName),
        String(params.rangeAddress),
        sourceTableWorkbookPath(params),
        params.headers !== false
      );
    }

    await addNode(node.type, params, position);
    const allNodes = state.editor.getNodes();
    oldToNew.set(String(node.id), String(allNodes[allNodes.length - 1].id));
  }

  for (const conn of graph.connections ?? []) {
    const fromId = oldToNew.get(String(conn.from));
    const toId   = oldToNew.get(String(conn.to));
    if (!fromId || !toId) continue;
    const nodes = state.editor.getNodes();
    const fromNode = nodes.find((x: any) => String(x.id) === fromId);
    const toNode   = nodes.find((x: any) => String(x.id) === toId);
    if (!fromNode || !toNode) continue;
    await state.editor.addConnection(
      new ClassicPreset.Connection(fromNode, "out", toNode, String(conn.input ?? "main"))
    );
  }
}

// ── Pipeline CRUD ────────────────────────────────────────

async function loadPipelines() {
  try {
    const raw = await callHost<string>("ListPipelinesJson");
    state.pipelines = JSON.parse(String(raw || "[]"));
  } catch {
    state.pipelines = [];
  }
  renderPipelineCards();
}

function renderPipelineCards() {
  const grid = byId<HTMLDivElement>("pipelineGrid");
  grid.innerHTML = "";

  if (state.pipelines.length === 0) {
    const empty = document.createElement("div");
    empty.className = "pipeline-grid-empty";
    empty.textContent = 'No pipelines yet \u2014 click \u201cNew Pipeline\u201d to create one.';
    grid.appendChild(empty);
    return;
  }

  for (const p of state.pipelines) {
    const card = document.createElement("div");
    card.className = "pipeline-card";
    card.innerHTML = `
      <div class="pipeline-card-chip">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1"  y="4"  width="4" height="3.5" rx="1.2" fill="#3b82f6"/>
          <rect x="1"  y="10.5" width="4" height="3.5" rx="1.2" fill="#3b82f6" opacity="0.5"/>
          <rect x="7"  y="7.25" width="4" height="3.5" rx="1.2" fill="#60a5fa"/>
          <rect x="13" y="4"  width="4" height="3.5" rx="1.2" fill="#93c5fd"/>
          <rect x="13" y="10.5" width="4" height="3.5" rx="1.2" fill="#93c5fd" opacity="0.5"/>
          <path d="M5 5.75l2 2.5M5 12.25l2-2.5" stroke="#475569" stroke-width="0.9" stroke-linecap="round"/>
          <path d="M11 9l2-2.5M11 9l2 2.5"     stroke="#475569" stroke-width="0.9" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="pipeline-card-name">${escapeHtml(p.name || p.id)}</div>
      ${p.updatedAt ? `<div class="pipeline-card-meta">${escapeHtml(p.updatedAt)}</div>` : ""}
      <span class="pipeline-card-arrow">›</span>
    `;
    card.onclick = () => void openPipeline(p.id);
    grid.appendChild(card);
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function openPipeline(
  id: string,
  opts?: { updateUrl?: boolean; replaceUrl?: boolean }
) {
  const updateUrl = opts?.updateUrl ?? true;
  if (updateUrl) setRoute({ view: "editor", pipelineId: id }, opts?.replaceUrl ?? false);

  showView("editor");
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await initializeEditor();
  try {
    const raw   = await callHost<string>("GetPipelineJson", id);
    const graph = JSON.parse(String(raw || "{}"));
    await applyGraph(graph);
    state.pipelineId = id;
    const match = state.pipelines.find((p) => p.id === id);
    byId<HTMLInputElement>("editorPipelineName").value = match?.name || "";
    setStatus(`Loaded "${match?.name || id}"`);
  } catch (err: any) {
    setStatus(err.message || String(err), true);
  }
}

async function goHome(updateUrl = true) {
  if (updateUrl) setRoute({ view: "home" });
  showView("home");
  await loadPipelines();
}

async function navigateFromRoute() {
  const route = getRoute();
  if (route.view === "home") {
    await goHome(false);
    return;
  }
  await openPipeline(route.pipelineId, { updateUrl: false });
}

async function savePipeline() {
  const graph = serializeGraph();
  const name  = byId<HTMLInputElement>("editorPipelineName").value.trim() || "Untitled Pipeline";
  const id    = await callHost<string>("SavePipelineJson", state.pipelineId, name, JSON.stringify(graph));
  state.pipelineId = String(id);
  setRoute({ view: "editor", pipelineId: state.pipelineId }, true);
  setStatus(`Saved "${name}"`);
  await loadPipelines();
}

function validatePipelineBeforeRun(): string | null {
  for (const [id, cfg] of state.nodeConfigs.entries()) {
    const params = cfg.params || {};
    if (cfg.type === "source.table" && !String(params.tableName || "").trim()) {
      return "Get Excel Table requires a table name.";
    }
    if (cfg.type === "source.range") {
      if (!String(params.sheetName || "").trim() || !String(params.rangeAddress || "").trim()) {
        return "Get Excel Range requires both sheet and range.";
      }
    }
    if (cfg.type === "transform.join") {
      if (!getUpstreamNodeId(id, "left") || !getUpstreamNodeId(id, "right")) {
        return "Join nodes require both Left and Right inputs.";
      }
    }
    if (cfg.type === "transform.concat") {
      if (!getUpstreamNodeId(id, "main") || !getUpstreamNodeId(id, "right")) {
        return "Concat nodes require both Main and Append inputs.";
      }
    }
    if (cfg.type === "transform.select" || cfg.type === "transform.fieldsRemove") {
      if (parseCsvFields(String(params.fieldsCsv || "")).length === 0) {
        return `${getNodeLabel(cfg.type)} requires at least one field.`;
      }
    }
    if (
      cfg.type === "transform.filter" ||
      cfg.type === "transform.fieldAdd" ||
      cfg.type === "transform.fieldUpdate" ||
      cfg.type === "transform.forEach" ||
      cfg.type === "transform.unique" ||
      cfg.type === "transform.groupByKey"
    ) {
      if (!String(params.expression || "").trim()) {
        return `${getNodeLabel(cfg.type)} requires an expression.`;
      }
    }
  }
  return null;
}

async function runPipeline() {
  if (!state.pipelineId) {
    setStatus("Save the pipeline before running.", true);
    return;
  }
  const validationError = validatePipelineBeforeRun();
  if (validationError) {
    setStatus(validationError, true);
    return;
  }
  setStatus("Running…");
  const raw    = await callHost<string>("RunPipeline", state.pipelineId);
  const result = JSON.parse(String(raw || "{}"));
  state.lastPreviewRows = [];
  if (result.previewJson) {
    try {
      const parsed = JSON.parse(String(result.previewJson || "[]"));
      state.lastPreviewRows = Array.isArray(parsed) ? parsed : [];
    } catch {
      state.lastPreviewRows = [];
    }
  }
  if (result.success) {
    if (state.lastPreviewRows.length > 0) {
      renderPreviewRows(state.lastPreviewRows);
      byId<HTMLDivElement>("previewModal").style.display = "flex";
      setStatus("Run completed with preview rows.");
    } else {
      setStatus(result.outputTable ? `Done — output table: ${result.outputTable}` : "Run completed.");
    }
  } else {
    setStatus(`Failed at node ${result.failedNodeId}: ${result.errorMessage}`, true);
  }
}

// ── UI binding ───────────────────────────────────────────

function bindUi() {
  // ── Home: New Pipeline button ──
  byId<HTMLButtonElement>("newPipelineBtn").onclick = () => {
    byId<HTMLInputElement>("newPipelineNameInput").value = "";
    byId<HTMLDivElement>("newPipelineModal").style.display = "flex";
    setTimeout(() => byId<HTMLInputElement>("newPipelineNameInput").focus(), 50);
  };

  byId<HTMLButtonElement>("cancelNewPipeline").onclick = () => {
    byId<HTMLDivElement>("newPipelineModal").style.display = "none";
  };
  byId<HTMLButtonElement>("closePreview").onclick = () => {
    byId<HTMLDivElement>("previewModal").style.display = "none";
  };

  byId<HTMLInputElement>("newPipelineNameInput").onkeydown = (e) => {
    if (e.key === "Enter")  byId<HTMLButtonElement>("confirmNewPipeline").click();
    if (e.key === "Escape") byId<HTMLButtonElement>("cancelNewPipeline").click();
  };

  byId<HTMLButtonElement>("confirmNewPipeline").onclick = async () => {
    const name = byId<HTMLInputElement>("newPipelineNameInput").value.trim() || "Untitled Pipeline";
    byId<HTMLDivElement>("newPipelineModal").style.display = "none";
    state.pipelineId = "";
    setRoute({ view: "home" }, true);
    showView("editor");
    byId<HTMLInputElement>("editorPipelineName").value = name;
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await initializeEditor();
    setStatus("New pipeline — right-click the canvas to add nodes.");
  };

  // Close modal on backdrop click
  byId<HTMLDivElement>("newPipelineModal").onclick = (e) => {
    if (e.target === e.currentTarget) byId<HTMLButtonElement>("cancelNewPipeline").click();
  };
  byId<HTMLDivElement>("previewModal").onclick = (e) => {
    if (e.target === e.currentTarget) byId<HTMLButtonElement>("closePreview").click();
  };

  // ── Editor nav ──
  byId<HTMLButtonElement>("backHome").onclick = () =>
    void goHome().catch((err) => console.error(err));

  window.addEventListener("popstate", () => {
    void navigateFromRoute().catch((err) => console.error(err));
  });

  byId<HTMLButtonElement>("savePipeline").onclick = () =>
    void savePipeline().catch((err) => setStatus(err.message, true));

  byId<HTMLButtonElement>("runPipeline").onclick = () =>
    void runPipeline().catch((err) => setStatus(err.message, true));

  // ── Config panel close ──
  byId<HTMLButtonElement>("closeConfig").onclick = () => {
    showConfigPanel(false);
    state.selectedNodeId = "";
    disposeNodeConfigEditors();
  };

  // Close context menu on any click or Escape; Ctrl/Cmd+S saves in editor view
  document.addEventListener("click", () => hideContextMenu());
  document.addEventListener(
    "keydown",
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (byId("editorView").style.display !== "none") {
          e.preventDefault();
          void savePipeline().catch((err) => setStatus(err.message, true));
        }
        return;
      }
      if (e.key === "Escape") {
        hideContextMenu();
        byId<HTMLDivElement>("previewModal").style.display = "none";
        showConfigPanel(false);
        state.selectedNodeId = "";
        disposeNodeConfigEditors();
      }
    },
    { capture: true }
  );

  const contextMenuSearch = byId<HTMLInputElement>("contextMenuSearch");
  contextMenuSearch.addEventListener("input", () => applyContextMenuFilter());
  contextMenuSearch.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideContextMenu();
      e.preventDefault();
    }
  });

  // Context menu item clicks (event delegation)
  byId<HTMLDivElement>("contextMenu").addEventListener("click", async (e) => {
    e.stopPropagation();
    const item = (e.target as Element).closest<HTMLElement>(".ctx-item");
    if (!item) return;

    const action = item.dataset.action;
    if (action === "delete-node") {
      const nodeId = state.contextMenuNodeId;
      hideContextMenu();
      if (!nodeId) return;
      try {
        await deleteNode(nodeId);
        setStatus("Node deleted.");
      } catch (err: any) {
        setStatus(err?.message ?? "Failed to delete node.", true);
      }
      return;
    }

    const type = item.dataset.type;
    if (!type) return;
    hideContextMenu();
    await addNode(type, undefined, state.contextMenuPos);
  });
}

// ── Bootstrap ────────────────────────────────────────────

async function bootstrap() {
  try {
    bindUi();
    await Promise.all([loadWorkbookTables(), loadWorkbookSheets(), loadPipelines()]);
    const route = getRoute();
    if (route.view === "editor") {
      await openPipeline(route.pipelineId, { updateUrl: false });
    } else {
      showView("home");
    }
  } catch (err: any) {
    showView("home");
    // status bar is only visible in editor view; display error in console
    console.error("Bootstrap error:", err);
  }
}

void bootstrap();
