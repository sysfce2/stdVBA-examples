import { ensureStdLambdaLanguage } from "./stdLambdaLanguage";
import { stdEnumeratorMembers } from "./lambdaCatalog";
import "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js";
import "monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2.js";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/browser/wordOperations.js";
import "monaco-editor/esm/vs/editor/contrib/wordPartOperations/browser/wordPartOperations.js";

type MonacoModule = typeof import("monaco-editor/esm/vs/editor/editor.api.js");
type MonacoRange = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};
export type JoinBinding = { alias: string; returnOne: boolean; rightFields: string[] };
export type LambdaCompletionContext = { rowFields: string[]; joins: JoinBinding[] };

let monacoPromise: Promise<MonacoModule> | null = null;
let completionRegistered = false;
let hoverRegistered = false;
let resolveCompletionContext: () => LambdaCompletionContext = () => ({ rowFields: [], joins: [] });

const editors: Array<{ editor: any; subscriptions: any[] }> = [];

function triggerSuggest(editor: any) {
  const action = editor?.getAction?.("editor.action.triggerSuggest");
  if (!action || typeof action.run !== "function") return;
  void action.run().catch((err: any) => {
    console.warn("stdLambda suggest trigger failed:", err);
  });
}

function uniqueFieldNames(fields: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const field of fields) {
    const name = String(field || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}

/** Field names valid for `$1.Name` dot access in stdLambda expressions. */
function isDotAccessibleFieldName(name: string) {
  return /^[A-Za-z_$][\w$]*$/.test(name);
}

/** Insert text after `.` — uses `item("…")` when dot notation is invalid (e.g. spaces). */
function formatFieldCompletionInsert(name: string) {
  if (isDotAccessibleFieldName(name)) return name;
  const escaped = name.replace(/"/g, '""');
  return `item("${escaped}")`;
}

function getJoinByAlias(joins: JoinBinding[], alias: string) {
  const lower = alias.toLowerCase();
  for (let i = joins.length - 1; i >= 0; i -= 1) {
    if (String(joins[i].alias || "").toLowerCase() === lower) return joins[i];
  }
  return null;
}

function getLinePrefix(model: any, position: any) {
  return model.getLineContent(position.lineNumber).slice(0, Math.max(0, position.column - 1));
}

function parseAccessExpression(prefix: string) {
  const match = prefix.match(/\$\d+[\w$.]*$/);
  if (!match) return null;
  const token = match[0];
  if (!token.includes(".")) return null;
  if (token.includes("..")) return null;

  const hasTrailingDot = token.endsWith(".");
  const parts = token.split(".");
  const root = parts.shift() || "";
  if (!/^\$\d+$/.test(root)) return null;

  if (hasTrailingDot) parts.pop();
  const typed = hasTrailingDot ? "" : (parts.pop() || "");
  const segments = parts.filter(Boolean);

  if (!/^[A-Za-z_$][\w$]*$/.test(typed) && typed.length > 0) return null;
  return { root, segments, typed };
}

function createReplaceRange(position: any, typed: string): MonacoRange {
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: Math.max(1, position.column - typed.length),
    endColumn: position.column
  };
}

function makeFieldSuggestion(monaco: MonacoModule, fieldName: string, detail: string, range: MonacoRange) {
  const insertText = formatFieldCompletionInsert(fieldName);
  return {
    label: fieldName,
    kind: monaco.languages.CompletionItemKind.Field,
    insertText,
    detail: insertText === fieldName ? detail : `${detail} (via item())`,
    range
  };
}

function makeMethodSuggestion(monaco: MonacoModule, label: string, detail: string, range: MonacoRange) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Method,
    insertText: label,
    detail,
    range
  };
}

function resolveSuggestions(monaco: MonacoModule, position: any, prefix: string) {
  const parsed = parseAccessExpression(prefix);
  const context = resolveCompletionContext();
  const rowFields = uniqueFieldNames(context.rowFields);
  const joins = context.joins || [];

  if (!parsed) {
    return {
      suggestions: [
        {
          label: "$1.FieldName",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "$1.FieldName"
        },
        {
          label: "$1.join.Alias.FieldName",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "$1.join.Alias.FieldName"
        }
      ]
    };
  }

  const { typed, segments } = parsed;
  const range = createReplaceRange(position, typed);

  const matchPrefix = (name: string) => name.toLowerCase().startsWith(typed.toLowerCase());
  const suggestions: any[] = [];

  const pushFieldSuggestions = (fields: string[], detail: string) => {
    for (const field of uniqueFieldNames(fields)) {
      if (matchPrefix(field)) suggestions.push(makeFieldSuggestion(monaco, field, detail, range));
    }
  };

  const pushEnumeratorSuggestions = () => {
    for (const member of stdEnumeratorMembers) {
      if (!matchPrefix(member.name)) continue;
      if (member.kind === "property") suggestions.push(makeFieldSuggestion(monaco, member.name, member.detail, range));
      else suggestions.push(makeMethodSuggestion(monaco, member.name, member.detail, range));
    }
  };

  if (segments.length === 0) {
    pushFieldSuggestions(rowFields, "Row column");
  } else if (segments[0].toLowerCase() === "join") {
    if (segments.length === 1) {
      pushFieldSuggestions(joins.map((join) => join.alias), "Join alias (nested)");
    } else if (segments.length === 2) {
      const join = getJoinByAlias(joins, segments[1]);
      if (join) {
        if (join.returnOne) pushFieldSuggestions(join.rightFields, "Right table column");
        else pushEnumeratorSuggestions();
      }
    }
  } else if (segments.length === 1) {
    const join = getJoinByAlias(joins, segments[0]);
    if (join) {
      if (join.returnOne) pushFieldSuggestions(join.rightFields, "Right table column");
      else pushEnumeratorSuggestions();
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      label: "$1.FieldName",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "$1.FieldName",
      range
    });
  }

  return { suggestions };
}

function registerCompletionProvider(monaco: MonacoModule) {
  if (completionRegistered) return;
  completionRegistered = true;

  monaco.languages.registerCompletionItemProvider("stdLambda", {
    triggerCharacters: [".", "$", "("],
    provideCompletionItems(model, position) {
      return resolveSuggestions(monaco, position, getLinePrefix(model, position));
    }
  });
}

function registerHoverProvider(monaco: MonacoModule) {
  if (hoverRegistered) return;
  hoverRegistered = true;

  monaco.languages.registerHoverProvider("stdLambda", {
    provideHover(model, position) {
      const prefix = getLinePrefix(model, position);
      const parsed = parseAccessExpression(prefix);
      if (!parsed) return null;

      const joins = resolveCompletionContext().joins || [];
      const { segments } = parsed;

      if (segments.length === 1) {
        const join = getJoinByAlias(joins, segments[0]);
        if (!join) return null;
        return {
          contents: [{ value: `Join alias \`${join.alias}\` (${join.returnOne ? "right row" : "stdEnumerator rows"})` }]
        };
      }

      if (segments.length === 2 && segments[0].toLowerCase() === "join") {
        const join = getJoinByAlias(joins, segments[1]);
        if (!join) return null;
        return {
          contents: [{ value: `Join alias \`${join.alias}\` via \`join\` (${join.returnOne ? "right row" : "stdEnumerator rows"})` }]
        };
      }

      if (segments.length >= 2) {
        const direct = getJoinByAlias(joins, segments[0]);
        if (direct) {
          return {
            contents: [{ value: direct.returnOne ? "Right table field" : "stdEnumerator member" }]
          };
        }
      }

      if (segments.length >= 3 && segments[0].toLowerCase() === "join") {
        const nested = getJoinByAlias(joins, segments[1]);
        if (nested) {
          return {
            contents: [{ value: nested.returnOne ? "Right table field" : "stdEnumerator member" }]
          };
        }
      }

      return null;
    }
  });
}

async function getMonaco(getContext: () => LambdaCompletionContext) {
  resolveCompletionContext = getContext;

  if (!monacoPromise) {
    monacoPromise = import("monaco-editor/esm/vs/editor/editor.api.js").then((monaco) => {
      (globalThis as any).MonacoEnvironment = {
        getWorker() {
          return new Worker(new URL("./editor.worker.js", import.meta.url), { type: "module" });
        }
      };
      ensureStdLambdaLanguage(monaco);
      return monaco;
    });
  }

  const monaco = await monacoPromise;
  registerCompletionProvider(monaco);
  registerHoverProvider(monaco);
  return monaco;
}

export async function createLambdaEditor(
  container: HTMLElement,
  value: string,
  onChange: (next: string) => void,
  getContext: () => LambdaCompletionContext,
  options?: { multiline?: boolean }
) {
  const multiline = !!options?.multiline;
  const host = document.createElement("div");
  host.className = "cfg-lambda-editor";
  if (multiline) host.style.height = "170px";
  container.appendChild(host);

  const monaco = await getMonaco(getContext);
  const editor = monaco.editor.create(host, {
    value: value || "",
    language: "stdLambda",
    theme: "stdLambda-dark",
    minimap: { enabled: false },
    lineNumbers: multiline ? "on" : "off",
    wordWrap: "on",
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    fixedOverflowWidgets: false,
    suggestFontSize: 12,
    suggestLineHeight: 20,
    suggest: {
      showIcons: true,
      showInlineDetails: false,
      showStatusBar: false,
      preview: false
    },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: 13,
    padding: { top: 6, bottom: 6 }
  });

  const subscription = editor.onDidChangeModelContent(() => {
    onChange(editor.getValue());
  });

  const suggestTriggerSubscription = editor.onDidType((text: string) => {
    if (!text || (!text.includes(".") && !text.includes("$"))) return;
    triggerSuggest(editor);
  });
  const suggestOnFieldCharsSubscription = editor.onDidChangeModelContent(() => {
    const position = editor.getPosition();
    if (!position) return;
    const model = editor.getModel();
    if (!model) return;
    const prefix = getLinePrefix(model, position);
    if (parseAccessExpression(prefix)) {
      triggerSuggest(editor);
    }
  });

  editors.push({ editor, subscriptions: [subscription, suggestTriggerSubscription, suggestOnFieldCharsSubscription] });
}

export function disposeLambdaEditors() {
  while (editors.length > 0) {
    const item = editors.pop();
    for (const subscription of item?.subscriptions ?? []) {
      subscription?.dispose?.();
    }
    item?.editor?.dispose?.();
  }
}
