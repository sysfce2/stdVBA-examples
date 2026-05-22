Attribute VB_Name = "Pipelines"
Option Explicit

Public Type PipelineResult
  success As Boolean
  errorMessage As String
  failedNodeId As String
  outputTable As String
  previewJson As String
End Type

Private Const PIPELINES_SHEET_NAME As String = "__PIPELINES__"
Private Const PIPELINES_TABLE_NAME As String = "Pipelines"

Private Const COL_ID As Long = 1
Private Const COL_NAME As Long = 2
Private Const COL_PIPELINE_JSON As Long = 3
Private Const COL_CREATED_AT As Long = 4
Private Const COL_UPDATED_AT As Long = 5

Public Sub Init()
  Dim ws As Worksheet
  Dim lo As ListObject

  Set ws = GetOrCreatePipelinesSheet()
  Set lo = Nothing

  On Error Resume Next
  Set lo = ws.ListObjects(PIPELINES_TABLE_NAME)
  On Error GoTo 0

  If lo Is Nothing Then
    ws.Range("A1").Value2 = "Id"
    ws.Range("B1").Value2 = "Name"
    ws.Range("C1").Value2 = "PipelineJson"
    ws.Range("D1").Value2 = "CreatedAt"
    ws.Range("E1").Value2 = "UpdatedAt"
    Set lo = ws.ListObjects.Add(xlSrcRange, ws.Range("A1:E2"), , xlYes)
    lo.Name = PIPELINES_TABLE_NAME
    If lo.ListRows.Count > 0 Then lo.ListRows(1).Delete
  End If
End Sub

Public Function ListPipelinesJson() As String
  Init

  Dim payload As Collection
  Set payload = New Collection

  Dim lo As ListObject
  Set lo = GetPipelinesTable()

  Dim r As ListRow
  For Each r In lo.ListRows
    Dim item As Object
    Set item = CreateObject("Scripting.Dictionary")
    item.Add "id", CStr(r.Range(1, COL_ID).Value2)
    item.Add "name", CStr(r.Range(1, COL_NAME).Value2)
    item.Add "updatedAt", CStr(r.Range(1, COL_UPDATED_AT).Value2)
    payload.Add item
  Next

  ListPipelinesJson = stdJSON.CreateFromVariant(payload).ToString()
End Function

Public Function GetPipelineJson(ByVal id As String) As String
  Init
  Dim row As ListRow
  Set row = FindPipelineRowById(id)
  If row Is Nothing Then
    Err.Raise 5, "Pipelines.GetPipelineJson", "Pipeline '" & id & "' was not found."
  End If
  GetPipelineJson = CStr(row.Range(1, COL_PIPELINE_JSON).Value2)
End Function

Public Function SavePipelineJson(ByVal id As String, ByVal name As String, ByVal pipelineJson As String) As String
  Init
  Call ValidatePipelineJson(pipelineJson)

  Dim lo As ListObject
  Set lo = GetPipelinesTable()

  If Len(Trim$(id)) = 0 Then id = NewId()

  Dim nowText As String
  nowText = Format$(Now, "yyyy-mm-dd hh:nn:ss")

  Dim row As ListRow
  Set row = FindPipelineRowById(id)
  If row Is Nothing Then
    Set row = lo.ListRows.Add
    row.Range(1, COL_ID).Value2 = id
    row.Range(1, COL_CREATED_AT).Value2 = nowText
  End If

  row.Range(1, COL_NAME).Value2 = name
  row.Range(1, COL_PIPELINE_JSON).Value2 = pipelineJson
  row.Range(1, COL_UPDATED_AT).Value2 = nowText

  SavePipelineJson = id
End Function

Public Function DeletePipeline(ByVal id As String) As Boolean
  Init

  Dim row As ListRow
  Set row = FindPipelineRowById(id)
  If row Is Nothing Then
    DeletePipeline = False
    Exit Function
  End If

  row.Delete
  DeletePipeline = True
End Function

Public Function RunPipeline(ByVal id As String, Optional ByVal updatesCallback As stdICallable) As PipelineResult
  Dim res As PipelineResult
  On Error GoTo fail

  Dim pipelineJson As String
  pipelineJson = GetPipelineJson(id)

  Dim root As stdJSON
  Set root = stdJSON.CreateFromString(pipelineJson)

  If Not root.Exists("nodes") Then
    Err.Raise 5, "Pipelines.RunPipeline", "Pipeline JSON must include a 'nodes' array."
  End If
  If Not root.Exists("connections") Then
    Err.Raise 5, "Pipelines.RunPipeline", "Pipeline JSON must include a 'connections' array."
  End If

  Dim nodes As stdJSON
  Set nodes = root.Item("nodes")
  Dim connections As stdJSON
  Set connections = root.Item("connections")

  Dim nodeById As Object
  Set nodeById = CreateObject("Scripting.Dictionary")

  Dim incoming As Object
  Set incoming = CreateObject("Scripting.Dictionary")
  Dim outgoing As Object
  Set outgoing = CreateObject("Scripting.Dictionary")
  Dim indegree As Object
  Set indegree = CreateObject("Scripting.Dictionary")
  Dim processed As Object
  Set processed = CreateObject("Scripting.Dictionary")
  Dim outputs As Object
  Set outputs = CreateObject("Scripting.Dictionary")

  Dim i As Long
  For i = 1 To nodes.Length
    Dim node As stdJSON
    Set node = nodes.Item(i)
    Dim nodeId As String
    nodeId = CStr(node.Item("id"))
    Set nodeById(nodeId) = node
    Set incoming(nodeId) = New Collection
    Set outgoing(nodeId) = New Collection
    indegree(nodeId) = 0
    processed(nodeId) = False
  Next

  For i = 1 To connections.Length
    Dim conn As stdJSON
    Set conn = connections.Item(i)

    Dim fromId As String
    fromId = CStr(conn.Item("from"))
    Dim toId As String
    toId = CStr(conn.Item("to"))

    If Not nodeById.Exists(fromId) Then
      Err.Raise 5, "Pipelines.RunPipeline", "Connection source '" & fromId & "' does not exist."
    End If
    If Not nodeById.Exists(toId) Then
      Err.Raise 5, "Pipelines.RunPipeline", "Connection target '" & toId & "' does not exist."
    End If

    incoming(toId).Add conn
    outgoing(fromId).Add conn
    indegree(toId) = CLng(indegree(toId)) + 1
  Next

  Dim processedCount As Long
  processedCount = 0

  Do While processedCount < nodeById.Count
    Dim nextNodeId As String
    nextNodeId = NextReadyNodeId(indegree, processed)
    If Len(nextNodeId) = 0 Then
      Err.Raise 5, "Pipelines.RunPipeline", "Pipeline graph contains a cycle or unreachable dependency."
    End If

    Dim currentNode As stdJSON
    Set currentNode = nodeById(nextNodeId)
    Dim currentType As String
    currentType = CStr(currentNode.Item("type"))

    Dim currentOutput As stdTable
    Set currentOutput = ExecuteNode(currentNode, currentType, incoming(nextNodeId), outputs, res)
    If Not currentOutput Is Nothing Then
      Set outputs(nextNodeId) = currentOutput
    End If

    Call NotifyNodeCompleted(updatesCallback, nextNodeId, currentType)

    processed(nextNodeId) = True
    processedCount = processedCount + 1

    Dim c As Variant
    For Each c In outgoing(nextNodeId)
      indegree(CStr(c.Item("to"))) = CLng(indegree(CStr(c.Item("to")))) - 1
    Next
  Loop

  res.success = True
  RunPipeline = res
  Exit Function

fail:
  res.success = False
  res.errorMessage = Err.Description
  If Len(res.failedNodeId) = 0 Then res.failedNodeId = "<unknown>"
  RunPipeline = res
End Function

Public Sub SmokeTestPipelineStorage()
  Dim graph As Object
  Set graph = CreateObject("Scripting.Dictionary")
  graph.Add "schemaVersion", 1
  graph.Add "nodes", New Collection
  graph.Add "connections", New Collection

  Dim id As String
  id = SavePipelineJson("", "Smoke Storage", stdJSON.CreateFromVariant(graph).ToString())
  Debug.Assert Len(id) > 0
  Debug.Assert InStr(1, GetPipelineJson(id), """nodes""", vbTextCompare) > 0
  Debug.Assert DeletePipeline(id)
End Sub

Public Sub SmokeTestRunPipeline()
  Dim sourceTableName As String
  sourceTableName = EnsureSmokeSourceTable()

  Dim pipelineJson As String
  pipelineJson = BuildSmokePipelineJson(sourceTableName)

  Dim id As String
  id = SavePipelineJson("", "Smoke Run", pipelineJson)

  Dim result As PipelineResult
  result = RunPipeline(id)
  Debug.Assert result.success

  Dim transformPipelineJson As String
  transformPipelineJson = BuildSmokeTransformsPipelineJson(sourceTableName)
  id = SavePipelineJson("", "Smoke Transforms", transformPipelineJson)
  result = RunPipeline(id)
  Debug.Assert result.success

  Dim rangePipelineJson As String
  rangePipelineJson = BuildSmokeRangePipelineJson()
  id = SavePipelineJson("", "Smoke Range Source", rangePipelineJson)
  result = RunPipeline(id)
  Debug.Assert result.success
End Sub

Private Function ExecuteNode(ByVal node As stdJSON, ByVal nodeType As String, ByVal nodeInputs As Collection, ByVal outputs As Object, ByRef result As PipelineResult) As stdTable
  Dim params As stdJSON
  If node.Exists("params") Then Set params = node.Item("params")

  result.failedNodeId = CStr(node.Item("id"))

  Select Case LCase$(nodeType)
    Case "source.table"
      Dim sourceWorkbook As Workbook
      Set sourceWorkbook = ResolveSourceWorkbook(params)
      Set ExecuteNode = stdTable.CreateFromTableByName(CStr(params.Item("tableName")), , sourceWorkbook)
      Set ExecuteNode = ApplySourceFieldsIfPresent(ExecuteNode, params)

    Case "source.range"
      Set ExecuteNode = CreateTableFromExcelRange(params)
      Set ExecuteNode = ApplySourceFieldsIfPresent(ExecuteNode, params)

    Case "source.csv"
      Set ExecuteNode = CreateTableFromCsvFile(CStr(params.Item("filePath")))
      Set ExecuteNode = ApplySourceFieldsIfPresent(ExecuteNode, params)

    Case "source.json"
      Set ExecuteNode = CreateTableFromJsonFile(CStr(params.Item("filePath")))
      Set ExecuteNode = ApplySourceFieldsIfPresent(ExecuteNode, params)

    Case "transform.filter"
      Dim filterInput As stdTable
      Set filterInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = filterInput.Filter(stdLambda.Create(CStr(params.Item("expression"))))

    Case "transform.fieldadd"
      Dim addInput As stdTable
      Set addInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = addInput.FieldAdd(CStr(params.Item("fieldName")), stdLambda.Create(CStr(params.Item("expression"))))

    Case "transform.fieldupdate"
      Dim updateInput As stdTable
      Set updateInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = updateInput.FieldUpdate(CStr(params.Item("fieldName")), stdLambda.Create(CStr(params.Item("expression"))))

    Case "transform.fieldupdatestatic"
      Dim updateStaticInput As stdTable
      Set updateStaticInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = updateStaticInput.FieldUpdateStatic(CStr(params.Item("fieldName")), params.Item("value"))

    Case "transform.fieldexpand"
      Dim expandInput As stdTable
      Set expandInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = expandInput.FieldExpand(CStr(params.Item("fieldName")))

    Case "transform.join"
      Dim leftInput As stdTable
      Set leftInput = ResolveInputTable(nodeInputs, outputs, "left")
      Dim rightInput As stdTable
      Set rightInput = ResolveInputTable(nodeInputs, outputs, "right")
      Set ExecuteNode = leftInput.Join( _
        rightInput, _
        CStr(params.Item("leftField")), _
        CStr(params.Item("rightField")), _
        CStr(GetOptionalString(params, "alias")), _
        CBool(GetOptionalBoolean(params, "returnOne", False)) _
      )

    Case "transform.groupby"
      Dim groupInput As stdTable
      Set groupInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = groupInput.GroupByField( _
        CStr(params.Item("fieldName")), _
        CStr(GetOptionalString(params, "virtualName", "group")) _
      )

    Case "transform.groupbykey"
      Dim groupByKeyInput As stdTable
      Set groupByKeyInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = groupByKeyInput.GroupBy( _
        stdLambda.Create(CStr(params.Item("expression"))), _
        CStr(GetOptionalString(params, "keyName", "groupKey")), _
        CStr(GetOptionalString(params, "virtualName", "group")) _
      )

    Case "transform.select"
      Dim selectInput As stdTable
      Set selectInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = SelectFields(selectInput, params)

    Case "transform.fieldsremove"
      Dim removeInput As stdTable
      Set removeInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = RemoveFields(removeInput, params)

    Case "transform.fieldsrename"
      Dim renameInput As stdTable
      Set renameInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = RenameFields(renameInput, params)

    Case "transform.foreach"
      Dim forEachInput As stdTable
      Set forEachInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = forEachInput.ForEach(CreateLambdaFromExpression(CStr(params.Item("expression"))))

    Case "transform.reverse"
      Dim reverseInput As stdTable
      Set reverseInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = reverseInput.Reverse()

    Case "transform.unique"
      Dim uniqueInput As stdTable
      Set uniqueInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = uniqueInput.Unique(stdLambda.Create(CStr(params.Item("expression"))))

    Case "transform.concat"
      Dim concatMain As stdTable
      Dim concatAppend As stdTable
      Dim concatOut As stdTable
      Set concatMain = ResolveInputTable(nodeInputs, outputs, "main")
      Set concatAppend = ResolveInputTable(nodeInputs, outputs, "right")
      Set concatOut = concatMain.Clone()
      Call concatOut.Concat(concatAppend.Rows.ToCollection())
      Set ExecuteNode = concatOut

    Case "transform.clone"
      Dim cloneInput As stdTable
      Set cloneInput = ResolveInputTable(nodeInputs, outputs, "main")
      Set ExecuteNode = cloneInput.Clone()

    Case "sink.exporttable"
      Dim exportInput As stdTable
      Set exportInput = ResolveInputTable(nodeInputs, outputs, "main")
      Dim outTableName As String
      outTableName = CStr(params.Item("tableName"))
      Dim outSheetName As String
      outSheetName = CStr(params.Item("sheetName"))
      Call ExportToTable(exportInput, outSheetName, outTableName, CStr(GetOptionalString(params, "workbookMode", "me")))
      result.outputTable = outTableName
      Set ExecuteNode = exportInput

    Case "sink.exportcsv"
      Dim exportCsvInput As stdTable
      Set exportCsvInput = ResolveInputTable(nodeInputs, outputs, "main")
      Call ExportToCsv(exportCsvInput, CStr(params.Item("filePath")))
      result.outputTable = CStr(params.Item("filePath"))
      Set ExecuteNode = exportCsvInput

    Case "sink.exportjson"
      Dim exportJsonInput As stdTable
      Set exportJsonInput = ResolveInputTable(nodeInputs, outputs, "main")
      Call ExportToJson(exportJsonInput, CStr(params.Item("filePath")))
      result.outputTable = CStr(params.Item("filePath"))
      Set ExecuteNode = exportJsonInput

    Case "sink.preview"
      Set ExecuteNode = ResolveInputTable(nodeInputs, outputs, "main")
      result.previewJson = BuildPreviewJson(ExecuteNode, 100)

    Case Else
      Err.Raise 5, "Pipelines.ExecuteNode", "Unsupported node type: " & nodeType
  End Select
End Function

Private Function EnsureSmokeSourceTable() As String
  Const tableName As String = "__SMOKE_SOURCE__"
  Const sheetName As String = "__PIPELINES_SMOKE__"

  Dim ws As Worksheet
  On Error Resume Next
  Set ws = ThisWorkbook.Worksheets(sheetName)
  On Error GoTo 0
  If ws Is Nothing Then
    Set ws = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
    ws.Name = sheetName
  End If

  Dim lo As ListObject
  On Error Resume Next
  Set lo = ws.ListObjects(tableName)
  On Error GoTo 0
  If Not lo Is Nothing Then lo.Delete

  ws.Cells.Clear
  ws.Range("A1").Value2 = "id"
  ws.Range("B1").Value2 = "value"
  ws.Range("A2").Value2 = 1
  ws.Range("B2").Value2 = "alpha"
  ws.Range("A3").Value2 = 2
  ws.Range("B3").Value2 = "beta"
  Set lo = ws.ListObjects.Add(xlSrcRange, ws.Range("A1:B3"), , xlYes)
  lo.Name = tableName

  EnsureSmokeSourceTable = tableName
End Function

Private Function BuildSmokePipelineJson(ByVal sourceTableName As String) As String
  Dim nodes As Collection
  Set nodes = New Collection
  nodes.Add BuildNode("n1", "source.table", CreateParams("tableName", sourceTableName))
  nodes.Add BuildNode("n2", "sink.exportTable", CreateParams( _
    "sheetName", "__PIPELINES_SMOKE_OUT__", _
    "tableName", "__SMOKE_OUTPUT__", _
    "workbookMode", "me" _
  ))

  Dim connections As Collection
  Set connections = New Collection
  connections.Add BuildConnection("c1", "n1", "n2", "main")

  Dim graph As Object
  Set graph = CreateObject("Scripting.Dictionary")
  graph.Add "schemaVersion", 1
  graph.Add "nodes", nodes
  graph.Add "connections", connections

  BuildSmokePipelineJson = stdJSON.CreateFromVariant(graph).ToString()
End Function

Private Function BuildSmokeTransformsPipelineJson(ByVal sourceTableName As String) As String
  Dim nodes As Collection
  Set nodes = New Collection
  nodes.Add BuildNode("n1", "source.table", CreateParams("tableName", sourceTableName))
  nodes.Add BuildNode("n2", "transform.clone", CreateParams())
  nodes.Add BuildNode("n3", "transform.concat", CreateParams())
  nodes.Add BuildNode("n4", "transform.fieldUpdate", CreateParams("fieldName", "value", "expression", "$1.value"))
  nodes.Add BuildNode("n5", "transform.fieldUpdateStatic", CreateParams("fieldName", "value", "value", "patched"))
  nodes.Add BuildNode("n6", "transform.forEach", CreateParams("expression", "let $1.item(""value"") = $1.item(""value"")"))
  nodes.Add BuildNode("n7", "transform.unique", CreateParams("expression", "$1.id"))
  nodes.Add BuildNode("n8", "transform.reverse", CreateParams())
  nodes.Add BuildNode("n9", "transform.select", CreateParams("fields", BuildStringCollection(Array("id", "value"))))
  nodes.Add BuildNode("n10", "transform.fieldsRename", CreateParams("renames", BuildRenameCollection("value", "value_text")))
  nodes.Add BuildNode("n11", "transform.fieldsRemove", CreateParams("fields", BuildStringCollection(Array("value_text"))))
  nodes.Add BuildNode("n12", "transform.groupByKey", CreateParams("expression", "$1.id", "keyName", "idKey", "virtualName", "group"))
  nodes.Add BuildNode("n13", "sink.preview", CreateParams())

  Dim connections As Collection
  Set connections = New Collection
  connections.Add BuildConnection("c1", "n1", "n2", "main")
  connections.Add BuildConnection("c2", "n1", "n3", "main")
  connections.Add BuildConnection("c3", "n2", "n3", "right")
  connections.Add BuildConnection("c4", "n3", "n4", "main")
  connections.Add BuildConnection("c5", "n4", "n5", "main")
  connections.Add BuildConnection("c6", "n5", "n6", "main")
  connections.Add BuildConnection("c7", "n6", "n7", "main")
  connections.Add BuildConnection("c8", "n7", "n8", "main")
  connections.Add BuildConnection("c9", "n8", "n9", "main")
  connections.Add BuildConnection("c10", "n9", "n10", "main")
  connections.Add BuildConnection("c11", "n10", "n11", "main")
  connections.Add BuildConnection("c12", "n11", "n12", "main")
  connections.Add BuildConnection("c13", "n12", "n13", "main")

  Dim graph As Object
  Set graph = CreateObject("Scripting.Dictionary")
  graph.Add "schemaVersion", 1
  graph.Add "nodes", nodes
  graph.Add "connections", connections

  BuildSmokeTransformsPipelineJson = stdJSON.CreateFromVariant(graph).ToString()
End Function

Private Function BuildSmokeRangePipelineJson() As String
  Dim nodes As Collection
  Set nodes = New Collection
  nodes.Add BuildNode("n1", "source.range", CreateParams( _
    "sheetName", "__PIPELINES_SMOKE__", _
    "rangeAddress", "A1:B3", _
    "headers", True _
  ))
  nodes.Add BuildNode("n2", "sink.preview", CreateParams())

  Dim connections As Collection
  Set connections = New Collection
  connections.Add BuildConnection("c1", "n1", "n2", "main")

  Dim graph As Object
  Set graph = CreateObject("Scripting.Dictionary")
  graph.Add "schemaVersion", 1
  graph.Add "nodes", nodes
  graph.Add "connections", connections

  BuildSmokeRangePipelineJson = stdJSON.CreateFromVariant(graph).ToString()
End Function

Private Function BuildNode(ByVal id As String, ByVal nodeType As String, ByVal params As Object) As Object
  Dim node As Object
  Set node = CreateObject("Scripting.Dictionary")
  node.Add "id", id
  node.Add "type", nodeType
  node.Add "params", params
  Set BuildNode = node
End Function

Private Function BuildConnection(ByVal id As String, ByVal fromId As String, ByVal toId As String, ByVal inputName As String) As Object
  Dim conn As Object
  Set conn = CreateObject("Scripting.Dictionary")
  conn.Add "id", id
  conn.Add "from", fromId
  conn.Add "to", toId
  conn.Add "input", inputName
  Set BuildConnection = conn
End Function

Private Function CreateParams(ParamArray keyValues() As Variant) As Object
  Dim params As Object
  Set params = CreateObject("Scripting.Dictionary")
  If (Not Not keyValues) = 0 Then
    Set CreateParams = params
    Exit Function
  End If

  If (UBound(keyValues) - LBound(keyValues) + 1) Mod 2 <> 0 Then
    Err.Raise 5, "Pipelines.CreateParams", "CreateParams requires key/value pairs."
  End If

  Dim i As Long
  For i = LBound(keyValues) To UBound(keyValues) Step 2
    params.Add CStr(keyValues(i)), keyValues(i + 1)
  Next
  Set CreateParams = params
End Function

Private Function BuildStringCollection(ByVal values As Variant) As Collection
  Dim out As Collection
  Set out = New Collection
  Dim i As Long
  For i = LBound(values) To UBound(values)
    out.Add CStr(values(i))
  Next
  Set BuildStringCollection = out
End Function

Private Function BuildRenameCollection(ByVal fromName As String, ByVal toName As String) As Collection
  Dim out As Collection
  Set out = New Collection
  Dim pair As Object
  Set pair = CreateObject("Scripting.Dictionary")
  pair.Add "from", fromName
  pair.Add "to", toName
  out.Add pair
  Set BuildRenameCollection = out
End Function

Private Function ResolveInputTable(ByVal nodeInputs As Collection, ByVal outputs As Object, ByVal inputName As String) As stdTable
  Dim conn As Variant
  For Each conn In nodeInputs
    Dim candidateInput As String
    candidateInput = "main"
    If conn.Exists("input") Then
      candidateInput = LCase$(CStr(conn.Item("input")))
    End If
    If LCase$(inputName) = candidateInput Then
      Dim sourceNodeId As String
      sourceNodeId = CStr(conn.Item("from"))
      If outputs.Exists(sourceNodeId) Then
        Set ResolveInputTable = outputs(sourceNodeId)
        Exit Function
      End If
    End If
  Next

  If LCase$(inputName) <> "main" Then
    For Each conn In nodeInputs
      Dim fallbackSourceNodeId As String
      fallbackSourceNodeId = CStr(conn.Item("from"))
      If outputs.Exists(fallbackSourceNodeId) Then
        Set ResolveInputTable = outputs(fallbackSourceNodeId)
        Exit Function
      End If
    Next
  End If

  Err.Raise 5, "Pipelines.ResolveInputTable", "No input connected for '" & inputName & "'."
End Function

Private Function SelectFields(ByVal src As stdTable, ByVal params As stdJSON) As stdTable
  If Not params.Exists("fields") Then
    Err.Raise 5, "Pipelines.SelectFields", "'fields' is required for transform.select."
  End If

  Dim fields() As String
  fields = JsonArrayToStringArray(params.Item("fields"))
  If Not HasStringArrayValues(fields) Then
    Err.Raise 5, "Pipelines.SelectFields", "At least one field must be selected."
  End If
  Set SelectFields = BuildProjectionTable(src, fields)
End Function

Private Function RemoveFields(ByVal src As stdTable, ByVal params As stdJSON) As stdTable
  If Not params.Exists("fields") Then
    Err.Raise 5, "Pipelines.RemoveFields", "'fields' is required for transform.fieldsRemove."
  End If

  Dim removeFields() As String
  removeFields = JsonArrayToStringArray(params.Item("fields"))
  If Not HasStringArrayValues(removeFields) Then
    Set RemoveFields = src.Clone()
    Exit Function
  End If

  Dim removeMap As Object
  Set removeMap = CreateObject("Scripting.Dictionary")
  Dim i As Long
  For i = LBound(removeFields) To UBound(removeFields)
    removeMap(LCase$(removeFields(i))) = True
  Next

  Dim keep As Collection
  Set keep = New Collection
  Dim headers As Variant
  headers = src.Headers
  For i = LBound(headers) To UBound(headers)
    If Not removeMap.Exists(LCase$(CStr(headers(i)))) Then
      keep.Add CStr(headers(i))
    End If
  Next

  If keep.Count = 0 Then
    Err.Raise 5, "Pipelines.RemoveFields", "At least one field must remain after transform.fieldsRemove."
  End If

  Dim keepFields() As String
  ReDim keepFields(1 To keep.Count)
  For i = 1 To keep.Count
    keepFields(i) = CStr(keep(i))
  Next
  Set RemoveFields = BuildProjectionTable(src, keepFields)
End Function

Private Function RenameFields(ByVal src As stdTable, ByVal params As stdJSON) As stdTable
  If Not params.Exists("renames") Then
    Set RenameFields = src.Clone()
    Exit Function
  End If

  Dim renames As stdJSON
  Set renames = params.Item("renames")
  Dim renameMap As Object
  Set renameMap = CreateObject("Scripting.Dictionary")

  Dim i As Long
  For i = 1 To renames.Length
    Dim pair As stdJSON
    Set pair = renames.Item(i)
    Dim fromName As String
    Dim toName As String
    fromName = Trim$(CStr(GetOptionalString(pair, "from", "")))
    toName = Trim$(CStr(GetOptionalString(pair, "to", "")))
    If Len(fromName) > 0 And Len(toName) > 0 Then
      renameMap(LCase$(fromName)) = toName
    End If
  Next

  If renameMap.Count = 0 Then
    Set RenameFields = src.Clone()
    Exit Function
  End If

  Dim sourceHeaders As Variant
  sourceHeaders = src.Headers
  Dim outHeaders() As String
  ReDim outHeaders(LBound(sourceHeaders) To UBound(sourceHeaders))
  For i = LBound(sourceHeaders) To UBound(sourceHeaders)
    Dim current As String
    current = CStr(sourceHeaders(i))
    If renameMap.Exists(LCase$(current)) Then
      outHeaders(i) = CStr(renameMap(LCase$(current)))
    Else
      outHeaders(i) = current
    End If
  Next

  Dim rows As Collection
  Set rows = New Collection
  Dim row As Variant
  For Each row In src.Rows
    Dim rowOut As Object
    Set rowOut = CreateObject("Scripting.Dictionary")
    For i = LBound(sourceHeaders) To UBound(sourceHeaders)
      current = CStr(sourceHeaders(i))
      rowOut(outHeaders(i)) = row(current)
    Next
    rows.Add rowOut
  Next

  Set RenameFields = stdTable.Create(src.Name, stdEnumerator.CreateFromIEnumVariant(rows), outHeaders)
End Function

Private Function BuildProjectionTable(ByVal src As stdTable, ByRef fields() As String) As stdTable
  Dim rows As Collection
  Set rows = New Collection

  Dim row As Variant
  For Each row In src.Rows
    Dim rowOut As Object
    Set rowOut = CreateObject("Scripting.Dictionary")
    Dim i As Long
    For i = LBound(fields) To UBound(fields)
      rowOut(fields(i)) = row(fields(i))
    Next
    rows.Add rowOut
  Next

  Set BuildProjectionTable = stdTable.Create(src.Name, stdEnumerator.CreateFromIEnumVariant(rows), fields)
End Function

Private Function JsonArrayToStringArray(ByVal arr As stdJSON) As String()
  Dim values() As String
  If arr Is Nothing Or arr.Length = 0 Then
    JsonArrayToStringArray = values
    Exit Function
  End If

  Dim i As Long
  ReDim values(1 To arr.Length)
  For i = 1 To arr.Length
    values(i) = CStr(arr.Item(i))
  Next
  JsonArrayToStringArray = values
End Function

Private Function ApplySourceFieldsIfPresent(ByVal table As stdTable, ByVal params As stdJSON) As stdTable
  If table Is Nothing Then
    Set ApplySourceFieldsIfPresent = table
    Exit Function
  End If
  If params Is Nothing Or Not params.Exists("fields") Then
    Set ApplySourceFieldsIfPresent = table
    Exit Function
  End If

  Dim fields() As String
  fields = JsonArrayToStringArray(params.Item("fields"))
  If Not HasStringArrayValues(fields) Then
    Set ApplySourceFieldsIfPresent = table
  Else
    Set ApplySourceFieldsIfPresent = BuildProjectionTable(table, fields)
  End If
End Function

Private Function HasStringArrayValues(ByRef values() As String) As Boolean
  On Error GoTo noValues
  HasStringArrayValues = (UBound(values) >= LBound(values))
  Exit Function
noValues:
  HasStringArrayValues = False
End Function

Private Function BuildPreviewJson(ByVal table As stdTable, ByVal maxRows As Long) As String
  Dim allRows As Collection
  Set allRows = table.Rows.ToCollection()

  Dim limited As Collection
  Set limited = New Collection
  Dim i As Long
  For i = 1 To allRows.Count
    If i > maxRows Then Exit For
    limited.Add allRows(i)
  Next

  BuildPreviewJson = stdJSON.CreateFromVariant(limited).ToString()
End Function

Private Function CreateLambdaFromExpression(ByVal expression As String) As stdLambda
  Dim normalized As String
  normalized = Replace(CStr(expression), vbCr, "")
  If InStr(normalized, vbLf) > 0 Then
    Dim lines() As String
    lines = Split(normalized, vbLf)
    Set CreateLambdaFromExpression = stdLambda.CreateMultiline(lines)
  Else
    Set CreateLambdaFromExpression = stdLambda.Create(normalized)
  End If
End Function

Private Function CreateTableFromExcelRange(ByVal params As stdJSON) As stdTable
  Dim sourceWorkbook As Workbook
  Set sourceWorkbook = ResolveSourceWorkbook(params)

  Dim sheetName As String
  sheetName = Trim$(CStr(params.Item("sheetName")))
  Dim rangeAddress As String
  rangeAddress = Trim$(CStr(params.Item("rangeAddress")))
  If Len(sheetName) = 0 Then Err.Raise 5, "Pipelines.CreateTableFromExcelRange", "sheetName is required."
  If Len(rangeAddress) = 0 Then Err.Raise 5, "Pipelines.CreateTableFromExcelRange", "rangeAddress is required."

  Dim ws As Worksheet
  On Error Resume Next
  Set ws = sourceWorkbook.Worksheets(sheetName)
  On Error GoTo 0
  If ws Is Nothing Then
    Err.Raise 5, "Pipelines.CreateTableFromExcelRange", "Worksheet '" & sheetName & "' was not found."
  End If

  Dim sourceRange As Range
  On Error Resume Next
  Set sourceRange = ws.Range(rangeAddress)
  On Error GoTo 0
  If sourceRange Is Nothing Then
    Err.Raise 5, "Pipelines.CreateTableFromExcelRange", "Range '" & rangeAddress & "' is invalid."
  End If

  Set CreateTableFromExcelRange = stdTable.CreateFromExcelRange(sourceRange, GetOptionalBoolean(params, "headers", True))
End Function

Private Function CreateTableFromCsvFile(ByVal filePath As String) As stdTable
  Dim normalized As String
  normalized = Trim$(filePath)
  If Len(normalized) = 0 Then Err.Raise 5, "Pipelines.CreateTableFromCsvFile", "filePath is required."

  Dim csv As stdCSV
  Set csv = stdCSV.CreateFromFile(normalized)
  Dim arr As Variant
  arr = csv.toArray()
  If Not IsArray(arr) Then Err.Raise 5, "Pipelines.CreateTableFromCsvFile", "CSV file contains no data."

  Set CreateTableFromCsvFile = stdTable.CreateFromArray2D(FileNameFromPath(normalized), arr, True)
End Function

Private Function CreateTableFromJsonFile(ByVal filePath As String) As stdTable
  Dim normalized As String
  normalized = Trim$(filePath)
  If Len(normalized) = 0 Then Err.Raise 5, "Pipelines.CreateTableFromJsonFile", "filePath is required."

  Dim root As stdJSON
  Set root = stdJSON.CreateFromFile(normalized)
  If root.JsonType <> eJSONArray Then
    Err.Raise 5, "Pipelines.CreateTableFromJsonFile", "JSON root must be an array of row objects."
  End If
  If root.Length = 0 Then Err.Raise 5, "Pipelines.CreateTableFromJsonFile", "JSON array is empty."

  Dim rows As Collection
  Set rows = root.ToVBObject()
  Dim headers() As String
  headers = JsonFieldNamesFromRows(rows)

  Dim cc As Collection
  Set cc = New Collection
  Dim row As Object
  For Each row In rows
    cc.Add row
  Next

  Set CreateTableFromJsonFile = stdTable.Create(FileNameFromPath(normalized), stdEnumerator.CreateFromIEnumVariant(cc), headers)
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

Private Sub ExportToCsv(ByVal table As stdTable, ByVal filePath As String)
  Dim normalized As String
  normalized = Trim$(filePath)
  If Len(normalized) = 0 Then Err.Raise 5, "Pipelines.ExportToCsv", "filePath is required."

  Dim arr As Variant
  arr = table.ToArray2D()
  Dim csv As stdCSV
  Set csv = stdCSV.CreateFromArray(arr, True)
  Call csv.toCSV(normalized)
End Sub

Private Sub ExportToJson(ByVal table As stdTable, ByVal filePath As String)
  Dim normalized As String
  normalized = Trim$(filePath)
  If Len(normalized) = 0 Then Err.Raise 5, "Pipelines.ExportToJson", "filePath is required."

  Dim jsonText As String
  jsonText = table.ToJSON()
  Call WriteTextFile(normalized, jsonText)
End Sub

Private Sub WriteTextFile(ByVal filePath As String, ByVal contents As String)
  Dim ff As Long
  ff = FreeFile
  Open filePath For Output As #ff
  Print #ff, contents;
  Close #ff
End Sub

Private Function FileNameFromPath(ByVal filePath As String) As String
  Dim normalized As String
  normalized = Replace(filePath, "/", "\")
  Dim pos As Long
  pos = InStrRev(normalized, "\")
  If pos > 0 Then
    FileNameFromPath = Mid$(normalized, pos + 1)
  Else
    FileNameFromPath = normalized
  End If
End Function

Private Sub ExportToTable(ByVal table As stdTable, ByVal sheetName As String, ByVal tableName As String, ByVal workbookMode As String)
  If Len(Trim$(sheetName)) = 0 Then Err.Raise 5, "Pipelines.ExportToTable", "sheetName is required."
  If Len(Trim$(tableName)) = 0 Then Err.Raise 5, "Pipelines.ExportToTable", "tableName is required."

  Dim targetWorkbook As Workbook
  If LCase$(Trim$(workbookMode)) = "new" Then
    Set targetWorkbook = Application.Workbooks.Add
  Else
    Set targetWorkbook = ThisWorkbook
  End If

  Dim ws As Worksheet
  Set ws = Nothing
  On Error Resume Next
  Set ws = targetWorkbook.Worksheets(sheetName)
  On Error GoTo 0
  If ws Is Nothing Then
    Set ws = targetWorkbook.Worksheets.Add(After:=targetWorkbook.Worksheets(targetWorkbook.Worksheets.Count))
    ws.Name = sheetName
  End If

  Dim lo As ListObject
  Set lo = Nothing
  On Error Resume Next
  Set lo = ws.ListObjects(tableName)
  On Error GoTo 0

  If Not lo Is Nothing Then
    If Not lo.DataBodyRange Is Nothing Then lo.DataBodyRange.Delete
    lo.Range.Clear
    lo.Delete
  End If

  Call table.ToListObject(ws.Range("A1"), tableName, False, False)
End Sub

Private Sub ValidatePipelineJson(ByVal pipelineJson As String)
  Dim root As stdJSON
  Set root = stdJSON.CreateFromString(pipelineJson)
  If Not root.Exists("nodes") Then
    Err.Raise 5, "Pipelines.ValidatePipelineJson", "Pipeline JSON must include a 'nodes' array."
  End If
  If Not root.Exists("connections") Then
    Err.Raise 5, "Pipelines.ValidatePipelineJson", "Pipeline JSON must include a 'connections' array."
  End If
End Sub

Private Sub NotifyNodeCompleted(ByVal callback As stdICallable, ByVal nodeId As String, ByVal nodeType As String)
  On Error Resume Next
  If Not callback Is Nothing Then
    Call callback.Run(nodeId, nodeType)
  End If
  On Error GoTo 0
End Sub

Private Function NextReadyNodeId(ByVal indegree As Object, ByVal processed As Object) As String
  Dim best As String
  best = ""

  Dim key As Variant
  For Each key In indegree.Keys
    If (Not CBool(processed(key))) And CLng(indegree(key)) = 0 Then
      If Len(best) = 0 Or CStr(key) < best Then
        best = CStr(key)
      End If
    End If
  Next

  NextReadyNodeId = best
End Function

Private Function GetOrCreatePipelinesSheet() As Worksheet
  Dim ws As Worksheet
  On Error Resume Next
  Set ws = ThisWorkbook.Worksheets(PIPELINES_SHEET_NAME)
  On Error GoTo 0
  If ws Is Nothing Then
    Set ws = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
    ws.Name = PIPELINES_SHEET_NAME
  End If
  Set GetOrCreatePipelinesSheet = ws
End Function

Private Function GetPipelinesTable() As ListObject
  Init
  Set GetPipelinesTable = ThisWorkbook.Worksheets(PIPELINES_SHEET_NAME).ListObjects(PIPELINES_TABLE_NAME)
End Function

Private Function FindPipelineRowById(ByVal id As String) As ListRow
  Dim lo As ListObject
  Set lo = GetPipelinesTable()

  Dim r As ListRow
  For Each r In lo.ListRows
    If CStr(r.Range(1, COL_ID).Value2) = id Then
      Set FindPipelineRowById = r
      Exit Function
    End If
  Next
End Function

Private Function NewId() As String
  Randomize
  NewId = Replace(CStr(Now * 86400000#) & "-" & CLng(Rnd() * 1000000000#), " ", "")
End Function

Private Function ResolveSourceWorkbook(ByVal params As stdJSON) As Workbook
  Dim mode As String
  mode = LCase$(Trim$(GetOptionalString(params, "workbookMode", "me")))

  If mode <> "other" Then
    Set ResolveSourceWorkbook = ThisWorkbook
    Exit Function
  End If

  Dim path As String
  path = Trim$(GetOptionalString(params, "workbookPath", ""))
  If Len(path) = 0 Then
    Err.Raise 5, "Pipelines.ResolveSourceWorkbook", "workbookPath is required when workbookMode is 'other'."
  End If

  Set ResolveSourceWorkbook = OpenOrGetWorkbook(path)
End Function

Private Function OpenOrGetWorkbook(ByVal workbookPath As String) As Workbook
  Dim normalized As String
  normalized = Trim$(workbookPath)
  If Len(normalized) = 0 Then
    Err.Raise 5, "Pipelines.OpenOrGetWorkbook", "workbookPath is required."
  End If

  Dim wb As Workbook
  For Each wb In Application.Workbooks
    If StrComp(wb.FullName, normalized, vbTextCompare) = 0 Then
      Set OpenOrGetWorkbook = wb
      Exit Function
    End If
  Next

  Set OpenOrGetWorkbook = Application.Workbooks.Open(normalized, ReadOnly:=True)
End Function

Private Function GetOptionalString(ByVal obj As stdJSON, ByVal key As String, Optional ByVal fallback As String = "") As String
  If obj Is Nothing Then
    GetOptionalString = fallback
  ElseIf obj.Exists(key) Then
    GetOptionalString = CStr(obj.Item(key))
  Else
    GetOptionalString = fallback
  End If
End Function

Private Function GetOptionalBoolean(ByVal obj As stdJSON, ByVal key As String, ByVal fallback As Boolean) As Boolean
  If obj Is Nothing Then
    GetOptionalBoolean = fallback
  ElseIf obj.Exists(key) Then
    GetOptionalBoolean = CBool(obj.Item(key))
  Else
    GetOptionalBoolean = fallback
  End If
End Function
