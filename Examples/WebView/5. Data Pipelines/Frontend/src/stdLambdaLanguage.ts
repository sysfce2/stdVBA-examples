let isRegistered = false;

export function ensureStdLambdaLanguage(monaco: any) {
  if (isRegistered) return;
  isRegistered = true;

  monaco.languages.register({ id: "stdLambda" });

  monaco.languages.setMonarchTokensProvider("stdLambda", {
    tokenizer: {
      root: [
        [/^\s*=/, "keyword"],
        [/\$\d+/, "variable"],
        [/\.\$/, "access.property"],
        [/\.\#/, "access.method"],
        [/\./, "delimiter"],
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
      { token: "access.property", foreground: "7DD3FC" },
      { token: "access.method", foreground: "38BDF8" },
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
