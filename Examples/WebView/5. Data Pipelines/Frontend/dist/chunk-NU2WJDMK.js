import {
  AmbiguousCharacters,
  ArrayText,
  BugIndicatingError,
  CancellationTokenSource,
  CharacterClassifier,
  Color,
  DEFAULT_WORD_REGEXP,
  Disposable,
  DisposableStore,
  Emitter,
  HSLA,
  IntervalTimer,
  InvisibleCharacters,
  KeyChord,
  LineRange,
  LineRangeSet,
  MonotonousArray,
  OffsetRange,
  Position,
  PrefixSumComputer,
  Range,
  Searcher,
  Selection,
  SetMap,
  StopWatch,
  TextReplacement,
  Token,
  URI,
  assertFn,
  assertNever,
  checkAdjacentItems,
  compareBy,
  dispose,
  ensureValidWordDefinition,
  equals,
  escapeRegExpCharacters,
  findFirstMonotonous,
  findLastIdxMonotonous,
  findLastMonotonous,
  firstNonWhitespaceIndex,
  forEachAdjacent,
  forEachWithNeighbors,
  getWordAtText,
  groupAdjacentBy,
  isBasicASCII,
  isHighSurrogate,
  isMultilineRegexSource,
  isUpperAsciiLetter,
  isWeb,
  lastNonWhitespaceIndex,
  numberComparator,
  onUnexpectedError,
  pushMany,
  regExpLeadsToEndlessLoop,
  reverseOrder,
  splitLines,
  stringHash,
  toDisposable,
  transformErrorForSerialization
} from "./chunk-LXXST4BI.js";

// node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums.js
var AccessibilitySupport;
(function(AccessibilitySupport2) {
  AccessibilitySupport2[AccessibilitySupport2["Unknown"] = 0] = "Unknown";
  AccessibilitySupport2[AccessibilitySupport2["Disabled"] = 1] = "Disabled";
  AccessibilitySupport2[AccessibilitySupport2["Enabled"] = 2] = "Enabled";
})(AccessibilitySupport || (AccessibilitySupport = {}));
var CodeActionTriggerType;
(function(CodeActionTriggerType2) {
  CodeActionTriggerType2[CodeActionTriggerType2["Invoke"] = 1] = "Invoke";
  CodeActionTriggerType2[CodeActionTriggerType2["Auto"] = 2] = "Auto";
})(CodeActionTriggerType || (CodeActionTriggerType = {}));
var CompletionItemInsertTextRule;
(function(CompletionItemInsertTextRule2) {
  CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["None"] = 0] = "None";
  CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["KeepWhitespace"] = 1] = "KeepWhitespace";
  CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["InsertAsSnippet"] = 4] = "InsertAsSnippet";
})(CompletionItemInsertTextRule || (CompletionItemInsertTextRule = {}));
var CompletionItemKind;
(function(CompletionItemKind2) {
  CompletionItemKind2[CompletionItemKind2["Method"] = 0] = "Method";
  CompletionItemKind2[CompletionItemKind2["Function"] = 1] = "Function";
  CompletionItemKind2[CompletionItemKind2["Constructor"] = 2] = "Constructor";
  CompletionItemKind2[CompletionItemKind2["Field"] = 3] = "Field";
  CompletionItemKind2[CompletionItemKind2["Variable"] = 4] = "Variable";
  CompletionItemKind2[CompletionItemKind2["Class"] = 5] = "Class";
  CompletionItemKind2[CompletionItemKind2["Struct"] = 6] = "Struct";
  CompletionItemKind2[CompletionItemKind2["Interface"] = 7] = "Interface";
  CompletionItemKind2[CompletionItemKind2["Module"] = 8] = "Module";
  CompletionItemKind2[CompletionItemKind2["Property"] = 9] = "Property";
  CompletionItemKind2[CompletionItemKind2["Event"] = 10] = "Event";
  CompletionItemKind2[CompletionItemKind2["Operator"] = 11] = "Operator";
  CompletionItemKind2[CompletionItemKind2["Unit"] = 12] = "Unit";
  CompletionItemKind2[CompletionItemKind2["Value"] = 13] = "Value";
  CompletionItemKind2[CompletionItemKind2["Constant"] = 14] = "Constant";
  CompletionItemKind2[CompletionItemKind2["Enum"] = 15] = "Enum";
  CompletionItemKind2[CompletionItemKind2["EnumMember"] = 16] = "EnumMember";
  CompletionItemKind2[CompletionItemKind2["Keyword"] = 17] = "Keyword";
  CompletionItemKind2[CompletionItemKind2["Text"] = 18] = "Text";
  CompletionItemKind2[CompletionItemKind2["Color"] = 19] = "Color";
  CompletionItemKind2[CompletionItemKind2["File"] = 20] = "File";
  CompletionItemKind2[CompletionItemKind2["Reference"] = 21] = "Reference";
  CompletionItemKind2[CompletionItemKind2["Customcolor"] = 22] = "Customcolor";
  CompletionItemKind2[CompletionItemKind2["Folder"] = 23] = "Folder";
  CompletionItemKind2[CompletionItemKind2["TypeParameter"] = 24] = "TypeParameter";
  CompletionItemKind2[CompletionItemKind2["User"] = 25] = "User";
  CompletionItemKind2[CompletionItemKind2["Issue"] = 26] = "Issue";
  CompletionItemKind2[CompletionItemKind2["Tool"] = 27] = "Tool";
  CompletionItemKind2[CompletionItemKind2["Snippet"] = 28] = "Snippet";
})(CompletionItemKind || (CompletionItemKind = {}));
var CompletionItemTag;
(function(CompletionItemTag2) {
  CompletionItemTag2[CompletionItemTag2["Deprecated"] = 1] = "Deprecated";
})(CompletionItemTag || (CompletionItemTag = {}));
var CompletionTriggerKind;
(function(CompletionTriggerKind2) {
  CompletionTriggerKind2[CompletionTriggerKind2["Invoke"] = 0] = "Invoke";
  CompletionTriggerKind2[CompletionTriggerKind2["TriggerCharacter"] = 1] = "TriggerCharacter";
  CompletionTriggerKind2[CompletionTriggerKind2["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind || (CompletionTriggerKind = {}));
var ContentWidgetPositionPreference;
(function(ContentWidgetPositionPreference2) {
  ContentWidgetPositionPreference2[ContentWidgetPositionPreference2["EXACT"] = 0] = "EXACT";
  ContentWidgetPositionPreference2[ContentWidgetPositionPreference2["ABOVE"] = 1] = "ABOVE";
  ContentWidgetPositionPreference2[ContentWidgetPositionPreference2["BELOW"] = 2] = "BELOW";
})(ContentWidgetPositionPreference || (ContentWidgetPositionPreference = {}));
var CursorChangeReason;
(function(CursorChangeReason2) {
  CursorChangeReason2[CursorChangeReason2["NotSet"] = 0] = "NotSet";
  CursorChangeReason2[CursorChangeReason2["ContentFlush"] = 1] = "ContentFlush";
  CursorChangeReason2[CursorChangeReason2["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
  CursorChangeReason2[CursorChangeReason2["Explicit"] = 3] = "Explicit";
  CursorChangeReason2[CursorChangeReason2["Paste"] = 4] = "Paste";
  CursorChangeReason2[CursorChangeReason2["Undo"] = 5] = "Undo";
  CursorChangeReason2[CursorChangeReason2["Redo"] = 6] = "Redo";
})(CursorChangeReason || (CursorChangeReason = {}));
var DefaultEndOfLine;
(function(DefaultEndOfLine2) {
  DefaultEndOfLine2[DefaultEndOfLine2["LF"] = 1] = "LF";
  DefaultEndOfLine2[DefaultEndOfLine2["CRLF"] = 2] = "CRLF";
})(DefaultEndOfLine || (DefaultEndOfLine = {}));
var DocumentHighlightKind;
(function(DocumentHighlightKind2) {
  DocumentHighlightKind2[DocumentHighlightKind2["Text"] = 0] = "Text";
  DocumentHighlightKind2[DocumentHighlightKind2["Read"] = 1] = "Read";
  DocumentHighlightKind2[DocumentHighlightKind2["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
var EditorAutoIndentStrategy;
(function(EditorAutoIndentStrategy2) {
  EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["None"] = 0] = "None";
  EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Keep"] = 1] = "Keep";
  EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Brackets"] = 2] = "Brackets";
  EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Advanced"] = 3] = "Advanced";
  EditorAutoIndentStrategy2[EditorAutoIndentStrategy2["Full"] = 4] = "Full";
})(EditorAutoIndentStrategy || (EditorAutoIndentStrategy = {}));
var EditorOption;
(function(EditorOption2) {
  EditorOption2[EditorOption2["acceptSuggestionOnCommitCharacter"] = 0] = "acceptSuggestionOnCommitCharacter";
  EditorOption2[EditorOption2["acceptSuggestionOnEnter"] = 1] = "acceptSuggestionOnEnter";
  EditorOption2[EditorOption2["accessibilitySupport"] = 2] = "accessibilitySupport";
  EditorOption2[EditorOption2["accessibilityPageSize"] = 3] = "accessibilityPageSize";
  EditorOption2[EditorOption2["allowOverflow"] = 4] = "allowOverflow";
  EditorOption2[EditorOption2["allowVariableLineHeights"] = 5] = "allowVariableLineHeights";
  EditorOption2[EditorOption2["allowVariableFonts"] = 6] = "allowVariableFonts";
  EditorOption2[EditorOption2["allowVariableFontsInAccessibilityMode"] = 7] = "allowVariableFontsInAccessibilityMode";
  EditorOption2[EditorOption2["ariaLabel"] = 8] = "ariaLabel";
  EditorOption2[EditorOption2["ariaRequired"] = 9] = "ariaRequired";
  EditorOption2[EditorOption2["autoClosingBrackets"] = 10] = "autoClosingBrackets";
  EditorOption2[EditorOption2["autoClosingComments"] = 11] = "autoClosingComments";
  EditorOption2[EditorOption2["screenReaderAnnounceInlineSuggestion"] = 12] = "screenReaderAnnounceInlineSuggestion";
  EditorOption2[EditorOption2["autoClosingDelete"] = 13] = "autoClosingDelete";
  EditorOption2[EditorOption2["autoClosingOvertype"] = 14] = "autoClosingOvertype";
  EditorOption2[EditorOption2["autoClosingQuotes"] = 15] = "autoClosingQuotes";
  EditorOption2[EditorOption2["autoIndent"] = 16] = "autoIndent";
  EditorOption2[EditorOption2["autoIndentOnPaste"] = 17] = "autoIndentOnPaste";
  EditorOption2[EditorOption2["autoIndentOnPasteWithinString"] = 18] = "autoIndentOnPasteWithinString";
  EditorOption2[EditorOption2["automaticLayout"] = 19] = "automaticLayout";
  EditorOption2[EditorOption2["autoSurround"] = 20] = "autoSurround";
  EditorOption2[EditorOption2["bracketPairColorization"] = 21] = "bracketPairColorization";
  EditorOption2[EditorOption2["guides"] = 22] = "guides";
  EditorOption2[EditorOption2["codeLens"] = 23] = "codeLens";
  EditorOption2[EditorOption2["codeLensFontFamily"] = 24] = "codeLensFontFamily";
  EditorOption2[EditorOption2["codeLensFontSize"] = 25] = "codeLensFontSize";
  EditorOption2[EditorOption2["colorDecorators"] = 26] = "colorDecorators";
  EditorOption2[EditorOption2["colorDecoratorsLimit"] = 27] = "colorDecoratorsLimit";
  EditorOption2[EditorOption2["columnSelection"] = 28] = "columnSelection";
  EditorOption2[EditorOption2["comments"] = 29] = "comments";
  EditorOption2[EditorOption2["contextmenu"] = 30] = "contextmenu";
  EditorOption2[EditorOption2["copyWithSyntaxHighlighting"] = 31] = "copyWithSyntaxHighlighting";
  EditorOption2[EditorOption2["cursorBlinking"] = 32] = "cursorBlinking";
  EditorOption2[EditorOption2["cursorSmoothCaretAnimation"] = 33] = "cursorSmoothCaretAnimation";
  EditorOption2[EditorOption2["cursorStyle"] = 34] = "cursorStyle";
  EditorOption2[EditorOption2["cursorSurroundingLines"] = 35] = "cursorSurroundingLines";
  EditorOption2[EditorOption2["cursorSurroundingLinesStyle"] = 36] = "cursorSurroundingLinesStyle";
  EditorOption2[EditorOption2["cursorWidth"] = 37] = "cursorWidth";
  EditorOption2[EditorOption2["cursorHeight"] = 38] = "cursorHeight";
  EditorOption2[EditorOption2["disableLayerHinting"] = 39] = "disableLayerHinting";
  EditorOption2[EditorOption2["disableMonospaceOptimizations"] = 40] = "disableMonospaceOptimizations";
  EditorOption2[EditorOption2["domReadOnly"] = 41] = "domReadOnly";
  EditorOption2[EditorOption2["dragAndDrop"] = 42] = "dragAndDrop";
  EditorOption2[EditorOption2["dropIntoEditor"] = 43] = "dropIntoEditor";
  EditorOption2[EditorOption2["editContext"] = 44] = "editContext";
  EditorOption2[EditorOption2["emptySelectionClipboard"] = 45] = "emptySelectionClipboard";
  EditorOption2[EditorOption2["experimentalGpuAcceleration"] = 46] = "experimentalGpuAcceleration";
  EditorOption2[EditorOption2["experimentalWhitespaceRendering"] = 47] = "experimentalWhitespaceRendering";
  EditorOption2[EditorOption2["extraEditorClassName"] = 48] = "extraEditorClassName";
  EditorOption2[EditorOption2["fastScrollSensitivity"] = 49] = "fastScrollSensitivity";
  EditorOption2[EditorOption2["find"] = 50] = "find";
  EditorOption2[EditorOption2["fixedOverflowWidgets"] = 51] = "fixedOverflowWidgets";
  EditorOption2[EditorOption2["folding"] = 52] = "folding";
  EditorOption2[EditorOption2["foldingStrategy"] = 53] = "foldingStrategy";
  EditorOption2[EditorOption2["foldingHighlight"] = 54] = "foldingHighlight";
  EditorOption2[EditorOption2["foldingImportsByDefault"] = 55] = "foldingImportsByDefault";
  EditorOption2[EditorOption2["foldingMaximumRegions"] = 56] = "foldingMaximumRegions";
  EditorOption2[EditorOption2["unfoldOnClickAfterEndOfLine"] = 57] = "unfoldOnClickAfterEndOfLine";
  EditorOption2[EditorOption2["fontFamily"] = 58] = "fontFamily";
  EditorOption2[EditorOption2["fontInfo"] = 59] = "fontInfo";
  EditorOption2[EditorOption2["fontLigatures"] = 60] = "fontLigatures";
  EditorOption2[EditorOption2["fontSize"] = 61] = "fontSize";
  EditorOption2[EditorOption2["fontWeight"] = 62] = "fontWeight";
  EditorOption2[EditorOption2["fontVariations"] = 63] = "fontVariations";
  EditorOption2[EditorOption2["formatOnPaste"] = 64] = "formatOnPaste";
  EditorOption2[EditorOption2["formatOnType"] = 65] = "formatOnType";
  EditorOption2[EditorOption2["glyphMargin"] = 66] = "glyphMargin";
  EditorOption2[EditorOption2["gotoLocation"] = 67] = "gotoLocation";
  EditorOption2[EditorOption2["hideCursorInOverviewRuler"] = 68] = "hideCursorInOverviewRuler";
  EditorOption2[EditorOption2["hover"] = 69] = "hover";
  EditorOption2[EditorOption2["inDiffEditor"] = 70] = "inDiffEditor";
  EditorOption2[EditorOption2["inlineSuggest"] = 71] = "inlineSuggest";
  EditorOption2[EditorOption2["letterSpacing"] = 72] = "letterSpacing";
  EditorOption2[EditorOption2["lightbulb"] = 73] = "lightbulb";
  EditorOption2[EditorOption2["lineDecorationsWidth"] = 74] = "lineDecorationsWidth";
  EditorOption2[EditorOption2["lineHeight"] = 75] = "lineHeight";
  EditorOption2[EditorOption2["lineNumbers"] = 76] = "lineNumbers";
  EditorOption2[EditorOption2["lineNumbersMinChars"] = 77] = "lineNumbersMinChars";
  EditorOption2[EditorOption2["linkedEditing"] = 78] = "linkedEditing";
  EditorOption2[EditorOption2["links"] = 79] = "links";
  EditorOption2[EditorOption2["matchBrackets"] = 80] = "matchBrackets";
  EditorOption2[EditorOption2["minimap"] = 81] = "minimap";
  EditorOption2[EditorOption2["mouseStyle"] = 82] = "mouseStyle";
  EditorOption2[EditorOption2["mouseWheelScrollSensitivity"] = 83] = "mouseWheelScrollSensitivity";
  EditorOption2[EditorOption2["mouseWheelZoom"] = 84] = "mouseWheelZoom";
  EditorOption2[EditorOption2["multiCursorMergeOverlapping"] = 85] = "multiCursorMergeOverlapping";
  EditorOption2[EditorOption2["multiCursorModifier"] = 86] = "multiCursorModifier";
  EditorOption2[EditorOption2["mouseMiddleClickAction"] = 87] = "mouseMiddleClickAction";
  EditorOption2[EditorOption2["multiCursorPaste"] = 88] = "multiCursorPaste";
  EditorOption2[EditorOption2["multiCursorLimit"] = 89] = "multiCursorLimit";
  EditorOption2[EditorOption2["occurrencesHighlight"] = 90] = "occurrencesHighlight";
  EditorOption2[EditorOption2["occurrencesHighlightDelay"] = 91] = "occurrencesHighlightDelay";
  EditorOption2[EditorOption2["overtypeCursorStyle"] = 92] = "overtypeCursorStyle";
  EditorOption2[EditorOption2["overtypeOnPaste"] = 93] = "overtypeOnPaste";
  EditorOption2[EditorOption2["overviewRulerBorder"] = 94] = "overviewRulerBorder";
  EditorOption2[EditorOption2["overviewRulerLanes"] = 95] = "overviewRulerLanes";
  EditorOption2[EditorOption2["padding"] = 96] = "padding";
  EditorOption2[EditorOption2["pasteAs"] = 97] = "pasteAs";
  EditorOption2[EditorOption2["parameterHints"] = 98] = "parameterHints";
  EditorOption2[EditorOption2["peekWidgetDefaultFocus"] = 99] = "peekWidgetDefaultFocus";
  EditorOption2[EditorOption2["placeholder"] = 100] = "placeholder";
  EditorOption2[EditorOption2["definitionLinkOpensInPeek"] = 101] = "definitionLinkOpensInPeek";
  EditorOption2[EditorOption2["quickSuggestions"] = 102] = "quickSuggestions";
  EditorOption2[EditorOption2["quickSuggestionsDelay"] = 103] = "quickSuggestionsDelay";
  EditorOption2[EditorOption2["readOnly"] = 104] = "readOnly";
  EditorOption2[EditorOption2["readOnlyMessage"] = 105] = "readOnlyMessage";
  EditorOption2[EditorOption2["renameOnType"] = 106] = "renameOnType";
  EditorOption2[EditorOption2["renderRichScreenReaderContent"] = 107] = "renderRichScreenReaderContent";
  EditorOption2[EditorOption2["renderControlCharacters"] = 108] = "renderControlCharacters";
  EditorOption2[EditorOption2["renderFinalNewline"] = 109] = "renderFinalNewline";
  EditorOption2[EditorOption2["renderLineHighlight"] = 110] = "renderLineHighlight";
  EditorOption2[EditorOption2["renderLineHighlightOnlyWhenFocus"] = 111] = "renderLineHighlightOnlyWhenFocus";
  EditorOption2[EditorOption2["renderValidationDecorations"] = 112] = "renderValidationDecorations";
  EditorOption2[EditorOption2["renderWhitespace"] = 113] = "renderWhitespace";
  EditorOption2[EditorOption2["revealHorizontalRightPadding"] = 114] = "revealHorizontalRightPadding";
  EditorOption2[EditorOption2["roundedSelection"] = 115] = "roundedSelection";
  EditorOption2[EditorOption2["rulers"] = 116] = "rulers";
  EditorOption2[EditorOption2["scrollbar"] = 117] = "scrollbar";
  EditorOption2[EditorOption2["scrollBeyondLastColumn"] = 118] = "scrollBeyondLastColumn";
  EditorOption2[EditorOption2["scrollBeyondLastLine"] = 119] = "scrollBeyondLastLine";
  EditorOption2[EditorOption2["scrollPredominantAxis"] = 120] = "scrollPredominantAxis";
  EditorOption2[EditorOption2["selectionClipboard"] = 121] = "selectionClipboard";
  EditorOption2[EditorOption2["selectionHighlight"] = 122] = "selectionHighlight";
  EditorOption2[EditorOption2["selectionHighlightMaxLength"] = 123] = "selectionHighlightMaxLength";
  EditorOption2[EditorOption2["selectionHighlightMultiline"] = 124] = "selectionHighlightMultiline";
  EditorOption2[EditorOption2["selectOnLineNumbers"] = 125] = "selectOnLineNumbers";
  EditorOption2[EditorOption2["showFoldingControls"] = 126] = "showFoldingControls";
  EditorOption2[EditorOption2["showUnused"] = 127] = "showUnused";
  EditorOption2[EditorOption2["snippetSuggestions"] = 128] = "snippetSuggestions";
  EditorOption2[EditorOption2["smartSelect"] = 129] = "smartSelect";
  EditorOption2[EditorOption2["smoothScrolling"] = 130] = "smoothScrolling";
  EditorOption2[EditorOption2["stickyScroll"] = 131] = "stickyScroll";
  EditorOption2[EditorOption2["stickyTabStops"] = 132] = "stickyTabStops";
  EditorOption2[EditorOption2["stopRenderingLineAfter"] = 133] = "stopRenderingLineAfter";
  EditorOption2[EditorOption2["suggest"] = 134] = "suggest";
  EditorOption2[EditorOption2["suggestFontSize"] = 135] = "suggestFontSize";
  EditorOption2[EditorOption2["suggestLineHeight"] = 136] = "suggestLineHeight";
  EditorOption2[EditorOption2["suggestOnTriggerCharacters"] = 137] = "suggestOnTriggerCharacters";
  EditorOption2[EditorOption2["suggestSelection"] = 138] = "suggestSelection";
  EditorOption2[EditorOption2["tabCompletion"] = 139] = "tabCompletion";
  EditorOption2[EditorOption2["tabIndex"] = 140] = "tabIndex";
  EditorOption2[EditorOption2["trimWhitespaceOnDelete"] = 141] = "trimWhitespaceOnDelete";
  EditorOption2[EditorOption2["unicodeHighlighting"] = 142] = "unicodeHighlighting";
  EditorOption2[EditorOption2["unusualLineTerminators"] = 143] = "unusualLineTerminators";
  EditorOption2[EditorOption2["useShadowDOM"] = 144] = "useShadowDOM";
  EditorOption2[EditorOption2["useTabStops"] = 145] = "useTabStops";
  EditorOption2[EditorOption2["wordBreak"] = 146] = "wordBreak";
  EditorOption2[EditorOption2["wordSegmenterLocales"] = 147] = "wordSegmenterLocales";
  EditorOption2[EditorOption2["wordSeparators"] = 148] = "wordSeparators";
  EditorOption2[EditorOption2["wordWrap"] = 149] = "wordWrap";
  EditorOption2[EditorOption2["wordWrapBreakAfterCharacters"] = 150] = "wordWrapBreakAfterCharacters";
  EditorOption2[EditorOption2["wordWrapBreakBeforeCharacters"] = 151] = "wordWrapBreakBeforeCharacters";
  EditorOption2[EditorOption2["wordWrapColumn"] = 152] = "wordWrapColumn";
  EditorOption2[EditorOption2["wordWrapOverride1"] = 153] = "wordWrapOverride1";
  EditorOption2[EditorOption2["wordWrapOverride2"] = 154] = "wordWrapOverride2";
  EditorOption2[EditorOption2["wrappingIndent"] = 155] = "wrappingIndent";
  EditorOption2[EditorOption2["wrappingStrategy"] = 156] = "wrappingStrategy";
  EditorOption2[EditorOption2["showDeprecated"] = 157] = "showDeprecated";
  EditorOption2[EditorOption2["inertialScroll"] = 158] = "inertialScroll";
  EditorOption2[EditorOption2["inlayHints"] = 159] = "inlayHints";
  EditorOption2[EditorOption2["wrapOnEscapedLineFeeds"] = 160] = "wrapOnEscapedLineFeeds";
  EditorOption2[EditorOption2["effectiveCursorStyle"] = 161] = "effectiveCursorStyle";
  EditorOption2[EditorOption2["editorClassName"] = 162] = "editorClassName";
  EditorOption2[EditorOption2["pixelRatio"] = 163] = "pixelRatio";
  EditorOption2[EditorOption2["tabFocusMode"] = 164] = "tabFocusMode";
  EditorOption2[EditorOption2["layoutInfo"] = 165] = "layoutInfo";
  EditorOption2[EditorOption2["wrappingInfo"] = 166] = "wrappingInfo";
  EditorOption2[EditorOption2["defaultColorDecorators"] = 167] = "defaultColorDecorators";
  EditorOption2[EditorOption2["colorDecoratorsActivatedOn"] = 168] = "colorDecoratorsActivatedOn";
  EditorOption2[EditorOption2["inlineCompletionsAccessibilityVerbose"] = 169] = "inlineCompletionsAccessibilityVerbose";
  EditorOption2[EditorOption2["effectiveEditContext"] = 170] = "effectiveEditContext";
  EditorOption2[EditorOption2["scrollOnMiddleClick"] = 171] = "scrollOnMiddleClick";
  EditorOption2[EditorOption2["effectiveAllowVariableFonts"] = 172] = "effectiveAllowVariableFonts";
})(EditorOption || (EditorOption = {}));
var EndOfLinePreference;
(function(EndOfLinePreference2) {
  EndOfLinePreference2[EndOfLinePreference2["TextDefined"] = 0] = "TextDefined";
  EndOfLinePreference2[EndOfLinePreference2["LF"] = 1] = "LF";
  EndOfLinePreference2[EndOfLinePreference2["CRLF"] = 2] = "CRLF";
})(EndOfLinePreference || (EndOfLinePreference = {}));
var EndOfLineSequence;
(function(EndOfLineSequence2) {
  EndOfLineSequence2[EndOfLineSequence2["LF"] = 0] = "LF";
  EndOfLineSequence2[EndOfLineSequence2["CRLF"] = 1] = "CRLF";
})(EndOfLineSequence || (EndOfLineSequence = {}));
var GlyphMarginLane;
(function(GlyphMarginLane2) {
  GlyphMarginLane2[GlyphMarginLane2["Left"] = 1] = "Left";
  GlyphMarginLane2[GlyphMarginLane2["Center"] = 2] = "Center";
  GlyphMarginLane2[GlyphMarginLane2["Right"] = 3] = "Right";
})(GlyphMarginLane || (GlyphMarginLane = {}));
var HoverVerbosityAction;
(function(HoverVerbosityAction2) {
  HoverVerbosityAction2[HoverVerbosityAction2["Increase"] = 0] = "Increase";
  HoverVerbosityAction2[HoverVerbosityAction2["Decrease"] = 1] = "Decrease";
})(HoverVerbosityAction || (HoverVerbosityAction = {}));
var IndentAction;
(function(IndentAction2) {
  IndentAction2[IndentAction2["None"] = 0] = "None";
  IndentAction2[IndentAction2["Indent"] = 1] = "Indent";
  IndentAction2[IndentAction2["IndentOutdent"] = 2] = "IndentOutdent";
  IndentAction2[IndentAction2["Outdent"] = 3] = "Outdent";
})(IndentAction || (IndentAction = {}));
var InjectedTextCursorStops;
(function(InjectedTextCursorStops2) {
  InjectedTextCursorStops2[InjectedTextCursorStops2["Both"] = 0] = "Both";
  InjectedTextCursorStops2[InjectedTextCursorStops2["Right"] = 1] = "Right";
  InjectedTextCursorStops2[InjectedTextCursorStops2["Left"] = 2] = "Left";
  InjectedTextCursorStops2[InjectedTextCursorStops2["None"] = 3] = "None";
})(InjectedTextCursorStops || (InjectedTextCursorStops = {}));
var InlayHintKind;
(function(InlayHintKind2) {
  InlayHintKind2[InlayHintKind2["Type"] = 1] = "Type";
  InlayHintKind2[InlayHintKind2["Parameter"] = 2] = "Parameter";
})(InlayHintKind || (InlayHintKind = {}));
var InlineCompletionEndOfLifeReasonKind;
(function(InlineCompletionEndOfLifeReasonKind2) {
  InlineCompletionEndOfLifeReasonKind2[InlineCompletionEndOfLifeReasonKind2["Accepted"] = 0] = "Accepted";
  InlineCompletionEndOfLifeReasonKind2[InlineCompletionEndOfLifeReasonKind2["Rejected"] = 1] = "Rejected";
  InlineCompletionEndOfLifeReasonKind2[InlineCompletionEndOfLifeReasonKind2["Ignored"] = 2] = "Ignored";
})(InlineCompletionEndOfLifeReasonKind || (InlineCompletionEndOfLifeReasonKind = {}));
var InlineCompletionHintStyle;
(function(InlineCompletionHintStyle2) {
  InlineCompletionHintStyle2[InlineCompletionHintStyle2["Code"] = 1] = "Code";
  InlineCompletionHintStyle2[InlineCompletionHintStyle2["Label"] = 2] = "Label";
})(InlineCompletionHintStyle || (InlineCompletionHintStyle = {}));
var InlineCompletionTriggerKind;
(function(InlineCompletionTriggerKind2) {
  InlineCompletionTriggerKind2[InlineCompletionTriggerKind2["Automatic"] = 0] = "Automatic";
  InlineCompletionTriggerKind2[InlineCompletionTriggerKind2["Explicit"] = 1] = "Explicit";
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
var KeyCode;
(function(KeyCode2) {
  KeyCode2[KeyCode2["DependsOnKbLayout"] = -1] = "DependsOnKbLayout";
  KeyCode2[KeyCode2["Unknown"] = 0] = "Unknown";
  KeyCode2[KeyCode2["Backspace"] = 1] = "Backspace";
  KeyCode2[KeyCode2["Tab"] = 2] = "Tab";
  KeyCode2[KeyCode2["Enter"] = 3] = "Enter";
  KeyCode2[KeyCode2["Shift"] = 4] = "Shift";
  KeyCode2[KeyCode2["Ctrl"] = 5] = "Ctrl";
  KeyCode2[KeyCode2["Alt"] = 6] = "Alt";
  KeyCode2[KeyCode2["PauseBreak"] = 7] = "PauseBreak";
  KeyCode2[KeyCode2["CapsLock"] = 8] = "CapsLock";
  KeyCode2[KeyCode2["Escape"] = 9] = "Escape";
  KeyCode2[KeyCode2["Space"] = 10] = "Space";
  KeyCode2[KeyCode2["PageUp"] = 11] = "PageUp";
  KeyCode2[KeyCode2["PageDown"] = 12] = "PageDown";
  KeyCode2[KeyCode2["End"] = 13] = "End";
  KeyCode2[KeyCode2["Home"] = 14] = "Home";
  KeyCode2[KeyCode2["LeftArrow"] = 15] = "LeftArrow";
  KeyCode2[KeyCode2["UpArrow"] = 16] = "UpArrow";
  KeyCode2[KeyCode2["RightArrow"] = 17] = "RightArrow";
  KeyCode2[KeyCode2["DownArrow"] = 18] = "DownArrow";
  KeyCode2[KeyCode2["Insert"] = 19] = "Insert";
  KeyCode2[KeyCode2["Delete"] = 20] = "Delete";
  KeyCode2[KeyCode2["Digit0"] = 21] = "Digit0";
  KeyCode2[KeyCode2["Digit1"] = 22] = "Digit1";
  KeyCode2[KeyCode2["Digit2"] = 23] = "Digit2";
  KeyCode2[KeyCode2["Digit3"] = 24] = "Digit3";
  KeyCode2[KeyCode2["Digit4"] = 25] = "Digit4";
  KeyCode2[KeyCode2["Digit5"] = 26] = "Digit5";
  KeyCode2[KeyCode2["Digit6"] = 27] = "Digit6";
  KeyCode2[KeyCode2["Digit7"] = 28] = "Digit7";
  KeyCode2[KeyCode2["Digit8"] = 29] = "Digit8";
  KeyCode2[KeyCode2["Digit9"] = 30] = "Digit9";
  KeyCode2[KeyCode2["KeyA"] = 31] = "KeyA";
  KeyCode2[KeyCode2["KeyB"] = 32] = "KeyB";
  KeyCode2[KeyCode2["KeyC"] = 33] = "KeyC";
  KeyCode2[KeyCode2["KeyD"] = 34] = "KeyD";
  KeyCode2[KeyCode2["KeyE"] = 35] = "KeyE";
  KeyCode2[KeyCode2["KeyF"] = 36] = "KeyF";
  KeyCode2[KeyCode2["KeyG"] = 37] = "KeyG";
  KeyCode2[KeyCode2["KeyH"] = 38] = "KeyH";
  KeyCode2[KeyCode2["KeyI"] = 39] = "KeyI";
  KeyCode2[KeyCode2["KeyJ"] = 40] = "KeyJ";
  KeyCode2[KeyCode2["KeyK"] = 41] = "KeyK";
  KeyCode2[KeyCode2["KeyL"] = 42] = "KeyL";
  KeyCode2[KeyCode2["KeyM"] = 43] = "KeyM";
  KeyCode2[KeyCode2["KeyN"] = 44] = "KeyN";
  KeyCode2[KeyCode2["KeyO"] = 45] = "KeyO";
  KeyCode2[KeyCode2["KeyP"] = 46] = "KeyP";
  KeyCode2[KeyCode2["KeyQ"] = 47] = "KeyQ";
  KeyCode2[KeyCode2["KeyR"] = 48] = "KeyR";
  KeyCode2[KeyCode2["KeyS"] = 49] = "KeyS";
  KeyCode2[KeyCode2["KeyT"] = 50] = "KeyT";
  KeyCode2[KeyCode2["KeyU"] = 51] = "KeyU";
  KeyCode2[KeyCode2["KeyV"] = 52] = "KeyV";
  KeyCode2[KeyCode2["KeyW"] = 53] = "KeyW";
  KeyCode2[KeyCode2["KeyX"] = 54] = "KeyX";
  KeyCode2[KeyCode2["KeyY"] = 55] = "KeyY";
  KeyCode2[KeyCode2["KeyZ"] = 56] = "KeyZ";
  KeyCode2[KeyCode2["Meta"] = 57] = "Meta";
  KeyCode2[KeyCode2["ContextMenu"] = 58] = "ContextMenu";
  KeyCode2[KeyCode2["F1"] = 59] = "F1";
  KeyCode2[KeyCode2["F2"] = 60] = "F2";
  KeyCode2[KeyCode2["F3"] = 61] = "F3";
  KeyCode2[KeyCode2["F4"] = 62] = "F4";
  KeyCode2[KeyCode2["F5"] = 63] = "F5";
  KeyCode2[KeyCode2["F6"] = 64] = "F6";
  KeyCode2[KeyCode2["F7"] = 65] = "F7";
  KeyCode2[KeyCode2["F8"] = 66] = "F8";
  KeyCode2[KeyCode2["F9"] = 67] = "F9";
  KeyCode2[KeyCode2["F10"] = 68] = "F10";
  KeyCode2[KeyCode2["F11"] = 69] = "F11";
  KeyCode2[KeyCode2["F12"] = 70] = "F12";
  KeyCode2[KeyCode2["F13"] = 71] = "F13";
  KeyCode2[KeyCode2["F14"] = 72] = "F14";
  KeyCode2[KeyCode2["F15"] = 73] = "F15";
  KeyCode2[KeyCode2["F16"] = 74] = "F16";
  KeyCode2[KeyCode2["F17"] = 75] = "F17";
  KeyCode2[KeyCode2["F18"] = 76] = "F18";
  KeyCode2[KeyCode2["F19"] = 77] = "F19";
  KeyCode2[KeyCode2["F20"] = 78] = "F20";
  KeyCode2[KeyCode2["F21"] = 79] = "F21";
  KeyCode2[KeyCode2["F22"] = 80] = "F22";
  KeyCode2[KeyCode2["F23"] = 81] = "F23";
  KeyCode2[KeyCode2["F24"] = 82] = "F24";
  KeyCode2[KeyCode2["NumLock"] = 83] = "NumLock";
  KeyCode2[KeyCode2["ScrollLock"] = 84] = "ScrollLock";
  KeyCode2[KeyCode2["Semicolon"] = 85] = "Semicolon";
  KeyCode2[KeyCode2["Equal"] = 86] = "Equal";
  KeyCode2[KeyCode2["Comma"] = 87] = "Comma";
  KeyCode2[KeyCode2["Minus"] = 88] = "Minus";
  KeyCode2[KeyCode2["Period"] = 89] = "Period";
  KeyCode2[KeyCode2["Slash"] = 90] = "Slash";
  KeyCode2[KeyCode2["Backquote"] = 91] = "Backquote";
  KeyCode2[KeyCode2["BracketLeft"] = 92] = "BracketLeft";
  KeyCode2[KeyCode2["Backslash"] = 93] = "Backslash";
  KeyCode2[KeyCode2["BracketRight"] = 94] = "BracketRight";
  KeyCode2[KeyCode2["Quote"] = 95] = "Quote";
  KeyCode2[KeyCode2["OEM_8"] = 96] = "OEM_8";
  KeyCode2[KeyCode2["IntlBackslash"] = 97] = "IntlBackslash";
  KeyCode2[KeyCode2["Numpad0"] = 98] = "Numpad0";
  KeyCode2[KeyCode2["Numpad1"] = 99] = "Numpad1";
  KeyCode2[KeyCode2["Numpad2"] = 100] = "Numpad2";
  KeyCode2[KeyCode2["Numpad3"] = 101] = "Numpad3";
  KeyCode2[KeyCode2["Numpad4"] = 102] = "Numpad4";
  KeyCode2[KeyCode2["Numpad5"] = 103] = "Numpad5";
  KeyCode2[KeyCode2["Numpad6"] = 104] = "Numpad6";
  KeyCode2[KeyCode2["Numpad7"] = 105] = "Numpad7";
  KeyCode2[KeyCode2["Numpad8"] = 106] = "Numpad8";
  KeyCode2[KeyCode2["Numpad9"] = 107] = "Numpad9";
  KeyCode2[KeyCode2["NumpadMultiply"] = 108] = "NumpadMultiply";
  KeyCode2[KeyCode2["NumpadAdd"] = 109] = "NumpadAdd";
  KeyCode2[KeyCode2["NUMPAD_SEPARATOR"] = 110] = "NUMPAD_SEPARATOR";
  KeyCode2[KeyCode2["NumpadSubtract"] = 111] = "NumpadSubtract";
  KeyCode2[KeyCode2["NumpadDecimal"] = 112] = "NumpadDecimal";
  KeyCode2[KeyCode2["NumpadDivide"] = 113] = "NumpadDivide";
  KeyCode2[KeyCode2["KEY_IN_COMPOSITION"] = 114] = "KEY_IN_COMPOSITION";
  KeyCode2[KeyCode2["ABNT_C1"] = 115] = "ABNT_C1";
  KeyCode2[KeyCode2["ABNT_C2"] = 116] = "ABNT_C2";
  KeyCode2[KeyCode2["AudioVolumeMute"] = 117] = "AudioVolumeMute";
  KeyCode2[KeyCode2["AudioVolumeUp"] = 118] = "AudioVolumeUp";
  KeyCode2[KeyCode2["AudioVolumeDown"] = 119] = "AudioVolumeDown";
  KeyCode2[KeyCode2["BrowserSearch"] = 120] = "BrowserSearch";
  KeyCode2[KeyCode2["BrowserHome"] = 121] = "BrowserHome";
  KeyCode2[KeyCode2["BrowserBack"] = 122] = "BrowserBack";
  KeyCode2[KeyCode2["BrowserForward"] = 123] = "BrowserForward";
  KeyCode2[KeyCode2["MediaTrackNext"] = 124] = "MediaTrackNext";
  KeyCode2[KeyCode2["MediaTrackPrevious"] = 125] = "MediaTrackPrevious";
  KeyCode2[KeyCode2["MediaStop"] = 126] = "MediaStop";
  KeyCode2[KeyCode2["MediaPlayPause"] = 127] = "MediaPlayPause";
  KeyCode2[KeyCode2["LaunchMediaPlayer"] = 128] = "LaunchMediaPlayer";
  KeyCode2[KeyCode2["LaunchMail"] = 129] = "LaunchMail";
  KeyCode2[KeyCode2["LaunchApp2"] = 130] = "LaunchApp2";
  KeyCode2[KeyCode2["Clear"] = 131] = "Clear";
  KeyCode2[KeyCode2["MAX_VALUE"] = 132] = "MAX_VALUE";
})(KeyCode || (KeyCode = {}));
var MarkerSeverity;
(function(MarkerSeverity2) {
  MarkerSeverity2[MarkerSeverity2["Hint"] = 1] = "Hint";
  MarkerSeverity2[MarkerSeverity2["Info"] = 2] = "Info";
  MarkerSeverity2[MarkerSeverity2["Warning"] = 4] = "Warning";
  MarkerSeverity2[MarkerSeverity2["Error"] = 8] = "Error";
})(MarkerSeverity || (MarkerSeverity = {}));
var MarkerTag;
(function(MarkerTag2) {
  MarkerTag2[MarkerTag2["Unnecessary"] = 1] = "Unnecessary";
  MarkerTag2[MarkerTag2["Deprecated"] = 2] = "Deprecated";
})(MarkerTag || (MarkerTag = {}));
var MinimapPosition;
(function(MinimapPosition2) {
  MinimapPosition2[MinimapPosition2["Inline"] = 1] = "Inline";
  MinimapPosition2[MinimapPosition2["Gutter"] = 2] = "Gutter";
})(MinimapPosition || (MinimapPosition = {}));
var MinimapSectionHeaderStyle;
(function(MinimapSectionHeaderStyle2) {
  MinimapSectionHeaderStyle2[MinimapSectionHeaderStyle2["Normal"] = 1] = "Normal";
  MinimapSectionHeaderStyle2[MinimapSectionHeaderStyle2["Underlined"] = 2] = "Underlined";
})(MinimapSectionHeaderStyle || (MinimapSectionHeaderStyle = {}));
var MouseTargetType;
(function(MouseTargetType2) {
  MouseTargetType2[MouseTargetType2["UNKNOWN"] = 0] = "UNKNOWN";
  MouseTargetType2[MouseTargetType2["TEXTAREA"] = 1] = "TEXTAREA";
  MouseTargetType2[MouseTargetType2["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
  MouseTargetType2[MouseTargetType2["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
  MouseTargetType2[MouseTargetType2["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
  MouseTargetType2[MouseTargetType2["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
  MouseTargetType2[MouseTargetType2["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
  MouseTargetType2[MouseTargetType2["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
  MouseTargetType2[MouseTargetType2["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
  MouseTargetType2[MouseTargetType2["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
  MouseTargetType2[MouseTargetType2["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
  MouseTargetType2[MouseTargetType2["SCROLLBAR"] = 11] = "SCROLLBAR";
  MouseTargetType2[MouseTargetType2["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
  MouseTargetType2[MouseTargetType2["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
})(MouseTargetType || (MouseTargetType = {}));
var NewSymbolNameTag;
(function(NewSymbolNameTag2) {
  NewSymbolNameTag2[NewSymbolNameTag2["AIGenerated"] = 1] = "AIGenerated";
})(NewSymbolNameTag || (NewSymbolNameTag = {}));
var NewSymbolNameTriggerKind;
(function(NewSymbolNameTriggerKind2) {
  NewSymbolNameTriggerKind2[NewSymbolNameTriggerKind2["Invoke"] = 0] = "Invoke";
  NewSymbolNameTriggerKind2[NewSymbolNameTriggerKind2["Automatic"] = 1] = "Automatic";
})(NewSymbolNameTriggerKind || (NewSymbolNameTriggerKind = {}));
var OverlayWidgetPositionPreference;
(function(OverlayWidgetPositionPreference2) {
  OverlayWidgetPositionPreference2[OverlayWidgetPositionPreference2["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
  OverlayWidgetPositionPreference2[OverlayWidgetPositionPreference2["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
  OverlayWidgetPositionPreference2[OverlayWidgetPositionPreference2["TOP_CENTER"] = 2] = "TOP_CENTER";
})(OverlayWidgetPositionPreference || (OverlayWidgetPositionPreference = {}));
var OverviewRulerLane;
(function(OverviewRulerLane2) {
  OverviewRulerLane2[OverviewRulerLane2["Left"] = 1] = "Left";
  OverviewRulerLane2[OverviewRulerLane2["Center"] = 2] = "Center";
  OverviewRulerLane2[OverviewRulerLane2["Right"] = 4] = "Right";
  OverviewRulerLane2[OverviewRulerLane2["Full"] = 7] = "Full";
})(OverviewRulerLane || (OverviewRulerLane = {}));
var PartialAcceptTriggerKind;
(function(PartialAcceptTriggerKind2) {
  PartialAcceptTriggerKind2[PartialAcceptTriggerKind2["Word"] = 0] = "Word";
  PartialAcceptTriggerKind2[PartialAcceptTriggerKind2["Line"] = 1] = "Line";
  PartialAcceptTriggerKind2[PartialAcceptTriggerKind2["Suggest"] = 2] = "Suggest";
})(PartialAcceptTriggerKind || (PartialAcceptTriggerKind = {}));
var PositionAffinity;
(function(PositionAffinity2) {
  PositionAffinity2[PositionAffinity2["Left"] = 0] = "Left";
  PositionAffinity2[PositionAffinity2["Right"] = 1] = "Right";
  PositionAffinity2[PositionAffinity2["None"] = 2] = "None";
  PositionAffinity2[PositionAffinity2["LeftOfInjectedText"] = 3] = "LeftOfInjectedText";
  PositionAffinity2[PositionAffinity2["RightOfInjectedText"] = 4] = "RightOfInjectedText";
})(PositionAffinity || (PositionAffinity = {}));
var RenderLineNumbersType;
(function(RenderLineNumbersType2) {
  RenderLineNumbersType2[RenderLineNumbersType2["Off"] = 0] = "Off";
  RenderLineNumbersType2[RenderLineNumbersType2["On"] = 1] = "On";
  RenderLineNumbersType2[RenderLineNumbersType2["Relative"] = 2] = "Relative";
  RenderLineNumbersType2[RenderLineNumbersType2["Interval"] = 3] = "Interval";
  RenderLineNumbersType2[RenderLineNumbersType2["Custom"] = 4] = "Custom";
})(RenderLineNumbersType || (RenderLineNumbersType = {}));
var RenderMinimap;
(function(RenderMinimap2) {
  RenderMinimap2[RenderMinimap2["None"] = 0] = "None";
  RenderMinimap2[RenderMinimap2["Text"] = 1] = "Text";
  RenderMinimap2[RenderMinimap2["Blocks"] = 2] = "Blocks";
})(RenderMinimap || (RenderMinimap = {}));
var ScrollType;
(function(ScrollType2) {
  ScrollType2[ScrollType2["Smooth"] = 0] = "Smooth";
  ScrollType2[ScrollType2["Immediate"] = 1] = "Immediate";
})(ScrollType || (ScrollType = {}));
var ScrollbarVisibility;
(function(ScrollbarVisibility2) {
  ScrollbarVisibility2[ScrollbarVisibility2["Auto"] = 1] = "Auto";
  ScrollbarVisibility2[ScrollbarVisibility2["Hidden"] = 2] = "Hidden";
  ScrollbarVisibility2[ScrollbarVisibility2["Visible"] = 3] = "Visible";
})(ScrollbarVisibility || (ScrollbarVisibility = {}));
var SelectionDirection;
(function(SelectionDirection2) {
  SelectionDirection2[SelectionDirection2["LTR"] = 0] = "LTR";
  SelectionDirection2[SelectionDirection2["RTL"] = 1] = "RTL";
})(SelectionDirection || (SelectionDirection = {}));
var ShowLightbulbIconMode;
(function(ShowLightbulbIconMode2) {
  ShowLightbulbIconMode2["Off"] = "off";
  ShowLightbulbIconMode2["OnCode"] = "onCode";
  ShowLightbulbIconMode2["On"] = "on";
})(ShowLightbulbIconMode || (ShowLightbulbIconMode = {}));
var SignatureHelpTriggerKind;
(function(SignatureHelpTriggerKind2) {
  SignatureHelpTriggerKind2[SignatureHelpTriggerKind2["Invoke"] = 1] = "Invoke";
  SignatureHelpTriggerKind2[SignatureHelpTriggerKind2["TriggerCharacter"] = 2] = "TriggerCharacter";
  SignatureHelpTriggerKind2[SignatureHelpTriggerKind2["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind || (SignatureHelpTriggerKind = {}));
var SymbolKind;
(function(SymbolKind2) {
  SymbolKind2[SymbolKind2["File"] = 0] = "File";
  SymbolKind2[SymbolKind2["Module"] = 1] = "Module";
  SymbolKind2[SymbolKind2["Namespace"] = 2] = "Namespace";
  SymbolKind2[SymbolKind2["Package"] = 3] = "Package";
  SymbolKind2[SymbolKind2["Class"] = 4] = "Class";
  SymbolKind2[SymbolKind2["Method"] = 5] = "Method";
  SymbolKind2[SymbolKind2["Property"] = 6] = "Property";
  SymbolKind2[SymbolKind2["Field"] = 7] = "Field";
  SymbolKind2[SymbolKind2["Constructor"] = 8] = "Constructor";
  SymbolKind2[SymbolKind2["Enum"] = 9] = "Enum";
  SymbolKind2[SymbolKind2["Interface"] = 10] = "Interface";
  SymbolKind2[SymbolKind2["Function"] = 11] = "Function";
  SymbolKind2[SymbolKind2["Variable"] = 12] = "Variable";
  SymbolKind2[SymbolKind2["Constant"] = 13] = "Constant";
  SymbolKind2[SymbolKind2["String"] = 14] = "String";
  SymbolKind2[SymbolKind2["Number"] = 15] = "Number";
  SymbolKind2[SymbolKind2["Boolean"] = 16] = "Boolean";
  SymbolKind2[SymbolKind2["Array"] = 17] = "Array";
  SymbolKind2[SymbolKind2["Object"] = 18] = "Object";
  SymbolKind2[SymbolKind2["Key"] = 19] = "Key";
  SymbolKind2[SymbolKind2["Null"] = 20] = "Null";
  SymbolKind2[SymbolKind2["EnumMember"] = 21] = "EnumMember";
  SymbolKind2[SymbolKind2["Struct"] = 22] = "Struct";
  SymbolKind2[SymbolKind2["Event"] = 23] = "Event";
  SymbolKind2[SymbolKind2["Operator"] = 24] = "Operator";
  SymbolKind2[SymbolKind2["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
var SymbolTag;
(function(SymbolTag2) {
  SymbolTag2[SymbolTag2["Deprecated"] = 1] = "Deprecated";
})(SymbolTag || (SymbolTag = {}));
var TextDirection;
(function(TextDirection2) {
  TextDirection2[TextDirection2["LTR"] = 0] = "LTR";
  TextDirection2[TextDirection2["RTL"] = 1] = "RTL";
})(TextDirection || (TextDirection = {}));
var TextEditorCursorBlinkingStyle;
(function(TextEditorCursorBlinkingStyle2) {
  TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Hidden"] = 0] = "Hidden";
  TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Blink"] = 1] = "Blink";
  TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Smooth"] = 2] = "Smooth";
  TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Phase"] = 3] = "Phase";
  TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Expand"] = 4] = "Expand";
  TextEditorCursorBlinkingStyle2[TextEditorCursorBlinkingStyle2["Solid"] = 5] = "Solid";
})(TextEditorCursorBlinkingStyle || (TextEditorCursorBlinkingStyle = {}));
var TextEditorCursorStyle;
(function(TextEditorCursorStyle2) {
  TextEditorCursorStyle2[TextEditorCursorStyle2["Line"] = 1] = "Line";
  TextEditorCursorStyle2[TextEditorCursorStyle2["Block"] = 2] = "Block";
  TextEditorCursorStyle2[TextEditorCursorStyle2["Underline"] = 3] = "Underline";
  TextEditorCursorStyle2[TextEditorCursorStyle2["LineThin"] = 4] = "LineThin";
  TextEditorCursorStyle2[TextEditorCursorStyle2["BlockOutline"] = 5] = "BlockOutline";
  TextEditorCursorStyle2[TextEditorCursorStyle2["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle || (TextEditorCursorStyle = {}));
var TrackedRangeStickiness;
(function(TrackedRangeStickiness2) {
  TrackedRangeStickiness2[TrackedRangeStickiness2["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
  TrackedRangeStickiness2[TrackedRangeStickiness2["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
  TrackedRangeStickiness2[TrackedRangeStickiness2["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
  TrackedRangeStickiness2[TrackedRangeStickiness2["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
})(TrackedRangeStickiness || (TrackedRangeStickiness = {}));
var WrappingIndent;
(function(WrappingIndent2) {
  WrappingIndent2[WrappingIndent2["None"] = 0] = "None";
  WrappingIndent2[WrappingIndent2["Same"] = 1] = "Same";
  WrappingIndent2[WrappingIndent2["Indent"] = 2] = "Indent";
  WrappingIndent2[WrappingIndent2["DeepIndent"] = 3] = "DeepIndent";
})(WrappingIndent || (WrappingIndent = {}));

// node_modules/monaco-editor/esm/vs/editor/common/services/editorBaseApi.js
var _KeyMod = class _KeyMod {
  static chord(firstPart, secondPart) {
    return KeyChord(firstPart, secondPart);
  }
};
_KeyMod.CtrlCmd = 2048;
_KeyMod.Shift = 1024;
_KeyMod.Alt = 512;
_KeyMod.WinCtrl = 256;
var KeyMod = _KeyMod;
function createMonacoBaseAPI() {
  return {
    editor: void 0,
    // undefined override expected here
    languages: void 0,
    // undefined override expected here
    CancellationTokenSource,
    Emitter,
    KeyCode,
    KeyMod,
    Position,
    Range,
    Selection,
    SelectionDirection,
    MarkerSeverity,
    MarkerTag,
    Uri: URI,
    Token
  };
}

// node_modules/monaco-editor/esm/vs/base/common/diff/diffChange.js
var DiffChange = class {
  /**
   * Constructs a new DiffChange with the given sequence information
   * and content.
   */
  constructor(originalStart, originalLength, modifiedStart, modifiedLength) {
    this.originalStart = originalStart;
    this.originalLength = originalLength;
    this.modifiedStart = modifiedStart;
    this.modifiedLength = modifiedLength;
  }
  /**
   * The end point (exclusive) of the change in the original sequence.
   */
  getOriginalEnd() {
    return this.originalStart + this.originalLength;
  }
  /**
   * The end point (exclusive) of the change in the modified sequence.
   */
  getModifiedEnd() {
    return this.modifiedStart + this.modifiedLength;
  }
};

// node_modules/monaco-editor/esm/vs/base/common/diff/diff.js
var StringDiffSequence = class {
  constructor(source) {
    this.source = source;
  }
  getElements() {
    const source = this.source;
    const characters = new Int32Array(source.length);
    for (let i = 0, len = source.length; i < len; i++) {
      characters[i] = source.charCodeAt(i);
    }
    return characters;
  }
};
function stringDiff(original, modified, pretty) {
  return new LcsDiff(new StringDiffSequence(original), new StringDiffSequence(modified)).ComputeDiff(pretty).changes;
}
var Debug = class {
  static Assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
};
var MyArray = class {
  /**
   * Copies a range of elements from an Array starting at the specified source index and pastes
   * them to another Array starting at the specified destination index. The length and the indexes
   * are specified as 64-bit integers.
   * sourceArray:
   *		The Array that contains the data to copy.
   * sourceIndex:
   *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
   * destinationArray:
   *		The Array that receives the data.
   * destinationIndex:
   *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
   * length:
   *		A 64-bit integer that represents the number of elements to copy.
   */
  static Copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
    for (let i = 0; i < length; i++) {
      destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
    }
  }
  static Copy2(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
    for (let i = 0; i < length; i++) {
      destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
    }
  }
};
var DiffChangeHelper = class {
  /**
   * Constructs a new DiffChangeHelper for the given DiffSequences.
   */
  constructor() {
    this.m_changes = [];
    this.m_originalStart = 1073741824;
    this.m_modifiedStart = 1073741824;
    this.m_originalCount = 0;
    this.m_modifiedCount = 0;
  }
  /**
   * Marks the beginning of the next change in the set of differences.
   */
  MarkNextChange() {
    if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
      this.m_changes.push(new DiffChange(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
    }
    this.m_originalCount = 0;
    this.m_modifiedCount = 0;
    this.m_originalStart = 1073741824;
    this.m_modifiedStart = 1073741824;
  }
  /**
   * Adds the original element at the given position to the elements
   * affected by the current change. The modified index gives context
   * to the change position with respect to the original sequence.
   * @param originalIndex The index of the original element to add.
   * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
   */
  AddOriginalElement(originalIndex, modifiedIndex) {
    this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
    this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
    this.m_originalCount++;
  }
  /**
   * Adds the modified element at the given position to the elements
   * affected by the current change. The original index gives context
   * to the change position with respect to the modified sequence.
   * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
   * @param modifiedIndex The index of the modified element to add.
   */
  AddModifiedElement(originalIndex, modifiedIndex) {
    this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
    this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
    this.m_modifiedCount++;
  }
  /**
   * Retrieves all of the changes marked by the class.
   */
  getChanges() {
    if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
      this.MarkNextChange();
    }
    return this.m_changes;
  }
  /**
   * Retrieves all of the changes marked by the class in the reverse order
   */
  getReverseChanges() {
    if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
      this.MarkNextChange();
    }
    this.m_changes.reverse();
    return this.m_changes;
  }
};
var LcsDiff = class _LcsDiff {
  /**
   * Constructs the DiffFinder
   */
  constructor(originalSequence, modifiedSequence, continueProcessingPredicate = null) {
    this.ContinueProcessingPredicate = continueProcessingPredicate;
    this._originalSequence = originalSequence;
    this._modifiedSequence = modifiedSequence;
    const [originalStringElements, originalElementsOrHash, originalHasStrings] = _LcsDiff._getElements(originalSequence);
    const [modifiedStringElements, modifiedElementsOrHash, modifiedHasStrings] = _LcsDiff._getElements(modifiedSequence);
    this._hasStrings = originalHasStrings && modifiedHasStrings;
    this._originalStringElements = originalStringElements;
    this._originalElementsOrHash = originalElementsOrHash;
    this._modifiedStringElements = modifiedStringElements;
    this._modifiedElementsOrHash = modifiedElementsOrHash;
    this.m_forwardHistory = [];
    this.m_reverseHistory = [];
  }
  static _isStringArray(arr) {
    return arr.length > 0 && typeof arr[0] === "string";
  }
  static _getElements(sequence) {
    const elements = sequence.getElements();
    if (_LcsDiff._isStringArray(elements)) {
      const hashes = new Int32Array(elements.length);
      for (let i = 0, len = elements.length; i < len; i++) {
        hashes[i] = stringHash(elements[i], 0);
      }
      return [elements, hashes, true];
    }
    if (elements instanceof Int32Array) {
      return [[], elements, false];
    }
    return [[], new Int32Array(elements), false];
  }
  ElementsAreEqual(originalIndex, newIndex) {
    if (this._originalElementsOrHash[originalIndex] !== this._modifiedElementsOrHash[newIndex]) {
      return false;
    }
    return this._hasStrings ? this._originalStringElements[originalIndex] === this._modifiedStringElements[newIndex] : true;
  }
  ElementsAreStrictEqual(originalIndex, newIndex) {
    if (!this.ElementsAreEqual(originalIndex, newIndex)) {
      return false;
    }
    const originalElement = _LcsDiff._getStrictElement(this._originalSequence, originalIndex);
    const modifiedElement = _LcsDiff._getStrictElement(this._modifiedSequence, newIndex);
    return originalElement === modifiedElement;
  }
  static _getStrictElement(sequence, index) {
    if (typeof sequence.getStrictElement === "function") {
      return sequence.getStrictElement(index);
    }
    return null;
  }
  OriginalElementsAreEqual(index1, index2) {
    if (this._originalElementsOrHash[index1] !== this._originalElementsOrHash[index2]) {
      return false;
    }
    return this._hasStrings ? this._originalStringElements[index1] === this._originalStringElements[index2] : true;
  }
  ModifiedElementsAreEqual(index1, index2) {
    if (this._modifiedElementsOrHash[index1] !== this._modifiedElementsOrHash[index2]) {
      return false;
    }
    return this._hasStrings ? this._modifiedStringElements[index1] === this._modifiedStringElements[index2] : true;
  }
  ComputeDiff(pretty) {
    return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, pretty);
  }
  /**
   * Computes the differences between the original and modified input
   * sequences on the bounded range.
   * @returns An array of the differences between the two input sequences.
   */
  _ComputeDiff(originalStart, originalEnd, modifiedStart, modifiedEnd, pretty) {
    const quitEarlyArr = [false];
    let changes = this.ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr);
    if (pretty) {
      changes = this.PrettifyChanges(changes);
    }
    return {
      quitEarly: quitEarlyArr[0],
      changes
    };
  }
  /**
   * Private helper method which computes the differences on the bounded range
   * recursively.
   * @returns An array of the differences between the two input sequences.
   */
  ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr) {
    quitEarlyArr[0] = false;
    while (originalStart <= originalEnd && modifiedStart <= modifiedEnd && this.ElementsAreEqual(originalStart, modifiedStart)) {
      originalStart++;
      modifiedStart++;
    }
    while (originalEnd >= originalStart && modifiedEnd >= modifiedStart && this.ElementsAreEqual(originalEnd, modifiedEnd)) {
      originalEnd--;
      modifiedEnd--;
    }
    if (originalStart > originalEnd || modifiedStart > modifiedEnd) {
      let changes;
      if (modifiedStart <= modifiedEnd) {
        Debug.Assert(originalStart === originalEnd + 1, "originalStart should only be one more than originalEnd");
        changes = [
          new DiffChange(originalStart, 0, modifiedStart, modifiedEnd - modifiedStart + 1)
        ];
      } else if (originalStart <= originalEnd) {
        Debug.Assert(modifiedStart === modifiedEnd + 1, "modifiedStart should only be one more than modifiedEnd");
        changes = [
          new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, 0)
        ];
      } else {
        Debug.Assert(originalStart === originalEnd + 1, "originalStart should only be one more than originalEnd");
        Debug.Assert(modifiedStart === modifiedEnd + 1, "modifiedStart should only be one more than modifiedEnd");
        changes = [];
      }
      return changes;
    }
    const midOriginalArr = [0];
    const midModifiedArr = [0];
    const result = this.ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr);
    const midOriginal = midOriginalArr[0];
    const midModified = midModifiedArr[0];
    if (result !== null) {
      return result;
    } else if (!quitEarlyArr[0]) {
      const leftChanges = this.ComputeDiffRecursive(originalStart, midOriginal, modifiedStart, midModified, quitEarlyArr);
      let rightChanges = [];
      if (!quitEarlyArr[0]) {
        rightChanges = this.ComputeDiffRecursive(midOriginal + 1, originalEnd, midModified + 1, modifiedEnd, quitEarlyArr);
      } else {
        rightChanges = [
          new DiffChange(midOriginal + 1, originalEnd - (midOriginal + 1) + 1, midModified + 1, modifiedEnd - (midModified + 1) + 1)
        ];
      }
      return this.ConcatenateChanges(leftChanges, rightChanges);
    }
    return [
      new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
    ];
  }
  WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr) {
    let forwardChanges = null;
    let reverseChanges = null;
    let changeHelper = new DiffChangeHelper();
    let diagonalMin = diagonalForwardStart;
    let diagonalMax = diagonalForwardEnd;
    let diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalForwardOffset;
    let lastOriginalIndex = -1073741824;
    let historyIndex = this.m_forwardHistory.length - 1;
    do {
      const diagonal = diagonalRelative + diagonalForwardBase;
      if (diagonal === diagonalMin || diagonal < diagonalMax && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
        originalIndex = forwardPoints[diagonal + 1];
        modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
        if (originalIndex < lastOriginalIndex) {
          changeHelper.MarkNextChange();
        }
        lastOriginalIndex = originalIndex;
        changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex);
        diagonalRelative = diagonal + 1 - diagonalForwardBase;
      } else {
        originalIndex = forwardPoints[diagonal - 1] + 1;
        modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
        if (originalIndex < lastOriginalIndex) {
          changeHelper.MarkNextChange();
        }
        lastOriginalIndex = originalIndex - 1;
        changeHelper.AddOriginalElement(originalIndex, modifiedIndex + 1);
        diagonalRelative = diagonal - 1 - diagonalForwardBase;
      }
      if (historyIndex >= 0) {
        forwardPoints = this.m_forwardHistory[historyIndex];
        diagonalForwardBase = forwardPoints[0];
        diagonalMin = 1;
        diagonalMax = forwardPoints.length - 1;
      }
    } while (--historyIndex >= -1);
    forwardChanges = changeHelper.getReverseChanges();
    if (quitEarlyArr[0]) {
      let originalStartPoint = midOriginalArr[0] + 1;
      let modifiedStartPoint = midModifiedArr[0] + 1;
      if (forwardChanges !== null && forwardChanges.length > 0) {
        const lastForwardChange = forwardChanges[forwardChanges.length - 1];
        originalStartPoint = Math.max(originalStartPoint, lastForwardChange.getOriginalEnd());
        modifiedStartPoint = Math.max(modifiedStartPoint, lastForwardChange.getModifiedEnd());
      }
      reverseChanges = [
        new DiffChange(originalStartPoint, originalEnd - originalStartPoint + 1, modifiedStartPoint, modifiedEnd - modifiedStartPoint + 1)
      ];
    } else {
      changeHelper = new DiffChangeHelper();
      diagonalMin = diagonalReverseStart;
      diagonalMax = diagonalReverseEnd;
      diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalReverseOffset;
      lastOriginalIndex = 1073741824;
      historyIndex = deltaIsEven ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
      do {
        const diagonal = diagonalRelative + diagonalReverseBase;
        if (diagonal === diagonalMin || diagonal < diagonalMax && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
          originalIndex = reversePoints[diagonal + 1] - 1;
          modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
          if (originalIndex > lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }
          lastOriginalIndex = originalIndex + 1;
          changeHelper.AddOriginalElement(originalIndex + 1, modifiedIndex + 1);
          diagonalRelative = diagonal + 1 - diagonalReverseBase;
        } else {
          originalIndex = reversePoints[diagonal - 1];
          modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
          if (originalIndex > lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }
          lastOriginalIndex = originalIndex;
          changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex + 1);
          diagonalRelative = diagonal - 1 - diagonalReverseBase;
        }
        if (historyIndex >= 0) {
          reversePoints = this.m_reverseHistory[historyIndex];
          diagonalReverseBase = reversePoints[0];
          diagonalMin = 1;
          diagonalMax = reversePoints.length - 1;
        }
      } while (--historyIndex >= -1);
      reverseChanges = changeHelper.getChanges();
    }
    return this.ConcatenateChanges(forwardChanges, reverseChanges);
  }
  /**
   * Given the range to compute the diff on, this method finds the point:
   * (midOriginal, midModified)
   * that exists in the middle of the LCS of the two sequences and
   * is the point at which the LCS problem may be broken down recursively.
   * This method will try to keep the LCS trace in memory. If the LCS recursion
   * point is calculated and the full trace is available in memory, then this method
   * will return the change list.
   * @param originalStart The start bound of the original sequence range
   * @param originalEnd The end bound of the original sequence range
   * @param modifiedStart The start bound of the modified sequence range
   * @param modifiedEnd The end bound of the modified sequence range
   * @param midOriginal The middle point of the original sequence range
   * @param midModified The middle point of the modified sequence range
   * @returns The diff changes, if available, otherwise null
   */
  ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr) {
    let originalIndex = 0, modifiedIndex = 0;
    let diagonalForwardStart = 0, diagonalForwardEnd = 0;
    let diagonalReverseStart = 0, diagonalReverseEnd = 0;
    originalStart--;
    modifiedStart--;
    midOriginalArr[0] = 0;
    midModifiedArr[0] = 0;
    this.m_forwardHistory = [];
    this.m_reverseHistory = [];
    const maxDifferences = originalEnd - originalStart + (modifiedEnd - modifiedStart);
    const numDiagonals = maxDifferences + 1;
    const forwardPoints = new Int32Array(numDiagonals);
    const reversePoints = new Int32Array(numDiagonals);
    const diagonalForwardBase = modifiedEnd - modifiedStart;
    const diagonalReverseBase = originalEnd - originalStart;
    const diagonalForwardOffset = originalStart - modifiedStart;
    const diagonalReverseOffset = originalEnd - modifiedEnd;
    const delta = diagonalReverseBase - diagonalForwardBase;
    const deltaIsEven = delta % 2 === 0;
    forwardPoints[diagonalForwardBase] = originalStart;
    reversePoints[diagonalReverseBase] = originalEnd;
    quitEarlyArr[0] = false;
    for (let numDifferences = 1; numDifferences <= maxDifferences / 2 + 1; numDifferences++) {
      let furthestOriginalIndex = 0;
      let furthestModifiedIndex = 0;
      diagonalForwardStart = this.ClipDiagonalBound(diagonalForwardBase - numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
      diagonalForwardEnd = this.ClipDiagonalBound(diagonalForwardBase + numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
      for (let diagonal = diagonalForwardStart; diagonal <= diagonalForwardEnd; diagonal += 2) {
        if (diagonal === diagonalForwardStart || diagonal < diagonalForwardEnd && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
          originalIndex = forwardPoints[diagonal + 1];
        } else {
          originalIndex = forwardPoints[diagonal - 1] + 1;
        }
        modifiedIndex = originalIndex - (diagonal - diagonalForwardBase) - diagonalForwardOffset;
        const tempOriginalIndex = originalIndex;
        while (originalIndex < originalEnd && modifiedIndex < modifiedEnd && this.ElementsAreEqual(originalIndex + 1, modifiedIndex + 1)) {
          originalIndex++;
          modifiedIndex++;
        }
        forwardPoints[diagonal] = originalIndex;
        if (originalIndex + modifiedIndex > furthestOriginalIndex + furthestModifiedIndex) {
          furthestOriginalIndex = originalIndex;
          furthestModifiedIndex = modifiedIndex;
        }
        if (!deltaIsEven && Math.abs(diagonal - diagonalReverseBase) <= numDifferences - 1) {
          if (originalIndex >= reversePoints[diagonal]) {
            midOriginalArr[0] = originalIndex;
            midModifiedArr[0] = modifiedIndex;
            if (tempOriginalIndex <= reversePoints[diagonal] && 1447 > 0 && numDifferences <= 1447 + 1) {
              return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
            } else {
              return null;
            }
          }
        }
      }
      const matchLengthOfLongest = (furthestOriginalIndex - originalStart + (furthestModifiedIndex - modifiedStart) - numDifferences) / 2;
      if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(furthestOriginalIndex, matchLengthOfLongest)) {
        quitEarlyArr[0] = true;
        midOriginalArr[0] = furthestOriginalIndex;
        midModifiedArr[0] = furthestModifiedIndex;
        if (matchLengthOfLongest > 0 && 1447 > 0 && numDifferences <= 1447 + 1) {
          return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
        } else {
          originalStart++;
          modifiedStart++;
          return [
            new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
          ];
        }
      }
      diagonalReverseStart = this.ClipDiagonalBound(diagonalReverseBase - numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
      diagonalReverseEnd = this.ClipDiagonalBound(diagonalReverseBase + numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
      for (let diagonal = diagonalReverseStart; diagonal <= diagonalReverseEnd; diagonal += 2) {
        if (diagonal === diagonalReverseStart || diagonal < diagonalReverseEnd && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
          originalIndex = reversePoints[diagonal + 1] - 1;
        } else {
          originalIndex = reversePoints[diagonal - 1];
        }
        modifiedIndex = originalIndex - (diagonal - diagonalReverseBase) - diagonalReverseOffset;
        const tempOriginalIndex = originalIndex;
        while (originalIndex > originalStart && modifiedIndex > modifiedStart && this.ElementsAreEqual(originalIndex, modifiedIndex)) {
          originalIndex--;
          modifiedIndex--;
        }
        reversePoints[diagonal] = originalIndex;
        if (deltaIsEven && Math.abs(diagonal - diagonalForwardBase) <= numDifferences) {
          if (originalIndex <= forwardPoints[diagonal]) {
            midOriginalArr[0] = originalIndex;
            midModifiedArr[0] = modifiedIndex;
            if (tempOriginalIndex >= forwardPoints[diagonal] && 1447 > 0 && numDifferences <= 1447 + 1) {
              return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
            } else {
              return null;
            }
          }
        }
      }
      if (numDifferences <= 1447) {
        let temp = new Int32Array(diagonalForwardEnd - diagonalForwardStart + 2);
        temp[0] = diagonalForwardBase - diagonalForwardStart + 1;
        MyArray.Copy2(forwardPoints, diagonalForwardStart, temp, 1, diagonalForwardEnd - diagonalForwardStart + 1);
        this.m_forwardHistory.push(temp);
        temp = new Int32Array(diagonalReverseEnd - diagonalReverseStart + 2);
        temp[0] = diagonalReverseBase - diagonalReverseStart + 1;
        MyArray.Copy2(reversePoints, diagonalReverseStart, temp, 1, diagonalReverseEnd - diagonalReverseStart + 1);
        this.m_reverseHistory.push(temp);
      }
    }
    return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
  }
  /**
   * Shifts the given changes to provide a more intuitive diff.
   * While the first element in a diff matches the first element after the diff,
   * we shift the diff down.
   *
   * @param changes The list of changes to shift
   * @returns The shifted changes
   */
  PrettifyChanges(changes) {
    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];
      const originalStop = i < changes.length - 1 ? changes[i + 1].originalStart : this._originalElementsOrHash.length;
      const modifiedStop = i < changes.length - 1 ? changes[i + 1].modifiedStart : this._modifiedElementsOrHash.length;
      const checkOriginal = change.originalLength > 0;
      const checkModified = change.modifiedLength > 0;
      while (change.originalStart + change.originalLength < originalStop && change.modifiedStart + change.modifiedLength < modifiedStop && (!checkOriginal || this.OriginalElementsAreEqual(change.originalStart, change.originalStart + change.originalLength)) && (!checkModified || this.ModifiedElementsAreEqual(change.modifiedStart, change.modifiedStart + change.modifiedLength))) {
        const startStrictEqual = this.ElementsAreStrictEqual(change.originalStart, change.modifiedStart);
        const endStrictEqual = this.ElementsAreStrictEqual(change.originalStart + change.originalLength, change.modifiedStart + change.modifiedLength);
        if (endStrictEqual && !startStrictEqual) {
          break;
        }
        change.originalStart++;
        change.modifiedStart++;
      }
      const mergedChangeArr = [null];
      if (i < changes.length - 1 && this.ChangesOverlap(changes[i], changes[i + 1], mergedChangeArr)) {
        changes[i] = mergedChangeArr[0];
        changes.splice(i + 1, 1);
        i--;
        continue;
      }
    }
    for (let i = changes.length - 1; i >= 0; i--) {
      const change = changes[i];
      let originalStop = 0;
      let modifiedStop = 0;
      if (i > 0) {
        const prevChange = changes[i - 1];
        originalStop = prevChange.originalStart + prevChange.originalLength;
        modifiedStop = prevChange.modifiedStart + prevChange.modifiedLength;
      }
      const checkOriginal = change.originalLength > 0;
      const checkModified = change.modifiedLength > 0;
      let bestDelta = 0;
      let bestScore = this._boundaryScore(change.originalStart, change.originalLength, change.modifiedStart, change.modifiedLength);
      for (let delta = 1; ; delta++) {
        const originalStart = change.originalStart - delta;
        const modifiedStart = change.modifiedStart - delta;
        if (originalStart < originalStop || modifiedStart < modifiedStop) {
          break;
        }
        if (checkOriginal && !this.OriginalElementsAreEqual(originalStart, originalStart + change.originalLength)) {
          break;
        }
        if (checkModified && !this.ModifiedElementsAreEqual(modifiedStart, modifiedStart + change.modifiedLength)) {
          break;
        }
        const touchingPreviousChange = originalStart === originalStop && modifiedStart === modifiedStop;
        const score2 = (touchingPreviousChange ? 5 : 0) + this._boundaryScore(originalStart, change.originalLength, modifiedStart, change.modifiedLength);
        if (score2 > bestScore) {
          bestScore = score2;
          bestDelta = delta;
        }
      }
      change.originalStart -= bestDelta;
      change.modifiedStart -= bestDelta;
      const mergedChangeArr = [null];
      if (i > 0 && this.ChangesOverlap(changes[i - 1], changes[i], mergedChangeArr)) {
        changes[i - 1] = mergedChangeArr[0];
        changes.splice(i, 1);
        i++;
        continue;
      }
    }
    if (this._hasStrings) {
      for (let i = 1, len = changes.length; i < len; i++) {
        const aChange = changes[i - 1];
        const bChange = changes[i];
        const matchedLength = bChange.originalStart - aChange.originalStart - aChange.originalLength;
        const aOriginalStart = aChange.originalStart;
        const bOriginalEnd = bChange.originalStart + bChange.originalLength;
        const abOriginalLength = bOriginalEnd - aOriginalStart;
        const aModifiedStart = aChange.modifiedStart;
        const bModifiedEnd = bChange.modifiedStart + bChange.modifiedLength;
        const abModifiedLength = bModifiedEnd - aModifiedStart;
        if (matchedLength < 5 && abOriginalLength < 20 && abModifiedLength < 20) {
          const t = this._findBetterContiguousSequence(aOriginalStart, abOriginalLength, aModifiedStart, abModifiedLength, matchedLength);
          if (t) {
            const [originalMatchStart, modifiedMatchStart] = t;
            if (originalMatchStart !== aChange.originalStart + aChange.originalLength || modifiedMatchStart !== aChange.modifiedStart + aChange.modifiedLength) {
              aChange.originalLength = originalMatchStart - aChange.originalStart;
              aChange.modifiedLength = modifiedMatchStart - aChange.modifiedStart;
              bChange.originalStart = originalMatchStart + matchedLength;
              bChange.modifiedStart = modifiedMatchStart + matchedLength;
              bChange.originalLength = bOriginalEnd - bChange.originalStart;
              bChange.modifiedLength = bModifiedEnd - bChange.modifiedStart;
            }
          }
        }
      }
    }
    return changes;
  }
  _findBetterContiguousSequence(originalStart, originalLength, modifiedStart, modifiedLength, desiredLength) {
    if (originalLength < desiredLength || modifiedLength < desiredLength) {
      return null;
    }
    const originalMax = originalStart + originalLength - desiredLength + 1;
    const modifiedMax = modifiedStart + modifiedLength - desiredLength + 1;
    let bestScore = 0;
    let bestOriginalStart = 0;
    let bestModifiedStart = 0;
    for (let i = originalStart; i < originalMax; i++) {
      for (let j = modifiedStart; j < modifiedMax; j++) {
        const score2 = this._contiguousSequenceScore(i, j, desiredLength);
        if (score2 > 0 && score2 > bestScore) {
          bestScore = score2;
          bestOriginalStart = i;
          bestModifiedStart = j;
        }
      }
    }
    if (bestScore > 0) {
      return [bestOriginalStart, bestModifiedStart];
    }
    return null;
  }
  _contiguousSequenceScore(originalStart, modifiedStart, length) {
    let score2 = 0;
    for (let l = 0; l < length; l++) {
      if (!this.ElementsAreEqual(originalStart + l, modifiedStart + l)) {
        return 0;
      }
      score2 += this._originalStringElements[originalStart + l].length;
    }
    return score2;
  }
  _OriginalIsBoundary(index) {
    if (index <= 0 || index >= this._originalElementsOrHash.length - 1) {
      return true;
    }
    return this._hasStrings && /^\s*$/.test(this._originalStringElements[index]);
  }
  _OriginalRegionIsBoundary(originalStart, originalLength) {
    if (this._OriginalIsBoundary(originalStart) || this._OriginalIsBoundary(originalStart - 1)) {
      return true;
    }
    if (originalLength > 0) {
      const originalEnd = originalStart + originalLength;
      if (this._OriginalIsBoundary(originalEnd - 1) || this._OriginalIsBoundary(originalEnd)) {
        return true;
      }
    }
    return false;
  }
  _ModifiedIsBoundary(index) {
    if (index <= 0 || index >= this._modifiedElementsOrHash.length - 1) {
      return true;
    }
    return this._hasStrings && /^\s*$/.test(this._modifiedStringElements[index]);
  }
  _ModifiedRegionIsBoundary(modifiedStart, modifiedLength) {
    if (this._ModifiedIsBoundary(modifiedStart) || this._ModifiedIsBoundary(modifiedStart - 1)) {
      return true;
    }
    if (modifiedLength > 0) {
      const modifiedEnd = modifiedStart + modifiedLength;
      if (this._ModifiedIsBoundary(modifiedEnd - 1) || this._ModifiedIsBoundary(modifiedEnd)) {
        return true;
      }
    }
    return false;
  }
  _boundaryScore(originalStart, originalLength, modifiedStart, modifiedLength) {
    const originalScore = this._OriginalRegionIsBoundary(originalStart, originalLength) ? 1 : 0;
    const modifiedScore = this._ModifiedRegionIsBoundary(modifiedStart, modifiedLength) ? 1 : 0;
    return originalScore + modifiedScore;
  }
  /**
   * Concatenates the two input DiffChange lists and returns the resulting
   * list.
   * @param The left changes
   * @param The right changes
   * @returns The concatenated list
   */
  ConcatenateChanges(left, right) {
    const mergedChangeArr = [];
    if (left.length === 0 || right.length === 0) {
      return right.length > 0 ? right : left;
    } else if (this.ChangesOverlap(left[left.length - 1], right[0], mergedChangeArr)) {
      const result = new Array(left.length + right.length - 1);
      MyArray.Copy(left, 0, result, 0, left.length - 1);
      result[left.length - 1] = mergedChangeArr[0];
      MyArray.Copy(right, 1, result, left.length, right.length - 1);
      return result;
    } else {
      const result = new Array(left.length + right.length);
      MyArray.Copy(left, 0, result, 0, left.length);
      MyArray.Copy(right, 0, result, left.length, right.length);
      return result;
    }
  }
  /**
   * Returns true if the two changes overlap and can be merged into a single
   * change
   * @param left The left change
   * @param right The right change
   * @param mergedChange The merged change if the two overlap, null otherwise
   * @returns True if the two changes overlap
   */
  ChangesOverlap(left, right, mergedChangeArr) {
    Debug.Assert(left.originalStart <= right.originalStart, "Left change is not less than or equal to right change");
    Debug.Assert(left.modifiedStart <= right.modifiedStart, "Left change is not less than or equal to right change");
    if (left.originalStart + left.originalLength >= right.originalStart || left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
      const originalStart = left.originalStart;
      let originalLength = left.originalLength;
      const modifiedStart = left.modifiedStart;
      let modifiedLength = left.modifiedLength;
      if (left.originalStart + left.originalLength >= right.originalStart) {
        originalLength = right.originalStart + right.originalLength - left.originalStart;
      }
      if (left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
        modifiedLength = right.modifiedStart + right.modifiedLength - left.modifiedStart;
      }
      mergedChangeArr[0] = new DiffChange(originalStart, originalLength, modifiedStart, modifiedLength);
      return true;
    } else {
      mergedChangeArr[0] = null;
      return false;
    }
  }
  /**
   * Helper method used to clip a diagonal index to the range of valid
   * diagonals. This also decides whether or not the diagonal index,
   * if it exceeds the boundary, should be clipped to the boundary or clipped
   * one inside the boundary depending on the Even/Odd status of the boundary
   * and numDifferences.
   * @param diagonal The index of the diagonal to clip.
   * @param numDifferences The current number of differences being iterated upon.
   * @param diagonalBaseIndex The base reference diagonal.
   * @param numDiagonals The total number of diagonals.
   * @returns The clipped diagonal index.
   */
  ClipDiagonalBound(diagonal, numDifferences, diagonalBaseIndex, numDiagonals) {
    if (diagonal >= 0 && diagonal < numDiagonals) {
      return diagonal;
    }
    const diagonalsBelow = diagonalBaseIndex;
    const diagonalsAbove = numDiagonals - diagonalBaseIndex - 1;
    const diffEven = numDifferences % 2 === 0;
    if (diagonal < 0) {
      const lowerBoundEven = diagonalsBelow % 2 === 0;
      return diffEven === lowerBoundEven ? 0 : 1;
    } else {
      const upperBoundEven = diagonalsAbove % 2 === 0;
      return diffEven === upperBoundEven ? numDiagonals - 1 : numDiagonals - 2;
    }
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/languages/linkComputer.js
var Uint8Matrix = class {
  constructor(rows, cols, defaultValue) {
    const data = new Uint8Array(rows * cols);
    for (let i = 0, len = rows * cols; i < len; i++) {
      data[i] = defaultValue;
    }
    this._data = data;
    this.rows = rows;
    this.cols = cols;
  }
  get(row, col) {
    return this._data[row * this.cols + col];
  }
  set(row, col, value) {
    this._data[row * this.cols + col] = value;
  }
};
var StateMachine = class {
  constructor(edges) {
    let maxCharCode = 0;
    let maxState = 0;
    for (let i = 0, len = edges.length; i < len; i++) {
      const [from, chCode, to] = edges[i];
      if (chCode > maxCharCode) {
        maxCharCode = chCode;
      }
      if (from > maxState) {
        maxState = from;
      }
      if (to > maxState) {
        maxState = to;
      }
    }
    maxCharCode++;
    maxState++;
    const states = new Uint8Matrix(
      maxState,
      maxCharCode,
      0
      /* State.Invalid */
    );
    for (let i = 0, len = edges.length; i < len; i++) {
      const [from, chCode, to] = edges[i];
      states.set(from, chCode, to);
    }
    this._states = states;
    this._maxCharCode = maxCharCode;
  }
  nextState(currentState, chCode) {
    if (chCode < 0 || chCode >= this._maxCharCode) {
      return 0;
    }
    return this._states.get(currentState, chCode);
  }
};
var _stateMachine = null;
function getStateMachine() {
  if (_stateMachine === null) {
    _stateMachine = new StateMachine([
      [
        1,
        104,
        2
        /* State.H */
      ],
      [
        1,
        72,
        2
        /* State.H */
      ],
      [
        1,
        102,
        6
        /* State.F */
      ],
      [
        1,
        70,
        6
        /* State.F */
      ],
      [
        2,
        116,
        3
        /* State.HT */
      ],
      [
        2,
        84,
        3
        /* State.HT */
      ],
      [
        3,
        116,
        4
        /* State.HTT */
      ],
      [
        3,
        84,
        4
        /* State.HTT */
      ],
      [
        4,
        112,
        5
        /* State.HTTP */
      ],
      [
        4,
        80,
        5
        /* State.HTTP */
      ],
      [
        5,
        115,
        9
        /* State.BeforeColon */
      ],
      [
        5,
        83,
        9
        /* State.BeforeColon */
      ],
      [
        5,
        58,
        10
        /* State.AfterColon */
      ],
      [
        6,
        105,
        7
        /* State.FI */
      ],
      [
        6,
        73,
        7
        /* State.FI */
      ],
      [
        7,
        108,
        8
        /* State.FIL */
      ],
      [
        7,
        76,
        8
        /* State.FIL */
      ],
      [
        8,
        101,
        9
        /* State.BeforeColon */
      ],
      [
        8,
        69,
        9
        /* State.BeforeColon */
      ],
      [
        9,
        58,
        10
        /* State.AfterColon */
      ],
      [
        10,
        47,
        11
        /* State.AlmostThere */
      ],
      [
        11,
        47,
        12
        /* State.End */
      ]
    ]);
  }
  return _stateMachine;
}
var _classifier = null;
function getClassifier() {
  if (_classifier === null) {
    _classifier = new CharacterClassifier(
      0
      /* CharacterClass.None */
    );
    const FORCE_TERMINATION_CHARACTERS = ` 	<>'"\u3001\u3002\uFF61\uFF64\uFF0C\uFF0E\uFF1A\uFF1B\u2018\u3008\u300C\u300E\u3014\uFF08\uFF3B\uFF5B\uFF62\uFF63\uFF5D\uFF3D\uFF09\u3015\u300F\u300D\u3009\u2019\uFF40\uFF5E\u2026|`;
    for (let i = 0; i < FORCE_TERMINATION_CHARACTERS.length; i++) {
      _classifier.set(
        FORCE_TERMINATION_CHARACTERS.charCodeAt(i),
        1
        /* CharacterClass.ForceTermination */
      );
    }
    const CANNOT_END_WITH_CHARACTERS = ".,;:";
    for (let i = 0; i < CANNOT_END_WITH_CHARACTERS.length; i++) {
      _classifier.set(
        CANNOT_END_WITH_CHARACTERS.charCodeAt(i),
        2
        /* CharacterClass.CannotEndIn */
      );
    }
  }
  return _classifier;
}
var LinkComputer = class _LinkComputer {
  static _createLink(classifier, line, lineNumber, linkBeginIndex, linkEndIndex) {
    let lastIncludedCharIndex = linkEndIndex - 1;
    do {
      const chCode = line.charCodeAt(lastIncludedCharIndex);
      const chClass = classifier.get(chCode);
      if (chClass !== 2) {
        break;
      }
      lastIncludedCharIndex--;
    } while (lastIncludedCharIndex > linkBeginIndex);
    if (linkBeginIndex > 0) {
      const charCodeBeforeLink = line.charCodeAt(linkBeginIndex - 1);
      const lastCharCodeInLink = line.charCodeAt(lastIncludedCharIndex);
      if (charCodeBeforeLink === 40 && lastCharCodeInLink === 41 || charCodeBeforeLink === 91 && lastCharCodeInLink === 93 || charCodeBeforeLink === 123 && lastCharCodeInLink === 125) {
        lastIncludedCharIndex--;
      }
    }
    return {
      range: {
        startLineNumber: lineNumber,
        startColumn: linkBeginIndex + 1,
        endLineNumber: lineNumber,
        endColumn: lastIncludedCharIndex + 2
      },
      url: line.substring(linkBeginIndex, lastIncludedCharIndex + 1)
    };
  }
  static computeLinks(model, stateMachine = getStateMachine()) {
    const classifier = getClassifier();
    const result = [];
    for (let i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
      const line = model.getLineContent(i);
      const len = line.length;
      let j = 0;
      let linkBeginIndex = 0;
      let linkBeginChCode = 0;
      let state = 1;
      let hasOpenParens = false;
      let hasOpenSquareBracket = false;
      let inSquareBrackets = false;
      let hasOpenCurlyBracket = false;
      while (j < len) {
        let resetStateMachine = false;
        const chCode = line.charCodeAt(j);
        if (state === 13) {
          let chClass;
          switch (chCode) {
            case 40:
              hasOpenParens = true;
              chClass = 0;
              break;
            case 41:
              chClass = hasOpenParens ? 0 : 1;
              break;
            case 91:
              inSquareBrackets = true;
              hasOpenSquareBracket = true;
              chClass = 0;
              break;
            case 93:
              inSquareBrackets = false;
              chClass = hasOpenSquareBracket ? 0 : 1;
              break;
            case 123:
              hasOpenCurlyBracket = true;
              chClass = 0;
              break;
            case 125:
              chClass = hasOpenCurlyBracket ? 0 : 1;
              break;
            // The following three rules make it that ' or " or ` are allowed inside links
            // only if the link is wrapped by some other quote character
            case 39:
            case 34:
            case 96:
              if (linkBeginChCode === chCode) {
                chClass = 1;
              } else if (linkBeginChCode === 39 || linkBeginChCode === 34 || linkBeginChCode === 96) {
                chClass = 0;
              } else {
                chClass = 1;
              }
              break;
            case 42:
              chClass = linkBeginChCode === 42 ? 1 : 0;
              break;
            case 32:
              chClass = inSquareBrackets ? 0 : 1;
              break;
            default:
              chClass = classifier.get(chCode);
          }
          if (chClass === 1) {
            result.push(_LinkComputer._createLink(classifier, line, i, linkBeginIndex, j));
            resetStateMachine = true;
          }
        } else if (state === 12) {
          let chClass;
          if (chCode === 91) {
            hasOpenSquareBracket = true;
            chClass = 0;
          } else {
            chClass = classifier.get(chCode);
          }
          if (chClass === 1) {
            resetStateMachine = true;
          } else {
            state = 13;
          }
        } else {
          state = stateMachine.nextState(state, chCode);
          if (state === 0) {
            resetStateMachine = true;
          }
        }
        if (resetStateMachine) {
          state = 1;
          hasOpenParens = false;
          hasOpenSquareBracket = false;
          hasOpenCurlyBracket = false;
          linkBeginIndex = j + 1;
          linkBeginChCode = chCode;
        }
        j++;
      }
      if (state === 13) {
        result.push(_LinkComputer._createLink(classifier, line, i, linkBeginIndex, len));
      }
    }
    return result;
  }
};
function computeLinks(model) {
  if (!model || typeof model.getLineCount !== "function" || typeof model.getLineContent !== "function") {
    return [];
  }
  return LinkComputer.computeLinks(model);
}

// node_modules/monaco-editor/esm/vs/editor/common/languages/supports/inplaceReplaceSupport.js
var _BasicInplaceReplace = class _BasicInplaceReplace {
  constructor() {
    this._defaultValueSet = [
      ["true", "false"],
      ["True", "False"],
      ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
      ["public", "protected", "private"]
    ];
  }
  navigateValueSet(range1, text1, range2, text2, up) {
    if (range1 && text1) {
      const result = this.doNavigateValueSet(text1, up);
      if (result) {
        return {
          range: range1,
          value: result
        };
      }
    }
    if (range2 && text2) {
      const result = this.doNavigateValueSet(text2, up);
      if (result) {
        return {
          range: range2,
          value: result
        };
      }
    }
    return null;
  }
  doNavigateValueSet(text, up) {
    const numberResult = this.numberReplace(text, up);
    if (numberResult !== null) {
      return numberResult;
    }
    return this.textReplace(text, up);
  }
  numberReplace(value, up) {
    const precision = Math.pow(10, value.length - (value.lastIndexOf(".") + 1));
    let n1 = Number(value);
    const n2 = parseFloat(value);
    if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {
      if (n1 === 0 && !up) {
        return null;
      } else {
        n1 = Math.floor(n1 * precision);
        n1 += up ? precision : -precision;
        return String(n1 / precision);
      }
    }
    return null;
  }
  textReplace(value, up) {
    return this.valueSetsReplace(this._defaultValueSet, value, up);
  }
  valueSetsReplace(valueSets, value, up) {
    let result = null;
    for (let i = 0, len = valueSets.length; result === null && i < len; i++) {
      result = this.valueSetReplace(valueSets[i], value, up);
    }
    return result;
  }
  valueSetReplace(valueSet, value, up) {
    let idx = valueSet.indexOf(value);
    if (idx >= 0) {
      idx += up ? 1 : -1;
      if (idx < 0) {
        idx = valueSet.length - 1;
      } else {
        idx %= valueSet.length;
      }
      return valueSet[idx];
    }
    return null;
  }
};
_BasicInplaceReplace.INSTANCE = new _BasicInplaceReplace();
var BasicInplaceReplace = _BasicInplaceReplace;

// node_modules/monaco-editor/esm/vs/editor/common/services/unicodeTextModelHighlighter.js
var UnicodeTextModelHighlighter = class {
  static computeUnicodeHighlights(model, options, range) {
    const startLine = range ? range.startLineNumber : 1;
    const endLine = range ? range.endLineNumber : model.getLineCount();
    const codePointHighlighter = new CodePointHighlighter(options);
    const candidates = codePointHighlighter.getCandidateCodePoints();
    let regex;
    if (candidates === "allNonBasicAscii") {
      regex = new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g");
    } else {
      regex = new RegExp(`${buildRegExpCharClassExpr(Array.from(candidates))}`, "g");
    }
    const searcher = new Searcher(null, regex);
    const ranges = [];
    let hasMore = false;
    let m;
    let ambiguousCharacterCount = 0;
    let invisibleCharacterCount = 0;
    let nonBasicAsciiCharacterCount = 0;
    forLoop: for (let lineNumber = startLine, lineCount = endLine; lineNumber <= lineCount; lineNumber++) {
      const lineContent = model.getLineContent(lineNumber);
      const lineLength = lineContent.length;
      searcher.reset(0);
      do {
        m = searcher.next(lineContent);
        if (m) {
          let startIndex = m.index;
          let endIndex = m.index + m[0].length;
          if (startIndex > 0) {
            const charCodeBefore = lineContent.charCodeAt(startIndex - 1);
            if (isHighSurrogate(charCodeBefore)) {
              startIndex--;
            }
          }
          if (endIndex + 1 < lineLength) {
            const charCodeBefore = lineContent.charCodeAt(endIndex - 1);
            if (isHighSurrogate(charCodeBefore)) {
              endIndex++;
            }
          }
          const str = lineContent.substring(startIndex, endIndex);
          let word = getWordAtText(startIndex + 1, DEFAULT_WORD_REGEXP, lineContent, 0);
          if (word && word.endColumn <= startIndex + 1) {
            word = null;
          }
          const highlightReason = codePointHighlighter.shouldHighlightNonBasicASCII(str, word ? word.word : null);
          if (highlightReason !== 0) {
            if (highlightReason === 3) {
              ambiguousCharacterCount++;
            } else if (highlightReason === 2) {
              invisibleCharacterCount++;
            } else if (highlightReason === 1) {
              nonBasicAsciiCharacterCount++;
            } else {
              assertNever();
            }
            const MAX_RESULT_LENGTH = 1e3;
            if (ranges.length >= MAX_RESULT_LENGTH) {
              hasMore = true;
              break forLoop;
            }
            ranges.push(new Range(lineNumber, startIndex + 1, lineNumber, endIndex + 1));
          }
        }
      } while (m);
    }
    return {
      ranges,
      hasMore,
      ambiguousCharacterCount,
      invisibleCharacterCount,
      nonBasicAsciiCharacterCount
    };
  }
  static computeUnicodeHighlightReason(char, options) {
    const codePointHighlighter = new CodePointHighlighter(options);
    const reason = codePointHighlighter.shouldHighlightNonBasicASCII(char, null);
    switch (reason) {
      case 0:
        return null;
      case 2:
        return {
          kind: 1
          /* UnicodeHighlighterReasonKind.Invisible */
        };
      case 3: {
        const codePoint = char.codePointAt(0);
        const primaryConfusable = codePointHighlighter.ambiguousCharacters.getPrimaryConfusable(codePoint);
        const notAmbiguousInLocales = AmbiguousCharacters.getLocales().filter((l) => !AmbiguousCharacters.getInstance(/* @__PURE__ */ new Set([...options.allowedLocales, l])).isAmbiguous(codePoint));
        return { kind: 0, confusableWith: String.fromCodePoint(primaryConfusable), notAmbiguousInLocales };
      }
      case 1:
        return {
          kind: 2
          /* UnicodeHighlighterReasonKind.NonBasicAscii */
        };
    }
  }
};
function buildRegExpCharClassExpr(codePoints, flags) {
  const src = `[${escapeRegExpCharacters(codePoints.map((i) => String.fromCodePoint(i)).join(""))}]`;
  return src;
}
var CodePointHighlighter = class {
  constructor(options) {
    this.options = options;
    this.allowedCodePoints = new Set(options.allowedCodePoints);
    this.ambiguousCharacters = AmbiguousCharacters.getInstance(new Set(options.allowedLocales));
  }
  getCandidateCodePoints() {
    if (this.options.nonBasicASCII) {
      return "allNonBasicAscii";
    }
    const set = /* @__PURE__ */ new Set();
    if (this.options.invisibleCharacters) {
      for (const cp of InvisibleCharacters.codePoints) {
        if (!isAllowedInvisibleCharacter(String.fromCodePoint(cp))) {
          set.add(cp);
        }
      }
    }
    if (this.options.ambiguousCharacters) {
      for (const cp of this.ambiguousCharacters.getConfusableCodePoints()) {
        set.add(cp);
      }
    }
    for (const cp of this.allowedCodePoints) {
      set.delete(cp);
    }
    return set;
  }
  shouldHighlightNonBasicASCII(character, wordContext) {
    const codePoint = character.codePointAt(0);
    if (this.allowedCodePoints.has(codePoint)) {
      return 0;
    }
    if (this.options.nonBasicASCII) {
      return 1;
    }
    let hasBasicASCIICharacters = false;
    let hasNonConfusableNonBasicAsciiCharacter = false;
    if (wordContext) {
      for (const char of wordContext) {
        const codePoint2 = char.codePointAt(0);
        const isBasicASCII$1 = isBasicASCII(char);
        hasBasicASCIICharacters = hasBasicASCIICharacters || isBasicASCII$1;
        if (!isBasicASCII$1 && !this.ambiguousCharacters.isAmbiguous(codePoint2) && !InvisibleCharacters.isInvisibleCharacter(codePoint2)) {
          hasNonConfusableNonBasicAsciiCharacter = true;
        }
      }
    }
    if (
      /* Don't allow mixing weird looking characters with ASCII */
      !hasBasicASCIICharacters && /* Is there an obviously weird looking character? */
      hasNonConfusableNonBasicAsciiCharacter
    ) {
      return 0;
    }
    if (this.options.invisibleCharacters) {
      if (!isAllowedInvisibleCharacter(character) && InvisibleCharacters.isInvisibleCharacter(codePoint)) {
        return 2;
      }
    }
    if (this.options.ambiguousCharacters) {
      if (this.ambiguousCharacters.isAmbiguous(codePoint)) {
        return 3;
      }
    }
    return 0;
  }
};
function isAllowedInvisibleCharacter(character) {
  return character === " " || character === "\n" || character === "	";
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/linesDiffComputer.js
var LinesDiff = class {
  constructor(changes, moves, hitTimeout) {
    this.changes = changes;
    this.moves = moves;
    this.hitTimeout = hitTimeout;
  }
};
var MovedText = class {
  constructor(lineRangeMapping, changes) {
    this.lineRangeMapping = lineRangeMapping;
    this.changes = changes;
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/diff/rangeMapping.js
var LineRangeMapping = class _LineRangeMapping {
  static inverse(mapping, originalLineCount, modifiedLineCount) {
    const result = [];
    let lastOriginalEndLineNumber = 1;
    let lastModifiedEndLineNumber = 1;
    for (const m of mapping) {
      const r2 = new _LineRangeMapping(new LineRange(lastOriginalEndLineNumber, m.original.startLineNumber), new LineRange(lastModifiedEndLineNumber, m.modified.startLineNumber));
      if (!r2.modified.isEmpty) {
        result.push(r2);
      }
      lastOriginalEndLineNumber = m.original.endLineNumberExclusive;
      lastModifiedEndLineNumber = m.modified.endLineNumberExclusive;
    }
    const r = new _LineRangeMapping(new LineRange(lastOriginalEndLineNumber, originalLineCount + 1), new LineRange(lastModifiedEndLineNumber, modifiedLineCount + 1));
    if (!r.modified.isEmpty) {
      result.push(r);
    }
    return result;
  }
  static clip(mapping, originalRange, modifiedRange) {
    const result = [];
    for (const m of mapping) {
      const original = m.original.intersect(originalRange);
      const modified = m.modified.intersect(modifiedRange);
      if (original && !original.isEmpty && modified && !modified.isEmpty) {
        result.push(new _LineRangeMapping(original, modified));
      }
    }
    return result;
  }
  constructor(originalRange, modifiedRange) {
    this.original = originalRange;
    this.modified = modifiedRange;
  }
  toString() {
    return `{${this.original.toString()}->${this.modified.toString()}}`;
  }
  flip() {
    return new _LineRangeMapping(this.modified, this.original);
  }
  join(other) {
    return new _LineRangeMapping(this.original.join(other.original), this.modified.join(other.modified));
  }
  /**
   * This method assumes that the LineRangeMapping describes a valid diff!
   * I.e. if one range is empty, the other range cannot be the entire document.
   * It avoids various problems when the line range points to non-existing line-numbers.
  */
  toRangeMapping() {
    const origInclusiveRange = this.original.toInclusiveRange();
    const modInclusiveRange = this.modified.toInclusiveRange();
    if (origInclusiveRange && modInclusiveRange) {
      return new RangeMapping(origInclusiveRange, modInclusiveRange);
    } else if (this.original.startLineNumber === 1 || this.modified.startLineNumber === 1) {
      if (!(this.modified.startLineNumber === 1 && this.original.startLineNumber === 1)) {
        throw new BugIndicatingError("not a valid diff");
      }
      return new RangeMapping(new Range(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new Range(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
    } else {
      return new RangeMapping(new Range(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), new Range(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER));
    }
  }
  /**
   * This method assumes that the LineRangeMapping describes a valid diff!
   * I.e. if one range is empty, the other range cannot be the entire document.
   * It avoids various problems when the line range points to non-existing line-numbers.
  */
  toRangeMapping2(original, modified) {
    if (isValidLineNumber(this.original.endLineNumberExclusive, original) && isValidLineNumber(this.modified.endLineNumberExclusive, modified)) {
      return new RangeMapping(new Range(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new Range(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
    }
    if (!this.original.isEmpty && !this.modified.isEmpty) {
      return new RangeMapping(Range.fromPositions(new Position(this.original.startLineNumber, 1), normalizePosition(new Position(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), original)), Range.fromPositions(new Position(this.modified.startLineNumber, 1), normalizePosition(new Position(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), modified)));
    }
    if (this.original.startLineNumber > 1 && this.modified.startLineNumber > 1) {
      return new RangeMapping(Range.fromPositions(normalizePosition(new Position(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER), original), normalizePosition(new Position(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), original)), Range.fromPositions(normalizePosition(new Position(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER), modified), normalizePosition(new Position(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), modified)));
    }
    throw new BugIndicatingError();
  }
};
function normalizePosition(position, content) {
  if (position.lineNumber < 1) {
    return new Position(1, 1);
  }
  if (position.lineNumber > content.length) {
    return new Position(content.length, content[content.length - 1].length + 1);
  }
  const line = content[position.lineNumber - 1];
  if (position.column > line.length + 1) {
    return new Position(position.lineNumber, line.length + 1);
  }
  return position;
}
function isValidLineNumber(lineNumber, lines) {
  return lineNumber >= 1 && lineNumber <= lines.length;
}
var DetailedLineRangeMapping = class _DetailedLineRangeMapping extends LineRangeMapping {
  static fromRangeMappings(rangeMappings) {
    const originalRange = LineRange.join(rangeMappings.map((r) => LineRange.fromRangeInclusive(r.originalRange)));
    const modifiedRange = LineRange.join(rangeMappings.map((r) => LineRange.fromRangeInclusive(r.modifiedRange)));
    return new _DetailedLineRangeMapping(originalRange, modifiedRange, rangeMappings);
  }
  constructor(originalRange, modifiedRange, innerChanges) {
    super(originalRange, modifiedRange);
    this.innerChanges = innerChanges;
  }
  flip() {
    return new _DetailedLineRangeMapping(this.modified, this.original, this.innerChanges?.map((c) => c.flip()));
  }
  withInnerChangesFromLineRanges() {
    return new _DetailedLineRangeMapping(this.original, this.modified, [this.toRangeMapping()]);
  }
};
var RangeMapping = class _RangeMapping {
  static fromEdit(edit) {
    const newRanges = edit.getNewRanges();
    const result = edit.replacements.map((e, idx) => new _RangeMapping(e.range, newRanges[idx]));
    return result;
  }
  static assertSorted(rangeMappings) {
    for (let i = 1; i < rangeMappings.length; i++) {
      const previous = rangeMappings[i - 1];
      const current = rangeMappings[i];
      if (!(previous.originalRange.getEndPosition().isBeforeOrEqual(current.originalRange.getStartPosition()) && previous.modifiedRange.getEndPosition().isBeforeOrEqual(current.modifiedRange.getStartPosition()))) {
        throw new BugIndicatingError("Range mappings must be sorted");
      }
    }
  }
  constructor(originalRange, modifiedRange) {
    this.originalRange = originalRange;
    this.modifiedRange = modifiedRange;
  }
  toString() {
    return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
  }
  flip() {
    return new _RangeMapping(this.modifiedRange, this.originalRange);
  }
  /**
   * Creates a single text edit that describes the change from the original to the modified text.
  */
  toTextEdit(modified) {
    const newText = modified.getValueOfRange(this.modifiedRange);
    return new TextReplacement(this.originalRange, newText);
  }
};
function lineRangeMappingFromRangeMappings(alignments, originalLines, modifiedLines, dontAssertStartLine = false) {
  const changes = [];
  for (const g of groupAdjacentBy(alignments.map((a) => getLineRangeMapping(a, originalLines, modifiedLines)), (a1, a2) => a1.original.intersectsOrTouches(a2.original) || a1.modified.intersectsOrTouches(a2.modified))) {
    const first = g[0];
    const last = g[g.length - 1];
    changes.push(new DetailedLineRangeMapping(first.original.join(last.original), first.modified.join(last.modified), g.map((a) => a.innerChanges[0])));
  }
  assertFn(() => {
    if (!dontAssertStartLine && changes.length > 0) {
      if (changes[0].modified.startLineNumber !== changes[0].original.startLineNumber) {
        return false;
      }
      if (modifiedLines.length.lineCount - changes[changes.length - 1].modified.endLineNumberExclusive !== originalLines.length.lineCount - changes[changes.length - 1].original.endLineNumberExclusive) {
        return false;
      }
    }
    return checkAdjacentItems(changes, (m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive && // There has to be an unchanged line in between (otherwise both diffs should have been joined)
    m1.original.endLineNumberExclusive < m2.original.startLineNumber && m1.modified.endLineNumberExclusive < m2.modified.startLineNumber);
  });
  return changes;
}
function getLineRangeMapping(rangeMapping, originalLines, modifiedLines) {
  let lineStartDelta = 0;
  let lineEndDelta = 0;
  if (rangeMapping.modifiedRange.endColumn === 1 && rangeMapping.originalRange.endColumn === 1 && rangeMapping.originalRange.startLineNumber + lineStartDelta <= rangeMapping.originalRange.endLineNumber && rangeMapping.modifiedRange.startLineNumber + lineStartDelta <= rangeMapping.modifiedRange.endLineNumber) {
    lineEndDelta = -1;
  }
  if (rangeMapping.modifiedRange.startColumn - 1 >= modifiedLines.getLineLength(rangeMapping.modifiedRange.startLineNumber) && rangeMapping.originalRange.startColumn - 1 >= originalLines.getLineLength(rangeMapping.originalRange.startLineNumber) && rangeMapping.originalRange.startLineNumber <= rangeMapping.originalRange.endLineNumber + lineEndDelta && rangeMapping.modifiedRange.startLineNumber <= rangeMapping.modifiedRange.endLineNumber + lineEndDelta) {
    lineStartDelta = 1;
  }
  const originalLineRange = new LineRange(rangeMapping.originalRange.startLineNumber + lineStartDelta, rangeMapping.originalRange.endLineNumber + 1 + lineEndDelta);
  const modifiedLineRange = new LineRange(rangeMapping.modifiedRange.startLineNumber + lineStartDelta, rangeMapping.modifiedRange.endLineNumber + 1 + lineEndDelta);
  return new DetailedLineRangeMapping(originalLineRange, modifiedLineRange, [rangeMapping]);
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/legacyLinesDiffComputer.js
var MINIMUM_MATCHING_CHARACTER_LENGTH = 3;
var LegacyLinesDiffComputer = class {
  computeDiff(originalLines, modifiedLines, options) {
    const diffComputer = new DiffComputer(originalLines, modifiedLines, {
      maxComputationTime: options.maxComputationTimeMs,
      shouldIgnoreTrimWhitespace: options.ignoreTrimWhitespace,
      shouldComputeCharChanges: true,
      shouldMakePrettyDiff: true,
      shouldPostProcessCharChanges: true
    });
    const result = diffComputer.computeDiff();
    const changes = [];
    let lastChange = null;
    for (const c of result.changes) {
      let originalRange;
      if (c.originalEndLineNumber === 0) {
        originalRange = new LineRange(c.originalStartLineNumber + 1, c.originalStartLineNumber + 1);
      } else {
        originalRange = new LineRange(c.originalStartLineNumber, c.originalEndLineNumber + 1);
      }
      let modifiedRange;
      if (c.modifiedEndLineNumber === 0) {
        modifiedRange = new LineRange(c.modifiedStartLineNumber + 1, c.modifiedStartLineNumber + 1);
      } else {
        modifiedRange = new LineRange(c.modifiedStartLineNumber, c.modifiedEndLineNumber + 1);
      }
      let change = new DetailedLineRangeMapping(originalRange, modifiedRange, c.charChanges?.map((c2) => new RangeMapping(new Range(c2.originalStartLineNumber, c2.originalStartColumn, c2.originalEndLineNumber, c2.originalEndColumn), new Range(c2.modifiedStartLineNumber, c2.modifiedStartColumn, c2.modifiedEndLineNumber, c2.modifiedEndColumn))));
      if (lastChange) {
        if (lastChange.modified.endLineNumberExclusive === change.modified.startLineNumber || lastChange.original.endLineNumberExclusive === change.original.startLineNumber) {
          change = new DetailedLineRangeMapping(lastChange.original.join(change.original), lastChange.modified.join(change.modified), lastChange.innerChanges && change.innerChanges ? lastChange.innerChanges.concat(change.innerChanges) : void 0);
          changes.pop();
        }
      }
      changes.push(change);
      lastChange = change;
    }
    assertFn(() => {
      return checkAdjacentItems(changes, (m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive && // There has to be an unchanged line in between (otherwise both diffs should have been joined)
      m1.original.endLineNumberExclusive < m2.original.startLineNumber && m1.modified.endLineNumberExclusive < m2.modified.startLineNumber);
    });
    return new LinesDiff(changes, [], result.quitEarly);
  }
};
function computeDiff(originalSequence, modifiedSequence, continueProcessingPredicate, pretty) {
  const diffAlgo = new LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate);
  return diffAlgo.ComputeDiff(pretty);
}
var LineSequence = class {
  constructor(lines) {
    const startColumns = [];
    const endColumns = [];
    for (let i = 0, length = lines.length; i < length; i++) {
      startColumns[i] = getFirstNonBlankColumn(lines[i], 1);
      endColumns[i] = getLastNonBlankColumn(lines[i], 1);
    }
    this.lines = lines;
    this._startColumns = startColumns;
    this._endColumns = endColumns;
  }
  getElements() {
    const elements = [];
    for (let i = 0, len = this.lines.length; i < len; i++) {
      elements[i] = this.lines[i].substring(this._startColumns[i] - 1, this._endColumns[i] - 1);
    }
    return elements;
  }
  getStrictElement(index) {
    return this.lines[index];
  }
  getStartLineNumber(i) {
    return i + 1;
  }
  getEndLineNumber(i) {
    return i + 1;
  }
  createCharSequence(shouldIgnoreTrimWhitespace, startIndex, endIndex) {
    const charCodes = [];
    const lineNumbers = [];
    const columns = [];
    let len = 0;
    for (let index = startIndex; index <= endIndex; index++) {
      const lineContent = this.lines[index];
      const startColumn = shouldIgnoreTrimWhitespace ? this._startColumns[index] : 1;
      const endColumn = shouldIgnoreTrimWhitespace ? this._endColumns[index] : lineContent.length + 1;
      for (let col = startColumn; col < endColumn; col++) {
        charCodes[len] = lineContent.charCodeAt(col - 1);
        lineNumbers[len] = index + 1;
        columns[len] = col;
        len++;
      }
      if (!shouldIgnoreTrimWhitespace && index < endIndex) {
        charCodes[len] = 10;
        lineNumbers[len] = index + 1;
        columns[len] = lineContent.length + 1;
        len++;
      }
    }
    return new CharSequence(charCodes, lineNumbers, columns);
  }
};
var CharSequence = class {
  constructor(charCodes, lineNumbers, columns) {
    this._charCodes = charCodes;
    this._lineNumbers = lineNumbers;
    this._columns = columns;
  }
  toString() {
    return "[" + this._charCodes.map((s, idx) => (s === 10 ? "\\n" : String.fromCharCode(s)) + `-(${this._lineNumbers[idx]},${this._columns[idx]})`).join(", ") + "]";
  }
  _assertIndex(index, arr) {
    if (index < 0 || index >= arr.length) {
      throw new Error(`Illegal index`);
    }
  }
  getElements() {
    return this._charCodes;
  }
  getStartLineNumber(i) {
    if (i > 0 && i === this._lineNumbers.length) {
      return this.getEndLineNumber(i - 1);
    }
    this._assertIndex(i, this._lineNumbers);
    return this._lineNumbers[i];
  }
  getEndLineNumber(i) {
    if (i === -1) {
      return this.getStartLineNumber(i + 1);
    }
    this._assertIndex(i, this._lineNumbers);
    if (this._charCodes[i] === 10) {
      return this._lineNumbers[i] + 1;
    }
    return this._lineNumbers[i];
  }
  getStartColumn(i) {
    if (i > 0 && i === this._columns.length) {
      return this.getEndColumn(i - 1);
    }
    this._assertIndex(i, this._columns);
    return this._columns[i];
  }
  getEndColumn(i) {
    if (i === -1) {
      return this.getStartColumn(i + 1);
    }
    this._assertIndex(i, this._columns);
    if (this._charCodes[i] === 10) {
      return 1;
    }
    return this._columns[i] + 1;
  }
};
var CharChange = class _CharChange {
  constructor(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn) {
    this.originalStartLineNumber = originalStartLineNumber;
    this.originalStartColumn = originalStartColumn;
    this.originalEndLineNumber = originalEndLineNumber;
    this.originalEndColumn = originalEndColumn;
    this.modifiedStartLineNumber = modifiedStartLineNumber;
    this.modifiedStartColumn = modifiedStartColumn;
    this.modifiedEndLineNumber = modifiedEndLineNumber;
    this.modifiedEndColumn = modifiedEndColumn;
  }
  static createFromDiffChange(diffChange, originalCharSequence, modifiedCharSequence) {
    const originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
    const originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
    const originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
    const originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);
    const modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
    const modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
    const modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
    const modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);
    return new _CharChange(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn);
  }
};
function postProcessCharChanges(rawChanges) {
  if (rawChanges.length <= 1) {
    return rawChanges;
  }
  const result = [rawChanges[0]];
  let prevChange = result[0];
  for (let i = 1, len = rawChanges.length; i < len; i++) {
    const currChange = rawChanges[i];
    const originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
    const modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength);
    const matchingLength = Math.min(originalMatchingLength, modifiedMatchingLength);
    if (matchingLength < MINIMUM_MATCHING_CHARACTER_LENGTH) {
      prevChange.originalLength = currChange.originalStart + currChange.originalLength - prevChange.originalStart;
      prevChange.modifiedLength = currChange.modifiedStart + currChange.modifiedLength - prevChange.modifiedStart;
    } else {
      result.push(currChange);
      prevChange = currChange;
    }
  }
  return result;
}
var LineChange = class _LineChange {
  constructor(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges) {
    this.originalStartLineNumber = originalStartLineNumber;
    this.originalEndLineNumber = originalEndLineNumber;
    this.modifiedStartLineNumber = modifiedStartLineNumber;
    this.modifiedEndLineNumber = modifiedEndLineNumber;
    this.charChanges = charChanges;
  }
  static createFromDiffResult(shouldIgnoreTrimWhitespace, diffChange, originalLineSequence, modifiedLineSequence, continueCharDiff, shouldComputeCharChanges, shouldPostProcessCharChanges) {
    let originalStartLineNumber;
    let originalEndLineNumber;
    let modifiedStartLineNumber;
    let modifiedEndLineNumber;
    let charChanges = void 0;
    if (diffChange.originalLength === 0) {
      originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
      originalEndLineNumber = 0;
    } else {
      originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
      originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
    }
    if (diffChange.modifiedLength === 0) {
      modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
      modifiedEndLineNumber = 0;
    } else {
      modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
      modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
    }
    if (shouldComputeCharChanges && diffChange.originalLength > 0 && diffChange.originalLength < 20 && diffChange.modifiedLength > 0 && diffChange.modifiedLength < 20 && continueCharDiff()) {
      const originalCharSequence = originalLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
      const modifiedCharSequence = modifiedLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);
      if (originalCharSequence.getElements().length > 0 && modifiedCharSequence.getElements().length > 0) {
        let rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueCharDiff, true).changes;
        if (shouldPostProcessCharChanges) {
          rawChanges = postProcessCharChanges(rawChanges);
        }
        charChanges = [];
        for (let i = 0, length = rawChanges.length; i < length; i++) {
          charChanges.push(CharChange.createFromDiffChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
        }
      }
    }
    return new _LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges);
  }
};
var DiffComputer = class {
  constructor(originalLines, modifiedLines, opts) {
    this.shouldComputeCharChanges = opts.shouldComputeCharChanges;
    this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
    this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
    this.shouldMakePrettyDiff = opts.shouldMakePrettyDiff;
    this.originalLines = originalLines;
    this.modifiedLines = modifiedLines;
    this.original = new LineSequence(originalLines);
    this.modified = new LineSequence(modifiedLines);
    this.continueLineDiff = createContinueProcessingPredicate(opts.maxComputationTime);
    this.continueCharDiff = createContinueProcessingPredicate(opts.maxComputationTime === 0 ? 0 : Math.min(opts.maxComputationTime, 5e3));
  }
  computeDiff() {
    if (this.original.lines.length === 1 && this.original.lines[0].length === 0) {
      if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
        return {
          quitEarly: false,
          changes: []
        };
      }
      return {
        quitEarly: false,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: 1,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: this.modified.lines.length,
          charChanges: void 0
        }]
      };
    }
    if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
      return {
        quitEarly: false,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: this.original.lines.length,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: 1,
          charChanges: void 0
        }]
      };
    }
    const diffResult = computeDiff(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff);
    const rawChanges = diffResult.changes;
    const quitEarly = diffResult.quitEarly;
    if (this.shouldIgnoreTrimWhitespace) {
      const lineChanges = [];
      for (let i = 0, length = rawChanges.length; i < length; i++) {
        lineChanges.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, rawChanges[i], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
      }
      return {
        quitEarly,
        changes: lineChanges
      };
    }
    const result = [];
    let originalLineIndex = 0;
    let modifiedLineIndex = 0;
    for (let i = -1, len = rawChanges.length; i < len; i++) {
      const nextChange = i + 1 < len ? rawChanges[i + 1] : null;
      const originalStop = nextChange ? nextChange.originalStart : this.originalLines.length;
      const modifiedStop = nextChange ? nextChange.modifiedStart : this.modifiedLines.length;
      while (originalLineIndex < originalStop && modifiedLineIndex < modifiedStop) {
        const originalLine = this.originalLines[originalLineIndex];
        const modifiedLine = this.modifiedLines[modifiedLineIndex];
        if (originalLine !== modifiedLine) {
          {
            let originalStartColumn = getFirstNonBlankColumn(originalLine, 1);
            let modifiedStartColumn = getFirstNonBlankColumn(modifiedLine, 1);
            while (originalStartColumn > 1 && modifiedStartColumn > 1) {
              const originalChar = originalLine.charCodeAt(originalStartColumn - 2);
              const modifiedChar = modifiedLine.charCodeAt(modifiedStartColumn - 2);
              if (originalChar !== modifiedChar) {
                break;
              }
              originalStartColumn--;
              modifiedStartColumn--;
            }
            if (originalStartColumn > 1 || modifiedStartColumn > 1) {
              this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, 1, originalStartColumn, modifiedLineIndex + 1, 1, modifiedStartColumn);
            }
          }
          {
            let originalEndColumn = getLastNonBlankColumn(originalLine, 1);
            let modifiedEndColumn = getLastNonBlankColumn(modifiedLine, 1);
            const originalMaxColumn = originalLine.length + 1;
            const modifiedMaxColumn = modifiedLine.length + 1;
            while (originalEndColumn < originalMaxColumn && modifiedEndColumn < modifiedMaxColumn) {
              const originalChar = originalLine.charCodeAt(originalEndColumn - 1);
              const modifiedChar = originalLine.charCodeAt(modifiedEndColumn - 1);
              if (originalChar !== modifiedChar) {
                break;
              }
              originalEndColumn++;
              modifiedEndColumn++;
            }
            if (originalEndColumn < originalMaxColumn || modifiedEndColumn < modifiedMaxColumn) {
              this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, originalEndColumn, originalMaxColumn, modifiedLineIndex + 1, modifiedEndColumn, modifiedMaxColumn);
            }
          }
        }
        originalLineIndex++;
        modifiedLineIndex++;
      }
      if (nextChange) {
        result.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, nextChange, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
        originalLineIndex += nextChange.originalLength;
        modifiedLineIndex += nextChange.modifiedLength;
      }
    }
    return {
      quitEarly,
      changes: result
    };
  }
  _pushTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
    if (this._mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn)) {
      return;
    }
    let charChanges = void 0;
    if (this.shouldComputeCharChanges) {
      charChanges = [new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn)];
    }
    result.push(new LineChange(originalLineNumber, originalLineNumber, modifiedLineNumber, modifiedLineNumber, charChanges));
  }
  _mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
    const len = result.length;
    if (len === 0) {
      return false;
    }
    const prevChange = result[len - 1];
    if (prevChange.originalEndLineNumber === 0 || prevChange.modifiedEndLineNumber === 0) {
      return false;
    }
    if (prevChange.originalEndLineNumber === originalLineNumber && prevChange.modifiedEndLineNumber === modifiedLineNumber) {
      if (this.shouldComputeCharChanges && prevChange.charChanges) {
        prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
      }
      return true;
    }
    if (prevChange.originalEndLineNumber + 1 === originalLineNumber && prevChange.modifiedEndLineNumber + 1 === modifiedLineNumber) {
      prevChange.originalEndLineNumber = originalLineNumber;
      prevChange.modifiedEndLineNumber = modifiedLineNumber;
      if (this.shouldComputeCharChanges && prevChange.charChanges) {
        prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
      }
      return true;
    }
    return false;
  }
};
function getFirstNonBlankColumn(txt, defaultValue) {
  const r = firstNonWhitespaceIndex(txt);
  if (r === -1) {
    return defaultValue;
  }
  return r + 1;
}
function getLastNonBlankColumn(txt, defaultValue) {
  const r = lastNonWhitespaceIndex(txt);
  if (r === -1) {
    return defaultValue;
  }
  return r + 2;
}
function createContinueProcessingPredicate(maximumRuntime) {
  if (maximumRuntime === 0) {
    return () => true;
  }
  const startTime = Date.now();
  return () => {
    return Date.now() - startTime < maximumRuntime;
  };
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/diffAlgorithm.js
var DiffAlgorithmResult = class _DiffAlgorithmResult {
  static trivial(seq1, seq2) {
    return new _DiffAlgorithmResult([new SequenceDiff(OffsetRange.ofLength(seq1.length), OffsetRange.ofLength(seq2.length))], false);
  }
  static trivialTimedOut(seq1, seq2) {
    return new _DiffAlgorithmResult([new SequenceDiff(OffsetRange.ofLength(seq1.length), OffsetRange.ofLength(seq2.length))], true);
  }
  constructor(diffs, hitTimeout) {
    this.diffs = diffs;
    this.hitTimeout = hitTimeout;
  }
};
var SequenceDiff = class _SequenceDiff {
  static invert(sequenceDiffs, doc1Length) {
    const result = [];
    forEachAdjacent(sequenceDiffs, (a, b) => {
      result.push(_SequenceDiff.fromOffsetPairs(a ? a.getEndExclusives() : OffsetPair.zero, b ? b.getStarts() : new OffsetPair(doc1Length, (a ? a.seq2Range.endExclusive - a.seq1Range.endExclusive : 0) + doc1Length)));
    });
    return result;
  }
  static fromOffsetPairs(start, endExclusive) {
    return new _SequenceDiff(new OffsetRange(start.offset1, endExclusive.offset1), new OffsetRange(start.offset2, endExclusive.offset2));
  }
  static assertSorted(sequenceDiffs) {
    let last = void 0;
    for (const cur of sequenceDiffs) {
      if (last) {
        if (!(last.seq1Range.endExclusive <= cur.seq1Range.start && last.seq2Range.endExclusive <= cur.seq2Range.start)) {
          throw new BugIndicatingError("Sequence diffs must be sorted");
        }
      }
      last = cur;
    }
  }
  constructor(seq1Range, seq2Range) {
    this.seq1Range = seq1Range;
    this.seq2Range = seq2Range;
  }
  swap() {
    return new _SequenceDiff(this.seq2Range, this.seq1Range);
  }
  toString() {
    return `${this.seq1Range} <-> ${this.seq2Range}`;
  }
  join(other) {
    return new _SequenceDiff(this.seq1Range.join(other.seq1Range), this.seq2Range.join(other.seq2Range));
  }
  delta(offset) {
    if (offset === 0) {
      return this;
    }
    return new _SequenceDiff(this.seq1Range.delta(offset), this.seq2Range.delta(offset));
  }
  deltaStart(offset) {
    if (offset === 0) {
      return this;
    }
    return new _SequenceDiff(this.seq1Range.deltaStart(offset), this.seq2Range.deltaStart(offset));
  }
  deltaEnd(offset) {
    if (offset === 0) {
      return this;
    }
    return new _SequenceDiff(this.seq1Range.deltaEnd(offset), this.seq2Range.deltaEnd(offset));
  }
  intersect(other) {
    const i1 = this.seq1Range.intersect(other.seq1Range);
    const i2 = this.seq2Range.intersect(other.seq2Range);
    if (!i1 || !i2) {
      return void 0;
    }
    return new _SequenceDiff(i1, i2);
  }
  getStarts() {
    return new OffsetPair(this.seq1Range.start, this.seq2Range.start);
  }
  getEndExclusives() {
    return new OffsetPair(this.seq1Range.endExclusive, this.seq2Range.endExclusive);
  }
};
var _OffsetPair = class _OffsetPair {
  constructor(offset1, offset2) {
    this.offset1 = offset1;
    this.offset2 = offset2;
  }
  toString() {
    return `${this.offset1} <-> ${this.offset2}`;
  }
  delta(offset) {
    if (offset === 0) {
      return this;
    }
    return new _OffsetPair(this.offset1 + offset, this.offset2 + offset);
  }
  equals(other) {
    return this.offset1 === other.offset1 && this.offset2 === other.offset2;
  }
};
_OffsetPair.zero = new _OffsetPair(0, 0);
_OffsetPair.max = new _OffsetPair(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
var OffsetPair = _OffsetPair;
var _InfiniteTimeout = class _InfiniteTimeout {
  isValid() {
    return true;
  }
};
_InfiniteTimeout.instance = new _InfiniteTimeout();
var InfiniteTimeout = _InfiniteTimeout;
var DateTimeout = class {
  constructor(timeout) {
    this.timeout = timeout;
    this.startTime = Date.now();
    this.valid = true;
    if (timeout <= 0) {
      throw new BugIndicatingError("timeout must be positive");
    }
  }
  // Recommendation: Set a log-point `{this.disable()}` in the body
  isValid() {
    const valid = Date.now() - this.startTime < this.timeout;
    if (!valid && this.valid) {
      this.valid = false;
    }
    return this.valid;
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/utils.js
var Array2D = class {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.array = [];
    this.array = new Array(width * height);
  }
  get(x, y) {
    return this.array[x + y * this.width];
  }
  set(x, y, value) {
    this.array[x + y * this.width] = value;
  }
};
function isSpace(charCode) {
  return charCode === 32 || charCode === 9;
}
var _LineRangeFragment = class _LineRangeFragment {
  static getKey(chr) {
    let key = this.chrKeys.get(chr);
    if (key === void 0) {
      key = this.chrKeys.size;
      this.chrKeys.set(chr, key);
    }
    return key;
  }
  constructor(range, lines, source) {
    this.range = range;
    this.lines = lines;
    this.source = source;
    this.histogram = [];
    let counter = 0;
    for (let i = range.startLineNumber - 1; i < range.endLineNumberExclusive - 1; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        counter++;
        const chr = line[j];
        const key2 = _LineRangeFragment.getKey(chr);
        this.histogram[key2] = (this.histogram[key2] || 0) + 1;
      }
      counter++;
      const key = _LineRangeFragment.getKey("\n");
      this.histogram[key] = (this.histogram[key] || 0) + 1;
    }
    this.totalCount = counter;
  }
  computeSimilarity(other) {
    let sumDifferences = 0;
    const maxLength = Math.max(this.histogram.length, other.histogram.length);
    for (let i = 0; i < maxLength; i++) {
      sumDifferences += Math.abs((this.histogram[i] ?? 0) - (other.histogram[i] ?? 0));
    }
    return 1 - sumDifferences / (this.totalCount + other.totalCount);
  }
};
_LineRangeFragment.chrKeys = /* @__PURE__ */ new Map();
var LineRangeFragment = _LineRangeFragment;

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/dynamicProgrammingDiffing.js
var DynamicProgrammingDiffing = class {
  compute(sequence1, sequence2, timeout = InfiniteTimeout.instance, equalityScore) {
    if (sequence1.length === 0 || sequence2.length === 0) {
      return DiffAlgorithmResult.trivial(sequence1, sequence2);
    }
    const lcsLengths = new Array2D(sequence1.length, sequence2.length);
    const directions = new Array2D(sequence1.length, sequence2.length);
    const lengths = new Array2D(sequence1.length, sequence2.length);
    for (let s12 = 0; s12 < sequence1.length; s12++) {
      for (let s22 = 0; s22 < sequence2.length; s22++) {
        if (!timeout.isValid()) {
          return DiffAlgorithmResult.trivialTimedOut(sequence1, sequence2);
        }
        const horizontalLen = s12 === 0 ? 0 : lcsLengths.get(s12 - 1, s22);
        const verticalLen = s22 === 0 ? 0 : lcsLengths.get(s12, s22 - 1);
        let extendedSeqScore;
        if (sequence1.getElement(s12) === sequence2.getElement(s22)) {
          if (s12 === 0 || s22 === 0) {
            extendedSeqScore = 0;
          } else {
            extendedSeqScore = lcsLengths.get(s12 - 1, s22 - 1);
          }
          if (s12 > 0 && s22 > 0 && directions.get(s12 - 1, s22 - 1) === 3) {
            extendedSeqScore += lengths.get(s12 - 1, s22 - 1);
          }
          extendedSeqScore += equalityScore ? equalityScore(s12, s22) : 1;
        } else {
          extendedSeqScore = -1;
        }
        const newValue = Math.max(horizontalLen, verticalLen, extendedSeqScore);
        if (newValue === extendedSeqScore) {
          const prevLen = s12 > 0 && s22 > 0 ? lengths.get(s12 - 1, s22 - 1) : 0;
          lengths.set(s12, s22, prevLen + 1);
          directions.set(s12, s22, 3);
        } else if (newValue === horizontalLen) {
          lengths.set(s12, s22, 0);
          directions.set(s12, s22, 1);
        } else if (newValue === verticalLen) {
          lengths.set(s12, s22, 0);
          directions.set(s12, s22, 2);
        }
        lcsLengths.set(s12, s22, newValue);
      }
    }
    const result = [];
    let lastAligningPosS1 = sequence1.length;
    let lastAligningPosS2 = sequence2.length;
    function reportDecreasingAligningPositions(s12, s22) {
      if (s12 + 1 !== lastAligningPosS1 || s22 + 1 !== lastAligningPosS2) {
        result.push(new SequenceDiff(new OffsetRange(s12 + 1, lastAligningPosS1), new OffsetRange(s22 + 1, lastAligningPosS2)));
      }
      lastAligningPosS1 = s12;
      lastAligningPosS2 = s22;
    }
    let s1 = sequence1.length - 1;
    let s2 = sequence2.length - 1;
    while (s1 >= 0 && s2 >= 0) {
      if (directions.get(s1, s2) === 3) {
        reportDecreasingAligningPositions(s1, s2);
        s1--;
        s2--;
      } else {
        if (directions.get(s1, s2) === 1) {
          s1--;
        } else {
          s2--;
        }
      }
    }
    reportDecreasingAligningPositions(-1, -1);
    result.reverse();
    return new DiffAlgorithmResult(result, false);
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/myersDiffAlgorithm.js
var MyersDiffAlgorithm = class {
  compute(seq1, seq2, timeout = InfiniteTimeout.instance) {
    if (seq1.length === 0 || seq2.length === 0) {
      return DiffAlgorithmResult.trivial(seq1, seq2);
    }
    const seqX = seq1;
    const seqY = seq2;
    function getXAfterSnake(x, y) {
      while (x < seqX.length && y < seqY.length && seqX.getElement(x) === seqY.getElement(y)) {
        x++;
        y++;
      }
      return x;
    }
    let d = 0;
    const V = new FastInt32Array();
    V.set(0, getXAfterSnake(0, 0));
    const paths = new FastArrayNegativeIndices();
    paths.set(0, V.get(0) === 0 ? null : new SnakePath(null, 0, 0, V.get(0)));
    let k = 0;
    loop: while (true) {
      d++;
      if (!timeout.isValid()) {
        return DiffAlgorithmResult.trivialTimedOut(seqX, seqY);
      }
      const lowerBound = -Math.min(d, seqY.length + d % 2);
      const upperBound = Math.min(d, seqX.length + d % 2);
      for (k = lowerBound; k <= upperBound; k += 2) {
        const maxXofDLineTop = k === upperBound ? -1 : V.get(k + 1);
        const maxXofDLineLeft = k === lowerBound ? -1 : V.get(k - 1) + 1;
        const x = Math.min(Math.max(maxXofDLineTop, maxXofDLineLeft), seqX.length);
        const y = x - k;
        if (x > seqX.length || y > seqY.length) {
          continue;
        }
        const newMaxX = getXAfterSnake(x, y);
        V.set(k, newMaxX);
        const lastPath = x === maxXofDLineTop ? paths.get(k + 1) : paths.get(k - 1);
        paths.set(k, newMaxX !== x ? new SnakePath(lastPath, x, y, newMaxX - x) : lastPath);
        if (V.get(k) === seqX.length && V.get(k) - k === seqY.length) {
          break loop;
        }
      }
    }
    let path = paths.get(k);
    const result = [];
    let lastAligningPosS1 = seqX.length;
    let lastAligningPosS2 = seqY.length;
    while (true) {
      const endX = path ? path.x + path.length : 0;
      const endY = path ? path.y + path.length : 0;
      if (endX !== lastAligningPosS1 || endY !== lastAligningPosS2) {
        result.push(new SequenceDiff(new OffsetRange(endX, lastAligningPosS1), new OffsetRange(endY, lastAligningPosS2)));
      }
      if (!path) {
        break;
      }
      lastAligningPosS1 = path.x;
      lastAligningPosS2 = path.y;
      path = path.prev;
    }
    result.reverse();
    return new DiffAlgorithmResult(result, false);
  }
};
var SnakePath = class {
  constructor(prev, x, y, length) {
    this.prev = prev;
    this.x = x;
    this.y = y;
    this.length = length;
  }
};
var FastInt32Array = class {
  constructor() {
    this.positiveArr = new Int32Array(10);
    this.negativeArr = new Int32Array(10);
  }
  get(idx) {
    if (idx < 0) {
      idx = -idx - 1;
      return this.negativeArr[idx];
    } else {
      return this.positiveArr[idx];
    }
  }
  set(idx, value) {
    if (idx < 0) {
      idx = -idx - 1;
      if (idx >= this.negativeArr.length) {
        const arr = this.negativeArr;
        this.negativeArr = new Int32Array(arr.length * 2);
        this.negativeArr.set(arr);
      }
      this.negativeArr[idx] = value;
    } else {
      if (idx >= this.positiveArr.length) {
        const arr = this.positiveArr;
        this.positiveArr = new Int32Array(arr.length * 2);
        this.positiveArr.set(arr);
      }
      this.positiveArr[idx] = value;
    }
  }
};
var FastArrayNegativeIndices = class {
  constructor() {
    this.positiveArr = [];
    this.negativeArr = [];
  }
  get(idx) {
    if (idx < 0) {
      idx = -idx - 1;
      return this.negativeArr[idx];
    } else {
      return this.positiveArr[idx];
    }
  }
  set(idx, value) {
    if (idx < 0) {
      idx = -idx - 1;
      this.negativeArr[idx] = value;
    } else {
      this.positiveArr[idx] = value;
    }
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/linesSliceCharSequence.js
var LinesSliceCharSequence = class {
  constructor(lines, range, considerWhitespaceChanges) {
    this.lines = lines;
    this.range = range;
    this.considerWhitespaceChanges = considerWhitespaceChanges;
    this.elements = [];
    this.firstElementOffsetByLineIdx = [];
    this.lineStartOffsets = [];
    this.trimmedWsLengthsByLineIdx = [];
    this.firstElementOffsetByLineIdx.push(0);
    for (let lineNumber = this.range.startLineNumber; lineNumber <= this.range.endLineNumber; lineNumber++) {
      let line = lines[lineNumber - 1];
      let lineStartOffset = 0;
      if (lineNumber === this.range.startLineNumber && this.range.startColumn > 1) {
        lineStartOffset = this.range.startColumn - 1;
        line = line.substring(lineStartOffset);
      }
      this.lineStartOffsets.push(lineStartOffset);
      let trimmedWsLength = 0;
      if (!considerWhitespaceChanges) {
        const trimmedStartLine = line.trimStart();
        trimmedWsLength = line.length - trimmedStartLine.length;
        line = trimmedStartLine.trimEnd();
      }
      this.trimmedWsLengthsByLineIdx.push(trimmedWsLength);
      const lineLength = lineNumber === this.range.endLineNumber ? Math.min(this.range.endColumn - 1 - lineStartOffset - trimmedWsLength, line.length) : line.length;
      for (let i = 0; i < lineLength; i++) {
        this.elements.push(line.charCodeAt(i));
      }
      if (lineNumber < this.range.endLineNumber) {
        this.elements.push("\n".charCodeAt(0));
        this.firstElementOffsetByLineIdx.push(this.elements.length);
      }
    }
  }
  toString() {
    return `Slice: "${this.text}"`;
  }
  get text() {
    return this.getText(new OffsetRange(0, this.length));
  }
  getText(range) {
    return this.elements.slice(range.start, range.endExclusive).map((e) => String.fromCharCode(e)).join("");
  }
  getElement(offset) {
    return this.elements[offset];
  }
  get length() {
    return this.elements.length;
  }
  getBoundaryScore(length) {
    const prevCategory = getCategory(length > 0 ? this.elements[length - 1] : -1);
    const nextCategory = getCategory(length < this.elements.length ? this.elements[length] : -1);
    if (prevCategory === 7 && nextCategory === 8) {
      return 0;
    }
    if (prevCategory === 8) {
      return 150;
    }
    let score2 = 0;
    if (prevCategory !== nextCategory) {
      score2 += 10;
      if (prevCategory === 0 && nextCategory === 1) {
        score2 += 1;
      }
    }
    score2 += getCategoryBoundaryScore(prevCategory);
    score2 += getCategoryBoundaryScore(nextCategory);
    return score2;
  }
  translateOffset(offset, preference = "right") {
    const i = findLastIdxMonotonous(this.firstElementOffsetByLineIdx, (value) => value <= offset);
    const lineOffset = offset - this.firstElementOffsetByLineIdx[i];
    return new Position(this.range.startLineNumber + i, 1 + this.lineStartOffsets[i] + lineOffset + (lineOffset === 0 && preference === "left" ? 0 : this.trimmedWsLengthsByLineIdx[i]));
  }
  translateRange(range) {
    const pos1 = this.translateOffset(range.start, "right");
    const pos2 = this.translateOffset(range.endExclusive, "left");
    if (pos2.isBefore(pos1)) {
      return Range.fromPositions(pos2, pos2);
    }
    return Range.fromPositions(pos1, pos2);
  }
  /**
   * Finds the word that contains the character at the given offset
   */
  findWordContaining(offset) {
    if (offset < 0 || offset >= this.elements.length) {
      return void 0;
    }
    if (!isWordChar(this.elements[offset])) {
      return void 0;
    }
    let start = offset;
    while (start > 0 && isWordChar(this.elements[start - 1])) {
      start--;
    }
    let end = offset;
    while (end < this.elements.length && isWordChar(this.elements[end])) {
      end++;
    }
    return new OffsetRange(start, end);
  }
  /** fooBar has the two sub-words foo and bar */
  findSubWordContaining(offset) {
    if (offset < 0 || offset >= this.elements.length) {
      return void 0;
    }
    if (!isWordChar(this.elements[offset])) {
      return void 0;
    }
    let start = offset;
    while (start > 0 && isWordChar(this.elements[start - 1]) && !isUpperCase(this.elements[start])) {
      start--;
    }
    let end = offset;
    while (end < this.elements.length && isWordChar(this.elements[end]) && !isUpperCase(this.elements[end])) {
      end++;
    }
    return new OffsetRange(start, end);
  }
  countLinesIn(range) {
    return this.translateOffset(range.endExclusive).lineNumber - this.translateOffset(range.start).lineNumber;
  }
  isStronglyEqual(offset1, offset2) {
    return this.elements[offset1] === this.elements[offset2];
  }
  extendToFullLines(range) {
    const start = findLastMonotonous(this.firstElementOffsetByLineIdx, (x) => x <= range.start) ?? 0;
    const end = findFirstMonotonous(this.firstElementOffsetByLineIdx, (x) => range.endExclusive <= x) ?? this.elements.length;
    return new OffsetRange(start, end);
  }
};
function isWordChar(charCode) {
  return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90 || charCode >= 48 && charCode <= 57;
}
function isUpperCase(charCode) {
  return charCode >= 65 && charCode <= 90;
}
var score = {
  [
    0
    /* CharBoundaryCategory.WordLower */
  ]: 0,
  [
    1
    /* CharBoundaryCategory.WordUpper */
  ]: 0,
  [
    2
    /* CharBoundaryCategory.WordNumber */
  ]: 0,
  [
    3
    /* CharBoundaryCategory.End */
  ]: 10,
  [
    4
    /* CharBoundaryCategory.Other */
  ]: 2,
  [
    5
    /* CharBoundaryCategory.Separator */
  ]: 30,
  [
    6
    /* CharBoundaryCategory.Space */
  ]: 3,
  [
    7
    /* CharBoundaryCategory.LineBreakCR */
  ]: 10,
  [
    8
    /* CharBoundaryCategory.LineBreakLF */
  ]: 10
};
function getCategoryBoundaryScore(category) {
  return score[category];
}
function getCategory(charCode) {
  if (charCode === 10) {
    return 8;
  } else if (charCode === 13) {
    return 7;
  } else if (isSpace(charCode)) {
    return 6;
  } else if (charCode >= 97 && charCode <= 122) {
    return 0;
  } else if (charCode >= 65 && charCode <= 90) {
    return 1;
  } else if (charCode >= 48 && charCode <= 57) {
    return 2;
  } else if (charCode === -1) {
    return 3;
  } else if (charCode === 44 || charCode === 59) {
    return 5;
  } else {
    return 4;
  }
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/computeMovedLines.js
function computeMovedLines(changes, originalLines, modifiedLines, hashedOriginalLines, hashedModifiedLines, timeout) {
  let { moves, excludedChanges } = computeMovesFromSimpleDeletionsToSimpleInsertions(changes, originalLines, modifiedLines, timeout);
  if (!timeout.isValid()) {
    return [];
  }
  const filteredChanges = changes.filter((c) => !excludedChanges.has(c));
  const unchangedMoves = computeUnchangedMoves(filteredChanges, hashedOriginalLines, hashedModifiedLines, originalLines, modifiedLines, timeout);
  pushMany(moves, unchangedMoves);
  moves = joinCloseConsecutiveMoves(moves);
  moves = moves.filter((current) => {
    const lines = current.original.toOffsetRange().slice(originalLines).map((l) => l.trim());
    const originalText = lines.join("\n");
    return originalText.length >= 15 && countWhere(lines, (l) => l.length >= 2) >= 2;
  });
  moves = removeMovesInSameDiff(changes, moves);
  return moves;
}
function countWhere(arr, predicate) {
  let count = 0;
  for (const t of arr) {
    if (predicate(t)) {
      count++;
    }
  }
  return count;
}
function computeMovesFromSimpleDeletionsToSimpleInsertions(changes, originalLines, modifiedLines, timeout) {
  const moves = [];
  const deletions = changes.filter((c) => c.modified.isEmpty && c.original.length >= 3).map((d) => new LineRangeFragment(d.original, originalLines, d));
  const insertions = new Set(changes.filter((c) => c.original.isEmpty && c.modified.length >= 3).map((d) => new LineRangeFragment(d.modified, modifiedLines, d)));
  const excludedChanges = /* @__PURE__ */ new Set();
  for (const deletion of deletions) {
    let highestSimilarity = -1;
    let best;
    for (const insertion of insertions) {
      const similarity = deletion.computeSimilarity(insertion);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        best = insertion;
      }
    }
    if (highestSimilarity > 0.9 && best) {
      insertions.delete(best);
      moves.push(new LineRangeMapping(deletion.range, best.range));
      excludedChanges.add(deletion.source);
      excludedChanges.add(best.source);
    }
    if (!timeout.isValid()) {
      return { moves, excludedChanges };
    }
  }
  return { moves, excludedChanges };
}
function computeUnchangedMoves(changes, hashedOriginalLines, hashedModifiedLines, originalLines, modifiedLines, timeout) {
  const moves = [];
  const original3LineHashes = new SetMap();
  for (const change of changes) {
    for (let i = change.original.startLineNumber; i < change.original.endLineNumberExclusive - 2; i++) {
      const key = `${hashedOriginalLines[i - 1]}:${hashedOriginalLines[i + 1 - 1]}:${hashedOriginalLines[i + 2 - 1]}`;
      original3LineHashes.add(key, { range: new LineRange(i, i + 3) });
    }
  }
  const possibleMappings = [];
  changes.sort(compareBy((c) => c.modified.startLineNumber, numberComparator));
  for (const change of changes) {
    let lastMappings = [];
    for (let i = change.modified.startLineNumber; i < change.modified.endLineNumberExclusive - 2; i++) {
      const key = `${hashedModifiedLines[i - 1]}:${hashedModifiedLines[i + 1 - 1]}:${hashedModifiedLines[i + 2 - 1]}`;
      const currentModifiedRange = new LineRange(i, i + 3);
      const nextMappings = [];
      original3LineHashes.forEach(key, ({ range }) => {
        for (const lastMapping of lastMappings) {
          if (lastMapping.originalLineRange.endLineNumberExclusive + 1 === range.endLineNumberExclusive && lastMapping.modifiedLineRange.endLineNumberExclusive + 1 === currentModifiedRange.endLineNumberExclusive) {
            lastMapping.originalLineRange = new LineRange(lastMapping.originalLineRange.startLineNumber, range.endLineNumberExclusive);
            lastMapping.modifiedLineRange = new LineRange(lastMapping.modifiedLineRange.startLineNumber, currentModifiedRange.endLineNumberExclusive);
            nextMappings.push(lastMapping);
            return;
          }
        }
        const mapping = {
          modifiedLineRange: currentModifiedRange,
          originalLineRange: range
        };
        possibleMappings.push(mapping);
        nextMappings.push(mapping);
      });
      lastMappings = nextMappings;
    }
    if (!timeout.isValid()) {
      return [];
    }
  }
  possibleMappings.sort(reverseOrder(compareBy((m) => m.modifiedLineRange.length, numberComparator)));
  const modifiedSet = new LineRangeSet();
  const originalSet = new LineRangeSet();
  for (const mapping of possibleMappings) {
    const diffOrigToMod = mapping.modifiedLineRange.startLineNumber - mapping.originalLineRange.startLineNumber;
    const modifiedSections = modifiedSet.subtractFrom(mapping.modifiedLineRange);
    const originalTranslatedSections = originalSet.subtractFrom(mapping.originalLineRange).getWithDelta(diffOrigToMod);
    const modifiedIntersectedSections = modifiedSections.getIntersection(originalTranslatedSections);
    for (const s of modifiedIntersectedSections.ranges) {
      if (s.length < 3) {
        continue;
      }
      const modifiedLineRange = s;
      const originalLineRange = s.delta(-diffOrigToMod);
      moves.push(new LineRangeMapping(originalLineRange, modifiedLineRange));
      modifiedSet.addRange(modifiedLineRange);
      originalSet.addRange(originalLineRange);
    }
  }
  moves.sort(compareBy((m) => m.original.startLineNumber, numberComparator));
  const monotonousChanges = new MonotonousArray(changes);
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const firstTouchingChangeOrig = monotonousChanges.findLastMonotonous((c) => c.original.startLineNumber <= move.original.startLineNumber);
    const firstTouchingChangeMod = findLastMonotonous(changes, (c) => c.modified.startLineNumber <= move.modified.startLineNumber);
    const linesAbove = Math.max(move.original.startLineNumber - firstTouchingChangeOrig.original.startLineNumber, move.modified.startLineNumber - firstTouchingChangeMod.modified.startLineNumber);
    const lastTouchingChangeOrig = monotonousChanges.findLastMonotonous((c) => c.original.startLineNumber < move.original.endLineNumberExclusive);
    const lastTouchingChangeMod = findLastMonotonous(changes, (c) => c.modified.startLineNumber < move.modified.endLineNumberExclusive);
    const linesBelow = Math.max(lastTouchingChangeOrig.original.endLineNumberExclusive - move.original.endLineNumberExclusive, lastTouchingChangeMod.modified.endLineNumberExclusive - move.modified.endLineNumberExclusive);
    let extendToTop;
    for (extendToTop = 0; extendToTop < linesAbove; extendToTop++) {
      const origLine = move.original.startLineNumber - extendToTop - 1;
      const modLine = move.modified.startLineNumber - extendToTop - 1;
      if (origLine > originalLines.length || modLine > modifiedLines.length) {
        break;
      }
      if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
        break;
      }
      if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {
        break;
      }
    }
    if (extendToTop > 0) {
      originalSet.addRange(new LineRange(move.original.startLineNumber - extendToTop, move.original.startLineNumber));
      modifiedSet.addRange(new LineRange(move.modified.startLineNumber - extendToTop, move.modified.startLineNumber));
    }
    let extendToBottom;
    for (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {
      const origLine = move.original.endLineNumberExclusive + extendToBottom;
      const modLine = move.modified.endLineNumberExclusive + extendToBottom;
      if (origLine > originalLines.length || modLine > modifiedLines.length) {
        break;
      }
      if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
        break;
      }
      if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {
        break;
      }
    }
    if (extendToBottom > 0) {
      originalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottom));
      modifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottom));
    }
    if (extendToTop > 0 || extendToBottom > 0) {
      moves[i] = new LineRangeMapping(new LineRange(move.original.startLineNumber - extendToTop, move.original.endLineNumberExclusive + extendToBottom), new LineRange(move.modified.startLineNumber - extendToTop, move.modified.endLineNumberExclusive + extendToBottom));
    }
  }
  return moves;
}
function areLinesSimilar(line1, line2, timeout) {
  if (line1.trim() === line2.trim()) {
    return true;
  }
  if (line1.length > 300 && line2.length > 300) {
    return false;
  }
  const myersDiffingAlgorithm = new MyersDiffAlgorithm();
  const result = myersDiffingAlgorithm.compute(new LinesSliceCharSequence([line1], new Range(1, 1, 1, line1.length), false), new LinesSliceCharSequence([line2], new Range(1, 1, 1, line2.length), false), timeout);
  let commonNonSpaceCharCount = 0;
  const inverted = SequenceDiff.invert(result.diffs, line1.length);
  for (const seq of inverted) {
    seq.seq1Range.forEach((idx) => {
      if (!isSpace(line1.charCodeAt(idx))) {
        commonNonSpaceCharCount++;
      }
    });
  }
  function countNonWsChars(str) {
    let count = 0;
    for (let i = 0; i < line1.length; i++) {
      if (!isSpace(str.charCodeAt(i))) {
        count++;
      }
    }
    return count;
  }
  const longerLineLength = countNonWsChars(line1.length > line2.length ? line1 : line2);
  const r = commonNonSpaceCharCount / longerLineLength > 0.6 && longerLineLength > 10;
  return r;
}
function joinCloseConsecutiveMoves(moves) {
  if (moves.length === 0) {
    return moves;
  }
  moves.sort(compareBy((m) => m.original.startLineNumber, numberComparator));
  const result = [moves[0]];
  for (let i = 1; i < moves.length; i++) {
    const last = result[result.length - 1];
    const current = moves[i];
    const originalDist = current.original.startLineNumber - last.original.endLineNumberExclusive;
    const modifiedDist = current.modified.startLineNumber - last.modified.endLineNumberExclusive;
    const currentMoveAfterLast = originalDist >= 0 && modifiedDist >= 0;
    if (currentMoveAfterLast && originalDist + modifiedDist <= 2) {
      result[result.length - 1] = last.join(current);
      continue;
    }
    result.push(current);
  }
  return result;
}
function removeMovesInSameDiff(changes, moves) {
  const changesMonotonous = new MonotonousArray(changes);
  moves = moves.filter((m) => {
    const diffBeforeEndOfMoveOriginal = changesMonotonous.findLastMonotonous((c) => c.original.startLineNumber < m.original.endLineNumberExclusive) || new LineRangeMapping(new LineRange(1, 1), new LineRange(1, 1));
    const diffBeforeEndOfMoveModified = findLastMonotonous(changes, (c) => c.modified.startLineNumber < m.modified.endLineNumberExclusive);
    const differentDiffs = diffBeforeEndOfMoveOriginal !== diffBeforeEndOfMoveModified;
    return differentDiffs;
  });
  return moves;
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/heuristicSequenceOptimizations.js
function optimizeSequenceDiffs(sequence1, sequence2, sequenceDiffs) {
  let result = sequenceDiffs;
  result = joinSequenceDiffsByShifting(sequence1, sequence2, result);
  result = joinSequenceDiffsByShifting(sequence1, sequence2, result);
  result = shiftSequenceDiffs(sequence1, sequence2, result);
  return result;
}
function joinSequenceDiffsByShifting(sequence1, sequence2, sequenceDiffs) {
  if (sequenceDiffs.length === 0) {
    return sequenceDiffs;
  }
  const result = [];
  result.push(sequenceDiffs[0]);
  for (let i = 1; i < sequenceDiffs.length; i++) {
    const prevResult = result[result.length - 1];
    let cur = sequenceDiffs[i];
    if (cur.seq1Range.isEmpty || cur.seq2Range.isEmpty) {
      const length = cur.seq1Range.start - prevResult.seq1Range.endExclusive;
      let d;
      for (d = 1; d <= length; d++) {
        if (sequence1.getElement(cur.seq1Range.start - d) !== sequence1.getElement(cur.seq1Range.endExclusive - d) || sequence2.getElement(cur.seq2Range.start - d) !== sequence2.getElement(cur.seq2Range.endExclusive - d)) {
          break;
        }
      }
      d--;
      if (d === length) {
        result[result.length - 1] = new SequenceDiff(new OffsetRange(prevResult.seq1Range.start, cur.seq1Range.endExclusive - length), new OffsetRange(prevResult.seq2Range.start, cur.seq2Range.endExclusive - length));
        continue;
      }
      cur = cur.delta(-d);
    }
    result.push(cur);
  }
  const result2 = [];
  for (let i = 0; i < result.length - 1; i++) {
    const nextResult = result[i + 1];
    let cur = result[i];
    if (cur.seq1Range.isEmpty || cur.seq2Range.isEmpty) {
      const length = nextResult.seq1Range.start - cur.seq1Range.endExclusive;
      let d;
      for (d = 0; d < length; d++) {
        if (!sequence1.isStronglyEqual(cur.seq1Range.start + d, cur.seq1Range.endExclusive + d) || !sequence2.isStronglyEqual(cur.seq2Range.start + d, cur.seq2Range.endExclusive + d)) {
          break;
        }
      }
      if (d === length) {
        result[i + 1] = new SequenceDiff(new OffsetRange(cur.seq1Range.start + length, nextResult.seq1Range.endExclusive), new OffsetRange(cur.seq2Range.start + length, nextResult.seq2Range.endExclusive));
        continue;
      }
      if (d > 0) {
        cur = cur.delta(d);
      }
    }
    result2.push(cur);
  }
  if (result.length > 0) {
    result2.push(result[result.length - 1]);
  }
  return result2;
}
function shiftSequenceDiffs(sequence1, sequence2, sequenceDiffs) {
  if (!sequence1.getBoundaryScore || !sequence2.getBoundaryScore) {
    return sequenceDiffs;
  }
  for (let i = 0; i < sequenceDiffs.length; i++) {
    const prevDiff = i > 0 ? sequenceDiffs[i - 1] : void 0;
    const diff = sequenceDiffs[i];
    const nextDiff = i + 1 < sequenceDiffs.length ? sequenceDiffs[i + 1] : void 0;
    const seq1ValidRange = new OffsetRange(prevDiff ? prevDiff.seq1Range.endExclusive + 1 : 0, nextDiff ? nextDiff.seq1Range.start - 1 : sequence1.length);
    const seq2ValidRange = new OffsetRange(prevDiff ? prevDiff.seq2Range.endExclusive + 1 : 0, nextDiff ? nextDiff.seq2Range.start - 1 : sequence2.length);
    if (diff.seq1Range.isEmpty) {
      sequenceDiffs[i] = shiftDiffToBetterPosition(diff, sequence1, sequence2, seq1ValidRange, seq2ValidRange);
    } else if (diff.seq2Range.isEmpty) {
      sequenceDiffs[i] = shiftDiffToBetterPosition(diff.swap(), sequence2, sequence1, seq2ValidRange, seq1ValidRange).swap();
    }
  }
  return sequenceDiffs;
}
function shiftDiffToBetterPosition(diff, sequence1, sequence2, seq1ValidRange, seq2ValidRange) {
  const maxShiftLimit = 100;
  let deltaBefore = 1;
  while (diff.seq1Range.start - deltaBefore >= seq1ValidRange.start && diff.seq2Range.start - deltaBefore >= seq2ValidRange.start && sequence2.isStronglyEqual(diff.seq2Range.start - deltaBefore, diff.seq2Range.endExclusive - deltaBefore) && deltaBefore < maxShiftLimit) {
    deltaBefore++;
  }
  deltaBefore--;
  let deltaAfter = 0;
  while (diff.seq1Range.start + deltaAfter < seq1ValidRange.endExclusive && diff.seq2Range.endExclusive + deltaAfter < seq2ValidRange.endExclusive && sequence2.isStronglyEqual(diff.seq2Range.start + deltaAfter, diff.seq2Range.endExclusive + deltaAfter) && deltaAfter < maxShiftLimit) {
    deltaAfter++;
  }
  if (deltaBefore === 0 && deltaAfter === 0) {
    return diff;
  }
  let bestDelta = 0;
  let bestScore = -1;
  for (let delta = -deltaBefore; delta <= deltaAfter; delta++) {
    const seq2OffsetStart = diff.seq2Range.start + delta;
    const seq2OffsetEndExclusive = diff.seq2Range.endExclusive + delta;
    const seq1Offset = diff.seq1Range.start + delta;
    const score2 = sequence1.getBoundaryScore(seq1Offset) + sequence2.getBoundaryScore(seq2OffsetStart) + sequence2.getBoundaryScore(seq2OffsetEndExclusive);
    if (score2 > bestScore) {
      bestScore = score2;
      bestDelta = delta;
    }
  }
  return diff.delta(bestDelta);
}
function removeShortMatches(sequence1, sequence2, sequenceDiffs) {
  const result = [];
  for (const s of sequenceDiffs) {
    const last = result[result.length - 1];
    if (!last) {
      result.push(s);
      continue;
    }
    if (s.seq1Range.start - last.seq1Range.endExclusive <= 2 || s.seq2Range.start - last.seq2Range.endExclusive <= 2) {
      result[result.length - 1] = new SequenceDiff(last.seq1Range.join(s.seq1Range), last.seq2Range.join(s.seq2Range));
    } else {
      result.push(s);
    }
  }
  return result;
}
function extendDiffsToEntireWordIfAppropriate(sequence1, sequence2, sequenceDiffs, findParent, force = false) {
  const equalMappings = SequenceDiff.invert(sequenceDiffs, sequence1.length);
  const additional = [];
  let lastPoint = new OffsetPair(0, 0);
  function scanWord(pair, equalMapping) {
    if (pair.offset1 < lastPoint.offset1 || pair.offset2 < lastPoint.offset2) {
      return;
    }
    const w1 = findParent(sequence1, pair.offset1);
    const w2 = findParent(sequence2, pair.offset2);
    if (!w1 || !w2) {
      return;
    }
    let w = new SequenceDiff(w1, w2);
    const equalPart = w.intersect(equalMapping);
    let equalChars1 = equalPart.seq1Range.length;
    let equalChars2 = equalPart.seq2Range.length;
    while (equalMappings.length > 0) {
      const next = equalMappings[0];
      const intersects = next.seq1Range.intersects(w.seq1Range) || next.seq2Range.intersects(w.seq2Range);
      if (!intersects) {
        break;
      }
      const v1 = findParent(sequence1, next.seq1Range.start);
      const v2 = findParent(sequence2, next.seq2Range.start);
      const v = new SequenceDiff(v1, v2);
      const equalPart2 = v.intersect(next);
      equalChars1 += equalPart2.seq1Range.length;
      equalChars2 += equalPart2.seq2Range.length;
      w = w.join(v);
      if (w.seq1Range.endExclusive >= next.seq1Range.endExclusive) {
        equalMappings.shift();
      } else {
        break;
      }
    }
    if (force && equalChars1 + equalChars2 < w.seq1Range.length + w.seq2Range.length || equalChars1 + equalChars2 < (w.seq1Range.length + w.seq2Range.length) * 2 / 3) {
      additional.push(w);
    }
    lastPoint = w.getEndExclusives();
  }
  while (equalMappings.length > 0) {
    const next = equalMappings.shift();
    if (next.seq1Range.isEmpty) {
      continue;
    }
    scanWord(next.getStarts(), next);
    scanWord(next.getEndExclusives().delta(-1), next);
  }
  const merged = mergeSequenceDiffs(sequenceDiffs, additional);
  return merged;
}
function mergeSequenceDiffs(sequenceDiffs1, sequenceDiffs2) {
  const result = [];
  while (sequenceDiffs1.length > 0 || sequenceDiffs2.length > 0) {
    const sd1 = sequenceDiffs1[0];
    const sd2 = sequenceDiffs2[0];
    let next;
    if (sd1 && (!sd2 || sd1.seq1Range.start < sd2.seq1Range.start)) {
      next = sequenceDiffs1.shift();
    } else {
      next = sequenceDiffs2.shift();
    }
    if (result.length > 0 && result[result.length - 1].seq1Range.endExclusive >= next.seq1Range.start) {
      result[result.length - 1] = result[result.length - 1].join(next);
    } else {
      result.push(next);
    }
  }
  return result;
}
function removeVeryShortMatchingLinesBetweenDiffs(sequence1, _sequence2, sequenceDiffs) {
  let diffs = sequenceDiffs;
  if (diffs.length === 0) {
    return diffs;
  }
  let counter = 0;
  let shouldRepeat;
  do {
    shouldRepeat = false;
    const result = [
      diffs[0]
    ];
    for (let i = 1; i < diffs.length; i++) {
      let shouldJoinDiffs = function(before, after) {
        const unchangedRange = new OffsetRange(lastResult.seq1Range.endExclusive, cur.seq1Range.start);
        const unchangedText = sequence1.getText(unchangedRange);
        const unchangedTextWithoutWs = unchangedText.replace(/\s/g, "");
        if (unchangedTextWithoutWs.length <= 4 && (before.seq1Range.length + before.seq2Range.length > 5 || after.seq1Range.length + after.seq2Range.length > 5)) {
          return true;
        }
        return false;
      };
      const cur = diffs[i];
      const lastResult = result[result.length - 1];
      const shouldJoin = shouldJoinDiffs(lastResult, cur);
      if (shouldJoin) {
        shouldRepeat = true;
        result[result.length - 1] = result[result.length - 1].join(cur);
      } else {
        result.push(cur);
      }
    }
    diffs = result;
  } while (counter++ < 10 && shouldRepeat);
  return diffs;
}
function removeVeryShortMatchingTextBetweenLongDiffs(sequence1, sequence2, sequenceDiffs) {
  let diffs = sequenceDiffs;
  if (diffs.length === 0) {
    return diffs;
  }
  let counter = 0;
  let shouldRepeat;
  do {
    shouldRepeat = false;
    const result = [
      diffs[0]
    ];
    for (let i = 1; i < diffs.length; i++) {
      let shouldJoinDiffs = function(before, after) {
        const unchangedRange = new OffsetRange(lastResult.seq1Range.endExclusive, cur.seq1Range.start);
        const unchangedLineCount = sequence1.countLinesIn(unchangedRange);
        if (unchangedLineCount > 5 || unchangedRange.length > 500) {
          return false;
        }
        const unchangedText = sequence1.getText(unchangedRange).trim();
        if (unchangedText.length > 20 || unchangedText.split(/\r\n|\r|\n/).length > 1) {
          return false;
        }
        const beforeLineCount1 = sequence1.countLinesIn(before.seq1Range);
        const beforeSeq1Length = before.seq1Range.length;
        const beforeLineCount2 = sequence2.countLinesIn(before.seq2Range);
        const beforeSeq2Length = before.seq2Range.length;
        const afterLineCount1 = sequence1.countLinesIn(after.seq1Range);
        const afterSeq1Length = after.seq1Range.length;
        const afterLineCount2 = sequence2.countLinesIn(after.seq2Range);
        const afterSeq2Length = after.seq2Range.length;
        const max = 2 * 40 + 50;
        function cap(v) {
          return Math.min(v, max);
        }
        if (Math.pow(Math.pow(cap(beforeLineCount1 * 40 + beforeSeq1Length), 1.5) + Math.pow(cap(beforeLineCount2 * 40 + beforeSeq2Length), 1.5), 1.5) + Math.pow(Math.pow(cap(afterLineCount1 * 40 + afterSeq1Length), 1.5) + Math.pow(cap(afterLineCount2 * 40 + afterSeq2Length), 1.5), 1.5) > (max ** 1.5) ** 1.5 * 1.3) {
          return true;
        }
        return false;
      };
      const cur = diffs[i];
      const lastResult = result[result.length - 1];
      const shouldJoin = shouldJoinDiffs(lastResult, cur);
      if (shouldJoin) {
        shouldRepeat = true;
        result[result.length - 1] = result[result.length - 1].join(cur);
      } else {
        result.push(cur);
      }
    }
    diffs = result;
  } while (counter++ < 10 && shouldRepeat);
  const newDiffs = [];
  forEachWithNeighbors(diffs, (prev, cur, next) => {
    let newDiff = cur;
    function shouldMarkAsChanged(text) {
      return text.length > 0 && text.trim().length <= 3 && cur.seq1Range.length + cur.seq2Range.length > 100;
    }
    const fullRange1 = sequence1.extendToFullLines(cur.seq1Range);
    const prefix = sequence1.getText(new OffsetRange(fullRange1.start, cur.seq1Range.start));
    if (shouldMarkAsChanged(prefix)) {
      newDiff = newDiff.deltaStart(-prefix.length);
    }
    const suffix = sequence1.getText(new OffsetRange(cur.seq1Range.endExclusive, fullRange1.endExclusive));
    if (shouldMarkAsChanged(suffix)) {
      newDiff = newDiff.deltaEnd(suffix.length);
    }
    const availableSpace = SequenceDiff.fromOffsetPairs(prev ? prev.getEndExclusives() : OffsetPair.zero, next ? next.getStarts() : OffsetPair.max);
    const result = newDiff.intersect(availableSpace);
    if (newDiffs.length > 0 && result.getStarts().equals(newDiffs[newDiffs.length - 1].getEndExclusives())) {
      newDiffs[newDiffs.length - 1] = newDiffs[newDiffs.length - 1].join(result);
    } else {
      newDiffs.push(result);
    }
  });
  return newDiffs;
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/lineSequence.js
var LineSequence2 = class {
  constructor(trimmedHash, lines) {
    this.trimmedHash = trimmedHash;
    this.lines = lines;
  }
  getElement(offset) {
    return this.trimmedHash[offset];
  }
  get length() {
    return this.trimmedHash.length;
  }
  getBoundaryScore(length) {
    const indentationBefore = length === 0 ? 0 : getIndentation(this.lines[length - 1]);
    const indentationAfter = length === this.lines.length ? 0 : getIndentation(this.lines[length]);
    return 1e3 - (indentationBefore + indentationAfter);
  }
  getText(range) {
    return this.lines.slice(range.start, range.endExclusive).join("\n");
  }
  isStronglyEqual(offset1, offset2) {
    return this.lines[offset1] === this.lines[offset2];
  }
};
function getIndentation(str) {
  let i = 0;
  while (i < str.length && (str.charCodeAt(i) === 32 || str.charCodeAt(i) === 9)) {
    i++;
  }
  return i;
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js
var DefaultLinesDiffComputer = class {
  constructor() {
    this.dynamicProgrammingDiffing = new DynamicProgrammingDiffing();
    this.myersDiffingAlgorithm = new MyersDiffAlgorithm();
  }
  computeDiff(originalLines, modifiedLines, options) {
    if (originalLines.length <= 1 && equals(originalLines, modifiedLines, (a, b) => a === b)) {
      return new LinesDiff([], [], false);
    }
    if (originalLines.length === 1 && originalLines[0].length === 0 || modifiedLines.length === 1 && modifiedLines[0].length === 0) {
      return new LinesDiff([
        new DetailedLineRangeMapping(new LineRange(1, originalLines.length + 1), new LineRange(1, modifiedLines.length + 1), [
          new RangeMapping(new Range(1, 1, originalLines.length, originalLines[originalLines.length - 1].length + 1), new Range(1, 1, modifiedLines.length, modifiedLines[modifiedLines.length - 1].length + 1))
        ])
      ], [], false);
    }
    const timeout = options.maxComputationTimeMs === 0 ? InfiniteTimeout.instance : new DateTimeout(options.maxComputationTimeMs);
    const considerWhitespaceChanges = !options.ignoreTrimWhitespace;
    const perfectHashes = /* @__PURE__ */ new Map();
    function getOrCreateHash(text) {
      let hash = perfectHashes.get(text);
      if (hash === void 0) {
        hash = perfectHashes.size;
        perfectHashes.set(text, hash);
      }
      return hash;
    }
    const originalLinesHashes = originalLines.map((l) => getOrCreateHash(l.trim()));
    const modifiedLinesHashes = modifiedLines.map((l) => getOrCreateHash(l.trim()));
    const sequence1 = new LineSequence2(originalLinesHashes, originalLines);
    const sequence2 = new LineSequence2(modifiedLinesHashes, modifiedLines);
    const lineAlignmentResult = (() => {
      if (sequence1.length + sequence2.length < 1700) {
        return this.dynamicProgrammingDiffing.compute(sequence1, sequence2, timeout, (offset1, offset2) => originalLines[offset1] === modifiedLines[offset2] ? modifiedLines[offset2].length === 0 ? 0.1 : 1 + Math.log(1 + modifiedLines[offset2].length) : 0.99);
      }
      return this.myersDiffingAlgorithm.compute(sequence1, sequence2, timeout);
    })();
    let lineAlignments = lineAlignmentResult.diffs;
    let hitTimeout = lineAlignmentResult.hitTimeout;
    lineAlignments = optimizeSequenceDiffs(sequence1, sequence2, lineAlignments);
    lineAlignments = removeVeryShortMatchingLinesBetweenDiffs(sequence1, sequence2, lineAlignments);
    const alignments = [];
    const scanForWhitespaceChanges = (equalLinesCount) => {
      if (!considerWhitespaceChanges) {
        return;
      }
      for (let i = 0; i < equalLinesCount; i++) {
        const seq1Offset = seq1LastStart + i;
        const seq2Offset = seq2LastStart + i;
        if (originalLines[seq1Offset] !== modifiedLines[seq2Offset]) {
          const characterDiffs = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(new OffsetRange(seq1Offset, seq1Offset + 1), new OffsetRange(seq2Offset, seq2Offset + 1)), timeout, considerWhitespaceChanges, options);
          for (const a of characterDiffs.mappings) {
            alignments.push(a);
          }
          if (characterDiffs.hitTimeout) {
            hitTimeout = true;
          }
        }
      }
    };
    let seq1LastStart = 0;
    let seq2LastStart = 0;
    for (const diff of lineAlignments) {
      assertFn(() => diff.seq1Range.start - seq1LastStart === diff.seq2Range.start - seq2LastStart);
      const equalLinesCount = diff.seq1Range.start - seq1LastStart;
      scanForWhitespaceChanges(equalLinesCount);
      seq1LastStart = diff.seq1Range.endExclusive;
      seq2LastStart = diff.seq2Range.endExclusive;
      const characterDiffs = this.refineDiff(originalLines, modifiedLines, diff, timeout, considerWhitespaceChanges, options);
      if (characterDiffs.hitTimeout) {
        hitTimeout = true;
      }
      for (const a of characterDiffs.mappings) {
        alignments.push(a);
      }
    }
    scanForWhitespaceChanges(originalLines.length - seq1LastStart);
    const original = new ArrayText(originalLines);
    const modified = new ArrayText(modifiedLines);
    const changes = lineRangeMappingFromRangeMappings(alignments, original, modified);
    let moves = [];
    if (options.computeMoves) {
      moves = this.computeMoves(changes, originalLines, modifiedLines, originalLinesHashes, modifiedLinesHashes, timeout, considerWhitespaceChanges, options);
    }
    assertFn(() => {
      function validatePosition(pos, lines) {
        if (pos.lineNumber < 1 || pos.lineNumber > lines.length) {
          return false;
        }
        const line = lines[pos.lineNumber - 1];
        if (pos.column < 1 || pos.column > line.length + 1) {
          return false;
        }
        return true;
      }
      function validateRange(range, lines) {
        if (range.startLineNumber < 1 || range.startLineNumber > lines.length + 1) {
          return false;
        }
        if (range.endLineNumberExclusive < 1 || range.endLineNumberExclusive > lines.length + 1) {
          return false;
        }
        return true;
      }
      for (const c of changes) {
        if (!c.innerChanges) {
          return false;
        }
        for (const ic of c.innerChanges) {
          const valid = validatePosition(ic.modifiedRange.getStartPosition(), modifiedLines) && validatePosition(ic.modifiedRange.getEndPosition(), modifiedLines) && validatePosition(ic.originalRange.getStartPosition(), originalLines) && validatePosition(ic.originalRange.getEndPosition(), originalLines);
          if (!valid) {
            return false;
          }
        }
        if (!validateRange(c.modified, modifiedLines) || !validateRange(c.original, originalLines)) {
          return false;
        }
      }
      return true;
    });
    return new LinesDiff(changes, moves, hitTimeout);
  }
  computeMoves(changes, originalLines, modifiedLines, hashedOriginalLines, hashedModifiedLines, timeout, considerWhitespaceChanges, options) {
    const moves = computeMovedLines(changes, originalLines, modifiedLines, hashedOriginalLines, hashedModifiedLines, timeout);
    const movesWithDiffs = moves.map((m) => {
      const moveChanges = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(m.original.toOffsetRange(), m.modified.toOffsetRange()), timeout, considerWhitespaceChanges, options);
      const mappings = lineRangeMappingFromRangeMappings(moveChanges.mappings, new ArrayText(originalLines), new ArrayText(modifiedLines), true);
      return new MovedText(m, mappings);
    });
    return movesWithDiffs;
  }
  refineDiff(originalLines, modifiedLines, diff, timeout, considerWhitespaceChanges, options) {
    const lineRangeMapping = toLineRangeMapping(diff);
    const rangeMapping = lineRangeMapping.toRangeMapping2(originalLines, modifiedLines);
    const slice1 = new LinesSliceCharSequence(originalLines, rangeMapping.originalRange, considerWhitespaceChanges);
    const slice2 = new LinesSliceCharSequence(modifiedLines, rangeMapping.modifiedRange, considerWhitespaceChanges);
    const diffResult = slice1.length + slice2.length < 500 ? this.dynamicProgrammingDiffing.compute(slice1, slice2, timeout) : this.myersDiffingAlgorithm.compute(slice1, slice2, timeout);
    let diffs = diffResult.diffs;
    diffs = optimizeSequenceDiffs(slice1, slice2, diffs);
    diffs = extendDiffsToEntireWordIfAppropriate(slice1, slice2, diffs, (seq, idx) => seq.findWordContaining(idx));
    if (options.extendToSubwords) {
      diffs = extendDiffsToEntireWordIfAppropriate(slice1, slice2, diffs, (seq, idx) => seq.findSubWordContaining(idx), true);
    }
    diffs = removeShortMatches(slice1, slice2, diffs);
    diffs = removeVeryShortMatchingTextBetweenLongDiffs(slice1, slice2, diffs);
    const result = diffs.map((d) => new RangeMapping(slice1.translateRange(d.seq1Range), slice2.translateRange(d.seq2Range)));
    return {
      mappings: result,
      hitTimeout: diffResult.hitTimeout
    };
  }
};
function toLineRangeMapping(sequenceDiff) {
  return new LineRangeMapping(new LineRange(sequenceDiff.seq1Range.start + 1, sequenceDiff.seq1Range.endExclusive + 1), new LineRange(sequenceDiff.seq2Range.start + 1, sequenceDiff.seq2Range.endExclusive + 1));
}

// node_modules/monaco-editor/esm/vs/editor/common/diff/linesDiffComputers.js
var linesDiffComputers = {
  getLegacy: () => new LegacyLinesDiffComputer(),
  getDefault: () => new DefaultLinesDiffComputer()
};

// node_modules/monaco-editor/esm/vs/editor/common/languages/defaultDocumentColorsComputer.js
function _parseCaptureGroups(captureGroups) {
  const values = [];
  for (const captureGroup of captureGroups) {
    const parsedNumber = Number(captureGroup);
    if (parsedNumber || parsedNumber === 0 && captureGroup.replace(/\s/g, "") !== "") {
      values.push(parsedNumber);
    }
  }
  return values;
}
function _toIColor(r, g, b, a) {
  return {
    red: r / 255,
    blue: b / 255,
    green: g / 255,
    alpha: a
  };
}
function _findRange(model, match) {
  const index = match.index;
  const length = match[0].length;
  if (index === void 0) {
    return;
  }
  const startPosition = model.positionAt(index);
  const range = {
    startLineNumber: startPosition.lineNumber,
    startColumn: startPosition.column,
    endLineNumber: startPosition.lineNumber,
    endColumn: startPosition.column + length
  };
  return range;
}
function _findHexColorInformation(range, hexValue) {
  if (!range) {
    return;
  }
  const parsedHexColor = Color.Format.CSS.parseHex(hexValue);
  if (!parsedHexColor) {
    return;
  }
  return {
    range,
    color: _toIColor(parsedHexColor.rgba.r, parsedHexColor.rgba.g, parsedHexColor.rgba.b, parsedHexColor.rgba.a)
  };
}
function _findRGBColorInformation(range, matches, isAlpha) {
  if (!range || matches.length !== 1) {
    return;
  }
  const match = matches[0];
  const captureGroups = match.values();
  const parsedRegex = _parseCaptureGroups(captureGroups);
  return {
    range,
    color: _toIColor(parsedRegex[0], parsedRegex[1], parsedRegex[2], isAlpha ? parsedRegex[3] : 1)
  };
}
function _findHSLColorInformation(range, matches, isAlpha) {
  if (!range || matches.length !== 1) {
    return;
  }
  const match = matches[0];
  const captureGroups = match.values();
  const parsedRegex = _parseCaptureGroups(captureGroups);
  const colorEquivalent = new Color(new HSLA(parsedRegex[0], parsedRegex[1] / 100, parsedRegex[2] / 100, isAlpha ? parsedRegex[3] : 1));
  return {
    range,
    color: _toIColor(colorEquivalent.rgba.r, colorEquivalent.rgba.g, colorEquivalent.rgba.b, colorEquivalent.rgba.a)
  };
}
function _findMatches(model, regex) {
  if (typeof model === "string") {
    return [...model.matchAll(regex)];
  } else {
    return model.findMatches(regex);
  }
}
function computeColors(model) {
  const result = [];
  const initialValidationRegex = /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|^(#)([A-Fa-f0-9]{3})\b|^(#)([A-Fa-f0-9]{4})\b|^(#)([A-Fa-f0-9]{6})\b|^(#)([A-Fa-f0-9]{8})\b|(?<=['"\s])(#)([A-Fa-f0-9]{3})\b|(?<=['"\s])(#)([A-Fa-f0-9]{4})\b|(?<=['"\s])(#)([A-Fa-f0-9]{6})\b|(?<=['"\s])(#)([A-Fa-f0-9]{8})\b/gm;
  const initialValidationMatches = _findMatches(model, initialValidationRegex);
  if (initialValidationMatches.length > 0) {
    for (const initialMatch of initialValidationMatches) {
      const initialCaptureGroups = initialMatch.filter((captureGroup) => captureGroup !== void 0);
      const colorScheme = initialCaptureGroups[1];
      const colorParameters = initialCaptureGroups[2];
      if (!colorParameters) {
        continue;
      }
      let colorInformation;
      if (colorScheme === "rgb") {
        const regexParameters = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm;
        colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), false);
      } else if (colorScheme === "rgba") {
        const regexParameters = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
        colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), true);
      } else if (colorScheme === "hsl") {
        const regexParameters = /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm;
        colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), false);
      } else if (colorScheme === "hsla") {
        const regexParameters = /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(0[.][0-9]+|[.][0-9]+|[01][.]0*|[01])\s*\)$/gm;
        colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), true);
      } else if (colorScheme === "#") {
        colorInformation = _findHexColorInformation(_findRange(model, initialMatch), colorScheme + colorParameters);
      }
      if (colorInformation) {
        result.push(colorInformation);
      }
    }
  }
  return result;
}
function computeDefaultDocumentColors(model) {
  if (!model || typeof model.getValue !== "function" || typeof model.positionAt !== "function") {
    return [];
  }
  return computeColors(model);
}

// node_modules/monaco-editor/esm/vs/editor/common/services/findSectionHeaders.js
var trimDashesRegex = /^-+|-+$/g;
var CHUNK_SIZE = 100;
var MAX_SECTION_LINES = 5;
function findSectionHeaders(model, options) {
  let headers = [];
  if (options.findRegionSectionHeaders && options.foldingRules?.markers) {
    const regionHeaders = collectRegionHeaders(model, options);
    headers = headers.concat(regionHeaders);
  }
  if (options.findMarkSectionHeaders) {
    const markHeaders = collectMarkHeaders(model, options);
    headers = headers.concat(markHeaders);
  }
  return headers;
}
function collectRegionHeaders(model, options) {
  const regionHeaders = [];
  const endLineNumber = model.getLineCount();
  for (let lineNumber = 1; lineNumber <= endLineNumber; lineNumber++) {
    const lineContent = model.getLineContent(lineNumber);
    const match = lineContent.match(options.foldingRules.markers.start);
    if (match) {
      const range = { startLineNumber: lineNumber, startColumn: match[0].length + 1, endLineNumber: lineNumber, endColumn: lineContent.length + 1 };
      if (range.endColumn > range.startColumn) {
        const sectionHeader = {
          range,
          ...getHeaderText(lineContent.substring(match[0].length)),
          shouldBeInComments: false
        };
        if (sectionHeader.text || sectionHeader.hasSeparatorLine) {
          regionHeaders.push(sectionHeader);
        }
      }
    }
  }
  return regionHeaders;
}
function collectMarkHeaders(model, options) {
  const markHeaders = [];
  const endLineNumber = model.getLineCount();
  if (!options.markSectionHeaderRegex || options.markSectionHeaderRegex.trim() === "") {
    return markHeaders;
  }
  const multiline = isMultilineRegexSource(options.markSectionHeaderRegex);
  const regex = new RegExp(options.markSectionHeaderRegex, `gdm${multiline ? "s" : ""}`);
  if (regExpLeadsToEndlessLoop(regex)) {
    return markHeaders;
  }
  for (let startLine = 1; startLine <= endLineNumber; startLine += CHUNK_SIZE - MAX_SECTION_LINES) {
    const endLine = Math.min(startLine + CHUNK_SIZE - 1, endLineNumber);
    const lines = [];
    for (let i = startLine; i <= endLine; i++) {
      lines.push(model.getLineContent(i));
    }
    const text = lines.join("\n");
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const precedingText = text.substring(0, match.index);
      const lineOffset = (precedingText.match(/\n/g) || []).length;
      const lineNumber = startLine + lineOffset;
      const matchLines = match[0].split("\n");
      const matchHeight = matchLines.length;
      const matchEndLine = lineNumber + matchHeight - 1;
      const lineStartIndex = precedingText.lastIndexOf("\n") + 1;
      const startColumn = match.index - lineStartIndex + 1;
      const lastMatchLine = matchLines[matchLines.length - 1];
      const endColumn = matchHeight === 1 ? startColumn + match[0].length : lastMatchLine.length + 1;
      const range = {
        startLineNumber: lineNumber,
        startColumn,
        endLineNumber: matchEndLine,
        endColumn
      };
      const text2 = (match.groups ?? {})["label"] ?? "";
      const hasSeparatorLine = ((match.groups ?? {})["separator"] ?? "") !== "";
      const sectionHeader = {
        range,
        text: text2,
        hasSeparatorLine,
        shouldBeInComments: true
      };
      if (sectionHeader.text || sectionHeader.hasSeparatorLine) {
        if (markHeaders.length === 0 || markHeaders[markHeaders.length - 1].range.endLineNumber < sectionHeader.range.startLineNumber) {
          markHeaders.push(sectionHeader);
        }
      }
      regex.lastIndex = match.index + match[0].length;
    }
  }
  return markHeaders;
}
function getHeaderText(text) {
  text = text.trim();
  const hasSeparatorLine = text.startsWith("-");
  text = text.replace(trimDashesRegex, "");
  return { text, hasSeparatorLine };
}

// node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel.js
var MirrorTextModel = class {
  constructor(uri, lines, eol, versionId) {
    this._uri = uri;
    this._lines = lines;
    this._eol = eol;
    this._versionId = versionId;
    this._lineStarts = null;
    this._cachedTextValue = null;
  }
  dispose() {
    this._lines.length = 0;
  }
  get version() {
    return this._versionId;
  }
  getText() {
    if (this._cachedTextValue === null) {
      this._cachedTextValue = this._lines.join(this._eol);
    }
    return this._cachedTextValue;
  }
  onEvents(e) {
    if (e.eol && e.eol !== this._eol) {
      this._eol = e.eol;
      this._lineStarts = null;
    }
    const changes = e.changes;
    for (const change of changes) {
      this._acceptDeleteRange(change.range);
      this._acceptInsertText(new Position(change.range.startLineNumber, change.range.startColumn), change.text);
    }
    this._versionId = e.versionId;
    this._cachedTextValue = null;
  }
  _ensureLineStarts() {
    if (!this._lineStarts) {
      const eolLength = this._eol.length;
      const linesLength = this._lines.length;
      const lineStartValues = new Uint32Array(linesLength);
      for (let i = 0; i < linesLength; i++) {
        lineStartValues[i] = this._lines[i].length + eolLength;
      }
      this._lineStarts = new PrefixSumComputer(lineStartValues);
    }
  }
  /**
   * All changes to a line's text go through this method
   */
  _setLineText(lineIndex, newValue) {
    this._lines[lineIndex] = newValue;
    if (this._lineStarts) {
      this._lineStarts.setValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
    }
  }
  _acceptDeleteRange(range) {
    if (range.startLineNumber === range.endLineNumber) {
      if (range.startColumn === range.endColumn) {
        return;
      }
      this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.startLineNumber - 1].substring(range.endColumn - 1));
      return;
    }
    this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.endLineNumber - 1].substring(range.endColumn - 1));
    this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
    if (this._lineStarts) {
      this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
    }
  }
  _acceptInsertText(position, insertText) {
    if (insertText.length === 0) {
      return;
    }
    const insertLines = splitLines(insertText);
    if (insertLines.length === 1) {
      this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0] + this._lines[position.lineNumber - 1].substring(position.column - 1));
      return;
    }
    insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);
    this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0]);
    const newLengths = new Uint32Array(insertLines.length - 1);
    for (let i = 1; i < insertLines.length; i++) {
      this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
      newLengths[i - 1] = insertLines[i].length + this._eol.length;
    }
    if (this._lineStarts) {
      this._lineStarts.insertValues(position.lineNumber, newLengths);
    }
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/services/textModelSync/textModelSync.impl.js
var STOP_SYNC_MODEL_DELTA_TIME_MS = 60 * 1e3;
var WorkerTextModelSyncClient = class extends Disposable {
  constructor(proxy, modelService, keepIdleModels = false) {
    super();
    this._syncedModels = /* @__PURE__ */ Object.create(null);
    this._syncedModelsLastUsedTime = /* @__PURE__ */ Object.create(null);
    this._proxy = proxy;
    this._modelService = modelService;
    if (!keepIdleModels) {
      const timer = new IntervalTimer();
      timer.cancelAndSet(() => this._checkStopModelSync(), Math.round(STOP_SYNC_MODEL_DELTA_TIME_MS / 2));
      this._register(timer);
    }
  }
  dispose() {
    for (const modelUrl in this._syncedModels) {
      dispose(this._syncedModels[modelUrl]);
    }
    this._syncedModels = /* @__PURE__ */ Object.create(null);
    this._syncedModelsLastUsedTime = /* @__PURE__ */ Object.create(null);
    super.dispose();
  }
  ensureSyncedResources(resources, forceLargeModels = false) {
    for (const resource of resources) {
      const resourceStr = resource.toString();
      if (!this._syncedModels[resourceStr]) {
        this._beginModelSync(resource, forceLargeModels);
      }
      if (this._syncedModels[resourceStr]) {
        this._syncedModelsLastUsedTime[resourceStr] = (/* @__PURE__ */ new Date()).getTime();
      }
    }
  }
  _checkStopModelSync() {
    const currentTime = (/* @__PURE__ */ new Date()).getTime();
    const toRemove = [];
    for (const modelUrl in this._syncedModelsLastUsedTime) {
      const elapsedTime = currentTime - this._syncedModelsLastUsedTime[modelUrl];
      if (elapsedTime > STOP_SYNC_MODEL_DELTA_TIME_MS) {
        toRemove.push(modelUrl);
      }
    }
    for (const e of toRemove) {
      this._stopModelSync(e);
    }
  }
  _beginModelSync(resource, forceLargeModels) {
    const model = this._modelService.getModel(resource);
    if (!model) {
      return;
    }
    if (!forceLargeModels && model.isTooLargeForSyncing()) {
      return;
    }
    const modelUrl = resource.toString();
    this._proxy.$acceptNewModel({
      url: model.uri.toString(),
      lines: model.getLinesContent(),
      EOL: model.getEOL(),
      versionId: model.getVersionId()
    });
    const toDispose = new DisposableStore();
    toDispose.add(model.onDidChangeContent((e) => {
      this._proxy.$acceptModelChanged(modelUrl.toString(), e);
    }));
    toDispose.add(model.onWillDispose(() => {
      this._stopModelSync(modelUrl);
    }));
    toDispose.add(toDisposable(() => {
      this._proxy.$acceptRemovedModel(modelUrl);
    }));
    this._syncedModels[modelUrl] = toDispose;
  }
  _stopModelSync(modelUrl) {
    const toDispose = this._syncedModels[modelUrl];
    delete this._syncedModels[modelUrl];
    delete this._syncedModelsLastUsedTime[modelUrl];
    dispose(toDispose);
  }
};
var WorkerTextModelSyncServer = class {
  constructor() {
    this._models = /* @__PURE__ */ Object.create(null);
  }
  getModel(uri) {
    return this._models[uri];
  }
  getModels() {
    const all = [];
    Object.keys(this._models).forEach((key) => all.push(this._models[key]));
    return all;
  }
  $acceptNewModel(data) {
    this._models[data.url] = new MirrorModel(URI.parse(data.url), data.lines, data.EOL, data.versionId);
  }
  $acceptModelChanged(uri, e) {
    if (!this._models[uri]) {
      return;
    }
    const model = this._models[uri];
    model.onEvents(e);
  }
  $acceptRemovedModel(uri) {
    if (!this._models[uri]) {
      return;
    }
    delete this._models[uri];
  }
};
var MirrorModel = class extends MirrorTextModel {
  get uri() {
    return this._uri;
  }
  get eol() {
    return this._eol;
  }
  getValue() {
    return this.getText();
  }
  findMatches(regex) {
    const matches = [];
    for (let i = 0; i < this._lines.length; i++) {
      const line = this._lines[i];
      const offsetToAdd = this.offsetAt(new Position(i + 1, 1));
      const iteratorOverMatches = line.matchAll(regex);
      for (const match of iteratorOverMatches) {
        if (match.index || match.index === 0) {
          match.index = match.index + offsetToAdd;
        }
        matches.push(match);
      }
    }
    return matches;
  }
  getLinesContent() {
    return this._lines.slice(0);
  }
  getLineCount() {
    return this._lines.length;
  }
  getLineContent(lineNumber) {
    return this._lines[lineNumber - 1];
  }
  getWordAtPosition(position, wordDefinition) {
    const wordAtText = getWordAtText(position.column, ensureValidWordDefinition(wordDefinition), this._lines[position.lineNumber - 1], 0);
    if (wordAtText) {
      return new Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
    }
    return null;
  }
  words(wordDefinition) {
    const lines = this._lines;
    const wordenize = this._wordenize.bind(this);
    let lineNumber = 0;
    let lineText = "";
    let wordRangesIdx = 0;
    let wordRanges = [];
    return {
      *[Symbol.iterator]() {
        while (true) {
          if (wordRangesIdx < wordRanges.length) {
            const value = lineText.substring(wordRanges[wordRangesIdx].start, wordRanges[wordRangesIdx].end);
            wordRangesIdx += 1;
            yield value;
          } else {
            if (lineNumber < lines.length) {
              lineText = lines[lineNumber];
              wordRanges = wordenize(lineText, wordDefinition);
              wordRangesIdx = 0;
              lineNumber += 1;
            } else {
              break;
            }
          }
        }
      }
    };
  }
  getLineWords(lineNumber, wordDefinition) {
    const content = this._lines[lineNumber - 1];
    const ranges = this._wordenize(content, wordDefinition);
    const words = [];
    for (const range of ranges) {
      words.push({
        word: content.substring(range.start, range.end),
        startColumn: range.start + 1,
        endColumn: range.end + 1
      });
    }
    return words;
  }
  _wordenize(content, wordDefinition) {
    const result = [];
    let match;
    wordDefinition.lastIndex = 0;
    while (match = wordDefinition.exec(content)) {
      if (match[0].length === 0) {
        break;
      }
      result.push({ start: match.index, end: match.index + match[0].length });
    }
    return result;
  }
  getValueInRange(range) {
    range = this._validateRange(range);
    if (range.startLineNumber === range.endLineNumber) {
      return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
    }
    const lineEnding = this._eol;
    const startLineIndex = range.startLineNumber - 1;
    const endLineIndex = range.endLineNumber - 1;
    const resultLines = [];
    resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
    for (let i = startLineIndex + 1; i < endLineIndex; i++) {
      resultLines.push(this._lines[i]);
    }
    resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
    return resultLines.join(lineEnding);
  }
  offsetAt(position) {
    position = this._validatePosition(position);
    this._ensureLineStarts();
    return this._lineStarts.getPrefixSum(position.lineNumber - 2) + (position.column - 1);
  }
  positionAt(offset) {
    offset = Math.floor(offset);
    offset = Math.max(0, offset);
    this._ensureLineStarts();
    const out = this._lineStarts.getIndexOf(offset);
    const lineLength = this._lines[out.index].length;
    return {
      lineNumber: 1 + out.index,
      column: 1 + Math.min(out.remainder, lineLength)
    };
  }
  _validateRange(range) {
    const start = this._validatePosition({ lineNumber: range.startLineNumber, column: range.startColumn });
    const end = this._validatePosition({ lineNumber: range.endLineNumber, column: range.endColumn });
    if (start.lineNumber !== range.startLineNumber || start.column !== range.startColumn || end.lineNumber !== range.endLineNumber || end.column !== range.endColumn) {
      return {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
      };
    }
    return range;
  }
  _validatePosition(position) {
    if (!Position.isIPosition(position)) {
      throw new Error("bad position");
    }
    let { lineNumber, column } = position;
    let hasChanged = false;
    if (lineNumber < 1) {
      lineNumber = 1;
      column = 1;
      hasChanged = true;
    } else if (lineNumber > this._lines.length) {
      lineNumber = this._lines.length;
      column = this._lines[lineNumber - 1].length + 1;
      hasChanged = true;
    } else {
      const maxCharacter = this._lines[lineNumber - 1].length + 1;
      if (column < 1) {
        column = 1;
        hasChanged = true;
      } else if (column > maxCharacter) {
        column = maxCharacter;
        hasChanged = true;
      }
    }
    if (!hasChanged) {
      return position;
    } else {
      return { lineNumber, column };
    }
  }
};

// node_modules/monaco-editor/esm/vs/editor/common/services/editorWebWorker.js
var _EditorWorker = class _EditorWorker {
  constructor(_foreignModule = null) {
    this._foreignModule = _foreignModule;
    this._requestHandlerBrand = void 0;
    this._workerTextModelSyncServer = new WorkerTextModelSyncServer();
  }
  dispose() {
  }
  async $ping() {
    return "pong";
  }
  _getModel(uri) {
    return this._workerTextModelSyncServer.getModel(uri);
  }
  getModels() {
    return this._workerTextModelSyncServer.getModels();
  }
  $acceptNewModel(data) {
    this._workerTextModelSyncServer.$acceptNewModel(data);
  }
  $acceptModelChanged(uri, e) {
    this._workerTextModelSyncServer.$acceptModelChanged(uri, e);
  }
  $acceptRemovedModel(uri) {
    this._workerTextModelSyncServer.$acceptRemovedModel(uri);
  }
  async $computeUnicodeHighlights(url, options, range) {
    const model = this._getModel(url);
    if (!model) {
      return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
    }
    return UnicodeTextModelHighlighter.computeUnicodeHighlights(model, options, range);
  }
  async $findSectionHeaders(url, options) {
    const model = this._getModel(url);
    if (!model) {
      return [];
    }
    return findSectionHeaders(model, options);
  }
  // ---- BEGIN diff --------------------------------------------------------------------------
  async $computeDiff(originalUrl, modifiedUrl, options, algorithm) {
    const original = this._getModel(originalUrl);
    const modified = this._getModel(modifiedUrl);
    if (!original || !modified) {
      return null;
    }
    const result = _EditorWorker.computeDiff(original, modified, options, algorithm);
    return result;
  }
  static computeDiff(originalTextModel, modifiedTextModel, options, algorithm) {
    const diffAlgorithm = algorithm === "advanced" ? linesDiffComputers.getDefault() : linesDiffComputers.getLegacy();
    const originalLines = originalTextModel.getLinesContent();
    const modifiedLines = modifiedTextModel.getLinesContent();
    const result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);
    const identical = result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel);
    function getLineChanges(changes) {
      return changes.map((m) => [m.original.startLineNumber, m.original.endLineNumberExclusive, m.modified.startLineNumber, m.modified.endLineNumberExclusive, m.innerChanges?.map((m2) => [
        m2.originalRange.startLineNumber,
        m2.originalRange.startColumn,
        m2.originalRange.endLineNumber,
        m2.originalRange.endColumn,
        m2.modifiedRange.startLineNumber,
        m2.modifiedRange.startColumn,
        m2.modifiedRange.endLineNumber,
        m2.modifiedRange.endColumn
      ])]);
    }
    return {
      identical,
      quitEarly: result.hitTimeout,
      changes: getLineChanges(result.changes),
      moves: result.moves.map((m) => [
        m.lineRangeMapping.original.startLineNumber,
        m.lineRangeMapping.original.endLineNumberExclusive,
        m.lineRangeMapping.modified.startLineNumber,
        m.lineRangeMapping.modified.endLineNumberExclusive,
        getLineChanges(m.changes)
      ])
    };
  }
  static _modelsAreIdentical(original, modified) {
    const originalLineCount = original.getLineCount();
    const modifiedLineCount = modified.getLineCount();
    if (originalLineCount !== modifiedLineCount) {
      return false;
    }
    for (let line = 1; line <= originalLineCount; line++) {
      const originalLine = original.getLineContent(line);
      const modifiedLine = modified.getLineContent(line);
      if (originalLine !== modifiedLine) {
        return false;
      }
    }
    return true;
  }
  async $computeMoreMinimalEdits(modelUrl, edits, pretty) {
    const model = this._getModel(modelUrl);
    if (!model) {
      return edits;
    }
    const result = [];
    let lastEol = void 0;
    edits = edits.slice(0).sort((a, b) => {
      if (a.range && b.range) {
        return Range.compareRangesUsingStarts(a.range, b.range);
      }
      const aRng = a.range ? 0 : 1;
      const bRng = b.range ? 0 : 1;
      return aRng - bRng;
    });
    let writeIndex = 0;
    for (let readIndex = 1; readIndex < edits.length; readIndex++) {
      if (Range.getEndPosition(edits[writeIndex].range).equals(Range.getStartPosition(edits[readIndex].range))) {
        edits[writeIndex].range = Range.fromPositions(Range.getStartPosition(edits[writeIndex].range), Range.getEndPosition(edits[readIndex].range));
        edits[writeIndex].text += edits[readIndex].text;
      } else {
        writeIndex++;
        edits[writeIndex] = edits[readIndex];
      }
    }
    edits.length = writeIndex + 1;
    for (let { range, text, eol } of edits) {
      if (typeof eol === "number") {
        lastEol = eol;
      }
      if (Range.isEmpty(range) && !text) {
        continue;
      }
      const original = model.getValueInRange(range);
      text = text.replace(/\r\n|\n|\r/g, model.eol);
      if (original === text) {
        continue;
      }
      if (Math.max(text.length, original.length) > _EditorWorker._diffLimit) {
        result.push({ range, text });
        continue;
      }
      const changes = stringDiff(original, text, pretty);
      const editOffset = model.offsetAt(Range.lift(range).getStartPosition());
      for (const change of changes) {
        const start = model.positionAt(editOffset + change.originalStart);
        const end = model.positionAt(editOffset + change.originalStart + change.originalLength);
        const newEdit = {
          text: text.substr(change.modifiedStart, change.modifiedLength),
          range: { startLineNumber: start.lineNumber, startColumn: start.column, endLineNumber: end.lineNumber, endColumn: end.column }
        };
        if (model.getValueInRange(newEdit.range) !== newEdit.text) {
          result.push(newEdit);
        }
      }
    }
    if (typeof lastEol === "number") {
      result.push({ eol: lastEol, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } });
    }
    return result;
  }
  // ---- END minimal edits ---------------------------------------------------------------
  async $computeLinks(modelUrl) {
    const model = this._getModel(modelUrl);
    if (!model) {
      return null;
    }
    return computeLinks(model);
  }
  // --- BEGIN default document colors -----------------------------------------------------------
  async $computeDefaultDocumentColors(modelUrl) {
    const model = this._getModel(modelUrl);
    if (!model) {
      return null;
    }
    return computeDefaultDocumentColors(model);
  }
  async $textualSuggest(modelUrls, leadingWord, wordDef, wordDefFlags) {
    const sw = new StopWatch();
    const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
    const seen = /* @__PURE__ */ new Set();
    outer: for (const url of modelUrls) {
      const model = this._getModel(url);
      if (!model) {
        continue;
      }
      for (const word of model.words(wordDefRegExp)) {
        if (word === leadingWord || !isNaN(Number(word))) {
          continue;
        }
        seen.add(word);
        if (seen.size > _EditorWorker._suggestionsLimit) {
          break outer;
        }
      }
    }
    return { words: Array.from(seen), duration: sw.elapsed() };
  }
  // ---- END suggest --------------------------------------------------------------------------
  //#region -- word ranges --
  async $computeWordRanges(modelUrl, range, wordDef, wordDefFlags) {
    const model = this._getModel(modelUrl);
    if (!model) {
      return /* @__PURE__ */ Object.create(null);
    }
    const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
    const result = /* @__PURE__ */ Object.create(null);
    for (let line = range.startLineNumber; line < range.endLineNumber; line++) {
      const words = model.getLineWords(line, wordDefRegExp);
      for (const word of words) {
        if (!isNaN(Number(word.word))) {
          continue;
        }
        let array = result[word.word];
        if (!array) {
          array = [];
          result[word.word] = array;
        }
        array.push({
          startLineNumber: line,
          startColumn: word.startColumn,
          endLineNumber: line,
          endColumn: word.endColumn
        });
      }
    }
    return result;
  }
  //#endregion
  async $navigateValueSet(modelUrl, range, up, wordDef, wordDefFlags) {
    const model = this._getModel(modelUrl);
    if (!model) {
      return null;
    }
    const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
    if (range.startColumn === range.endColumn) {
      range = {
        startLineNumber: range.startLineNumber,
        startColumn: range.startColumn,
        endLineNumber: range.endLineNumber,
        endColumn: range.endColumn + 1
      };
    }
    const selectionText = model.getValueInRange(range);
    const wordRange = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn }, wordDefRegExp);
    if (!wordRange) {
      return null;
    }
    const word = model.getValueInRange(wordRange);
    const result = BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);
    return result;
  }
  // ---- BEGIN foreign module support --------------------------------------------------------------------------
  // foreign method request
  $fmr(method, args) {
    if (!this._foreignModule || typeof this._foreignModule[method] !== "function") {
      return Promise.reject(new Error("Missing requestHandler or method: " + method));
    }
    try {
      return Promise.resolve(this._foreignModule[method].apply(this._foreignModule, args));
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
_EditorWorker._diffLimit = 1e5;
_EditorWorker._suggestionsLimit = 1e4;
var EditorWorker = _EditorWorker;
if (typeof importScripts === "function") {
  globalThis.monaco = createMonacoBaseAPI();
}

// node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerHost.js
var _EditorWorkerHost = class _EditorWorkerHost {
  static getChannel(workerServer) {
    return workerServer.getChannel(_EditorWorkerHost.CHANNEL_NAME);
  }
  static setChannel(workerClient, obj) {
    workerClient.setChannel(_EditorWorkerHost.CHANNEL_NAME, obj);
  }
};
_EditorWorkerHost.CHANNEL_NAME = "editorWorkerHost";
var EditorWorkerHost = _EditorWorkerHost;

// node_modules/monaco-editor/esm/vs/base/common/worker/webWorker.js
var DEFAULT_CHANNEL = "default";
var INITIALIZE = "$initialize";
var webWorkerWarningLogged = false;
function logOnceWebWorkerWarning(err) {
  if (!isWeb) {
    return;
  }
  if (!webWorkerWarningLogged) {
    webWorkerWarningLogged = true;
    console.warn("Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq");
  }
  console.warn(err.message);
}
var RequestMessage = class {
  constructor(vsWorker, req, channel, method, args) {
    this.vsWorker = vsWorker;
    this.req = req;
    this.channel = channel;
    this.method = method;
    this.args = args;
    this.type = 0;
  }
};
var ReplyMessage = class {
  constructor(vsWorker, seq, res, err) {
    this.vsWorker = vsWorker;
    this.seq = seq;
    this.res = res;
    this.err = err;
    this.type = 1;
  }
};
var SubscribeEventMessage = class {
  constructor(vsWorker, req, channel, eventName, arg) {
    this.vsWorker = vsWorker;
    this.req = req;
    this.channel = channel;
    this.eventName = eventName;
    this.arg = arg;
    this.type = 2;
  }
};
var EventMessage = class {
  constructor(vsWorker, req, event) {
    this.vsWorker = vsWorker;
    this.req = req;
    this.event = event;
    this.type = 3;
  }
};
var UnsubscribeEventMessage = class {
  constructor(vsWorker, req) {
    this.vsWorker = vsWorker;
    this.req = req;
    this.type = 4;
  }
};
var WebWorkerProtocol = class {
  constructor(handler) {
    this._workerId = -1;
    this._handler = handler;
    this._lastSentReq = 0;
    this._pendingReplies = /* @__PURE__ */ Object.create(null);
    this._pendingEmitters = /* @__PURE__ */ new Map();
    this._pendingEvents = /* @__PURE__ */ new Map();
  }
  setWorkerId(workerId) {
    this._workerId = workerId;
  }
  async sendMessage(channel, method, args) {
    const req = String(++this._lastSentReq);
    return new Promise((resolve, reject) => {
      this._pendingReplies[req] = {
        resolve,
        reject
      };
      this._send(new RequestMessage(this._workerId, req, channel, method, args));
    });
  }
  listen(channel, eventName, arg) {
    let req = null;
    const emitter = new Emitter({
      onWillAddFirstListener: () => {
        req = String(++this._lastSentReq);
        this._pendingEmitters.set(req, emitter);
        this._send(new SubscribeEventMessage(this._workerId, req, channel, eventName, arg));
      },
      onDidRemoveLastListener: () => {
        this._pendingEmitters.delete(req);
        this._send(new UnsubscribeEventMessage(this._workerId, req));
        req = null;
      }
    });
    return emitter.event;
  }
  handleMessage(message) {
    if (!message || !message.vsWorker) {
      return;
    }
    if (this._workerId !== -1 && message.vsWorker !== this._workerId) {
      return;
    }
    this._handleMessage(message);
  }
  createProxyToRemoteChannel(channel, sendMessageBarrier) {
    const handler = {
      get: (target, name) => {
        if (typeof name === "string" && !target[name]) {
          if (propertyIsDynamicEvent(name)) {
            target[name] = (arg) => {
              return this.listen(channel, name, arg);
            };
          } else if (propertyIsEvent(name)) {
            target[name] = this.listen(channel, name, void 0);
          } else if (name.charCodeAt(0) === 36) {
            target[name] = async (...myArgs) => {
              await sendMessageBarrier?.();
              return this.sendMessage(channel, name, myArgs);
            };
          }
        }
        return target[name];
      }
    };
    return new Proxy(/* @__PURE__ */ Object.create(null), handler);
  }
  _handleMessage(msg) {
    switch (msg.type) {
      case 1:
        return this._handleReplyMessage(msg);
      case 0:
        return this._handleRequestMessage(msg);
      case 2:
        return this._handleSubscribeEventMessage(msg);
      case 3:
        return this._handleEventMessage(msg);
      case 4:
        return this._handleUnsubscribeEventMessage(msg);
    }
  }
  _handleReplyMessage(replyMessage) {
    if (!this._pendingReplies[replyMessage.seq]) {
      console.warn("Got reply to unknown seq");
      return;
    }
    const reply = this._pendingReplies[replyMessage.seq];
    delete this._pendingReplies[replyMessage.seq];
    if (replyMessage.err) {
      let err = replyMessage.err;
      if (replyMessage.err.$isError) {
        const newErr = new Error();
        newErr.name = replyMessage.err.name;
        newErr.message = replyMessage.err.message;
        newErr.stack = replyMessage.err.stack;
        err = newErr;
      }
      reply.reject(err);
      return;
    }
    reply.resolve(replyMessage.res);
  }
  _handleRequestMessage(requestMessage) {
    const req = requestMessage.req;
    const result = this._handler.handleMessage(requestMessage.channel, requestMessage.method, requestMessage.args);
    result.then((r) => {
      this._send(new ReplyMessage(this._workerId, req, r, void 0));
    }, (e) => {
      if (e.detail instanceof Error) {
        e.detail = transformErrorForSerialization(e.detail);
      }
      this._send(new ReplyMessage(this._workerId, req, void 0, transformErrorForSerialization(e)));
    });
  }
  _handleSubscribeEventMessage(msg) {
    const req = msg.req;
    const disposable = this._handler.handleEvent(msg.channel, msg.eventName, msg.arg)((event) => {
      this._send(new EventMessage(this._workerId, req, event));
    });
    this._pendingEvents.set(req, disposable);
  }
  _handleEventMessage(msg) {
    if (!this._pendingEmitters.has(msg.req)) {
      console.warn("Got event for unknown req");
      return;
    }
    this._pendingEmitters.get(msg.req).fire(msg.event);
  }
  _handleUnsubscribeEventMessage(msg) {
    if (!this._pendingEvents.has(msg.req)) {
      console.warn("Got unsubscribe for unknown req");
      return;
    }
    this._pendingEvents.get(msg.req).dispose();
    this._pendingEvents.delete(msg.req);
  }
  _send(msg) {
    const transfer = [];
    if (msg.type === 0) {
      for (let i = 0; i < msg.args.length; i++) {
        const arg = msg.args[i];
        if (arg instanceof ArrayBuffer) {
          transfer.push(arg);
        }
      }
    } else if (msg.type === 1) {
      if (msg.res instanceof ArrayBuffer) {
        transfer.push(msg.res);
      }
    }
    this._handler.sendMessage(msg, transfer);
  }
};
var WebWorkerClient = class extends Disposable {
  constructor(worker) {
    super();
    this._localChannels = /* @__PURE__ */ new Map();
    this._worker = this._register(worker);
    this._register(this._worker.onMessage((msg) => {
      this._protocol.handleMessage(msg);
    }));
    this._register(this._worker.onError((err) => {
      logOnceWebWorkerWarning(err);
      onUnexpectedError(err);
    }));
    this._protocol = new WebWorkerProtocol({
      sendMessage: (msg, transfer) => {
        this._worker.postMessage(msg, transfer);
      },
      handleMessage: (channel, method, args) => {
        return this._handleMessage(channel, method, args);
      },
      handleEvent: (channel, eventName, arg) => {
        return this._handleEvent(channel, eventName, arg);
      }
    });
    this._protocol.setWorkerId(this._worker.getId());
    this._onModuleLoaded = this._protocol.sendMessage(DEFAULT_CHANNEL, INITIALIZE, [
      this._worker.getId()
    ]).then(() => {
    });
    this.proxy = this._protocol.createProxyToRemoteChannel(DEFAULT_CHANNEL, async () => {
      await this._onModuleLoaded;
    });
    this._onModuleLoaded.catch((e) => {
      this._onError("Worker failed to load ", e);
    });
  }
  _handleMessage(channelName, method, args) {
    const channel = this._localChannels.get(channelName);
    if (!channel) {
      return Promise.reject(new Error(`Missing channel ${channelName} on main thread`));
    }
    const fn = channel[method];
    if (typeof fn !== "function") {
      return Promise.reject(new Error(`Missing method ${method} on main thread channel ${channelName}`));
    }
    try {
      return Promise.resolve(fn.apply(channel, args));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  _handleEvent(channelName, eventName, arg) {
    const channel = this._localChannels.get(channelName);
    if (!channel) {
      throw new Error(`Missing channel ${channelName} on main thread`);
    }
    if (propertyIsDynamicEvent(eventName)) {
      const fn = channel[eventName];
      if (typeof fn !== "function") {
        throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
      }
      const event = fn.call(channel, arg);
      if (typeof event !== "function") {
        throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
      }
      return event;
    }
    if (propertyIsEvent(eventName)) {
      const event = channel[eventName];
      if (typeof event !== "function") {
        throw new Error(`Missing event ${eventName} on main thread channel ${channelName}.`);
      }
      return event;
    }
    throw new Error(`Malformed event name ${eventName}`);
  }
  setChannel(channel, handler) {
    this._localChannels.set(channel, handler);
  }
  _onError(message, error) {
    console.error(message);
    console.info(error);
  }
};
function propertyIsEvent(name) {
  return name[0] === "o" && name[1] === "n" && isUpperAsciiLetter(name.charCodeAt(2));
}
function propertyIsDynamicEvent(name) {
  return /^onDynamic/.test(name) && isUpperAsciiLetter(name.charCodeAt(9));
}
var WebWorkerServer = class {
  constructor(postMessage, requestHandlerFactory) {
    this._localChannels = /* @__PURE__ */ new Map();
    this._remoteChannels = /* @__PURE__ */ new Map();
    this._protocol = new WebWorkerProtocol({
      sendMessage: (msg, transfer) => {
        postMessage(msg, transfer);
      },
      handleMessage: (channel, method, args) => this._handleMessage(channel, method, args),
      handleEvent: (channel, eventName, arg) => this._handleEvent(channel, eventName, arg)
    });
    this.requestHandler = requestHandlerFactory(this);
  }
  onmessage(msg) {
    this._protocol.handleMessage(msg);
  }
  _handleMessage(channel, method, args) {
    if (channel === DEFAULT_CHANNEL && method === INITIALIZE) {
      return this.initialize(args[0]);
    }
    const requestHandler = channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel);
    if (!requestHandler) {
      return Promise.reject(new Error(`Missing channel ${channel} on worker thread`));
    }
    const fn = requestHandler[method];
    if (typeof fn !== "function") {
      return Promise.reject(new Error(`Missing method ${method} on worker thread channel ${channel}`));
    }
    try {
      return Promise.resolve(fn.apply(requestHandler, args));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  _handleEvent(channel, eventName, arg) {
    const requestHandler = channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel);
    if (!requestHandler) {
      throw new Error(`Missing channel ${channel} on worker thread`);
    }
    if (propertyIsDynamicEvent(eventName)) {
      const fn = requestHandler[eventName];
      if (typeof fn !== "function") {
        throw new Error(`Missing dynamic event ${eventName} on request handler.`);
      }
      const event = fn.call(requestHandler, arg);
      if (typeof event !== "function") {
        throw new Error(`Missing dynamic event ${eventName} on request handler.`);
      }
      return event;
    }
    if (propertyIsEvent(eventName)) {
      const event = requestHandler[eventName];
      if (typeof event !== "function") {
        throw new Error(`Missing event ${eventName} on request handler.`);
      }
      return event;
    }
    throw new Error(`Malformed event name ${eventName}`);
  }
  getChannel(channel) {
    if (!this._remoteChannels.has(channel)) {
      const inst = this._protocol.createProxyToRemoteChannel(channel);
      this._remoteChannels.set(channel, inst);
    }
    return this._remoteChannels.get(channel);
  }
  async initialize(workerId) {
    this._protocol.setWorkerId(workerId);
  }
};

export {
  AccessibilitySupport,
  CodeActionTriggerType,
  CompletionItemInsertTextRule,
  CompletionItemKind,
  CompletionItemTag,
  CompletionTriggerKind,
  ContentWidgetPositionPreference,
  CursorChangeReason,
  DefaultEndOfLine,
  DocumentHighlightKind,
  EditorAutoIndentStrategy,
  EditorOption,
  EndOfLinePreference,
  EndOfLineSequence,
  GlyphMarginLane,
  HoverVerbosityAction,
  IndentAction,
  InjectedTextCursorStops,
  InlayHintKind,
  InlineCompletionEndOfLifeReasonKind,
  InlineCompletionHintStyle,
  InlineCompletionTriggerKind,
  MinimapPosition,
  MinimapSectionHeaderStyle,
  MouseTargetType,
  NewSymbolNameTag,
  NewSymbolNameTriggerKind,
  OverlayWidgetPositionPreference,
  OverviewRulerLane,
  PartialAcceptTriggerKind,
  PositionAffinity,
  RenderLineNumbersType,
  RenderMinimap,
  ScrollType,
  ScrollbarVisibility,
  ShowLightbulbIconMode,
  SignatureHelpTriggerKind,
  SymbolKind,
  SymbolTag,
  TextDirection,
  TextEditorCursorBlinkingStyle,
  TextEditorCursorStyle,
  TrackedRangeStickiness,
  WrappingIndent,
  createMonacoBaseAPI,
  logOnceWebWorkerWarning,
  WebWorkerClient,
  WebWorkerServer,
  LcsDiff,
  MovedText,
  LineRangeMapping,
  DetailedLineRangeMapping,
  RangeMapping,
  WorkerTextModelSyncClient,
  EditorWorker,
  EditorWorkerHost
};
