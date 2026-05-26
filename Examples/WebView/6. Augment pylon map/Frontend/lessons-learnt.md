# Augment Pylon Map - Lessons Learnt

## Summary
- The initial right-click implementation failed because the app loaded `scribblemaps.com/maps/view/...` where the interactive map lives inside a **cross-origin iframe** (`widgets.scribblemaps.com`).
- Parent-page JavaScript injection cannot access iframe map events or internals across origins, so coordinate extraction returned unavailable/undefined.
- Switching navigation to the widget URL made the injected script run in the same document as the map and restored event visibility.

## Key Root Cause
- Cross-origin iframe isolation blocked:
  - DOM event capture on the actual map canvas
  - Access to internal map APIs/state
  - Reliable lat/lon extraction for context menu actions

## What Worked During Investigation
- Runtime probes showed a live ScribbleMaps instance at `window.sm`.
- `window.sm` exposed:
  - `addListener`
  - `getBaseAPIMap`
  - `map`, `draw`, `view`
- `window.sm.getBaseAPIMap()` identified the provider as **Leaflet** (not Esri in this runtime).
- Leaflet methods available included:
  - `mouseEventToLatLng`
  - `containerPointToLatLng`
  - `mouseEventToContainerPoint`
  - `unproject`

## Important Technical Conclusions
- Do **not** assume Esri objects are available even if `ScribbleMapsAPIs.arcgis` exists.
- Prefer API-first integration via ScribbleMaps instance and base provider map:
  1. `const sm = window.sm`
  2. `const base = sm.getBaseAPIMap()`
  3. Convert mouse events with `base.mouseEventToLatLng(event)` when provider is Leaflet
- Provider-specific fallback logic is still useful, but should be secondary to `window.sm`/base-map integration.

## Recommended Event Strategy
- Prefer binding to base Leaflet map events where possible:
  - `contextmenu` for right-click position
  - `mousedown` + `button===1` for middle-click line points
- If DOM capture is still used, resolve coordinates via base map conversion (`mouseEventToLatLng`) instead of heuristics.

## Navigation / Hosting Guidance
- For this example, navigate WebView directly to widget URL:
  - `https://widgets.scribblemaps.com/sm/?...&id=olGrbyLDOr`
- Avoid wrapping page URLs that embed the map in cross-origin iframes when deep JS augmentation is required.

## Diagnostic Snippets Worth Reusing
- Find viable API instances by behavior (prototype-aware checks like `'addListener' in candidate`).
- Detect provider via base map methods (Leaflet/Bing/Google/ArcGIS signatures).
- Enumerate Scribble event enums:
  - `scribblemaps.ViewEvent`
  - `scribblemaps.MapEvent`
  - `scribblemaps.CoreEvent`

## Practical Guardrails for Future Runs
- Before implementing UI features, confirm early:
  1. Is map same-origin with injected script?
  2. Is `window.sm` present?
  3. Which provider does `sm.getBaseAPIMap()` return?
- If any answer is unknown, run probes first and only then implement interaction logic.

