# SharePoint Updator (VBA)

This project is primarily a reusable SharePoint integration toolkit for VBA, centered on:
- `src/stdSharepointAuthenticator.frm` for browser-session authentication and cookie injection.
- `src/stdSharepointList.cls` for SharePoint list CRUD, querying, transforms, and batching.

`examples/ORMMissingData/*` is an example implementation showing how to build a typed wrapper on top of these core components.

## Core components

- `src/stdSharepointAuthenticator.frm`  
  Implements `stdICallable` so it can be passed into `stdHTTP` requests as an authenticator. It lazily opens a WebView, authenticates against SharePoint, and attaches the correct `Cookie` header for subsequent requests.

- `src/stdSharepointList.cls`  
  Generic SharePoint list REST client built for VBA. It handles list URL parsing, OData query generation, item transforms, form digest management, and batch request/response handling.

## What this enables

Using `stdSharepointAuthenticator` + `stdSharepointList`, you can:
- authenticate once through a real SharePoint web session,
- read single items and paged item collections,
- run in-place list queries for large lists,
- create, update, and delete items,
- execute high-volume batch operations,
- map SharePoint field types (person, multiperson, multichoice, lookup, date) to/from VBA-friendly payloads.

## Quick usage

```vb
Dim auth As stdSharepointAuthenticator
Set auth = stdSharepointAuthenticator.Create("https://contoso.sharepoint.com")

Dim list As stdSharepointList
Set list = stdSharepointList.Create( _
  "https://contoso.sharepoint.com/sites/Projects/Lists/Risks/AllItems.aspx", _
  auth _
)

Call list.FieldsAdd("Title", SharePointFieldText)
Call list.FieldsAdd("Owner", SharePointFieldPerson)

Dim rows As stdJSON
Set rows = list.ItemsGet()
Debug.Print rows.Length
```

## Example folder

- `examples/ORMMissingData/ORMMissingDataRow.cls`
- `examples/ORMMissingData/ContosoAuth.bas`
- `examples/ORMMissingData/mMain.bas`

These files are sample domain code that demonstrates one way to wrap `stdSharepointList` for a specific business list. They are not the main library surface.

## Requirements

- stdVBA dependencies used by this project (including `stdHTTP`, `stdJSON`, `stdICallable`, and `stdWebView`).
- A SharePoint tenant and permissions for the target list/site.
- Correct site/list URLs and field internal names in your consuming code.
