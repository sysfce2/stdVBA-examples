import {
  $,
  ActionBar,
  CodeEditorWidget,
  CommandsRegistry,
  ContextKeyExpr,
  DataUri,
  Dimension,
  DomScrollableElement,
  EditOperation,
  EditSources,
  EditorAction,
  EditorCommand,
  EditorContextKeys,
  EventHelper,
  FindInput,
  FuzzyScore,
  FuzzyScoreOptions,
  HistoryInputBox,
  IAccessibilityService,
  IClipboardService,
  ICodeEditorService,
  ICommandService,
  IConfigurationService,
  IContextKeyService,
  IEditorWorkerService,
  IEnvironmentService,
  IInstantiationService,
  ILabelService,
  ILanguageConfigurationService,
  ILanguageFeaturesService,
  ILanguageService,
  ILogService,
  IMarkdownRendererService,
  IMenuService,
  IModelService,
  INotificationService,
  IStorageService,
  ITelemetryService,
  ITextModelService,
  IThemeService,
  IWorkspaceContextService,
  IconLabel,
  KeyCodeChord,
  KeybindingsRegistry,
  List,
  MarkdownString,
  MenuId,
  MenuItemAction,
  ModelDecorationOptions,
  OrthogonalEdge,
  PLAINTEXT_LANGUAGE_ID,
  RawContextKey,
  Sash,
  Schemas,
  StableEditorScrollState,
  TernarySearchTree,
  TextOnlyMenuEntryActionViewItem,
  ThemeIcon,
  Toggle,
  WORKSPACE_EXTENSION,
  Widget,
  WillSaveStateReason,
  WindowIdleValue,
  activeContrastBorder,
  addStandardDisposableListener,
  alert,
  anyScore,
  append,
  basename as basename2,
  clamp,
  clearNode,
  createDecorator,
  createMatches,
  dirname as dirname2,
  editorForeground,
  editorWidgetBackground,
  editorWidgetBorder,
  extname,
  foreground,
  fuzzyScore,
  fuzzyScoreGracefulAggressive,
  generateUuid,
  getClientArea,
  getDomNodePagePosition,
  getListStyles,
  getWindow,
  hasDriveLetter,
  hide,
  isActiveElement,
  isEmptyWorkspaceIdentifier,
  isHighContrast,
  isSingleFolderWorkspaceIdentifier,
  listFocusHighlightForeground,
  listHighlightForeground,
  observableValue,
  quickInputListFocusBackground,
  quickInputListFocusForeground,
  quickInputListFocusIconForeground,
  registerColor,
  registerEditorAction,
  registerEditorCommand,
  registerEditorContribution,
  registerIcon,
  registerSingleton,
  runAtThisOrScheduleAtNextAnimationFrame,
  show,
  size,
  status,
  toWorkspaceIdentifier,
  transparent
} from "./chunk-B6IUI4BZ.js";
import {
  CancellationError,
  CancellationToken,
  CancellationTokenSource,
  CharacterSet,
  Codicon,
  CompletionItemKinds,
  DisposableStore,
  Emitter,
  Event,
  LRUCache,
  LinkedList,
  MutableDisposable,
  PauseableEmitter,
  Position,
  ProviderId,
  Range,
  RunOnceScheduler,
  Selection,
  StopWatch,
  TimeoutTimer,
  URI,
  assertType,
  basename,
  binarySearch,
  commonPrefixLength,
  compareIgnoreCase,
  createCancelablePromise,
  dirname,
  disposableTimeout,
  dispose,
  format,
  getLeadingWhitespace,
  groupBy,
  hash,
  isCancellationError,
  isDisposable,
  isFalsyOrEmpty,
  isFalsyOrWhitespace,
  isHighSurrogate,
  isLowSurrogate,
  isMacintosh,
  isNonEmptyArray,
  isObject,
  isWindows,
  localize,
  localize2,
  mixin,
  onUnexpectedError,
  onUnexpectedExternalError,
  quickSelect,
  splitLines,
  toDisposable
} from "./chunk-KY2O3UZD.js";
import "./chunk-FOYMJMJR.js";

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

// node_modules/monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetParser.js
var _Scanner = class _Scanner {
  constructor() {
    this.value = "";
    this.pos = 0;
  }
  static isDigitCharacter(ch) {
    return ch >= 48 && ch <= 57;
  }
  static isVariableCharacter(ch) {
    return ch === 95 || ch >= 97 && ch <= 122 || ch >= 65 && ch <= 90;
  }
  text(value) {
    this.value = value;
    this.pos = 0;
  }
  tokenText(token) {
    return this.value.substr(token.pos, token.len);
  }
  next() {
    if (this.pos >= this.value.length) {
      return { type: 14, pos: this.pos, len: 0 };
    }
    const pos = this.pos;
    let len = 0;
    let ch = this.value.charCodeAt(pos);
    let type;
    type = _Scanner._table[ch];
    if (typeof type === "number") {
      this.pos += 1;
      return { type, pos, len: 1 };
    }
    if (_Scanner.isDigitCharacter(ch)) {
      type = 8;
      do {
        len += 1;
        ch = this.value.charCodeAt(pos + len);
      } while (_Scanner.isDigitCharacter(ch));
      this.pos += len;
      return { type, pos, len };
    }
    if (_Scanner.isVariableCharacter(ch)) {
      type = 9;
      do {
        ch = this.value.charCodeAt(pos + ++len);
      } while (_Scanner.isVariableCharacter(ch) || _Scanner.isDigitCharacter(ch));
      this.pos += len;
      return { type, pos, len };
    }
    type = 10;
    do {
      len += 1;
      ch = this.value.charCodeAt(pos + len);
    } while (!isNaN(ch) && typeof _Scanner._table[ch] === "undefined" && !_Scanner.isDigitCharacter(ch) && !_Scanner.isVariableCharacter(ch));
    this.pos += len;
    return { type, pos, len };
  }
};
_Scanner._table = {
  [
    36
    /* CharCode.DollarSign */
  ]: 0,
  [
    58
    /* CharCode.Colon */
  ]: 1,
  [
    44
    /* CharCode.Comma */
  ]: 2,
  [
    123
    /* CharCode.OpenCurlyBrace */
  ]: 3,
  [
    125
    /* CharCode.CloseCurlyBrace */
  ]: 4,
  [
    92
    /* CharCode.Backslash */
  ]: 5,
  [
    47
    /* CharCode.Slash */
  ]: 6,
  [
    124
    /* CharCode.Pipe */
  ]: 7,
  [
    43
    /* CharCode.Plus */
  ]: 11,
  [
    45
    /* CharCode.Dash */
  ]: 12,
  [
    63
    /* CharCode.QuestionMark */
  ]: 13
};
var Scanner = _Scanner;
var Marker = class {
  constructor() {
    this._children = [];
  }
  appendChild(child) {
    if (child instanceof Text && this._children[this._children.length - 1] instanceof Text) {
      this._children[this._children.length - 1].value += child.value;
    } else {
      child.parent = this;
      this._children.push(child);
    }
    return this;
  }
  replace(child, others) {
    const { parent } = child;
    const idx = parent.children.indexOf(child);
    const newChildren = parent.children.slice(0);
    newChildren.splice(idx, 1, ...others);
    parent._children = newChildren;
    (function _fixParent(children, parent2) {
      for (const child2 of children) {
        child2.parent = parent2;
        _fixParent(child2.children, child2);
      }
    })(others, parent);
  }
  get children() {
    return this._children;
  }
  get rightMostDescendant() {
    if (this._children.length > 0) {
      return this._children[this._children.length - 1].rightMostDescendant;
    }
    return this;
  }
  get snippet() {
    let candidate = this;
    while (true) {
      if (!candidate) {
        return void 0;
      }
      if (candidate instanceof TextmateSnippet) {
        return candidate;
      }
      candidate = candidate.parent;
    }
  }
  toString() {
    return this.children.reduce((prev, cur) => prev + cur.toString(), "");
  }
  len() {
    return 0;
  }
};
var Text = class _Text extends Marker {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() {
    return this.value;
  }
  len() {
    return this.value.length;
  }
  clone() {
    return new _Text(this.value);
  }
};
var TransformableMarker = class extends Marker {
};
var Placeholder = class _Placeholder extends TransformableMarker {
  static compareByIndex(a, b) {
    if (a.index === b.index) {
      return 0;
    } else if (a.isFinalTabstop) {
      return 1;
    } else if (b.isFinalTabstop) {
      return -1;
    } else if (a.index < b.index) {
      return -1;
    } else if (a.index > b.index) {
      return 1;
    } else {
      return 0;
    }
  }
  constructor(index) {
    super();
    this.index = index;
  }
  get isFinalTabstop() {
    return this.index === 0;
  }
  get choice() {
    return this._children.length === 1 && this._children[0] instanceof Choice ? this._children[0] : void 0;
  }
  clone() {
    const ret = new _Placeholder(this.index);
    if (this.transform) {
      ret.transform = this.transform.clone();
    }
    ret._children = this.children.map((child) => child.clone());
    return ret;
  }
};
var Choice = class _Choice extends Marker {
  constructor() {
    super(...arguments);
    this.options = [];
  }
  appendChild(marker) {
    if (marker instanceof Text) {
      marker.parent = this;
      this.options.push(marker);
    }
    return this;
  }
  toString() {
    return this.options[0].value;
  }
  len() {
    return this.options[0].len();
  }
  clone() {
    const ret = new _Choice();
    this.options.forEach(ret.appendChild, ret);
    return ret;
  }
};
var Transform = class _Transform extends Marker {
  constructor() {
    super(...arguments);
    this.regexp = new RegExp("");
  }
  resolve(value) {
    const _this = this;
    let didMatch = false;
    let ret = value.replace(this.regexp, function() {
      didMatch = true;
      return _this._replace(Array.prototype.slice.call(arguments, 0, -2));
    });
    if (!didMatch && this._children.some((child) => child instanceof FormatString && Boolean(child.elseValue))) {
      ret = this._replace([]);
    }
    return ret;
  }
  _replace(groups) {
    let ret = "";
    for (const marker of this._children) {
      if (marker instanceof FormatString) {
        let value = groups[marker.index] || "";
        value = marker.resolve(value);
        ret += value;
      } else {
        ret += marker.toString();
      }
    }
    return ret;
  }
  toString() {
    return "";
  }
  clone() {
    const ret = new _Transform();
    ret.regexp = new RegExp(this.regexp.source, (this.regexp.ignoreCase ? "i" : "") + (this.regexp.global ? "g" : ""));
    ret._children = this.children.map((child) => child.clone());
    return ret;
  }
};
var FormatString = class _FormatString extends Marker {
  constructor(index, shorthandName, ifValue, elseValue) {
    super();
    this.index = index;
    this.shorthandName = shorthandName;
    this.ifValue = ifValue;
    this.elseValue = elseValue;
  }
  resolve(value) {
    if (this.shorthandName === "upcase") {
      return !value ? "" : value.toLocaleUpperCase();
    } else if (this.shorthandName === "downcase") {
      return !value ? "" : value.toLocaleLowerCase();
    } else if (this.shorthandName === "capitalize") {
      return !value ? "" : value[0].toLocaleUpperCase() + value.substr(1);
    } else if (this.shorthandName === "pascalcase") {
      return !value ? "" : this._toPascalCase(value);
    } else if (this.shorthandName === "camelcase") {
      return !value ? "" : this._toCamelCase(value);
    } else if (Boolean(value) && typeof this.ifValue === "string") {
      return this.ifValue;
    } else if (!Boolean(value) && typeof this.elseValue === "string") {
      return this.elseValue;
    } else {
      return value || "";
    }
  }
  _toPascalCase(value) {
    const match = value.match(/[a-z0-9]+/gi);
    if (!match) {
      return value;
    }
    return match.map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1);
    }).join("");
  }
  _toCamelCase(value) {
    const match = value.match(/[a-z0-9]+/gi);
    if (!match) {
      return value;
    }
    return match.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.substr(1);
      }
      return word.charAt(0).toUpperCase() + word.substr(1);
    }).join("");
  }
  clone() {
    const ret = new _FormatString(this.index, this.shorthandName, this.ifValue, this.elseValue);
    return ret;
  }
};
var Variable = class _Variable extends TransformableMarker {
  constructor(name) {
    super();
    this.name = name;
  }
  resolve(resolver) {
    let value = resolver.resolve(this);
    if (this.transform) {
      value = this.transform.resolve(value || "");
    }
    if (value !== void 0) {
      this._children = [new Text(value)];
      return true;
    }
    return false;
  }
  clone() {
    const ret = new _Variable(this.name);
    if (this.transform) {
      ret.transform = this.transform.clone();
    }
    ret._children = this.children.map((child) => child.clone());
    return ret;
  }
};
function walk(marker, visitor) {
  const stack = [...marker];
  while (stack.length > 0) {
    const marker2 = stack.shift();
    const recurse = visitor(marker2);
    if (!recurse) {
      break;
    }
    stack.unshift(...marker2.children);
  }
}
var TextmateSnippet = class _TextmateSnippet extends Marker {
  get placeholderInfo() {
    if (!this._placeholders) {
      const all = [];
      let last;
      this.walk(function(candidate) {
        if (candidate instanceof Placeholder) {
          all.push(candidate);
          last = !last || last.index < candidate.index ? candidate : last;
        }
        return true;
      });
      this._placeholders = { all, last };
    }
    return this._placeholders;
  }
  get placeholders() {
    const { all } = this.placeholderInfo;
    return all;
  }
  offset(marker) {
    let pos = 0;
    let found = false;
    this.walk((candidate) => {
      if (candidate === marker) {
        found = true;
        return false;
      }
      pos += candidate.len();
      return true;
    });
    if (!found) {
      return -1;
    }
    return pos;
  }
  fullLen(marker) {
    let ret = 0;
    walk([marker], (marker2) => {
      ret += marker2.len();
      return true;
    });
    return ret;
  }
  enclosingPlaceholders(placeholder) {
    const ret = [];
    let { parent } = placeholder;
    while (parent) {
      if (parent instanceof Placeholder) {
        ret.push(parent);
      }
      parent = parent.parent;
    }
    return ret;
  }
  resolveVariables(resolver) {
    this.walk((candidate) => {
      if (candidate instanceof Variable) {
        if (candidate.resolve(resolver)) {
          this._placeholders = void 0;
        }
      }
      return true;
    });
    return this;
  }
  appendChild(child) {
    this._placeholders = void 0;
    return super.appendChild(child);
  }
  replace(child, others) {
    this._placeholders = void 0;
    return super.replace(child, others);
  }
  clone() {
    const ret = new _TextmateSnippet();
    this._children = this.children.map((child) => child.clone());
    return ret;
  }
  walk(visitor) {
    walk(this.children, visitor);
  }
};
var SnippetParser = class {
  constructor() {
    this._scanner = new Scanner();
    this._token = { type: 14, pos: 0, len: 0 };
  }
  static escape(value) {
    return value.replace(/\$|}|\\/g, "\\$&");
  }
  static guessNeedsClipboard(template) {
    return /\${?CLIPBOARD/.test(template);
  }
  parse(value, insertFinalTabstop, enforceFinalTabstop) {
    const snippet = new TextmateSnippet();
    this.parseFragment(value, snippet);
    this.ensureFinalTabstop(snippet, enforceFinalTabstop ?? false, insertFinalTabstop ?? false);
    return snippet;
  }
  parseFragment(value, snippet) {
    const offset = snippet.children.length;
    this._scanner.text(value);
    this._token = this._scanner.next();
    while (this._parse(snippet)) {
    }
    const placeholderDefaultValues = /* @__PURE__ */ new Map();
    const incompletePlaceholders = [];
    snippet.walk((marker) => {
      if (marker instanceof Placeholder) {
        if (marker.isFinalTabstop) {
          placeholderDefaultValues.set(0, void 0);
        } else if (!placeholderDefaultValues.has(marker.index) && marker.children.length > 0) {
          placeholderDefaultValues.set(marker.index, marker.children);
        } else {
          incompletePlaceholders.push(marker);
        }
      }
      return true;
    });
    const fillInIncompletePlaceholder = (placeholder, stack2) => {
      const defaultValues = placeholderDefaultValues.get(placeholder.index);
      if (!defaultValues) {
        return;
      }
      const clone = new Placeholder(placeholder.index);
      clone.transform = placeholder.transform;
      for (const child of defaultValues) {
        const newChild = child.clone();
        clone.appendChild(newChild);
        if (newChild instanceof Placeholder && placeholderDefaultValues.has(newChild.index) && !stack2.has(newChild.index)) {
          stack2.add(newChild.index);
          fillInIncompletePlaceholder(newChild, stack2);
          stack2.delete(newChild.index);
        }
      }
      snippet.replace(placeholder, [clone]);
    };
    const stack = /* @__PURE__ */ new Set();
    for (const placeholder of incompletePlaceholders) {
      fillInIncompletePlaceholder(placeholder, stack);
    }
    return snippet.children.slice(offset);
  }
  ensureFinalTabstop(snippet, enforceFinalTabstop, insertFinalTabstop) {
    if (enforceFinalTabstop || insertFinalTabstop && snippet.placeholders.length > 0) {
      const finalTabstop = snippet.placeholders.find((p) => p.index === 0);
      if (!finalTabstop) {
        snippet.appendChild(new Placeholder(0));
      }
    }
  }
  _accept(type, value) {
    if (type === void 0 || this._token.type === type) {
      const ret = !value ? true : this._scanner.tokenText(this._token);
      this._token = this._scanner.next();
      return ret;
    }
    return false;
  }
  _backTo(token) {
    this._scanner.pos = token.pos + token.len;
    this._token = token;
    return false;
  }
  _until(type) {
    const start = this._token;
    while (this._token.type !== type) {
      if (this._token.type === 14) {
        return false;
      } else if (this._token.type === 5) {
        const nextToken = this._scanner.next();
        if (nextToken.type !== 0 && nextToken.type !== 4 && nextToken.type !== 5) {
          return false;
        }
      }
      this._token = this._scanner.next();
    }
    const value = this._scanner.value.substring(start.pos, this._token.pos).replace(/\\(\$|}|\\)/g, "$1");
    this._token = this._scanner.next();
    return value;
  }
  _parse(marker) {
    return this._parseEscaped(marker) || this._parseTabstopOrVariableName(marker) || this._parseComplexPlaceholder(marker) || this._parseComplexVariable(marker) || this._parseAnything(marker);
  }
  // \$, \\, \} -> just text
  _parseEscaped(marker) {
    let value;
    if (value = this._accept(5, true)) {
      value = this._accept(0, true) || this._accept(4, true) || this._accept(5, true) || value;
      marker.appendChild(new Text(value));
      return true;
    }
    return false;
  }
  // $foo -> variable, $1 -> tabstop
  _parseTabstopOrVariableName(parent) {
    let value;
    const token = this._token;
    const match = this._accept(
      0
      /* TokenType.Dollar */
    ) && (value = this._accept(9, true) || this._accept(8, true));
    if (!match) {
      return this._backTo(token);
    }
    parent.appendChild(/^\d+$/.test(value) ? new Placeholder(Number(value)) : new Variable(value));
    return true;
  }
  // ${1:<children>}, ${1} -> placeholder
  _parseComplexPlaceholder(parent) {
    let index;
    const token = this._token;
    const match = this._accept(
      0
      /* TokenType.Dollar */
    ) && this._accept(
      3
      /* TokenType.CurlyOpen */
    ) && (index = this._accept(8, true));
    if (!match) {
      return this._backTo(token);
    }
    const placeholder = new Placeholder(Number(index));
    if (this._accept(
      1
      /* TokenType.Colon */
    )) {
      while (true) {
        if (this._accept(
          4
          /* TokenType.CurlyClose */
        )) {
          parent.appendChild(placeholder);
          return true;
        }
        if (this._parse(placeholder)) {
          continue;
        }
        parent.appendChild(new Text("${" + index + ":"));
        placeholder.children.forEach(parent.appendChild, parent);
        return true;
      }
    } else if (placeholder.index > 0 && this._accept(
      7
      /* TokenType.Pipe */
    )) {
      const choice = new Choice();
      while (true) {
        if (this._parseChoiceElement(choice)) {
          if (this._accept(
            2
            /* TokenType.Comma */
          )) {
            continue;
          }
          if (this._accept(
            7
            /* TokenType.Pipe */
          )) {
            placeholder.appendChild(choice);
            if (this._accept(
              4
              /* TokenType.CurlyClose */
            )) {
              parent.appendChild(placeholder);
              return true;
            }
          }
        }
        this._backTo(token);
        return false;
      }
    } else if (this._accept(
      6
      /* TokenType.Forwardslash */
    )) {
      if (this._parseTransform(placeholder)) {
        parent.appendChild(placeholder);
        return true;
      }
      this._backTo(token);
      return false;
    } else if (this._accept(
      4
      /* TokenType.CurlyClose */
    )) {
      parent.appendChild(placeholder);
      return true;
    } else {
      return this._backTo(token);
    }
  }
  _parseChoiceElement(parent) {
    const token = this._token;
    const values = [];
    while (true) {
      if (this._token.type === 2 || this._token.type === 7) {
        break;
      }
      let value;
      if (value = this._accept(5, true)) {
        value = this._accept(2, true) || this._accept(7, true) || this._accept(5, true) || value;
      } else {
        value = this._accept(void 0, true);
      }
      if (!value) {
        this._backTo(token);
        return false;
      }
      values.push(value);
    }
    if (values.length === 0) {
      this._backTo(token);
      return false;
    }
    parent.appendChild(new Text(values.join("")));
    return true;
  }
  // ${foo:<children>}, ${foo} -> variable
  _parseComplexVariable(parent) {
    let name;
    const token = this._token;
    const match = this._accept(
      0
      /* TokenType.Dollar */
    ) && this._accept(
      3
      /* TokenType.CurlyOpen */
    ) && (name = this._accept(9, true));
    if (!match) {
      return this._backTo(token);
    }
    const variable = new Variable(name);
    if (this._accept(
      1
      /* TokenType.Colon */
    )) {
      while (true) {
        if (this._accept(
          4
          /* TokenType.CurlyClose */
        )) {
          parent.appendChild(variable);
          return true;
        }
        if (this._parse(variable)) {
          continue;
        }
        parent.appendChild(new Text("${" + name + ":"));
        variable.children.forEach(parent.appendChild, parent);
        return true;
      }
    } else if (this._accept(
      6
      /* TokenType.Forwardslash */
    )) {
      if (this._parseTransform(variable)) {
        parent.appendChild(variable);
        return true;
      }
      this._backTo(token);
      return false;
    } else if (this._accept(
      4
      /* TokenType.CurlyClose */
    )) {
      parent.appendChild(variable);
      return true;
    } else {
      return this._backTo(token);
    }
  }
  _parseTransform(parent) {
    const transform = new Transform();
    let regexValue = "";
    let regexOptions = "";
    while (true) {
      if (this._accept(
        6
        /* TokenType.Forwardslash */
      )) {
        break;
      }
      let escaped;
      if (escaped = this._accept(5, true)) {
        escaped = this._accept(6, true) || escaped;
        regexValue += escaped;
        continue;
      }
      if (this._token.type !== 14) {
        regexValue += this._accept(void 0, true);
        continue;
      }
      return false;
    }
    while (true) {
      if (this._accept(
        6
        /* TokenType.Forwardslash */
      )) {
        break;
      }
      let escaped;
      if (escaped = this._accept(5, true)) {
        escaped = this._accept(5, true) || this._accept(6, true) || escaped;
        transform.appendChild(new Text(escaped));
        continue;
      }
      if (this._parseFormatString(transform) || this._parseAnything(transform)) {
        continue;
      }
      return false;
    }
    while (true) {
      if (this._accept(
        4
        /* TokenType.CurlyClose */
      )) {
        break;
      }
      if (this._token.type !== 14) {
        regexOptions += this._accept(void 0, true);
        continue;
      }
      return false;
    }
    try {
      transform.regexp = new RegExp(regexValue, regexOptions);
    } catch (e) {
      return false;
    }
    parent.transform = transform;
    return true;
  }
  _parseFormatString(parent) {
    const token = this._token;
    if (!this._accept(
      0
      /* TokenType.Dollar */
    )) {
      return false;
    }
    let complex = false;
    if (this._accept(
      3
      /* TokenType.CurlyOpen */
    )) {
      complex = true;
    }
    const index = this._accept(8, true);
    if (!index) {
      this._backTo(token);
      return false;
    } else if (!complex) {
      parent.appendChild(new FormatString(Number(index)));
      return true;
    } else if (this._accept(
      4
      /* TokenType.CurlyClose */
    )) {
      parent.appendChild(new FormatString(Number(index)));
      return true;
    } else if (!this._accept(
      1
      /* TokenType.Colon */
    )) {
      this._backTo(token);
      return false;
    }
    if (this._accept(
      6
      /* TokenType.Forwardslash */
    )) {
      const shorthand = this._accept(9, true);
      if (!shorthand || !this._accept(
        4
        /* TokenType.CurlyClose */
      )) {
        this._backTo(token);
        return false;
      } else {
        parent.appendChild(new FormatString(Number(index), shorthand));
        return true;
      }
    } else if (this._accept(
      11
      /* TokenType.Plus */
    )) {
      const ifValue = this._until(
        4
        /* TokenType.CurlyClose */
      );
      if (ifValue) {
        parent.appendChild(new FormatString(Number(index), void 0, ifValue, void 0));
        return true;
      }
    } else if (this._accept(
      12
      /* TokenType.Dash */
    )) {
      const elseValue = this._until(
        4
        /* TokenType.CurlyClose */
      );
      if (elseValue) {
        parent.appendChild(new FormatString(Number(index), void 0, void 0, elseValue));
        return true;
      }
    } else if (this._accept(
      13
      /* TokenType.QuestionMark */
    )) {
      const ifValue = this._until(
        1
        /* TokenType.Colon */
      );
      if (ifValue) {
        const elseValue = this._until(
          4
          /* TokenType.CurlyClose */
        );
        if (elseValue) {
          parent.appendChild(new FormatString(Number(index), void 0, ifValue, elseValue));
          return true;
        }
      }
    } else {
      const elseValue = this._until(
        4
        /* TokenType.CurlyClose */
      );
      if (elseValue) {
        parent.appendChild(new FormatString(Number(index), void 0, void 0, elseValue));
        return true;
      }
    }
    this._backTo(token);
    return false;
  }
  _parseAnything(marker) {
    if (this._token.type !== 14) {
      marker.appendChild(new Text(this._scanner.tokenText(this._token)));
      this._accept(void 0);
      return true;
    }
    return false;
  }
};

// node_modules/monaco-editor/esm/vs/base/browser/ui/findinput/replaceInput.js
var NLS_DEFAULT_LABEL = localize(5, "input");
var NLS_PRESERVE_CASE_LABEL = localize(6, "Preserve Case");
var PreserveCaseToggle = class extends Toggle {
  constructor(opts) {
    super({
      // TODO: does this need its own icon?
      icon: Codicon.preserveCase,
      title: NLS_PRESERVE_CASE_LABEL + opts.appendTitle,
      isChecked: opts.isChecked,
      hoverLifecycleOptions: opts.hoverLifecycleOptions,
      inputActiveOptionBorder: opts.inputActiveOptionBorder,
      inputActiveOptionForeground: opts.inputActiveOptionForeground,
      inputActiveOptionBackground: opts.inputActiveOptionBackground
    });
  }
};
var ReplaceInput = class extends Widget {
  get onDidOptionChange() {
    return this._onDidOptionChange.event;
  }
  get onKeyDown() {
    return this._onKeyDown.event;
  }
  get onPreserveCaseKeyDown() {
    return this._onPreserveCaseKeyDown.event;
  }
  constructor(parent, contextViewProvider, _showOptionButtons, options) {
    super();
    this._showOptionButtons = _showOptionButtons;
    this.fixFocusOnOptionClickEnabled = true;
    this.cachedOptionsWidth = 0;
    this._onDidOptionChange = this._register(new Emitter());
    this._onKeyDown = this._register(new Emitter());
    this._onMouseDown = this._register(new Emitter());
    this._onInput = this._register(new Emitter());
    this._onKeyUp = this._register(new Emitter());
    this._onPreserveCaseKeyDown = this._register(new Emitter());
    this.contextViewProvider = contextViewProvider;
    this.placeholder = options.placeholder || "";
    this.validation = options.validation;
    this.label = options.label || NLS_DEFAULT_LABEL;
    const appendPreserveCaseLabel = options.appendPreserveCaseLabel || "";
    const history = options.history || /* @__PURE__ */ new Set([]);
    const flexibleHeight = !!options.flexibleHeight;
    const flexibleWidth = !!options.flexibleWidth;
    const flexibleMaxHeight = options.flexibleMaxHeight;
    this.domNode = document.createElement("div");
    this.domNode.classList.add("monaco-findInput");
    this.inputBox = this._register(new HistoryInputBox(this.domNode, this.contextViewProvider, {
      ariaLabel: this.label || "",
      placeholder: this.placeholder || "",
      validationOptions: {
        validation: this.validation
      },
      history,
      showHistoryHint: options.showHistoryHint,
      flexibleHeight,
      flexibleWidth,
      flexibleMaxHeight,
      inputBoxStyles: options.inputBoxStyles
    }));
    this.preserveCase = this._register(new PreserveCaseToggle({
      appendTitle: appendPreserveCaseLabel,
      isChecked: false,
      hoverLifecycleOptions: options.hoverLifecycleOptions,
      ...options.toggleStyles
    }));
    this._register(this.preserveCase.onChange((viaKeyboard) => {
      this._onDidOptionChange.fire(viaKeyboard);
      if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
        this.inputBox.focus();
      }
      this.validate();
    }));
    this._register(this.preserveCase.onKeyDown((e) => {
      this._onPreserveCaseKeyDown.fire(e);
    }));
    if (this._showOptionButtons) {
      this.cachedOptionsWidth = this.preserveCase.width();
    } else {
      this.cachedOptionsWidth = 0;
    }
    const indexes = [this.preserveCase.domNode];
    this.onkeydown(this.domNode, (event) => {
      if (event.equals(
        15
        /* KeyCode.LeftArrow */
      ) || event.equals(
        17
        /* KeyCode.RightArrow */
      ) || event.equals(
        9
        /* KeyCode.Escape */
      )) {
        const index = indexes.indexOf(this.domNode.ownerDocument.activeElement);
        if (index >= 0) {
          let newIndex = -1;
          if (event.equals(
            17
            /* KeyCode.RightArrow */
          )) {
            newIndex = (index + 1) % indexes.length;
          } else if (event.equals(
            15
            /* KeyCode.LeftArrow */
          )) {
            if (index === 0) {
              newIndex = indexes.length - 1;
            } else {
              newIndex = index - 1;
            }
          }
          if (event.equals(
            9
            /* KeyCode.Escape */
          )) {
            indexes[index].blur();
            this.inputBox.focus();
          } else if (newIndex >= 0) {
            indexes[newIndex].focus();
          }
          EventHelper.stop(event, true);
        }
      }
    });
    const controls = document.createElement("div");
    controls.className = "controls";
    controls.style.display = this._showOptionButtons ? "block" : "none";
    controls.appendChild(this.preserveCase.domNode);
    this.domNode.appendChild(controls);
    parent?.appendChild(this.domNode);
    this.onkeydown(this.inputBox.inputElement, (e) => this._onKeyDown.fire(e));
    this.onkeyup(this.inputBox.inputElement, (e) => this._onKeyUp.fire(e));
    this.oninput(this.inputBox.inputElement, (e) => this._onInput.fire());
    this.onmousedown(this.inputBox.inputElement, (e) => this._onMouseDown.fire(e));
  }
  enable() {
    this.domNode.classList.remove("disabled");
    this.inputBox.enable();
    this.preserveCase.enable();
  }
  disable() {
    this.domNode.classList.add("disabled");
    this.inputBox.disable();
    this.preserveCase.disable();
  }
  setEnabled(enabled) {
    if (enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }
  select() {
    this.inputBox.select();
  }
  focus() {
    this.inputBox.focus();
  }
  getPreserveCase() {
    return this.preserveCase.checked;
  }
  setPreserveCase(value) {
    this.preserveCase.checked = value;
  }
  focusOnPreserve() {
    this.preserveCase.focus();
  }
  validate() {
    this.inputBox?.validate();
  }
  set width(newWidth) {
    this.inputBox.paddingRight = this.cachedOptionsWidth;
    this.domNode.style.width = newWidth + "px";
  }
  dispose() {
    super.dispose();
  }
};

// node_modules/monaco-editor/esm/vs/platform/history/browser/contextScopedHistoryWidget.js
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var historyNavigationVisible = new RawContextKey("suggestWidgetVisible", false, localize(1698, "Whether suggestion are visible"));
var HistoryNavigationWidgetFocusContext = "historyNavigationWidgetFocus";
var HistoryNavigationForwardsEnablementContext = "historyNavigationForwardsEnabled";
var HistoryNavigationBackwardsEnablementContext = "historyNavigationBackwardsEnabled";
var lastFocusedWidget = void 0;
var widgets = [];
function registerAndCreateHistoryNavigationContext(scopedContextKeyService, widget) {
  if (widgets.includes(widget)) {
    throw new Error("Cannot register the same widget multiple times");
  }
  widgets.push(widget);
  const disposableStore = new DisposableStore();
  const historyNavigationWidgetFocus = new RawContextKey(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);
  const historyNavigationForwardsEnablement = new RawContextKey(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);
  const historyNavigationBackwardsEnablement = new RawContextKey(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);
  const onDidFocus = () => {
    historyNavigationWidgetFocus.set(true);
    lastFocusedWidget = widget;
  };
  const onDidBlur = () => {
    historyNavigationWidgetFocus.set(false);
    if (lastFocusedWidget === widget) {
      lastFocusedWidget = void 0;
    }
  };
  if (isActiveElement(widget.element)) {
    onDidFocus();
  }
  disposableStore.add(widget.onDidFocus(() => onDidFocus()));
  disposableStore.add(widget.onDidBlur(() => onDidBlur()));
  disposableStore.add(toDisposable(() => {
    widgets.splice(widgets.indexOf(widget), 1);
    onDidBlur();
  }));
  return {
    historyNavigationForwardsEnablement,
    historyNavigationBackwardsEnablement,
    dispose() {
      disposableStore.dispose();
    }
  };
}
var ContextScopedFindInput = class ContextScopedFindInput2 extends FindInput {
  constructor(container, contextViewProvider, options, contextKeyService) {
    super(container, contextViewProvider, options);
    const scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));
    this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));
  }
};
ContextScopedFindInput = __decorate([
  __param(3, IContextKeyService)
], ContextScopedFindInput);
var ContextScopedReplaceInput = class ContextScopedReplaceInput2 extends ReplaceInput {
  constructor(container, contextViewProvider, options, contextKeyService, showReplaceOptions = false) {
    super(container, contextViewProvider, showReplaceOptions, options);
    const scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));
    this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));
  }
};
ContextScopedReplaceInput = __decorate([
  __param(3, IContextKeyService)
], ContextScopedReplaceInput);
KeybindingsRegistry.registerCommandAndKeybindingRule({
  id: "history.showPrevious",
  weight: 200,
  when: ContextKeyExpr.and(ContextKeyExpr.has(HistoryNavigationWidgetFocusContext), ContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true), ContextKeyExpr.not("isComposing"), historyNavigationVisible.isEqualTo(false)),
  primary: 16,
  secondary: [
    512 | 16
    /* KeyCode.UpArrow */
  ],
  handler: (accessor) => {
    lastFocusedWidget?.showPreviousValue();
  }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
  id: "history.showNext",
  weight: 200,
  when: ContextKeyExpr.and(ContextKeyExpr.has(HistoryNavigationWidgetFocusContext), ContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true), ContextKeyExpr.not("isComposing"), historyNavigationVisible.isEqualTo(false)),
  primary: 18,
  secondary: [
    512 | 18
    /* KeyCode.DownArrow */
  ],
  handler: (accessor) => {
    lastFocusedWidget?.showNextValue();
  }
});

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggest.js
var Context = {
  Visible: historyNavigationVisible,
  HasFocusedSuggestion: new RawContextKey("suggestWidgetHasFocusedSuggestion", false, localize(1455, "Whether any suggestion is focused")),
  DetailsVisible: new RawContextKey("suggestWidgetDetailsVisible", false, localize(1456, "Whether suggestion details are visible")),
  MultipleSuggestions: new RawContextKey("suggestWidgetMultipleSuggestions", false, localize(1457, "Whether there are multiple suggestions to pick from")),
  MakesTextEdit: new RawContextKey("suggestionMakesTextEdit", true, localize(1458, "Whether inserting the current suggestion yields in a change or has everything already been typed")),
  AcceptSuggestionsOnEnter: new RawContextKey("acceptSuggestionOnEnter", true, localize(1459, "Whether suggestions are inserted when pressing Enter")),
  HasInsertAndReplaceRange: new RawContextKey("suggestionHasInsertAndReplaceRange", false, localize(1460, "Whether the current suggestion has insert and replace behaviour")),
  InsertMode: new RawContextKey("suggestionInsertMode", void 0, { type: "string", description: localize(1461, "Whether the default behaviour is to insert or replace") }),
  CanResolve: new RawContextKey("suggestionCanResolve", false, localize(1462, "Whether the current suggestion supports to resolve further details"))
};
var suggestWidgetStatusbarMenu = new MenuId("suggestWidgetStatusBar");
var CompletionItem = class {
  constructor(position, completion, container, provider) {
    this.position = position;
    this.completion = completion;
    this.container = container;
    this.provider = provider;
    this.isInvalid = false;
    this.score = FuzzyScore.Default;
    this.distance = 0;
    this.textLabel = typeof completion.label === "string" ? completion.label : completion.label?.label;
    this.labelLow = this.textLabel.toLowerCase();
    this.isInvalid = !this.textLabel;
    this.sortTextLow = completion.sortText && completion.sortText.toLowerCase();
    this.filterTextLow = completion.filterText && completion.filterText.toLowerCase();
    this.extensionId = completion.extensionId;
    if (Range.isIRange(completion.range)) {
      this.editStart = new Position(completion.range.startLineNumber, completion.range.startColumn);
      this.editInsertEnd = new Position(completion.range.endLineNumber, completion.range.endColumn);
      this.editReplaceEnd = new Position(completion.range.endLineNumber, completion.range.endColumn);
      this.isInvalid = this.isInvalid || Range.spansMultipleLines(completion.range) || completion.range.startLineNumber !== position.lineNumber;
    } else {
      this.editStart = new Position(completion.range.insert.startLineNumber, completion.range.insert.startColumn);
      this.editInsertEnd = new Position(completion.range.insert.endLineNumber, completion.range.insert.endColumn);
      this.editReplaceEnd = new Position(completion.range.replace.endLineNumber, completion.range.replace.endColumn);
      this.isInvalid = this.isInvalid || Range.spansMultipleLines(completion.range.insert) || Range.spansMultipleLines(completion.range.replace) || completion.range.insert.startLineNumber !== position.lineNumber || completion.range.replace.startLineNumber !== position.lineNumber || completion.range.insert.startColumn !== completion.range.replace.startColumn;
    }
    if (typeof provider.resolveCompletionItem !== "function") {
      this._resolveCache = Promise.resolve();
      this._resolveDuration = 0;
    }
  }
  // ---- resolving
  get isResolved() {
    return this._resolveDuration !== void 0;
  }
  get resolveDuration() {
    return this._resolveDuration !== void 0 ? this._resolveDuration : -1;
  }
  async resolve(token) {
    if (!this._resolveCache) {
      const sub = token.onCancellationRequested(() => {
        this._resolveCache = void 0;
        this._resolveDuration = void 0;
      });
      const sw = new StopWatch(true);
      this._resolveCache = Promise.resolve(this.provider.resolveCompletionItem(this.completion, token)).then((value) => {
        Object.assign(this.completion, value);
        this._resolveDuration = sw.elapsed();
      }, (err) => {
        if (isCancellationError(err)) {
          this._resolveCache = void 0;
          this._resolveDuration = void 0;
        }
      }).finally(() => {
        sub.dispose();
      });
    }
    return this._resolveCache;
  }
};
var _CompletionOptions = class _CompletionOptions {
  constructor(snippetSortOrder = 2, kindFilter = /* @__PURE__ */ new Set(), providerFilter = /* @__PURE__ */ new Set(), providerItemsToReuse = /* @__PURE__ */ new Map(), showDeprecated = true) {
    this.snippetSortOrder = snippetSortOrder;
    this.kindFilter = kindFilter;
    this.providerFilter = providerFilter;
    this.providerItemsToReuse = providerItemsToReuse;
    this.showDeprecated = showDeprecated;
  }
};
_CompletionOptions.default = new _CompletionOptions();
var CompletionOptions = _CompletionOptions;
var CompletionItemModel = class {
  constructor(items, needsClipboard, durations, disposable) {
    this.items = items;
    this.needsClipboard = needsClipboard;
    this.durations = durations;
    this.disposable = disposable;
  }
};
async function provideSuggestionItems(registry, model, position, options = CompletionOptions.default, context = {
  triggerKind: 0
  /* languages.CompletionTriggerKind.Invoke */
}, token = CancellationToken.None) {
  const sw = new StopWatch();
  position = position.clone();
  const word = model.getWordAtPosition(position);
  const defaultReplaceRange = word ? new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn) : Range.fromPositions(position);
  const defaultRange = { replace: defaultReplaceRange, insert: defaultReplaceRange.setEndPosition(position.lineNumber, position.column) };
  const result = [];
  const disposables = new DisposableStore();
  const durations = [];
  let needsClipboard = false;
  const onCompletionList = (provider, container, sw2) => {
    let didAddResult = false;
    if (!container) {
      return didAddResult;
    }
    for (const suggestion of container.suggestions) {
      if (!options.kindFilter.has(suggestion.kind)) {
        if (!options.showDeprecated && suggestion?.tags?.includes(
          1
          /* languages.CompletionItemTag.Deprecated */
        )) {
          continue;
        }
        if (!suggestion.range) {
          suggestion.range = defaultRange;
        }
        if (!suggestion.sortText) {
          suggestion.sortText = typeof suggestion.label === "string" ? suggestion.label : suggestion.label.label;
        }
        if (!needsClipboard && suggestion.insertTextRules && suggestion.insertTextRules & 4) {
          needsClipboard = SnippetParser.guessNeedsClipboard(suggestion.insertText);
        }
        result.push(new CompletionItem(position, suggestion, container, provider));
        didAddResult = true;
      }
    }
    if (isDisposable(container)) {
      disposables.add(container);
    }
    durations.push({
      providerName: provider._debugDisplayName ?? "unknown_provider",
      elapsedProvider: container.duration ?? -1,
      elapsedOverall: sw2.elapsed()
    });
    return didAddResult;
  };
  const snippetCompletions = (async () => {
    {
      return;
    }
  })();
  for (const providerGroup of registry.orderedGroups(model)) {
    let didAddResult = false;
    await Promise.all(providerGroup.map(async (provider) => {
      if (options.providerItemsToReuse.has(provider)) {
        const items = options.providerItemsToReuse.get(provider);
        items.forEach((item) => result.push(item));
        didAddResult = didAddResult || items.length > 0;
        return;
      }
      if (options.providerFilter.size > 0 && !options.providerFilter.has(provider)) {
        return;
      }
      try {
        const sw2 = new StopWatch();
        const list = await provider.provideCompletionItems(model, position, context, token);
        didAddResult = onCompletionList(provider, list, sw2) || didAddResult;
      } catch (err) {
        onUnexpectedExternalError(err);
      }
    }));
    if (didAddResult || token.isCancellationRequested) {
      break;
    }
  }
  await snippetCompletions;
  if (token.isCancellationRequested) {
    disposables.dispose();
    return Promise.reject(new CancellationError());
  }
  return new CompletionItemModel(result.sort(getSuggestionComparator(options.snippetSortOrder)), needsClipboard, { entries: durations, elapsed: sw.elapsed() }, disposables);
}
function defaultComparator(a, b) {
  if (a.sortTextLow && b.sortTextLow) {
    if (a.sortTextLow < b.sortTextLow) {
      return -1;
    } else if (a.sortTextLow > b.sortTextLow) {
      return 1;
    }
  }
  if (a.textLabel < b.textLabel) {
    return -1;
  } else if (a.textLabel > b.textLabel) {
    return 1;
  }
  return a.completion.kind - b.completion.kind;
}
function snippetUpComparator(a, b) {
  if (a.completion.kind !== b.completion.kind) {
    if (a.completion.kind === 28) {
      return -1;
    } else if (b.completion.kind === 28) {
      return 1;
    }
  }
  return defaultComparator(a, b);
}
function snippetDownComparator(a, b) {
  if (a.completion.kind !== b.completion.kind) {
    if (a.completion.kind === 28) {
      return 1;
    } else if (b.completion.kind === 28) {
      return -1;
    }
  }
  return defaultComparator(a, b);
}
var _snippetComparators = /* @__PURE__ */ new Map();
_snippetComparators.set(0, snippetUpComparator);
_snippetComparators.set(2, snippetDownComparator);
_snippetComparators.set(1, defaultComparator);
function getSuggestionComparator(snippetConfig) {
  return _snippetComparators.get(snippetConfig);
}
CommandsRegistry.registerCommand("_executeCompletionItemProvider", async (accessor, ...args) => {
  const [uri, position, triggerCharacter, maxItemsToResolve] = args;
  assertType(URI.isUri(uri));
  assertType(Position.isIPosition(position));
  assertType(typeof triggerCharacter === "string" || !triggerCharacter);
  assertType(typeof maxItemsToResolve === "number" || !maxItemsToResolve);
  const { completionProvider } = accessor.get(ILanguageFeaturesService);
  const ref = await accessor.get(ITextModelService).createModelReference(uri);
  try {
    const result = {
      incomplete: false,
      suggestions: []
    };
    const resolving = [];
    const actualPosition = ref.object.textEditorModel.validatePosition(position);
    const completions = await provideSuggestionItems(completionProvider, ref.object.textEditorModel, actualPosition, void 0, {
      triggerCharacter: triggerCharacter ?? void 0,
      triggerKind: triggerCharacter ? 1 : 0
      /* languages.CompletionTriggerKind.Invoke */
    });
    for (const item of completions.items) {
      if (resolving.length < (maxItemsToResolve ?? 0)) {
        resolving.push(item.resolve(CancellationToken.None));
      }
      result.incomplete = result.incomplete || item.container.incomplete;
      result.suggestions.push(item.completion);
    }
    try {
      await Promise.all(resolving);
      return result;
    } finally {
      setTimeout(() => completions.disposable.dispose(), 100);
    }
  } finally {
    ref.dispose();
  }
});
function showSimpleSuggestions(editor, provider) {
  editor.getContribution("editor.contrib.suggestController")?.triggerSuggest((/* @__PURE__ */ new Set()).add(provider), void 0, true);
}
var QuickSuggestionsOptions = class {
  static isAllOff(config) {
    return config.other === "off" && config.comments === "off" && config.strings === "off";
  }
  static isAllOn(config) {
    return config.other === "on" && config.comments === "on" && config.strings === "on";
  }
  static valueFor(config, tokenType) {
    switch (tokenType) {
      case 1:
        return config.comments;
      case 2:
        return config.strings;
      default:
        return config.other;
    }
  }
};

// node_modules/monaco-editor/esm/vs/base/common/labels.js
function normalizeDriveLetter(path, isWindowsOS = isWindows) {
  if (hasDriveLetter(path, isWindowsOS)) {
    return path.charAt(0).toUpperCase() + path.slice(1);
  }
  return path;
}

// node_modules/monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetVariables.js
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param2 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var CompositeSnippetVariableResolver = class {
  constructor(_delegates) {
    this._delegates = _delegates;
  }
  resolve(variable) {
    for (const delegate of this._delegates) {
      const value = delegate.resolve(variable);
      if (value !== void 0) {
        return value;
      }
    }
    return void 0;
  }
};
var SelectionBasedVariableResolver = class {
  constructor(_model, _selection, _selectionIdx, _overtypingCapturer) {
    this._model = _model;
    this._selection = _selection;
    this._selectionIdx = _selectionIdx;
    this._overtypingCapturer = _overtypingCapturer;
  }
  resolve(variable) {
    const { name } = variable;
    if (name === "SELECTION" || name === "TM_SELECTED_TEXT") {
      let value = this._model.getValueInRange(this._selection) || void 0;
      let isMultiline = this._selection.startLineNumber !== this._selection.endLineNumber;
      if (!value && this._overtypingCapturer) {
        const info = this._overtypingCapturer.getLastOvertypedInfo(this._selectionIdx);
        if (info) {
          value = info.value;
          isMultiline = info.multiline;
        }
      }
      if (value && isMultiline && variable.snippet) {
        const line = this._model.getLineContent(this._selection.startLineNumber);
        const lineLeadingWhitespace = getLeadingWhitespace(line, 0, this._selection.startColumn - 1);
        let varLeadingWhitespace = lineLeadingWhitespace;
        variable.snippet.walk((marker) => {
          if (marker === variable) {
            return false;
          }
          if (marker instanceof Text) {
            varLeadingWhitespace = getLeadingWhitespace(splitLines(marker.value).pop());
          }
          return true;
        });
        const whitespaceCommonLength = commonPrefixLength(varLeadingWhitespace, lineLeadingWhitespace);
        value = value.replace(/(\r\n|\r|\n)(.*)/g, (m, newline, rest) => `${newline}${varLeadingWhitespace.substr(whitespaceCommonLength)}${rest}`);
      }
      return value;
    } else if (name === "TM_CURRENT_LINE") {
      return this._model.getLineContent(this._selection.positionLineNumber);
    } else if (name === "TM_CURRENT_WORD") {
      const info = this._model.getWordAtPosition({
        lineNumber: this._selection.positionLineNumber,
        column: this._selection.positionColumn
      });
      return info && info.word || void 0;
    } else if (name === "TM_LINE_INDEX") {
      return String(this._selection.positionLineNumber - 1);
    } else if (name === "TM_LINE_NUMBER") {
      return String(this._selection.positionLineNumber);
    } else if (name === "CURSOR_INDEX") {
      return String(this._selectionIdx);
    } else if (name === "CURSOR_NUMBER") {
      return String(this._selectionIdx + 1);
    }
    return void 0;
  }
};
var ModelBasedVariableResolver = class {
  constructor(_labelService, _model) {
    this._labelService = _labelService;
    this._model = _model;
  }
  resolve(variable) {
    const { name } = variable;
    if (name === "TM_FILENAME") {
      return basename(this._model.uri.fsPath);
    } else if (name === "TM_FILENAME_BASE") {
      const name2 = basename(this._model.uri.fsPath);
      const idx = name2.lastIndexOf(".");
      if (idx <= 0) {
        return name2;
      } else {
        return name2.slice(0, idx);
      }
    } else if (name === "TM_DIRECTORY") {
      if (dirname(this._model.uri.fsPath) === ".") {
        return "";
      }
      return this._labelService.getUriLabel(dirname2(this._model.uri));
    } else if (name === "TM_DIRECTORY_BASE") {
      if (dirname(this._model.uri.fsPath) === ".") {
        return "";
      }
      return basename(dirname(this._model.uri.fsPath));
    } else if (name === "TM_FILEPATH") {
      return this._labelService.getUriLabel(this._model.uri);
    } else if (name === "RELATIVE_FILEPATH") {
      return this._labelService.getUriLabel(this._model.uri, { relative: true, noPrefix: true });
    }
    return void 0;
  }
};
var ClipboardBasedVariableResolver = class {
  constructor(_readClipboardText, _selectionIdx, _selectionCount, _spread) {
    this._readClipboardText = _readClipboardText;
    this._selectionIdx = _selectionIdx;
    this._selectionCount = _selectionCount;
    this._spread = _spread;
  }
  resolve(variable) {
    if (variable.name !== "CLIPBOARD") {
      return void 0;
    }
    const clipboardText = this._readClipboardText();
    if (!clipboardText) {
      return void 0;
    }
    if (this._spread) {
      const lines = clipboardText.split(/\r\n|\n|\r/).filter((s) => !isFalsyOrWhitespace(s));
      if (lines.length === this._selectionCount) {
        return lines[this._selectionIdx];
      }
    }
    return clipboardText;
  }
};
var CommentBasedVariableResolver = class CommentBasedVariableResolver2 {
  constructor(_model, _selection, _languageConfigurationService) {
    this._model = _model;
    this._selection = _selection;
    this._languageConfigurationService = _languageConfigurationService;
  }
  resolve(variable) {
    const { name } = variable;
    const langId = this._model.getLanguageIdAtPosition(this._selection.selectionStartLineNumber, this._selection.selectionStartColumn);
    const config = this._languageConfigurationService.getLanguageConfiguration(langId).comments;
    if (!config) {
      return void 0;
    }
    if (name === "LINE_COMMENT") {
      return config.lineCommentToken || void 0;
    } else if (name === "BLOCK_COMMENT_START") {
      return config.blockCommentStartToken || void 0;
    } else if (name === "BLOCK_COMMENT_END") {
      return config.blockCommentEndToken || void 0;
    }
    return void 0;
  }
};
CommentBasedVariableResolver = __decorate2([
  __param2(2, ILanguageConfigurationService)
], CommentBasedVariableResolver);
var _TimeBasedVariableResolver = class _TimeBasedVariableResolver {
  constructor() {
    this._date = /* @__PURE__ */ new Date();
  }
  resolve(variable) {
    const { name } = variable;
    if (name === "CURRENT_YEAR") {
      return String(this._date.getFullYear());
    } else if (name === "CURRENT_YEAR_SHORT") {
      return String(this._date.getFullYear()).slice(-2);
    } else if (name === "CURRENT_MONTH") {
      return String(this._date.getMonth().valueOf() + 1).padStart(2, "0");
    } else if (name === "CURRENT_DATE") {
      return String(this._date.getDate().valueOf()).padStart(2, "0");
    } else if (name === "CURRENT_HOUR") {
      return String(this._date.getHours().valueOf()).padStart(2, "0");
    } else if (name === "CURRENT_MINUTE") {
      return String(this._date.getMinutes().valueOf()).padStart(2, "0");
    } else if (name === "CURRENT_SECOND") {
      return String(this._date.getSeconds().valueOf()).padStart(2, "0");
    } else if (name === "CURRENT_DAY_NAME") {
      return _TimeBasedVariableResolver.dayNames[this._date.getDay()];
    } else if (name === "CURRENT_DAY_NAME_SHORT") {
      return _TimeBasedVariableResolver.dayNamesShort[this._date.getDay()];
    } else if (name === "CURRENT_MONTH_NAME") {
      return _TimeBasedVariableResolver.monthNames[this._date.getMonth()];
    } else if (name === "CURRENT_MONTH_NAME_SHORT") {
      return _TimeBasedVariableResolver.monthNamesShort[this._date.getMonth()];
    } else if (name === "CURRENT_SECONDS_UNIX") {
      return String(Math.floor(this._date.getTime() / 1e3));
    } else if (name === "CURRENT_TIMEZONE_OFFSET") {
      const rawTimeOffset = this._date.getTimezoneOffset();
      const sign = rawTimeOffset > 0 ? "-" : "+";
      const hours = Math.trunc(Math.abs(rawTimeOffset / 60));
      const hoursString = hours < 10 ? "0" + hours : hours;
      const minutes = Math.abs(rawTimeOffset) - hours * 60;
      const minutesString = minutes < 10 ? "0" + minutes : minutes;
      return sign + hoursString + ":" + minutesString;
    }
    return void 0;
  }
};
_TimeBasedVariableResolver.dayNames = [localize(1406, "Sunday"), localize(1407, "Monday"), localize(1408, "Tuesday"), localize(1409, "Wednesday"), localize(1410, "Thursday"), localize(1411, "Friday"), localize(1412, "Saturday")];
_TimeBasedVariableResolver.dayNamesShort = [localize(1413, "Sun"), localize(1414, "Mon"), localize(1415, "Tue"), localize(1416, "Wed"), localize(1417, "Thu"), localize(1418, "Fri"), localize(1419, "Sat")];
_TimeBasedVariableResolver.monthNames = [localize(1420, "January"), localize(1421, "February"), localize(1422, "March"), localize(1423, "April"), localize(1424, "May"), localize(1425, "June"), localize(1426, "July"), localize(1427, "August"), localize(1428, "September"), localize(1429, "October"), localize(1430, "November"), localize(1431, "December")];
_TimeBasedVariableResolver.monthNamesShort = [localize(1432, "Jan"), localize(1433, "Feb"), localize(1434, "Mar"), localize(1435, "Apr"), localize(1436, "May"), localize(1437, "Jun"), localize(1438, "Jul"), localize(1439, "Aug"), localize(1440, "Sep"), localize(1441, "Oct"), localize(1442, "Nov"), localize(1443, "Dec")];
var TimeBasedVariableResolver = _TimeBasedVariableResolver;
var WorkspaceBasedVariableResolver = class {
  constructor(_workspaceService) {
    this._workspaceService = _workspaceService;
  }
  resolve(variable) {
    if (!this._workspaceService) {
      return void 0;
    }
    const workspaceIdentifier = toWorkspaceIdentifier(this._workspaceService.getWorkspace());
    if (isEmptyWorkspaceIdentifier(workspaceIdentifier)) {
      return void 0;
    }
    if (variable.name === "WORKSPACE_NAME") {
      return this._resolveWorkspaceName(workspaceIdentifier);
    } else if (variable.name === "WORKSPACE_FOLDER") {
      return this._resoveWorkspacePath(workspaceIdentifier);
    }
    return void 0;
  }
  _resolveWorkspaceName(workspaceIdentifier) {
    if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
      return basename(workspaceIdentifier.uri.path);
    }
    let filename = basename(workspaceIdentifier.configPath.path);
    if (filename.endsWith(WORKSPACE_EXTENSION)) {
      filename = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
    }
    return filename;
  }
  _resoveWorkspacePath(workspaceIdentifier) {
    if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
      return normalizeDriveLetter(workspaceIdentifier.uri.fsPath);
    }
    const filename = basename(workspaceIdentifier.configPath.path);
    let folderpath = workspaceIdentifier.configPath.fsPath;
    if (folderpath.endsWith(filename)) {
      folderpath = folderpath.substr(0, folderpath.length - filename.length - 1);
    }
    return folderpath ? normalizeDriveLetter(folderpath) : "/";
  }
};
var RandomBasedVariableResolver = class {
  resolve(variable) {
    const { name } = variable;
    if (name === "RANDOM") {
      return Math.random().toString().slice(-6);
    } else if (name === "RANDOM_HEX") {
      return Math.random().toString(16).slice(-6);
    } else if (name === "UUID") {
      return generateUuid();
    }
    return void 0;
  }
};

// node_modules/monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetSession.js
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param3 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SnippetSession_1;
var _OneSnippet = class _OneSnippet {
  constructor(_editor, _snippet, _snippetLineLeadingWhitespace) {
    this._editor = _editor;
    this._snippet = _snippet;
    this._snippetLineLeadingWhitespace = _snippetLineLeadingWhitespace;
    this._offset = -1;
    this._nestingLevel = 1;
    this._placeholderGroups = groupBy(_snippet.placeholders, Placeholder.compareByIndex);
    this._placeholderGroupsIdx = -1;
  }
  initialize(textChange) {
    this._offset = textChange.newPosition;
  }
  dispose() {
    if (this._placeholderDecorations) {
      this._editor.removeDecorations([...this._placeholderDecorations.values()]);
    }
    this._placeholderGroups.length = 0;
  }
  _initDecorations() {
    if (this._offset === -1) {
      throw new Error(`Snippet not initialized!`);
    }
    if (this._placeholderDecorations) {
      return;
    }
    this._placeholderDecorations = /* @__PURE__ */ new Map();
    const model = this._editor.getModel();
    this._editor.changeDecorations((accessor) => {
      for (const placeholder of this._snippet.placeholders) {
        const placeholderOffset = this._snippet.offset(placeholder);
        const placeholderLen = this._snippet.fullLen(placeholder);
        const range = Range.fromPositions(model.getPositionAt(this._offset + placeholderOffset), model.getPositionAt(this._offset + placeholderOffset + placeholderLen));
        const options = placeholder.isFinalTabstop ? _OneSnippet._decor.inactiveFinal : _OneSnippet._decor.inactive;
        const handle = accessor.addDecoration(range, options);
        this._placeholderDecorations.set(placeholder, handle);
      }
    });
  }
  move(fwd) {
    if (!this._editor.hasModel()) {
      return [];
    }
    this._initDecorations();
    if (this._placeholderGroupsIdx >= 0) {
      const operations = [];
      for (const placeholder of this._placeholderGroups[this._placeholderGroupsIdx]) {
        if (placeholder.transform) {
          const id = this._placeholderDecorations.get(placeholder);
          const range = this._editor.getModel().getDecorationRange(id);
          const currentValue = this._editor.getModel().getValueInRange(range);
          const transformedValueLines = placeholder.transform.resolve(currentValue).split(/\r\n|\r|\n/);
          for (let i = 1; i < transformedValueLines.length; i++) {
            transformedValueLines[i] = this._editor.getModel().normalizeIndentation(this._snippetLineLeadingWhitespace + transformedValueLines[i]);
          }
          operations.push(EditOperation.replace(range, transformedValueLines.join(this._editor.getModel().getEOL())));
        }
      }
      if (operations.length > 0) {
        this._editor.executeEdits("snippet.placeholderTransform", operations);
      }
    }
    let couldSkipThisPlaceholder = false;
    if (fwd === true && this._placeholderGroupsIdx < this._placeholderGroups.length - 1) {
      this._placeholderGroupsIdx += 1;
      couldSkipThisPlaceholder = true;
    } else if (fwd === false && this._placeholderGroupsIdx > 0) {
      this._placeholderGroupsIdx -= 1;
      couldSkipThisPlaceholder = true;
    } else ;
    const newSelections = this._editor.getModel().changeDecorations((accessor) => {
      const activePlaceholders = /* @__PURE__ */ new Set();
      const selections = [];
      for (const placeholder of this._placeholderGroups[this._placeholderGroupsIdx]) {
        const id = this._placeholderDecorations.get(placeholder);
        const range = this._editor.getModel().getDecorationRange(id);
        selections.push(new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn));
        couldSkipThisPlaceholder = couldSkipThisPlaceholder && this._hasPlaceholderBeenCollapsed(placeholder);
        accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? _OneSnippet._decor.activeFinal : _OneSnippet._decor.active);
        activePlaceholders.add(placeholder);
        for (const enclosingPlaceholder of this._snippet.enclosingPlaceholders(placeholder)) {
          const id2 = this._placeholderDecorations.get(enclosingPlaceholder);
          accessor.changeDecorationOptions(id2, enclosingPlaceholder.isFinalTabstop ? _OneSnippet._decor.activeFinal : _OneSnippet._decor.active);
          activePlaceholders.add(enclosingPlaceholder);
        }
      }
      for (const [placeholder, id] of this._placeholderDecorations) {
        if (!activePlaceholders.has(placeholder)) {
          accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? _OneSnippet._decor.inactiveFinal : _OneSnippet._decor.inactive);
        }
      }
      return selections;
    });
    return !couldSkipThisPlaceholder ? newSelections ?? [] : this.move(fwd);
  }
  _hasPlaceholderBeenCollapsed(placeholder) {
    let marker = placeholder;
    while (marker) {
      if (marker instanceof Placeholder) {
        const id = this._placeholderDecorations.get(marker);
        const range = this._editor.getModel().getDecorationRange(id);
        if (range.isEmpty() && marker.toString().length > 0) {
          return true;
        }
      }
      marker = marker.parent;
    }
    return false;
  }
  get isAtFirstPlaceholder() {
    return this._placeholderGroupsIdx <= 0 || this._placeholderGroups.length === 0;
  }
  get isAtLastPlaceholder() {
    return this._placeholderGroupsIdx === this._placeholderGroups.length - 1;
  }
  get hasPlaceholder() {
    return this._snippet.placeholders.length > 0;
  }
  /**
   * A snippet is trivial when it has no placeholder or only a final placeholder at
   * its very end
   */
  get isTrivialSnippet() {
    if (this._snippet.placeholders.length === 0) {
      return true;
    }
    if (this._snippet.placeholders.length === 1) {
      const [placeholder] = this._snippet.placeholders;
      if (placeholder.isFinalTabstop) {
        if (this._snippet.rightMostDescendant === placeholder) {
          return true;
        }
      }
    }
    return false;
  }
  computePossibleSelections() {
    const result = /* @__PURE__ */ new Map();
    for (const placeholdersWithEqualIndex of this._placeholderGroups) {
      let ranges;
      for (const placeholder of placeholdersWithEqualIndex) {
        if (placeholder.isFinalTabstop) {
          break;
        }
        if (!ranges) {
          ranges = [];
          result.set(placeholder.index, ranges);
        }
        const id = this._placeholderDecorations.get(placeholder);
        const range = this._editor.getModel().getDecorationRange(id);
        if (!range) {
          result.delete(placeholder.index);
          break;
        }
        ranges.push(range);
      }
    }
    return result;
  }
  get activeChoice() {
    if (!this._placeholderDecorations) {
      return void 0;
    }
    const placeholder = this._placeholderGroups[this._placeholderGroupsIdx][0];
    if (!placeholder?.choice) {
      return void 0;
    }
    const id = this._placeholderDecorations.get(placeholder);
    if (!id) {
      return void 0;
    }
    const range = this._editor.getModel().getDecorationRange(id);
    if (!range) {
      return void 0;
    }
    return { range, choice: placeholder.choice };
  }
  get hasChoice() {
    let result = false;
    this._snippet.walk((marker) => {
      result = marker instanceof Choice;
      return !result;
    });
    return result;
  }
  merge(others) {
    const model = this._editor.getModel();
    this._nestingLevel *= 10;
    this._editor.changeDecorations((accessor) => {
      for (const placeholder of this._placeholderGroups[this._placeholderGroupsIdx]) {
        const nested = others.shift();
        console.assert(nested._offset !== -1);
        console.assert(!nested._placeholderDecorations);
        const indexLastPlaceholder = nested._snippet.placeholderInfo.last.index;
        for (const nestedPlaceholder of nested._snippet.placeholderInfo.all) {
          if (nestedPlaceholder.isFinalTabstop) {
            nestedPlaceholder.index = placeholder.index + (indexLastPlaceholder + 1) / this._nestingLevel;
          } else {
            nestedPlaceholder.index = placeholder.index + nestedPlaceholder.index / this._nestingLevel;
          }
        }
        this._snippet.replace(placeholder, nested._snippet.children);
        const id = this._placeholderDecorations.get(placeholder);
        accessor.removeDecoration(id);
        this._placeholderDecorations.delete(placeholder);
        for (const placeholder2 of nested._snippet.placeholders) {
          const placeholderOffset = nested._snippet.offset(placeholder2);
          const placeholderLen = nested._snippet.fullLen(placeholder2);
          const range = Range.fromPositions(model.getPositionAt(nested._offset + placeholderOffset), model.getPositionAt(nested._offset + placeholderOffset + placeholderLen));
          const handle = accessor.addDecoration(range, _OneSnippet._decor.inactive);
          this._placeholderDecorations.set(placeholder2, handle);
        }
      }
      this._placeholderGroups = groupBy(this._snippet.placeholders, Placeholder.compareByIndex);
    });
  }
};
_OneSnippet._decor = {
  active: ModelDecorationOptions.register({ description: "snippet-placeholder-1", stickiness: 0, className: "snippet-placeholder" }),
  inactive: ModelDecorationOptions.register({ description: "snippet-placeholder-2", stickiness: 1, className: "snippet-placeholder" }),
  activeFinal: ModelDecorationOptions.register({ description: "snippet-placeholder-3", stickiness: 1, className: "finish-snippet-placeholder" }),
  inactiveFinal: ModelDecorationOptions.register({ description: "snippet-placeholder-4", stickiness: 1, className: "finish-snippet-placeholder" })
};
var OneSnippet = _OneSnippet;
var _defaultOptions = {
  overwriteBefore: 0,
  overwriteAfter: 0,
  adjustWhitespace: true,
  clipboardText: void 0,
  overtypingCapturer: void 0
};
var SnippetSession = SnippetSession_1 = class SnippetSession2 {
  static adjustWhitespace(model, position, adjustIndentation, snippet, filter) {
    const line = model.getLineContent(position.lineNumber);
    const lineLeadingWhitespace = getLeadingWhitespace(line, 0, position.column - 1);
    let snippetTextString;
    snippet.walk((marker) => {
      if (!(marker instanceof Text) || marker.parent instanceof Choice) {
        return true;
      }
      if (filter && !filter.has(marker)) {
        return true;
      }
      const lines = marker.value.split(/\r\n|\r|\n/);
      if (adjustIndentation) {
        const offset = snippet.offset(marker);
        if (offset === 0) {
          lines[0] = model.normalizeIndentation(lines[0]);
        } else {
          snippetTextString = snippetTextString ?? snippet.toString();
          const prevChar = snippetTextString.charCodeAt(offset - 1);
          if (prevChar === 10 || prevChar === 13) {
            lines[0] = model.normalizeIndentation(lineLeadingWhitespace + lines[0]);
          }
        }
        for (let i = 1; i < lines.length; i++) {
          lines[i] = model.normalizeIndentation(lineLeadingWhitespace + lines[i]);
        }
      }
      const newValue = lines.join(model.getEOL());
      if (newValue !== marker.value) {
        marker.parent.replace(marker, [new Text(newValue)]);
        snippetTextString = void 0;
      }
      return true;
    });
    return lineLeadingWhitespace;
  }
  static adjustSelection(model, selection, overwriteBefore, overwriteAfter) {
    if (overwriteBefore !== 0 || overwriteAfter !== 0) {
      const { positionLineNumber, positionColumn } = selection;
      const positionColumnBefore = positionColumn - overwriteBefore;
      const positionColumnAfter = positionColumn + overwriteAfter;
      const range = model.validateRange({
        startLineNumber: positionLineNumber,
        startColumn: positionColumnBefore,
        endLineNumber: positionLineNumber,
        endColumn: positionColumnAfter
      });
      selection = Selection.createWithDirection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn, selection.getDirection());
    }
    return selection;
  }
  static createEditsAndSnippetsFromSelections(editor, template, overwriteBefore, overwriteAfter, enforceFinalTabstop, adjustWhitespace, clipboardText, overtypingCapturer, languageConfigurationService) {
    const edits = [];
    const snippets = [];
    if (!editor.hasModel()) {
      return { edits, snippets };
    }
    const model = editor.getModel();
    const workspaceService = editor.invokeWithinContext((accessor) => accessor.get(IWorkspaceContextService));
    const modelBasedVariableResolver = editor.invokeWithinContext((accessor) => new ModelBasedVariableResolver(accessor.get(ILabelService), model));
    const readClipboardText = () => clipboardText;
    const firstBeforeText = model.getValueInRange(SnippetSession_1.adjustSelection(model, editor.getSelection(), overwriteBefore, 0));
    const firstAfterText = model.getValueInRange(SnippetSession_1.adjustSelection(model, editor.getSelection(), 0, overwriteAfter));
    const firstLineFirstNonWhitespace = model.getLineFirstNonWhitespaceColumn(editor.getSelection().positionLineNumber);
    const indexedSelections = editor.getSelections().map((selection, idx) => ({ selection, idx })).sort((a, b) => Range.compareRangesUsingStarts(a.selection, b.selection));
    for (const { selection, idx } of indexedSelections) {
      let extensionBefore = SnippetSession_1.adjustSelection(model, selection, overwriteBefore, 0);
      let extensionAfter = SnippetSession_1.adjustSelection(model, selection, 0, overwriteAfter);
      if (firstBeforeText !== model.getValueInRange(extensionBefore)) {
        extensionBefore = selection;
      }
      if (firstAfterText !== model.getValueInRange(extensionAfter)) {
        extensionAfter = selection;
      }
      const snippetSelection = selection.setStartPosition(extensionBefore.startLineNumber, extensionBefore.startColumn).setEndPosition(extensionAfter.endLineNumber, extensionAfter.endColumn);
      const snippet = new SnippetParser().parse(template, true, enforceFinalTabstop);
      const start = snippetSelection.getStartPosition();
      const snippetLineLeadingWhitespace = SnippetSession_1.adjustWhitespace(model, start, adjustWhitespace || idx > 0 && firstLineFirstNonWhitespace !== model.getLineFirstNonWhitespaceColumn(selection.positionLineNumber), snippet);
      snippet.resolveVariables(new CompositeSnippetVariableResolver([
        modelBasedVariableResolver,
        new ClipboardBasedVariableResolver(readClipboardText, idx, indexedSelections.length, editor.getOption(
          88
          /* EditorOption.multiCursorPaste */
        ) === "spread"),
        new SelectionBasedVariableResolver(model, selection, idx, overtypingCapturer),
        new CommentBasedVariableResolver(model, selection, languageConfigurationService),
        new TimeBasedVariableResolver(),
        new WorkspaceBasedVariableResolver(workspaceService),
        new RandomBasedVariableResolver()
      ]));
      edits[idx] = EditOperation.replace(snippetSelection, snippet.toString());
      edits[idx].identifier = { major: idx, minor: 0 };
      edits[idx]._isTracked = true;
      snippets[idx] = new OneSnippet(editor, snippet, snippetLineLeadingWhitespace);
    }
    return { edits, snippets };
  }
  static createEditsAndSnippetsFromEdits(editor, snippetEdits, enforceFinalTabstop, adjustWhitespace, clipboardText, overtypingCapturer, languageConfigurationService) {
    if (!editor.hasModel() || snippetEdits.length === 0) {
      return { edits: [], snippets: [] };
    }
    const edits = [];
    const model = editor.getModel();
    const parser = new SnippetParser();
    const snippet = new TextmateSnippet();
    const resolver = new CompositeSnippetVariableResolver([
      editor.invokeWithinContext((accessor) => new ModelBasedVariableResolver(accessor.get(ILabelService), model)),
      new ClipboardBasedVariableResolver(() => clipboardText, 0, editor.getSelections().length, editor.getOption(
        88
        /* EditorOption.multiCursorPaste */
      ) === "spread"),
      new SelectionBasedVariableResolver(model, editor.getSelection(), 0, overtypingCapturer),
      new CommentBasedVariableResolver(model, editor.getSelection(), languageConfigurationService),
      new TimeBasedVariableResolver(),
      new WorkspaceBasedVariableResolver(editor.invokeWithinContext((accessor) => accessor.get(IWorkspaceContextService))),
      new RandomBasedVariableResolver()
    ]);
    snippetEdits = snippetEdits.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
    let offset = 0;
    for (let i = 0; i < snippetEdits.length; i++) {
      const { range, template, keepWhitespace } = snippetEdits[i];
      if (i > 0) {
        const lastRange = snippetEdits[i - 1].range;
        const textRange = Range.fromPositions(lastRange.getEndPosition(), range.getStartPosition());
        const textNode = new Text(model.getValueInRange(textRange));
        snippet.appendChild(textNode);
        offset += textNode.value.length;
      }
      const newNodes = parser.parseFragment(template, snippet);
      SnippetSession_1.adjustWhitespace(model, range.getStartPosition(), keepWhitespace !== void 0 ? !keepWhitespace : adjustWhitespace, snippet, new Set(newNodes));
      snippet.resolveVariables(resolver);
      const snippetText = snippet.toString();
      const snippetFragmentText = snippetText.slice(offset);
      offset = snippetText.length;
      const edit = EditOperation.replace(range, snippetFragmentText);
      edit.identifier = { major: i, minor: 0 };
      edit._isTracked = true;
      edits.push(edit);
    }
    parser.ensureFinalTabstop(snippet, enforceFinalTabstop, true);
    return {
      edits,
      snippets: [new OneSnippet(editor, snippet, "")]
    };
  }
  constructor(_editor, _template, _options = _defaultOptions, _languageConfigurationService) {
    this._editor = _editor;
    this._template = _template;
    this._options = _options;
    this._languageConfigurationService = _languageConfigurationService;
    this._templateMerges = [];
    this._snippets = [];
  }
  dispose() {
    dispose(this._snippets);
  }
  _logInfo() {
    return `template="${this._template}", merged_templates="${this._templateMerges.join(" -> ")}"`;
  }
  insert(editReason) {
    if (!this._editor.hasModel()) {
      return;
    }
    const { edits, snippets } = typeof this._template === "string" ? SnippetSession_1.createEditsAndSnippetsFromSelections(this._editor, this._template, this._options.overwriteBefore, this._options.overwriteAfter, false, this._options.adjustWhitespace, this._options.clipboardText, this._options.overtypingCapturer, this._languageConfigurationService) : SnippetSession_1.createEditsAndSnippetsFromEdits(this._editor, this._template, false, this._options.adjustWhitespace, this._options.clipboardText, this._options.overtypingCapturer, this._languageConfigurationService);
    this._snippets = snippets;
    this._editor.executeEdits(editReason ?? EditSources.snippet(), edits, (_undoEdits) => {
      const undoEdits = _undoEdits.filter((edit) => !!edit.identifier);
      for (let idx = 0; idx < snippets.length; idx++) {
        snippets[idx].initialize(undoEdits[idx].textChange);
      }
      if (this._snippets[0].hasPlaceholder) {
        return this._move(true);
      } else {
        return undoEdits.map((edit) => Selection.fromPositions(edit.range.getEndPosition()));
      }
    });
    this._editor.revealRange(this._editor.getSelections()[0]);
  }
  merge(template, options = _defaultOptions) {
    if (!this._editor.hasModel()) {
      return;
    }
    this._templateMerges.push([this._snippets[0]._nestingLevel, this._snippets[0]._placeholderGroupsIdx, template]);
    const { edits, snippets } = SnippetSession_1.createEditsAndSnippetsFromSelections(this._editor, template, options.overwriteBefore, options.overwriteAfter, true, options.adjustWhitespace, options.clipboardText, options.overtypingCapturer, this._languageConfigurationService);
    this._editor.executeEdits("snippet", edits, (_undoEdits) => {
      const undoEdits = _undoEdits.filter((edit) => !!edit.identifier);
      for (let idx = 0; idx < snippets.length; idx++) {
        snippets[idx].initialize(undoEdits[idx].textChange);
      }
      const isTrivialSnippet = snippets[0].isTrivialSnippet;
      if (!isTrivialSnippet) {
        for (const snippet of this._snippets) {
          snippet.merge(snippets);
        }
        console.assert(snippets.length === 0);
      }
      if (this._snippets[0].hasPlaceholder && !isTrivialSnippet) {
        return this._move(void 0);
      } else {
        return undoEdits.map((edit) => Selection.fromPositions(edit.range.getEndPosition()));
      }
    });
  }
  next() {
    const newSelections = this._move(true);
    this._editor.setSelections(newSelections);
    this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
  }
  prev() {
    const newSelections = this._move(false);
    this._editor.setSelections(newSelections);
    this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
  }
  _move(fwd) {
    const selections = [];
    for (const snippet of this._snippets) {
      const oneSelection = snippet.move(fwd);
      selections.push(...oneSelection);
    }
    return selections;
  }
  get isAtFirstPlaceholder() {
    return this._snippets[0].isAtFirstPlaceholder;
  }
  get isAtLastPlaceholder() {
    return this._snippets[0].isAtLastPlaceholder;
  }
  get hasPlaceholder() {
    return this._snippets[0].hasPlaceholder;
  }
  get hasChoice() {
    return this._snippets[0].hasChoice;
  }
  get activeChoice() {
    return this._snippets[0].activeChoice;
  }
  isSelectionWithinPlaceholders() {
    if (!this.hasPlaceholder) {
      return false;
    }
    const selections = this._editor.getSelections();
    if (selections.length < this._snippets.length) {
      return false;
    }
    const allPossibleSelections = /* @__PURE__ */ new Map();
    for (const snippet of this._snippets) {
      const possibleSelections = snippet.computePossibleSelections();
      if (allPossibleSelections.size === 0) {
        for (const [index, ranges] of possibleSelections) {
          ranges.sort(Range.compareRangesUsingStarts);
          for (const selection of selections) {
            if (ranges[0].containsRange(selection)) {
              allPossibleSelections.set(index, []);
              break;
            }
          }
        }
      }
      if (allPossibleSelections.size === 0) {
        return false;
      }
      allPossibleSelections.forEach((array, index) => {
        array.push(...possibleSelections.get(index));
      });
    }
    selections.sort(Range.compareRangesUsingStarts);
    for (const [index, ranges] of allPossibleSelections) {
      if (ranges.length !== selections.length) {
        allPossibleSelections.delete(index);
        continue;
      }
      ranges.sort(Range.compareRangesUsingStarts);
      for (let i = 0; i < ranges.length; i++) {
        if (!ranges[i].containsRange(selections[i])) {
          allPossibleSelections.delete(index);
          continue;
        }
      }
    }
    return allPossibleSelections.size > 0;
  }
};
SnippetSession = SnippetSession_1 = __decorate3([
  __param3(3, ILanguageConfigurationService)
], SnippetSession);

// node_modules/monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2.js
var __decorate4 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param4 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SnippetController2_1;
var _defaultOptions2 = {
  overwriteBefore: 0,
  overwriteAfter: 0,
  undoStopBefore: true,
  undoStopAfter: true,
  adjustWhitespace: true,
  clipboardText: void 0,
  overtypingCapturer: void 0
};
var _a;
var SnippetController2 = (_a = class {
  static get(editor) {
    return editor.getContribution(SnippetController2_1.ID);
  }
  constructor(_editor, _logService, _languageFeaturesService, contextKeyService, _languageConfigurationService) {
    this._editor = _editor;
    this._logService = _logService;
    this._languageFeaturesService = _languageFeaturesService;
    this._languageConfigurationService = _languageConfigurationService;
    this._inSnippetObservable = observableValue(this, false);
    this._snippetListener = new DisposableStore();
    this._modelVersionId = -1;
    this._inSnippet = SnippetController2_1.InSnippetMode.bindTo(contextKeyService);
    this._hasNextTabstop = SnippetController2_1.HasNextTabstop.bindTo(contextKeyService);
    this._hasPrevTabstop = SnippetController2_1.HasPrevTabstop.bindTo(contextKeyService);
  }
  dispose() {
    this._inSnippet.reset();
    this._inSnippetObservable.set(false, void 0);
    this._hasPrevTabstop.reset();
    this._hasNextTabstop.reset();
    this._session?.dispose();
    this._snippetListener.dispose();
  }
  insert(template, opts) {
    try {
      this._doInsert(template, typeof opts === "undefined" ? _defaultOptions2 : { ..._defaultOptions2, ...opts });
    } catch (e) {
      this.cancel();
      this._logService.error(e);
      this._logService.error("snippet_error");
      this._logService.error("insert_template=", template);
      this._logService.error("existing_template=", this._session ? this._session._logInfo() : "<no_session>");
    }
  }
  _doInsert(template, opts) {
    if (!this._editor.hasModel()) {
      return;
    }
    this._snippetListener.clear();
    if (opts.undoStopBefore) {
      this._editor.getModel().pushStackElement();
    }
    if (this._session && typeof template !== "string") {
      this.cancel();
    }
    if (!this._session) {
      this._modelVersionId = this._editor.getModel().getAlternativeVersionId();
      this._session = new SnippetSession(this._editor, template, opts, this._languageConfigurationService);
      this._session.insert(opts.reason);
    } else {
      assertType(typeof template === "string");
      this._session.merge(template, opts);
    }
    if (opts.undoStopAfter) {
      this._editor.getModel().pushStackElement();
    }
    if (this._session?.hasChoice) {
      const provider = {
        _debugDisplayName: "snippetChoiceCompletions",
        provideCompletionItems: (model2, position) => {
          if (!this._session || model2 !== this._editor.getModel() || !Position.equals(this._editor.getPosition(), position)) {
            return void 0;
          }
          const { activeChoice } = this._session;
          if (!activeChoice || activeChoice.choice.options.length === 0) {
            return void 0;
          }
          const word = model2.getValueInRange(activeChoice.range);
          const isAnyOfOptions = Boolean(activeChoice.choice.options.find((o) => o.value === word));
          const suggestions = [];
          for (let i = 0; i < activeChoice.choice.options.length; i++) {
            const option = activeChoice.choice.options[i];
            suggestions.push({
              kind: 13,
              label: option.value,
              insertText: option.value,
              sortText: "a".repeat(i + 1),
              range: activeChoice.range,
              filterText: isAnyOfOptions ? `${word}_${option.value}` : void 0,
              command: { id: "jumpToNextSnippetPlaceholder", title: localize(1405, "Go to next placeholder...") }
            });
          }
          return { suggestions };
        }
      };
      const model = this._editor.getModel();
      let registration;
      let isRegistered2 = false;
      const disable = () => {
        registration?.dispose();
        isRegistered2 = false;
      };
      const enable = () => {
        if (!isRegistered2) {
          registration = this._languageFeaturesService.completionProvider.register({
            language: model.getLanguageId(),
            pattern: model.uri.fsPath,
            scheme: model.uri.scheme,
            exclusive: true
          }, provider);
          this._snippetListener.add(registration);
          isRegistered2 = true;
        }
      };
      this._choiceCompletions = { provider, enable, disable };
    }
    this._updateState();
    this._snippetListener.add(this._editor.onDidChangeModelContent((e) => e.isFlush && this.cancel()));
    this._snippetListener.add(this._editor.onDidChangeModel(() => this.cancel()));
    this._snippetListener.add(this._editor.onDidChangeCursorSelection(() => this._updateState()));
  }
  _updateState() {
    if (!this._session || !this._editor.hasModel()) {
      return;
    }
    if (this._modelVersionId === this._editor.getModel().getAlternativeVersionId()) {
      return this.cancel();
    }
    if (!this._session.hasPlaceholder) {
      return this.cancel();
    }
    if (this._session.isAtLastPlaceholder || !this._session.isSelectionWithinPlaceholders()) {
      this._editor.getModel().pushStackElement();
      return this.cancel();
    }
    this._inSnippet.set(true);
    this._inSnippetObservable.set(true, void 0);
    this._hasPrevTabstop.set(!this._session.isAtFirstPlaceholder);
    this._hasNextTabstop.set(!this._session.isAtLastPlaceholder);
    this._handleChoice();
  }
  _handleChoice() {
    if (!this._session || !this._editor.hasModel()) {
      this._currentChoice = void 0;
      return;
    }
    const { activeChoice } = this._session;
    if (!activeChoice || !this._choiceCompletions) {
      this._choiceCompletions?.disable();
      this._currentChoice = void 0;
      return;
    }
    if (this._currentChoice !== activeChoice.choice) {
      this._currentChoice = activeChoice.choice;
      this._choiceCompletions.enable();
      queueMicrotask(() => {
        showSimpleSuggestions(this._editor, this._choiceCompletions.provider);
      });
    }
  }
  finish() {
    while (this._inSnippet.get()) {
      this.next();
    }
  }
  cancel(resetSelection = false) {
    this._inSnippet.reset();
    this._inSnippetObservable.set(false, void 0);
    this._hasPrevTabstop.reset();
    this._hasNextTabstop.reset();
    this._snippetListener.clear();
    this._currentChoice = void 0;
    this._session?.dispose();
    this._session = void 0;
    this._modelVersionId = -1;
    if (resetSelection) {
      this._editor.setSelections([this._editor.getSelection()]);
    }
  }
  prev() {
    this._session?.prev();
    this._updateState();
  }
  next() {
    this._session?.next();
    this._updateState();
  }
  isInSnippet() {
    return Boolean(this._inSnippet.get());
  }
  get isInSnippetObservable() {
    return this._inSnippetObservable;
  }
}, SnippetController2_1 = _a, _a.ID = "snippetController2", _a.InSnippetMode = new RawContextKey("inSnippetMode", false, localize(1402, "Whether the editor in current in snippet mode")), _a.HasNextTabstop = new RawContextKey("hasNextTabstop", false, localize(1403, "Whether there is a next tab stop when in snippet mode")), _a.HasPrevTabstop = new RawContextKey("hasPrevTabstop", false, localize(1404, "Whether there is a previous tab stop when in snippet mode")), _a);
SnippetController2 = SnippetController2_1 = __decorate4([
  __param4(1, ILogService),
  __param4(2, ILanguageFeaturesService),
  __param4(3, IContextKeyService),
  __param4(4, ILanguageConfigurationService)
], SnippetController2);
registerEditorContribution(
  SnippetController2.ID,
  SnippetController2,
  4
  /* EditorContributionInstantiation.Lazy */
);
var CommandCtor = EditorCommand.bindToContribution(SnippetController2.get);
registerEditorCommand(new CommandCtor({
  id: "jumpToNextSnippetPlaceholder",
  precondition: ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasNextTabstop),
  handler: (ctrl) => ctrl.next(),
  kbOpts: {
    weight: 100 + 30,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 2
    /* KeyCode.Tab */
  }
}));
registerEditorCommand(new CommandCtor({
  id: "jumpToPrevSnippetPlaceholder",
  precondition: ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasPrevTabstop),
  handler: (ctrl) => ctrl.prev(),
  kbOpts: {
    weight: 100 + 30,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 1024 | 2
    /* KeyCode.Tab */
  }
}));
registerEditorCommand(new CommandCtor({
  id: "leaveSnippet",
  precondition: SnippetController2.InSnippetMode,
  handler: (ctrl) => ctrl.cancel(true),
  kbOpts: {
    weight: 100 + 30,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 9,
    secondary: [
      1024 | 9
      /* KeyCode.Escape */
    ]
  }
}));
registerEditorCommand(new CommandCtor({
  id: "acceptSnippet",
  precondition: SnippetController2.InSnippetMode,
  handler: (ctrl) => ctrl.finish()
  // kbOpts: {
  // 	weight: KeybindingWeight.EditorContrib + 30,
  // 	kbExpr: EditorContextKeys.textFocus,
  // 	primary: KeyCode.Enter,
  // }
}));

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestMemory.js
var __decorate5 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param5 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SuggestMemoryService_1;
var Memory = class {
  constructor(name) {
    this.name = name;
  }
  select(model, pos, items) {
    if (items.length === 0) {
      return 0;
    }
    const topScore = items[0].score[0];
    for (let i = 0; i < items.length; i++) {
      const { score, completion: suggestion } = items[i];
      if (score[0] !== topScore) {
        break;
      }
      if (suggestion.preselect) {
        return i;
      }
    }
    return 0;
  }
};
var NoMemory = class extends Memory {
  constructor() {
    super("first");
  }
  memorize(model, pos, item) {
  }
  toJSON() {
    return void 0;
  }
  fromJSON() {
  }
};
var LRUMemory = class extends Memory {
  constructor() {
    super("recentlyUsed");
    this._cache = new LRUCache(300, 0.66);
    this._seq = 0;
  }
  memorize(model, pos, item) {
    const key = `${model.getLanguageId()}/${item.textLabel}`;
    this._cache.set(key, {
      touch: this._seq++,
      type: item.completion.kind,
      insertText: item.completion.insertText
    });
  }
  select(model, pos, items) {
    if (items.length === 0) {
      return 0;
    }
    const lineSuffix = model.getLineContent(pos.lineNumber).substr(pos.column - 10, pos.column - 1);
    if (/\s$/.test(lineSuffix)) {
      return super.select(model, pos, items);
    }
    const topScore = items[0].score[0];
    let indexPreselect = -1;
    let indexRecency = -1;
    let seq = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].score[0] !== topScore) {
        break;
      }
      const key = `${model.getLanguageId()}/${items[i].textLabel}`;
      const item = this._cache.peek(key);
      if (item && item.touch > seq && item.type === items[i].completion.kind && item.insertText === items[i].completion.insertText) {
        seq = item.touch;
        indexRecency = i;
      }
      if (items[i].completion.preselect && indexPreselect === -1) {
        return indexPreselect = i;
      }
    }
    if (indexRecency !== -1) {
      return indexRecency;
    } else if (indexPreselect !== -1) {
      return indexPreselect;
    } else {
      return 0;
    }
  }
  toJSON() {
    return this._cache.toJSON();
  }
  fromJSON(data) {
    this._cache.clear();
    const seq = 0;
    for (const [key, value] of data) {
      value.touch = seq;
      value.type = typeof value.type === "number" ? value.type : CompletionItemKinds.fromString(value.type);
      this._cache.set(key, value);
    }
    this._seq = this._cache.size;
  }
};
var PrefixMemory = class extends Memory {
  constructor() {
    super("recentlyUsedByPrefix");
    this._trie = TernarySearchTree.forStrings();
    this._seq = 0;
  }
  memorize(model, pos, item) {
    const { word } = model.getWordUntilPosition(pos);
    const key = `${model.getLanguageId()}/${word}`;
    this._trie.set(key, {
      type: item.completion.kind,
      insertText: item.completion.insertText,
      touch: this._seq++
    });
  }
  select(model, pos, items) {
    const { word } = model.getWordUntilPosition(pos);
    if (!word) {
      return super.select(model, pos, items);
    }
    const key = `${model.getLanguageId()}/${word}`;
    let item = this._trie.get(key);
    if (!item) {
      item = this._trie.findSubstr(key);
    }
    if (item) {
      for (let i = 0; i < items.length; i++) {
        const { kind, insertText } = items[i].completion;
        if (kind === item.type && insertText === item.insertText) {
          return i;
        }
      }
    }
    return super.select(model, pos, items);
  }
  toJSON() {
    const entries = [];
    this._trie.forEach((value, key) => entries.push([key, value]));
    entries.sort((a, b) => -(a[1].touch - b[1].touch)).forEach((value, i) => value[1].touch = i);
    return entries.slice(0, 200);
  }
  fromJSON(data) {
    this._trie.clear();
    if (data.length > 0) {
      this._seq = data[0][1].touch + 1;
      for (const [key, value] of data) {
        value.type = typeof value.type === "number" ? value.type : CompletionItemKinds.fromString(value.type);
        this._trie.set(key, value);
      }
    }
  }
};
var _a2;
var SuggestMemoryService = (_a2 = class {
  constructor(_storageService, _configService) {
    this._storageService = _storageService;
    this._configService = _configService;
    this._disposables = new DisposableStore();
    this._persistSoon = new RunOnceScheduler(() => this._saveState(), 500);
    this._disposables.add(_storageService.onWillSaveState((e) => {
      if (e.reason === WillSaveStateReason.SHUTDOWN) {
        this._saveState();
      }
    }));
  }
  dispose() {
    this._disposables.dispose();
    this._persistSoon.dispose();
  }
  memorize(model, pos, item) {
    this._withStrategy(model, pos).memorize(model, pos, item);
    this._persistSoon.schedule();
  }
  select(model, pos, items) {
    return this._withStrategy(model, pos).select(model, pos, items);
  }
  _withStrategy(model, pos) {
    const mode = this._configService.getValue("editor.suggestSelection", {
      overrideIdentifier: model.getLanguageIdAtPosition(pos.lineNumber, pos.column),
      resource: model.uri
    });
    if (this._strategy?.name !== mode) {
      this._saveState();
      const ctor = SuggestMemoryService_1._strategyCtors.get(mode) || NoMemory;
      this._strategy = new ctor();
      try {
        const share = this._configService.getValue("editor.suggest.shareSuggestSelections");
        const scope = share ? 0 : 1;
        const raw = this._storageService.get(`${SuggestMemoryService_1._storagePrefix}/${mode}`, scope);
        if (raw) {
          this._strategy.fromJSON(JSON.parse(raw));
        }
      } catch (e) {
      }
    }
    return this._strategy;
  }
  _saveState() {
    if (this._strategy) {
      const share = this._configService.getValue("editor.suggest.shareSuggestSelections");
      const scope = share ? 0 : 1;
      const raw = JSON.stringify(this._strategy);
      this._storageService.store(
        `${SuggestMemoryService_1._storagePrefix}/${this._strategy.name}`,
        raw,
        scope,
        1
        /* StorageTarget.MACHINE */
      );
    }
  }
}, SuggestMemoryService_1 = _a2, _a2._strategyCtors = /* @__PURE__ */ new Map([
  ["recentlyUsedByPrefix", PrefixMemory],
  ["recentlyUsed", LRUMemory],
  ["first", NoMemory]
]), _a2._storagePrefix = "suggest/memories", _a2);
SuggestMemoryService = SuggestMemoryService_1 = __decorate5([
  __param5(0, IStorageService),
  __param5(1, IConfigurationService)
], SuggestMemoryService);
var ISuggestMemoryService = createDecorator("ISuggestMemories");
registerSingleton(
  ISuggestMemoryService,
  SuggestMemoryService,
  1
  /* InstantiationType.Delayed */
);

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/wordContextKey.js
var __decorate6 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param6 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var WordContextKey_1;
var _a3;
var WordContextKey = (_a3 = class {
  constructor(_editor, contextKeyService) {
    this._editor = _editor;
    this._enabled = false;
    this._ckAtEnd = WordContextKey_1.AtEnd.bindTo(contextKeyService);
    this._configListener = this._editor.onDidChangeConfiguration((e) => e.hasChanged(
      139
      /* EditorOption.tabCompletion */
    ) && this._update());
    this._update();
  }
  dispose() {
    this._configListener.dispose();
    this._selectionListener?.dispose();
    this._ckAtEnd.reset();
  }
  _update() {
    const enabled = this._editor.getOption(
      139
      /* EditorOption.tabCompletion */
    ) === "on";
    if (this._enabled === enabled) {
      return;
    }
    this._enabled = enabled;
    if (this._enabled) {
      const checkForWordEnd = () => {
        if (!this._editor.hasModel()) {
          this._ckAtEnd.set(false);
          return;
        }
        const model = this._editor.getModel();
        const selection = this._editor.getSelection();
        const word = model.getWordAtPosition(selection.getStartPosition());
        if (!word) {
          this._ckAtEnd.set(false);
          return;
        }
        this._ckAtEnd.set(word.endColumn === selection.getStartPosition().column && selection.getStartPosition().lineNumber === selection.getEndPosition().lineNumber);
      };
      this._selectionListener = this._editor.onDidChangeCursorSelection(checkForWordEnd);
      checkForWordEnd();
    } else if (this._selectionListener) {
      this._ckAtEnd.reset();
      this._selectionListener.dispose();
      this._selectionListener = void 0;
    }
  }
}, WordContextKey_1 = _a3, _a3.AtEnd = new RawContextKey("atEndOfWord", false, { type: "boolean", description: localize(1494, "A context key that is true when at the end of a word. Note that this is only defined when tab-completions are enabled") }), _a3);
WordContextKey = WordContextKey_1 = __decorate6([
  __param6(1, IContextKeyService)
], WordContextKey);

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestAlternatives.js
var __decorate7 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param7 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SuggestAlternatives_1;
var _a4;
var SuggestAlternatives = (_a4 = class {
  constructor(_editor, contextKeyService) {
    this._editor = _editor;
    this._index = 0;
    this._ckOtherSuggestions = SuggestAlternatives_1.OtherSuggestions.bindTo(contextKeyService);
  }
  dispose() {
    this.reset();
  }
  reset() {
    this._ckOtherSuggestions.reset();
    this._listener?.dispose();
    this._model = void 0;
    this._acceptNext = void 0;
    this._ignore = false;
  }
  set({ model, index }, acceptNext) {
    if (model.items.length === 0) {
      this.reset();
      return;
    }
    const nextIndex = SuggestAlternatives_1._moveIndex(true, model, index);
    if (nextIndex === index) {
      this.reset();
      return;
    }
    this._acceptNext = acceptNext;
    this._model = model;
    this._index = index;
    this._listener = this._editor.onDidChangeCursorPosition(() => {
      if (!this._ignore) {
        this.reset();
      }
    });
    this._ckOtherSuggestions.set(true);
  }
  static _moveIndex(fwd, model, index) {
    let newIndex = index;
    for (let rounds = model.items.length; rounds > 0; rounds--) {
      newIndex = (newIndex + model.items.length + (fwd ? 1 : -1)) % model.items.length;
      if (newIndex === index) {
        break;
      }
      if (!model.items[newIndex].completion.additionalTextEdits) {
        break;
      }
    }
    return newIndex;
  }
  next() {
    this._move(true);
  }
  prev() {
    this._move(false);
  }
  _move(fwd) {
    if (!this._model) {
      return;
    }
    try {
      this._ignore = true;
      this._index = SuggestAlternatives_1._moveIndex(fwd, this._model, this._index);
      this._acceptNext({ index: this._index, item: this._model.items[this._index], model: this._model });
    } finally {
      this._ignore = false;
    }
  }
}, SuggestAlternatives_1 = _a4, _a4.OtherSuggestions = new RawContextKey("hasOtherSuggestions", false), _a4);
SuggestAlternatives = SuggestAlternatives_1 = __decorate7([
  __param7(1, IContextKeyService)
], SuggestAlternatives);

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestCommitCharacters.js
var CommitCharacterController = class {
  constructor(editor, widget, model, accept) {
    this._disposables = new DisposableStore();
    this._disposables.add(model.onDidSuggest((e) => {
      if (e.completionModel.items.length === 0) {
        this.reset();
      }
    }));
    this._disposables.add(model.onDidCancel((e) => {
      this.reset();
    }));
    this._disposables.add(widget.onDidShow(() => this._onItem(widget.getFocusedItem())));
    this._disposables.add(widget.onDidFocus(this._onItem, this));
    this._disposables.add(widget.onDidHide(this.reset, this));
    this._disposables.add(editor.onWillType((text) => {
      if (this._active && !widget.isFrozen() && model.state !== 0) {
        const ch = text.charCodeAt(text.length - 1);
        if (this._active.acceptCharacters.has(ch) && editor.getOption(
          0
          /* EditorOption.acceptSuggestionOnCommitCharacter */
        )) {
          accept(this._active.item);
        }
      }
    }));
  }
  _onItem(selected) {
    if (!selected || !isNonEmptyArray(selected.item.completion.commitCharacters)) {
      this.reset();
      return;
    }
    if (this._active && this._active.item.item === selected.item) {
      return;
    }
    const acceptCharacters = new CharacterSet();
    for (const ch of selected.item.completion.commitCharacters) {
      if (ch.length > 0) {
        acceptCharacters.add(ch.charCodeAt(0));
      }
    }
    this._active = { acceptCharacters, item: selected };
  }
  reset() {
    this._active = void 0;
  }
  dispose() {
    this._disposables.dispose();
  }
};

// node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/browser/bracketSelections.js
var _BracketSelectionRangeProvider = class _BracketSelectionRangeProvider {
  async provideSelectionRanges(model, positions) {
    const result = [];
    for (const position of positions) {
      const bucket = [];
      result.push(bucket);
      const ranges = /* @__PURE__ */ new Map();
      await new Promise((resolve) => _BracketSelectionRangeProvider._bracketsRightYield(resolve, 0, model, position, ranges));
      await new Promise((resolve) => _BracketSelectionRangeProvider._bracketsLeftYield(resolve, 0, model, position, ranges, bucket));
    }
    return result;
  }
  static _bracketsRightYield(resolve, round, model, pos, ranges) {
    const counts = /* @__PURE__ */ new Map();
    const t1 = Date.now();
    while (true) {
      if (round >= _BracketSelectionRangeProvider._maxRounds) {
        resolve();
        break;
      }
      if (!pos) {
        resolve();
        break;
      }
      const bracket = model.bracketPairs.findNextBracket(pos);
      if (!bracket) {
        resolve();
        break;
      }
      const d = Date.now() - t1;
      if (d > _BracketSelectionRangeProvider._maxDuration) {
        setTimeout(() => _BracketSelectionRangeProvider._bracketsRightYield(resolve, round + 1, model, pos, ranges));
        break;
      }
      if (bracket.bracketInfo.isOpeningBracket) {
        const key = bracket.bracketInfo.bracketText;
        const val = counts.has(key) ? counts.get(key) : 0;
        counts.set(key, val + 1);
      } else {
        const key = bracket.bracketInfo.getOpeningBrackets()[0].bracketText;
        let val = counts.has(key) ? counts.get(key) : 0;
        val -= 1;
        counts.set(key, Math.max(0, val));
        if (val < 0) {
          let list = ranges.get(key);
          if (!list) {
            list = new LinkedList();
            ranges.set(key, list);
          }
          list.push(bracket.range);
        }
      }
      pos = bracket.range.getEndPosition();
    }
  }
  static _bracketsLeftYield(resolve, round, model, pos, ranges, bucket) {
    const counts = /* @__PURE__ */ new Map();
    const t1 = Date.now();
    while (true) {
      if (round >= _BracketSelectionRangeProvider._maxRounds && ranges.size === 0) {
        resolve();
        break;
      }
      if (!pos) {
        resolve();
        break;
      }
      const bracket = model.bracketPairs.findPrevBracket(pos);
      if (!bracket) {
        resolve();
        break;
      }
      const d = Date.now() - t1;
      if (d > _BracketSelectionRangeProvider._maxDuration) {
        setTimeout(() => _BracketSelectionRangeProvider._bracketsLeftYield(resolve, round + 1, model, pos, ranges, bucket));
        break;
      }
      if (!bracket.bracketInfo.isOpeningBracket) {
        const key = bracket.bracketInfo.getOpeningBrackets()[0].bracketText;
        const val = counts.has(key) ? counts.get(key) : 0;
        counts.set(key, val + 1);
      } else {
        const key = bracket.bracketInfo.bracketText;
        let val = counts.has(key) ? counts.get(key) : 0;
        val -= 1;
        counts.set(key, Math.max(0, val));
        if (val < 0) {
          const list = ranges.get(key);
          if (list) {
            const closing = list.shift();
            if (list.size === 0) {
              ranges.delete(key);
            }
            const innerBracket = Range.fromPositions(bracket.range.getEndPosition(), closing.getStartPosition());
            const outerBracket = Range.fromPositions(bracket.range.getStartPosition(), closing.getEndPosition());
            bucket.push({ range: innerBracket });
            bucket.push({ range: outerBracket });
            _BracketSelectionRangeProvider._addBracketLeading(model, outerBracket, bucket);
          }
        }
      }
      pos = bracket.range.getStartPosition();
    }
  }
  static _addBracketLeading(model, bracket, bucket) {
    if (bracket.startLineNumber === bracket.endLineNumber) {
      return;
    }
    const startLine = bracket.startLineNumber;
    const column = model.getLineFirstNonWhitespaceColumn(startLine);
    if (column !== 0 && column !== bracket.startColumn) {
      bucket.push({ range: Range.fromPositions(new Position(startLine, column), bracket.getEndPosition()) });
      bucket.push({ range: Range.fromPositions(new Position(startLine, 1), bracket.getEndPosition()) });
    }
    const aboveLine = startLine - 1;
    if (aboveLine > 0) {
      const column2 = model.getLineFirstNonWhitespaceColumn(aboveLine);
      if (column2 === bracket.startColumn && column2 !== model.getLineLastNonWhitespaceColumn(aboveLine)) {
        bucket.push({ range: Range.fromPositions(new Position(aboveLine, column2), bracket.getEndPosition()) });
        bucket.push({ range: Range.fromPositions(new Position(aboveLine, 1), bracket.getEndPosition()) });
      }
    }
  }
};
_BracketSelectionRangeProvider._maxDuration = 30;
_BracketSelectionRangeProvider._maxRounds = 2;
var BracketSelectionRangeProvider = _BracketSelectionRangeProvider;

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/wordDistance.js
var _WordDistance = class _WordDistance {
  static async create(service, editor) {
    if (!editor.getOption(
      134
      /* EditorOption.suggest */
    ).localityBonus) {
      return _WordDistance.None;
    }
    if (!editor.hasModel()) {
      return _WordDistance.None;
    }
    const model = editor.getModel();
    const position = editor.getPosition();
    if (!service.canComputeWordRanges(model.uri)) {
      return _WordDistance.None;
    }
    const [ranges] = await new BracketSelectionRangeProvider().provideSelectionRanges(model, [position]);
    if (ranges.length === 0) {
      return _WordDistance.None;
    }
    const wordRanges = await service.computeWordRanges(model.uri, ranges[0].range);
    if (!wordRanges) {
      return _WordDistance.None;
    }
    const wordUntilPos = model.getWordUntilPosition(position);
    delete wordRanges[wordUntilPos.word];
    return new class extends _WordDistance {
      distance(anchor, item) {
        if (!position.equals(editor.getPosition())) {
          return 0;
        }
        if (item.kind === 17) {
          return 2 << 20;
        }
        const word = typeof item.label === "string" ? item.label : item.label.label;
        const wordLines = wordRanges[word];
        if (isFalsyOrEmpty(wordLines)) {
          return 2 << 20;
        }
        const idx = binarySearch(wordLines, Range.fromPositions(anchor), Range.compareRangesUsingStarts);
        const bestWordRange = idx >= 0 ? wordLines[idx] : wordLines[Math.max(0, ~idx - 1)];
        let blockDistance = ranges.length;
        for (const range of ranges) {
          if (!Range.containsRange(range.range, bestWordRange)) {
            break;
          }
          blockDistance -= 1;
        }
        return blockDistance;
      }
    }();
  }
};
_WordDistance.None = new class extends _WordDistance {
  distance() {
    return 0;
  }
}();
var WordDistance = _WordDistance;

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/completionModel.js
var CompletionModel = class _CompletionModel {
  constructor(items, column, lineContext, wordDistance, options, snippetSuggestions, fuzzyScoreOptions = FuzzyScoreOptions.default, clipboardText = void 0) {
    this.clipboardText = clipboardText;
    this._snippetCompareFn = _CompletionModel._compareCompletionItems;
    this._items = items;
    this._column = column;
    this._wordDistance = wordDistance;
    this._options = options;
    this._refilterKind = 1;
    this._lineContext = lineContext;
    this._fuzzyScoreOptions = fuzzyScoreOptions;
    if (snippetSuggestions === "top") {
      this._snippetCompareFn = _CompletionModel._compareCompletionItemsSnippetsUp;
    } else if (snippetSuggestions === "bottom") {
      this._snippetCompareFn = _CompletionModel._compareCompletionItemsSnippetsDown;
    }
  }
  get lineContext() {
    return this._lineContext;
  }
  set lineContext(value) {
    if (this._lineContext.leadingLineContent !== value.leadingLineContent || this._lineContext.characterCountDelta !== value.characterCountDelta) {
      this._refilterKind = this._lineContext.characterCountDelta < value.characterCountDelta && this._filteredItems ? 2 : 1;
      this._lineContext = value;
    }
  }
  get items() {
    this._ensureCachedState();
    return this._filteredItems;
  }
  getItemsByProvider() {
    this._ensureCachedState();
    return this._itemsByProvider;
  }
  getIncompleteProvider() {
    this._ensureCachedState();
    const result = /* @__PURE__ */ new Set();
    for (const [provider, items] of this.getItemsByProvider()) {
      if (items.length > 0 && items[0].container.incomplete) {
        result.add(provider);
      }
    }
    return result;
  }
  get stats() {
    this._ensureCachedState();
    return this._stats;
  }
  _ensureCachedState() {
    if (this._refilterKind !== 0) {
      this._createCachedState();
    }
  }
  _createCachedState() {
    this._itemsByProvider = /* @__PURE__ */ new Map();
    const labelLengths = [];
    const { leadingLineContent, characterCountDelta } = this._lineContext;
    let word = "";
    let wordLow = "";
    const source = this._refilterKind === 1 ? this._items : this._filteredItems;
    const target = [];
    const scoreFn = !this._options.filterGraceful || source.length > 2e3 ? fuzzyScore : fuzzyScoreGracefulAggressive;
    for (let i = 0; i < source.length; i++) {
      const item = source[i];
      if (item.isInvalid) {
        continue;
      }
      const arr = this._itemsByProvider.get(item.provider);
      if (arr) {
        arr.push(item);
      } else {
        this._itemsByProvider.set(item.provider, [item]);
      }
      const overwriteBefore = item.position.column - item.editStart.column;
      const wordLen = overwriteBefore + characterCountDelta - (item.position.column - this._column);
      if (word.length !== wordLen) {
        word = wordLen === 0 ? "" : leadingLineContent.slice(-wordLen);
        wordLow = word.toLowerCase();
      }
      item.word = word;
      if (wordLen === 0) {
        item.score = FuzzyScore.Default;
      } else {
        let wordPos = 0;
        while (wordPos < overwriteBefore) {
          const ch = word.charCodeAt(wordPos);
          if (ch === 32 || ch === 9) {
            wordPos += 1;
          } else {
            break;
          }
        }
        if (wordPos >= wordLen) {
          item.score = FuzzyScore.Default;
        } else if (typeof item.completion.filterText === "string") {
          const match = scoreFn(word, wordLow, wordPos, item.completion.filterText, item.filterTextLow, 0, this._fuzzyScoreOptions);
          if (!match) {
            continue;
          }
          if (compareIgnoreCase(item.completion.filterText, item.textLabel) === 0) {
            item.score = match;
          } else {
            item.score = anyScore(word, wordLow, wordPos, item.textLabel, item.labelLow, 0);
            item.score[0] = match[0];
          }
        } else {
          const match = scoreFn(word, wordLow, wordPos, item.textLabel, item.labelLow, 0, this._fuzzyScoreOptions);
          if (!match) {
            continue;
          }
          item.score = match;
        }
      }
      item.idx = i;
      item.distance = this._wordDistance.distance(item.position, item.completion);
      target.push(item);
      labelLengths.push(item.textLabel.length);
    }
    this._filteredItems = target.sort(this._snippetCompareFn);
    this._refilterKind = 0;
    this._stats = {
      pLabelLen: labelLengths.length ? quickSelect(labelLengths.length - 0.85, labelLengths, (a, b) => a - b) : 0
    };
  }
  static _compareCompletionItems(a, b) {
    if (a.score[0] > b.score[0]) {
      return -1;
    } else if (a.score[0] < b.score[0]) {
      return 1;
    } else if (a.distance < b.distance) {
      return -1;
    } else if (a.distance > b.distance) {
      return 1;
    } else if (a.idx < b.idx) {
      return -1;
    } else if (a.idx > b.idx) {
      return 1;
    } else {
      return 0;
    }
  }
  static _compareCompletionItemsSnippetsDown(a, b) {
    if (a.completion.kind !== b.completion.kind) {
      if (a.completion.kind === 28) {
        return 1;
      } else if (b.completion.kind === 28) {
        return -1;
      }
    }
    return _CompletionModel._compareCompletionItems(a, b);
  }
  static _compareCompletionItemsSnippetsUp(a, b) {
    if (a.completion.kind !== b.completion.kind) {
      if (a.completion.kind === 28) {
        return -1;
      } else if (b.completion.kind === 28) {
        return 1;
      }
    }
    return _CompletionModel._compareCompletionItems(a, b);
  }
};

// node_modules/monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/controller/inlineCompletionContextKeys.js
var _InlineCompletionContextKeys = class _InlineCompletionContextKeys {
};
_InlineCompletionContextKeys.inlineSuggestionVisible = new RawContextKey("inlineSuggestionVisible", false, localize(1192, "Whether an inline suggestion is visible"));
_InlineCompletionContextKeys.inlineSuggestionHasIndentation = new RawContextKey("inlineSuggestionHasIndentation", false, localize(1193, "Whether the inline suggestion starts with whitespace"));
_InlineCompletionContextKeys.inlineSuggestionHasIndentationLessThanTabSize = new RawContextKey("inlineSuggestionHasIndentationLessThanTabSize", true, localize(1194, "Whether the inline suggestion starts with whitespace that is less than what would be inserted by tab"));
_InlineCompletionContextKeys.suppressSuggestions = new RawContextKey("inlineSuggestionSuppressSuggestions", void 0, localize(1195, "Whether suggestions should be suppressed for the current suggestion"));
_InlineCompletionContextKeys.cursorBeforeGhostText = new RawContextKey("cursorBeforeGhostText", false, localize(1196, "Whether the cursor is at ghost text"));
_InlineCompletionContextKeys.cursorInIndentation = new RawContextKey("cursorInIndentation", false, localize(1197, "Whether the cursor is in indentation"));
_InlineCompletionContextKeys.hasSelection = new RawContextKey("editor.hasSelection", false, localize(1198, "Whether the editor has a selection"));
_InlineCompletionContextKeys.cursorAtInlineEdit = new RawContextKey("cursorAtInlineEdit", false, localize(1199, "Whether the cursor is at an inline edit"));
_InlineCompletionContextKeys.inlineEditVisible = new RawContextKey("inlineEditIsVisible", false, localize(1200, "Whether an inline edit is visible"));
_InlineCompletionContextKeys.tabShouldJumpToInlineEdit = new RawContextKey("tabShouldJumpToInlineEdit", false, localize(1201, "Whether tab should jump to an inline edit."));
_InlineCompletionContextKeys.tabShouldAcceptInlineEdit = new RawContextKey("tabShouldAcceptInlineEdit", false, localize(1202, "Whether tab should accept the inline edit."));
_InlineCompletionContextKeys.inInlineEditsPreviewEditor = new RawContextKey("inInlineEditsPreviewEditor", true, localize(1203, "Whether the current code editor is showing an inline edits preview"));
var InlineCompletionContextKeys = _InlineCompletionContextKeys;

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestModel.js
var __decorate8 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param8 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SuggestModel_1;
var LineContext = class {
  static shouldAutoTrigger(editor) {
    if (!editor.hasModel()) {
      return false;
    }
    const model = editor.getModel();
    const pos = editor.getPosition();
    model.tokenization.tokenizeIfCheap(pos.lineNumber);
    const word = model.getWordAtPosition(pos);
    if (!word) {
      return false;
    }
    if (word.endColumn !== pos.column && word.startColumn + 1 !== pos.column) {
      return false;
    }
    if (!isNaN(Number(word.word))) {
      return false;
    }
    return true;
  }
  constructor(model, position, triggerOptions) {
    this.leadingLineContent = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
    this.leadingWord = model.getWordUntilPosition(position);
    this.lineNumber = position.lineNumber;
    this.column = position.column;
    this.triggerOptions = triggerOptions;
  }
};
function canShowQuickSuggest(editor, contextKeyService, configurationService) {
  if (!Boolean(contextKeyService.getContextKeyValue(InlineCompletionContextKeys.inlineSuggestionVisible.key))) {
    return true;
  }
  const suppressSuggestions = contextKeyService.getContextKeyValue(InlineCompletionContextKeys.suppressSuggestions.key);
  if (suppressSuggestions !== void 0) {
    return !suppressSuggestions;
  }
  return !editor.getOption(
    71
    /* EditorOption.inlineSuggest */
  ).suppressSuggestions;
}
function canShowSuggestOnTriggerCharacters(editor, contextKeyService, configurationService) {
  if (!Boolean(contextKeyService.getContextKeyValue("inlineSuggestionVisible"))) {
    return true;
  }
  const suppressSuggestions = contextKeyService.getContextKeyValue(InlineCompletionContextKeys.suppressSuggestions.key);
  if (suppressSuggestions !== void 0) {
    return !suppressSuggestions;
  }
  return !editor.getOption(
    71
    /* EditorOption.inlineSuggest */
  ).suppressSuggestions;
}
var SuggestModel = SuggestModel_1 = class SuggestModel2 {
  constructor(_editor, _editorWorkerService, _clipboardService, _telemetryService, _logService, _contextKeyService, _configurationService, _languageFeaturesService, _envService) {
    this._editor = _editor;
    this._editorWorkerService = _editorWorkerService;
    this._clipboardService = _clipboardService;
    this._telemetryService = _telemetryService;
    this._logService = _logService;
    this._contextKeyService = _contextKeyService;
    this._configurationService = _configurationService;
    this._languageFeaturesService = _languageFeaturesService;
    this._envService = _envService;
    this._toDispose = new DisposableStore();
    this._triggerCharacterListener = new DisposableStore();
    this._triggerQuickSuggest = new TimeoutTimer();
    this._triggerState = void 0;
    this._completionDisposables = new DisposableStore();
    this._onDidCancel = new Emitter();
    this._onDidTrigger = new Emitter();
    this._onDidSuggest = new Emitter();
    this.onDidCancel = this._onDidCancel.event;
    this.onDidTrigger = this._onDidTrigger.event;
    this.onDidSuggest = this._onDidSuggest.event;
    this._currentSelection = this._editor.getSelection() || new Selection(1, 1, 1, 1);
    this._toDispose.add(this._editor.onDidChangeModel(() => {
      this._updateTriggerCharacters();
      this.cancel();
    }));
    this._toDispose.add(this._editor.onDidChangeModelLanguage(() => {
      this._updateTriggerCharacters();
      this.cancel();
    }));
    this._toDispose.add(this._editor.onDidChangeConfiguration(() => {
      this._updateTriggerCharacters();
    }));
    this._toDispose.add(this._languageFeaturesService.completionProvider.onDidChange(() => {
      this._updateTriggerCharacters();
      this._updateActiveSuggestSession();
    }));
    let editorIsComposing = false;
    this._toDispose.add(this._editor.onDidCompositionStart(() => {
      editorIsComposing = true;
    }));
    this._toDispose.add(this._editor.onDidCompositionEnd(() => {
      editorIsComposing = false;
      this._onCompositionEnd();
    }));
    this._toDispose.add(this._editor.onDidChangeCursorSelection((e) => {
      if (!editorIsComposing) {
        this._onCursorChange(e);
      }
    }));
    this._toDispose.add(this._editor.onDidChangeModelContent(() => {
      if (!editorIsComposing && this._triggerState !== void 0) {
        this._refilterCompletionItems();
      }
    }));
    this._updateTriggerCharacters();
  }
  dispose() {
    dispose(this._triggerCharacterListener);
    dispose([this._onDidCancel, this._onDidSuggest, this._onDidTrigger, this._triggerQuickSuggest]);
    this._toDispose.dispose();
    this._completionDisposables.dispose();
    this.cancel();
  }
  _updateTriggerCharacters() {
    this._triggerCharacterListener.clear();
    if (this._editor.getOption(
      104
      /* EditorOption.readOnly */
    ) || !this._editor.hasModel() || !this._editor.getOption(
      137
      /* EditorOption.suggestOnTriggerCharacters */
    )) {
      return;
    }
    const supportsByTriggerCharacter = /* @__PURE__ */ new Map();
    for (const support of this._languageFeaturesService.completionProvider.all(this._editor.getModel())) {
      for (const ch of support.triggerCharacters || []) {
        let set = supportsByTriggerCharacter.get(ch);
        if (!set) {
          set = /* @__PURE__ */ new Set();
          supportsByTriggerCharacter.set(ch, set);
        }
        set.add(support);
      }
    }
    const checkTriggerCharacter = (text) => {
      if (!canShowSuggestOnTriggerCharacters(this._editor, this._contextKeyService, this._configurationService)) {
        return;
      }
      if (LineContext.shouldAutoTrigger(this._editor)) {
        return;
      }
      if (!text) {
        const position = this._editor.getPosition();
        const model = this._editor.getModel();
        text = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
      }
      let lastChar = "";
      if (isLowSurrogate(text.charCodeAt(text.length - 1))) {
        if (isHighSurrogate(text.charCodeAt(text.length - 2))) {
          lastChar = text.substr(text.length - 2);
        }
      } else {
        lastChar = text.charAt(text.length - 1);
      }
      const supports = supportsByTriggerCharacter.get(lastChar);
      if (supports) {
        const providerItemsToReuse = /* @__PURE__ */ new Map();
        if (this._completionModel) {
          for (const [provider, items] of this._completionModel.getItemsByProvider()) {
            if (!supports.has(provider)) {
              providerItemsToReuse.set(provider, items);
            }
          }
        }
        this.trigger({
          auto: true,
          triggerKind: 1,
          triggerCharacter: lastChar,
          retrigger: Boolean(this._completionModel),
          clipboardText: this._completionModel?.clipboardText,
          completionOptions: { providerFilter: supports, providerItemsToReuse }
        });
      }
    };
    this._triggerCharacterListener.add(this._editor.onDidType(checkTriggerCharacter));
    this._triggerCharacterListener.add(this._editor.onDidCompositionEnd(() => checkTriggerCharacter()));
  }
  // --- trigger/retrigger/cancel suggest
  get state() {
    if (!this._triggerState) {
      return 0;
    } else if (!this._triggerState.auto) {
      return 1;
    } else {
      return 2;
    }
  }
  cancel(retrigger = false) {
    if (this._triggerState !== void 0) {
      this._triggerQuickSuggest.cancel();
      this._requestToken?.cancel();
      this._requestToken = void 0;
      this._triggerState = void 0;
      this._completionModel = void 0;
      this._context = void 0;
      this._onDidCancel.fire({ retrigger });
    }
  }
  clear() {
    this._completionDisposables.clear();
  }
  _updateActiveSuggestSession() {
    if (this._triggerState !== void 0) {
      if (!this._editor.hasModel() || !this._languageFeaturesService.completionProvider.has(this._editor.getModel())) {
        this.cancel();
      } else {
        this.trigger({ auto: this._triggerState.auto, retrigger: true });
      }
    }
  }
  _onCursorChange(e) {
    if (!this._editor.hasModel()) {
      return;
    }
    const prevSelection = this._currentSelection;
    this._currentSelection = this._editor.getSelection();
    if (!e.selection.isEmpty() || e.reason !== 0 && e.reason !== 3 || e.source !== "keyboard" && e.source !== "deleteLeft") {
      this.cancel();
      return;
    }
    if (this._triggerState === void 0 && e.reason === 0) {
      if (prevSelection.containsRange(this._currentSelection) || prevSelection.getEndPosition().isBeforeOrEqual(this._currentSelection.getPosition())) {
        this._doTriggerQuickSuggest();
      }
    } else if (this._triggerState !== void 0 && e.reason === 3) {
      this._refilterCompletionItems();
    }
  }
  _onCompositionEnd() {
    if (this._triggerState === void 0) {
      this._doTriggerQuickSuggest();
    } else {
      this._refilterCompletionItems();
    }
  }
  _doTriggerQuickSuggest() {
    if (QuickSuggestionsOptions.isAllOff(this._editor.getOption(
      102
      /* EditorOption.quickSuggestions */
    ))) {
      return;
    }
    if (this._editor.getOption(
      134
      /* EditorOption.suggest */
    ).snippetsPreventQuickSuggestions && SnippetController2.get(this._editor)?.isInSnippet()) {
      return;
    }
    this.cancel();
    this._triggerQuickSuggest.cancelAndSet(() => {
      if (this._triggerState !== void 0) {
        return;
      }
      if (!LineContext.shouldAutoTrigger(this._editor)) {
        return;
      }
      if (!this._editor.hasModel() || !this._editor.hasWidgetFocus()) {
        return;
      }
      const model = this._editor.getModel();
      const pos = this._editor.getPosition();
      const config = this._editor.getOption(
        102
        /* EditorOption.quickSuggestions */
      );
      if (QuickSuggestionsOptions.isAllOff(config)) {
        return;
      }
      if (!QuickSuggestionsOptions.isAllOn(config)) {
        model.tokenization.tokenizeIfCheap(pos.lineNumber);
        const lineTokens = model.tokenization.getLineTokens(pos.lineNumber);
        const tokenType = lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(pos.column - 1 - 1, 0)));
        if (QuickSuggestionsOptions.valueFor(config, tokenType) !== "on") {
          return;
        }
      }
      if (!canShowQuickSuggest(this._editor, this._contextKeyService, this._configurationService)) {
        return;
      }
      if (!this._languageFeaturesService.completionProvider.has(model)) {
        return;
      }
      this.trigger({ auto: true });
    }, this._editor.getOption(
      103
      /* EditorOption.quickSuggestionsDelay */
    ));
  }
  _refilterCompletionItems() {
    assertType(this._editor.hasModel());
    assertType(this._triggerState !== void 0);
    const model = this._editor.getModel();
    const position = this._editor.getPosition();
    const ctx = new LineContext(model, position, { ...this._triggerState, refilter: true });
    this._onNewContext(ctx);
  }
  trigger(options) {
    if (!this._editor.hasModel()) {
      return;
    }
    const model = this._editor.getModel();
    const ctx = new LineContext(model, this._editor.getPosition(), options);
    this.cancel(options.retrigger);
    this._triggerState = options;
    this._onDidTrigger.fire({ auto: options.auto, shy: options.shy ?? false, position: this._editor.getPosition() });
    this._context = ctx;
    let suggestCtx = {
      triggerKind: options.triggerKind ?? 0
      /* CompletionTriggerKind.Invoke */
    };
    if (options.triggerCharacter) {
      suggestCtx = {
        triggerKind: 1,
        triggerCharacter: options.triggerCharacter
      };
    }
    this._requestToken = new CancellationTokenSource();
    const snippetSuggestions = this._editor.getOption(
      128
      /* EditorOption.snippetSuggestions */
    );
    let snippetSortOrder = 1;
    switch (snippetSuggestions) {
      case "top":
        snippetSortOrder = 0;
        break;
      // 	↓ that's the default anyways...
      // case 'inline':
      // 	snippetSortOrder = SnippetSortOrder.Inline;
      // 	break;
      case "bottom":
        snippetSortOrder = 2;
        break;
    }
    const { itemKind: itemKindFilter, showDeprecated } = SuggestModel_1.createSuggestFilter(this._editor);
    const completionOptions = new CompletionOptions(snippetSortOrder, options.completionOptions?.kindFilter ?? itemKindFilter, options.completionOptions?.providerFilter, options.completionOptions?.providerItemsToReuse, showDeprecated);
    const wordDistance = WordDistance.create(this._editorWorkerService, this._editor);
    const completions = provideSuggestionItems(this._languageFeaturesService.completionProvider, model, this._editor.getPosition(), completionOptions, suggestCtx, this._requestToken.token);
    Promise.all([completions, wordDistance]).then(async ([completions2, wordDistance2]) => {
      this._requestToken?.dispose();
      if (!this._editor.hasModel()) {
        completions2.disposable.dispose();
        return;
      }
      let clipboardText = options?.clipboardText;
      if (!clipboardText && completions2.needsClipboard) {
        clipboardText = await this._clipboardService.readText();
      }
      if (this._triggerState === void 0) {
        completions2.disposable.dispose();
        return;
      }
      const model2 = this._editor.getModel();
      const ctx2 = new LineContext(model2, this._editor.getPosition(), options);
      const fuzzySearchOptions = {
        ...FuzzyScoreOptions.default,
        firstMatchCanBeWeak: !this._editor.getOption(
          134
          /* EditorOption.suggest */
        ).matchOnWordStartOnly
      };
      this._completionModel = new CompletionModel(completions2.items, this._context.column, {
        leadingLineContent: ctx2.leadingLineContent,
        characterCountDelta: ctx2.column - this._context.column
      }, wordDistance2, this._editor.getOption(
        134
        /* EditorOption.suggest */
      ), this._editor.getOption(
        128
        /* EditorOption.snippetSuggestions */
      ), fuzzySearchOptions, clipboardText);
      this._completionDisposables.add(completions2.disposable);
      this._onNewContext(ctx2);
      this._reportDurationsTelemetry(completions2.durations);
      if (!this._envService.isBuilt || this._envService.isExtensionDevelopment) {
        for (const item of completions2.items) {
          if (item.isInvalid) {
            this._logService.warn(`[suggest] did IGNORE invalid completion item from ${item.provider._debugDisplayName}`, item.completion);
          }
        }
      }
    }).catch(onUnexpectedError);
  }
  /**
   * Report durations telemetry with a 1% sampling rate.
   * The telemetry is reported only if a random number between 0 and 100 is less than or equal to 1.
   */
  _reportDurationsTelemetry(durations) {
    if (Math.random() > 1e-4) {
      return;
    }
    setTimeout(() => {
      this._telemetryService.publicLog2("suggest.durations.json", { data: JSON.stringify(durations) });
      this._logService.debug("suggest.durations.json", durations);
    });
  }
  static createSuggestFilter(editor) {
    const result = /* @__PURE__ */ new Set();
    const snippetSuggestions = editor.getOption(
      128
      /* EditorOption.snippetSuggestions */
    );
    if (snippetSuggestions === "none") {
      result.add(
        28
        /* CompletionItemKind.Snippet */
      );
    }
    const suggestOptions = editor.getOption(
      134
      /* EditorOption.suggest */
    );
    if (!suggestOptions.showMethods) {
      result.add(
        0
        /* CompletionItemKind.Method */
      );
    }
    if (!suggestOptions.showFunctions) {
      result.add(
        1
        /* CompletionItemKind.Function */
      );
    }
    if (!suggestOptions.showConstructors) {
      result.add(
        2
        /* CompletionItemKind.Constructor */
      );
    }
    if (!suggestOptions.showFields) {
      result.add(
        3
        /* CompletionItemKind.Field */
      );
    }
    if (!suggestOptions.showVariables) {
      result.add(
        4
        /* CompletionItemKind.Variable */
      );
    }
    if (!suggestOptions.showClasses) {
      result.add(
        5
        /* CompletionItemKind.Class */
      );
    }
    if (!suggestOptions.showStructs) {
      result.add(
        6
        /* CompletionItemKind.Struct */
      );
    }
    if (!suggestOptions.showInterfaces) {
      result.add(
        7
        /* CompletionItemKind.Interface */
      );
    }
    if (!suggestOptions.showModules) {
      result.add(
        8
        /* CompletionItemKind.Module */
      );
    }
    if (!suggestOptions.showProperties) {
      result.add(
        9
        /* CompletionItemKind.Property */
      );
    }
    if (!suggestOptions.showEvents) {
      result.add(
        10
        /* CompletionItemKind.Event */
      );
    }
    if (!suggestOptions.showOperators) {
      result.add(
        11
        /* CompletionItemKind.Operator */
      );
    }
    if (!suggestOptions.showUnits) {
      result.add(
        12
        /* CompletionItemKind.Unit */
      );
    }
    if (!suggestOptions.showValues) {
      result.add(
        13
        /* CompletionItemKind.Value */
      );
    }
    if (!suggestOptions.showConstants) {
      result.add(
        14
        /* CompletionItemKind.Constant */
      );
    }
    if (!suggestOptions.showEnums) {
      result.add(
        15
        /* CompletionItemKind.Enum */
      );
    }
    if (!suggestOptions.showEnumMembers) {
      result.add(
        16
        /* CompletionItemKind.EnumMember */
      );
    }
    if (!suggestOptions.showKeywords) {
      result.add(
        17
        /* CompletionItemKind.Keyword */
      );
    }
    if (!suggestOptions.showWords) {
      result.add(
        18
        /* CompletionItemKind.Text */
      );
    }
    if (!suggestOptions.showColors) {
      result.add(
        19
        /* CompletionItemKind.Color */
      );
    }
    if (!suggestOptions.showFiles) {
      result.add(
        20
        /* CompletionItemKind.File */
      );
    }
    if (!suggestOptions.showReferences) {
      result.add(
        21
        /* CompletionItemKind.Reference */
      );
    }
    if (!suggestOptions.showColors) {
      result.add(
        22
        /* CompletionItemKind.Customcolor */
      );
    }
    if (!suggestOptions.showFolders) {
      result.add(
        23
        /* CompletionItemKind.Folder */
      );
    }
    if (!suggestOptions.showTypeParameters) {
      result.add(
        24
        /* CompletionItemKind.TypeParameter */
      );
    }
    if (!suggestOptions.showSnippets) {
      result.add(
        28
        /* CompletionItemKind.Snippet */
      );
    }
    if (!suggestOptions.showUsers) {
      result.add(
        25
        /* CompletionItemKind.User */
      );
    }
    if (!suggestOptions.showIssues) {
      result.add(
        26
        /* CompletionItemKind.Issue */
      );
    }
    return { itemKind: result, showDeprecated: suggestOptions.showDeprecated };
  }
  _onNewContext(ctx) {
    if (!this._context) {
      return;
    }
    if (ctx.lineNumber !== this._context.lineNumber) {
      this.cancel();
      return;
    }
    if (getLeadingWhitespace(ctx.leadingLineContent) !== getLeadingWhitespace(this._context.leadingLineContent)) {
      this.cancel();
      return;
    }
    if (ctx.column < this._context.column) {
      if (ctx.leadingWord.word) {
        this.trigger({ auto: this._context.triggerOptions.auto, retrigger: true });
      } else {
        this.cancel();
      }
      return;
    }
    if (!this._completionModel) {
      return;
    }
    if (ctx.leadingWord.word.length !== 0 && ctx.leadingWord.startColumn > this._context.leadingWord.startColumn) {
      const shouldAutoTrigger = LineContext.shouldAutoTrigger(this._editor);
      if (shouldAutoTrigger && this._context) {
        const map = this._completionModel.getItemsByProvider();
        this.trigger({
          auto: this._context.triggerOptions.auto,
          retrigger: true,
          clipboardText: this._completionModel.clipboardText,
          completionOptions: { providerItemsToReuse: map }
        });
      }
      return;
    }
    if (ctx.column > this._context.column && this._completionModel.getIncompleteProvider().size > 0 && ctx.leadingWord.word.length !== 0) {
      const providerItemsToReuse = /* @__PURE__ */ new Map();
      const providerFilter = /* @__PURE__ */ new Set();
      for (const [provider, items] of this._completionModel.getItemsByProvider()) {
        if (items.length > 0 && items[0].container.incomplete) {
          providerFilter.add(provider);
        } else {
          providerItemsToReuse.set(provider, items);
        }
      }
      this.trigger({
        auto: this._context.triggerOptions.auto,
        triggerKind: 2,
        retrigger: true,
        clipboardText: this._completionModel.clipboardText,
        completionOptions: { providerFilter, providerItemsToReuse }
      });
    } else {
      const oldLineContext = this._completionModel.lineContext;
      let isFrozen = false;
      this._completionModel.lineContext = {
        leadingLineContent: ctx.leadingLineContent,
        characterCountDelta: ctx.column - this._context.column
      };
      if (this._completionModel.items.length === 0) {
        const shouldAutoTrigger = LineContext.shouldAutoTrigger(this._editor);
        if (!this._context) {
          this.cancel();
          return;
        }
        if (shouldAutoTrigger && this._context.leadingWord.endColumn < ctx.leadingWord.startColumn) {
          this.trigger({ auto: this._context.triggerOptions.auto, retrigger: true });
          return;
        }
        if (!this._context.triggerOptions.auto) {
          this._completionModel.lineContext = oldLineContext;
          isFrozen = this._completionModel.items.length > 0;
          if (isFrozen && ctx.leadingWord.word.length === 0) {
            this.cancel();
            return;
          }
        } else {
          this.cancel();
          return;
        }
      }
      this._onDidSuggest.fire({
        completionModel: this._completionModel,
        triggerOptions: ctx.triggerOptions,
        isFrozen
      });
    }
  }
};
SuggestModel = SuggestModel_1 = __decorate8([
  __param8(1, IEditorWorkerService),
  __param8(2, IClipboardService),
  __param8(3, ITelemetryService),
  __param8(4, ILogService),
  __param8(5, IContextKeyService),
  __param8(6, IConfigurationService),
  __param8(7, ILanguageFeaturesService),
  __param8(8, IEnvironmentService)
], SuggestModel);

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestOvertypingCapturer.js
var _OvertypingCapturer = class _OvertypingCapturer {
  constructor(editor, suggestModel) {
    this._disposables = new DisposableStore();
    this._lastOvertyped = [];
    this._locked = false;
    this._disposables.add(editor.onWillType(() => {
      if (this._locked || !editor.hasModel()) {
        return;
      }
      const selections = editor.getSelections();
      const selectionsLength = selections.length;
      let willOvertype = false;
      for (let i = 0; i < selectionsLength; i++) {
        if (!selections[i].isEmpty()) {
          willOvertype = true;
          break;
        }
      }
      if (!willOvertype) {
        if (this._lastOvertyped.length !== 0) {
          this._lastOvertyped.length = 0;
        }
        return;
      }
      this._lastOvertyped = [];
      const model = editor.getModel();
      for (let i = 0; i < selectionsLength; i++) {
        const selection = selections[i];
        if (model.getValueLengthInRange(selection) > _OvertypingCapturer._maxSelectionLength) {
          return;
        }
        this._lastOvertyped[i] = { value: model.getValueInRange(selection), multiline: selection.startLineNumber !== selection.endLineNumber };
      }
    }));
    this._disposables.add(suggestModel.onDidTrigger((e) => {
      this._locked = true;
    }));
    this._disposables.add(suggestModel.onDidCancel((e) => {
      this._locked = false;
    }));
  }
  getLastOvertypedInfo(idx) {
    if (idx >= 0 && idx < this._lastOvertyped.length) {
      return this._lastOvertyped[idx];
    }
    return void 0;
  }
  dispose() {
    this._disposables.dispose();
  }
};
_OvertypingCapturer._maxSelectionLength = 51200;
var OvertypingCapturer = _OvertypingCapturer;

// node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js
var __decorate9 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param9 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var EmbeddedCodeEditorWidget = class EmbeddedCodeEditorWidget2 extends CodeEditorWidget {
  constructor(domElement, options, codeEditorWidgetOptions, parentEditor, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService) {
    super(domElement, { ...parentEditor.getRawOptions(), overflowWidgetsDomNode: parentEditor.getOverflowWidgetsDomNode() }, codeEditorWidgetOptions, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService);
    this._parentEditor = parentEditor;
    this._overwriteOptions = options;
    super.updateOptions(this._overwriteOptions);
    this._register(parentEditor.onDidChangeConfiguration((e) => this._onParentConfigurationChanged(e)));
  }
  getParentEditor() {
    return this._parentEditor;
  }
  _onParentConfigurationChanged(e) {
    super.updateOptions(this._parentEditor.getRawOptions());
    super.updateOptions(this._overwriteOptions);
  }
  updateOptions(newOptions) {
    mixin(this._overwriteOptions, newOptions, true);
    super.updateOptions(this._overwriteOptions);
  }
};
EmbeddedCodeEditorWidget = __decorate9([
  __param9(4, IInstantiationService),
  __param9(5, ICodeEditorService),
  __param9(6, ICommandService),
  __param9(7, IContextKeyService),
  __param9(8, IThemeService),
  __param9(9, INotificationService),
  __param9(10, IAccessibilityService),
  __param9(11, ILanguageConfigurationService),
  __param9(12, ILanguageFeaturesService)
], EmbeddedCodeEditorWidget);

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestWidgetStatus.js
var __decorate10 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param10 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SuggestWidgetStatus = class SuggestWidgetStatus2 {
  constructor(container, _menuId, instantiationService, _menuService, _contextKeyService) {
    this._menuId = _menuId;
    this._menuService = _menuService;
    this._contextKeyService = _contextKeyService;
    this._menuDisposables = new DisposableStore();
    this.element = append(container, $(".suggest-status-bar"));
    const actionViewItemProvider = ((action) => {
      return action instanceof MenuItemAction ? instantiationService.createInstance(TextOnlyMenuEntryActionViewItem, action, { useComma: false }) : void 0;
    });
    this._leftActions = new ActionBar(this.element, { actionViewItemProvider });
    this._rightActions = new ActionBar(this.element, { actionViewItemProvider });
    this._leftActions.domNode.classList.add("left");
    this._rightActions.domNode.classList.add("right");
  }
  dispose() {
    this._menuDisposables.dispose();
    this._leftActions.dispose();
    this._rightActions.dispose();
    this.element.remove();
  }
  show() {
    const menu = this._menuService.createMenu(this._menuId, this._contextKeyService);
    const renderMenu = () => {
      const left = [];
      const right = [];
      for (const [group, actions] of menu.getActions()) {
        if (group === "left") {
          left.push(...actions);
        } else {
          right.push(...actions);
        }
      }
      this._leftActions.clear();
      this._leftActions.push(left);
      this._rightActions.clear();
      this._rightActions.push(right);
    };
    this._menuDisposables.add(menu.onDidChange(() => renderMenu()));
    this._menuDisposables.add(menu);
  }
  hide() {
    this._menuDisposables.clear();
  }
};
SuggestWidgetStatus = __decorate10([
  __param10(2, IInstantiationService),
  __param10(3, IMenuService),
  __param10(4, IContextKeyService)
], SuggestWidgetStatus);

// node_modules/monaco-editor/esm/vs/editor/contrib/symbolIcons/browser/symbolIcons.js
registerColor("symbolIcon.arrayForeground", foreground, localize(1495, "The foreground color for array symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.booleanForeground", foreground, localize(1496, "The foreground color for boolean symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.classForeground", {
  dark: "#EE9D28",
  light: "#D67E00",
  hcDark: "#EE9D28",
  hcLight: "#D67E00"
}, localize(1497, "The foreground color for class symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.colorForeground", foreground, localize(1498, "The foreground color for color symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.constantForeground", foreground, localize(1499, "The foreground color for constant symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.constructorForeground", {
  dark: "#B180D7",
  light: "#652D90",
  hcDark: "#B180D7",
  hcLight: "#652D90"
}, localize(1500, "The foreground color for constructor symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.enumeratorForeground", {
  dark: "#EE9D28",
  light: "#D67E00",
  hcDark: "#EE9D28",
  hcLight: "#D67E00"
}, localize(1501, "The foreground color for enumerator symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.enumeratorMemberForeground", {
  dark: "#75BEFF",
  light: "#007ACC",
  hcDark: "#75BEFF",
  hcLight: "#007ACC"
}, localize(1502, "The foreground color for enumerator member symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.eventForeground", {
  dark: "#EE9D28",
  light: "#D67E00",
  hcDark: "#EE9D28",
  hcLight: "#D67E00"
}, localize(1503, "The foreground color for event symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.fieldForeground", {
  dark: "#75BEFF",
  light: "#007ACC",
  hcDark: "#75BEFF",
  hcLight: "#007ACC"
}, localize(1504, "The foreground color for field symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.fileForeground", foreground, localize(1505, "The foreground color for file symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.folderForeground", foreground, localize(1506, "The foreground color for folder symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.functionForeground", {
  dark: "#B180D7",
  light: "#652D90",
  hcDark: "#B180D7",
  hcLight: "#652D90"
}, localize(1507, "The foreground color for function symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.interfaceForeground", {
  dark: "#75BEFF",
  light: "#007ACC",
  hcDark: "#75BEFF",
  hcLight: "#007ACC"
}, localize(1508, "The foreground color for interface symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.keyForeground", foreground, localize(1509, "The foreground color for key symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.keywordForeground", foreground, localize(1510, "The foreground color for keyword symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.methodForeground", {
  dark: "#B180D7",
  light: "#652D90",
  hcDark: "#B180D7",
  hcLight: "#652D90"
}, localize(1511, "The foreground color for method symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.moduleForeground", foreground, localize(1512, "The foreground color for module symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.namespaceForeground", foreground, localize(1513, "The foreground color for namespace symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.nullForeground", foreground, localize(1514, "The foreground color for null symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.numberForeground", foreground, localize(1515, "The foreground color for number symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.objectForeground", foreground, localize(1516, "The foreground color for object symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.operatorForeground", foreground, localize(1517, "The foreground color for operator symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.packageForeground", foreground, localize(1518, "The foreground color for package symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.propertyForeground", foreground, localize(1519, "The foreground color for property symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.referenceForeground", foreground, localize(1520, "The foreground color for reference symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.snippetForeground", foreground, localize(1521, "The foreground color for snippet symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.stringForeground", foreground, localize(1522, "The foreground color for string symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.structForeground", foreground, localize(1523, "The foreground color for struct symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.textForeground", foreground, localize(1524, "The foreground color for text symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.typeParameterForeground", foreground, localize(1525, "The foreground color for type parameter symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.unitForeground", foreground, localize(1526, "The foreground color for unit symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));
registerColor("symbolIcon.variableForeground", {
  dark: "#75BEFF",
  light: "#007ACC",
  hcDark: "#75BEFF",
  hcLight: "#007ACC"
}, localize(1527, "The foreground color for variable symbols. These symbols appear in the outline, breadcrumb, and suggest widget."));

// node_modules/monaco-editor/esm/vs/base/browser/ui/resizable/resizable.js
var ResizableHTMLElement = class {
  get onDidWillResize() {
    return this._onDidWillResize.event;
  }
  get onDidResize() {
    return this._onDidResize.event;
  }
  constructor() {
    this._onDidWillResize = new Emitter();
    this._onDidResize = new Emitter();
    this._sashListener = new DisposableStore();
    this._size = new Dimension(0, 0);
    this._minSize = new Dimension(0, 0);
    this._maxSize = new Dimension(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    this.domNode = document.createElement("div");
    this._eastSash = new Sash(this.domNode, { getVerticalSashLeft: () => this._size.width }, {
      orientation: 0
      /* Orientation.VERTICAL */
    });
    this._westSash = new Sash(this.domNode, { getVerticalSashLeft: () => 0 }, {
      orientation: 0
      /* Orientation.VERTICAL */
    });
    this._northSash = new Sash(this.domNode, { getHorizontalSashTop: () => 0 }, { orientation: 1, orthogonalEdge: OrthogonalEdge.North });
    this._southSash = new Sash(this.domNode, { getHorizontalSashTop: () => this._size.height }, { orientation: 1, orthogonalEdge: OrthogonalEdge.South });
    this._northSash.orthogonalStartSash = this._westSash;
    this._northSash.orthogonalEndSash = this._eastSash;
    this._southSash.orthogonalStartSash = this._westSash;
    this._southSash.orthogonalEndSash = this._eastSash;
    let currentSize;
    let deltaY = 0;
    let deltaX = 0;
    this._sashListener.add(Event.any(this._northSash.onDidStart, this._eastSash.onDidStart, this._southSash.onDidStart, this._westSash.onDidStart)(() => {
      if (currentSize === void 0) {
        this._onDidWillResize.fire();
        currentSize = this._size;
        deltaY = 0;
        deltaX = 0;
      }
    }));
    this._sashListener.add(Event.any(this._northSash.onDidEnd, this._eastSash.onDidEnd, this._southSash.onDidEnd, this._westSash.onDidEnd)(() => {
      if (currentSize !== void 0) {
        currentSize = void 0;
        deltaY = 0;
        deltaX = 0;
        this._onDidResize.fire({ dimension: this._size, done: true });
      }
    }));
    this._sashListener.add(this._eastSash.onDidChange((e) => {
      if (currentSize) {
        deltaX = e.currentX - e.startX;
        this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
        this._onDidResize.fire({ dimension: this._size, done: false, east: true });
      }
    }));
    this._sashListener.add(this._westSash.onDidChange((e) => {
      if (currentSize) {
        deltaX = -(e.currentX - e.startX);
        this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
        this._onDidResize.fire({ dimension: this._size, done: false, west: true });
      }
    }));
    this._sashListener.add(this._northSash.onDidChange((e) => {
      if (currentSize) {
        deltaY = -(e.currentY - e.startY);
        this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
        this._onDidResize.fire({ dimension: this._size, done: false, north: true });
      }
    }));
    this._sashListener.add(this._southSash.onDidChange((e) => {
      if (currentSize) {
        deltaY = e.currentY - e.startY;
        this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
        this._onDidResize.fire({ dimension: this._size, done: false, south: true });
      }
    }));
    this._sashListener.add(Event.any(this._eastSash.onDidReset, this._westSash.onDidReset)((e) => {
      if (this._preferredSize) {
        this.layout(this._size.height, this._preferredSize.width);
        this._onDidResize.fire({ dimension: this._size, done: true });
      }
    }));
    this._sashListener.add(Event.any(this._northSash.onDidReset, this._southSash.onDidReset)((e) => {
      if (this._preferredSize) {
        this.layout(this._preferredSize.height, this._size.width);
        this._onDidResize.fire({ dimension: this._size, done: true });
      }
    }));
  }
  dispose() {
    this._northSash.dispose();
    this._southSash.dispose();
    this._eastSash.dispose();
    this._westSash.dispose();
    this._sashListener.dispose();
    this._onDidResize.dispose();
    this._onDidWillResize.dispose();
    this.domNode.remove();
  }
  enableSashes(north, east, south, west) {
    this._northSash.state = north ? 3 : 0;
    this._eastSash.state = east ? 3 : 0;
    this._southSash.state = south ? 3 : 0;
    this._westSash.state = west ? 3 : 0;
  }
  layout(height = this.size.height, width = this.size.width) {
    const { height: minHeight, width: minWidth } = this._minSize;
    const { height: maxHeight, width: maxWidth } = this._maxSize;
    height = Math.max(minHeight, Math.min(maxHeight, height));
    width = Math.max(minWidth, Math.min(maxWidth, width));
    const newSize = new Dimension(width, height);
    if (!Dimension.equals(newSize, this._size)) {
      this.domNode.style.height = height + "px";
      this.domNode.style.width = width + "px";
      this._size = newSize;
      this._northSash.layout();
      this._eastSash.layout();
      this._southSash.layout();
      this._westSash.layout();
    }
  }
  clearSashHoverState() {
    this._eastSash.clearSashHoverState();
    this._westSash.clearSashHoverState();
    this._northSash.clearSashHoverState();
    this._southSash.clearSashHoverState();
  }
  get size() {
    return this._size;
  }
  set maxSize(value) {
    this._maxSize = value;
  }
  get maxSize() {
    return this._maxSize;
  }
  set minSize(value) {
    this._minSize = value;
  }
  get minSize() {
    return this._minSize;
  }
  set preferredSize(value) {
    this._preferredSize = value;
  }
  get preferredSize() {
    return this._preferredSize;
  }
};

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestWidgetDetails.js
var __decorate11 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param11 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
function canExpandCompletionItem(item) {
  return !!item && Boolean(item.completion.documentation || item.completion.detail && item.completion.detail !== item.completion.label);
}
var SuggestDetailsWidget = class SuggestDetailsWidget2 {
  constructor(_editor, _themeService, _markdownRendererService) {
    this._editor = _editor;
    this._themeService = _themeService;
    this._markdownRendererService = _markdownRendererService;
    this._onDidClose = new Emitter();
    this.onDidClose = this._onDidClose.event;
    this._onDidChangeContents = new Emitter();
    this.onDidChangeContents = this._onDidChangeContents.event;
    this._disposables = new DisposableStore();
    this._renderDisposeable = new DisposableStore();
    this._size = new Dimension(330, 0);
    this.domNode = $(".suggest-details");
    this.domNode.classList.add("no-docs");
    this._body = $(".body");
    this._scrollbar = new DomScrollableElement(this._body, {
      alwaysConsumeMouseWheel: true
    });
    append(this.domNode, this._scrollbar.getDomNode());
    this._disposables.add(this._scrollbar);
    this._header = append(this._body, $(".header"));
    this._close = append(this._header, $("span" + ThemeIcon.asCSSSelector(Codicon.close)));
    this._close.title = localize(1490, "Close");
    this._close.role = "button";
    this._close.tabIndex = -1;
    this._type = append(this._header, $("p.type"));
    this._docs = append(this._body, $("p.docs"));
    this._configureFont();
    this._disposables.add(this._editor.onDidChangeConfiguration((e) => {
      if (e.hasChanged(
        59
        /* EditorOption.fontInfo */
      )) {
        this._configureFont();
      }
    }));
  }
  dispose() {
    this._disposables.dispose();
    this._renderDisposeable.dispose();
  }
  _configureFont() {
    const options = this._editor.getOptions();
    const fontInfo = options.get(
      59
      /* EditorOption.fontInfo */
    );
    const fontFamily = fontInfo.getMassagedFontFamily();
    const fontSize = options.get(
      135
      /* EditorOption.suggestFontSize */
    ) || fontInfo.fontSize;
    const lineHeight = options.get(
      136
      /* EditorOption.suggestLineHeight */
    ) || fontInfo.lineHeight;
    const fontWeight = fontInfo.fontWeight;
    const fontSizePx = `${fontSize}px`;
    const lineHeightPx = `${lineHeight}px`;
    this.domNode.style.fontSize = fontSizePx;
    this.domNode.style.lineHeight = `${lineHeight / fontSize}`;
    this.domNode.style.fontWeight = fontWeight;
    this.domNode.style.fontFeatureSettings = fontInfo.fontFeatureSettings;
    this._type.style.fontFamily = fontFamily;
    this._close.style.height = lineHeightPx;
    this._close.style.width = lineHeightPx;
  }
  getLayoutInfo() {
    const lineHeight = this._editor.getOption(
      136
      /* EditorOption.suggestLineHeight */
    ) || this._editor.getOption(
      59
      /* EditorOption.fontInfo */
    ).lineHeight;
    const borderWidth = isHighContrast(this._themeService.getColorTheme().type) ? 2 : 1;
    const borderHeight = borderWidth * 2;
    return {
      lineHeight,
      borderWidth,
      borderHeight,
      verticalPadding: 22,
      horizontalPadding: 14
    };
  }
  renderLoading() {
    this._type.textContent = localize(1491, "Loading...");
    this._docs.textContent = "";
    this.domNode.classList.remove("no-docs", "no-type");
    this.layout(this.size.width, this.getLayoutInfo().lineHeight * 2);
    this._onDidChangeContents.fire(this);
  }
  renderItem(item, explainMode) {
    this._renderDisposeable.clear();
    let { detail, documentation } = item.completion;
    if (explainMode) {
      let md = "";
      md += `score: ${item.score[0]}
`;
      md += `prefix: ${item.word ?? "(no prefix)"}
`;
      md += `word: ${item.completion.filterText ? item.completion.filterText + " (filterText)" : item.textLabel}
`;
      md += `distance: ${item.distance} (localityBonus-setting)
`;
      md += `index: ${item.idx}, based on ${item.completion.sortText && `sortText: "${item.completion.sortText}"` || "label"}
`;
      md += `commit_chars: ${item.completion.commitCharacters?.join("")}
`;
      documentation = new MarkdownString().appendCodeblock("empty", md);
      detail = `Provider: ${item.provider._debugDisplayName}`;
    }
    if (!explainMode && !canExpandCompletionItem(item)) {
      this.clearContents();
      return;
    }
    this.domNode.classList.remove("no-docs", "no-type");
    if (detail) {
      const cappedDetail = detail.length > 1e5 ? `${detail.substr(0, 1e5)}\u2026` : detail;
      this._type.textContent = cappedDetail;
      this._type.title = cappedDetail;
      show(this._type);
      this._type.classList.toggle("auto-wrap", !/\r?\n^\s+/gmi.test(cappedDetail));
    } else {
      clearNode(this._type);
      this._type.title = "";
      hide(this._type);
      this.domNode.classList.add("no-type");
    }
    clearNode(this._docs);
    if (typeof documentation === "string") {
      this._docs.classList.remove("markdown-docs");
      this._docs.textContent = documentation;
    } else if (documentation) {
      this._docs.classList.add("markdown-docs");
      clearNode(this._docs);
      const renderedContents = this._markdownRendererService.render(documentation, {
        context: this._editor,
        asyncRenderCallback: () => {
          this.layout(this._size.width, this._type.clientHeight + this._docs.clientHeight);
          this._onDidChangeContents.fire(this);
        }
      });
      this._docs.appendChild(renderedContents.element);
      this._renderDisposeable.add(renderedContents);
    }
    this.domNode.classList.toggle("detail-and-doc", !!detail && !!documentation);
    this.domNode.style.userSelect = "text";
    this.domNode.tabIndex = -1;
    this._close.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    this._close.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._onDidClose.fire();
    };
    this._body.scrollTop = 0;
    this.layout(this._size.width, this._type.clientHeight + this._docs.clientHeight);
    this._onDidChangeContents.fire(this);
  }
  clearContents() {
    this.domNode.classList.add("no-docs");
    this._type.textContent = "";
    this._docs.textContent = "";
  }
  get isEmpty() {
    return this.domNode.classList.contains("no-docs");
  }
  get size() {
    return this._size;
  }
  layout(width, height) {
    const newSize = new Dimension(width, height);
    if (!Dimension.equals(newSize, this._size)) {
      this._size = newSize;
      size(this.domNode, width, height);
    }
    this._scrollbar.scanDomNode();
  }
  scrollDown(much = 8) {
    this._body.scrollTop += much;
  }
  scrollUp(much = 8) {
    this._body.scrollTop -= much;
  }
  scrollTop() {
    this._body.scrollTop = 0;
  }
  scrollBottom() {
    this._body.scrollTop = this._body.scrollHeight;
  }
  pageDown() {
    this.scrollDown(80);
  }
  pageUp() {
    this.scrollUp(80);
  }
  focus() {
    this.domNode.focus();
  }
};
SuggestDetailsWidget = __decorate11([
  __param11(1, IThemeService),
  __param11(2, IMarkdownRendererService)
], SuggestDetailsWidget);
var SuggestDetailsOverlay = class {
  constructor(widget, _editor) {
    this.widget = widget;
    this._editor = _editor;
    this.allowEditorOverflow = true;
    this._disposables = new DisposableStore();
    this._added = false;
    this._preferAlignAtTop = true;
    this._resizable = new ResizableHTMLElement();
    this._resizable.domNode.classList.add("suggest-details-container");
    this._resizable.domNode.appendChild(widget.domNode);
    this._resizable.enableSashes(false, true, true, false);
    let topLeftNow;
    let sizeNow;
    let deltaTop = 0;
    let deltaLeft = 0;
    this._disposables.add(this._resizable.onDidWillResize(() => {
      topLeftNow = this._topLeft;
      sizeNow = this._resizable.size;
    }));
    this._disposables.add(this._resizable.onDidResize((e) => {
      if (topLeftNow && sizeNow) {
        this.widget.layout(e.dimension.width, e.dimension.height);
        let updateTopLeft = false;
        if (e.west) {
          deltaLeft = sizeNow.width - e.dimension.width;
          updateTopLeft = true;
        }
        if (e.north) {
          deltaTop = sizeNow.height - e.dimension.height;
          updateTopLeft = true;
        }
        if (updateTopLeft) {
          this._applyTopLeft({
            top: topLeftNow.top + deltaTop,
            left: topLeftNow.left + deltaLeft
          });
        }
      }
      if (e.done) {
        topLeftNow = void 0;
        sizeNow = void 0;
        deltaTop = 0;
        deltaLeft = 0;
        this._userSize = e.dimension;
      }
    }));
    this._disposables.add(this.widget.onDidChangeContents(() => {
      if (this._anchorBox) {
        this._placeAtAnchor(this._anchorBox, this._userSize ?? this.widget.size, this._preferAlignAtTop);
      }
    }));
  }
  dispose() {
    this._resizable.dispose();
    this._disposables.dispose();
    this.hide();
  }
  getId() {
    return "suggest.details";
  }
  getDomNode() {
    return this._resizable.domNode;
  }
  getPosition() {
    return this._topLeft ? { preference: this._topLeft } : null;
  }
  show() {
    if (!this._added) {
      this._editor.addOverlayWidget(this);
      this._added = true;
    }
  }
  hide(sessionEnded = false) {
    this._resizable.clearSashHoverState();
    if (this._added) {
      this._editor.removeOverlayWidget(this);
      this._added = false;
      this._anchorBox = void 0;
      this._topLeft = void 0;
    }
    if (sessionEnded) {
      this._userSize = void 0;
      this.widget.clearContents();
    }
  }
  placeAtAnchor(anchor, preferAlignAtTop) {
    const anchorBox = anchor.getBoundingClientRect();
    this._anchorBox = anchorBox;
    this._preferAlignAtTop = preferAlignAtTop;
    this._placeAtAnchor(this._anchorBox, this._userSize ?? this.widget.size, preferAlignAtTop);
  }
  _placeAtAnchor(anchorBox, size2, preferAlignAtTop) {
    const bodyBox = getClientArea(this.getDomNode().ownerDocument.body);
    const info = this.widget.getLayoutInfo();
    const defaultMinSize = new Dimension(220, 2 * info.lineHeight);
    const defaultTop = anchorBox.top;
    const eastPlacement = (function() {
      const width = bodyBox.width - (anchorBox.left + anchorBox.width + info.borderWidth + info.horizontalPadding);
      const left2 = -info.borderWidth + anchorBox.left + anchorBox.width;
      const maxSizeTop = new Dimension(width, bodyBox.height - anchorBox.top - info.borderHeight - info.verticalPadding);
      const maxSizeBottom = maxSizeTop.with(void 0, anchorBox.top + anchorBox.height - info.borderHeight - info.verticalPadding);
      return { top: defaultTop, left: left2, fit: width - size2.width, maxSizeTop, maxSizeBottom, minSize: defaultMinSize.with(Math.min(width, defaultMinSize.width)) };
    })();
    const westPlacement = (function() {
      const width = anchorBox.left - info.borderWidth - info.horizontalPadding;
      const left2 = Math.max(info.horizontalPadding, anchorBox.left - size2.width - info.borderWidth);
      const maxSizeTop = new Dimension(width, bodyBox.height - anchorBox.top - info.borderHeight - info.verticalPadding);
      const maxSizeBottom = maxSizeTop.with(void 0, anchorBox.top + anchorBox.height - info.borderHeight - info.verticalPadding);
      return { top: defaultTop, left: left2, fit: width - size2.width, maxSizeTop, maxSizeBottom, minSize: defaultMinSize.with(Math.min(width, defaultMinSize.width)) };
    })();
    const southPacement = (function() {
      const left2 = anchorBox.left;
      const top2 = -info.borderWidth + anchorBox.top + anchorBox.height;
      const maxSizeBottom = new Dimension(anchorBox.width - info.borderHeight, bodyBox.height - anchorBox.top - anchorBox.height - info.verticalPadding);
      return { top: top2, left: left2, fit: maxSizeBottom.height - size2.height, maxSizeBottom, maxSizeTop: maxSizeBottom, minSize: defaultMinSize.with(maxSizeBottom.width) };
    })();
    const placements = [eastPlacement, westPlacement, southPacement];
    const placement = placements.find((p) => p.fit >= 0) ?? placements.sort((a, b) => b.fit - a.fit)[0];
    const bottom = anchorBox.top + anchorBox.height - info.borderHeight;
    let alignAtTop;
    let height = size2.height;
    const maxHeight = Math.max(placement.maxSizeTop.height, placement.maxSizeBottom.height);
    if (height > maxHeight) {
      height = maxHeight;
    }
    let maxSize;
    if (preferAlignAtTop) {
      if (height <= placement.maxSizeTop.height) {
        alignAtTop = true;
        maxSize = placement.maxSizeTop;
      } else {
        alignAtTop = false;
        maxSize = placement.maxSizeBottom;
      }
    } else {
      if (height <= placement.maxSizeBottom.height) {
        alignAtTop = false;
        maxSize = placement.maxSizeBottom;
      } else {
        alignAtTop = true;
        maxSize = placement.maxSizeTop;
      }
    }
    let { top, left } = placement;
    if (!alignAtTop && height > anchorBox.height) {
      top = bottom - height;
    }
    const editorDomNode = this._editor.getDomNode();
    if (editorDomNode) {
      const editorBoundingBox = editorDomNode.getBoundingClientRect();
      top -= editorBoundingBox.top;
      left -= editorBoundingBox.left;
    }
    this._applyTopLeft({ left, top });
    this._resizable.enableSashes(!alignAtTop, placement === eastPlacement, alignAtTop, placement !== eastPlacement);
    this._resizable.minSize = placement.minSize;
    this._resizable.maxSize = maxSize;
    this._resizable.layout(height, Math.min(maxSize.width, size2.width));
    this.widget.layout(this._resizable.size.width, this._resizable.size.height);
  }
  _applyTopLeft(topLeft) {
    this._topLeft = topLeft;
    this._editor.layoutOverlayWidget(this);
  }
};

// node_modules/monaco-editor/esm/vs/platform/files/common/files.js
var IFileService = createDecorator("fileService");
var FileKind;
(function(FileKind2) {
  FileKind2[FileKind2["FILE"] = 0] = "FILE";
  FileKind2[FileKind2["FOLDER"] = 1] = "FOLDER";
  FileKind2[FileKind2["ROOT_FOLDER"] = 2] = "ROOT_FOLDER";
})(FileKind || (FileKind = {}));

// node_modules/monaco-editor/esm/vs/editor/common/services/getIconClasses.js
var fileIconDirectoryRegex = /(?:\/|^)(?:([^\/]+)\/)?([^\/]+)$/;
function getIconClasses(modelService, languageService, resource, fileKind, icon) {
  if (ThemeIcon.isThemeIcon(icon)) {
    return [`codicon-${icon.id}`, "predefined-file-icon"];
  }
  if (URI.isUri(icon)) {
    return [];
  }
  const classes = fileKind === FileKind.ROOT_FOLDER ? ["rootfolder-icon"] : fileKind === FileKind.FOLDER ? ["folder-icon"] : ["file-icon"];
  if (resource) {
    let name;
    if (resource.scheme === Schemas.data) {
      const metadata = DataUri.parseMetaData(resource);
      name = metadata.get(DataUri.META_DATA_LABEL);
    } else {
      const match = resource.path.match(fileIconDirectoryRegex);
      if (match) {
        name = fileIconSelectorEscape(match[2].toLowerCase());
        if (match[1]) {
          classes.push(`${fileIconSelectorEscape(match[1].toLowerCase())}-name-dir-icon`);
        }
      } else {
        name = fileIconSelectorEscape(resource.authority.toLowerCase());
      }
    }
    if (fileKind === FileKind.ROOT_FOLDER) {
      classes.push(`${name}-root-name-folder-icon`);
    } else if (fileKind === FileKind.FOLDER) {
      classes.push(`${name}-name-folder-icon`);
    } else {
      if (name) {
        classes.push(`${name}-name-file-icon`);
        classes.push(`name-file-icon`);
        if (name.length <= 255) {
          const dotSegments = name.split(".");
          for (let i = 1; i < dotSegments.length; i++) {
            classes.push(`${dotSegments.slice(i).join(".")}-ext-file-icon`);
          }
        }
        classes.push(`ext-file-icon`);
      }
      const detectedLanguageId = detectLanguageId(modelService, languageService, resource);
      if (detectedLanguageId) {
        classes.push(`${fileIconSelectorEscape(detectedLanguageId)}-lang-file-icon`);
      }
    }
  }
  return classes;
}
function detectLanguageId(modelService, languageService, resource) {
  if (!resource) {
    return null;
  }
  let languageId = null;
  if (resource.scheme === Schemas.data) {
    const metadata = DataUri.parseMetaData(resource);
    const mime = metadata.get(DataUri.META_DATA_MIME);
    if (mime) {
      languageId = languageService.getLanguageIdByMimeType(mime);
    }
  } else {
    const model = modelService.getModel(resource);
    if (model) {
      languageId = model.getLanguageId();
    }
  }
  if (languageId && languageId !== PLAINTEXT_LANGUAGE_ID) {
    return languageId;
  }
  return languageService.guessLanguageIdByFilepathOrFirstLine(resource);
}
function fileIconSelectorEscape(str) {
  return str.replace(/[\s]/g, "/");
}

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestWidgetRenderer.js
var __decorate12 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param12 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var suggestMoreInfoIcon = registerIcon("suggest-more-info", Codicon.chevronRight, localize(1492, "Icon for more information in the suggest widget."));
var _a5;
var _completionItemColor = new (_a5 = class {
  extract(item, out) {
    if (item.textLabel.match(_a5._regexStrict)) {
      out[0] = item.textLabel;
      return true;
    }
    if (item.completion.detail && item.completion.detail.match(_a5._regexStrict)) {
      out[0] = item.completion.detail;
      return true;
    }
    if (item.completion.documentation) {
      const value = typeof item.completion.documentation === "string" ? item.completion.documentation : item.completion.documentation.value;
      const match = _a5._regexRelaxed.exec(value);
      if (match && (match.index === 0 || match.index + match[0].length === value.length)) {
        out[0] = match[0];
        return true;
      }
    }
    return false;
  }
}, _a5._regexRelaxed = /(#([\da-fA-F]{3}){1,2}|(rgb|hsl)a\(\s*(\d{1,3}%?\s*,\s*){3}(1|0?\.\d+)\)|(rgb|hsl)\(\s*\d{1,3}%?(\s*,\s*\d{1,3}%?){2}\s*\))/, _a5._regexStrict = new RegExp(`^${_a5._regexRelaxed.source}$`, "i"), _a5)();
var ItemRenderer = class ItemRenderer2 {
  constructor(_editor, _modelService, _languageService, _themeService) {
    this._editor = _editor;
    this._modelService = _modelService;
    this._languageService = _languageService;
    this._themeService = _themeService;
    this._onDidToggleDetails = new Emitter();
    this.onDidToggleDetails = this._onDidToggleDetails.event;
    this.templateId = "suggestion";
  }
  dispose() {
    this._onDidToggleDetails.dispose();
  }
  renderTemplate(container) {
    const disposables = new DisposableStore();
    const root = container;
    root.classList.add("show-file-icons");
    const icon = append(container, $(".icon"));
    const colorspan = append(icon, $("span.colorspan"));
    const text = append(container, $(".contents"));
    const main = append(text, $(".main"));
    const iconContainer = append(main, $(".icon-label.codicon"));
    const left = append(main, $("span.left"));
    const right = append(main, $("span.right"));
    const iconLabel = new IconLabel(left, { supportHighlights: true, supportIcons: true });
    disposables.add(iconLabel);
    const parametersLabel = append(left, $("span.signature-label"));
    const qualifierLabel = append(left, $("span.qualifier-label"));
    const detailsLabel = append(right, $("span.details-label"));
    const readMore = append(right, $("span.readMore" + ThemeIcon.asCSSSelector(suggestMoreInfoIcon)));
    readMore.title = localize(1493, "Read More");
    const configureFont = () => {
      const options = this._editor.getOptions();
      const fontInfo = options.get(
        59
        /* EditorOption.fontInfo */
      );
      const fontFamily = fontInfo.getMassagedFontFamily();
      const fontFeatureSettings = fontInfo.fontFeatureSettings;
      const fontVariationSettings = fontInfo.fontVariationSettings;
      const fontSize = options.get(
        135
        /* EditorOption.suggestFontSize */
      ) || fontInfo.fontSize;
      const lineHeight = options.get(
        136
        /* EditorOption.suggestLineHeight */
      ) || fontInfo.lineHeight;
      const fontWeight = fontInfo.fontWeight;
      const letterSpacing = fontInfo.letterSpacing;
      const fontSizePx = `${fontSize}px`;
      const lineHeightPx = `${lineHeight}px`;
      const letterSpacingPx = `${letterSpacing}px`;
      root.style.fontSize = fontSizePx;
      root.style.fontWeight = fontWeight;
      root.style.letterSpacing = letterSpacingPx;
      main.style.fontFamily = fontFamily;
      main.style.fontFeatureSettings = fontFeatureSettings;
      main.style.fontVariationSettings = fontVariationSettings;
      main.style.lineHeight = lineHeightPx;
      icon.style.height = lineHeightPx;
      icon.style.width = lineHeightPx;
      readMore.style.height = lineHeightPx;
      readMore.style.width = lineHeightPx;
    };
    return { root, left, right, icon, colorspan, iconLabel, iconContainer, parametersLabel, qualifierLabel, detailsLabel, readMore, disposables, configureFont };
  }
  renderElement(element, index, data) {
    data.configureFont();
    const { completion } = element;
    data.colorspan.style.backgroundColor = "";
    const labelOptions = {
      labelEscapeNewLines: true,
      matches: createMatches(element.score)
    };
    const color = [];
    if (completion.kind === 19 && _completionItemColor.extract(element, color)) {
      data.icon.className = "icon customcolor";
      data.iconContainer.className = "icon hide";
      data.colorspan.style.backgroundColor = color[0];
    } else if (completion.kind === 20 && this._themeService.getFileIconTheme().hasFileIcons) {
      data.icon.className = "icon hide";
      data.iconContainer.className = "icon hide";
      const labelClasses = getIconClasses(this._modelService, this._languageService, URI.from({ scheme: "fake", path: element.textLabel }), FileKind.FILE);
      const detailClasses = getIconClasses(this._modelService, this._languageService, URI.from({ scheme: "fake", path: completion.detail }), FileKind.FILE);
      labelOptions.extraClasses = labelClasses.length > detailClasses.length ? labelClasses : detailClasses;
    } else if (completion.kind === 23 && this._themeService.getFileIconTheme().hasFolderIcons) {
      data.icon.className = "icon hide";
      data.iconContainer.className = "icon hide";
      labelOptions.extraClasses = [
        getIconClasses(this._modelService, this._languageService, URI.from({ scheme: "fake", path: element.textLabel }), FileKind.FOLDER),
        getIconClasses(this._modelService, this._languageService, URI.from({ scheme: "fake", path: completion.detail }), FileKind.FOLDER)
      ].flat();
    } else {
      data.icon.className = "icon hide";
      data.iconContainer.className = "";
      data.iconContainer.classList.add("suggest-icon", ...ThemeIcon.asClassNameArray(CompletionItemKinds.toIcon(completion.kind)));
    }
    if (completion.tags && completion.tags.indexOf(
      1
      /* CompletionItemTag.Deprecated */
    ) >= 0) {
      labelOptions.extraClasses = (labelOptions.extraClasses || []).concat(["deprecated"]);
      labelOptions.matches = [];
    }
    data.iconLabel.setLabel(element.textLabel, void 0, labelOptions);
    if (typeof completion.label === "string") {
      data.parametersLabel.textContent = "";
      data.detailsLabel.textContent = stripNewLines(completion.detail || "");
      data.root.classList.add("string-label");
    } else {
      data.parametersLabel.textContent = stripNewLines(completion.label.detail || "");
      data.detailsLabel.textContent = stripNewLines(completion.label.description || "");
      data.root.classList.remove("string-label");
    }
    if (this._editor.getOption(
      134
      /* EditorOption.suggest */
    ).showInlineDetails) {
      show(data.detailsLabel);
    } else {
      hide(data.detailsLabel);
    }
    if (canExpandCompletionItem(element)) {
      data.right.classList.add("can-expand-details");
      show(data.readMore);
      data.readMore.onmousedown = (e) => {
        e.stopPropagation();
        e.preventDefault();
      };
      data.readMore.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this._onDidToggleDetails.fire();
      };
    } else {
      data.right.classList.remove("can-expand-details");
      hide(data.readMore);
      data.readMore.onmousedown = null;
      data.readMore.onclick = null;
    }
  }
  disposeTemplate(templateData) {
    templateData.disposables.dispose();
  }
};
ItemRenderer = __decorate12([
  __param12(1, IModelService),
  __param12(2, ILanguageService),
  __param12(3, IThemeService)
], ItemRenderer);
function stripNewLines(str) {
  return str.replace(/\r\n|\r|\n/g, "");
}

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestWidget.js
var __decorate13 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param13 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SuggestWidget_1;
registerColor("editorSuggestWidget.background", editorWidgetBackground, localize(1473, "Background color of the suggest widget."));
registerColor("editorSuggestWidget.border", editorWidgetBorder, localize(1474, "Border color of the suggest widget."));
var editorSuggestWidgetForeground = registerColor("editorSuggestWidget.foreground", editorForeground, localize(1475, "Foreground color of the suggest widget."));
registerColor("editorSuggestWidget.selectedForeground", quickInputListFocusForeground, localize(1476, "Foreground color of the selected entry in the suggest widget."));
registerColor("editorSuggestWidget.selectedIconForeground", quickInputListFocusIconForeground, localize(1477, "Icon foreground color of the selected entry in the suggest widget."));
var editorSuggestWidgetSelectedBackground = registerColor("editorSuggestWidget.selectedBackground", quickInputListFocusBackground, localize(1478, "Background color of the selected entry in the suggest widget."));
registerColor("editorSuggestWidget.highlightForeground", listHighlightForeground, localize(1479, "Color of the match highlights in the suggest widget."));
registerColor("editorSuggestWidget.focusHighlightForeground", listFocusHighlightForeground, localize(1480, "Color of the match highlights in the suggest widget when an item is focused."));
registerColor("editorSuggestWidgetStatus.foreground", transparent(editorSuggestWidgetForeground, 0.5), localize(1481, "Foreground color of the suggest widget status."));
var PersistedWidgetSize = class {
  constructor(_service, editor) {
    this._service = _service;
    this._key = `suggestWidget.size/${editor.getEditorType()}/${editor instanceof EmbeddedCodeEditorWidget}`;
  }
  restore() {
    const raw = this._service.get(
      this._key,
      0
      /* StorageScope.PROFILE */
    ) ?? "";
    try {
      const obj = JSON.parse(raw);
      if (Dimension.is(obj)) {
        return Dimension.lift(obj);
      }
    } catch {
    }
    return void 0;
  }
  store(size2) {
    this._service.store(
      this._key,
      JSON.stringify(size2),
      0,
      1
      /* StorageTarget.MACHINE */
    );
  }
  reset() {
    this._service.remove(
      this._key,
      0
      /* StorageScope.PROFILE */
    );
  }
};
var _a6;
var SuggestWidget = (_a6 = class {
  constructor(editor, _storageService, _contextKeyService, _themeService, instantiationService) {
    this.editor = editor;
    this._storageService = _storageService;
    this._state = 0;
    this._isAuto = false;
    this._pendingLayout = new MutableDisposable();
    this._pendingShowDetails = new MutableDisposable();
    this._ignoreFocusEvents = false;
    this._forceRenderingAbove = false;
    this._explainMode = false;
    this._showTimeout = new TimeoutTimer();
    this._disposables = new DisposableStore();
    this._onDidSelect = new PauseableEmitter();
    this._onDidFocus = new PauseableEmitter();
    this._onDidHide = new Emitter();
    this._onDidShow = new Emitter();
    this.onDidSelect = this._onDidSelect.event;
    this.onDidFocus = this._onDidFocus.event;
    this.onDidHide = this._onDidHide.event;
    this.onDidShow = this._onDidShow.event;
    this._onDetailsKeydown = new Emitter();
    this.onDetailsKeyDown = this._onDetailsKeydown.event;
    this.element = new ResizableHTMLElement();
    this.element.domNode.classList.add("editor-widget", "suggest-widget");
    this._contentWidget = new SuggestContentWidget(this, editor);
    this._persistedSize = new PersistedWidgetSize(_storageService, editor);
    class ResizeState {
      constructor(persistedSize, currentSize, persistHeight = false, persistWidth = false) {
        this.persistedSize = persistedSize;
        this.currentSize = currentSize;
        this.persistHeight = persistHeight;
        this.persistWidth = persistWidth;
      }
    }
    let state;
    this._disposables.add(this.element.onDidWillResize(() => {
      this._contentWidget.lockPreference();
      state = new ResizeState(this._persistedSize.restore(), this.element.size);
    }));
    this._disposables.add(this.element.onDidResize((e) => {
      this._resize(e.dimension.width, e.dimension.height);
      if (state) {
        state.persistHeight = state.persistHeight || !!e.north || !!e.south;
        state.persistWidth = state.persistWidth || !!e.east || !!e.west;
      }
      if (!e.done) {
        return;
      }
      if (state) {
        const { itemHeight, defaultSize } = this.getLayoutInfo();
        const threshold = Math.round(itemHeight / 2);
        let { width, height } = this.element.size;
        if (!state.persistHeight || Math.abs(state.currentSize.height - height) <= threshold) {
          height = state.persistedSize?.height ?? defaultSize.height;
        }
        if (!state.persistWidth || Math.abs(state.currentSize.width - width) <= threshold) {
          width = state.persistedSize?.width ?? defaultSize.width;
        }
        this._persistedSize.store(new Dimension(width, height));
      }
      this._contentWidget.unlockPreference();
      state = void 0;
    }));
    this._messageElement = append(this.element.domNode, $(".message"));
    this._listElement = append(this.element.domNode, $(".tree"));
    const details = this._disposables.add(instantiationService.createInstance(SuggestDetailsWidget, this.editor));
    details.onDidClose(() => this.toggleDetails(), this, this._disposables);
    this._details = new SuggestDetailsOverlay(details, this.editor);
    const applyIconStyle = () => this.element.domNode.classList.toggle("no-icons", !this.editor.getOption(
      134
      /* EditorOption.suggest */
    ).showIcons);
    applyIconStyle();
    const renderer = instantiationService.createInstance(ItemRenderer, this.editor);
    this._disposables.add(renderer);
    this._disposables.add(renderer.onDidToggleDetails(() => this.toggleDetails()));
    this._list = new List("SuggestWidget", this._listElement, {
      getHeight: (_element) => this.getLayoutInfo().itemHeight,
      getTemplateId: (_element) => "suggestion"
    }, [renderer], {
      alwaysConsumeMouseWheel: true,
      useShadows: false,
      mouseSupport: false,
      multipleSelectionSupport: false,
      accessibilityProvider: {
        getRole: () => isWindows ? "listitem" : "option",
        getWidgetAriaLabel: () => localize(1484, "Suggest"),
        getWidgetRole: () => "listbox",
        getAriaLabel: (item) => {
          let label = item.textLabel;
          const kindLabel = CompletionItemKinds.toLabel(item.completion.kind);
          if (typeof item.completion.label !== "string") {
            const { detail: detail2, description } = item.completion.label;
            if (detail2 && description) {
              label = localize(1485, "{0} {1}, {2}, {3}", label, detail2, description, kindLabel);
            } else if (detail2) {
              label = localize(1486, "{0} {1}, {2}", label, detail2, kindLabel);
            } else if (description) {
              label = localize(1487, "{0}, {1}, {2}", label, description, kindLabel);
            }
          } else {
            label = localize(1488, "{0}, {1}", label, kindLabel);
          }
          if (!item.isResolved || !this._isDetailsVisible()) {
            return label;
          }
          const { documentation, detail } = item.completion;
          const docs = format("{0}{1}", detail || "", documentation ? typeof documentation === "string" ? documentation : documentation.value : "");
          return localize(1489, "{0}, docs: {1}", label, docs);
        }
      }
    });
    this._list.style(getListStyles({
      listInactiveFocusBackground: editorSuggestWidgetSelectedBackground,
      listInactiveFocusOutline: activeContrastBorder
    }));
    this._status = instantiationService.createInstance(SuggestWidgetStatus, this.element.domNode, suggestWidgetStatusbarMenu);
    const applyStatusBarStyle = () => this.element.domNode.classList.toggle("with-status-bar", this.editor.getOption(
      134
      /* EditorOption.suggest */
    ).showStatusBar);
    applyStatusBarStyle();
    this._disposables.add(this._list.onMouseDown((e) => this._onListMouseDownOrTap(e)));
    this._disposables.add(this._list.onTap((e) => this._onListMouseDownOrTap(e)));
    this._disposables.add(this._list.onDidChangeSelection((e) => this._onListSelection(e)));
    this._disposables.add(this._list.onDidChangeFocus((e) => this._onListFocus(e)));
    this._disposables.add(this.editor.onDidChangeCursorSelection(() => this._onCursorSelectionChanged()));
    this._disposables.add(this.editor.onDidChangeConfiguration((e) => {
      if (e.hasChanged(
        134
        /* EditorOption.suggest */
      )) {
        applyStatusBarStyle();
        applyIconStyle();
      }
      if (this._completionModel && (e.hasChanged(
        59
        /* EditorOption.fontInfo */
      ) || e.hasChanged(
        135
        /* EditorOption.suggestFontSize */
      ) || e.hasChanged(
        136
        /* EditorOption.suggestLineHeight */
      ))) {
        this._list.splice(0, this._list.length, this._completionModel.items);
      }
    }));
    this._ctxSuggestWidgetVisible = Context.Visible.bindTo(_contextKeyService);
    this._ctxSuggestWidgetDetailsVisible = Context.DetailsVisible.bindTo(_contextKeyService);
    this._ctxSuggestWidgetMultipleSuggestions = Context.MultipleSuggestions.bindTo(_contextKeyService);
    this._ctxSuggestWidgetHasFocusedSuggestion = Context.HasFocusedSuggestion.bindTo(_contextKeyService);
    this._disposables.add(addStandardDisposableListener(this._details.widget.domNode, "keydown", (e) => {
      this._onDetailsKeydown.fire(e);
    }));
    this._disposables.add(this.editor.onMouseDown((e) => this._onEditorMouseDown(e)));
  }
  dispose() {
    this._details.widget.dispose();
    this._details.dispose();
    this._list.dispose();
    this._status.dispose();
    this._disposables.dispose();
    this._loadingTimeout?.dispose();
    this._pendingLayout.dispose();
    this._pendingShowDetails.dispose();
    this._showTimeout.dispose();
    this._contentWidget.dispose();
    this.element.dispose();
  }
  _onEditorMouseDown(mouseEvent) {
    if (this._details.widget.domNode.contains(mouseEvent.target.element)) {
      this._details.widget.domNode.focus();
    } else {
      if (this.element.domNode.contains(mouseEvent.target.element)) {
        this.editor.focus();
      }
    }
  }
  _onCursorSelectionChanged() {
    if (this._state !== 0) {
      this._contentWidget.layout();
    }
  }
  _onListMouseDownOrTap(e) {
    if (typeof e.element === "undefined" || typeof e.index === "undefined") {
      return;
    }
    e.browserEvent.preventDefault();
    e.browserEvent.stopPropagation();
    this._select(e.element, e.index);
  }
  _onListSelection(e) {
    if (e.elements.length) {
      this._select(e.elements[0], e.indexes[0]);
    }
  }
  _select(item, index) {
    const completionModel = this._completionModel;
    if (completionModel) {
      this._onDidSelect.fire({ item, index, model: completionModel });
      this.editor.focus();
    }
  }
  _onListFocus(e) {
    if (this._ignoreFocusEvents) {
      return;
    }
    if (this._state === 5) {
      this._setState(
        3
        /* State.Open */
      );
    }
    if (!e.elements.length) {
      if (this._currentSuggestionDetails) {
        this._currentSuggestionDetails.cancel();
        this._currentSuggestionDetails = void 0;
        this._focusedItem = void 0;
      }
      this.editor.setAriaOptions({ activeDescendant: void 0 });
      this._ctxSuggestWidgetHasFocusedSuggestion.set(false);
      return;
    }
    if (!this._completionModel) {
      return;
    }
    this._ctxSuggestWidgetHasFocusedSuggestion.set(true);
    const item = e.elements[0];
    const index = e.indexes[0];
    if (item !== this._focusedItem) {
      this._currentSuggestionDetails?.cancel();
      this._currentSuggestionDetails = void 0;
      this._focusedItem = item;
      this._list.reveal(index);
      this._currentSuggestionDetails = createCancelablePromise(async (token) => {
        const loading = disposableTimeout(() => {
          if (this._isDetailsVisible()) {
            this._showDetails(true, false);
          }
        }, 250);
        const sub = token.onCancellationRequested(() => loading.dispose());
        try {
          return await item.resolve(token);
        } finally {
          loading.dispose();
          sub.dispose();
        }
      });
      this._currentSuggestionDetails.then(() => {
        if (index >= this._list.length || item !== this._list.element(index)) {
          return;
        }
        this._ignoreFocusEvents = true;
        this._list.splice(index, 1, [item]);
        this._list.setFocus([index]);
        this._ignoreFocusEvents = false;
        if (this._isDetailsVisible()) {
          this._showDetails(false, false);
        } else {
          this.element.domNode.classList.remove("docs-side");
        }
        this.editor.setAriaOptions({ activeDescendant: this._list.getElementID(index) });
      }).catch(onUnexpectedError);
    }
    this._onDidFocus.fire({ item, index, model: this._completionModel });
  }
  _setState(state) {
    if (this._state === state) {
      return;
    }
    this._state = state;
    this.element.domNode.classList.toggle(
      "frozen",
      state === 4
      /* State.Frozen */
    );
    this.element.domNode.classList.remove("message");
    switch (state) {
      case 0:
        hide(this._messageElement, this._listElement, this._status.element);
        this._details.hide(true);
        this._status.hide();
        this._contentWidget.hide();
        this._ctxSuggestWidgetVisible.reset();
        this._ctxSuggestWidgetMultipleSuggestions.reset();
        this._ctxSuggestWidgetHasFocusedSuggestion.reset();
        this._showTimeout.cancel();
        this.element.domNode.classList.remove("visible");
        this._list.splice(0, this._list.length);
        this._focusedItem = void 0;
        this._cappedHeight = void 0;
        this._explainMode = false;
        break;
      case 1:
        this.element.domNode.classList.add("message");
        this._messageElement.textContent = SuggestWidget_1.LOADING_MESSAGE;
        hide(this._listElement, this._status.element);
        show(this._messageElement);
        this._details.hide();
        this._show();
        this._focusedItem = void 0;
        status(SuggestWidget_1.LOADING_MESSAGE);
        break;
      case 2:
        this.element.domNode.classList.add("message");
        this._messageElement.textContent = SuggestWidget_1.NO_SUGGESTIONS_MESSAGE;
        hide(this._listElement, this._status.element);
        show(this._messageElement);
        this._details.hide();
        this._show();
        this._focusedItem = void 0;
        status(SuggestWidget_1.NO_SUGGESTIONS_MESSAGE);
        break;
      case 3:
        hide(this._messageElement);
        show(this._listElement, this._status.element);
        this._show();
        break;
      case 4:
        hide(this._messageElement);
        show(this._listElement, this._status.element);
        this._show();
        break;
      case 5:
        hide(this._messageElement);
        show(this._listElement, this._status.element);
        this._details.show();
        this._show();
        this._details.widget.focus();
        break;
    }
  }
  _show() {
    this._status.show();
    this._contentWidget.show();
    this._layout(this._persistedSize.restore());
    this._ctxSuggestWidgetVisible.set(true);
    this._showTimeout.cancelAndSet(() => {
      this.element.domNode.classList.add("visible");
      this._onDidShow.fire(this);
    }, 100);
  }
  showTriggered(auto, delay) {
    if (this._state !== 0) {
      return;
    }
    this._contentWidget.setPosition(this.editor.getPosition());
    this._isAuto = !!auto;
    if (!this._isAuto) {
      this._loadingTimeout = disposableTimeout(() => this._setState(
        1
        /* State.Loading */
      ), delay);
    }
  }
  showSuggestions(completionModel, selectionIndex, isFrozen, isAuto, noFocus) {
    this._contentWidget.setPosition(this.editor.getPosition());
    this._loadingTimeout?.dispose();
    this._currentSuggestionDetails?.cancel();
    this._currentSuggestionDetails = void 0;
    if (this._completionModel !== completionModel) {
      this._completionModel = completionModel;
    }
    if (isFrozen && this._state !== 2 && this._state !== 0) {
      this._setState(
        4
        /* State.Frozen */
      );
      return;
    }
    const visibleCount = this._completionModel.items.length;
    const isEmpty = visibleCount === 0;
    this._ctxSuggestWidgetMultipleSuggestions.set(visibleCount > 1);
    if (isEmpty) {
      this._setState(
        isAuto ? 0 : 2
        /* State.Empty */
      );
      this._completionModel = void 0;
      return;
    }
    this._focusedItem = void 0;
    this._onDidFocus.pause();
    this._onDidSelect.pause();
    try {
      this._list.splice(0, this._list.length, this._completionModel.items);
      this._setState(
        isFrozen ? 4 : 3
        /* State.Open */
      );
      this._list.reveal(selectionIndex, 0, selectionIndex === 0 ? 0 : this.getLayoutInfo().itemHeight * 0.33);
      this._list.setFocus(noFocus ? [] : [selectionIndex]);
    } finally {
      this._onDidFocus.resume();
      this._onDidSelect.resume();
    }
    this._pendingLayout.value = runAtThisOrScheduleAtNextAnimationFrame(getWindow(this.element.domNode), () => {
      this._pendingLayout.clear();
      this._layout(this.element.size);
      this._details.widget.domNode.classList.remove("focused");
    });
  }
  focusSelected() {
    if (this._list.length > 0) {
      this._list.setFocus([0]);
    }
  }
  selectNextPage() {
    switch (this._state) {
      case 0:
        return false;
      case 5:
        this._details.widget.pageDown();
        return true;
      case 1:
        return !this._isAuto;
      default:
        this._list.focusNextPage();
        return true;
    }
  }
  selectNext() {
    switch (this._state) {
      case 0:
        return false;
      case 1:
        return !this._isAuto;
      default:
        this._list.focusNext(1, true);
        return true;
    }
  }
  selectLast() {
    switch (this._state) {
      case 0:
        return false;
      case 5:
        this._details.widget.scrollBottom();
        return true;
      case 1:
        return !this._isAuto;
      default:
        this._list.focusLast();
        return true;
    }
  }
  selectPreviousPage() {
    switch (this._state) {
      case 0:
        return false;
      case 5:
        this._details.widget.pageUp();
        return true;
      case 1:
        return !this._isAuto;
      default:
        this._list.focusPreviousPage();
        return true;
    }
  }
  selectPrevious() {
    switch (this._state) {
      case 0:
        return false;
      case 1:
        return !this._isAuto;
      default:
        this._list.focusPrevious(1, true);
        return false;
    }
  }
  selectFirst() {
    switch (this._state) {
      case 0:
        return false;
      case 5:
        this._details.widget.scrollTop();
        return true;
      case 1:
        return !this._isAuto;
      default:
        this._list.focusFirst();
        return true;
    }
  }
  getFocusedItem() {
    if (this._state !== 0 && this._state !== 2 && this._state !== 1 && this._completionModel && this._list.getFocus().length > 0) {
      return {
        item: this._list.getFocusedElements()[0],
        index: this._list.getFocus()[0],
        model: this._completionModel
      };
    }
    return void 0;
  }
  toggleDetailsFocus() {
    if (this._state === 5) {
      this._list.setFocus(this._list.getFocus());
      this._setState(
        3
        /* State.Open */
      );
    } else if (this._state === 3) {
      this._setState(
        5
        /* State.Details */
      );
      if (!this._isDetailsVisible()) {
        this.toggleDetails(true);
      } else {
        this._details.widget.focus();
      }
    }
  }
  toggleDetails(focused = false) {
    if (this._isDetailsVisible()) {
      this._pendingShowDetails.clear();
      this._ctxSuggestWidgetDetailsVisible.set(false);
      this._setDetailsVisible(false);
      this._details.hide();
      this.element.domNode.classList.remove("shows-details");
    } else if ((canExpandCompletionItem(this._list.getFocusedElements()[0]) || this._explainMode) && (this._state === 3 || this._state === 5 || this._state === 4)) {
      this._ctxSuggestWidgetDetailsVisible.set(true);
      this._setDetailsVisible(true);
      this._showDetails(false, focused);
    }
  }
  _showDetails(loading, focused) {
    this._pendingShowDetails.value = runAtThisOrScheduleAtNextAnimationFrame(getWindow(this.element.domNode), () => {
      this._pendingShowDetails.clear();
      this._details.show();
      let didFocusDetails = false;
      if (loading) {
        this._details.widget.renderLoading();
      } else {
        this._details.widget.renderItem(this._list.getFocusedElements()[0], this._explainMode);
      }
      if (!this._details.widget.isEmpty) {
        this._positionDetails();
        this.element.domNode.classList.add("shows-details");
        if (focused) {
          this._details.widget.focus();
          didFocusDetails = true;
        }
      } else {
        this._details.hide();
      }
      if (!didFocusDetails) {
        this.editor.focus();
      }
    });
  }
  toggleExplainMode() {
    if (this._list.getFocusedElements()[0]) {
      this._explainMode = !this._explainMode;
      if (!this._isDetailsVisible()) {
        this.toggleDetails();
      } else {
        this._showDetails(false, false);
      }
    }
  }
  resetPersistedSize() {
    this._persistedSize.reset();
  }
  hideWidget() {
    this._pendingLayout.clear();
    this._pendingShowDetails.clear();
    this._loadingTimeout?.dispose();
    this._setState(
      0
      /* State.Hidden */
    );
    this._onDidHide.fire(this);
    this.element.clearSashHoverState();
    const dim = this._persistedSize.restore();
    const minPersistedHeight = Math.ceil(this.getLayoutInfo().itemHeight * 4.3);
    if (dim && dim.height < minPersistedHeight) {
      this._persistedSize.store(dim.with(void 0, minPersistedHeight));
    }
  }
  isFrozen() {
    return this._state === 4;
  }
  _afterRender(position) {
    if (position === null) {
      if (this._isDetailsVisible()) {
        this._details.hide();
      }
      return;
    }
    if (this._state === 2 || this._state === 1) {
      return;
    }
    if (this._isDetailsVisible() && !this._details.widget.isEmpty) {
      this._details.show();
    }
    this._positionDetails();
  }
  _layout(size2) {
    if (!this.editor.hasModel()) {
      return;
    }
    if (!this.editor.getDomNode()) {
      return;
    }
    const bodyBox = getClientArea(this.element.domNode.ownerDocument.body);
    const info = this.getLayoutInfo();
    if (!size2) {
      size2 = info.defaultSize;
    }
    let height = size2.height;
    let width = size2.width;
    this._status.element.style.height = `${info.itemHeight}px`;
    if (this._state === 2 || this._state === 1) {
      height = info.itemHeight + info.borderHeight;
      width = info.defaultSize.width / 2;
      this.element.enableSashes(false, false, false, false);
      this.element.minSize = this.element.maxSize = new Dimension(width, height);
      this._contentWidget.setPreference(
        2
        /* ContentWidgetPositionPreference.BELOW */
      );
    } else {
      const maxWidth = bodyBox.width - info.borderHeight - 2 * info.horizontalPadding;
      if (width > maxWidth) {
        width = maxWidth;
      }
      const preferredWidth = this._completionModel ? this._completionModel.stats.pLabelLen * info.typicalHalfwidthCharacterWidth : width;
      const fullHeight = info.statusBarHeight + this._list.contentHeight + info.borderHeight;
      const minHeight = info.itemHeight + info.statusBarHeight;
      const editorBox = getDomNodePagePosition(this.editor.getDomNode());
      const cursorBox = this.editor.getScrolledVisiblePosition(this.editor.getPosition());
      const cursorBottom = editorBox.top + cursorBox.top + cursorBox.height;
      const maxHeightBelow = Math.min(bodyBox.height - cursorBottom - info.verticalPadding, fullHeight);
      const availableSpaceAbove = editorBox.top + cursorBox.top - info.verticalPadding;
      const maxHeightAbove = Math.min(availableSpaceAbove, fullHeight);
      let maxHeight = Math.min(Math.max(maxHeightAbove, maxHeightBelow) + info.borderHeight, fullHeight);
      if (height === this._cappedHeight?.capped) {
        height = this._cappedHeight.wanted;
      }
      if (height < minHeight) {
        height = minHeight;
      }
      if (height > maxHeight) {
        height = maxHeight;
      }
      const forceRenderingAboveRequiredSpace = 150;
      if (height > maxHeightBelow && maxHeightAbove > maxHeightBelow || this._forceRenderingAbove && availableSpaceAbove > forceRenderingAboveRequiredSpace) {
        this._contentWidget.setPreference(
          1
          /* ContentWidgetPositionPreference.ABOVE */
        );
        this.element.enableSashes(true, true, false, false);
        maxHeight = maxHeightAbove;
      } else {
        this._contentWidget.setPreference(
          2
          /* ContentWidgetPositionPreference.BELOW */
        );
        this.element.enableSashes(false, true, true, false);
        maxHeight = maxHeightBelow;
      }
      this.element.preferredSize = new Dimension(preferredWidth, info.defaultSize.height);
      this.element.maxSize = new Dimension(maxWidth, maxHeight);
      this.element.minSize = new Dimension(220, minHeight);
      this._cappedHeight = height === fullHeight ? { wanted: this._cappedHeight?.wanted ?? size2.height, capped: height } : void 0;
    }
    this._resize(width, height);
  }
  _resize(width, height) {
    const { width: maxWidth, height: maxHeight } = this.element.maxSize;
    width = Math.min(maxWidth, width);
    height = Math.min(maxHeight, height);
    const { statusBarHeight } = this.getLayoutInfo();
    this._list.layout(height - statusBarHeight, width);
    this._listElement.style.height = `${height - statusBarHeight}px`;
    this.element.layout(height, width);
    this._contentWidget.layout();
    this._positionDetails();
  }
  _positionDetails() {
    if (this._isDetailsVisible()) {
      this._details.placeAtAnchor(
        this.element.domNode,
        this._contentWidget.getPosition()?.preference[0] === 2
        /* ContentWidgetPositionPreference.BELOW */
      );
    }
  }
  getLayoutInfo() {
    const fontInfo = this.editor.getOption(
      59
      /* EditorOption.fontInfo */
    );
    const itemHeight = clamp(this.editor.getOption(
      136
      /* EditorOption.suggestLineHeight */
    ) || fontInfo.lineHeight, 8, 1e3);
    const statusBarHeight = !this.editor.getOption(
      134
      /* EditorOption.suggest */
    ).showStatusBar || this._state === 2 || this._state === 1 ? 0 : itemHeight;
    const borderWidth = this._details.widget.getLayoutInfo().borderWidth;
    const borderHeight = 2 * borderWidth;
    return {
      itemHeight,
      statusBarHeight,
      borderWidth,
      borderHeight,
      typicalHalfwidthCharacterWidth: fontInfo.typicalHalfwidthCharacterWidth,
      verticalPadding: 22,
      horizontalPadding: 14,
      defaultSize: new Dimension(430, statusBarHeight + 12 * itemHeight)
    };
  }
  _isDetailsVisible() {
    return this._storageService.getBoolean("expandSuggestionDocs", 0, false);
  }
  _setDetailsVisible(value) {
    this._storageService.store(
      "expandSuggestionDocs",
      value,
      0,
      0
      /* StorageTarget.USER */
    );
  }
  forceRenderingAbove() {
    if (!this._forceRenderingAbove) {
      this._forceRenderingAbove = true;
      this._layout(this._persistedSize.restore());
    }
  }
  stopForceRenderingAbove() {
    this._forceRenderingAbove = false;
  }
}, SuggestWidget_1 = _a6, _a6.LOADING_MESSAGE = localize(1482, "Loading..."), _a6.NO_SUGGESTIONS_MESSAGE = localize(1483, "No suggestions."), _a6);
SuggestWidget = SuggestWidget_1 = __decorate13([
  __param13(1, IStorageService),
  __param13(2, IContextKeyService),
  __param13(3, IThemeService),
  __param13(4, IInstantiationService)
], SuggestWidget);
var SuggestContentWidget = class {
  constructor(_widget, _editor) {
    this._widget = _widget;
    this._editor = _editor;
    this.allowEditorOverflow = true;
    this.suppressMouseDown = false;
    this._preferenceLocked = false;
    this._added = false;
    this._hidden = false;
  }
  dispose() {
    if (this._added) {
      this._added = false;
      this._editor.removeContentWidget(this);
    }
  }
  getId() {
    return "editor.widget.suggestWidget";
  }
  getDomNode() {
    return this._widget.element.domNode;
  }
  show() {
    this._hidden = false;
    if (!this._added) {
      this._added = true;
      this._editor.addContentWidget(this);
    }
  }
  hide() {
    if (!this._hidden) {
      this._hidden = true;
      this.layout();
    }
  }
  layout() {
    this._editor.layoutContentWidget(this);
  }
  getPosition() {
    if (this._hidden || !this._position || !this._preference) {
      return null;
    }
    return {
      position: this._position,
      preference: [this._preference]
    };
  }
  beforeRender() {
    const { height, width } = this._widget.element.size;
    const { borderWidth, horizontalPadding } = this._widget.getLayoutInfo();
    return new Dimension(width + 2 * borderWidth + horizontalPadding, height + 2 * borderWidth);
  }
  afterRender(position) {
    this._widget._afterRender(position);
  }
  setPreference(preference) {
    if (!this._preferenceLocked) {
      this._preference = preference;
    }
  }
  lockPreference() {
    this._preferenceLocked = true;
  }
  unlockPreference() {
    this._preferenceLocked = false;
  }
  setPosition(position) {
    this._position = position;
  }
};

// node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js
var __decorate14 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param14 = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var SuggestController_1;
var LineSuffix = class {
  constructor(_model, _position) {
    this._model = _model;
    this._position = _position;
    this._decorationOptions = ModelDecorationOptions.register({
      description: "suggest-line-suffix",
      stickiness: 1
      /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */
    });
    const maxColumn = _model.getLineMaxColumn(_position.lineNumber);
    if (maxColumn !== _position.column) {
      const offset = _model.getOffsetAt(_position);
      const end = _model.getPositionAt(offset + 1);
      _model.changeDecorations((accessor) => {
        if (this._marker) {
          accessor.removeDecoration(this._marker);
        }
        this._marker = accessor.addDecoration(Range.fromPositions(_position, end), this._decorationOptions);
      });
    }
  }
  dispose() {
    if (this._marker && !this._model.isDisposed()) {
      this._model.changeDecorations((accessor) => {
        accessor.removeDecoration(this._marker);
        this._marker = void 0;
      });
    }
  }
  delta(position) {
    if (this._model.isDisposed() || this._position.lineNumber !== position.lineNumber) {
      return 0;
    }
    if (this._marker) {
      const range = this._model.getDecorationRange(this._marker);
      const end = this._model.getOffsetAt(range.getStartPosition());
      return end - this._model.getOffsetAt(position);
    } else {
      return this._model.getLineMaxColumn(position.lineNumber) - position.column;
    }
  }
};
var _a7;
var SuggestController = (_a7 = class {
  static get(editor) {
    return editor.getContribution(SuggestController_1.ID);
  }
  get onWillInsertSuggestItem() {
    return this._onWillInsertSuggestItem.event;
  }
  constructor(editor, _memoryService, _commandService, _contextKeyService, _instantiationService, _logService, _telemetryService) {
    this._memoryService = _memoryService;
    this._commandService = _commandService;
    this._contextKeyService = _contextKeyService;
    this._instantiationService = _instantiationService;
    this._logService = _logService;
    this._telemetryService = _telemetryService;
    this._lineSuffix = new MutableDisposable();
    this._toDispose = new DisposableStore();
    this._selectors = new PriorityRegistry((s) => s.priority);
    this._onWillInsertSuggestItem = new Emitter();
    this._wantsForceRenderingAbove = false;
    this.editor = editor;
    this.model = _instantiationService.createInstance(SuggestModel, this.editor);
    this._selectors.register({
      priority: 0,
      select: (model, pos, items) => this._memoryService.select(model, pos, items)
    });
    const ctxInsertMode = Context.InsertMode.bindTo(_contextKeyService);
    ctxInsertMode.set(editor.getOption(
      134
      /* EditorOption.suggest */
    ).insertMode);
    this._toDispose.add(this.model.onDidTrigger(() => ctxInsertMode.set(editor.getOption(
      134
      /* EditorOption.suggest */
    ).insertMode)));
    this.widget = this._toDispose.add(new WindowIdleValue(getWindow(editor.getDomNode()), () => {
      const widget = this._instantiationService.createInstance(SuggestWidget, this.editor);
      this._toDispose.add(widget);
      this._toDispose.add(widget.onDidSelect((item) => this._insertSuggestion(
        item,
        0
        /* InsertFlags.None */
      ), this));
      const commitCharacterController = new CommitCharacterController(this.editor, widget, this.model, (item) => this._insertSuggestion(
        item,
        2
        /* InsertFlags.NoAfterUndoStop */
      ));
      this._toDispose.add(commitCharacterController);
      const ctxMakesTextEdit = Context.MakesTextEdit.bindTo(this._contextKeyService);
      const ctxHasInsertAndReplace = Context.HasInsertAndReplaceRange.bindTo(this._contextKeyService);
      const ctxCanResolve = Context.CanResolve.bindTo(this._contextKeyService);
      this._toDispose.add(toDisposable(() => {
        ctxMakesTextEdit.reset();
        ctxHasInsertAndReplace.reset();
        ctxCanResolve.reset();
      }));
      this._toDispose.add(widget.onDidFocus(({ item }) => {
        const position = this.editor.getPosition();
        const startColumn = item.editStart.column;
        const endColumn = position.column;
        let value = true;
        if (this.editor.getOption(
          1
          /* EditorOption.acceptSuggestionOnEnter */
        ) === "smart" && this.model.state === 2 && !item.completion.additionalTextEdits && !(item.completion.insertTextRules & 4) && endColumn - startColumn === item.completion.insertText.length) {
          const oldText = this.editor.getModel().getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn,
            endLineNumber: position.lineNumber,
            endColumn
          });
          value = oldText !== item.completion.insertText;
        }
        ctxMakesTextEdit.set(value);
        ctxHasInsertAndReplace.set(!Position.equals(item.editInsertEnd, item.editReplaceEnd));
        ctxCanResolve.set(Boolean(item.provider.resolveCompletionItem) || Boolean(item.completion.documentation) || item.completion.detail !== item.completion.label);
      }));
      this._toDispose.add(widget.onDetailsKeyDown((e) => {
        if (e.toKeyCodeChord().equals(new KeyCodeChord(
          true,
          false,
          false,
          false,
          33
          /* KeyCode.KeyC */
        )) || isMacintosh && e.toKeyCodeChord().equals(new KeyCodeChord(
          false,
          false,
          false,
          true,
          33
          /* KeyCode.KeyC */
        ))) {
          e.stopPropagation();
          return;
        }
        if (!e.toKeyCodeChord().isModifierKey()) {
          this.editor.focus();
        }
      }));
      if (this._wantsForceRenderingAbove) {
        widget.forceRenderingAbove();
      }
      return widget;
    }));
    this._overtypingCapturer = this._toDispose.add(new WindowIdleValue(getWindow(editor.getDomNode()), () => {
      return this._toDispose.add(new OvertypingCapturer(this.editor, this.model));
    }));
    this._alternatives = this._toDispose.add(new WindowIdleValue(getWindow(editor.getDomNode()), () => {
      return this._toDispose.add(new SuggestAlternatives(this.editor, this._contextKeyService));
    }));
    this._toDispose.add(_instantiationService.createInstance(WordContextKey, editor));
    this._toDispose.add(this.model.onDidTrigger((e) => {
      this.widget.value.showTriggered(e.auto, e.shy ? 250 : 50);
      this._lineSuffix.value = new LineSuffix(this.editor.getModel(), e.position);
    }));
    this._toDispose.add(this.model.onDidSuggest((e) => {
      if (e.triggerOptions.shy) {
        return;
      }
      let index = -1;
      for (const selector of this._selectors.itemsOrderedByPriorityDesc) {
        index = selector.select(this.editor.getModel(), this.editor.getPosition(), e.completionModel.items);
        if (index !== -1) {
          break;
        }
      }
      if (index === -1) {
        index = 0;
      }
      if (this.model.state === 0) {
        return;
      }
      let noFocus = false;
      if (e.triggerOptions.auto) {
        const options = this.editor.getOption(
          134
          /* EditorOption.suggest */
        );
        if (options.selectionMode === "never" || options.selectionMode === "always") {
          noFocus = options.selectionMode === "never";
        } else if (options.selectionMode === "whenTriggerCharacter") {
          noFocus = e.triggerOptions.triggerKind !== 1;
        } else if (options.selectionMode === "whenQuickSuggestion") {
          noFocus = e.triggerOptions.triggerKind === 1 && !e.triggerOptions.refilter;
        }
      }
      this.widget.value.showSuggestions(e.completionModel, index, e.isFrozen, e.triggerOptions.auto, noFocus);
    }));
    this._toDispose.add(this.model.onDidCancel((e) => {
      if (!e.retrigger) {
        this.widget.value.hideWidget();
      }
    }));
    this._toDispose.add(this.editor.onDidBlurEditorWidget(() => {
      {
        this.model.cancel();
        this.model.clear();
      }
    }));
    const acceptSuggestionsOnEnter = Context.AcceptSuggestionsOnEnter.bindTo(_contextKeyService);
    const updateFromConfig = () => {
      const acceptSuggestionOnEnter = this.editor.getOption(
        1
        /* EditorOption.acceptSuggestionOnEnter */
      );
      acceptSuggestionsOnEnter.set(acceptSuggestionOnEnter === "on" || acceptSuggestionOnEnter === "smart");
    };
    this._toDispose.add(this.editor.onDidChangeConfiguration(() => updateFromConfig()));
    updateFromConfig();
  }
  dispose() {
    this._alternatives.dispose();
    this._toDispose.dispose();
    this.widget.dispose();
    this.model.dispose();
    this._lineSuffix.dispose();
    this._onWillInsertSuggestItem.dispose();
  }
  _insertSuggestion(event, flags) {
    if (!event || !event.item) {
      this._alternatives.value.reset();
      this.model.cancel();
      this.model.clear();
      return;
    }
    if (!this.editor.hasModel()) {
      return;
    }
    const snippetController = SnippetController2.get(this.editor);
    if (!snippetController) {
      return;
    }
    this._onWillInsertSuggestItem.fire({ item: event.item });
    const model = this.editor.getModel();
    const modelVersionNow = model.getAlternativeVersionId();
    const { item } = event;
    const tasks = [];
    const cts = new CancellationTokenSource();
    if (!(flags & 1)) {
      this.editor.pushUndoStop();
    }
    const info = this.getOverwriteInfo(item, Boolean(
      flags & 8
      /* InsertFlags.AlternativeOverwriteConfig */
    ));
    this._memoryService.memorize(model, this.editor.getPosition(), item);
    const isResolved = item.isResolved;
    let _commandExectionDuration = -1;
    let _additionalEditsAppliedAsync = -1;
    if (Array.isArray(item.completion.additionalTextEdits)) {
      this.model.cancel();
      const scrollState = StableEditorScrollState.capture(this.editor);
      this.editor.executeEdits("suggestController.additionalTextEdits.sync", item.completion.additionalTextEdits.map((edit) => {
        let range = Range.lift(edit.range);
        if (range.startLineNumber === item.position.lineNumber && range.startColumn > item.position.column) {
          const columnDelta = this.editor.getPosition().column - item.position.column;
          const startColumnDelta = columnDelta;
          const endColumnDelta = Range.spansMultipleLines(range) ? 0 : columnDelta;
          range = new Range(range.startLineNumber, range.startColumn + startColumnDelta, range.endLineNumber, range.endColumn + endColumnDelta);
        }
        return EditOperation.replaceMove(range, edit.text);
      }));
      scrollState.restoreRelativeVerticalPositionOfCursor(this.editor);
    } else if (!isResolved) {
      const sw = new StopWatch();
      let position;
      const docListener = model.onDidChangeContent((e) => {
        if (e.isFlush) {
          cts.cancel();
          docListener.dispose();
          return;
        }
        for (const change of e.changes) {
          const thisPosition = Range.getEndPosition(change.range);
          if (!position || Position.isBefore(thisPosition, position)) {
            position = thisPosition;
          }
        }
      });
      const oldFlags = flags;
      flags |= 2;
      let didType = false;
      const typeListener = this.editor.onWillType(() => {
        typeListener.dispose();
        didType = true;
        if (!(oldFlags & 2)) {
          this.editor.pushUndoStop();
        }
      });
      tasks.push(item.resolve(cts.token).then(() => {
        if (!item.completion.additionalTextEdits || cts.token.isCancellationRequested) {
          return void 0;
        }
        if (position && item.completion.additionalTextEdits.some((edit) => Position.isBefore(position, Range.getStartPosition(edit.range)))) {
          return false;
        }
        if (didType) {
          this.editor.pushUndoStop();
        }
        const scrollState = StableEditorScrollState.capture(this.editor);
        this.editor.executeEdits("suggestController.additionalTextEdits.async", item.completion.additionalTextEdits.map((edit) => EditOperation.replaceMove(Range.lift(edit.range), edit.text)));
        scrollState.restoreRelativeVerticalPositionOfCursor(this.editor);
        if (didType || !(oldFlags & 2)) {
          this.editor.pushUndoStop();
        }
        return true;
      }).then((applied) => {
        this._logService.trace("[suggest] async resolving of edits DONE (ms, applied?)", sw.elapsed(), applied);
        _additionalEditsAppliedAsync = applied === true ? 1 : applied === false ? 0 : -2;
      }).finally(() => {
        docListener.dispose();
        typeListener.dispose();
      }));
    }
    let { insertText } = item.completion;
    if (!(item.completion.insertTextRules & 4)) {
      insertText = SnippetParser.escape(insertText);
    }
    this.model.cancel();
    snippetController.insert(insertText, {
      overwriteBefore: info.overwriteBefore,
      overwriteAfter: info.overwriteAfter,
      undoStopBefore: false,
      undoStopAfter: false,
      adjustWhitespace: !(item.completion.insertTextRules & 1),
      clipboardText: event.model.clipboardText,
      overtypingCapturer: this._overtypingCapturer.value,
      reason: EditSources.suggest({ providerId: ProviderId.fromExtensionId(item.extensionId?.value) })
    });
    if (!(flags & 2)) {
      this.editor.pushUndoStop();
    }
    if (item.completion.command) {
      if (item.completion.command.id === TriggerSuggestAction.id) {
        this.model.trigger({ auto: true, retrigger: true });
      } else {
        const sw = new StopWatch();
        tasks.push(this._commandService.executeCommand(item.completion.command.id, ...item.completion.command.arguments ? [...item.completion.command.arguments] : []).catch((e) => {
          if (item.completion.extensionId) {
            onUnexpectedExternalError(e);
          } else {
            onUnexpectedError(e);
          }
        }).finally(() => {
          _commandExectionDuration = sw.elapsed();
        }));
      }
    }
    if (flags & 4) {
      this._alternatives.value.set(event, (next) => {
        cts.cancel();
        while (model.canUndo()) {
          if (modelVersionNow !== model.getAlternativeVersionId()) {
            model.undo();
          }
          this._insertSuggestion(next, 1 | 2 | (flags & 8 ? 8 : 0));
          break;
        }
      });
    }
    this._alertCompletionItem(item);
    Promise.all(tasks).finally(() => {
      this._reportSuggestionAcceptedTelemetry(item, model, isResolved, _commandExectionDuration, _additionalEditsAppliedAsync, event.index, event.model.items);
      this.model.clear();
      cts.dispose();
    });
  }
  _reportSuggestionAcceptedTelemetry(item, model, itemResolved, commandExectionDuration, additionalEditsAppliedAsync, index, completionItems) {
    if (Math.random() > 1e-4) {
      return;
    }
    const labelMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < Math.min(30, completionItems.length); i++) {
      const label = completionItems[i].textLabel;
      if (labelMap.has(label)) {
        labelMap.get(label).push(i);
      } else {
        labelMap.set(label, [i]);
      }
    }
    const firstIndexArray = labelMap.get(item.textLabel);
    const hasDuplicates = firstIndexArray && firstIndexArray.length > 1;
    const firstIndex = hasDuplicates ? firstIndexArray[0] : -1;
    this._telemetryService.publicLog2("suggest.acceptedSuggestion", {
      extensionId: item.extensionId?.value ?? "unknown",
      providerId: item.provider._debugDisplayName ?? "unknown",
      kind: item.completion.kind,
      basenameHash: hash(basename2(model.uri)).toString(16),
      languageId: model.getLanguageId(),
      fileExtension: extname(model.uri),
      resolveInfo: !item.provider.resolveCompletionItem ? -1 : itemResolved ? 1 : 0,
      resolveDuration: item.resolveDuration,
      commandDuration: commandExectionDuration,
      additionalEditsAsync: additionalEditsAppliedAsync,
      index,
      firstIndex
    });
  }
  getOverwriteInfo(item, toggleMode) {
    assertType(this.editor.hasModel());
    let replace = this.editor.getOption(
      134
      /* EditorOption.suggest */
    ).insertMode === "replace";
    if (toggleMode) {
      replace = !replace;
    }
    const overwriteBefore = item.position.column - item.editStart.column;
    const overwriteAfter = (replace ? item.editReplaceEnd.column : item.editInsertEnd.column) - item.position.column;
    const columnDelta = this.editor.getPosition().column - item.position.column;
    const suffixDelta = this._lineSuffix.value ? this._lineSuffix.value.delta(this.editor.getPosition()) : 0;
    return {
      overwriteBefore: overwriteBefore + columnDelta,
      overwriteAfter: overwriteAfter + suffixDelta
    };
  }
  _alertCompletionItem(item) {
    if (isNonEmptyArray(item.completion.additionalTextEdits)) {
      const msg = localize(1463, "Accepting '{0}' made {1} additional edits", item.textLabel, item.completion.additionalTextEdits.length);
      alert(msg);
    }
  }
  triggerSuggest(onlyFrom, auto, noFilter) {
    if (this.editor.hasModel()) {
      this.model.trigger({
        auto: auto ?? false,
        completionOptions: { providerFilter: onlyFrom, kindFilter: noFilter ? /* @__PURE__ */ new Set() : void 0 }
      });
      this.editor.revealPosition(
        this.editor.getPosition(),
        0
        /* ScrollType.Smooth */
      );
      this.editor.focus();
    }
  }
  triggerSuggestAndAcceptBest(arg) {
    if (!this.editor.hasModel()) {
      return;
    }
    const positionNow = this.editor.getPosition();
    const fallback = () => {
      if (positionNow.equals(this.editor.getPosition())) {
        this._commandService.executeCommand(arg.fallback);
      }
    };
    const makesTextEdit = (item) => {
      if (item.completion.insertTextRules & 4 || item.completion.additionalTextEdits) {
        return true;
      }
      const position = this.editor.getPosition();
      const startColumn = item.editStart.column;
      const endColumn = position.column;
      if (endColumn - startColumn !== item.completion.insertText.length) {
        return true;
      }
      const textNow = this.editor.getModel().getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn,
        endLineNumber: position.lineNumber,
        endColumn
      });
      return textNow !== item.completion.insertText;
    };
    Event.once(this.model.onDidTrigger)((_) => {
      const listener = [];
      Event.any(this.model.onDidTrigger, this.model.onDidCancel)(() => {
        dispose(listener);
        fallback();
      }, void 0, listener);
      this.model.onDidSuggest(({ completionModel }) => {
        dispose(listener);
        if (completionModel.items.length === 0) {
          fallback();
          return;
        }
        const index = this._memoryService.select(this.editor.getModel(), this.editor.getPosition(), completionModel.items);
        const item = completionModel.items[index];
        if (!makesTextEdit(item)) {
          fallback();
          return;
        }
        this.editor.pushUndoStop();
        this._insertSuggestion(
          { index, item, model: completionModel },
          4 | 1 | 2
          /* InsertFlags.NoAfterUndoStop */
        );
      }, void 0, listener);
    });
    this.model.trigger({ auto: false, shy: true });
    this.editor.revealPosition(
      positionNow,
      0
      /* ScrollType.Smooth */
    );
    this.editor.focus();
  }
  acceptSelectedSuggestion(keepAlternativeSuggestions, alternativeOverwriteConfig) {
    const item = this.widget.value.getFocusedItem();
    let flags = 0;
    if (keepAlternativeSuggestions) {
      flags |= 4;
    }
    if (alternativeOverwriteConfig) {
      flags |= 8;
    }
    this._insertSuggestion(item, flags);
  }
  acceptNextSuggestion() {
    this._alternatives.value.next();
  }
  acceptPrevSuggestion() {
    this._alternatives.value.prev();
  }
  cancelSuggestWidget() {
    this.model.cancel();
    this.model.clear();
    this.widget.value.hideWidget();
  }
  focusSuggestion() {
    this.widget.value.focusSelected();
  }
  selectNextSuggestion() {
    this.widget.value.selectNext();
  }
  selectNextPageSuggestion() {
    this.widget.value.selectNextPage();
  }
  selectLastSuggestion() {
    this.widget.value.selectLast();
  }
  selectPrevSuggestion() {
    this.widget.value.selectPrevious();
  }
  selectPrevPageSuggestion() {
    this.widget.value.selectPreviousPage();
  }
  selectFirstSuggestion() {
    this.widget.value.selectFirst();
  }
  toggleSuggestionDetails() {
    this.widget.value.toggleDetails();
  }
  toggleExplainMode() {
    this.widget.value.toggleExplainMode();
  }
  toggleSuggestionFocus() {
    this.widget.value.toggleDetailsFocus();
  }
  resetWidgetSize() {
    this.widget.value.resetPersistedSize();
  }
  forceRenderingAbove() {
    if (this.widget.isInitialized) {
      this.widget.value.forceRenderingAbove();
    } else {
      this._wantsForceRenderingAbove = true;
    }
  }
  stopForceRenderingAbove() {
    if (this.widget.isInitialized) {
      this.widget.value.stopForceRenderingAbove();
    } else {
      this._wantsForceRenderingAbove = false;
    }
  }
  registerSelector(selector) {
    return this._selectors.register(selector);
  }
}, SuggestController_1 = _a7, _a7.ID = "editor.contrib.suggestController", _a7);
SuggestController = SuggestController_1 = __decorate14([
  __param14(1, ISuggestMemoryService),
  __param14(2, ICommandService),
  __param14(3, IContextKeyService),
  __param14(4, IInstantiationService),
  __param14(5, ILogService),
  __param14(6, ITelemetryService)
], SuggestController);
var PriorityRegistry = class {
  constructor(prioritySelector) {
    this.prioritySelector = prioritySelector;
    this._items = new Array();
  }
  register(value) {
    if (this._items.indexOf(value) !== -1) {
      throw new Error("Value is already registered");
    }
    this._items.push(value);
    this._items.sort((s1, s2) => this.prioritySelector(s2) - this.prioritySelector(s1));
    return {
      dispose: () => {
        const idx = this._items.indexOf(value);
        if (idx >= 0) {
          this._items.splice(idx, 1);
        }
      }
    };
  }
  get itemsOrderedByPriorityDesc() {
    return this._items;
  }
};
var _TriggerSuggestAction = class _TriggerSuggestAction extends EditorAction {
  constructor() {
    super({
      id: _TriggerSuggestAction.id,
      label: localize2(1471, "Trigger Suggest"),
      precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCompletionItemProvider, Context.Visible.toNegated()),
      kbOpts: {
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2048 | 10,
        secondary: [
          2048 | 39
          /* KeyCode.KeyI */
        ],
        mac: { primary: 256 | 10, secondary: [
          512 | 9,
          2048 | 39
          /* KeyCode.KeyI */
        ] },
        weight: 100
        /* KeybindingWeight.EditorContrib */
      }
    });
  }
  run(_accessor, editor, args) {
    const controller = SuggestController.get(editor);
    if (!controller) {
      return;
    }
    let auto;
    if (args && typeof args === "object") {
      if (args.auto === true) {
        auto = true;
      }
    }
    controller.triggerSuggest(void 0, auto, void 0);
  }
};
_TriggerSuggestAction.id = "editor.action.triggerSuggest";
var TriggerSuggestAction = _TriggerSuggestAction;
registerEditorContribution(
  SuggestController.ID,
  SuggestController,
  2
  /* EditorContributionInstantiation.BeforeFirstInteraction */
);
registerEditorAction(TriggerSuggestAction);
var weight = 100 + 90;
var SuggestCommand = EditorCommand.bindToContribution(SuggestController.get);
registerEditorCommand(new SuggestCommand({
  id: "acceptSelectedSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, Context.HasFocusedSuggestion),
  handler(x) {
    x.acceptSelectedSuggestion(true, false);
  },
  kbOpts: [{
    // normal tab
    primary: 2,
    kbExpr: ContextKeyExpr.and(Context.Visible, EditorContextKeys.textInputFocus),
    weight
  }, {
    // accept on enter has special rules
    primary: 3,
    kbExpr: ContextKeyExpr.and(Context.Visible, EditorContextKeys.textInputFocus, Context.AcceptSuggestionsOnEnter, Context.MakesTextEdit),
    weight
  }],
  menuOpts: [{
    menuId: suggestWidgetStatusbarMenu,
    title: localize(1464, "Insert"),
    group: "left",
    order: 1,
    when: Context.HasInsertAndReplaceRange.toNegated()
  }, {
    menuId: suggestWidgetStatusbarMenu,
    title: localize(1465, "Insert"),
    group: "left",
    order: 1,
    when: ContextKeyExpr.and(Context.HasInsertAndReplaceRange, Context.InsertMode.isEqualTo("insert"))
  }, {
    menuId: suggestWidgetStatusbarMenu,
    title: localize(1466, "Replace"),
    group: "left",
    order: 1,
    when: ContextKeyExpr.and(Context.HasInsertAndReplaceRange, Context.InsertMode.isEqualTo("replace"))
  }]
}));
registerEditorCommand(new SuggestCommand({
  id: "acceptAlternativeSelectedSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, EditorContextKeys.textInputFocus, Context.HasFocusedSuggestion),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 1024 | 3,
    secondary: [
      1024 | 2
      /* KeyCode.Tab */
    ]
  },
  handler(x) {
    x.acceptSelectedSuggestion(false, true);
  },
  menuOpts: [{
    menuId: suggestWidgetStatusbarMenu,
    group: "left",
    order: 2,
    when: ContextKeyExpr.and(Context.HasInsertAndReplaceRange, Context.InsertMode.isEqualTo("insert")),
    title: localize(1467, "Replace")
  }, {
    menuId: suggestWidgetStatusbarMenu,
    group: "left",
    order: 2,
    when: ContextKeyExpr.and(Context.HasInsertAndReplaceRange, Context.InsertMode.isEqualTo("replace")),
    title: localize(1468, "Insert")
  }]
}));
CommandsRegistry.registerCommandAlias("acceptSelectedSuggestionOnEnter", "acceptSelectedSuggestion");
registerEditorCommand(new SuggestCommand({
  id: "hideSuggestWidget",
  precondition: Context.Visible,
  handler: (x) => x.cancelSuggestWidget(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 9,
    secondary: [
      1024 | 9
      /* KeyCode.Escape */
    ]
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "selectNextSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, ContextKeyExpr.or(Context.MultipleSuggestions, Context.HasFocusedSuggestion.negate())),
  handler: (c) => c.selectNextSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 18,
    secondary: [
      2048 | 18
      /* KeyCode.DownArrow */
    ],
    mac: { primary: 18, secondary: [
      2048 | 18,
      256 | 44
      /* KeyCode.KeyN */
    ] }
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "selectNextPageSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, ContextKeyExpr.or(Context.MultipleSuggestions, Context.HasFocusedSuggestion.negate())),
  handler: (c) => c.selectNextPageSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 12,
    secondary: [
      2048 | 12
      /* KeyCode.PageDown */
    ]
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "selectLastSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, ContextKeyExpr.or(Context.MultipleSuggestions, Context.HasFocusedSuggestion.negate())),
  handler: (c) => c.selectLastSuggestion()
}));
registerEditorCommand(new SuggestCommand({
  id: "selectPrevSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, ContextKeyExpr.or(Context.MultipleSuggestions, Context.HasFocusedSuggestion.negate())),
  handler: (c) => c.selectPrevSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 16,
    secondary: [
      2048 | 16
      /* KeyCode.UpArrow */
    ],
    mac: { primary: 16, secondary: [
      2048 | 16,
      256 | 46
      /* KeyCode.KeyP */
    ] }
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "selectPrevPageSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, ContextKeyExpr.or(Context.MultipleSuggestions, Context.HasFocusedSuggestion.negate())),
  handler: (c) => c.selectPrevPageSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 11,
    secondary: [
      2048 | 11
      /* KeyCode.PageUp */
    ]
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "selectFirstSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, ContextKeyExpr.or(Context.MultipleSuggestions, Context.HasFocusedSuggestion.negate())),
  handler: (c) => c.selectFirstSuggestion()
}));
registerEditorCommand(new SuggestCommand({
  id: "focusSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, Context.HasFocusedSuggestion.negate()),
  handler: (x) => x.focusSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 2048 | 10,
    secondary: [
      2048 | 39
      /* KeyCode.KeyI */
    ],
    mac: { primary: 256 | 10, secondary: [
      2048 | 39
      /* KeyCode.KeyI */
    ] }
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "focusAndAcceptSuggestion",
  precondition: ContextKeyExpr.and(Context.Visible, Context.HasFocusedSuggestion.negate()),
  handler: (c) => {
    c.focusSuggestion();
    c.acceptSelectedSuggestion(true, false);
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "toggleSuggestionDetails",
  precondition: ContextKeyExpr.and(Context.Visible, Context.HasFocusedSuggestion),
  handler: (x) => x.toggleSuggestionDetails(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 2048 | 10,
    secondary: [
      2048 | 39
      /* KeyCode.KeyI */
    ],
    mac: { primary: 256 | 10, secondary: [
      2048 | 39
      /* KeyCode.KeyI */
    ] }
  },
  menuOpts: [{
    menuId: suggestWidgetStatusbarMenu,
    group: "right",
    order: 1,
    when: ContextKeyExpr.and(Context.DetailsVisible, Context.CanResolve),
    title: localize(1469, "Show Less")
  }, {
    menuId: suggestWidgetStatusbarMenu,
    group: "right",
    order: 1,
    when: ContextKeyExpr.and(Context.DetailsVisible.toNegated(), Context.CanResolve),
    title: localize(1470, "Show More")
  }]
}));
registerEditorCommand(new SuggestCommand({
  id: "toggleExplainMode",
  precondition: Context.Visible,
  handler: (x) => x.toggleExplainMode(),
  kbOpts: {
    weight: 100,
    primary: 2048 | 90
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "toggleSuggestionFocus",
  precondition: Context.Visible,
  handler: (x) => x.toggleSuggestionFocus(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 2048 | 512 | 10,
    mac: {
      primary: 256 | 512 | 10
      /* KeyCode.Space */
    }
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "insertBestCompletion",
  precondition: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.equals("config.editor.tabCompletion", "on"), WordContextKey.AtEnd, Context.Visible.toNegated(), SuggestAlternatives.OtherSuggestions.toNegated(), SnippetController2.InSnippetMode.toNegated()),
  handler: (x, arg) => {
    x.triggerSuggestAndAcceptBest(isObject(arg) ? { fallback: "tab", ...arg } : { fallback: "tab" });
  },
  kbOpts: {
    weight,
    primary: 2
    /* KeyCode.Tab */
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "insertNextSuggestion",
  precondition: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.equals("config.editor.tabCompletion", "on"), SuggestAlternatives.OtherSuggestions, Context.Visible.toNegated(), SnippetController2.InSnippetMode.toNegated()),
  handler: (x) => x.acceptNextSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 2
    /* KeyCode.Tab */
  }
}));
registerEditorCommand(new SuggestCommand({
  id: "insertPrevSuggestion",
  precondition: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.equals("config.editor.tabCompletion", "on"), SuggestAlternatives.OtherSuggestions, Context.Visible.toNegated(), SnippetController2.InSnippetMode.toNegated()),
  handler: (x) => x.acceptPrevSuggestion(),
  kbOpts: {
    weight,
    kbExpr: EditorContextKeys.textInputFocus,
    primary: 1024 | 2
    /* KeyCode.Tab */
  }
}));
registerEditorAction(class extends EditorAction {
  constructor() {
    super({
      id: "editor.action.resetSuggestSize",
      label: localize2(1472, "Reset Suggest Widget Size"),
      precondition: void 0
    });
  }
  run(_accessor, editor) {
    SuggestController.get(editor)?.resetWidgetSize();
  }
});

// src/lambdaEditor.ts
var monacoPromise = null;
var completionRegistered = false;
var resolveCompletionFields = () => [];
var editors = [];
function triggerSuggest(editor) {
  const action = editor?.getAction?.("editor.action.triggerSuggest");
  if (!action || typeof action.run !== "function") return;
  void action.run().catch((err) => {
    console.warn("stdLambda suggest trigger failed:", err);
  });
}
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
    monacoPromise = import("./editor.api-T2K3CJFY.js").then((monaco2) => {
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
    fixedOverflowWidgets: false,
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
    triggerSuggest(editor);
  });
  const suggestOnFieldCharsSubscription = editor.onDidChangeModelContent(() => {
    const position = editor.getPosition();
    if (!position) return;
    const model = editor.getModel();
    if (!model) return;
    const prefix = model.getLineContent(position.lineNumber).slice(0, Math.max(0, position.column - 1));
    if (/\$(\d+)!([\w$]*!)*([\w$]*)$/.test(prefix) || /\$(\d+)!([\w$]*!)*\{([\w$]*)$/.test(prefix)) {
      triggerSuggest(editor);
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
