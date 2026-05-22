/** App routes encoded in `?pipeline=<id>` (home when absent). */

export type AppRoute =
  | { view: "home" }
  | { view: "editor"; pipelineId: string };

export function getRoute(): AppRoute {
  const id = new URLSearchParams(location.search).get("pipeline")?.trim();
  if (id) return { view: "editor", pipelineId: id };
  return { view: "home" };
}

export function setRoute(route: AppRoute, replace = false) {
  const url = new URL(location.href);
  if (route.view === "home") url.searchParams.delete("pipeline");
  else url.searchParams.set("pipeline", route.pipelineId);

  const next = url.pathname + url.search + url.hash;
  if (replace) history.replaceState(null, "", next);
  else history.pushState(null, "", next);
}
