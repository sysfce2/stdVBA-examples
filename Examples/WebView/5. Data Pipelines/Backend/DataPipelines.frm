VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} DataPipelines 
   Caption         =   "Data Pipelines"
   ClientHeight    =   9270.001
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   13155
   OleObjectBlob   =   "DataPipelines.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "DataPipelines"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Private Type TThis
  webview As stdWebView
End Type
Private Type WorkbookResult
  wb As Workbook
  wasAlreadyOpen As Boolean
End Type
Private This As TThis
Private Sub UserForm_Initialize()
  Call Pipelines.Init
  Set This.webview = stdWebView.CreateFromUserform(Me)
  With stdWindow.CreateFromIUnknown(Me)
    .isResizable = True
    .isMaximiseButtonVisible = True
    .isMinimiseButtonVisible = True
    .isAppWindow = True
    .setOwnerHandle 0
  End With
  Call This.webview.AddHostObject("vba", Me)
  
  Call This.webview.SetVirtualHostNameToFolderMapping("vbapipelines.data", ThisWorkbook.Path & "/Frontend")
  Call This.webview.Navigate("https://vbapipelines.data/index.html")
End Sub
Private Sub UserForm_Resize()
  This.webview.Resize
End Sub

'********************************
'* Pipline management API stubs *
'********************************

Public Function ListPipelinesJson() As String
  ListPipelinesJson = Pipelines.ListPipelinesJson()
End Function

Public Function GetPipelineJson(ByVal id As String) As String
  GetPipelineJson = Pipelines.GetPipelineJson(id)
End Function

Public Function SavePipelineJson(ByVal id As String, ByVal name As String, ByVal pipelineJson As String) As String
  SavePipelineJson = Pipelines.SavePipelineJson(id, name, pipelineJson)
End Function

Public Function DeletePipeline(ByVal id As String) As Boolean
  DeletePipeline = Pipelines.DeletePipeline(id)
End Function


'*******************************
'* Userform specific API stubs *
'*******************************

Public Function PickFile(ByVal extension As String) As String
  PickFile = ""

  Dim filterPattern As String
  filterPattern = BuildFileFilterPattern(extension)

  With Application.FileDialog(msoFileDialogFilePicker)
    .Title = "Select file"
    .AllowMultiSelect = False
    .Filters.Clear
    .Filters.Add "Matching files", filterPattern
    If .Show = -1 Then PickFile = CStr(.SelectedItems(1))
  End With
End Function

Public Function ListWorkbookTablesJson(Optional ByVal workbookPath As String = "") As String
  Dim workbookResult As WorkbookResult
  workbookResult = ResolveWorkbookFromPath(workbookPath)

  Dim wb As Workbook
  Set wb = workbookResult.wb

  On Error GoTo cleanup

  With stdJSON.Create(eJSONArray)
    Dim ws As Worksheet
    For Each ws In wb.Worksheets
      Dim lo As ListObject
      For Each lo In ws.ListObjects
        With .AddObject()
          Call .Add("name", lo.Name)
          Call .Add("sheet", ws.Name)
        End With
      Next
    Next

    ListWorkbookTablesJson = .ToString()
  End With
cleanup:
  Call CloseWorkbookIfNeeded(workbookResult)
  If Err.Number <> 0 Then
    Err.Raise Err.Number, Err.Source, Err.Description
  End If
End Function

Public Function ListCsvFieldsJson(ByVal filePath As String) As String
  Dim normalized As String
  normalized = Trim$(filePath)
  If Len(normalized) = 0 Then Err.Raise 5, "DataPipelines.ListCsvFieldsJson", "filePath is required."

  Dim csv As stdCSV
  Set csv = stdCSV.CreateFromFile(normalized)
  Dim headers As Variant
  headers = csv.Headers()

  With stdJSON.Create(eJSONArray)
    If Not IsEmpty(headers) Then
      Dim i As Long
      For i = LBound(headers) To UBound(headers)
        Call .Add(CStr(headers(i)))
      Next
    End If
    ListCsvFieldsJson = .ToString()
  End With
End Function

Public Function ListJsonFieldsJson(ByVal filePath As String) As String
  Dim fieldNames() As String
  fieldNames = JsonFieldNamesFromFile(filePath)
  ListJsonFieldsJson = StringArrayToJson(fieldNames)
End Function

Public Function ListTableFieldsJson(ByVal tableName As String, Optional ByVal workbookPath As String = "") As String
  Dim workbookResult As WorkbookResult
  workbookResult = ResolveWorkbookFromPath(workbookPath)

  Dim wb As Workbook
  Set wb = workbookResult.wb

  On Error GoTo cleanup

  Dim tableObject As ListObject
  Set tableObject = FindListObjectByName(wb, tableName)
  If tableObject Is Nothing Then
    Err.Raise 5, "DataPipelines.ListTableFieldsJson", "Table '" & tableName & "' was not found."
  End If

  With stdJSON.Create(eJSONArray)
    Dim headerCell As Range
    For Each headerCell In tableObject.HeaderRowRange.Cells
      Call .Add(CStr(headerCell.Value2))
    Next

    ListTableFieldsJson = .ToString()
  End With
cleanup:
  Call CloseWorkbookIfNeeded(workbookResult)
  If Err.Number <> 0 Then
    Err.Raise Err.Number, Err.Source, Err.Description
  End If
End Function

Public Function ListRangeFieldsJson( _
  ByVal sheetName As String, _
  ByVal rangeAddress As String, _
  Optional ByVal workbookPath As String = "", _
  Optional ByVal headers As Boolean = True _
) As String
  Dim workbookResult As WorkbookResult
  workbookResult = ResolveWorkbookFromPath(workbookPath)

  Dim wb As Workbook
  Set wb = workbookResult.wb

  On Error GoTo cleanup

  Dim ws As Worksheet
  On Error Resume Next
  Set ws = wb.Worksheets(sheetName)
  On Error GoTo 0
  If ws Is Nothing Then
    Err.Raise 5, "DataPipelines.ListRangeFieldsJson", "Worksheet '" & sheetName & "' was not found."
  End If

  Dim sourceRange As Range
  On Error Resume Next
  Set sourceRange = ws.Range(rangeAddress)
  On Error GoTo 0
  If sourceRange Is Nothing Then
    Err.Raise 5, "DataPipelines.ListRangeFieldsJson", "Range '" & rangeAddress & "' is invalid."
  End If

  Dim fieldNames() As String
  fieldNames = RangeFieldNames(sourceRange, headers)
  ListRangeFieldsJson = StringArrayToJson(fieldNames)

cleanup:
  Call CloseWorkbookIfNeeded(workbookResult)
  If Err.Number <> 0 Then
    Err.Raise Err.Number, Err.Source, Err.Description
  End If
End Function

Public Function ListWorkbookSheetsJson() As String
  With stdJSON.Create(eJSONArray)
    Dim ws As Worksheet
    For Each ws In ThisWorkbook.Worksheets
      Call .Add(ws.Name)
    Next

    ListWorkbookSheetsJson = .ToString()
  End With
End Function

'Call with `await chrome.webview.hostObjects.vba.RunPipeline(id)`
Public Function RunPipeline(ByVal id As String) As String
  Dim result As PipelineResult
  result = Pipelines.RunPipeline(id)
  RunPipeline = PipelineResultToJson(result)
End Function

Private Function PipelineResultToJson(ByRef result As PipelineResult) As String
  With stdJSON.Create(eJSONObject)
    Call .Add("success", result.success)
    Call .Add("errorMessage", result.errorMessage)
    Call .Add("failedNodeId", result.failedNodeId)
    Call .Add("outputTable", result.outputTable)
    Call .Add("previewJson", result.previewJson)
    PipelineResultToJson = .ToString()
  End With
End Function

Private Function ResolveWorkbookFromPath(ByVal workbookPath As String) As WorkbookResult
  Dim result As WorkbookResult
  If Len(Trim$(workbookPath)) = 0 Then
    Set result.wb = ThisWorkbook
    result.wasAlreadyOpen = True
  Else
    result = OpenOrGetWorkbook(workbookPath)
  End If
  ResolveWorkbookFromPath = result
End Function

Private Function OpenOrGetWorkbook(ByVal workbookPath As String) As WorkbookResult
  Dim normalized As String
  normalized = Trim$(workbookPath)
  If Len(normalized) = 0 Then
    Err.Raise 5, "DataPipelines.OpenOrGetWorkbook", "workbookPath is required."
  End If

  Dim wb As Workbook
  For Each wb In Application.Workbooks
    If StrComp(wb.FullName, normalized, vbTextCompare) = 0 Then
      Dim foundResult As WorkbookResult
      Set foundResult.wb = wb
      foundResult.wasAlreadyOpen = True
      OpenOrGetWorkbook = foundResult
      Exit Function
    End If
  Next

  Dim openedResult As WorkbookResult
  Set openedResult.wb = Application.Workbooks.Open(normalized, ReadOnly:=True)
  openedResult.wasAlreadyOpen = False
  OpenOrGetWorkbook = openedResult
End Function

Private Sub CloseWorkbookIfNeeded(ByRef result As WorkbookResult)
  If result.wasAlreadyOpen Then Exit Sub
  If result.wb Is Nothing Then Exit Sub
  result.wb.Close SaveChanges:=False
End Sub

Private Function FindListObjectByName(ByVal wb As Workbook, ByVal tableName As String) As ListObject
  Dim ws As Worksheet
  For Each ws In wb.Worksheets
    Dim lo As ListObject
    For Each lo In ws.ListObjects
      If StrComp(lo.Name, tableName, vbTextCompare) = 0 Then
        Set FindListObjectByName = lo
        Exit Function
      End If
    Next
  Next
End Function

Private Function BuildFileFilterPattern(ByVal extension As String) As String
  Dim spec As String
  spec = Trim$(extension)
  If Len(spec) = 0 Then
    BuildFileFilterPattern = "*.*"
    Exit Function
  End If

  Dim parts() As String
  parts = Split(spec, ";")

  Dim pattern As String
  pattern = ""

  Dim i As Long
  For i = LBound(parts) To UBound(parts)
    Dim token As String
    token = Trim$(parts(i))
    If Len(token) = 0 Then GoTo nextToken

    If InStr(token, "*") = 0 And InStr(token, "?") = 0 Then
      If Left$(token, 1) = "." Then token = Mid$(token, 2)
      token = "*." & token
    End If

    If Len(pattern) > 0 Then pattern = pattern & ";"
    pattern = pattern & token
nextToken:
  Next i

  If Len(pattern) = 0 Then pattern = "*.*"
  BuildFileFilterPattern = pattern
End Function

Private Function JsonFieldNamesFromFile(ByVal filePath As String) As String()
  Dim normalized As String
  normalized = Trim$(filePath)
  If Len(normalized) = 0 Then Err.Raise 5, "DataPipelines.JsonFieldNamesFromFile", "filePath is required."

  Dim root As stdJSON
  Set root = stdJSON.CreateFromFile(normalized)
  If root.JsonType <> eJSONArray Then
    Err.Raise 5, "DataPipelines.JsonFieldNamesFromFile", "JSON root must be an array of row objects."
  End If
  If root.Length = 0 Then
    JsonFieldNamesFromFile = Empty
    Exit Function
  End If

  Dim rows As Collection
  Set rows = root.ToVBObject()
  JsonFieldNamesFromFile = JsonFieldNamesFromRows(rows)
End Function

Private Function JsonFieldNamesFromRows(ByVal rows As Collection) As String()
  Dim headerMap As Object
  Set headerMap = CreateObject("Scripting.Dictionary")
  Dim row As Object
  Dim key As Variant
  For Each row In rows
    For Each key In row.Keys
      headerMap(CStr(key)) = True
    Next
  Next

  If headerMap.Count = 0 Then
    JsonFieldNamesFromRows = Empty
    Exit Function
  End If

  Dim headers() As String
  ReDim headers(1 To headerMap.Count)
  Dim i As Long
  i = 1
  For Each key In headerMap.Keys
    headers(i) = CStr(key)
    i = i + 1
  Next
  JsonFieldNamesFromRows = headers
End Function

Private Function StringArrayToJson(ByRef values() As String) As String
  With stdJSON.Create(eJSONArray)
    If Not IsEmpty(values) Then
      Dim i As Long
      For i = LBound(values) To UBound(values)
        Call .Add(values(i))
      Next
    End If
    StringArrayToJson = .ToString()
  End With
End Function

Private Function RangeFieldNames(ByVal sourceRange As Range, ByVal headers As Boolean) As String()
  Dim values As Variant
  values = sourceRange.Value2
  If Not IsArray(values) Then
    Dim singleHeader() As String
    ReDim singleHeader(1 To 1)
    singleHeader(1) = CStr(sourceRange.Value2)
    RangeFieldNames = singleHeader
    Exit Function
  End If

  Dim colCount As Long
  colCount = sourceRange.Columns.Count
  If colCount <= 0 Then
    RangeFieldNames = Empty
    Exit Function
  End If

  Dim out() As String
  ReDim out(1 To colCount)

  Dim col As Long
  For col = 1 To colCount
    If headers Then
      out(col) = CStr(values(1, col))
    Else
      out(col) = CStr(col)
    End If
  Next

  RangeFieldNames = out
End Function
