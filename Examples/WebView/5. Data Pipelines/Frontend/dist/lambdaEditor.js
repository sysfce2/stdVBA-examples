import "./chunk.js";

// src/stdLambdaLanguage.ts
var isRegistered = false;
function ensureStdLambdaLanguage(monaco) {
  if (isRegistered) return;
  isRegistered = true;
  monaco.languages.register({ id: "stdLambda" });
  monaco.languages.setMonarchTokensProvider("stdLambda", {
    tokenizer: {
      root: [
        [/^\s*=/, "keyword"],
        [/\$\d+/, "variable"],
        [/!/, "delimiter"],
        [/\b(true|false|null)\b/i, "keyword"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/>=|<=|<>|=|>|<|&|\+|-|\*|\//, "operator"],
        [/"/, "string.quote", "@doubleString"],
        [/'/, "string.quote", "@singleString"],
        [/[A-Za-z_$][\w$]*/, "identifier"],
        [/\s+/, "white"]
      ],
      doubleString: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string.quote", "@pop"]
      ],
      singleString: [
        [/[^\\']+/, "string"],
        [/\\./, "string.escape"],
        [/'/, "string.quote", "@pop"]
      ]
    }
  });
  monaco.editor.defineTheme("stdLambda-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "variable", foreground: "93C5FD" },
      { token: "delimiter", foreground: "60A5FA" },
      { token: "identifier", foreground: "E2E8F0" },
      { token: "operator", foreground: "60A5FA" },
      { token: "keyword", foreground: "22D3EE" },
      { token: "number", foreground: "FBBF24" },
      { token: "string", foreground: "86EFAC" }
    ],
    colors: {
      "editor.background": "#080D1A",
      "editor.foreground": "#E2E8F0",
      "editorLineNumber.foreground": "#334155",
      "editorLineNumber.activeForeground": "#64748B",
      "editorCursor.foreground": "#93C5FD",
      "editor.selectionBackground": "#1E3A8A55",
      "editor.inactiveSelectionBackground": "#1E3A8A33"
    }
  });
}

// src/lambdaEditor.ts
var monacoPromise = null;
var completionRegistered = false;
var resolveCompletionFields = () => [];
var editors = [];
function uniqueFieldNames(fields) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const field of fields) {
    const name = String(field || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
function registerCompletionProvider(monaco) {
  if (completionRegistered) return;
  completionRegistered = true;
  monaco.languages.registerCompletionItemProvider("stdLambda", {
    triggerCharacters: ["!", "$", "{"],
    provideCompletionItems(model, position) {
      const line = model.getLineContent(position.lineNumber);
      const prefix = line.slice(0, Math.max(0, position.column - 1));
      const plainMatch = prefix.match(/\$(\d+)!([\w$]*!)*([\w$]*)$/);
      const braceMatch = prefix.match(/\$(\d+)!([\w$]*!)*\{([\w$]*)$/);
      if (!plainMatch && !braceMatch) {
        return {
          suggestions: [
            {
              label: "$1!FieldName",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "$1!FieldName",
              detail: "Row field reference"
            },
            {
              label: "$1!{FieldName}",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "$1!{FieldName}",
              detail: "Braced row field reference"
            }
          ]
        };
      }
      const usesBraces = Boolean(braceMatch);
      const typed = braceMatch?.[3] ?? plainMatch?.[3] ?? "";
      const fields = uniqueFieldNames(resolveCompletionFields());
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: Math.max(1, position.column - typed.length),
        endColumn: position.column
      };
      const suggestions = fields.filter((field) => field.toLowerCase().startsWith(typed.toLowerCase())).map((field) => ({
        label: field,
        kind: monaco.languages.CompletionItemKind.Field,
        detail: usesBraces ? "$1!{FieldName}" : "$1!FieldName",
        insertText: usesBraces ? `${field}}` : field,
        range
      }));
      if (suggestions.length === 0) {
        suggestions.push({
          label: usesBraces ? "$1!{FieldName}" : "$1!FieldName",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: usesBraces ? "$1!{FieldName}" : "$1!FieldName",
          detail: "Row field reference",
          range
        });
      }
      return { suggestions };
    }
  });
}
async function getMonaco(getFields) {
  resolveCompletionFields = getFields;
  if (!monacoPromise) {
    monacoPromise = import("./editor.api.js").then((monaco2) => {
      globalThis.MonacoEnvironment = {
        getWorker() {
          return new Worker(new URL("./editor.worker.js", import.meta.url), { type: "module" });
        }
      };
      ensureStdLambdaLanguage(monaco2);
      return monaco2;
    });
  }
  const monaco = await monacoPromise;
  registerCompletionProvider(monaco);
  return monaco;
}
async function createLambdaEditor(container, value, onChange, getFields) {
  const host = document.createElement("div");
  host.className = "cfg-lambda-editor";
  container.appendChild(host);
  const monaco = await getMonaco(getFields);
  const editor = monaco.editor.create(host, {
    value: value || "",
    language: "stdLambda",
    theme: "stdLambda-dark",
    minimap: { enabled: false },
    lineNumbers: "off",
    wordWrap: "on",
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    fixedOverflowWidgets: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: 13,
    padding: { top: 6, bottom: 6 }
  });
  const subscription = editor.onDidChangeModelContent(() => {
    onChange(editor.getValue());
  });
  const suggestTriggerSubscription = editor.onDidType((text) => {
    if (!text || !text.includes("!") && !text.includes("{")) return;
    editor.trigger("stdLambda", "editor.action.triggerSuggest", {});
  });
  const suggestOnFieldCharsSubscription = editor.onDidChangeModelContent(() => {
    const position = editor.getPosition();
    if (!position) return;
    const model = editor.getModel();
    if (!model) return;
    const prefix = model.getLineContent(position.lineNumber).slice(0, Math.max(0, position.column - 1));
    if (/\$(\d+)!([\w$]*!)*([\w$]*)$/.test(prefix) || /\$(\d+)!([\w$]*!)*\{([\w$]*)$/.test(prefix)) {
      editor.trigger("stdLambda", "editor.action.triggerSuggest", {});
    }
  });
  editors.push({ editor, subscriptions: [subscription, suggestTriggerSubscription, suggestOnFieldCharsSubscription] });
}
function disposeLambdaEditors() {
  while (editors.length > 0) {
    const item = editors.pop();
    for (const subscription of item?.subscriptions ?? []) {
      subscription?.dispose?.();
    }
    item?.editor?.dispose?.();
  }
}
export {
  createLambdaEditor,
  disposeLambdaEditors
};
