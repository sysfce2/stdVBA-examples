# Low-code Data Pipelines application written in VBA

This example combines a `stdWebView` frontend with a VBA execution engine built on `stdTable`.

## Architecture

- `Backend/DataPipelines.frm` hosts the WebView and exposes host methods under `chrome.webview.hostObjects.vba`.
- `Backend/Pipelines.bas` owns persistence (`__PIPELINES__` sheet), graph execution, and workbook metadata APIs.
- `Backend/libs/stdLambda.cls` evaluates string expressions used by `Filter` and `Field Add`.
- `Frontend/` is a TypeScript app using Rete with a compiled bundle in `Frontend/dist/app.js`.

## Pipeline storage

Pipelines are stored in a `Pipelines` ListObject on worksheet `__PIPELINES__` with columns:

- `Id`
- `Name`
- `PipelineJson`
- `CreatedAt`
- `UpdatedAt`

`Pipelines.Init` ensures the sheet/table exists.

## Graph schema (v1)

```json
{
  "schemaVersion": 1,
  "nodes": [
    { "id": "n1", "type": "source.table", "params": { "tableName": "table1" } },
    { "id": "n2", "type": "sink.exportTable", "params": { "sheetName": "Output", "tableName": "Result", "workbookMode": "me" } }
  ],
  "connections": [
    { "id": "c1", "from": "n1", "to": "n2", "input": "main" }
  ]
}
```

## Supported node types (v1)

- `source.table`
- `source.range`
- `source.csv`
- `source.json`
- `transform.filter`
- `transform.reverse`
- `transform.unique`
- `transform.forEach`
- `transform.fieldAdd`
- `transform.fieldUpdate`
- `transform.fieldUpdateStatic`
- `transform.fieldExpand`
- `transform.fieldsRemove`
- `transform.fieldsRename`
- `transform.join`
- `transform.concat`
- `transform.clone`
- `transform.groupBy`
- `transform.groupByKey`
- `transform.select`
- `sink.preview`
- `sink.exportTable`
- `sink.exportCsv`
- `sink.exportJson`

## Host API (DataPipelines form)

- `ListPipelinesJson()`
- `GetPipelineJson(id)`
- `SavePipelineJson(id, name, pipelineJson)`
- `DeletePipeline(id)`
- `PickFile(extension)`
- `ListWorkbookTablesJson()`
- `ListTableFieldsJson(tableName)`
- `ListRangeFieldsJson(sheetName, rangeAddress, workbookPath, headers)`
- `ListCsvFieldsJson(filePath)`
- `ListJsonFieldsJson(filePath)`
- `ListWorkbookSheetsJson()`
- `RunPipeline(id)` -> JSON representation of `PipelineResult`

## stdTable alias mapping

- `select` -> `transform.filter`
- `update` -> `transform.forEach`
- `updateField` -> `transform.fieldUpdateStatic`
- `addCalculatedField` -> `transform.fieldAdd`
- `removeField` -> `transform.fieldsRemove`

## Frontend build

From `Frontend/`:

```bash
npm install
npm run build
```

This outputs `dist/app.js` used by `Frontend/index.html`.

## Smoke tests

Run these from the VBA immediate window:

- `Pipelines.SmokeTestPipelineStorage`
- `Pipelines.SmokeTestRunPipeline`

These validate pipeline CRUD and a minimal source->export execution path.