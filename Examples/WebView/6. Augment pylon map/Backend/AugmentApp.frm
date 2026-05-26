VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} AugmentApp 
   Caption         =   "Data Pipelines"
   ClientHeight    =   9270.001
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   13155
   OleObjectBlob   =   "AugmentApp.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "AugmentApp"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Private Type TThis
  webview As stdWebView
  pylons as ListObject
End Type
Private Type WorkbookResult
  wb As Workbook
  wasAlreadyOpen As Boolean
End Type
Private This As TThis
Private Sub UserForm_Initialize()
  Set This.webview = stdWebView.CreateFromUserform(Me)
  With stdWindow.CreateFromIUnknown(Me)
    .isResizable = True
    .isMaximiseButtonVisible = True
    .isMinimiseButtonVisible = True
    .isAppWindow = True
    .setOwnerHandle 0
  End With
  Call This.webview.AddHostObject("vba", Me)
  set This.pylons = Data.ListObjects("PylonLines")
  Call This.webview.Navigate("https://widgets.scribblemaps.com/sm/?issv&ol&cv&dv&lm&d&ti&s&z&mc&mt&mv&l&gc&svc&sc&width=100%&dfe&height=100%&id=olGrbyLDOr")

  Dim augmentor as string: augmentor = FileReadText(ThisWorkbook.Path & "/Frontend/dist/augment.js")
  Call This.webview.JavaScriptRunSync(augmentor)
End Sub
Private Sub UserForm_Resize()
  This.webview.Resize
End Sub

Public Sub AddLine(ByVal sGEOJSON As String)
  this.pylons.headerrowrange.offset(this.pylons.listrows.count+1).value = sGEOJSON
End Sub

Public Function GetLines() As String
  Dim rowCount As Long: rowCount = This.pylons.listrows.count
  If rowCount = 0 Then
    GetLines = "[]"
    Exit Function
  End If
  
  Dim i As Long
  Dim parts() As String
  ReDim parts(1 To rowCount)
  
  For i = 1 To rowCount
    parts(i) = """" & JsonEscape(CStr(This.pylons.DataBodyRange.Cells(i, 1).Value2)) & """"
  Next
  
  GetLines = "[" & Join(parts, ",") & "]"
End Function

Private Function JsonEscape(ByVal value As String) As String
  value = Replace(value, "\", "\\")
  value = Replace(value, """", "\""")
  value = Replace(value, vbCrLf, "\n")
  value = Replace(value, vbCr, "\n")
  value = Replace(value, vbLf, "\n")
  JsonEscape = value
End Function


Private Function FileReadText(ByVal filePath As String) As String
  Dim ff As Long: ff = FreeFile
  Open filePath For Input As #ff
    FileReadText = Input(LOF(ff), #ff)
  Close #ff
End Function

