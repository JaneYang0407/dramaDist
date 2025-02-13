/*!
  * shared v10.0.5
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
const inBrowser = typeof window !== "undefined";
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber$1 = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject$1 = (val) => isPlainObject$2(val) && Object.keys(val).length === 0;
const assign = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : create());
};
function escapeHtml(rawText) {
  return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const hasOwnProperty$e = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty$e.call(obj, key);
}
const isArray$2 = Array.isArray;
const isFunction$2 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isBoolean$1 = (val) => typeof val === "boolean";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$2(val) && isFunction$2(val.then) && isFunction$2(val.catch);
};
const objectToString$1 = Object.prototype.toString;
const toTypeString = (value) => objectToString$1.call(value);
const isPlainObject$2 = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray$2(val) || isPlainObject$2(val) && val.toString === objectToString$1 ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const isNotObjectOrIsArray = (val) => !isObject$2(val) || isArray$2(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject$2(src2[key]) && !isObject$2(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
/*!
  * message-compiler v10.0.5
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
function createPosition(line, column, offset2) {
  return { line, column, offset: offset2 };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14
};
const COMPILE_ERROR_CODES_EXTEND_POINT = 17;
function createCompileError(code, loc, options = {}) {
  const { domain, messages: messages2, args } = options;
  const msg = code;
  const error = new SyntaxError(String(msg));
  error.code = code;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset2) => isCRLF(offset2) || isPS(offset2) || isLS(offset2) ? CHAR_LF : _buf[offset2];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset2 = 0) {
    _peekOffset = offset2;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 13,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 13,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code, pos, offset2, ...args) {
    const ctx = context();
    pos.column += offset2;
    pos.offset += offset2;
    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type4, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type4;
    const token = { type: type4 };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    13
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 7) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 7 || currentType === 11)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    const fn2 = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn2();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn2();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function isTextStart(scnr, reset = true) {
    const fn2 = (hasSpace = false, prev = "") => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return hasSpace;
      } else if (ch === "@" || !ch) {
        return hasSpace;
      } else if (ch === "|") {
        return !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn2(true, CHAR_SP);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn2(true, CHAR_LF);
      } else {
        return true;
      }
    };
    const ret = fn2();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn2) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn2(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i2 = 0; i2 < digits; i2++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn2 = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn2(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn2(buf);
      }
    };
    return fn2("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 4 || context2.currentType === 5 || context2.currentType === 6)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 4, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 6, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 12, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          7,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          8,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 11, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 10, readLinkedRefer(scnr));
          }
        }
        if (currentType === 7) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 13
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset: offset2, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset2;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        13
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    // eslint-disable-next-line no-useless-escape
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code, start, offset2, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset2;
    end.column += offset2;
    if (onError) {
      const loc = location ? createLocation(start, end) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function startNode(type4, offset2, loc) {
    const node = { type: type4 };
    if (location) {
      node.start = offset2;
      node.end = offset2;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset2, pos, type4) {
    if (location) {
      node.end = offset2;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset2, lastStartLoc: loc } = context;
    const node = startNode(5, offset2, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset2, lastStartLoc: loc } = context;
    const node = startNode(4, offset2, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset2, lastStartLoc: loc } = context;
    const node = startNode(9, offset2, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset2, lastStartLoc: loc } = context;
    const node = startNode(8, offset2, loc);
    if (token.type !== 11) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset2, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 8) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 9) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 10:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 4:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 7: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 13 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset2, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset2, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 13);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset: offset2, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 13) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset2, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 13) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 13) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i2 = 0; i2 < nodes.length; i2++) {
    traverseNode(nodes[i2], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c2) => optimizeMessageNode(c2));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i2 = 0; i2 < message.items.length; i2++) {
      const item = message.items[i2];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i2 = 0; i2 < message.items.length; i2++) {
        const item = message.items[i2];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i2 = 0; i2 < cases.length; i2++) {
        minify(cases[i2]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i2 = 0; i2 < items.length; i2++) {
        minify(items[i2]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
  }
  delete node.type;
}
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push2(code, node) {
    _context.code += code;
  }
  function _newline(n2, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push2(_needIndent ? _breakLineCode + `  `.repeat(n2) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push: push2,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i2 = 0; i2 < length; i2++) {
    generateNode(generator, node.items[i2]);
    if (i2 === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i2 = 0; i2 < length; i2++) {
      generateNode(generator, node.cases[i2]);
      if (i2 === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
  }
}
const generate = (ast, options = {}) => {
  const mode = isString$1(options.mode) ? options.mode : "normal";
  const filename = isString$1(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s2) => `${s2}: _${s2}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code, map: map2 } = generator.context();
  return {
    ast,
    code,
    map: map2 ? map2.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
/*!
  * core-base v10.0.5
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
function initFeatureFlags() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
  if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
    getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
  }
}
function format$1(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type4 = resolveType(body);
  if (type4 === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages2, c2) => [
      ...messages2,
      formatMessageParts(ctx, c2)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages2 = resolveItems(node).reduce((acm, c2) => [...acm, formatMessagePart(ctx, c2)], []);
    return ctx.normalize(messages2);
  }
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
function formatMessagePart(ctx, node) {
  const type4 = resolveType(node);
  switch (type4) {
    case 3: {
      return resolveValue$1(node, type4);
    }
    case 9: {
      return resolveValue$1(node, type4);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type4);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber$1(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber$1(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type4);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type4);
    }
    case 8: {
      return resolveValue$1(node, type4);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type4}`);
  }
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type4) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type4);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i2 = 0; i2 < props.length; i2++) {
    const prop = props[i2];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
function createUnhandleNodeError(type4) {
  return new Error(`unhandled node type: ${type4}`);
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function isMessageAST(val) {
  return isObject$2(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
// @__NO_SIDE_EFFECTS__
function compile(message, context) {
  if (!__INTLIFY_DROP_MESSAGE_COMPILER__ && isString$1(message)) {
    isBoolean$1(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: false,
      jit: true
    });
    const msg = format$1(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format$1(message);
    } else {
      return format$1(message);
    }
  }
}
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n, version, meta) {
  devtools && devtools.emit("i18n:init", {
    timestamp: Date.now(),
    i18n,
    version,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook("function:translate");
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const CoreErrorCodes = {
  INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT,
  // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
};
const CORE_ERROR_CODES_EXTEND_POINT = 24;
function createCoreError(code) {
  return createCompileError(code, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString$1(locale)) {
    return locale;
  } else {
    if (isFunction$2(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve = locale();
        if (isPromise(resolve)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray$2(fallback) ? fallback : isObject$2(fallback) ? Object.keys(fallback) : isString$1(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString$1(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray$2(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray$2(fallback) || !isPlainObject$2(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString$1(defaults) ? [defaults] : defaults;
    if (isArray$2(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i2 = 0; i2 < block.length && isBoolean$1(follow); i2++) {
    const locale = block[i2];
    if (isString$1(locale)) {
      follow = appendLocaleToChain(chain, block[i2], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray$2(blocks) || isPlainObject$2(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a2 = str.charCodeAt(0);
  const b2 = str.charCodeAt(str.length - 1);
  return a2 === b2 && (a2 === 34 || a2 === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code = ch.charCodeAt(0);
  switch (code) {
    case 91:
    // [
    case 93:
    // ]
    case 46:
    // .
    case 34:
    // "
    case 39:
      return ch;
    case 95:
    // _
    case 36:
    // $
    case 45:
      return "i";
    case 9:
    // Tab (HT)
    case 10:
    // Newline (LF)
    case 13:
    // Return (CR)
    case 160:
    // No-break space (NBSP)
    case 65279:
    // Byte Order Mark (BOM)
    case 8232:
    // Line Separator (LS)
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys2 = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c2;
  let key;
  let newChar;
  let type4;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys2.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c2 = path[index];
    if (c2 === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type4 = getPathCharType(c2);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type4] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c2;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys2;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$2(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$2(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last2 = obj;
  let i2 = 0;
  while (i2 < len) {
    const val = last2[hit[i2]];
    if (val === void 0) {
      return null;
    }
    if (isFunction$2(last2)) {
      return null;
    }
    last2 = val;
    i2++;
  }
  return last2;
}
const VERSION = "10.0.5";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type4) => {
      return type4 === "text" && isString$1(val) ? val.toUpperCase() : type4 === "vnode" && isObject$2(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type4) => {
      return type4 === "text" && isString$1(val) ? val.toLowerCase() : type4 === "vnode" && isObject$2(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type4) => {
      return type4 === "text" && isString$1(val) ? capitalize(val) : type4 === "vnode" && isObject$2(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
let _additionalMeta = null;
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ () => _additionalMeta;
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction$2(options.onWarn) ? options.onWarn : warn;
  const version = isString$1(options.version) ? options.version : VERSION;
  const locale = isString$1(options.locale) || isFunction$2(options.locale) ? options.locale : DEFAULT_LOCALE;
  const _locale = isFunction$2(locale) ? DEFAULT_LOCALE : locale;
  const fallbackLocale = isArray$2(options.fallbackLocale) || isPlainObject$2(options.fallbackLocale) || isString$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages2 = isPlainObject$2(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject$2(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject$2(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction$2(options.missing) ? options.missing : null;
  const missingWarn = isBoolean$1(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean$1(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction$2(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject$2(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean$1(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction$2(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction$2(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction$2(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$2(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject$2(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$2(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$2(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages: messages2,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  if (__INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version, __meta);
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type4) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type4);
    return isString$1(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index = locales.indexOf(targetLocale);
  if (index === -1) {
    return false;
  }
  for (let i2 = index + 1; i2 < locales.length; i2++) {
    if (isAlmostSameLocale(targetLocale, locales[i2])) {
      return true;
    }
  }
  return false;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean$1(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean$1(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type4 = "datetime format";
  for (let i2 = 0; i2 < locales.length; i2++) {
    targetLocale = locales[i2];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject$2(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type4);
  }
  if (!isPlainObject$2(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject$1(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString$1(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber$1(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject$2(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject$2(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject$2(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean$1(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean$1(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type4 = "number format";
  for (let i2 = 0; i2 < locales.length; i2++) {
    targetLocale = locales[i2];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject$2(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type4);
  }
  if (!isPlainObject$2(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject$1(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber$1(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject$2(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject$2(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject$2(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber$1(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber$1(options.named.count) || isNumber$1(options.named.n)) ? isNumber$1(options.named.count) ? options.named.count : isNumber$1(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$2(options.pluralRules) && isString$1(locale) && isFunction$2(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$2(options.pluralRules) && isString$1(locale) && isFunction$2(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages2) => {
    return messages2[pluralRule(pluralIndex, messages2.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || create();
  isNumber$1(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key, useLinked) {
    const msg = isFunction$2(options.messages) ? options.messages(key, !!useLinked) : isObject$2(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject$2(options.processor) && isFunction$2(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject$2(options.processor) && isFunction$2(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type4 = isPlainObject$2(options.processor) && isString$1(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type22 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject$2(arg1)) {
        modifier = arg1.modifier || modifier;
        type22 = arg1.type || type22;
      } else if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString$1(arg2)) {
        type22 = arg2 || type22;
      }
    }
    const ret = message(key, true)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type22 === "vnode" && isArray$2(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type22) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type4,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign(create(), _list, _named)
  };
  return ctx;
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction$2(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages: messages2 } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean$1(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean$1(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean$1(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString$1(options.default) || isBoolean$1(options.default) ? !isBoolean$1(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString$1(defaultMsgOrKey) || isFunction$2(defaultMsgOrKey));
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages2[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString$1(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  const ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const payloads = {
      timestamp: Date.now(),
      key: isString$1(key) ? key : isMessageFunction(format2) ? format2.key : "",
      locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
      format: isString$1(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
      message: ret
    };
    payloads.meta = assign({}, context.__meta, /* @__PURE__ */ getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray$2(options.list)) {
    options.list = options.list.map((item) => isString$1(item) ? escapeHtml(item) : item);
  } else if (isObject$2(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString$1(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages: messages2, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type4 = "translate";
  for (let i2 = 0; i2 < locales.length; i2++) {
    targetLocale = locales[i2];
    message = messages2[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type4
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = () => format2;
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString$1(arg1) && !isNumber$1(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber$1(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber$1(arg2)) {
    options.plural = arg2;
  } else if (isString$1(arg2)) {
    options.default = arg2;
  } else if (isPlainObject$2(arg2) && !isEmptyObject$1(arg2)) {
    options.named = arg2;
  } else if (isArray$2(arg2)) {
    options.list = arg2;
  }
  if (isNumber$1(arg3)) {
    options.plural = arg3;
  } else if (isString$1(arg3)) {
    options.default = arg3;
  } else if (isPlainObject$2(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key, useLinked) => {
    let val = resolveValue2(message, key);
    if (val == null && (fallbackContext || useLinked)) {
      const [, , message2] = resolveMessageFormat(
        fallbackContext || context,
        // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale,
        fallbackWarn,
        missingWarn
      );
      val = resolveValue2(message2, key);
    }
    if (isString$1(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber$1(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
{
  initFeatureFlags();
}
/*!
 * OverlayScrollbars
 * Version: 2.11.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const createCache = (t2, n2) => {
  const { o: o2, i: s2, u: e2 } = t2;
  let c2 = o2;
  let r2;
  const cacheUpdateContextual = (t3, n3) => {
    const o3 = c2;
    const l2 = t3;
    const i2 = n3 || (s2 ? !s2(o3, l2) : o3 !== l2);
    if (i2 || e2) {
      c2 = l2;
      r2 = o3;
    }
    return [c2, i2, r2];
  };
  const cacheUpdateIsolated = (t3) => cacheUpdateContextual(n2(c2, r2), t3);
  const getCurrentCache = (t3) => [c2, !!t3, r2];
  return [n2 ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache];
};
const t = typeof window !== "undefined" && typeof HTMLElement !== "undefined" && !!window.document;
const n = t ? window : {};
const o$1 = Math.max;
const s$1 = Math.min;
const e = Math.round;
const c$1 = Math.abs;
const r = Math.sign;
const l$1 = n.cancelAnimationFrame;
const i = n.requestAnimationFrame;
const a$1 = n.setTimeout;
const u$1 = n.clearTimeout;
const getApi = (t2) => typeof n[t2] !== "undefined" ? n[t2] : void 0;
const _$1 = getApi("MutationObserver");
const d$1 = getApi("IntersectionObserver");
const f$1 = getApi("ResizeObserver");
const p$1 = getApi("ScrollTimeline");
const isUndefined$1 = (t2) => t2 === void 0;
const isNull$1 = (t2) => t2 === null;
const isNumber = (t2) => typeof t2 === "number";
const isString = (t2) => typeof t2 === "string";
const isBoolean = (t2) => typeof t2 === "boolean";
const isFunction$1 = (t2) => typeof t2 === "function";
const isArray$1 = (t2) => Array.isArray(t2);
const isObject$1 = (t2) => typeof t2 === "object" && !isArray$1(t2) && !isNull$1(t2);
const isArrayLike$1 = (t2) => {
  const n2 = !!t2 && t2.length;
  const o2 = isNumber(n2) && n2 > -1 && n2 % 1 == 0;
  return isArray$1(t2) || !isFunction$1(t2) && o2 ? n2 > 0 && isObject$1(t2) ? n2 - 1 in t2 : true : false;
};
const isPlainObject$1 = (t2) => !!t2 && t2.constructor === Object;
const isHTMLElement$1 = (t2) => t2 instanceof HTMLElement;
const isElement$1 = (t2) => t2 instanceof Element;
function each(t2, n2) {
  if (isArrayLike$1(t2)) {
    for (let o2 = 0; o2 < t2.length; o2++) {
      if (n2(t2[o2], o2, t2) === false) {
        break;
      }
    }
  } else if (t2) {
    each(Object.keys(t2), (o2) => n2(t2[o2], o2, t2));
  }
  return t2;
}
const inArray = (t2, n2) => t2.indexOf(n2) >= 0;
const concat = (t2, n2) => t2.concat(n2);
const push = (t2, n2, o2) => {
  !isString(n2) && isArrayLike$1(n2) ? Array.prototype.push.apply(t2, n2) : t2.push(n2);
  return t2;
};
const from = (t2) => Array.from(t2 || []);
const createOrKeepArray = (t2) => {
  if (isArray$1(t2)) {
    return t2;
  }
  return !isString(t2) && isArrayLike$1(t2) ? from(t2) : [t2];
};
const isEmptyArray = (t2) => !!t2 && !t2.length;
const deduplicateArray = (t2) => from(new Set(t2));
const runEachAndClear = (t2, n2, o2) => {
  const runFn = (t3) => t3 ? t3.apply(void 0, n2 || []) : true;
  each(t2, runFn);
  !o2 && (t2.length = 0);
};
const v$1 = "paddingTop";
const h$1 = "paddingRight";
const g = "paddingLeft";
const b$1 = "paddingBottom";
const w$1 = "marginLeft";
const y = "marginRight";
const S$1 = "marginBottom";
const m$1 = "overflowX";
const O$1 = "overflowY";
const $ = "width";
const C$1 = "height";
const x$1 = "visible";
const H$1 = "hidden";
const E$2 = "scroll";
const capitalizeFirstLetter = (t2) => {
  const n2 = String(t2 || "");
  return n2 ? n2[0].toUpperCase() + n2.slice(1) : "";
};
const equal = (t2, n2, o2, s2) => {
  if (t2 && n2) {
    let s3 = true;
    each(o2, (o3) => {
      const e2 = t2[o3];
      const c2 = n2[o3];
      if (e2 !== c2) {
        s3 = false;
      }
    });
    return s3;
  }
  return false;
};
const equalWH = (t2, n2) => equal(t2, n2, ["w", "h"]);
const equalXY = (t2, n2) => equal(t2, n2, ["x", "y"]);
const equalTRBL = (t2, n2) => equal(t2, n2, ["t", "r", "b", "l"]);
const noop$1 = () => {
};
const bind = (t2, ...n2) => t2.bind(0, ...n2);
const selfClearTimeout = (t2) => {
  let n2;
  const o2 = t2 ? a$1 : i;
  const s2 = t2 ? u$1 : l$1;
  return [(e2) => {
    s2(n2);
    n2 = o2(() => e2(), isFunction$1(t2) ? t2() : t2);
  }, () => s2(n2)];
};
const debounce$1 = (t2, n2) => {
  const { _: o2, p: s2, v: e2, S: c2 } = n2 || {};
  let r2;
  let _2;
  let d2;
  let f2;
  let p2 = noop$1;
  const v2 = function invokeFunctionToDebounce(n3) {
    p2();
    u$1(r2);
    f2 = r2 = _2 = void 0;
    p2 = noop$1;
    t2.apply(this, n3);
  };
  const mergeParms = (t3) => c2 && _2 ? c2(_2, t3) : t3;
  const flush = () => {
    if (p2 !== noop$1) {
      v2(mergeParms(d2) || d2);
    }
  };
  const h2 = function debouncedFn() {
    const t3 = from(arguments);
    const n3 = isFunction$1(o2) ? o2() : o2;
    const c3 = isNumber(n3) && n3 >= 0;
    if (c3) {
      const o3 = isFunction$1(s2) ? s2() : s2;
      const c4 = isNumber(o3) && o3 >= 0;
      const h3 = n3 > 0 ? a$1 : i;
      const g2 = n3 > 0 ? u$1 : l$1;
      const b2 = mergeParms(t3);
      const w2 = b2 || t3;
      const y2 = v2.bind(0, w2);
      let S2;
      p2();
      if (e2 && !f2) {
        y2();
        f2 = true;
        S2 = h3(() => f2 = void 0, n3);
      } else {
        S2 = h3(y2, n3);
        if (c4 && !r2) {
          r2 = a$1(flush, o3);
        }
      }
      p2 = () => g2(S2);
      _2 = d2 = w2;
    } else {
      v2(t3);
    }
  };
  h2.m = flush;
  return h2;
};
const hasOwnProperty$d = (t2, n2) => Object.prototype.hasOwnProperty.call(t2, n2);
const keys$1 = (t2) => t2 ? Object.keys(t2) : [];
const assignDeep = (t2, n2, o2, s2, e2, c2, r2) => {
  const l2 = [n2, o2, s2, e2, c2, r2];
  if ((typeof t2 !== "object" || isNull$1(t2)) && !isFunction$1(t2)) {
    t2 = {};
  }
  each(l2, (n3) => {
    each(n3, (o3, s3) => {
      const e3 = n3[s3];
      if (t2 === e3) {
        return true;
      }
      const c3 = isArray$1(e3);
      if (e3 && isPlainObject$1(e3)) {
        const n4 = t2[s3];
        let o4 = n4;
        if (c3 && !isArray$1(n4)) {
          o4 = [];
        } else if (!c3 && !isPlainObject$1(n4)) {
          o4 = {};
        }
        t2[s3] = assignDeep(o4, e3);
      } else {
        t2[s3] = c3 ? e3.slice() : e3;
      }
    });
  });
  return t2;
};
const removeUndefinedProperties = (t2, n2) => each(assignDeep({}, t2), (t3, n3, o2) => {
  if (t3 === void 0) {
    delete o2[n3];
  } else if (t3 && isPlainObject$1(t3)) {
    o2[n3] = removeUndefinedProperties(t3);
  }
});
const isEmptyObject = (t2) => !keys$1(t2).length;
const capNumber = (t2, n2, e2) => o$1(t2, s$1(n2, e2));
const getDomTokensArray = (t2) => deduplicateArray((isArray$1(t2) ? t2 : (t2 || "").split(" ")).filter((t3) => t3));
const getAttr = (t2, n2) => t2 && t2.getAttribute(n2);
const hasAttr = (t2, n2) => t2 && t2.hasAttribute(n2);
const setAttrs = (t2, n2, o2) => {
  each(getDomTokensArray(n2), (n3) => {
    t2 && t2.setAttribute(n3, String(o2 || ""));
  });
};
const removeAttrs = (t2, n2) => {
  each(getDomTokensArray(n2), (n3) => t2 && t2.removeAttribute(n3));
};
const domTokenListAttr = (t2, n2) => {
  const o2 = getDomTokensArray(getAttr(t2, n2));
  const s2 = bind(setAttrs, t2, n2);
  const domTokenListOperation = (t3, n3) => {
    const s3 = new Set(o2);
    each(getDomTokensArray(t3), (t4) => {
      s3[n3](t4);
    });
    return from(s3).join(" ");
  };
  return {
    O: (t3) => s2(domTokenListOperation(t3, "delete")),
    $: (t3) => s2(domTokenListOperation(t3, "add")),
    C: (t3) => {
      const n3 = getDomTokensArray(t3);
      return n3.reduce((t4, n4) => t4 && o2.includes(n4), n3.length > 0);
    }
  };
};
const removeAttrClass = (t2, n2, o2) => {
  domTokenListAttr(t2, n2).O(o2);
  return bind(addAttrClass, t2, n2, o2);
};
const addAttrClass = (t2, n2, o2) => {
  domTokenListAttr(t2, n2).$(o2);
  return bind(removeAttrClass, t2, n2, o2);
};
const addRemoveAttrClass = (t2, n2, o2, s2) => (s2 ? addAttrClass : removeAttrClass)(t2, n2, o2);
const hasAttrClass = (t2, n2, o2) => domTokenListAttr(t2, n2).C(o2);
const createDomTokenListClass = (t2) => domTokenListAttr(t2, "class");
const removeClass = (t2, n2) => {
  createDomTokenListClass(t2).O(n2);
};
const addClass = (t2, n2) => {
  createDomTokenListClass(t2).$(n2);
  return bind(removeClass, t2, n2);
};
const find = (t2, n2) => {
  const o2 = n2 ? isElement$1(n2) && n2 : document;
  return o2 ? from(o2.querySelectorAll(t2)) : [];
};
const findFirst = (t2, n2) => {
  const o2 = n2 ? isElement$1(n2) && n2 : document;
  return o2 && o2.querySelector(t2);
};
const is = (t2, n2) => isElement$1(t2) && t2.matches(n2);
const isBodyElement = (t2) => is(t2, "body");
const contents = (t2) => t2 ? from(t2.childNodes) : [];
const parent$1 = (t2) => t2 && t2.parentElement;
const closest = (t2, n2) => isElement$1(t2) && t2.closest(n2);
const getFocusedElement = (t2) => document.activeElement;
const liesBetween = (t2, n2, o2) => {
  const s2 = closest(t2, n2);
  const e2 = t2 && findFirst(o2, s2);
  const c2 = closest(e2, n2) === s2;
  return s2 && e2 ? s2 === t2 || e2 === t2 || c2 && closest(closest(t2, o2), n2) !== s2 : false;
};
const removeElements = (t2) => {
  each(createOrKeepArray(t2), (t3) => {
    const n2 = parent$1(t3);
    t3 && n2 && n2.removeChild(t3);
  });
};
const appendChildren = (t2, n2) => bind(removeElements, t2 && n2 && each(createOrKeepArray(n2), (n3) => {
  n3 && t2.appendChild(n3);
}));
let z;
const getTrustedTypePolicy = () => z;
const setTrustedTypePolicy = (t2) => {
  z = t2;
};
const createDiv = (t2) => {
  const n2 = document.createElement("div");
  setAttrs(n2, "class", t2);
  return n2;
};
const createDOM = (t2) => {
  const n2 = createDiv();
  const o2 = getTrustedTypePolicy();
  const s2 = t2.trim();
  n2.innerHTML = o2 ? o2.createHTML(s2) : s2;
  return each(contents(n2), (t3) => removeElements(t3));
};
const getCSSVal = (t2, n2) => t2.getPropertyValue(n2) || t2[n2] || "";
const validFiniteNumber = (t2) => {
  const n2 = t2 || 0;
  return isFinite(n2) ? n2 : 0;
};
const parseToZeroOrNumber = (t2) => validFiniteNumber(parseFloat(t2 || ""));
const roundCssNumber = (t2) => Math.round(t2 * 1e4) / 1e4;
const numberToCssPx = (t2) => `${roundCssNumber(validFiniteNumber(t2))}px`;
function setStyles(t2, n2) {
  t2 && n2 && each(n2, (n3, o2) => {
    try {
      const s2 = t2.style;
      const e2 = isNull$1(n3) || isBoolean(n3) ? "" : isNumber(n3) ? numberToCssPx(n3) : n3;
      if (o2.indexOf("--") === 0) {
        s2.setProperty(o2, e2);
      } else {
        s2[o2] = e2;
      }
    } catch (s2) {
    }
  });
}
function getStyles(t2, o2, s2) {
  const e2 = isString(o2);
  let c2 = e2 ? "" : {};
  if (t2) {
    const r2 = n.getComputedStyle(t2, s2) || t2.style;
    c2 = e2 ? getCSSVal(r2, o2) : from(o2).reduce((t3, n2) => {
      t3[n2] = getCSSVal(r2, n2);
      return t3;
    }, c2);
  }
  return c2;
}
const topRightBottomLeft = (t2, n2, o2) => {
  const s2 = n2 ? `${n2}-` : "";
  const e2 = o2 ? `-${o2}` : "";
  const c2 = `${s2}top${e2}`;
  const r2 = `${s2}right${e2}`;
  const l2 = `${s2}bottom${e2}`;
  const i2 = `${s2}left${e2}`;
  const a2 = getStyles(t2, [c2, r2, l2, i2]);
  return {
    t: parseToZeroOrNumber(a2[c2]),
    r: parseToZeroOrNumber(a2[r2]),
    b: parseToZeroOrNumber(a2[l2]),
    l: parseToZeroOrNumber(a2[i2])
  };
};
const getTrasformTranslateValue = (t2, n2) => `translate${isObject$1(t2) ? `(${t2.x},${t2.y})` : `${n2 ? "X" : "Y"}(${t2})`}`;
const elementHasDimensions = (t2) => !!(t2.offsetWidth || t2.offsetHeight || t2.getClientRects().length);
const I$2 = {
  w: 0,
  h: 0
};
const getElmWidthHeightProperty = (t2, n2) => n2 ? {
  w: n2[`${t2}Width`],
  h: n2[`${t2}Height`]
} : I$2;
const getWindowSize = (t2) => getElmWidthHeightProperty("inner", t2 || n);
const A$1 = bind(getElmWidthHeightProperty, "offset");
const D$1 = bind(getElmWidthHeightProperty, "client");
const M$1 = bind(getElmWidthHeightProperty, "scroll");
const getFractionalSize = (t2) => {
  const n2 = parseFloat(getStyles(t2, $)) || 0;
  const o2 = parseFloat(getStyles(t2, C$1)) || 0;
  return {
    w: n2 - e(n2),
    h: o2 - e(o2)
  };
};
const getBoundingClientRect$1 = (t2) => t2.getBoundingClientRect();
const hasDimensions = (t2) => !!t2 && elementHasDimensions(t2);
const domRectHasDimensions = (t2) => !!(t2 && (t2[C$1] || t2[$]));
const domRectAppeared = (t2, n2) => {
  const o2 = domRectHasDimensions(t2);
  const s2 = domRectHasDimensions(n2);
  return !s2 && o2;
};
const removeEventListener = (t2, n2, o2, s2) => {
  each(getDomTokensArray(n2), (n3) => {
    t2 && t2.removeEventListener(n3, o2, s2);
  });
};
const addEventListener = (t2, n2, o2, s2) => {
  var e2;
  const c2 = (e2 = s2 && s2.H) != null ? e2 : true;
  const r2 = s2 && s2.I || false;
  const l2 = s2 && s2.A || false;
  const i2 = {
    passive: c2,
    capture: r2
  };
  return bind(runEachAndClear, getDomTokensArray(n2).map((n3) => {
    const s3 = l2 ? (e3) => {
      removeEventListener(t2, n3, s3, r2);
      o2 && o2(e3);
    } : o2;
    t2 && t2.addEventListener(n3, s3, i2);
    return bind(removeEventListener, t2, n3, s3, r2);
  }));
};
const stopPropagation = (t2) => t2.stopPropagation();
const preventDefault = (t2) => t2.preventDefault();
const stopAndPrevent = (t2) => stopPropagation(t2) || preventDefault(t2);
const scrollElementTo = (t2, n2) => {
  const { x: o2, y: s2 } = isNumber(n2) ? {
    x: n2,
    y: n2
  } : n2 || {};
  isNumber(o2) && (t2.scrollLeft = o2);
  isNumber(s2) && (t2.scrollTop = s2);
};
const getElementScroll = (t2) => ({
  x: t2.scrollLeft,
  y: t2.scrollTop
});
const getZeroScrollCoordinates = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
});
const sanitizeScrollCoordinates = (t2, n2) => {
  const { D: o2, M: s2 } = t2;
  const { w: e2, h: l2 } = n2;
  const sanitizeAxis = (t3, n3, o3) => {
    let s3 = r(t3) * o3;
    let e3 = r(n3) * o3;
    if (s3 === e3) {
      const o4 = c$1(t3);
      const r2 = c$1(n3);
      e3 = o4 > r2 ? 0 : e3;
      s3 = o4 < r2 ? 0 : s3;
    }
    s3 = s3 === e3 ? 0 : s3;
    return [s3 + 0, e3 + 0];
  };
  const [i2, a2] = sanitizeAxis(o2.x, s2.x, e2);
  const [u2, _2] = sanitizeAxis(o2.y, s2.y, l2);
  return {
    D: {
      x: i2,
      y: u2
    },
    M: {
      x: a2,
      y: _2
    }
  };
};
const isDefaultDirectionScrollCoordinates = ({ D: t2, M: n2 }) => {
  const getAxis = (t3, n3) => t3 === 0 && t3 <= n3;
  return {
    x: getAxis(t2.x, n2.x),
    y: getAxis(t2.y, n2.y)
  };
};
const getScrollCoordinatesPercent = ({ D: t2, M: n2 }, o2) => {
  const getAxis = (t3, n3, o3) => capNumber(0, 1, (t3 - o3) / (t3 - n3) || 0);
  return {
    x: getAxis(t2.x, n2.x, o2.x),
    y: getAxis(t2.y, n2.y, o2.y)
  };
};
const focusElement = (t2) => {
  if (t2 && t2.focus) {
    t2.focus({
      preventScroll: true
    });
  }
};
const manageListener = (t2, n2) => {
  each(createOrKeepArray(n2), t2);
};
const createEventListenerHub = (t2) => {
  const n2 = /* @__PURE__ */ new Map();
  const removeEvent = (t3, o2) => {
    if (t3) {
      const s2 = n2.get(t3);
      manageListener((t4) => {
        if (s2) {
          s2[t4 ? "delete" : "clear"](t4);
        }
      }, o2);
    } else {
      n2.forEach((t4) => {
        t4.clear();
      });
      n2.clear();
    }
  };
  const addEvent = (t3, o2) => {
    if (isString(t3)) {
      const s3 = n2.get(t3) || /* @__PURE__ */ new Set();
      n2.set(t3, s3);
      manageListener((t4) => {
        isFunction$1(t4) && s3.add(t4);
      }, o2);
      return bind(removeEvent, t3, o2);
    }
    if (isBoolean(o2) && o2) {
      removeEvent();
    }
    const s2 = keys$1(t3);
    const e2 = [];
    each(s2, (n3) => {
      const o3 = t3[n3];
      o3 && push(e2, addEvent(n3, o3));
    });
    return bind(runEachAndClear, e2);
  };
  const triggerEvent = (t3, o2) => {
    each(from(n2.get(t3)), (t4) => {
      if (o2 && !isEmptyArray(o2)) {
        t4.apply(0, o2);
      } else {
        t4();
      }
    });
  };
  addEvent(t2 || {});
  return [addEvent, removeEvent, triggerEvent];
};
const T$1 = {};
const k = {};
const addPlugins = (t2) => {
  each(t2, (t3) => each(t3, (n2, o2) => {
    T$1[o2] = t3[o2];
  }));
};
const registerPluginModuleInstances = (t2, n2, o2) => keys$1(t2).map((s2) => {
  const { static: e2, instance: c2 } = t2[s2];
  const [r2, l2, i2] = o2 || [];
  const a2 = o2 ? c2 : e2;
  if (a2) {
    const t3 = o2 ? a2(r2, l2, n2) : a2(n2);
    return (i2 || k)[s2] = t3;
  }
});
const getStaticPluginModuleInstance = (t2) => k[t2];
const R$1 = "__osOptionsValidationPlugin";
const V = `data-overlayscrollbars`;
const L = "os-environment";
const U$2 = `${L}-scrollbar-hidden`;
const P$2 = `${V}-initialize`;
const N$2 = "noClipping";
const q$1 = `${V}-body`;
const B$1 = V;
const F$1 = "host";
const j = `${V}-viewport`;
const X$2 = m$1;
const Y$1 = O$1;
const W$1 = "arrange";
const J$1 = "measuring";
const G$1 = "scrolling";
const K$1 = "scrollbarHidden";
const Q$1 = "noContent";
const Z$1 = `${V}-padding`;
const tt$1 = `${V}-content`;
const nt$1 = "os-size-observer";
const ot$1 = `${nt$1}-appear`;
const st$1 = `${nt$1}-listener`;
const lt$1 = "os-trinsic-observer";
const it$1 = "os-theme-none";
const at$1 = "os-scrollbar";
const ut$1 = `${at$1}-rtl`;
const _t$1 = `${at$1}-horizontal`;
const dt$1 = `${at$1}-vertical`;
const ft$1 = `${at$1}-track`;
const pt$1 = `${at$1}-handle`;
const vt$1 = `${at$1}-visible`;
const ht$1 = `${at$1}-cornerless`;
const gt$1 = `${at$1}-interaction`;
const bt$1 = `${at$1}-unusable`;
const wt$1 = `${at$1}-auto-hide`;
const yt$1 = `${wt$1}-hidden`;
const St$1 = `${at$1}-wheel`;
const mt$1 = `${ft$1}-interactive`;
const Ot$1 = `${pt$1}-interactive`;
const $t$1 = "__osSizeObserverPlugin";
const getShowNativeOverlaidScrollbars = (t2, n2) => {
  const { T: o2 } = n2;
  const [s2, e2] = t2("showNativeOverlaidScrollbars");
  return [s2 && o2.x && o2.y, e2];
};
const overflowIsVisible = (t2) => t2.indexOf(x$1) === 0;
const createViewportOverflowState = (t2, n2) => {
  const getAxisOverflowStyle = (t3, n3, o3, s2) => {
    const e2 = t3 === x$1 ? H$1 : t3.replace(`${x$1}-`, "");
    const c2 = overflowIsVisible(t3);
    const r2 = overflowIsVisible(o3);
    if (!n3 && !s2) {
      return H$1;
    }
    if (c2 && r2) {
      return x$1;
    }
    if (c2) {
      const t4 = n3 ? x$1 : H$1;
      return n3 && s2 ? e2 : t4;
    }
    const l2 = r2 && s2 ? x$1 : H$1;
    return n3 ? e2 : l2;
  };
  const o2 = {
    x: getAxisOverflowStyle(n2.x, t2.x, n2.y, t2.y),
    y: getAxisOverflowStyle(n2.y, t2.y, n2.x, t2.x)
  };
  return {
    k: o2,
    R: {
      x: o2.x === E$2,
      y: o2.y === E$2
    }
  };
};
const xt$1 = "__osScrollbarsHidingPlugin";
const Et = "__osClickScrollPlugin";
const opsStringify = (t2) => JSON.stringify(t2, (t3, n2) => {
  if (isFunction$1(n2)) {
    throw 0;
  }
  return n2;
});
const getPropByPath = (t2, n2) => t2 ? `${n2}`.split(".").reduce((t3, n3) => t3 && hasOwnProperty$d(t3, n3) ? t3[n3] : void 0, t2) : void 0;
const It$1 = {
  paddingAbsolute: false,
  showNativeOverlaidScrollbars: false,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: false,
    dragScroll: true,
    clickScroll: false,
    pointers: ["mouse", "touch", "pen"]
  }
};
const getOptionsDiff = (t2, n2) => {
  const o2 = {};
  const s2 = concat(keys$1(n2), keys$1(t2));
  each(s2, (s3) => {
    const e2 = t2[s3];
    const c2 = n2[s3];
    if (isObject$1(e2) && isObject$1(c2)) {
      assignDeep(o2[s3] = {}, getOptionsDiff(e2, c2));
      if (isEmptyObject(o2[s3])) {
        delete o2[s3];
      }
    } else if (hasOwnProperty$d(n2, s3) && c2 !== e2) {
      let t3 = true;
      if (isArray$1(e2) || isArray$1(c2)) {
        try {
          if (opsStringify(e2) === opsStringify(c2)) {
            t3 = false;
          }
        } catch (r2) {
        }
      }
      if (t3) {
        o2[s3] = c2;
      }
    }
  });
  return o2;
};
const createOptionCheck = (t2, n2, o2) => (s2) => [getPropByPath(t2, s2), o2 || getPropByPath(n2, s2) !== void 0];
let At;
const getNonce = () => At;
const setNonce = (t2) => {
  At = t2;
};
let Dt;
const createEnvironment = () => {
  const getNativeScrollbarSize = (t3, n2, o3) => {
    appendChildren(document.body, t3);
    appendChildren(document.body, t3);
    const s3 = D$1(t3);
    const e3 = A$1(t3);
    const c3 = getFractionalSize(n2);
    o3 && removeElements(t3);
    return {
      x: e3.h - s3.h + c3.h,
      y: e3.w - s3.w + c3.w
    };
  };
  const getNativeScrollbarsHiding = (t3) => {
    let n2 = false;
    const o3 = addClass(t3, U$2);
    try {
      n2 = getStyles(t3, "scrollbar-width") === "none" || getStyles(t3, "display", "::-webkit-scrollbar") === "none";
    } catch (s3) {
    }
    o3();
    return n2;
  };
  const t2 = `.${L}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${L} div{width:200%;height:200%;margin:10px 0}.${U$2}{scrollbar-width:none!important}.${U$2}::-webkit-scrollbar,.${U$2}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`;
  const o2 = createDOM(`<div class="${L}"><div></div><style>${t2}</style></div>`);
  const s2 = o2[0];
  const e2 = s2.firstChild;
  const c2 = s2.lastChild;
  const r2 = getNonce();
  if (r2) {
    c2.nonce = r2;
  }
  const [l2, , i2] = createEventListenerHub();
  const [a2, u2] = createCache({
    o: getNativeScrollbarSize(s2, e2),
    i: equalXY
  }, bind(getNativeScrollbarSize, s2, e2, true));
  const [_2] = u2();
  const d2 = getNativeScrollbarsHiding(s2);
  const f2 = {
    x: _2.x === 0,
    y: _2.y === 0
  };
  const v2 = {
    elements: {
      host: null,
      padding: !d2,
      viewport: (t3) => d2 && isBodyElement(t3) && t3,
      content: false
    },
    scrollbars: {
      slot: true
    },
    cancel: {
      nativeScrollbarsOverlaid: false,
      body: null
    }
  };
  const h2 = assignDeep({}, It$1);
  const g2 = bind(assignDeep, {}, h2);
  const b2 = bind(assignDeep, {}, v2);
  const w2 = {
    N: _2,
    T: f2,
    P: d2,
    G: !!p$1,
    K: bind(l2, "r"),
    Z: b2,
    tt: (t3) => assignDeep(v2, t3) && b2(),
    nt: g2,
    ot: (t3) => assignDeep(h2, t3) && g2(),
    st: assignDeep({}, v2),
    et: assignDeep({}, h2)
  };
  removeAttrs(s2, "style");
  removeElements(s2);
  addEventListener(n, "resize", () => {
    i2("r", []);
  });
  if (isFunction$1(n.matchMedia) && !d2 && (!f2.x || !f2.y)) {
    const addZoomListener = (t3) => {
      const o3 = n.matchMedia(`(resolution: ${n.devicePixelRatio}dppx)`);
      addEventListener(o3, "change", () => {
        t3();
        addZoomListener(t3);
      }, {
        A: true
      });
    };
    addZoomListener(() => {
      const [t3, n2] = a2();
      assignDeep(w2.N, t3);
      i2("r", [n2]);
    });
  }
  return w2;
};
const getEnvironment = () => {
  if (!Dt) {
    Dt = createEnvironment();
  }
  return Dt;
};
const createEventContentChange = (t2, n2, o2) => {
  let s2 = false;
  const e2 = o2 ? /* @__PURE__ */ new WeakMap() : false;
  const destroy = () => {
    s2 = true;
  };
  const updateElements = (c2) => {
    if (e2 && o2) {
      const r2 = o2.map((n3) => {
        const [o3, s3] = n3 || [];
        const e3 = s3 && o3 ? (c2 || find)(o3, t2) : [];
        return [e3, s3];
      });
      each(r2, (o3) => each(o3[0], (c3) => {
        const r3 = o3[1];
        const l2 = e2.get(c3) || [];
        const i2 = t2.contains(c3);
        if (i2 && r3) {
          const t3 = addEventListener(c3, r3, (o4) => {
            if (s2) {
              t3();
              e2.delete(c3);
            } else {
              n2(o4);
            }
          });
          e2.set(c3, push(l2, t3));
        } else {
          runEachAndClear(l2);
          e2.delete(c3);
        }
      }));
    }
  };
  updateElements();
  return [destroy, updateElements];
};
const createDOMObserver = (t2, n2, o2, s2) => {
  let e2 = false;
  const { ct: c2, rt: r2, lt: l2, it: i2, ut: a2, _t: u2 } = s2 || {};
  const d2 = debounce$1(() => e2 && o2(true), {
    _: 33,
    p: 99
  });
  const [f2, p2] = createEventContentChange(t2, d2, l2);
  const v2 = c2 || [];
  const h2 = r2 || [];
  const g2 = concat(v2, h2);
  const observerCallback = (e3, c3) => {
    if (!isEmptyArray(c3)) {
      const r3 = a2 || noop$1;
      const l3 = u2 || noop$1;
      const _2 = [];
      const d3 = [];
      let f3 = false;
      let v3 = false;
      each(c3, (o3) => {
        const { attributeName: e4, target: c4, type: a3, oldValue: u3, addedNodes: p3, removedNodes: g3 } = o3;
        const b3 = a3 === "attributes";
        const w2 = a3 === "childList";
        const y2 = t2 === c4;
        const S2 = b3 && e4;
        const m2 = S2 && getAttr(c4, e4 || "");
        const O2 = isString(m2) ? m2 : null;
        const $2 = S2 && u3 !== O2;
        const C2 = inArray(h2, e4) && $2;
        if (n2 && (w2 || !y2)) {
          const n3 = b3 && $2;
          const a4 = n3 && i2 && is(c4, i2);
          const d4 = a4 ? !r3(c4, e4, u3, O2) : !b3 || n3;
          const f4 = d4 && !l3(o3, !!a4, t2, s2);
          each(p3, (t3) => push(_2, t3));
          each(g3, (t3) => push(_2, t3));
          v3 = v3 || f4;
        }
        if (!n2 && y2 && $2 && !r3(c4, e4, u3, O2)) {
          push(d3, e4);
          f3 = f3 || C2;
        }
      });
      p2((t3) => deduplicateArray(_2).reduce((n3, o3) => {
        push(n3, find(t3, o3));
        return is(o3, t3) ? push(n3, o3) : n3;
      }, []));
      if (n2) {
        !e3 && v3 && o2(false);
        return [false];
      }
      if (!isEmptyArray(d3) || f3) {
        const t3 = [deduplicateArray(d3), f3];
        !e3 && o2.apply(0, t3);
        return t3;
      }
    }
  };
  const b2 = new _$1(bind(observerCallback, false));
  return [() => {
    b2.observe(t2, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: g2,
      subtree: n2,
      childList: n2,
      characterData: n2
    });
    e2 = true;
    return () => {
      if (e2) {
        f2();
        b2.disconnect();
        e2 = false;
      }
    };
  }, () => {
    if (e2) {
      d2.m();
      return observerCallback(true, b2.takeRecords());
    }
  }];
};
const createSizeObserver = (t2, n2, o2) => {
  const { dt: s2 } = o2 || {};
  const e2 = getStaticPluginModuleInstance($t$1);
  const [c2] = createCache({
    o: false,
    u: true
  });
  return () => {
    const o3 = [];
    const r2 = createDOM(`<div class="${nt$1}"><div class="${st$1}"></div></div>`);
    const l2 = r2[0];
    const i2 = l2.firstChild;
    const onSizeChangedCallbackProxy = (t3) => {
      const o4 = t3 instanceof ResizeObserverEntry;
      let s3 = false;
      let e3 = false;
      if (o4) {
        const [n3, , o5] = c2(t3.contentRect);
        const r3 = domRectHasDimensions(n3);
        e3 = domRectAppeared(n3, o5);
        s3 = !e3 && !r3;
      } else {
        e3 = t3 === true;
      }
      if (!s3) {
        n2({
          ft: true,
          dt: e3
        });
      }
    };
    if (f$1) {
      const t3 = new f$1((t4) => onSizeChangedCallbackProxy(t4.pop()));
      t3.observe(i2);
      push(o3, () => {
        t3.disconnect();
      });
    } else if (e2) {
      const [t3, n3] = e2(i2, onSizeChangedCallbackProxy, s2);
      push(o3, concat([addClass(l2, ot$1), addEventListener(l2, "animationstart", t3)], n3));
    } else {
      return noop$1;
    }
    return bind(runEachAndClear, push(o3, appendChildren(t2, l2)));
  };
};
const createTrinsicObserver = (t2, n2) => {
  let o2;
  const isHeightIntrinsic = (t3) => t3.h === 0 || t3.isIntersecting || t3.intersectionRatio > 0;
  const s2 = createDiv(lt$1);
  const [e2] = createCache({
    o: false
  });
  const triggerOnTrinsicChangedCallback = (t3, o3) => {
    if (t3) {
      const s3 = e2(isHeightIntrinsic(t3));
      const [, c2] = s3;
      return c2 && !o3 && n2(s3) && [s3];
    }
  };
  const intersectionObserverCallback = (t3, n3) => triggerOnTrinsicChangedCallback(n3.pop(), t3);
  return [() => {
    const n3 = [];
    if (d$1) {
      o2 = new d$1(bind(intersectionObserverCallback, false), {
        root: t2
      });
      o2.observe(s2);
      push(n3, () => {
        o2.disconnect();
      });
    } else {
      const onSizeChanged = () => {
        const t3 = A$1(s2);
        triggerOnTrinsicChangedCallback(t3);
      };
      push(n3, createSizeObserver(s2, onSizeChanged)());
      onSizeChanged();
    }
    return bind(runEachAndClear, push(n3, appendChildren(t2, s2)));
  }, () => o2 && intersectionObserverCallback(true, o2.takeRecords())];
};
const createObserversSetup = (t2, n2, o2, s2) => {
  let e2;
  let c2;
  let r2;
  let l2;
  let i2;
  let a2;
  const u2 = `[${B$1}]`;
  const _2 = `[${j}]`;
  const d2 = ["id", "class", "style", "open", "wrap", "cols", "rows"];
  const { vt: p2, ht: v2, U: h2, gt: g2, bt: b2, L: w2, wt: y2, yt: S2, St: m2, Ot: O2 } = t2;
  const getDirectionIsRTL = (t3) => getStyles(t3, "direction") === "rtl";
  const $2 = {
    $t: false,
    F: getDirectionIsRTL(p2)
  };
  const C2 = getEnvironment();
  const x2 = getStaticPluginModuleInstance(xt$1);
  const [H2] = createCache({
    i: equalWH,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const s3 = x2 && x2.V(t2, n2, $2, C2, o2).W;
    const e3 = y2 && w2;
    const c3 = !e3 && hasAttrClass(v2, B$1, N$2);
    const r3 = !w2 && S2(W$1);
    const l3 = r3 && getElementScroll(g2);
    const i3 = l3 && O2();
    const a3 = m2(J$1, c3);
    const u3 = r3 && s3 && s3()[0];
    const _3 = M$1(h2);
    const d3 = getFractionalSize(h2);
    u3 && u3();
    scrollElementTo(g2, l3);
    i3 && i3();
    c3 && a3();
    return {
      w: _3.w + d3.w,
      h: _3.h + d3.h
    };
  });
  const E2 = debounce$1(s2, {
    _: () => e2,
    p: () => c2,
    S(t3, n3) {
      const [o3] = t3;
      const [s3] = n3;
      return [concat(keys$1(o3), keys$1(s3)).reduce((t4, n4) => {
        t4[n4] = o3[n4] || s3[n4];
        return t4;
      }, {})];
    }
  });
  const setDirection = (t3) => {
    const n3 = getDirectionIsRTL(p2);
    assignDeep(t3, {
      Ct: a2 !== n3
    });
    assignDeep($2, {
      F: n3
    });
    a2 = n3;
  };
  const onTrinsicChanged = (t3, n3) => {
    const [o3, e3] = t3;
    const c3 = {
      xt: e3
    };
    assignDeep($2, {
      $t: o3
    });
    !n3 && s2(c3);
    return c3;
  };
  const onSizeChanged = ({ ft: t3, dt: n3 }) => {
    const o3 = t3 && !n3;
    const e3 = !o3 && C2.P ? E2 : s2;
    const c3 = {
      ft: t3 || n3,
      dt: n3
    };
    setDirection(c3);
    e3(c3);
  };
  const onContentMutation = (t3, n3) => {
    const [, o3] = H2();
    const e3 = {
      Ht: o3
    };
    setDirection(e3);
    const c3 = t3 ? s2 : E2;
    o3 && !n3 && c3(e3);
    return e3;
  };
  const onHostMutation = (t3, n3, o3) => {
    const s3 = {
      Et: n3
    };
    setDirection(s3);
    if (n3 && !o3) {
      E2(s3);
    }
    return s3;
  };
  const [z2, I2] = b2 ? createTrinsicObserver(v2, onTrinsicChanged) : [];
  const A2 = !w2 && createSizeObserver(v2, onSizeChanged, {
    dt: true
  });
  const [D2, T2] = createDOMObserver(v2, false, onHostMutation, {
    rt: d2,
    ct: d2
  });
  const k2 = w2 && f$1 && new f$1((t3) => {
    const n3 = t3[t3.length - 1].contentRect;
    onSizeChanged({
      ft: true,
      dt: domRectAppeared(n3, i2)
    });
    i2 = n3;
  });
  const R2 = debounce$1(() => {
    const [, t3] = H2();
    s2({
      Ht: t3
    });
  }, {
    _: 222,
    v: true
  });
  return [() => {
    k2 && k2.observe(v2);
    const t3 = A2 && A2();
    const n3 = z2 && z2();
    const o3 = D2();
    const s3 = C2.K((t4) => {
      if (t4) {
        E2({
          zt: t4
        });
      } else {
        R2();
      }
    });
    return () => {
      k2 && k2.disconnect();
      t3 && t3();
      n3 && n3();
      l2 && l2();
      o3();
      s3();
    };
  }, ({ It: t3, At: n3, Dt: o3 }) => {
    const s3 = {};
    const [i3] = t3("update.ignoreMutation");
    const [a3, f2] = t3("update.attributes");
    const [p3, v3] = t3("update.elementEvents");
    const [g3, y3] = t3("update.debounce");
    const S3 = v3 || f2;
    const m3 = n3 || o3;
    const ignoreMutationFromOptions = (t4) => isFunction$1(i3) && i3(t4);
    if (S3) {
      r2 && r2();
      l2 && l2();
      const [t4, n4] = createDOMObserver(b2 || h2, true, onContentMutation, {
        ct: concat(d2, a3 || []),
        lt: p3,
        it: u2,
        _t: (t5, n5) => {
          const { target: o4, attributeName: s4 } = t5;
          const e3 = !n5 && s4 && !w2 ? liesBetween(o4, u2, _2) : false;
          return e3 || !!closest(o4, `.${at$1}`) || !!ignoreMutationFromOptions(t5);
        }
      });
      l2 = t4();
      r2 = n4;
    }
    if (y3) {
      E2.m();
      if (isArray$1(g3)) {
        const t4 = g3[0];
        const n4 = g3[1];
        e2 = isNumber(t4) && t4;
        c2 = isNumber(n4) && n4;
      } else if (isNumber(g3)) {
        e2 = g3;
        c2 = false;
      } else {
        e2 = false;
        c2 = false;
      }
    }
    if (m3) {
      const t4 = T2();
      const n4 = I2 && I2();
      const o4 = r2 && r2();
      t4 && assignDeep(s3, onHostMutation(t4[0], t4[1], m3));
      n4 && assignDeep(s3, onTrinsicChanged(n4[0], m3));
      o4 && assignDeep(s3, onContentMutation(o4[0], m3));
    }
    setDirection(s3);
    return s3;
  }, $2];
};
const resolveInitialization = (t2, n2) => isFunction$1(n2) ? n2.apply(0, t2) : n2;
const staticInitializationElement = (t2, n2, o2, s2) => {
  const e2 = isUndefined$1(s2) ? o2 : s2;
  const c2 = resolveInitialization(t2, e2);
  return c2 || n2.apply(0, t2);
};
const dynamicInitializationElement = (t2, n2, o2, s2) => {
  const e2 = isUndefined$1(s2) ? o2 : s2;
  const c2 = resolveInitialization(t2, e2);
  return !!c2 && (isHTMLElement$1(c2) ? c2 : n2.apply(0, t2));
};
const cancelInitialization = (t2, n2) => {
  const { nativeScrollbarsOverlaid: o2, body: s2 } = n2 || {};
  const { T: e2, P: c2, Z: r2 } = getEnvironment();
  const { nativeScrollbarsOverlaid: l2, body: i2 } = r2().cancel;
  const a2 = o2 != null ? o2 : l2;
  const u2 = isUndefined$1(s2) ? i2 : s2;
  const _2 = (e2.x || e2.y) && a2;
  const d2 = t2 && (isNull$1(u2) ? !c2 : u2);
  return !!_2 || !!d2;
};
const createScrollbarsSetupElements = (t2, n2, o2, s2) => {
  const e2 = "--os-viewport-percent";
  const c2 = "--os-scroll-percent";
  const r2 = "--os-scroll-direction";
  const { Z: l2 } = getEnvironment();
  const { scrollbars: i2 } = l2();
  const { slot: a2 } = i2;
  const { vt: u2, ht: _2, U: d2, Mt: f2, gt: v2, wt: h2, L: g2 } = n2;
  const { scrollbars: b2 } = f2 ? {} : t2;
  const { slot: w2 } = b2 || {};
  const y2 = [];
  const S2 = [];
  const m2 = [];
  const O2 = dynamicInitializationElement([u2, _2, d2], () => g2 && h2 ? u2 : _2, a2, w2);
  const initScrollTimeline = (t3) => {
    if (p$1) {
      let n3 = null;
      let s3 = [];
      const e3 = new p$1({
        source: v2,
        axis: t3
      });
      const cancelAnimation = () => {
        n3 && n3.cancel();
        n3 = null;
      };
      const _setScrollPercentAnimation = (c3) => {
        const { Tt: r3 } = o2;
        const l3 = isDefaultDirectionScrollCoordinates(r3)[t3];
        const i3 = t3 === "x";
        const a3 = [getTrasformTranslateValue(0, i3), getTrasformTranslateValue(`calc(100cq${i3 ? "w" : "h"} + -100%)`, i3)];
        const u3 = l3 ? a3 : a3.reverse();
        if (s3[0] === u3[0] && s3[1] === u3[1]) {
          return cancelAnimation;
        }
        cancelAnimation();
        s3 = u3;
        n3 = c3.kt.animate({
          clear: ["left"],
          transform: u3
        }, {
          timeline: e3
        });
        return cancelAnimation;
      };
      return {
        Rt: _setScrollPercentAnimation
      };
    }
  };
  const $2 = {
    x: initScrollTimeline("x"),
    y: initScrollTimeline("y")
  };
  const getViewportPercent = () => {
    const { Vt: t3, Lt: n3 } = o2;
    const getAxisValue = (t4, n4) => capNumber(0, 1, t4 / (t4 + n4) || 0);
    return {
      x: getAxisValue(n3.x, t3.x),
      y: getAxisValue(n3.y, t3.y)
    };
  };
  const scrollbarStructureAddRemoveClass = (t3, n3, o3) => {
    const s3 = o3 ? addClass : removeClass;
    each(t3, (t4) => {
      s3(t4.Ut, n3);
    });
  };
  const scrollbarStyle = (t3, n3) => {
    each(t3, (t4) => {
      const [o3, s3] = n3(t4);
      setStyles(o3, s3);
    });
  };
  const scrollbarsAddRemoveClass = (t3, n3, o3) => {
    const s3 = isBoolean(o3);
    const e3 = s3 ? o3 : true;
    const c3 = s3 ? !o3 : true;
    e3 && scrollbarStructureAddRemoveClass(S2, t3, n3);
    c3 && scrollbarStructureAddRemoveClass(m2, t3, n3);
  };
  const refreshScrollbarsHandleLength = () => {
    const t3 = getViewportPercent();
    const createScrollbarStyleFn = (t4) => (n3) => [n3.Ut, {
      [e2]: roundCssNumber(t4) + ""
    }];
    scrollbarStyle(S2, createScrollbarStyleFn(t3.x));
    scrollbarStyle(m2, createScrollbarStyleFn(t3.y));
  };
  const refreshScrollbarsHandleOffset = () => {
    if (!p$1) {
      const { Tt: t3 } = o2;
      const n3 = getScrollCoordinatesPercent(t3, getElementScroll(v2));
      const createScrollbarStyleFn = (t4) => (n4) => [n4.Ut, {
        [c2]: roundCssNumber(t4) + ""
      }];
      scrollbarStyle(S2, createScrollbarStyleFn(n3.x));
      scrollbarStyle(m2, createScrollbarStyleFn(n3.y));
    }
  };
  const refreshScrollbarsScrollCoordinates = () => {
    const { Tt: t3 } = o2;
    const n3 = isDefaultDirectionScrollCoordinates(t3);
    const createScrollbarStyleFn = (t4) => (n4) => [n4.Ut, {
      [r2]: t4 ? "0" : "1"
    }];
    scrollbarStyle(S2, createScrollbarStyleFn(n3.x));
    scrollbarStyle(m2, createScrollbarStyleFn(n3.y));
    if (p$1) {
      S2.forEach($2.x.Rt);
      m2.forEach($2.y.Rt);
    }
  };
  const refreshScrollbarsScrollbarOffset = () => {
    if (g2 && !h2) {
      const { Vt: t3, Tt: n3 } = o2;
      const s3 = isDefaultDirectionScrollCoordinates(n3);
      const e3 = getScrollCoordinatesPercent(n3, getElementScroll(v2));
      const styleScrollbarPosition = (n4) => {
        const { Ut: o3 } = n4;
        const c3 = parent$1(o3) === d2 && o3;
        const getTranslateValue = (t4, n5, o4) => {
          const s4 = n5 * t4;
          return numberToCssPx(o4 ? s4 : -s4);
        };
        return [c3, c3 && {
          transform: getTrasformTranslateValue({
            x: getTranslateValue(e3.x, t3.x, s3.x),
            y: getTranslateValue(e3.y, t3.y, s3.y)
          })
        }];
      };
      scrollbarStyle(S2, styleScrollbarPosition);
      scrollbarStyle(m2, styleScrollbarPosition);
    }
  };
  const generateScrollbarDOM = (t3) => {
    const n3 = t3 ? "x" : "y";
    const o3 = t3 ? _t$1 : dt$1;
    const e3 = createDiv(`${at$1} ${o3}`);
    const c3 = createDiv(ft$1);
    const r3 = createDiv(pt$1);
    const l3 = {
      Ut: e3,
      Pt: c3,
      kt: r3
    };
    const i3 = $2[n3];
    push(t3 ? S2 : m2, l3);
    push(y2, [appendChildren(e3, c3), appendChildren(c3, r3), bind(removeElements, e3), i3 && i3.Rt(l3), s2(l3, scrollbarsAddRemoveClass, t3)]);
    return l3;
  };
  const C2 = bind(generateScrollbarDOM, true);
  const x2 = bind(generateScrollbarDOM, false);
  const appendElements = () => {
    appendChildren(O2, S2[0].Ut);
    appendChildren(O2, m2[0].Ut);
    return bind(runEachAndClear, y2);
  };
  C2();
  x2();
  return [{
    Nt: refreshScrollbarsHandleLength,
    qt: refreshScrollbarsHandleOffset,
    Bt: refreshScrollbarsScrollCoordinates,
    Ft: refreshScrollbarsScrollbarOffset,
    jt: scrollbarsAddRemoveClass,
    Xt: {
      Yt: S2,
      Wt: C2,
      Jt: bind(scrollbarStyle, S2)
    },
    Gt: {
      Yt: m2,
      Wt: x2,
      Jt: bind(scrollbarStyle, m2)
    }
  }, appendElements];
};
const createScrollbarsSetupEvents = (t2, n2, o2, s2) => (r2, l2, i2) => {
  const { ht: u2, U: _2, L: d2, gt: f2, Kt: p2, Ot: v2 } = n2;
  const { Ut: h2, Pt: g2, kt: b2 } = r2;
  const [w2, y2] = selfClearTimeout(333);
  const [S2, m2] = selfClearTimeout(444);
  const scrollOffsetElementScrollBy = (t3) => {
    isFunction$1(f2.scrollBy) && f2.scrollBy({
      behavior: "smooth",
      left: t3.x,
      top: t3.y
    });
  };
  const createInteractiveScrollEvents = () => {
    const n3 = "pointerup pointercancel lostpointercapture";
    const s3 = `client${i2 ? "X" : "Y"}`;
    const r3 = i2 ? $ : C$1;
    const l3 = i2 ? "left" : "top";
    const a2 = i2 ? "w" : "h";
    const u3 = i2 ? "x" : "y";
    const createRelativeHandleMove = (t3, n4) => (s4) => {
      const { Vt: e2 } = o2;
      const c2 = A$1(g2)[a2] - A$1(b2)[a2];
      const r4 = n4 * s4 / c2;
      const l4 = r4 * e2[u3];
      scrollElementTo(f2, {
        [u3]: t3 + l4
      });
    };
    const _3 = [];
    return addEventListener(g2, "pointerdown", (o3) => {
      const i3 = closest(o3.target, `.${pt$1}`) === b2;
      const d3 = i3 ? b2 : g2;
      const h3 = t2.scrollbars;
      const w3 = h3[i3 ? "dragScroll" : "clickScroll"];
      const { button: y3, isPrimary: O3, pointerType: $2 } = o3;
      const { pointers: C2 } = h3;
      const x2 = y3 === 0 && O3 && w3 && (C2 || []).includes($2);
      if (x2) {
        runEachAndClear(_3);
        m2();
        const t3 = !i3 && (o3.shiftKey || w3 === "instant");
        const h4 = bind(getBoundingClientRect$1, b2);
        const y4 = bind(getBoundingClientRect$1, g2);
        const getHandleOffset = (t4, n4) => (t4 || h4())[l3] - (n4 || y4())[l3];
        const O4 = e(getBoundingClientRect$1(f2)[r3]) / A$1(f2)[a2] || 1;
        const $3 = createRelativeHandleMove(getElementScroll(f2)[u3], 1 / O4);
        const C3 = o3[s3];
        const x3 = h4();
        const H2 = y4();
        const E2 = x3[r3];
        const z2 = getHandleOffset(x3, H2) + E2 / 2;
        const I2 = C3 - H2[l3];
        const D2 = i3 ? 0 : I2 - z2;
        const releasePointerCapture = (t4) => {
          runEachAndClear(k2);
          d3.releasePointerCapture(t4.pointerId);
        };
        const M2 = i3 || t3;
        const T2 = v2();
        const k2 = [addEventListener(p2, n3, releasePointerCapture), addEventListener(p2, "selectstart", (t4) => preventDefault(t4), {
          H: false
        }), addEventListener(g2, n3, releasePointerCapture), M2 && addEventListener(g2, "pointermove", (t4) => $3(D2 + (t4[s3] - C3))), M2 && (() => {
          const t4 = getElementScroll(f2);
          T2();
          const n4 = getElementScroll(f2);
          const o4 = {
            x: n4.x - t4.x,
            y: n4.y - t4.y
          };
          if (c$1(o4.x) > 3 || c$1(o4.y) > 3) {
            v2();
            scrollElementTo(f2, t4);
            scrollOffsetElementScrollBy(o4);
            S2(T2);
          }
        })];
        d3.setPointerCapture(o3.pointerId);
        if (t3) {
          $3(D2);
        } else if (!i3) {
          const t4 = getStaticPluginModuleInstance(Et);
          if (t4) {
            const n4 = t4($3, D2, E2, (t5) => {
              if (t5) {
                T2();
              } else {
                push(k2, T2);
              }
            });
            push(k2, n4);
            push(_3, bind(n4, true));
          }
        }
      }
    });
  };
  let O2 = true;
  return bind(runEachAndClear, [addEventListener(b2, "pointermove pointerleave", s2), addEventListener(h2, "pointerenter", () => {
    l2(gt$1, true);
  }), addEventListener(h2, "pointerleave pointercancel", () => {
    l2(gt$1, false);
  }), !d2 && addEventListener(h2, "mousedown", () => {
    const t3 = getFocusedElement();
    if (hasAttr(t3, j) || hasAttr(t3, B$1) || t3 === document.body) {
      a$1(bind(focusElement, _2), 25);
    }
  }), addEventListener(h2, "wheel", (t3) => {
    const { deltaX: n3, deltaY: o3, deltaMode: s3 } = t3;
    if (O2 && s3 === 0 && parent$1(h2) === u2) {
      scrollOffsetElementScrollBy({
        x: n3,
        y: o3
      });
    }
    O2 = false;
    l2(St$1, true);
    w2(() => {
      O2 = true;
      l2(St$1);
    });
    preventDefault(t3);
  }, {
    H: false,
    I: true
  }), addEventListener(h2, "pointerdown", bind(addEventListener, p2, "click", stopAndPrevent, {
    A: true,
    I: true,
    H: false
  }), {
    I: true
  }), createInteractiveScrollEvents(), y2, m2]);
};
const createScrollbarsSetup = (t2, n2, o2, s2, e2, c2) => {
  let r2;
  let l2;
  let i2;
  let a2;
  let u2;
  let _2 = noop$1;
  let d2 = 0;
  const f2 = ["mouse", "pen"];
  const isHoverablePointerType = (t3) => f2.includes(t3.pointerType);
  const [p2, v2] = selfClearTimeout();
  const [h2, g2] = selfClearTimeout(100);
  const [b2, w2] = selfClearTimeout(100);
  const [y2, S2] = selfClearTimeout(() => d2);
  const [m2, O2] = createScrollbarsSetupElements(t2, e2, s2, createScrollbarsSetupEvents(n2, e2, s2, (t3) => isHoverablePointerType(t3) && manageScrollbarsAutoHideInstantInteraction()));
  const { ht: $2, Qt: C2, wt: H2 } = e2;
  const { jt: z2, Nt: I2, qt: A2, Bt: D2, Ft: M2 } = m2;
  const manageScrollbarsAutoHide = (t3, n3) => {
    S2();
    if (t3) {
      z2(yt$1);
    } else {
      const t4 = bind(z2, yt$1, true);
      if (d2 > 0 && !n3) {
        y2(t4);
      } else {
        t4();
      }
    }
  };
  const manageScrollbarsAutoHideInstantInteraction = () => {
    if (i2 ? !r2 : !a2) {
      manageScrollbarsAutoHide(true);
      h2(() => {
        manageScrollbarsAutoHide(false);
      });
    }
  };
  const manageAutoHideSuspension = (t3) => {
    z2(wt$1, t3, true);
    z2(wt$1, t3, false);
  };
  const onHostMouseEnter = (t3) => {
    if (isHoverablePointerType(t3)) {
      r2 = i2;
      i2 && manageScrollbarsAutoHide(true);
    }
  };
  const T2 = [S2, g2, w2, v2, () => _2(), addEventListener($2, "pointerover", onHostMouseEnter, {
    A: true
  }), addEventListener($2, "pointerenter", onHostMouseEnter), addEventListener($2, "pointerleave", (t3) => {
    if (isHoverablePointerType(t3)) {
      r2 = false;
      i2 && manageScrollbarsAutoHide(false);
    }
  }), addEventListener($2, "pointermove", (t3) => {
    isHoverablePointerType(t3) && l2 && manageScrollbarsAutoHideInstantInteraction();
  }), addEventListener(C2, "scroll", (t3) => {
    p2(() => {
      A2();
      manageScrollbarsAutoHideInstantInteraction();
    });
    c2(t3);
    M2();
  })];
  return [() => bind(runEachAndClear, push(T2, O2())), ({ It: t3, Dt: n3, Zt: e3, tn: c3 }) => {
    const { nn: r3, sn: f3, en: p3, cn: v3 } = c3 || {};
    const { Ct: h3, dt: g3 } = e3 || {};
    const { F: w3 } = o2;
    const { T: y3 } = getEnvironment();
    const { k: S3, rn: m3 } = s2;
    const [O3, $3] = t3("showNativeOverlaidScrollbars");
    const [T3, k2] = t3("scrollbars.theme");
    const [R2, V2] = t3("scrollbars.visibility");
    const [L2, U2] = t3("scrollbars.autoHide");
    const [P2, N2] = t3("scrollbars.autoHideSuspend");
    const [q2] = t3("scrollbars.autoHideDelay");
    const [B2, F2] = t3("scrollbars.dragScroll");
    const [j2, X2] = t3("scrollbars.clickScroll");
    const [Y2, W2] = t3("overflow");
    const J2 = g3 && !n3;
    const G2 = m3.x || m3.y;
    const K2 = r3 || f3 || v3 || h3 || n3;
    const Q2 = p3 || V2 || W2;
    const Z2 = O3 && y3.x && y3.y;
    const setScrollbarVisibility = (t4, n4, o3) => {
      const s3 = t4.includes(E$2) && (R2 === x$1 || R2 === "auto" && n4 === E$2);
      z2(vt$1, s3, o3);
      return s3;
    };
    d2 = q2;
    if (J2) {
      if (P2 && G2) {
        manageAutoHideSuspension(false);
        _2();
        b2(() => {
          _2 = addEventListener(C2, "scroll", bind(manageAutoHideSuspension, true), {
            A: true
          });
        });
      } else {
        manageAutoHideSuspension(true);
      }
    }
    if ($3) {
      z2(it$1, Z2);
    }
    if (k2) {
      z2(u2);
      z2(T3, true);
      u2 = T3;
    }
    if (N2 && !P2) {
      manageAutoHideSuspension(true);
    }
    if (U2) {
      l2 = L2 === "move";
      i2 = L2 === "leave";
      a2 = L2 === "never";
      manageScrollbarsAutoHide(a2, true);
    }
    if (F2) {
      z2(Ot$1, B2);
    }
    if (X2) {
      z2(mt$1, !!j2);
    }
    if (Q2) {
      const t4 = setScrollbarVisibility(Y2.x, S3.x, true);
      const n4 = setScrollbarVisibility(Y2.y, S3.y, false);
      const o3 = t4 && n4;
      z2(ht$1, !o3);
    }
    if (K2) {
      A2();
      I2();
      M2();
      v3 && D2();
      z2(bt$1, !m3.x, true);
      z2(bt$1, !m3.y, false);
      z2(ut$1, w3 && !H2);
    }
  }, {}, m2];
};
const createStructureSetupElements = (t2) => {
  const o2 = getEnvironment();
  const { Z: s2, P: e2 } = o2;
  const { elements: c2 } = s2();
  const { padding: r2, viewport: l2, content: i2 } = c2;
  const a2 = isHTMLElement$1(t2);
  const u2 = a2 ? {} : t2;
  const { elements: _2 } = u2;
  const { padding: d2, viewport: f2, content: p2 } = _2 || {};
  const v2 = a2 ? t2 : u2.target;
  const h2 = isBodyElement(v2);
  const g2 = v2.ownerDocument;
  const b2 = g2.documentElement;
  const getDocumentWindow = () => g2.defaultView || n;
  const w2 = bind(staticInitializationElement, [v2]);
  const y2 = bind(dynamicInitializationElement, [v2]);
  const S2 = bind(createDiv, "");
  const $2 = bind(w2, S2, l2);
  const C2 = bind(y2, S2, i2);
  const elementHasOverflow = (t3) => {
    const n2 = A$1(t3);
    const o3 = M$1(t3);
    const s3 = getStyles(t3, m$1);
    const e3 = getStyles(t3, O$1);
    return o3.w - n2.w > 0 && !overflowIsVisible(s3) || o3.h - n2.h > 0 && !overflowIsVisible(e3);
  };
  const x2 = $2(f2);
  const H2 = x2 === v2;
  const E2 = H2 && h2;
  const z2 = !H2 && C2(p2);
  const I2 = !H2 && x2 === z2;
  const D2 = E2 ? b2 : x2;
  const T2 = E2 ? D2 : v2;
  const k2 = !H2 && y2(S2, r2, d2);
  const R2 = !I2 && z2;
  const V2 = [R2, D2, k2, T2].map((t3) => isHTMLElement$1(t3) && !parent$1(t3) && t3);
  const elementIsGenerated = (t3) => t3 && inArray(V2, t3);
  const L2 = !elementIsGenerated(D2) && elementHasOverflow(D2) ? D2 : v2;
  const U2 = E2 ? b2 : D2;
  const N2 = E2 ? g2 : D2;
  const X2 = {
    vt: v2,
    ht: T2,
    U: D2,
    ln: k2,
    bt: R2,
    gt: U2,
    Qt: N2,
    an: h2 ? b2 : L2,
    Kt: g2,
    wt: h2,
    Mt: a2,
    L: H2,
    un: getDocumentWindow,
    yt: (t3) => hasAttrClass(D2, j, t3),
    St: (t3, n2) => addRemoveAttrClass(D2, j, t3, n2),
    Ot: () => addRemoveAttrClass(U2, j, G$1, true)
  };
  const { vt: Y2, ht: W2, ln: J2, U: Q2, bt: nt2 } = X2;
  const ot2 = [() => {
    removeAttrs(W2, [B$1, P$2]);
    removeAttrs(Y2, P$2);
    if (h2) {
      removeAttrs(b2, [P$2, B$1]);
    }
  }];
  let st2 = contents([nt2, Q2, J2, W2, Y2].find((t3) => t3 && !elementIsGenerated(t3)));
  const et2 = E2 ? Y2 : nt2 || Q2;
  const ct2 = bind(runEachAndClear, ot2);
  const appendElements = () => {
    const t3 = getDocumentWindow();
    const n2 = getFocusedElement();
    const unwrap = (t4) => {
      appendChildren(parent$1(t4), contents(t4));
      removeElements(t4);
    };
    const prepareWrapUnwrapFocus = (t4) => addEventListener(t4, "focusin focusout focus blur", stopAndPrevent, {
      I: true,
      H: false
    });
    const o3 = "tabindex";
    const s3 = getAttr(Q2, o3);
    const c3 = prepareWrapUnwrapFocus(n2);
    setAttrs(W2, B$1, H2 ? "" : F$1);
    setAttrs(J2, Z$1, "");
    setAttrs(Q2, j, "");
    setAttrs(nt2, tt$1, "");
    if (!H2) {
      setAttrs(Q2, o3, s3 || "-1");
      h2 && setAttrs(b2, q$1, "");
    }
    appendChildren(et2, st2);
    appendChildren(W2, J2);
    appendChildren(J2 || W2, !H2 && Q2);
    appendChildren(Q2, nt2);
    push(ot2, [c3, () => {
      const t4 = getFocusedElement();
      const n3 = elementIsGenerated(Q2);
      const e3 = n3 && t4 === Q2 ? Y2 : t4;
      const c4 = prepareWrapUnwrapFocus(e3);
      removeAttrs(J2, Z$1);
      removeAttrs(nt2, tt$1);
      removeAttrs(Q2, j);
      h2 && removeAttrs(b2, q$1);
      s3 ? setAttrs(Q2, o3, s3) : removeAttrs(Q2, o3);
      elementIsGenerated(nt2) && unwrap(nt2);
      n3 && unwrap(Q2);
      elementIsGenerated(J2) && unwrap(J2);
      focusElement(e3);
      c4();
    }]);
    if (e2 && !H2) {
      addAttrClass(Q2, j, K$1);
      push(ot2, bind(removeAttrs, Q2, j));
    }
    focusElement(!H2 && h2 && n2 === Y2 && t3.top === t3 ? Q2 : n2);
    c3();
    st2 = 0;
    return ct2;
  };
  return [X2, appendElements, ct2];
};
const createTrinsicUpdateSegment = ({ bt: t2 }) => ({ Zt: n2, _n: o2, Dt: s2 }) => {
  const { xt: e2 } = n2 || {};
  const { $t: c2 } = o2;
  const r2 = t2 && (e2 || s2);
  if (r2) {
    setStyles(t2, {
      [C$1]: c2 && "100%"
    });
  }
};
const createPaddingUpdateSegment = ({ ht: t2, ln: n2, U: o2, L: s2 }, e2) => {
  const [c2, r2] = createCache({
    i: equalTRBL,
    o: topRightBottomLeft()
  }, bind(topRightBottomLeft, t2, "padding", ""));
  return ({ It: t3, Zt: l2, _n: i2, Dt: a2 }) => {
    let [u2, _2] = r2(a2);
    const { P: d2 } = getEnvironment();
    const { ft: f2, Ht: p2, Ct: m2 } = l2 || {};
    const { F: O2 } = i2;
    const [C2, x2] = t3("paddingAbsolute");
    const H2 = a2 || p2;
    if (f2 || _2 || H2) {
      [u2, _2] = c2(a2);
    }
    const E2 = !s2 && (x2 || m2 || _2);
    if (E2) {
      const t4 = !C2 || !n2 && !d2;
      const s3 = u2.r + u2.l;
      const c3 = u2.t + u2.b;
      const r3 = {
        [y]: t4 && !O2 ? -s3 : 0,
        [S$1]: t4 ? -c3 : 0,
        [w$1]: t4 && O2 ? -s3 : 0,
        top: t4 ? -u2.t : 0,
        right: t4 ? O2 ? -u2.r : "auto" : 0,
        left: t4 ? O2 ? "auto" : -u2.l : 0,
        [$]: t4 && `calc(100% + ${s3}px)`
      };
      const l3 = {
        [v$1]: t4 ? u2.t : 0,
        [h$1]: t4 ? u2.r : 0,
        [b$1]: t4 ? u2.b : 0,
        [g]: t4 ? u2.l : 0
      };
      setStyles(n2 || o2, r3);
      setStyles(o2, l3);
      assignDeep(e2, {
        ln: u2,
        dn: !t4,
        j: n2 ? l3 : assignDeep({}, r3, l3)
      });
    }
    return {
      fn: E2
    };
  };
};
const createOverflowUpdateSegment = (t2, s2) => {
  const e2 = getEnvironment();
  const { ht: c2, ln: r2, U: l2, L: a2, Qt: u2, gt: _2, wt: d2, St: f2, un: p2 } = t2;
  const { P: v2 } = e2;
  const h2 = d2 && a2;
  const g2 = bind(o$1, 0);
  const b2 = {
    display: () => false,
    direction: (t3) => t3 !== "ltr",
    flexDirection: (t3) => t3.endsWith("-reverse"),
    writingMode: (t3) => t3 !== "horizontal-tb"
  };
  const w2 = keys$1(b2);
  const y2 = {
    i: equalWH,
    o: {
      w: 0,
      h: 0
    }
  };
  const S2 = {
    i: equalXY,
    o: {}
  };
  const setMeasuringMode = (t3) => {
    f2(J$1, !h2 && t3);
  };
  const getMeasuredScrollCoordinates = (t3) => {
    const n2 = w2.some((n3) => {
      const o3 = t3[n3];
      return o3 && b2[n3](o3);
    });
    if (!n2) {
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    }
    setMeasuringMode(true);
    const o2 = getElementScroll(_2);
    const s3 = f2(Q$1, true);
    const e3 = addEventListener(u2, E$2, (t4) => {
      const n3 = getElementScroll(_2);
      if (t4.isTrusted && n3.x === o2.x && n3.y === o2.y) {
        stopPropagation(t4);
      }
    }, {
      I: true,
      A: true
    });
    scrollElementTo(_2, {
      x: 0,
      y: 0
    });
    s3();
    const c3 = getElementScroll(_2);
    const r3 = M$1(_2);
    scrollElementTo(_2, {
      x: r3.w,
      y: r3.h
    });
    const l3 = getElementScroll(_2);
    scrollElementTo(_2, {
      x: l3.x - c3.x < 1 && -r3.w,
      y: l3.y - c3.y < 1 && -r3.h
    });
    const a3 = getElementScroll(_2);
    scrollElementTo(_2, o2);
    i(() => e3());
    return {
      D: c3,
      M: a3
    };
  };
  const getOverflowAmount = (t3, o2) => {
    const s3 = n.devicePixelRatio % 1 !== 0 ? 1 : 0;
    const e3 = {
      w: g2(t3.w - o2.w),
      h: g2(t3.h - o2.h)
    };
    return {
      w: e3.w > s3 ? e3.w : 0,
      h: e3.h > s3 ? e3.h : 0
    };
  };
  const [m2, O2] = createCache(y2, bind(getFractionalSize, l2));
  const [$2, C2] = createCache(y2, bind(M$1, l2));
  const [z2, I2] = createCache(y2);
  const [A2] = createCache(S2);
  const [T2, k2] = createCache(y2);
  const [R2] = createCache(S2);
  const [V2] = createCache({
    i: (t3, n2) => equal(t3, n2, w2),
    o: {}
  }, () => hasDimensions(l2) ? getStyles(l2, w2) : {});
  const [L2, U2] = createCache({
    i: (t3, n2) => equalXY(t3.D, n2.D) && equalXY(t3.M, n2.M),
    o: getZeroScrollCoordinates()
  });
  const P2 = getStaticPluginModuleInstance(xt$1);
  const createViewportOverflowStyleClassName = (t3, n2) => {
    const o2 = n2 ? X$2 : Y$1;
    return `${o2}${capitalizeFirstLetter(t3)}`;
  };
  const setViewportOverflowStyle = (t3) => {
    const createAllOverflowStyleClassNames = (t4) => [x$1, H$1, E$2].map((n3) => createViewportOverflowStyleClassName(n3, t4));
    const n2 = createAllOverflowStyleClassNames(true).concat(createAllOverflowStyleClassNames()).join(" ");
    f2(n2);
    f2(keys$1(t3).map((n3) => createViewportOverflowStyleClassName(t3[n3], n3 === "x")).join(" "), true);
  };
  return ({ It: n2, Zt: o2, _n: i2, Dt: a3 }, { fn: u3 }) => {
    const { ft: _3, Ht: d3, Ct: b3, dt: w3, zt: y3 } = o2 || {};
    const S3 = P2 && P2.V(t2, s2, i2, e2, n2);
    const { Y: x2, W: H2, J: E2 } = S3 || {};
    const [M2, q2] = getShowNativeOverlaidScrollbars(n2, e2);
    const [F2, j2] = n2("overflow");
    const X2 = overflowIsVisible(F2.x);
    const Y2 = overflowIsVisible(F2.y);
    let J2 = O2(a3);
    let G2 = C2(a3);
    let Q2 = I2(a3);
    let tt2 = k2(a3);
    if (q2 && v2) {
      f2(K$1, !M2);
    }
    {
      if (hasAttrClass(c2, B$1, N$2)) {
        setMeasuringMode(true);
      }
      const [t3] = H2 ? H2() : [];
      const [n3] = J2 = m2(a3);
      const [o3] = G2 = $2(a3);
      const s3 = D$1(l2);
      const e3 = h2 && getWindowSize(p2());
      const r3 = {
        w: g2(o3.w + n3.w),
        h: g2(o3.h + n3.h)
      };
      const i3 = {
        w: g2((e3 ? e3.w : s3.w + g2(s3.w - o3.w)) + n3.w),
        h: g2((e3 ? e3.h : s3.h + g2(s3.h - o3.h)) + n3.h)
      };
      t3 && t3();
      tt2 = T2(i3);
      Q2 = z2(getOverflowAmount(r3, i3), a3);
    }
    const [nt2, ot2] = tt2;
    const [st2, et2] = Q2;
    const [ct2, rt2] = G2;
    const [lt2, it2] = J2;
    const [at2, ut2] = A2({
      x: st2.w > 0,
      y: st2.h > 0
    });
    const _t2 = X2 && Y2 && (at2.x || at2.y) || X2 && at2.x && !at2.y || Y2 && at2.y && !at2.x;
    const ft2 = createViewportOverflowState(at2, F2);
    const [pt2, vt2] = R2(ft2.k);
    const [ht2, gt2] = V2(a3);
    const bt2 = b3 || w3 || gt2 || ut2 || a3;
    const [wt2, yt2] = bt2 ? L2(getMeasuredScrollCoordinates(ht2), a3) : U2();
    {
      vt2 && setViewportOverflowStyle(ft2.k);
      if (E2 && x2) {
        setStyles(l2, E2(ft2, i2, x2(ft2, ct2, lt2)));
      }
    }
    setMeasuringMode(false);
    addRemoveAttrClass(c2, B$1, N$2, _t2);
    addRemoveAttrClass(r2, Z$1, N$2, _t2);
    assignDeep(s2, {
      k: pt2,
      Lt: {
        x: nt2.w,
        y: nt2.h
      },
      Vt: {
        x: st2.w,
        y: st2.h
      },
      rn: at2,
      Tt: sanitizeScrollCoordinates(wt2, st2)
    });
    return {
      en: vt2,
      nn: ot2,
      sn: et2,
      cn: yt2 || et2,
      pn: bt2
    };
  };
};
const createStructureSetup = (t2) => {
  const [n2, o2, s2] = createStructureSetupElements(t2);
  const e2 = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    dn: false,
    j: {
      [y]: 0,
      [S$1]: 0,
      [w$1]: 0,
      [v$1]: 0,
      [h$1]: 0,
      [b$1]: 0,
      [g]: 0
    },
    Lt: {
      x: 0,
      y: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    k: {
      x: H$1,
      y: H$1
    },
    rn: {
      x: false,
      y: false
    },
    Tt: getZeroScrollCoordinates()
  };
  const { vt: c2, gt: r2, L: l2, Ot: i2 } = n2;
  const { P: a2, T: u2 } = getEnvironment();
  const _2 = !a2 && (u2.x || u2.y);
  const d2 = [createTrinsicUpdateSegment(n2), createPaddingUpdateSegment(n2, e2), createOverflowUpdateSegment(n2, e2)];
  return [o2, (t3) => {
    const n3 = {};
    const o3 = _2;
    const s3 = o3 && getElementScroll(r2);
    const e3 = s3 && i2();
    each(d2, (o4) => {
      assignDeep(n3, o4(t3, n3) || {});
    });
    scrollElementTo(r2, s3);
    e3 && e3();
    !l2 && scrollElementTo(c2, 0);
    return n3;
  }, e2, n2, s2];
};
const createSetups = (t2, n2, o2, s2, e2) => {
  let c2 = false;
  const r2 = createOptionCheck(n2, {});
  const [l2, i2, a2, u2, _2] = createStructureSetup(t2);
  const [d2, f2, p2] = createObserversSetup(u2, a2, r2, (t3) => {
    update({}, t3);
  });
  const [v2, h2, , g2] = createScrollbarsSetup(t2, n2, p2, a2, u2, e2);
  const updateHintsAreTruthy = (t3) => keys$1(t3).some((n3) => !!t3[n3]);
  const update = (t3, e3) => {
    if (o2()) {
      return false;
    }
    const { vn: r3, Dt: l3, At: a3, hn: u3 } = t3;
    const _3 = r3 || {};
    const d3 = !!l3 || !c2;
    const v3 = {
      It: createOptionCheck(n2, _3, d3),
      vn: _3,
      Dt: d3
    };
    if (u3) {
      h2(v3);
      return false;
    }
    const g3 = e3 || f2(assignDeep({}, v3, {
      At: a3
    }));
    const b2 = i2(assignDeep({}, v3, {
      _n: p2,
      Zt: g3
    }));
    h2(assignDeep({}, v3, {
      Zt: g3,
      tn: b2
    }));
    const w2 = updateHintsAreTruthy(g3);
    const y2 = updateHintsAreTruthy(b2);
    const S2 = w2 || y2 || !isEmptyObject(_3) || d3;
    c2 = true;
    S2 && s2(t3, {
      Zt: g3,
      tn: b2
    });
    return S2;
  };
  return [() => {
    const { an: t3, gt: n3, Ot: o3 } = u2;
    const s3 = getElementScroll(t3);
    const e3 = [d2(), l2(), v2()];
    const c3 = o3();
    scrollElementTo(n3, s3);
    c3();
    return bind(runEachAndClear, e3);
  }, update, () => ({
    gn: p2,
    bn: a2
  }), {
    wn: u2,
    yn: g2
  }, _2];
};
const Mt$1 = /* @__PURE__ */ new WeakMap();
const addInstance = (t2, n2) => {
  Mt$1.set(t2, n2);
};
const removeInstance = (t2) => {
  Mt$1.delete(t2);
};
const getInstance = (t2) => Mt$1.get(t2);
const OverlayScrollbars = (t2, n2, o2) => {
  const { nt: s2 } = getEnvironment();
  const e2 = isHTMLElement$1(t2);
  const c2 = e2 ? t2 : t2.target;
  const r2 = getInstance(c2);
  if (n2 && !r2) {
    let r3 = false;
    const l2 = [];
    const i2 = {};
    const validateOptions = (t3) => {
      const n3 = removeUndefinedProperties(t3);
      const o3 = getStaticPluginModuleInstance(R$1);
      return o3 ? o3(n3, true) : n3;
    };
    const a2 = assignDeep({}, s2(), validateOptions(n2));
    const [u2, _2, d2] = createEventListenerHub();
    const [f2, p2, v2] = createEventListenerHub(o2);
    const triggerEvent = (t3, n3) => {
      v2(t3, n3);
      d2(t3, n3);
    };
    const [h2, g2, b2, w2, y2] = createSetups(t2, a2, () => r3, ({ vn: t3, Dt: n3 }, { Zt: o3, tn: s3 }) => {
      const { ft: e3, Ct: c3, xt: r4, Ht: l3, Et: i3, dt: a3 } = o3;
      const { nn: u3, sn: _3, en: d3, cn: f3 } = s3;
      triggerEvent("updated", [S2, {
        updateHints: {
          sizeChanged: !!e3,
          directionChanged: !!c3,
          heightIntrinsicChanged: !!r4,
          overflowEdgeChanged: !!u3,
          overflowAmountChanged: !!_3,
          overflowStyleChanged: !!d3,
          scrollCoordinatesChanged: !!f3,
          contentMutation: !!l3,
          hostMutation: !!i3,
          appear: !!a3
        },
        changedOptions: t3 || {},
        force: !!n3
      }]);
    }, (t3) => triggerEvent("scroll", [S2, t3]));
    const destroy = (t3) => {
      removeInstance(c2);
      runEachAndClear(l2);
      r3 = true;
      triggerEvent("destroyed", [S2, t3]);
      _2();
      p2();
    };
    const S2 = {
      options(t3, n3) {
        if (t3) {
          const o3 = n3 ? s2() : {};
          const e3 = getOptionsDiff(a2, assignDeep(o3, validateOptions(t3)));
          if (!isEmptyObject(e3)) {
            assignDeep(a2, e3);
            g2({
              vn: e3
            });
          }
        }
        return assignDeep({}, a2);
      },
      on: f2,
      off: (t3, n3) => {
        t3 && n3 && p2(t3, n3);
      },
      state() {
        const { gn: t3, bn: n3 } = b2();
        const { F: o3 } = t3;
        const { Lt: s3, Vt: e3, k: c3, rn: l3, ln: i3, dn: a3, Tt: u3 } = n3;
        return assignDeep({}, {
          overflowEdge: s3,
          overflowAmount: e3,
          overflowStyle: c3,
          hasOverflow: l3,
          scrollCoordinates: {
            start: u3.D,
            end: u3.M
          },
          padding: i3,
          paddingAbsolute: a3,
          directionRTL: o3,
          destroyed: r3
        });
      },
      elements() {
        const { vt: t3, ht: n3, ln: o3, U: s3, bt: e3, gt: c3, Qt: r4 } = w2.wn;
        const { Xt: l3, Gt: i3 } = w2.yn;
        const translateScrollbarStructure = (t4) => {
          const { kt: n4, Pt: o4, Ut: s4 } = t4;
          return {
            scrollbar: s4,
            track: o4,
            handle: n4
          };
        };
        const translateScrollbarsSetupElement = (t4) => {
          const { Yt: n4, Wt: o4 } = t4;
          const s4 = translateScrollbarStructure(n4[0]);
          return assignDeep({}, s4, {
            clone: () => {
              const t5 = translateScrollbarStructure(o4());
              g2({
                hn: true
              });
              return t5;
            }
          });
        };
        return assignDeep({}, {
          target: t3,
          host: n3,
          padding: o3 || s3,
          viewport: s3,
          content: e3 || s3,
          scrollOffsetElement: c3,
          scrollEventElement: r4,
          scrollbarHorizontal: translateScrollbarsSetupElement(l3),
          scrollbarVertical: translateScrollbarsSetupElement(i3)
        });
      },
      update: (t3) => g2({
        Dt: t3,
        At: true
      }),
      destroy: bind(destroy, false),
      plugin: (t3) => i2[keys$1(t3)[0]]
    };
    push(l2, [y2]);
    addInstance(c2, S2);
    registerPluginModuleInstances(T$1, OverlayScrollbars, [S2, u2, i2]);
    if (cancelInitialization(w2.wn.wt, !e2 && t2.cancel)) {
      destroy(true);
      return S2;
    }
    push(l2, h2());
    triggerEvent("initialized", [S2]);
    S2.update();
    return S2;
  }
  return r2;
};
OverlayScrollbars.plugin = (t2) => {
  const n2 = isArray$1(t2);
  const o2 = n2 ? t2 : [t2];
  const s2 = o2.map((t3) => registerPluginModuleInstances(t3, OverlayScrollbars)[0]);
  addPlugins(o2);
  return n2 ? s2 : s2[0];
};
OverlayScrollbars.valid = (t2) => {
  const n2 = t2 && t2.elements;
  const o2 = isFunction$1(n2) && n2();
  return isPlainObject$1(o2) && !!getInstance(o2.target);
};
OverlayScrollbars.env = () => {
  const { N: t2, T: n2, P: o2, G: s2, st: e2, et: c2, Z: r2, tt: l2, nt: i2, ot: a2 } = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t2,
    scrollbarsOverlaid: n2,
    scrollbarsHiding: o2,
    scrollTimeline: s2,
    staticDefaultInitialization: e2,
    staticDefaultOptions: c2,
    getDefaultInitialization: r2,
    setDefaultInitialization: l2,
    getDefaultOptions: i2,
    setDefaultOptions: a2
  });
};
OverlayScrollbars.nonce = setNonce;
OverlayScrollbars.trustedTypePolicy = setTrustedTypePolicy;
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var Symbol$1 = root.Symbol;
var objectProto$f = Object.prototype;
var hasOwnProperty$c = objectProto$f.hasOwnProperty;
var nativeObjectToString$1 = objectProto$f.toString;
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$c.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$e = Object.prototype;
var nativeObjectToString = objectProto$e.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag$3 = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
}
function arrayMap(array4, iteratee) {
  var index = -1, length = array4 == null ? 0 : array4.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array4[index], index, array4);
  }
  return result;
}
var isArray = Array.isArray;
var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
var reWhitespace = /\s/;
function trimmedEndIndex(string3) {
  var index = string3.length;
  while (index-- && reWhitespace.test(string3.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string3) {
  return string3 ? string3.slice(0, trimmedEndIndex(string3) + 1).replace(reTrimStart, "") : string3;
}
function isObject(value) {
  var type4 = typeof value;
  return value != null && (type4 == "object" || type4 == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
function identity(value) {
  return value;
}
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$2 = Function.prototype;
var funcToString$2 = funcProto$2.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e2) {
    }
    try {
      return func + "";
    } catch (e2) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype, objectProto$d = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString$1.call(hasOwnProperty$b).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern4 = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern4.test(toSource(value));
}
function getValue$1(object4, key) {
  return object4 == null ? void 0 : object4[key];
}
function getNative(object4, key) {
  var value = getValue$1(object4, key);
  return baseIsNative(value) ? value : void 0;
}
var WeakMap$1 = getNative(root, "WeakMap");
var objectCreate = Object.create;
var baseCreate = /* @__PURE__ */ function() {
  function object4() {
  }
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object4.prototype = proto;
    var result = new object4();
    object4.prototype = void 0;
    return result;
  };
}();
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
function noop() {
}
function copyArray(source, array4) {
  var index = -1, length = source.length;
  array4 || (array4 = Array(length));
  while (++index < length) {
    array4[index] = source[index];
  }
  return array4;
}
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
function constant(value) {
  return function() {
    return value;
  };
}
var defineProperty = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e2) {
  }
}();
var baseSetToString = !defineProperty ? identity : function(func, string3) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string3),
    "writable": true
  });
};
var setToString = shortOut(baseSetToString);
function arrayEach(array4, iteratee) {
  var index = -1, length = array4 == null ? 0 : array4.length;
  while (++index < length) {
    if (iteratee(array4[index], index, array4) === false) {
      break;
    }
  }
  return array4;
}
function baseFindIndex(array4, predicate, fromIndex, fromRight) {
  var length = array4.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array4[index], index, array4)) {
      return index;
    }
  }
  return -1;
}
function baseIsNaN(value) {
  return value !== value;
}
function strictIndexOf(array4, value, fromIndex) {
  var index = fromIndex - 1, length = array4.length;
  while (++index < length) {
    if (array4[index] === value) {
      return index;
    }
  }
  return -1;
}
function baseIndexOf(array4, value, fromIndex) {
  return value === value ? strictIndexOf(array4, value, fromIndex) : baseFindIndex(array4, baseIsNaN, fromIndex);
}
function arrayIncludes(array4, value) {
  var length = array4 == null ? 0 : array4.length;
  return !!length && baseIndexOf(array4, value, 0) > -1;
}
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type4 = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type4 == "number" || type4 != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
function baseAssignValue(object4, key, value) {
  if (key == "__proto__" && defineProperty) {
    defineProperty(object4, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object4[key] = value;
  }
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
function assignValue(object4, key, value) {
  var objValue = object4[key];
  if (!(hasOwnProperty$a.call(object4, key) && eq(objValue, value)) || value === void 0 && !(key in object4)) {
    baseAssignValue(object4, key, value);
  }
}
function copyObject(source, props, object4, customizer) {
  var isNew = !object4;
  object4 || (object4 = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object4, key, newValue);
    } else {
      assignValue(object4, key, newValue);
    }
  }
  return object4;
}
var nativeMax$1 = Math.max;
function overRest(func, start, transform2) {
  start = nativeMax$1(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax$1(args.length - start, 0), array4 = Array(length);
    while (++index < length) {
      array4[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform2(array4);
    return apply(func, this, otherArgs);
  };
}
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
function isIterateeCall(value, index, object4) {
  if (!isObject(object4)) {
    return false;
  }
  var type4 = typeof index;
  if (type4 == "number" ? isArrayLike(object4) && isIndex(index, object4.length) : type4 == "string" && index in object4) {
    return eq(object4[index], value);
  }
  return false;
}
function createAssigner(assigner) {
  return baseRest(function(object4, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object4 = Object(object4);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object4, source, index, customizer);
      }
    }
    return object4;
  });
}
var objectProto$b = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$b;
  return value === proto;
}
function baseTimes(n2, iteratee) {
  var index = -1, result = Array(n2);
  while (++index < n2) {
    result[index] = iteratee(index);
  }
  return result;
}
var argsTag$3 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$3;
}
var objectProto$a = Object.prototype;
var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable;
var isArguments = baseIsArguments(/* @__PURE__ */ function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$9.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
function stubFalse() {
  return false;
}
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
var Buffer$1 = moduleExports$2 ? root.Buffer : void 0;
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal.process;
var nodeUtil = function() {
  try {
    var types2 = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    if (types2) {
      return types2;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e2) {
  }
}();
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var objectProto$9 = Object.prototype;
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform2) {
  return function(arg) {
    return func(transform2(arg));
  };
}
var nativeKeys = overArg(Object.keys, Object);
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function baseKeys(object4) {
  if (!isPrototype(object4)) {
    return nativeKeys(object4);
  }
  var result = [];
  for (var key in Object(object4)) {
    if (hasOwnProperty$7.call(object4, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function keys(object4) {
  return isArrayLike(object4) ? arrayLikeKeys(object4) : baseKeys(object4);
}
function nativeKeysIn(object4) {
  var result = [];
  if (object4 != null) {
    for (var key in Object(object4)) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function baseKeysIn(object4) {
  if (!isObject(object4)) {
    return nativeKeysIn(object4);
  }
  var isProto = isPrototype(object4), result = [];
  for (var key in object4) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$6.call(object4, key)))) {
      result.push(key);
    }
  }
  return result;
}
function keysIn(object4) {
  return isArrayLike(object4) ? arrayLikeKeys(object4, true) : baseKeysIn(object4);
}
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
function isKey(value, object4) {
  if (isArray(value)) {
    return false;
  }
  var type4 = typeof value;
  if (type4 == "number" || type4 == "symbol" || type4 == "boolean" || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object4 != null && value in Object(object4);
}
var nativeCreate = getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : void 0;
}
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty$4.call(data, key);
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array4, key) {
  var length = array4.length;
  while (length--) {
    if (eq(array4[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$1 || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type4 = typeof value;
  return type4 == "string" || type4 == "number" || type4 == "symbol" || type4 == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map2, key) {
  var data = map2.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var FUNC_ERROR_TEXT$2 = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
    if (cache2.has(key)) {
      return cache2.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache2.set(key, result) || cache2;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache2.size === MAX_MEMOIZE_SIZE) {
      cache2.clear();
    }
    return key;
  });
  var cache2 = result.cache;
  return result;
}
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string3) {
  var result = [];
  if (string3.charCodeAt(0) === 46) {
    result.push("");
  }
  string3.replace(rePropName, function(match, number4, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number4 || match);
  });
  return result;
});
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function castPath(value, object4) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object4) ? [value] : stringToPath(toString(value));
}
function toKey(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function baseGet(object4, path) {
  path = castPath(path, object4);
  var index = 0, length = path.length;
  while (object4 != null && index < length) {
    object4 = object4[toKey(path[index++])];
  }
  return index && index == length ? object4 : void 0;
}
function get(object4, path, defaultValue) {
  var result = object4 == null ? void 0 : baseGet(object4, path);
  return result === void 0 ? defaultValue : result;
}
function arrayPush(array4, values) {
  var index = -1, length = values.length, offset2 = array4.length;
  while (++index < length) {
    array4[offset2 + index] = values[index];
  }
  return array4;
}
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
function baseFlatten(array4, depth, predicate, isStrict, result) {
  var index = -1, length = array4.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array4[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
function flatten(array4) {
  var length = array4 == null ? 0 : array4.length;
  return length ? baseFlatten(array4, 1) : [];
}
function flatRest(func) {
  return setToString(overRest(func, void 0, flatten), func + "");
}
var getPrototype = overArg(Object.getPrototypeOf, Object);
var objectTag$3 = "[object Object]";
var funcProto = Function.prototype, objectProto$4 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$3.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
function baseSlice(array4, start, end) {
  var index = -1, length = array4.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array4[index + start];
  }
  return result;
}
function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
function stackGet(key) {
  return this.__data__.get(key);
}
function stackHas(key) {
  return this.__data__.has(key);
}
var LARGE_ARRAY_SIZE$1 = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE$1 - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
function baseAssign(object4, source) {
  return object4 && copyObject(source, keys(source), object4);
}
function baseAssignIn(object4, source) {
  return object4 && copyObject(source, keysIn(source), object4);
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
function arrayFilter(array4, predicate) {
  var index = -1, length = array4 == null ? 0 : array4.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array4[index];
    if (predicate(value, index, array4)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
function stubArray() {
  return [];
}
var objectProto$3 = Object.prototype;
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object4) {
  if (object4 == null) {
    return [];
  }
  object4 = Object(object4);
  return arrayFilter(nativeGetSymbols$1(object4), function(symbol) {
    return propertyIsEnumerable.call(object4, symbol);
  });
};
function copySymbols(source, object4) {
  return copyObject(source, getSymbols(source), object4);
}
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object4) {
  var result = [];
  while (object4) {
    arrayPush(result, getSymbols(object4));
    object4 = getPrototype(object4);
  }
  return result;
};
function copySymbolsIn(source, object4) {
  return copyObject(source, getSymbolsIn(source), object4);
}
function baseGetAllKeys(object4, keysFunc, symbolsFunc) {
  var result = keysFunc(object4);
  return isArray(object4) ? result : arrayPush(result, symbolsFunc(object4));
}
function getAllKeys(object4) {
  return baseGetAllKeys(object4, keys, getSymbols);
}
function getAllKeysIn(object4) {
  return baseGetAllKeys(object4, keysIn, getSymbolsIn);
}
var DataView = getNative(root, "DataView");
var Promise$1 = getNative(root, "Promise");
var Set$1 = getNative(root, "Set");
var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$3 = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
var getTag = baseGetTag;
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$4 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
  getTag = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$3;
        case mapCtorString:
          return mapTag$4;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$4;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function initCloneArray(array4) {
  var length = array4.length, result = new array4.constructor(length);
  if (length && typeof array4[0] == "string" && hasOwnProperty$2.call(array4, "index")) {
    result.index = array4.index;
    result.input = array4.input;
  }
  return result;
}
var Uint8Array = root.Uint8Array;
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var reFlags = /\w*$/;
function cloneRegExp(regexp4) {
  var result = new regexp4.constructor(regexp4.source, reFlags.exec(regexp4));
  result.lastIndex = regexp4.lastIndex;
  return result;
}
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]";
var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag(object4, tag, isDeep) {
  var Ctor = object4.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object4);
    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object4);
    case dataViewTag$2:
      return cloneDataView(object4, isDeep);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object4, isDeep);
    case mapTag$3:
      return new Ctor();
    case numberTag$2:
    case stringTag$2:
      return new Ctor(object4);
    case regexpTag$2:
      return cloneRegExp(object4);
    case setTag$3:
      return new Ctor();
    case symbolTag$2:
      return cloneSymbol(object4);
  }
}
function initCloneObject(object4) {
  return typeof object4.constructor == "function" && !isPrototype(object4) ? baseCreate(getPrototype(object4)) : {};
}
var mapTag$2 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag$2;
}
var nodeIsMap = nodeUtil && nodeUtil.isMap;
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
var setTag$2 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag$2;
}
var nodeIsSet = nodeUtil && nodeUtil.isSet;
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
var CLONE_DEEP_FLAG$2 = 1, CLONE_FLAT_FLAG$1 = 2, CLONE_SYMBOLS_FLAG$3 = 4;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
function baseClone(value, bitmask, customizer, key, object4, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG$2, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$3;
  if (customizer) {
    result = object4 ? customizer(value, key, object4, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object4) {
      result = isFlat || isFunc ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object4 ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var CLONE_SYMBOLS_FLAG$2 = 4;
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG$2);
}
var CLONE_DEEP_FLAG$1 = 1, CLONE_SYMBOLS_FLAG$1 = 4;
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
function setCacheHas(value) {
  return this.__data__.has(value);
}
function SetCache(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function arraySome(array4, predicate) {
  var index = -1, length = array4 == null ? 0 : array4.length;
  while (++index < length) {
    if (predicate(array4[index], index, array4)) {
      return true;
    }
  }
  return false;
}
function cacheHas(cache2, key) {
  return cache2.has(key);
}
var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
function equalArrays(array4, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array4.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array4);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array4;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
  stack.set(array4, other);
  stack.set(other, array4);
  while (++index < arrLength) {
    var arrValue = array4[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array4, stack) : customizer(arrValue, othValue, index, array4, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array4);
  stack["delete"](other);
  return result;
}
function mapToArray(map2) {
  var index = -1, result = Array(map2.size);
  map2.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
function setToArray(set2) {
  var index = -1, result = Array(set2.size);
  set2.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag(object4, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object4.byteLength != other.byteLength || object4.byteOffset != other.byteOffset) {
        return false;
      }
      object4 = object4.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object4.byteLength != other.byteLength || !equalFunc(new Uint8Array(object4), new Uint8Array(other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      return eq(+object4, +other);
    case errorTag:
      return object4.name == other.name && object4.message == other.message;
    case regexpTag:
    case stringTag:
      return object4 == other + "";
    case mapTag:
      var convert = mapToArray;
    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);
      if (object4.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object4);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;
      stack.set(object4, other);
      var result = equalArrays(convert(object4), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object4);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object4) == symbolValueOf.call(other);
      }
  }
  return false;
}
var COMPARE_PARTIAL_FLAG$3 = 1;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function equalObjects(object4, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object4), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object4);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object4;
  }
  var result = true;
  stack.set(object4, other);
  stack.set(other, object4);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object4[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object4, stack) : customizer(objValue, othValue, key, object4, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object4.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object4 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object4);
  stack["delete"](other);
  return result;
}
var COMPARE_PARTIAL_FLAG$2 = 1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseIsEqualDeep(object4, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object4), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object4), othTag = othIsArr ? arrayTag : getTag(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer(object4)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object4) ? equalArrays(object4, other, bitmask, customizer, equalFunc, stack) : equalByTag(object4, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object4, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object4.value() : object4, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object4, other, bitmask, customizer, equalFunc, stack);
}
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function baseIsMatch(object4, source, matchData, customizer) {
  var index = matchData.length, length = index;
  if (object4 == null) {
    return !length;
  }
  object4 = Object(object4);
  while (index--) {
    var data = matchData[index];
    if (data[2] ? data[1] !== object4[data[0]] : !(data[0] in object4)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object4[key], srcValue = data[1];
    if (data[2]) {
      if (objValue === void 0 && !(key in object4)) {
        return false;
      }
    } else {
      var stack = new Stack();
      var result;
      if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
function isStrictComparable(value) {
  return value === value && !isObject(value);
}
function getMatchData(object4) {
  var result = keys(object4), length = result.length;
  while (length--) {
    var key = result[length], value = object4[key];
    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}
function matchesStrictComparable(key, srcValue) {
  return function(object4) {
    if (object4 == null) {
      return false;
    }
    return object4[key] === srcValue && (srcValue !== void 0 || key in Object(object4));
  };
}
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object4) {
    return object4 === source || baseIsMatch(object4, source, matchData);
  };
}
function baseHasIn(object4, key) {
  return object4 != null && key in Object(object4);
}
function hasPath(object4, path, hasFunc) {
  path = castPath(path, object4);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object4 != null && hasFunc(object4, key))) {
      break;
    }
    object4 = object4[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object4 == null ? 0 : object4.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray(object4) || isArguments(object4));
}
function hasIn(object4, path) {
  return object4 != null && hasPath(object4, path, baseHasIn);
}
var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object4) {
    var objValue = get(object4, path);
    return objValue === void 0 && objValue === srcValue ? hasIn(object4, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}
function baseProperty(key) {
  return function(object4) {
    return object4 == null ? void 0 : object4[key];
  };
}
function basePropertyDeep(path) {
  return function(object4) {
    return baseGet(object4, path);
  };
}
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == "object") {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}
function createBaseFor(fromRight) {
  return function(object4, iteratee, keysFunc) {
    var index = -1, iterable = Object(object4), props = keysFunc(object4), length = props.length;
    while (length--) {
      var key = props[++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object4;
  };
}
var baseFor = createBaseFor();
function baseForOwn(object4, iteratee) {
  return object4 && baseFor(object4, iteratee, keys);
}
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = -1, iterable = Object(collection);
    while (++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var baseEach = createBaseEach(baseForOwn);
var now = function() {
  return root.Date.now();
};
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function assignMergeValue(object4, key, value) {
  if (value !== void 0 && !eq(object4[key], value) || value === void 0 && !(key in object4)) {
    baseAssignValue(object4, key, value);
  }
}
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
function safeGet(object4, key) {
  if (key === "constructor" && typeof object4[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object4[key];
}
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}
function baseMergeDeep(object4, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object4, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue(object4, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object4, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue(object4, key, newValue);
}
function baseMerge(object4, source, srcIndex, customizer, stack) {
  if (object4 === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack());
    if (isObject(srcValue)) {
      baseMergeDeep(object4, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object4, key), srcValue, key + "", object4, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue(object4, key, newValue);
    }
  }, keysIn);
}
function last(array4) {
  var length = array4 == null ? 0 : array4.length;
  return length ? array4[length - 1] : void 0;
}
function findLastIndex(array4, predicate, fromIndex) {
  var length = array4 == null ? 0 : array4.length;
  if (!length) {
    return -1;
  }
  var index = length - 1;
  return baseFindIndex(array4, baseIteratee(predicate), index, true);
}
function baseMap(collection, iteratee) {
  var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function(value, key, collection2) {
    result[++index] = iteratee(value, key, collection2);
  });
  return result;
}
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee));
}
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}
var INFINITY$1 = 1 / 0;
function flattenDeep(array4) {
  var length = array4 == null ? 0 : array4.length;
  return length ? baseFlatten(array4, INFINITY$1) : [];
}
function fromPairs(pairs) {
  var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}
function parent(object4, path) {
  return path.length < 2 ? object4 : baseGet(object4, baseSlice(path, 0, -1));
}
function isEqual$1(value, other) {
  return baseIsEqual(value, other);
}
function isNil(value) {
  return value == null;
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return value === void 0;
}
var merge = createAssigner(function(object4, source, srcIndex) {
  baseMerge(object4, source, srcIndex);
});
function baseUnset(object4, path) {
  path = castPath(path, object4);
  object4 = parent(object4, path);
  return object4 == null || delete object4[toKey(last(path))];
}
function customOmitClone(value) {
  return isPlainObject(value) ? void 0 : value;
}
var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
var omit = flatRest(function(object4, paths) {
  var result = {};
  if (object4 == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object4);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object4, getAllKeysIn(object4), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});
function baseSet(object4, path, value, customizer) {
  if (!isObject(object4)) {
    return object4;
  }
  path = castPath(path, object4);
  var index = -1, length = path.length, lastIndex = length - 1, nested = object4;
  while (nested != null && ++index < length) {
    var key = toKey(path[index]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object4;
    }
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = void 0;
      if (newValue === void 0) {
        newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object4;
}
function basePickBy(object4, paths, predicate) {
  var index = -1, length = paths.length, result = {};
  while (++index < length) {
    var path = paths[index], value = baseGet(object4, path);
    if (predicate(value, path)) {
      baseSet(result, castPath(path, object4), value);
    }
  }
  return result;
}
function basePick(object4, paths) {
  return basePickBy(object4, paths, function(value, path) {
    return hasIn(object4, path);
  });
}
var pick = flatRest(function(object4, paths) {
  return object4 == null ? {} : basePick(object4, paths);
});
function set(object4, path, value) {
  return object4 == null ? object4 : baseSet(object4, path, value);
}
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
var INFINITY = 1 / 0;
var createSet = !(Set$1 && 1 / setToArray(new Set$1([, -0]))[1] == INFINITY) ? noop : function(values) {
  return new Set$1(values);
};
var LARGE_ARRAY_SIZE = 200;
function baseUniq(array4, iteratee, comparator) {
  var index = -1, includes = arrayIncludes, length = array4.length, isCommon = true, result = [], seen = result;
  if (length >= LARGE_ARRAY_SIZE) {
    var set2 = createSet(array4);
    if (set2) {
      return setToArray(set2);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = result;
  }
  outer:
    while (++index < length) {
      var value = array4[index], computed = value;
      value = value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes(seen, computed, comparator)) {
        if (seen !== result) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
var E$1 = "top", R = "bottom", W = "right", P$1 = "left", me = "auto", G = [E$1, R, W, P$1], U$1 = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t2, e2) {
  return t2.concat([e2 + "-" + U$1, e2 + "-" + J]);
}, []), Ee = [].concat(G, [me]).reduce(function(t2, e2) {
  return t2.concat([e2, e2 + "-" + U$1, e2 + "-" + J]);
}, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
function C(t2) {
  return t2 ? (t2.nodeName || "").toLowerCase() : null;
}
function H(t2) {
  if (t2 == null) return window;
  if (t2.toString() !== "[object Window]") {
    var e2 = t2.ownerDocument;
    return e2 && e2.defaultView || window;
  }
  return t2;
}
function Q(t2) {
  var e2 = H(t2).Element;
  return t2 instanceof e2 || t2 instanceof Element;
}
function B(t2) {
  var e2 = H(t2).HTMLElement;
  return t2 instanceof e2 || t2 instanceof HTMLElement;
}
function Pe(t2) {
  if (typeof ShadowRoot == "undefined") return false;
  var e2 = H(t2).ShadowRoot;
  return t2 instanceof e2 || t2 instanceof ShadowRoot;
}
function Mt(t2) {
  var e2 = t2.state;
  Object.keys(e2.elements).forEach(function(n2) {
    var r2 = e2.styles[n2] || {}, o2 = e2.attributes[n2] || {}, i2 = e2.elements[n2];
    !B(i2) || !C(i2) || (Object.assign(i2.style, r2), Object.keys(o2).forEach(function(a2) {
      var s2 = o2[a2];
      s2 === false ? i2.removeAttribute(a2) : i2.setAttribute(a2, s2 === true ? "" : s2);
    }));
  });
}
function Rt(t2) {
  var e2 = t2.state, n2 = { popper: { position: e2.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
  return Object.assign(e2.elements.popper.style, n2.popper), e2.styles = n2, e2.elements.arrow && Object.assign(e2.elements.arrow.style, n2.arrow), function() {
    Object.keys(e2.elements).forEach(function(r2) {
      var o2 = e2.elements[r2], i2 = e2.attributes[r2] || {}, a2 = Object.keys(e2.styles.hasOwnProperty(r2) ? e2.styles[r2] : n2[r2]), s2 = a2.reduce(function(f2, c2) {
        return f2[c2] = "", f2;
      }, {});
      !B(o2) || !C(o2) || (Object.assign(o2.style, s2), Object.keys(i2).forEach(function(f2) {
        o2.removeAttribute(f2);
      }));
    });
  };
}
var Ae = { name: "applyStyles", enabled: true, phase: "write", fn: Mt, effect: Rt, requires: ["computeStyles"] };
function q(t2) {
  return t2.split("-")[0];
}
var X$1 = Math.max, ve = Math.min, Z = Math.round;
function ee(t2, e2) {
  e2 === void 0 && (e2 = false);
  var n2 = t2.getBoundingClientRect(), r2 = 1, o2 = 1;
  if (B(t2) && e2) {
    var i2 = t2.offsetHeight, a2 = t2.offsetWidth;
    a2 > 0 && (r2 = Z(n2.width) / a2 || 1), i2 > 0 && (o2 = Z(n2.height) / i2 || 1);
  }
  return { width: n2.width / r2, height: n2.height / o2, top: n2.top / o2, right: n2.right / r2, bottom: n2.bottom / o2, left: n2.left / r2, x: n2.left / r2, y: n2.top / o2 };
}
function ke(t2) {
  var e2 = ee(t2), n2 = t2.offsetWidth, r2 = t2.offsetHeight;
  return Math.abs(e2.width - n2) <= 1 && (n2 = e2.width), Math.abs(e2.height - r2) <= 1 && (r2 = e2.height), { x: t2.offsetLeft, y: t2.offsetTop, width: n2, height: r2 };
}
function it(t2, e2) {
  var n2 = e2.getRootNode && e2.getRootNode();
  if (t2.contains(e2)) return true;
  if (n2 && Pe(n2)) {
    var r2 = e2;
    do {
      if (r2 && t2.isSameNode(r2)) return true;
      r2 = r2.parentNode || r2.host;
    } while (r2);
  }
  return false;
}
function N$1(t2) {
  return H(t2).getComputedStyle(t2);
}
function Wt(t2) {
  return ["table", "td", "th"].indexOf(C(t2)) >= 0;
}
function I$1(t2) {
  return ((Q(t2) ? t2.ownerDocument : t2.document) || window.document).documentElement;
}
function ge(t2) {
  return C(t2) === "html" ? t2 : t2.assignedSlot || t2.parentNode || (Pe(t2) ? t2.host : null) || I$1(t2);
}
function at(t2) {
  return !B(t2) || N$1(t2).position === "fixed" ? null : t2.offsetParent;
}
function Bt(t2) {
  var e2 = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n2 = navigator.userAgent.indexOf("Trident") !== -1;
  if (n2 && B(t2)) {
    var r2 = N$1(t2);
    if (r2.position === "fixed") return null;
  }
  var o2 = ge(t2);
  for (Pe(o2) && (o2 = o2.host); B(o2) && ["html", "body"].indexOf(C(o2)) < 0; ) {
    var i2 = N$1(o2);
    if (i2.transform !== "none" || i2.perspective !== "none" || i2.contain === "paint" || ["transform", "perspective"].indexOf(i2.willChange) !== -1 || e2 && i2.willChange === "filter" || e2 && i2.filter && i2.filter !== "none") return o2;
    o2 = o2.parentNode;
  }
  return null;
}
function se(t2) {
  for (var e2 = H(t2), n2 = at(t2); n2 && Wt(n2) && N$1(n2).position === "static"; ) n2 = at(n2);
  return n2 && (C(n2) === "html" || C(n2) === "body" && N$1(n2).position === "static") ? e2 : n2 || Bt(t2) || e2;
}
function Le(t2) {
  return ["top", "bottom"].indexOf(t2) >= 0 ? "x" : "y";
}
function fe(t2, e2, n2) {
  return X$1(t2, ve(e2, n2));
}
function St(t2, e2, n2) {
  var r2 = fe(t2, e2, n2);
  return r2 > n2 ? n2 : r2;
}
function st() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function ft(t2) {
  return Object.assign({}, st(), t2);
}
function ct(t2, e2) {
  return e2.reduce(function(n2, r2) {
    return n2[r2] = t2, n2;
  }, {});
}
var Tt = function(t2, e2) {
  return t2 = typeof t2 == "function" ? t2(Object.assign({}, e2.rects, { placement: e2.placement })) : t2, ft(typeof t2 != "number" ? t2 : ct(t2, G));
};
function Ht(t2) {
  var e2, n2 = t2.state, r2 = t2.name, o2 = t2.options, i2 = n2.elements.arrow, a2 = n2.modifiersData.popperOffsets, s2 = q(n2.placement), f2 = Le(s2), c2 = [P$1, W].indexOf(s2) >= 0, u2 = c2 ? "height" : "width";
  if (!(!i2 || !a2)) {
    var m2 = Tt(o2.padding, n2), v2 = ke(i2), l2 = f2 === "y" ? E$1 : P$1, h2 = f2 === "y" ? R : W, p2 = n2.rects.reference[u2] + n2.rects.reference[f2] - a2[f2] - n2.rects.popper[u2], g2 = a2[f2] - n2.rects.reference[f2], x2 = se(i2), y2 = x2 ? f2 === "y" ? x2.clientHeight || 0 : x2.clientWidth || 0 : 0, $2 = p2 / 2 - g2 / 2, d2 = m2[l2], b2 = y2 - v2[u2] - m2[h2], w2 = y2 / 2 - v2[u2] / 2 + $2, O2 = fe(d2, w2, b2), j2 = f2;
    n2.modifiersData[r2] = (e2 = {}, e2[j2] = O2, e2.centerOffset = O2 - w2, e2);
  }
}
function Ct(t2) {
  var e2 = t2.state, n2 = t2.options, r2 = n2.element, o2 = r2 === void 0 ? "[data-popper-arrow]" : r2;
  o2 != null && (typeof o2 == "string" && (o2 = e2.elements.popper.querySelector(o2), !o2) || !it(e2.elements.popper, o2) || (e2.elements.arrow = o2));
}
var pt = { name: "arrow", enabled: true, phase: "main", fn: Ht, effect: Ct, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] };
function te(t2) {
  return t2.split("-")[1];
}
var qt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function Vt(t2) {
  var e2 = t2.x, n2 = t2.y, r2 = window, o2 = r2.devicePixelRatio || 1;
  return { x: Z(e2 * o2) / o2 || 0, y: Z(n2 * o2) / o2 || 0 };
}
function ut(t2) {
  var e2, n2 = t2.popper, r2 = t2.popperRect, o2 = t2.placement, i2 = t2.variation, a2 = t2.offsets, s2 = t2.position, f2 = t2.gpuAcceleration, c2 = t2.adaptive, u2 = t2.roundOffsets, m2 = t2.isFixed, v2 = a2.x, l2 = v2 === void 0 ? 0 : v2, h2 = a2.y, p2 = h2 === void 0 ? 0 : h2, g2 = typeof u2 == "function" ? u2({ x: l2, y: p2 }) : { x: l2, y: p2 };
  l2 = g2.x, p2 = g2.y;
  var x2 = a2.hasOwnProperty("x"), y2 = a2.hasOwnProperty("y"), $2 = P$1, d2 = E$1, b2 = window;
  if (c2) {
    var w2 = se(n2), O2 = "clientHeight", j2 = "clientWidth";
    if (w2 === H(n2) && (w2 = I$1(n2), N$1(w2).position !== "static" && s2 === "absolute" && (O2 = "scrollHeight", j2 = "scrollWidth")), w2 = w2, o2 === E$1 || (o2 === P$1 || o2 === W) && i2 === J) {
      d2 = R;
      var A2 = m2 && w2 === b2 && b2.visualViewport ? b2.visualViewport.height : w2[O2];
      p2 -= A2 - r2.height, p2 *= f2 ? 1 : -1;
    }
    if (o2 === P$1 || (o2 === E$1 || o2 === R) && i2 === J) {
      $2 = W;
      var k2 = m2 && w2 === b2 && b2.visualViewport ? b2.visualViewport.width : w2[j2];
      l2 -= k2 - r2.width, l2 *= f2 ? 1 : -1;
    }
  }
  var D2 = Object.assign({ position: s2 }, c2 && qt), S2 = u2 === true ? Vt({ x: l2, y: p2 }) : { x: l2, y: p2 };
  if (l2 = S2.x, p2 = S2.y, f2) {
    var L2;
    return Object.assign({}, D2, (L2 = {}, L2[d2] = y2 ? "0" : "", L2[$2] = x2 ? "0" : "", L2.transform = (b2.devicePixelRatio || 1) <= 1 ? "translate(" + l2 + "px, " + p2 + "px)" : "translate3d(" + l2 + "px, " + p2 + "px, 0)", L2));
  }
  return Object.assign({}, D2, (e2 = {}, e2[d2] = y2 ? p2 + "px" : "", e2[$2] = x2 ? l2 + "px" : "", e2.transform = "", e2));
}
function Nt(t2) {
  var e2 = t2.state, n2 = t2.options, r2 = n2.gpuAcceleration, o2 = r2 === void 0 ? true : r2, i2 = n2.adaptive, a2 = i2 === void 0 ? true : i2, s2 = n2.roundOffsets, f2 = s2 === void 0 ? true : s2, c2 = { placement: q(e2.placement), variation: te(e2.placement), popper: e2.elements.popper, popperRect: e2.rects.popper, gpuAcceleration: o2, isFixed: e2.options.strategy === "fixed" };
  e2.modifiersData.popperOffsets != null && (e2.styles.popper = Object.assign({}, e2.styles.popper, ut(Object.assign({}, c2, { offsets: e2.modifiersData.popperOffsets, position: e2.options.strategy, adaptive: a2, roundOffsets: f2 })))), e2.modifiersData.arrow != null && (e2.styles.arrow = Object.assign({}, e2.styles.arrow, ut(Object.assign({}, c2, { offsets: e2.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: f2 })))), e2.attributes.popper = Object.assign({}, e2.attributes.popper, { "data-popper-placement": e2.placement });
}
var Me = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: Nt, data: {} }, ye = { passive: true };
function It(t2) {
  var e2 = t2.state, n2 = t2.instance, r2 = t2.options, o2 = r2.scroll, i2 = o2 === void 0 ? true : o2, a2 = r2.resize, s2 = a2 === void 0 ? true : a2, f2 = H(e2.elements.popper), c2 = [].concat(e2.scrollParents.reference, e2.scrollParents.popper);
  return i2 && c2.forEach(function(u2) {
    u2.addEventListener("scroll", n2.update, ye);
  }), s2 && f2.addEventListener("resize", n2.update, ye), function() {
    i2 && c2.forEach(function(u2) {
      u2.removeEventListener("scroll", n2.update, ye);
    }), s2 && f2.removeEventListener("resize", n2.update, ye);
  };
}
var Re = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
}, effect: It, data: {} }, _t = { left: "right", right: "left", bottom: "top", top: "bottom" };
function be(t2) {
  return t2.replace(/left|right|bottom|top/g, function(e2) {
    return _t[e2];
  });
}
var zt = { start: "end", end: "start" };
function lt(t2) {
  return t2.replace(/start|end/g, function(e2) {
    return zt[e2];
  });
}
function We(t2) {
  var e2 = H(t2), n2 = e2.pageXOffset, r2 = e2.pageYOffset;
  return { scrollLeft: n2, scrollTop: r2 };
}
function Be(t2) {
  return ee(I$1(t2)).left + We(t2).scrollLeft;
}
function Ft(t2) {
  var e2 = H(t2), n2 = I$1(t2), r2 = e2.visualViewport, o2 = n2.clientWidth, i2 = n2.clientHeight, a2 = 0, s2 = 0;
  return r2 && (o2 = r2.width, i2 = r2.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a2 = r2.offsetLeft, s2 = r2.offsetTop)), { width: o2, height: i2, x: a2 + Be(t2), y: s2 };
}
function Ut(t2) {
  var e2, n2 = I$1(t2), r2 = We(t2), o2 = (e2 = t2.ownerDocument) == null ? void 0 : e2.body, i2 = X$1(n2.scrollWidth, n2.clientWidth, o2 ? o2.scrollWidth : 0, o2 ? o2.clientWidth : 0), a2 = X$1(n2.scrollHeight, n2.clientHeight, o2 ? o2.scrollHeight : 0, o2 ? o2.clientHeight : 0), s2 = -r2.scrollLeft + Be(t2), f2 = -r2.scrollTop;
  return N$1(o2 || n2).direction === "rtl" && (s2 += X$1(n2.clientWidth, o2 ? o2.clientWidth : 0) - i2), { width: i2, height: a2, x: s2, y: f2 };
}
function Se(t2) {
  var e2 = N$1(t2), n2 = e2.overflow, r2 = e2.overflowX, o2 = e2.overflowY;
  return /auto|scroll|overlay|hidden/.test(n2 + o2 + r2);
}
function dt(t2) {
  return ["html", "body", "#document"].indexOf(C(t2)) >= 0 ? t2.ownerDocument.body : B(t2) && Se(t2) ? t2 : dt(ge(t2));
}
function ce(t2, e2) {
  var n2;
  e2 === void 0 && (e2 = []);
  var r2 = dt(t2), o2 = r2 === ((n2 = t2.ownerDocument) == null ? void 0 : n2.body), i2 = H(r2), a2 = o2 ? [i2].concat(i2.visualViewport || [], Se(r2) ? r2 : []) : r2, s2 = e2.concat(a2);
  return o2 ? s2 : s2.concat(ce(ge(a2)));
}
function Te(t2) {
  return Object.assign({}, t2, { left: t2.x, top: t2.y, right: t2.x + t2.width, bottom: t2.y + t2.height });
}
function Xt(t2) {
  var e2 = ee(t2);
  return e2.top = e2.top + t2.clientTop, e2.left = e2.left + t2.clientLeft, e2.bottom = e2.top + t2.clientHeight, e2.right = e2.left + t2.clientWidth, e2.width = t2.clientWidth, e2.height = t2.clientHeight, e2.x = e2.left, e2.y = e2.top, e2;
}
function ht(t2, e2) {
  return e2 === je ? Te(Ft(t2)) : Q(e2) ? Xt(e2) : Te(Ut(I$1(t2)));
}
function Yt(t2) {
  var e2 = ce(ge(t2)), n2 = ["absolute", "fixed"].indexOf(N$1(t2).position) >= 0, r2 = n2 && B(t2) ? se(t2) : t2;
  return Q(r2) ? e2.filter(function(o2) {
    return Q(o2) && it(o2, r2) && C(o2) !== "body";
  }) : [];
}
function Gt(t2, e2, n2) {
  var r2 = e2 === "clippingParents" ? Yt(t2) : [].concat(e2), o2 = [].concat(r2, [n2]), i2 = o2[0], a2 = o2.reduce(function(s2, f2) {
    var c2 = ht(t2, f2);
    return s2.top = X$1(c2.top, s2.top), s2.right = ve(c2.right, s2.right), s2.bottom = ve(c2.bottom, s2.bottom), s2.left = X$1(c2.left, s2.left), s2;
  }, ht(t2, i2));
  return a2.width = a2.right - a2.left, a2.height = a2.bottom - a2.top, a2.x = a2.left, a2.y = a2.top, a2;
}
function mt(t2) {
  var e2 = t2.reference, n2 = t2.element, r2 = t2.placement, o2 = r2 ? q(r2) : null, i2 = r2 ? te(r2) : null, a2 = e2.x + e2.width / 2 - n2.width / 2, s2 = e2.y + e2.height / 2 - n2.height / 2, f2;
  switch (o2) {
    case E$1:
      f2 = { x: a2, y: e2.y - n2.height };
      break;
    case R:
      f2 = { x: a2, y: e2.y + e2.height };
      break;
    case W:
      f2 = { x: e2.x + e2.width, y: s2 };
      break;
    case P$1:
      f2 = { x: e2.x - n2.width, y: s2 };
      break;
    default:
      f2 = { x: e2.x, y: e2.y };
  }
  var c2 = o2 ? Le(o2) : null;
  if (c2 != null) {
    var u2 = c2 === "y" ? "height" : "width";
    switch (i2) {
      case U$1:
        f2[c2] = f2[c2] - (e2[u2] / 2 - n2[u2] / 2);
        break;
      case J:
        f2[c2] = f2[c2] + (e2[u2] / 2 - n2[u2] / 2);
        break;
    }
  }
  return f2;
}
function ne(t2, e2) {
  e2 === void 0 && (e2 = {});
  var n2 = e2, r2 = n2.placement, o2 = r2 === void 0 ? t2.placement : r2, i2 = n2.boundary, a2 = i2 === void 0 ? Xe : i2, s2 = n2.rootBoundary, f2 = s2 === void 0 ? je : s2, c2 = n2.elementContext, u2 = c2 === void 0 ? K : c2, m2 = n2.altBoundary, v2 = m2 === void 0 ? false : m2, l2 = n2.padding, h2 = l2 === void 0 ? 0 : l2, p2 = ft(typeof h2 != "number" ? h2 : ct(h2, G)), g2 = u2 === K ? Ye : K, x2 = t2.rects.popper, y2 = t2.elements[v2 ? g2 : u2], $2 = Gt(Q(y2) ? y2 : y2.contextElement || I$1(t2.elements.popper), a2, f2), d2 = ee(t2.elements.reference), b2 = mt({ reference: d2, element: x2, placement: o2 }), w2 = Te(Object.assign({}, x2, b2)), O2 = u2 === K ? w2 : d2, j2 = { top: $2.top - O2.top + p2.top, bottom: O2.bottom - $2.bottom + p2.bottom, left: $2.left - O2.left + p2.left, right: O2.right - $2.right + p2.right }, A2 = t2.modifiersData.offset;
  if (u2 === K && A2) {
    var k2 = A2[o2];
    Object.keys(j2).forEach(function(D2) {
      var S2 = [W, R].indexOf(D2) >= 0 ? 1 : -1, L2 = [E$1, R].indexOf(D2) >= 0 ? "y" : "x";
      j2[D2] += k2[L2] * S2;
    });
  }
  return j2;
}
function Jt(t2, e2) {
  e2 === void 0 && (e2 = {});
  var n2 = e2, r2 = n2.placement, o2 = n2.boundary, i2 = n2.rootBoundary, a2 = n2.padding, s2 = n2.flipVariations, f2 = n2.allowedAutoPlacements, c2 = f2 === void 0 ? Ee : f2, u2 = te(r2), m2 = u2 ? s2 ? De : De.filter(function(h2) {
    return te(h2) === u2;
  }) : G, v2 = m2.filter(function(h2) {
    return c2.indexOf(h2) >= 0;
  });
  v2.length === 0 && (v2 = m2);
  var l2 = v2.reduce(function(h2, p2) {
    return h2[p2] = ne(t2, { placement: p2, boundary: o2, rootBoundary: i2, padding: a2 })[q(p2)], h2;
  }, {});
  return Object.keys(l2).sort(function(h2, p2) {
    return l2[h2] - l2[p2];
  });
}
function Kt(t2) {
  if (q(t2) === me) return [];
  var e2 = be(t2);
  return [lt(t2), e2, lt(e2)];
}
function Qt(t2) {
  var e2 = t2.state, n2 = t2.options, r2 = t2.name;
  if (!e2.modifiersData[r2]._skip) {
    for (var o2 = n2.mainAxis, i2 = o2 === void 0 ? true : o2, a2 = n2.altAxis, s2 = a2 === void 0 ? true : a2, f2 = n2.fallbackPlacements, c2 = n2.padding, u2 = n2.boundary, m2 = n2.rootBoundary, v2 = n2.altBoundary, l2 = n2.flipVariations, h2 = l2 === void 0 ? true : l2, p2 = n2.allowedAutoPlacements, g2 = e2.options.placement, x2 = q(g2), y2 = x2 === g2, $2 = f2 || (y2 || !h2 ? [be(g2)] : Kt(g2)), d2 = [g2].concat($2).reduce(function(z2, V2) {
      return z2.concat(q(V2) === me ? Jt(e2, { placement: V2, boundary: u2, rootBoundary: m2, padding: c2, flipVariations: h2, allowedAutoPlacements: p2 }) : V2);
    }, []), b2 = e2.rects.reference, w2 = e2.rects.popper, O2 = /* @__PURE__ */ new Map(), j2 = true, A2 = d2[0], k2 = 0; k2 < d2.length; k2++) {
      var D2 = d2[k2], S2 = q(D2), L2 = te(D2) === U$1, re = [E$1, R].indexOf(S2) >= 0, oe = re ? "width" : "height", M2 = ne(e2, { placement: D2, boundary: u2, rootBoundary: m2, altBoundary: v2, padding: c2 }), T2 = re ? L2 ? W : P$1 : L2 ? R : E$1;
      b2[oe] > w2[oe] && (T2 = be(T2));
      var pe = be(T2), _2 = [];
      if (i2 && _2.push(M2[S2] <= 0), s2 && _2.push(M2[T2] <= 0, M2[pe] <= 0), _2.every(function(z2) {
        return z2;
      })) {
        A2 = D2, j2 = false;
        break;
      }
      O2.set(D2, _2);
    }
    if (j2) for (var ue = h2 ? 3 : 1, xe = function(z2) {
      var V2 = d2.find(function(de) {
        var ae = O2.get(de);
        if (ae) return ae.slice(0, z2).every(function(Y2) {
          return Y2;
        });
      });
      if (V2) return A2 = V2, "break";
    }, ie = ue; ie > 0; ie--) {
      var le = xe(ie);
      if (le === "break") break;
    }
    e2.placement !== A2 && (e2.modifiersData[r2]._skip = true, e2.placement = A2, e2.reset = true);
  }
}
var vt = { name: "flip", enabled: true, phase: "main", fn: Qt, requiresIfExists: ["offset"], data: { _skip: false } };
function gt(t2, e2, n2) {
  return n2 === void 0 && (n2 = { x: 0, y: 0 }), { top: t2.top - e2.height - n2.y, right: t2.right - e2.width + n2.x, bottom: t2.bottom - e2.height + n2.y, left: t2.left - e2.width - n2.x };
}
function yt(t2) {
  return [E$1, W, R, P$1].some(function(e2) {
    return t2[e2] >= 0;
  });
}
function Zt(t2) {
  var e2 = t2.state, n2 = t2.name, r2 = e2.rects.reference, o2 = e2.rects.popper, i2 = e2.modifiersData.preventOverflow, a2 = ne(e2, { elementContext: "reference" }), s2 = ne(e2, { altBoundary: true }), f2 = gt(a2, r2), c2 = gt(s2, o2, i2), u2 = yt(f2), m2 = yt(c2);
  e2.modifiersData[n2] = { referenceClippingOffsets: f2, popperEscapeOffsets: c2, isReferenceHidden: u2, hasPopperEscaped: m2 }, e2.attributes.popper = Object.assign({}, e2.attributes.popper, { "data-popper-reference-hidden": u2, "data-popper-escaped": m2 });
}
var bt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: Zt };
function en(t2, e2, n2) {
  var r2 = q(t2), o2 = [P$1, E$1].indexOf(r2) >= 0 ? -1 : 1, i2 = typeof n2 == "function" ? n2(Object.assign({}, e2, { placement: t2 })) : n2, a2 = i2[0], s2 = i2[1];
  return a2 = a2 || 0, s2 = (s2 || 0) * o2, [P$1, W].indexOf(r2) >= 0 ? { x: s2, y: a2 } : { x: a2, y: s2 };
}
function tn(t2) {
  var e2 = t2.state, n2 = t2.options, r2 = t2.name, o2 = n2.offset, i2 = o2 === void 0 ? [0, 0] : o2, a2 = Ee.reduce(function(u2, m2) {
    return u2[m2] = en(m2, e2.rects, i2), u2;
  }, {}), s2 = a2[e2.placement], f2 = s2.x, c2 = s2.y;
  e2.modifiersData.popperOffsets != null && (e2.modifiersData.popperOffsets.x += f2, e2.modifiersData.popperOffsets.y += c2), e2.modifiersData[r2] = a2;
}
var wt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: tn };
function nn(t2) {
  var e2 = t2.state, n2 = t2.name;
  e2.modifiersData[n2] = mt({ reference: e2.rects.reference, element: e2.rects.popper, placement: e2.placement });
}
var He = { name: "popperOffsets", enabled: true, phase: "read", fn: nn, data: {} };
function rn(t2) {
  return t2 === "x" ? "y" : "x";
}
function on(t2) {
  var e2 = t2.state, n2 = t2.options, r2 = t2.name, o2 = n2.mainAxis, i2 = o2 === void 0 ? true : o2, a2 = n2.altAxis, s2 = a2 === void 0 ? false : a2, f2 = n2.boundary, c2 = n2.rootBoundary, u2 = n2.altBoundary, m2 = n2.padding, v2 = n2.tether, l2 = v2 === void 0 ? true : v2, h2 = n2.tetherOffset, p2 = h2 === void 0 ? 0 : h2, g2 = ne(e2, { boundary: f2, rootBoundary: c2, padding: m2, altBoundary: u2 }), x2 = q(e2.placement), y2 = te(e2.placement), $2 = !y2, d2 = Le(x2), b2 = rn(d2), w2 = e2.modifiersData.popperOffsets, O2 = e2.rects.reference, j2 = e2.rects.popper, A2 = typeof p2 == "function" ? p2(Object.assign({}, e2.rects, { placement: e2.placement })) : p2, k2 = typeof A2 == "number" ? { mainAxis: A2, altAxis: A2 } : Object.assign({ mainAxis: 0, altAxis: 0 }, A2), D2 = e2.modifiersData.offset ? e2.modifiersData.offset[e2.placement] : null, S2 = { x: 0, y: 0 };
  if (w2) {
    if (i2) {
      var L2, re = d2 === "y" ? E$1 : P$1, oe = d2 === "y" ? R : W, M2 = d2 === "y" ? "height" : "width", T2 = w2[d2], pe = T2 + g2[re], _2 = T2 - g2[oe], ue = l2 ? -j2[M2] / 2 : 0, xe = y2 === U$1 ? O2[M2] : j2[M2], ie = y2 === U$1 ? -j2[M2] : -O2[M2], le = e2.elements.arrow, z2 = l2 && le ? ke(le) : { width: 0, height: 0 }, V2 = e2.modifiersData["arrow#persistent"] ? e2.modifiersData["arrow#persistent"].padding : st(), de = V2[re], ae = V2[oe], Y2 = fe(0, O2[M2], z2[M2]), jt = $2 ? O2[M2] / 2 - ue - Y2 - de - k2.mainAxis : xe - Y2 - de - k2.mainAxis, Dt2 = $2 ? -O2[M2] / 2 + ue + Y2 + ae + k2.mainAxis : ie + Y2 + ae + k2.mainAxis, Oe = e2.elements.arrow && se(e2.elements.arrow), Et2 = Oe ? d2 === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (L2 = D2 == null ? void 0 : D2[d2]) != null ? L2 : 0, Pt = T2 + jt - Ce - Et2, At2 = T2 + Dt2 - Ce, qe = fe(l2 ? ve(pe, Pt) : pe, T2, l2 ? X$1(_2, At2) : _2);
      w2[d2] = qe, S2[d2] = qe - T2;
    }
    if (s2) {
      var Ve, kt = d2 === "x" ? E$1 : P$1, Lt = d2 === "x" ? R : W, F2 = w2[b2], he = b2 === "y" ? "height" : "width", Ne = F2 + g2[kt], Ie = F2 - g2[Lt], $e = [E$1, P$1].indexOf(x2) !== -1, _e = (Ve = D2 == null ? void 0 : D2[b2]) != null ? Ve : 0, ze = $e ? Ne : F2 - O2[he] - j2[he] - _e + k2.altAxis, Fe = $e ? F2 + O2[he] + j2[he] - _e - k2.altAxis : Ie, Ue = l2 && $e ? St(ze, F2, Fe) : fe(l2 ? ze : Ne, F2, l2 ? Fe : Ie);
      w2[b2] = Ue, S2[b2] = Ue - F2;
    }
    e2.modifiersData[r2] = S2;
  }
}
var xt = { name: "preventOverflow", enabled: true, phase: "main", fn: on, requiresIfExists: ["offset"] };
function an(t2) {
  return { scrollLeft: t2.scrollLeft, scrollTop: t2.scrollTop };
}
function sn(t2) {
  return t2 === H(t2) || !B(t2) ? We(t2) : an(t2);
}
function fn(t2) {
  var e2 = t2.getBoundingClientRect(), n2 = Z(e2.width) / t2.offsetWidth || 1, r2 = Z(e2.height) / t2.offsetHeight || 1;
  return n2 !== 1 || r2 !== 1;
}
function cn(t2, e2, n2) {
  n2 === void 0 && (n2 = false);
  var r2 = B(e2), o2 = B(e2) && fn(e2), i2 = I$1(e2), a2 = ee(t2, o2), s2 = { scrollLeft: 0, scrollTop: 0 }, f2 = { x: 0, y: 0 };
  return (r2 || !r2 && !n2) && ((C(e2) !== "body" || Se(i2)) && (s2 = sn(e2)), B(e2) ? (f2 = ee(e2, true), f2.x += e2.clientLeft, f2.y += e2.clientTop) : i2 && (f2.x = Be(i2))), { x: a2.left + s2.scrollLeft - f2.x, y: a2.top + s2.scrollTop - f2.y, width: a2.width, height: a2.height };
}
function pn(t2) {
  var e2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set(), r2 = [];
  t2.forEach(function(i2) {
    e2.set(i2.name, i2);
  });
  function o2(i2) {
    n2.add(i2.name);
    var a2 = [].concat(i2.requires || [], i2.requiresIfExists || []);
    a2.forEach(function(s2) {
      if (!n2.has(s2)) {
        var f2 = e2.get(s2);
        f2 && o2(f2);
      }
    }), r2.push(i2);
  }
  return t2.forEach(function(i2) {
    n2.has(i2.name) || o2(i2);
  }), r2;
}
function un(t2) {
  var e2 = pn(t2);
  return ot.reduce(function(n2, r2) {
    return n2.concat(e2.filter(function(o2) {
      return o2.phase === r2;
    }));
  }, []);
}
function ln(t2) {
  var e2;
  return function() {
    return e2 || (e2 = new Promise(function(n2) {
      Promise.resolve().then(function() {
        e2 = void 0, n2(t2());
      });
    })), e2;
  };
}
function dn(t2) {
  var e2 = t2.reduce(function(n2, r2) {
    var o2 = n2[r2.name];
    return n2[r2.name] = o2 ? Object.assign({}, o2, r2, { options: Object.assign({}, o2.options, r2.options), data: Object.assign({}, o2.data, r2.data) }) : r2, n2;
  }, {});
  return Object.keys(e2).map(function(n2) {
    return e2[n2];
  });
}
var Ot = { placement: "bottom", modifiers: [], strategy: "absolute" };
function $t() {
  for (var t2 = arguments.length, e2 = new Array(t2), n2 = 0; n2 < t2; n2++) e2[n2] = arguments[n2];
  return !e2.some(function(r2) {
    return !(r2 && typeof r2.getBoundingClientRect == "function");
  });
}
function we(t2) {
  t2 === void 0 && (t2 = {});
  var e2 = t2, n2 = e2.defaultModifiers, r2 = n2 === void 0 ? [] : n2, o2 = e2.defaultOptions, i2 = o2 === void 0 ? Ot : o2;
  return function(a2, s2, f2) {
    f2 === void 0 && (f2 = i2);
    var c2 = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, Ot, i2), modifiersData: {}, elements: { reference: a2, popper: s2 }, attributes: {}, styles: {} }, u2 = [], m2 = false, v2 = { state: c2, setOptions: function(p2) {
      var g2 = typeof p2 == "function" ? p2(c2.options) : p2;
      h2(), c2.options = Object.assign({}, i2, c2.options, g2), c2.scrollParents = { reference: Q(a2) ? ce(a2) : a2.contextElement ? ce(a2.contextElement) : [], popper: ce(s2) };
      var x2 = un(dn([].concat(r2, c2.options.modifiers)));
      return c2.orderedModifiers = x2.filter(function(y2) {
        return y2.enabled;
      }), l2(), v2.update();
    }, forceUpdate: function() {
      if (!m2) {
        var p2 = c2.elements, g2 = p2.reference, x2 = p2.popper;
        if ($t(g2, x2)) {
          c2.rects = { reference: cn(g2, se(x2), c2.options.strategy === "fixed"), popper: ke(x2) }, c2.reset = false, c2.placement = c2.options.placement, c2.orderedModifiers.forEach(function(j2) {
            return c2.modifiersData[j2.name] = Object.assign({}, j2.data);
          });
          for (var y2 = 0; y2 < c2.orderedModifiers.length; y2++) {
            if (c2.reset === true) {
              c2.reset = false, y2 = -1;
              continue;
            }
            var $2 = c2.orderedModifiers[y2], d2 = $2.fn, b2 = $2.options, w2 = b2 === void 0 ? {} : b2, O2 = $2.name;
            typeof d2 == "function" && (c2 = d2({ state: c2, options: w2, name: O2, instance: v2 }) || c2);
          }
        }
      }
    }, update: ln(function() {
      return new Promise(function(p2) {
        v2.forceUpdate(), p2(c2);
      });
    }), destroy: function() {
      h2(), m2 = true;
    } };
    if (!$t(a2, s2)) return v2;
    v2.setOptions(f2).then(function(p2) {
      !m2 && f2.onFirstUpdate && f2.onFirstUpdate(p2);
    });
    function l2() {
      c2.orderedModifiers.forEach(function(p2) {
        var g2 = p2.name, x2 = p2.options, y2 = x2 === void 0 ? {} : x2, $2 = p2.effect;
        if (typeof $2 == "function") {
          var d2 = $2({ state: c2, name: g2, instance: v2, options: y2 }), b2 = function() {
          };
          u2.push(d2 || b2);
        }
      });
    }
    function h2() {
      u2.forEach(function(p2) {
        return p2();
      }), u2 = [];
    }
    return v2;
  };
}
we();
var mn = [Re, He, Me, Ae];
we({ defaultModifiers: mn });
var gn = [Re, He, Me, Ae, wt, vt, xt, pt, bt], yn = we({ defaultModifiers: gn });
function bound01(n2, max2) {
  if (isOnePointZero(n2)) {
    n2 = "100%";
  }
  var isPercent = isPercentage(n2);
  n2 = max2 === 360 ? n2 : Math.min(max2, Math.max(0, parseFloat(n2)));
  if (isPercent) {
    n2 = parseInt(String(n2 * max2), 10) / 100;
  }
  if (Math.abs(n2 - max2) < 1e-6) {
    return 1;
  }
  if (max2 === 360) {
    n2 = (n2 < 0 ? n2 % max2 + max2 : n2 % max2) / parseFloat(String(max2));
  } else {
    n2 = n2 % max2 / parseFloat(String(max2));
  }
  return n2;
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n2) {
  return typeof n2 === "string" && n2.indexOf(".") !== -1 && parseFloat(n2) === 1;
}
function isPercentage(n2) {
  return typeof n2 === "string" && n2.indexOf("%") !== -1;
}
function boundAlpha(a2) {
  a2 = parseFloat(a2);
  if (isNaN(a2) || a2 < 0 || a2 > 1) {
    a2 = 1;
  }
  return a2;
}
function convertToPercentage(n2) {
  if (n2 <= 1) {
    return "".concat(Number(n2) * 100, "%");
  }
  return n2;
}
function pad2(c2) {
  return c2.length === 1 ? "0" + c2 : String(c2);
}
function rgbToRgb(r2, g2, b2) {
  return {
    r: bound01(r2, 255) * 255,
    g: bound01(g2, 255) * 255,
    b: bound01(b2, 255) * 255
  };
}
function rgbToHsl(r2, g2, b2) {
  r2 = bound01(r2, 255);
  g2 = bound01(g2, 255);
  b2 = bound01(b2, 255);
  var max2 = Math.max(r2, g2, b2);
  var min2 = Math.min(r2, g2, b2);
  var h2 = 0;
  var s2 = 0;
  var l2 = (max2 + min2) / 2;
  if (max2 === min2) {
    s2 = 0;
    h2 = 0;
  } else {
    var d2 = max2 - min2;
    s2 = l2 > 0.5 ? d2 / (2 - max2 - min2) : d2 / (max2 + min2);
    switch (max2) {
      case r2:
        h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
        break;
      case g2:
        h2 = (b2 - r2) / d2 + 2;
        break;
      case b2:
        h2 = (r2 - g2) / d2 + 4;
        break;
    }
    h2 /= 6;
  }
  return { h: h2, s: s2, l: l2 };
}
function hue2rgb(p2, q2, t2) {
  if (t2 < 0) {
    t2 += 1;
  }
  if (t2 > 1) {
    t2 -= 1;
  }
  if (t2 < 1 / 6) {
    return p2 + (q2 - p2) * (6 * t2);
  }
  if (t2 < 1 / 2) {
    return q2;
  }
  if (t2 < 2 / 3) {
    return p2 + (q2 - p2) * (2 / 3 - t2) * 6;
  }
  return p2;
}
function hslToRgb(h2, s2, l2) {
  var r2;
  var g2;
  var b2;
  h2 = bound01(h2, 360);
  s2 = bound01(s2, 100);
  l2 = bound01(l2, 100);
  if (s2 === 0) {
    g2 = l2;
    b2 = l2;
    r2 = l2;
  } else {
    var q2 = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
    var p2 = 2 * l2 - q2;
    r2 = hue2rgb(p2, q2, h2 + 1 / 3);
    g2 = hue2rgb(p2, q2, h2);
    b2 = hue2rgb(p2, q2, h2 - 1 / 3);
  }
  return { r: r2 * 255, g: g2 * 255, b: b2 * 255 };
}
function rgbToHsv(r2, g2, b2) {
  r2 = bound01(r2, 255);
  g2 = bound01(g2, 255);
  b2 = bound01(b2, 255);
  var max2 = Math.max(r2, g2, b2);
  var min2 = Math.min(r2, g2, b2);
  var h2 = 0;
  var v2 = max2;
  var d2 = max2 - min2;
  var s2 = max2 === 0 ? 0 : d2 / max2;
  if (max2 === min2) {
    h2 = 0;
  } else {
    switch (max2) {
      case r2:
        h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
        break;
      case g2:
        h2 = (b2 - r2) / d2 + 2;
        break;
      case b2:
        h2 = (r2 - g2) / d2 + 4;
        break;
    }
    h2 /= 6;
  }
  return { h: h2, s: s2, v: v2 };
}
function hsvToRgb(h2, s2, v2) {
  h2 = bound01(h2, 360) * 6;
  s2 = bound01(s2, 100);
  v2 = bound01(v2, 100);
  var i2 = Math.floor(h2);
  var f2 = h2 - i2;
  var p2 = v2 * (1 - s2);
  var q2 = v2 * (1 - f2 * s2);
  var t2 = v2 * (1 - (1 - f2) * s2);
  var mod = i2 % 6;
  var r2 = [v2, q2, p2, p2, t2, v2][mod];
  var g2 = [t2, v2, v2, q2, p2, p2][mod];
  var b2 = [p2, p2, t2, v2, v2, q2][mod];
  return { r: r2 * 255, g: g2 * 255, b: b2 * 255 };
}
function rgbToHex(r2, g2, b2, allow3Char) {
  var hex2 = [
    pad2(Math.round(r2).toString(16)),
    pad2(Math.round(g2).toString(16)),
    pad2(Math.round(b2).toString(16))
  ];
  if (allow3Char && hex2[0].startsWith(hex2[0].charAt(1)) && hex2[1].startsWith(hex2[1].charAt(1)) && hex2[2].startsWith(hex2[2].charAt(1))) {
    return hex2[0].charAt(0) + hex2[1].charAt(0) + hex2[2].charAt(0);
  }
  return hex2.join("");
}
function rgbaToHex(r2, g2, b2, a2, allow4Char) {
  var hex2 = [
    pad2(Math.round(r2).toString(16)),
    pad2(Math.round(g2).toString(16)),
    pad2(Math.round(b2).toString(16)),
    pad2(convertDecimalToHex(a2))
  ];
  if (allow4Char && hex2[0].startsWith(hex2[0].charAt(1)) && hex2[1].startsWith(hex2[1].charAt(1)) && hex2[2].startsWith(hex2[2].charAt(1)) && hex2[3].startsWith(hex2[3].charAt(1))) {
    return hex2[0].charAt(0) + hex2[1].charAt(0) + hex2[2].charAt(0) + hex2[3].charAt(0);
  }
  return hex2.join("");
}
function convertDecimalToHex(d2) {
  return Math.round(parseFloat(d2) * 255).toString(16);
}
function convertHexToDecimal(h2) {
  return parseIntFromHex(h2) / 255;
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 65280) >> 8,
    b: color & 255
  };
}
var names = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function inputToRGB(color) {
  var rgb = { r: 0, g: 0, b: 0 };
  var a2 = 1;
  var s2 = null;
  var v2 = null;
  var l2 = null;
  var ok = false;
  var format2 = false;
  if (typeof color === "string") {
    color = stringInputToObject(color);
  }
  if (typeof color === "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format2 = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s2 = convertToPercentage(color.s);
      v2 = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s2, v2);
      ok = true;
      format2 = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s2 = convertToPercentage(color.s);
      l2 = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s2, l2);
      ok = true;
      format2 = "hsl";
    }
    if (Object.prototype.hasOwnProperty.call(color, "a")) {
      a2 = color.a;
    }
  }
  a2 = boundAlpha(a2);
  return {
    ok,
    format: color.format || format2,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a2
  };
}
var CSS_INTEGER = "[-\\+]?\\d+%?";
var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
  hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  }
  var match = matchers.rgb.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3] };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3], a: match[4] };
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3] };
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3], a: match[4] };
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3] };
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3], a: match[4] };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}
var TinyColor = (
  /** @class */
  function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R2;
      var G2;
      var B2;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R2 = RsRGB / 12.92;
      } else {
        R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G2 = GsRGB / 12.92;
      } else {
        G2 = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B2 = BsRGB / 12.92;
      } else {
        B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.isMonochrome = function() {
      var s2 = this.toHsl().s;
      return s2 === 0;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h2 = Math.round(hsv.h * 360);
      var s2 = Math.round(hsv.s * 100);
      var v2 = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%)") : "hsva(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h2 = Math.round(hsl.h * 360);
      var s2 = Math.round(hsl.s * 100);
      var l2 = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%)") : "hsla(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toHexShortString = function(allowShortChar) {
      if (allowShortChar === void 0) {
        allowShortChar = false;
      }
      return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r2 = Math.round(this.r);
      var g2 = Math.round(this.g);
      var b2 = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(r2, ", ").concat(g2, ", ").concat(b2, ")") : "rgba(".concat(r2, ", ").concat(g2, ", ").concat(b2, ", ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x2) {
        return "".concat(Math.round(bound01(x2, 255) * 100), "%");
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x2) {
        return Math.round(bound01(x2, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex2 = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (hex2 === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format2) {
      var formatSet = Boolean(format2);
      format2 = format2 !== null && format2 !== void 0 ? format2 : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format2.startsWith("hex") || format2 === "name");
      if (needsAlphaFormat) {
        if (format2 === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format2 === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format2 === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format2 === "hex" || format2 === "hex6") {
        formattedString = this.toHexString();
      }
      if (format2 === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format2 === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format2 === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format2 === "name") {
        formattedString = this.toName();
      }
      if (format2 === "hsl") {
        formattedString = this.toHslString();
      }
      if (format2 === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p2 = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p2 + rgb1.r,
        g: (rgb2.g - rgb1.g) * p2 + rgb1.g,
        b: (rgb2.b - rgb1.b) * p2 + rgb1.b,
        a: (rgb2.a - rgb1.a) * p2 + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h2 = hsv.h;
      var s2 = hsv.s;
      var v2 = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({ h: h2, s: s2, v: v2 }));
        v2 = (v2 + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h2 = hsl.h;
      return [
        this,
        new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
        new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
      ];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      var alpha = fg.a + bg.a * (1 - fg.a);
      return new TinyColor2({
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
        a: alpha
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n2) {
      var hsl = this.toHsl();
      var h2 = hsl.h;
      var result = [this];
      var increment = 360 / n2;
      for (var i2 = 1; i2 < n2; i2++) {
        result.push(new TinyColor2({ h: (h2 + i2 * increment) % 360, s: hsl.s, l: hsl.l }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }()
);
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var dayjs_min$1 = { exports: {} };
var dayjs_min = dayjs_min$1.exports;
var hasRequiredDayjs_min;
function requireDayjs_min() {
  if (hasRequiredDayjs_min) return dayjs_min$1.exports;
  hasRequiredDayjs_min = 1;
  (function(module2, exports2) {
    !function(t2, e2) {
      module2.exports = e2();
    }(dayjs_min, function() {
      var t2 = 1e3, e2 = 6e4, n2 = 36e5, r2 = "millisecond", i2 = "second", s2 = "minute", u2 = "hour", a2 = "day", o2 = "week", c2 = "month", f2 = "quarter", h2 = "year", d2 = "date", l2 = "Invalid Date", $2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y2 = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t3) {
        var e3 = ["th", "st", "nd", "rd"], n3 = t3 % 100;
        return "[" + t3 + (e3[(n3 - 20) % 10] || e3[n3] || e3[0]) + "]";
      } }, m2 = function(t3, e3, n3) {
        var r3 = String(t3);
        return !r3 || r3.length >= e3 ? t3 : "" + Array(e3 + 1 - r3.length).join(n3) + t3;
      }, v2 = { s: m2, z: function(t3) {
        var e3 = -t3.utcOffset(), n3 = Math.abs(e3), r3 = Math.floor(n3 / 60), i3 = n3 % 60;
        return (e3 <= 0 ? "+" : "-") + m2(r3, 2, "0") + ":" + m2(i3, 2, "0");
      }, m: function t3(e3, n3) {
        if (e3.date() < n3.date()) return -t3(n3, e3);
        var r3 = 12 * (n3.year() - e3.year()) + (n3.month() - e3.month()), i3 = e3.clone().add(r3, c2), s3 = n3 - i3 < 0, u3 = e3.clone().add(r3 + (s3 ? -1 : 1), c2);
        return +(-(r3 + (n3 - i3) / (s3 ? i3 - u3 : u3 - i3)) || 0);
      }, a: function(t3) {
        return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
      }, p: function(t3) {
        return { M: c2, y: h2, w: o2, d: a2, D: d2, h: u2, m: s2, s: i2, ms: r2, Q: f2 }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t3) {
        return void 0 === t3;
      } }, g2 = "en", D2 = {};
      D2[g2] = M2;
      var p2 = "$isDayjsObject", S2 = function(t3) {
        return t3 instanceof _2 || !(!t3 || !t3[p2]);
      }, w2 = function t3(e3, n3, r3) {
        var i3;
        if (!e3) return g2;
        if ("string" == typeof e3) {
          var s3 = e3.toLowerCase();
          D2[s3] && (i3 = s3), n3 && (D2[s3] = n3, i3 = s3);
          var u3 = e3.split("-");
          if (!i3 && u3.length > 1) return t3(u3[0]);
        } else {
          var a3 = e3.name;
          D2[a3] = e3, i3 = a3;
        }
        return !r3 && i3 && (g2 = i3), i3 || !r3 && g2;
      }, O2 = function(t3, e3) {
        if (S2(t3)) return t3.clone();
        var n3 = "object" == typeof e3 ? e3 : {};
        return n3.date = t3, n3.args = arguments, new _2(n3);
      }, b2 = v2;
      b2.l = w2, b2.i = S2, b2.w = function(t3, e3) {
        return O2(t3, { locale: e3.$L, utc: e3.$u, x: e3.$x, $offset: e3.$offset });
      };
      var _2 = function() {
        function M3(t3) {
          this.$L = w2(t3.locale, null, true), this.parse(t3), this.$x = this.$x || t3.x || {}, this[p2] = true;
        }
        var m3 = M3.prototype;
        return m3.parse = function(t3) {
          this.$d = function(t4) {
            var e3 = t4.date, n3 = t4.utc;
            if (null === e3) return /* @__PURE__ */ new Date(NaN);
            if (b2.u(e3)) return /* @__PURE__ */ new Date();
            if (e3 instanceof Date) return new Date(e3);
            if ("string" == typeof e3 && !/Z$/i.test(e3)) {
              var r3 = e3.match($2);
              if (r3) {
                var i3 = r3[2] - 1 || 0, s3 = (r3[7] || "0").substring(0, 3);
                return n3 ? new Date(Date.UTC(r3[1], i3, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3)) : new Date(r3[1], i3, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3);
              }
            }
            return new Date(e3);
          }(t3), this.init();
        }, m3.init = function() {
          var t3 = this.$d;
          this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
        }, m3.$utils = function() {
          return b2;
        }, m3.isValid = function() {
          return !(this.$d.toString() === l2);
        }, m3.isSame = function(t3, e3) {
          var n3 = O2(t3);
          return this.startOf(e3) <= n3 && n3 <= this.endOf(e3);
        }, m3.isAfter = function(t3, e3) {
          return O2(t3) < this.startOf(e3);
        }, m3.isBefore = function(t3, e3) {
          return this.endOf(e3) < O2(t3);
        }, m3.$g = function(t3, e3, n3) {
          return b2.u(t3) ? this[e3] : this.set(n3, t3);
        }, m3.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m3.valueOf = function() {
          return this.$d.getTime();
        }, m3.startOf = function(t3, e3) {
          var n3 = this, r3 = !!b2.u(e3) || e3, f3 = b2.p(t3), l3 = function(t4, e4) {
            var i3 = b2.w(n3.$u ? Date.UTC(n3.$y, e4, t4) : new Date(n3.$y, e4, t4), n3);
            return r3 ? i3 : i3.endOf(a2);
          }, $3 = function(t4, e4) {
            return b2.w(n3.toDate()[t4].apply(n3.toDate("s"), (r3 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e4)), n3);
          }, y3 = this.$W, M4 = this.$M, m4 = this.$D, v3 = "set" + (this.$u ? "UTC" : "");
          switch (f3) {
            case h2:
              return r3 ? l3(1, 0) : l3(31, 11);
            case c2:
              return r3 ? l3(1, M4) : l3(0, M4 + 1);
            case o2:
              var g3 = this.$locale().weekStart || 0, D3 = (y3 < g3 ? y3 + 7 : y3) - g3;
              return l3(r3 ? m4 - D3 : m4 + (6 - D3), M4);
            case a2:
            case d2:
              return $3(v3 + "Hours", 0);
            case u2:
              return $3(v3 + "Minutes", 1);
            case s2:
              return $3(v3 + "Seconds", 2);
            case i2:
              return $3(v3 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m3.endOf = function(t3) {
          return this.startOf(t3, false);
        }, m3.$set = function(t3, e3) {
          var n3, o3 = b2.p(t3), f3 = "set" + (this.$u ? "UTC" : ""), l3 = (n3 = {}, n3[a2] = f3 + "Date", n3[d2] = f3 + "Date", n3[c2] = f3 + "Month", n3[h2] = f3 + "FullYear", n3[u2] = f3 + "Hours", n3[s2] = f3 + "Minutes", n3[i2] = f3 + "Seconds", n3[r2] = f3 + "Milliseconds", n3)[o3], $3 = o3 === a2 ? this.$D + (e3 - this.$W) : e3;
          if (o3 === c2 || o3 === h2) {
            var y3 = this.clone().set(d2, 1);
            y3.$d[l3]($3), y3.init(), this.$d = y3.set(d2, Math.min(this.$D, y3.daysInMonth())).$d;
          } else l3 && this.$d[l3]($3);
          return this.init(), this;
        }, m3.set = function(t3, e3) {
          return this.clone().$set(t3, e3);
        }, m3.get = function(t3) {
          return this[b2.p(t3)]();
        }, m3.add = function(r3, f3) {
          var d3, l3 = this;
          r3 = Number(r3);
          var $3 = b2.p(f3), y3 = function(t3) {
            var e3 = O2(l3);
            return b2.w(e3.date(e3.date() + Math.round(t3 * r3)), l3);
          };
          if ($3 === c2) return this.set(c2, this.$M + r3);
          if ($3 === h2) return this.set(h2, this.$y + r3);
          if ($3 === a2) return y3(1);
          if ($3 === o2) return y3(7);
          var M4 = (d3 = {}, d3[s2] = e2, d3[u2] = n2, d3[i2] = t2, d3)[$3] || 1, m4 = this.$d.getTime() + r3 * M4;
          return b2.w(m4, this);
        }, m3.subtract = function(t3, e3) {
          return this.add(-1 * t3, e3);
        }, m3.format = function(t3) {
          var e3 = this, n3 = this.$locale();
          if (!this.isValid()) return n3.invalidDate || l2;
          var r3 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i3 = b2.z(this), s3 = this.$H, u3 = this.$m, a3 = this.$M, o3 = n3.weekdays, c3 = n3.months, f3 = n3.meridiem, h3 = function(t4, n4, i4, s4) {
            return t4 && (t4[n4] || t4(e3, r3)) || i4[n4].slice(0, s4);
          }, d3 = function(t4) {
            return b2.s(s3 % 12 || 12, t4, "0");
          }, $3 = f3 || function(t4, e4, n4) {
            var r4 = t4 < 12 ? "AM" : "PM";
            return n4 ? r4.toLowerCase() : r4;
          };
          return r3.replace(y2, function(t4, r4) {
            return r4 || function(t5) {
              switch (t5) {
                case "YY":
                  return String(e3.$y).slice(-2);
                case "YYYY":
                  return b2.s(e3.$y, 4, "0");
                case "M":
                  return a3 + 1;
                case "MM":
                  return b2.s(a3 + 1, 2, "0");
                case "MMM":
                  return h3(n3.monthsShort, a3, c3, 3);
                case "MMMM":
                  return h3(c3, a3);
                case "D":
                  return e3.$D;
                case "DD":
                  return b2.s(e3.$D, 2, "0");
                case "d":
                  return String(e3.$W);
                case "dd":
                  return h3(n3.weekdaysMin, e3.$W, o3, 2);
                case "ddd":
                  return h3(n3.weekdaysShort, e3.$W, o3, 3);
                case "dddd":
                  return o3[e3.$W];
                case "H":
                  return String(s3);
                case "HH":
                  return b2.s(s3, 2, "0");
                case "h":
                  return d3(1);
                case "hh":
                  return d3(2);
                case "a":
                  return $3(s3, u3, true);
                case "A":
                  return $3(s3, u3, false);
                case "m":
                  return String(u3);
                case "mm":
                  return b2.s(u3, 2, "0");
                case "s":
                  return String(e3.$s);
                case "ss":
                  return b2.s(e3.$s, 2, "0");
                case "SSS":
                  return b2.s(e3.$ms, 3, "0");
                case "Z":
                  return i3;
              }
              return null;
            }(t4) || i3.replace(":", "");
          });
        }, m3.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m3.diff = function(r3, d3, l3) {
          var $3, y3 = this, M4 = b2.p(d3), m4 = O2(r3), v3 = (m4.utcOffset() - this.utcOffset()) * e2, g3 = this - m4, D3 = function() {
            return b2.m(y3, m4);
          };
          switch (M4) {
            case h2:
              $3 = D3() / 12;
              break;
            case c2:
              $3 = D3();
              break;
            case f2:
              $3 = D3() / 3;
              break;
            case o2:
              $3 = (g3 - v3) / 6048e5;
              break;
            case a2:
              $3 = (g3 - v3) / 864e5;
              break;
            case u2:
              $3 = g3 / n2;
              break;
            case s2:
              $3 = g3 / e2;
              break;
            case i2:
              $3 = g3 / t2;
              break;
            default:
              $3 = g3;
          }
          return l3 ? $3 : b2.a($3);
        }, m3.daysInMonth = function() {
          return this.endOf(c2).$D;
        }, m3.$locale = function() {
          return D2[this.$L];
        }, m3.locale = function(t3, e3) {
          if (!t3) return this.$L;
          var n3 = this.clone(), r3 = w2(t3, e3, true);
          return r3 && (n3.$L = r3), n3;
        }, m3.clone = function() {
          return b2.w(this.$d, this);
        }, m3.toDate = function() {
          return new Date(this.valueOf());
        }, m3.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m3.toISOString = function() {
          return this.$d.toISOString();
        }, m3.toString = function() {
          return this.$d.toUTCString();
        }, M3;
      }(), k2 = _2.prototype;
      return O2.prototype = k2, [["$ms", r2], ["$s", i2], ["$m", s2], ["$H", u2], ["$W", a2], ["$M", c2], ["$y", h2], ["$D", d2]].forEach(function(t3) {
        k2[t3[1]] = function(e3) {
          return this.$g(e3, t3[0], t3[1]);
        };
      }), O2.extend = function(t3, e3) {
        return t3.$i || (t3(e3, _2, O2), t3.$i = true), O2;
      }, O2.locale = w2, O2.isDayjs = S2, O2.unix = function(t3) {
        return O2(1e3 * t3);
      }, O2.en = D2[g2], O2.Ls = D2, O2.p = {}, O2;
    });
  })(dayjs_min$1);
  return dayjs_min$1.exports;
}
var dayjs_minExports = requireDayjs_min();
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
var localeData$2 = { exports: {} };
var localeData$1 = localeData$2.exports;
var hasRequiredLocaleData;
function requireLocaleData() {
  if (hasRequiredLocaleData) return localeData$2.exports;
  hasRequiredLocaleData = 1;
  (function(module2, exports2) {
    !function(n2, e2) {
      module2.exports = e2();
    }(localeData$1, function() {
      return function(n2, e2, t2) {
        var r2 = e2.prototype, o2 = function(n3) {
          return n3 && (n3.indexOf ? n3 : n3.s);
        }, u2 = function(n3, e3, t3, r3, u3) {
          var i3 = n3.name ? n3 : n3.$locale(), a3 = o2(i3[e3]), s3 = o2(i3[t3]), f2 = a3 || s3.map(function(n4) {
            return n4.slice(0, r3);
          });
          if (!u3) return f2;
          var d2 = i3.weekStart;
          return f2.map(function(n4, e4) {
            return f2[(e4 + (d2 || 0)) % 7];
          });
        }, i2 = function() {
          return t2.Ls[t2.locale()];
        }, a2 = function(n3, e3) {
          return n3.formats[e3] || function(n4) {
            return n4.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(n5, e4, t3) {
              return e4 || t3.slice(1);
            });
          }(n3.formats[e3.toUpperCase()]);
        }, s2 = function() {
          var n3 = this;
          return { months: function(e3) {
            return e3 ? e3.format("MMMM") : u2(n3, "months");
          }, monthsShort: function(e3) {
            return e3 ? e3.format("MMM") : u2(n3, "monthsShort", "months", 3);
          }, firstDayOfWeek: function() {
            return n3.$locale().weekStart || 0;
          }, weekdays: function(e3) {
            return e3 ? e3.format("dddd") : u2(n3, "weekdays");
          }, weekdaysMin: function(e3) {
            return e3 ? e3.format("dd") : u2(n3, "weekdaysMin", "weekdays", 2);
          }, weekdaysShort: function(e3) {
            return e3 ? e3.format("ddd") : u2(n3, "weekdaysShort", "weekdays", 3);
          }, longDateFormat: function(e3) {
            return a2(n3.$locale(), e3);
          }, meridiem: this.$locale().meridiem, ordinal: this.$locale().ordinal };
        };
        r2.localeData = function() {
          return s2.bind(this)();
        }, t2.localeData = function() {
          var n3 = i2();
          return { firstDayOfWeek: function() {
            return n3.weekStart || 0;
          }, weekdays: function() {
            return t2.weekdays();
          }, weekdaysShort: function() {
            return t2.weekdaysShort();
          }, weekdaysMin: function() {
            return t2.weekdaysMin();
          }, months: function() {
            return t2.months();
          }, monthsShort: function() {
            return t2.monthsShort();
          }, longDateFormat: function(e3) {
            return a2(n3, e3);
          }, meridiem: n3.meridiem, ordinal: n3.ordinal };
        }, t2.months = function() {
          return u2(i2(), "months");
        }, t2.monthsShort = function() {
          return u2(i2(), "monthsShort", "months", 3);
        }, t2.weekdays = function(n3) {
          return u2(i2(), "weekdays", null, null, n3);
        }, t2.weekdaysShort = function(n3) {
          return u2(i2(), "weekdaysShort", "weekdays", 3, n3);
        }, t2.weekdaysMin = function(n3) {
          return u2(i2(), "weekdaysMin", "weekdays", 2, n3);
        };
      };
    });
  })(localeData$2);
  return localeData$2.exports;
}
var localeDataExports = requireLocaleData();
const localeData = /* @__PURE__ */ getDefaultExportFromCjs(localeDataExports);
var customParseFormat$2 = { exports: {} };
var customParseFormat$1 = customParseFormat$2.exports;
var hasRequiredCustomParseFormat;
function requireCustomParseFormat() {
  if (hasRequiredCustomParseFormat) return customParseFormat$2.exports;
  hasRequiredCustomParseFormat = 1;
  (function(module2, exports2) {
    !function(e2, t2) {
      module2.exports = t2();
    }(customParseFormat$1, function() {
      var e2 = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t2 = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n2 = /\d/, r2 = /\d\d/, i2 = /\d\d?/, o2 = /\d*[^-_:/,()\s\d]+/, s2 = {}, a2 = function(e3) {
        return (e3 = +e3) + (e3 > 68 ? 1900 : 2e3);
      };
      var f2 = function(e3) {
        return function(t3) {
          this[e3] = +t3;
        };
      }, h2 = [/[+-]\d\d:?(\d\d)?|Z/, function(e3) {
        (this.zone || (this.zone = {})).offset = function(e4) {
          if (!e4) return 0;
          if ("Z" === e4) return 0;
          var t3 = e4.match(/([+-]|\d\d)/g), n3 = 60 * t3[1] + (+t3[2] || 0);
          return 0 === n3 ? 0 : "+" === t3[0] ? -n3 : n3;
        }(e3);
      }], u2 = function(e3) {
        var t3 = s2[e3];
        return t3 && (t3.indexOf ? t3 : t3.s.concat(t3.f));
      }, d2 = function(e3, t3) {
        var n3, r3 = s2.meridiem;
        if (r3) {
          for (var i3 = 1; i3 <= 24; i3 += 1) if (e3.indexOf(r3(i3, 0, t3)) > -1) {
            n3 = i3 > 12;
            break;
          }
        } else n3 = e3 === (t3 ? "pm" : "PM");
        return n3;
      }, c2 = { A: [o2, function(e3) {
        this.afternoon = d2(e3, false);
      }], a: [o2, function(e3) {
        this.afternoon = d2(e3, true);
      }], Q: [n2, function(e3) {
        this.month = 3 * (e3 - 1) + 1;
      }], S: [n2, function(e3) {
        this.milliseconds = 100 * +e3;
      }], SS: [r2, function(e3) {
        this.milliseconds = 10 * +e3;
      }], SSS: [/\d{3}/, function(e3) {
        this.milliseconds = +e3;
      }], s: [i2, f2("seconds")], ss: [i2, f2("seconds")], m: [i2, f2("minutes")], mm: [i2, f2("minutes")], H: [i2, f2("hours")], h: [i2, f2("hours")], HH: [i2, f2("hours")], hh: [i2, f2("hours")], D: [i2, f2("day")], DD: [r2, f2("day")], Do: [o2, function(e3) {
        var t3 = s2.ordinal, n3 = e3.match(/\d+/);
        if (this.day = n3[0], t3) for (var r3 = 1; r3 <= 31; r3 += 1) t3(r3).replace(/\[|\]/g, "") === e3 && (this.day = r3);
      }], w: [i2, f2("week")], ww: [r2, f2("week")], M: [i2, f2("month")], MM: [r2, f2("month")], MMM: [o2, function(e3) {
        var t3 = u2("months"), n3 = (u2("monthsShort") || t3.map(function(e4) {
          return e4.slice(0, 3);
        })).indexOf(e3) + 1;
        if (n3 < 1) throw new Error();
        this.month = n3 % 12 || n3;
      }], MMMM: [o2, function(e3) {
        var t3 = u2("months").indexOf(e3) + 1;
        if (t3 < 1) throw new Error();
        this.month = t3 % 12 || t3;
      }], Y: [/[+-]?\d+/, f2("year")], YY: [r2, function(e3) {
        this.year = a2(e3);
      }], YYYY: [/\d{4}/, f2("year")], Z: h2, ZZ: h2 };
      function l2(n3) {
        var r3, i3;
        r3 = n3, i3 = s2 && s2.formats;
        for (var o3 = (n3 = r3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t3, n4, r4) {
          var o4 = r4 && r4.toUpperCase();
          return n4 || i3[r4] || e2[r4] || i3[o4].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e3, t4, n5) {
            return t4 || n5.slice(1);
          });
        })).match(t2), a3 = o3.length, f3 = 0; f3 < a3; f3 += 1) {
          var h3 = o3[f3], u3 = c2[h3], d3 = u3 && u3[0], l3 = u3 && u3[1];
          o3[f3] = l3 ? { regex: d3, parser: l3 } : h3.replace(/^\[|\]$/g, "");
        }
        return function(e3) {
          for (var t3 = {}, n4 = 0, r4 = 0; n4 < a3; n4 += 1) {
            var i4 = o3[n4];
            if ("string" == typeof i4) r4 += i4.length;
            else {
              var s3 = i4.regex, f4 = i4.parser, h4 = e3.slice(r4), u4 = s3.exec(h4)[0];
              f4.call(t3, u4), e3 = e3.replace(u4, "");
            }
          }
          return function(e4) {
            var t4 = e4.afternoon;
            if (void 0 !== t4) {
              var n5 = e4.hours;
              t4 ? n5 < 12 && (e4.hours += 12) : 12 === n5 && (e4.hours = 0), delete e4.afternoon;
            }
          }(t3), t3;
        };
      }
      return function(e3, t3, n3) {
        n3.p.customParseFormat = true, e3 && e3.parseTwoDigitYear && (a2 = e3.parseTwoDigitYear);
        var r3 = t3.prototype, i3 = r3.parse;
        r3.parse = function(e4) {
          var t4 = e4.date, r4 = e4.utc, o3 = e4.args;
          this.$u = r4;
          var a3 = o3[1];
          if ("string" == typeof a3) {
            var f3 = true === o3[2], h3 = true === o3[3], u3 = f3 || h3, d3 = o3[2];
            h3 && (d3 = o3[2]), s2 = this.$locale(), !f3 && d3 && (s2 = n3.Ls[d3]), this.$d = function(e5, t5, n4, r5) {
              try {
                if (["x", "X"].indexOf(t5) > -1) return new Date(("X" === t5 ? 1e3 : 1) * e5);
                var i4 = l2(t5)(e5), o4 = i4.year, s3 = i4.month, a4 = i4.day, f4 = i4.hours, h4 = i4.minutes, u4 = i4.seconds, d4 = i4.milliseconds, c4 = i4.zone, m3 = i4.week, M3 = /* @__PURE__ */ new Date(), Y2 = a4 || (o4 || s3 ? 1 : M3.getDate()), p2 = o4 || M3.getFullYear(), v2 = 0;
                o4 && !s3 || (v2 = s3 > 0 ? s3 - 1 : M3.getMonth());
                var D2, w2 = f4 || 0, g2 = h4 || 0, y2 = u4 || 0, L2 = d4 || 0;
                return c4 ? new Date(Date.UTC(p2, v2, Y2, w2, g2, y2, L2 + 60 * c4.offset * 1e3)) : n4 ? new Date(Date.UTC(p2, v2, Y2, w2, g2, y2, L2)) : (D2 = new Date(p2, v2, Y2, w2, g2, y2, L2), m3 && (D2 = r5(D2).week(m3).toDate()), D2);
              } catch (e6) {
                return /* @__PURE__ */ new Date("");
              }
            }(t4, a3, r4, n3), this.init(), d3 && true !== d3 && (this.$L = this.locale(d3).$L), u3 && t4 != this.format(a3) && (this.$d = /* @__PURE__ */ new Date("")), s2 = {};
          } else if (a3 instanceof Array) for (var c3 = a3.length, m2 = 1; m2 <= c3; m2 += 1) {
            o3[1] = a3[m2 - 1];
            var M2 = n3.apply(this, o3);
            if (M2.isValid()) {
              this.$d = M2.$d, this.$L = M2.$L, this.init();
              break;
            }
            m2 === c3 && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else i3.call(this, e4);
        };
      };
    });
  })(customParseFormat$2);
  return customParseFormat$2.exports;
}
var customParseFormatExports = requireCustomParseFormat();
const customParseFormat = /* @__PURE__ */ getDefaultExportFromCjs(customParseFormatExports);
var advancedFormat$2 = { exports: {} };
var advancedFormat$1 = advancedFormat$2.exports;
var hasRequiredAdvancedFormat;
function requireAdvancedFormat() {
  if (hasRequiredAdvancedFormat) return advancedFormat$2.exports;
  hasRequiredAdvancedFormat = 1;
  (function(module2, exports2) {
    !function(e2, t2) {
      module2.exports = t2();
    }(advancedFormat$1, function() {
      return function(e2, t2) {
        var r2 = t2.prototype, n2 = r2.format;
        r2.format = function(e3) {
          var t3 = this, r3 = this.$locale();
          if (!this.isValid()) return n2.bind(this)(e3);
          var s2 = this.$utils(), a2 = (e3 || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function(e4) {
            switch (e4) {
              case "Q":
                return Math.ceil((t3.$M + 1) / 3);
              case "Do":
                return r3.ordinal(t3.$D);
              case "gggg":
                return t3.weekYear();
              case "GGGG":
                return t3.isoWeekYear();
              case "wo":
                return r3.ordinal(t3.week(), "W");
              case "w":
              case "ww":
                return s2.s(t3.week(), "w" === e4 ? 1 : 2, "0");
              case "W":
              case "WW":
                return s2.s(t3.isoWeek(), "W" === e4 ? 1 : 2, "0");
              case "k":
              case "kk":
                return s2.s(String(0 === t3.$H ? 24 : t3.$H), "k" === e4 ? 1 : 2, "0");
              case "X":
                return Math.floor(t3.$d.getTime() / 1e3);
              case "x":
                return t3.$d.getTime();
              case "z":
                return "[" + t3.offsetName() + "]";
              case "zzz":
                return "[" + t3.offsetName("long") + "]";
              default:
                return e4;
            }
          });
          return n2.bind(this)(a2);
        };
      };
    });
  })(advancedFormat$2);
  return advancedFormat$2.exports;
}
var advancedFormatExports = requireAdvancedFormat();
const advancedFormat = /* @__PURE__ */ getDefaultExportFromCjs(advancedFormatExports);
var weekOfYear$2 = { exports: {} };
var weekOfYear$1 = weekOfYear$2.exports;
var hasRequiredWeekOfYear;
function requireWeekOfYear() {
  if (hasRequiredWeekOfYear) return weekOfYear$2.exports;
  hasRequiredWeekOfYear = 1;
  (function(module2, exports2) {
    !function(e2, t2) {
      module2.exports = t2();
    }(weekOfYear$1, function() {
      var e2 = "week", t2 = "year";
      return function(i2, n2, r2) {
        var f2 = n2.prototype;
        f2.week = function(i3) {
          if (void 0 === i3 && (i3 = null), null !== i3) return this.add(7 * (i3 - this.week()), "day");
          var n3 = this.$locale().yearStart || 1;
          if (11 === this.month() && this.date() > 25) {
            var f3 = r2(this).startOf(t2).add(1, t2).date(n3), s2 = r2(this).endOf(e2);
            if (f3.isBefore(s2)) return 1;
          }
          var a2 = r2(this).startOf(t2).date(n3).startOf(e2).subtract(1, "millisecond"), o2 = this.diff(a2, e2, true);
          return o2 < 0 ? r2(this).startOf("week").week() : Math.ceil(o2);
        }, f2.weeks = function(e3) {
          return void 0 === e3 && (e3 = null), this.week(e3);
        };
      };
    });
  })(weekOfYear$2);
  return weekOfYear$2.exports;
}
var weekOfYearExports = requireWeekOfYear();
const weekOfYear = /* @__PURE__ */ getDefaultExportFromCjs(weekOfYearExports);
var weekYear$2 = { exports: {} };
var weekYear$1 = weekYear$2.exports;
var hasRequiredWeekYear;
function requireWeekYear() {
  if (hasRequiredWeekYear) return weekYear$2.exports;
  hasRequiredWeekYear = 1;
  (function(module2, exports2) {
    !function(e2, t2) {
      module2.exports = t2();
    }(weekYear$1, function() {
      return function(e2, t2) {
        t2.prototype.weekYear = function() {
          var e3 = this.month(), t3 = this.week(), n2 = this.year();
          return 1 === t3 && 11 === e3 ? n2 + 1 : 0 === e3 && t3 >= 52 ? n2 - 1 : n2;
        };
      };
    });
  })(weekYear$2);
  return weekYear$2.exports;
}
var weekYearExports = requireWeekYear();
const weekYear = /* @__PURE__ */ getDefaultExportFromCjs(weekYearExports);
var dayOfYear$2 = { exports: {} };
var dayOfYear$1 = dayOfYear$2.exports;
var hasRequiredDayOfYear;
function requireDayOfYear() {
  if (hasRequiredDayOfYear) return dayOfYear$2.exports;
  hasRequiredDayOfYear = 1;
  (function(module2, exports2) {
    !function(e2, t2) {
      module2.exports = t2();
    }(dayOfYear$1, function() {
      return function(e2, t2, n2) {
        t2.prototype.dayOfYear = function(e3) {
          var t3 = Math.round((n2(this).startOf("day") - n2(this).startOf("year")) / 864e5) + 1;
          return null == e3 ? t3 : this.add(e3 - t3, "day");
        };
      };
    });
  })(dayOfYear$2);
  return dayOfYear$2.exports;
}
var dayOfYearExports = requireDayOfYear();
const dayOfYear = /* @__PURE__ */ getDefaultExportFromCjs(dayOfYearExports);
var isSameOrAfter$2 = { exports: {} };
var isSameOrAfter$1 = isSameOrAfter$2.exports;
var hasRequiredIsSameOrAfter;
function requireIsSameOrAfter() {
  if (hasRequiredIsSameOrAfter) return isSameOrAfter$2.exports;
  hasRequiredIsSameOrAfter = 1;
  (function(module2, exports2) {
    !function(e2, t2) {
      module2.exports = t2();
    }(isSameOrAfter$1, function() {
      return function(e2, t2) {
        t2.prototype.isSameOrAfter = function(e3, t3) {
          return this.isSame(e3, t3) || this.isAfter(e3, t3);
        };
      };
    });
  })(isSameOrAfter$2);
  return isSameOrAfter$2.exports;
}
var isSameOrAfterExports = requireIsSameOrAfter();
const isSameOrAfter = /* @__PURE__ */ getDefaultExportFromCjs(isSameOrAfterExports);
var isSameOrBefore$2 = { exports: {} };
var isSameOrBefore$1 = isSameOrBefore$2.exports;
var hasRequiredIsSameOrBefore;
function requireIsSameOrBefore() {
  if (hasRequiredIsSameOrBefore) return isSameOrBefore$2.exports;
  hasRequiredIsSameOrBefore = 1;
  (function(module2, exports2) {
    !function(e2, i2) {
      module2.exports = i2();
    }(isSameOrBefore$1, function() {
      return function(e2, i2) {
        i2.prototype.isSameOrBefore = function(e3, i3) {
          return this.isSame(e3, i3) || this.isBefore(e3, i3);
        };
      };
    });
  })(isSameOrBefore$2);
  return isSameOrBefore$2.exports;
}
var isSameOrBeforeExports = requireIsSameOrBefore();
const isSameOrBefore = /* @__PURE__ */ getDefaultExportFromCjs(isSameOrBeforeExports);
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o2) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o22) {
    return o22.__proto__ || Object.getPrototypeOf(o22);
  };
  return _getPrototypeOf(o2);
}
function _setPrototypeOf(o2, p2) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o22, p22) {
    o22.__proto__ = p22;
    return o22;
  };
  return _setPrototypeOf(o2, p2);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e2) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a2 = [null];
      a2.push.apply(a2, args2);
      var Constructor = Function.bind.apply(Parent2, a2);
      var instance = new Constructor();
      if (Class2) _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn2) {
  return Function.toString.call(fn2).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2)) return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
var formatRegExp = /%[sdj%]/g;
var warning = function warning2() {
};
function convertFieldsError(errors) {
  if (!errors || !errors.length) return null;
  var fields = {};
  errors.forEach(function(error) {
    var field = error.field;
    fields[field] = fields[field] || [];
    fields[field].push(error);
  });
  return fields;
}
function format(template) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  var i2 = 0;
  var len = args.length;
  if (typeof template === "function") {
    return template.apply(null, args);
  }
  if (typeof template === "string") {
    var str = template.replace(formatRegExp, function(x2) {
      if (x2 === "%%") {
        return "%";
      }
      if (i2 >= len) {
        return x2;
      }
      switch (x2) {
        case "%s":
          return String(args[i2++]);
        case "%d":
          return Number(args[i2++]);
        case "%j":
          try {
            return JSON.stringify(args[i2++]);
          } catch (_2) {
            return "[Circular]";
          }
          break;
        default:
          return x2;
      }
    });
    return str;
  }
  return template;
}
function isNativeStringType(type4) {
  return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
}
function isEmptyValue(value, type4) {
  if (value === void 0 || value === null) {
    return true;
  }
  if (type4 === "array" && Array.isArray(value) && !value.length) {
    return true;
  }
  if (isNativeStringType(type4) && typeof value === "string" && !value) {
    return true;
  }
  return false;
}
function asyncParallelArray(arr, func, callback) {
  var results = [];
  var total = 0;
  var arrLength = arr.length;
  function count(errors) {
    results.push.apply(results, errors || []);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }
  arr.forEach(function(a2) {
    func(a2, count);
  });
}
function asyncSerialArray(arr, func, callback) {
  var index = 0;
  var arrLength = arr.length;
  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    var original = index;
    index = index + 1;
    if (original < arrLength) {
      func(arr[original], next);
    } else {
      callback([]);
    }
  }
  next([]);
}
function flattenObjArr(objArr) {
  var ret = [];
  Object.keys(objArr).forEach(function(k2) {
    ret.push.apply(ret, objArr[k2] || []);
  });
  return ret;
}
var AsyncValidationError = /* @__PURE__ */ function(_Error) {
  _inheritsLoose(AsyncValidationError2, _Error);
  function AsyncValidationError2(errors, fields) {
    var _this;
    _this = _Error.call(this, "Async Validation Error") || this;
    _this.errors = errors;
    _this.fields = fields;
    return _this;
  }
  return AsyncValidationError2;
}(/* @__PURE__ */ _wrapNativeSuper(Error));
function asyncMap(objArr, option, func, callback, source) {
  if (option.first) {
    var _pending = new Promise(function(resolve, reject) {
      var next = function next2(errors) {
        callback(errors);
        return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
      };
      var flattenArr = flattenObjArr(objArr);
      asyncSerialArray(flattenArr, func, next);
    });
    _pending["catch"](function(e2) {
      return e2;
    });
    return _pending;
  }
  var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
  var objArrKeys = Object.keys(objArr);
  var objArrLength = objArrKeys.length;
  var total = 0;
  var results = [];
  var pending = new Promise(function(resolve, reject) {
    var next = function next2(errors) {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
        return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
      }
    };
    if (!objArrKeys.length) {
      callback(results);
      resolve(source);
    }
    objArrKeys.forEach(function(key) {
      var arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func, next);
      } else {
        asyncParallelArray(arr, func, next);
      }
    });
  });
  pending["catch"](function(e2) {
    return e2;
  });
  return pending;
}
function isErrorObj(obj) {
  return !!(obj && obj.message !== void 0);
}
function getValue(value, path) {
  var v2 = value;
  for (var i2 = 0; i2 < path.length; i2++) {
    if (v2 == void 0) {
      return v2;
    }
    v2 = v2[path[i2]];
  }
  return v2;
}
function complementError(rule, source) {
  return function(oe) {
    var fieldValue;
    if (rule.fullFields) {
      fieldValue = getValue(source, rule.fullFields);
    } else {
      fieldValue = source[oe.field || rule.fullField];
    }
    if (isErrorObj(oe)) {
      oe.field = oe.field || rule.fullField;
      oe.fieldValue = fieldValue;
      return oe;
    }
    return {
      message: typeof oe === "function" ? oe() : oe,
      fieldValue,
      field: oe.field || rule.fullField
    };
  };
}
function deepMerge(target, source) {
  if (source) {
    for (var s2 in source) {
      if (source.hasOwnProperty(s2)) {
        var value = source[s2];
        if (typeof value === "object" && typeof target[s2] === "object") {
          target[s2] = _extends({}, target[s2], value);
        } else {
          target[s2] = value;
        }
      }
    }
  }
  return target;
}
var required$1 = function required(rule, value, source, errors, options, type4) {
  if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
    errors.push(format(options.messages.required, rule.fullField));
  }
};
var whitespace = function whitespace2(rule, value, source, errors, options) {
  if (/^\s+$/.test(value) || value === "") {
    errors.push(format(options.messages.whitespace, rule.fullField));
  }
};
var urlReg;
var getUrlRegex = function() {
  if (urlReg) {
    return urlReg;
  }
  var word = "[a-fA-F\\d:]";
  var b2 = function b22(options) {
    return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
  };
  var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
  var v6seg = "[a-fA-F\\d]{1,4}";
  var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
  var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
  var v4exact = new RegExp("^" + v4 + "$");
  var v6exact = new RegExp("^" + v6 + "$");
  var ip = function ip2(options) {
    return options && options.exact ? v46Exact : new RegExp("(?:" + b2(options) + v4 + b2(options) + ")|(?:" + b2(options) + v6 + b2(options) + ")", "g");
  };
  ip.v4 = function(options) {
    return options && options.exact ? v4exact : new RegExp("" + b2(options) + v4 + b2(options), "g");
  };
  ip.v6 = function(options) {
    return options && options.exact ? v6exact : new RegExp("" + b2(options) + v6 + b2(options), "g");
  };
  var protocol = "(?:(?:[a-z]+:)?//)";
  var auth = "(?:\\S+(?::\\S*)?@)?";
  var ipv4 = ip.v4().source;
  var ipv6 = ip.v6().source;
  var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
  var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
  var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
  var port = "(?::\\d{2,5})?";
  var path = '(?:[/?#][^\\s"]*)?';
  var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
  urlReg = new RegExp("(?:^" + regex + "$)", "i");
  return urlReg;
};
var pattern$2 = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
  // url: new RegExp(
  //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  //   'i',
  // ),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
var types = {
  integer: function integer(value) {
    return types.number(value) && parseInt(value, 10) === value;
  },
  "float": function float(value) {
    return types.number(value) && !types.integer(value);
  },
  array: function array(value) {
    return Array.isArray(value);
  },
  regexp: function regexp(value) {
    if (value instanceof RegExp) {
      return true;
    }
    try {
      return !!new RegExp(value);
    } catch (e2) {
      return false;
    }
  },
  date: function date(value) {
    return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
  },
  number: function number2(value) {
    if (isNaN(value)) {
      return false;
    }
    return typeof value === "number";
  },
  object: function object(value) {
    return typeof value === "object" && !types.array(value);
  },
  method: function method(value) {
    return typeof value === "function";
  },
  email: function email(value) {
    return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
  },
  url: function url(value) {
    return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
  },
  hex: function hex(value) {
    return typeof value === "string" && !!value.match(pattern$2.hex);
  }
};
var type$1 = function type(rule, value, source, errors, options) {
  if (rule.required && value === void 0) {
    required$1(rule, value, source, errors, options);
    return;
  }
  var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
  var ruleType = rule.type;
  if (custom.indexOf(ruleType) > -1) {
    if (!types[ruleType](value)) {
      errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
    }
  } else if (ruleType && typeof value !== rule.type) {
    errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
  }
};
var range = function range2(rule, value, source, errors, options) {
  var len = typeof rule.len === "number";
  var min2 = typeof rule.min === "number";
  var max2 = typeof rule.max === "number";
  var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var val = value;
  var key = null;
  var num = typeof value === "number";
  var str = typeof value === "string";
  var arr = Array.isArray(value);
  if (num) {
    key = "number";
  } else if (str) {
    key = "string";
  } else if (arr) {
    key = "array";
  }
  if (!key) {
    return false;
  }
  if (arr) {
    val = value.length;
  }
  if (str) {
    val = value.replace(spRegexp, "_").length;
  }
  if (len) {
    if (val !== rule.len) {
      errors.push(format(options.messages[key].len, rule.fullField, rule.len));
    }
  } else if (min2 && !max2 && val < rule.min) {
    errors.push(format(options.messages[key].min, rule.fullField, rule.min));
  } else if (max2 && !min2 && val > rule.max) {
    errors.push(format(options.messages[key].max, rule.fullField, rule.max));
  } else if (min2 && max2 && (val < rule.min || val > rule.max)) {
    errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
  }
};
var ENUM$1 = "enum";
var enumerable$1 = function enumerable(rule, value, source, errors, options) {
  rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
  if (rule[ENUM$1].indexOf(value) === -1) {
    errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
  }
};
var pattern$1 = function pattern(rule, value, source, errors, options) {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(value)) {
        errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    } else if (typeof rule.pattern === "string") {
      var _pattern = new RegExp(rule.pattern);
      if (!_pattern.test(value)) {
        errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    }
  }
};
var rules = {
  required: required$1,
  whitespace,
  type: type$1,
  range,
  "enum": enumerable$1,
  pattern: pattern$1
};
var string = function string2(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value, "string") && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options, "string");
    if (!isEmptyValue(value, "string")) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
      rules.pattern(rule, value, source, errors, options);
      if (rule.whitespace === true) {
        rules.whitespace(rule, value, source, errors, options);
      }
    }
  }
  callback(errors);
};
var method2 = function method3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var number22 = function number3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (value === "") {
      value = void 0;
    }
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var _boolean = function _boolean2(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var regexp2 = function regexp3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value)) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var integer2 = function integer3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var floatFn = function floatFn2(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var array2 = function array3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((value === void 0 || value === null) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options, "array");
    if (value !== void 0 && value !== null) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var object2 = function object3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var ENUM = "enum";
var enumerable2 = function enumerable3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules[ENUM](rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var pattern2 = function pattern3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value, "string") && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value, "string")) {
      rules.pattern(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var date2 = function date3(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value, "date") && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value, "date")) {
      var dateObject;
      if (value instanceof Date) {
        dateObject = value;
      } else {
        dateObject = new Date(value);
      }
      rules.type(rule, dateObject, source, errors, options);
      if (dateObject) {
        rules.range(rule, dateObject.getTime(), source, errors, options);
      }
    }
  }
  callback(errors);
};
var required2 = function required3(rule, value, callback, source, options) {
  var errors = [];
  var type4 = Array.isArray(value) ? "array" : typeof value;
  rules.required(rule, value, source, errors, options, type4);
  callback(errors);
};
var type2 = function type3(rule, value, callback, source, options) {
  var ruleType = rule.type;
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value, ruleType) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options, ruleType);
    if (!isEmptyValue(value, ruleType)) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
};
var any = function any2(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
  }
  callback(errors);
};
var validators = {
  string,
  method: method2,
  number: number22,
  "boolean": _boolean,
  regexp: regexp2,
  integer: integer2,
  "float": floatFn,
  array: array2,
  object: object2,
  "enum": enumerable2,
  pattern: pattern2,
  date: date2,
  url: type2,
  hex: type2,
  email: type2,
  required: required2,
  any
};
function newMessages() {
  return {
    "default": "Validation error on field %s",
    required: "%s is required",
    "enum": "%s must be one of %s",
    whitespace: "%s cannot be empty",
    date: {
      format: "%s date %s is invalid for format %s",
      parse: "%s date could not be parsed, %s is invalid ",
      invalid: "%s date %s is invalid"
    },
    types: {
      string: "%s is not a %s",
      method: "%s is not a %s (function)",
      array: "%s is not an %s",
      object: "%s is not an %s",
      number: "%s is not a %s",
      date: "%s is not a %s",
      "boolean": "%s is not a %s",
      integer: "%s is not an %s",
      "float": "%s is not a %s",
      regexp: "%s is not a valid %s",
      email: "%s is not a valid %s",
      url: "%s is not a valid %s",
      hex: "%s is not a valid %s"
    },
    string: {
      len: "%s must be exactly %s characters",
      min: "%s must be at least %s characters",
      max: "%s cannot be longer than %s characters",
      range: "%s must be between %s and %s characters"
    },
    number: {
      len: "%s must equal %s",
      min: "%s cannot be less than %s",
      max: "%s cannot be greater than %s",
      range: "%s must be between %s and %s"
    },
    array: {
      len: "%s must be exactly %s in length",
      min: "%s cannot be less than %s in length",
      max: "%s cannot be greater than %s in length",
      range: "%s must be between %s and %s in length"
    },
    pattern: {
      mismatch: "%s value %s does not match pattern %s"
    },
    clone: function clone2() {
      var cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}
var messages = newMessages();
var Schema = /* @__PURE__ */ function() {
  function Schema2(descriptor) {
    this.rules = null;
    this._messages = messages;
    this.define(descriptor);
  }
  var _proto = Schema2.prototype;
  _proto.define = function define(rules2) {
    var _this = this;
    if (!rules2) {
      throw new Error("Cannot configure a schema with no rules");
    }
    if (typeof rules2 !== "object" || Array.isArray(rules2)) {
      throw new Error("Rules must be an object");
    }
    this.rules = {};
    Object.keys(rules2).forEach(function(name) {
      var item = rules2[name];
      _this.rules[name] = Array.isArray(item) ? item : [item];
    });
  };
  _proto.messages = function messages2(_messages) {
    if (_messages) {
      this._messages = deepMerge(newMessages(), _messages);
    }
    return this._messages;
  };
  _proto.validate = function validate(source_, o2, oc) {
    var _this2 = this;
    if (o2 === void 0) {
      o2 = {};
    }
    if (oc === void 0) {
      oc = function oc2() {
      };
    }
    var source = source_;
    var options = o2;
    var callback = oc;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback) {
        callback(null, source);
      }
      return Promise.resolve(source);
    }
    function complete(results) {
      var errors = [];
      var fields = {};
      function add(e2) {
        if (Array.isArray(e2)) {
          var _errors;
          errors = (_errors = errors).concat.apply(_errors, e2);
        } else {
          errors.push(e2);
        }
      }
      for (var i2 = 0; i2 < results.length; i2++) {
        add(results[i2]);
      }
      if (!errors.length) {
        callback(null, source);
      } else {
        fields = convertFieldsError(errors);
        callback(errors, fields);
      }
    }
    if (options.messages) {
      var messages$1 = this.messages();
      if (messages$1 === messages) {
        messages$1 = newMessages();
      }
      deepMerge(messages$1, options.messages);
      options.messages = messages$1;
    } else {
      options.messages = this.messages();
    }
    var series = {};
    var keys2 = options.keys || Object.keys(this.rules);
    keys2.forEach(function(z2) {
      var arr = _this2.rules[z2];
      var value = source[z2];
      arr.forEach(function(r2) {
        var rule = r2;
        if (typeof rule.transform === "function") {
          if (source === source_) {
            source = _extends({}, source);
          }
          value = source[z2] = rule.transform(value);
        }
        if (typeof rule === "function") {
          rule = {
            validator: rule
          };
        } else {
          rule = _extends({}, rule);
        }
        rule.validator = _this2.getValidationMethod(rule);
        if (!rule.validator) {
          return;
        }
        rule.field = z2;
        rule.fullField = rule.fullField || z2;
        rule.type = _this2.getType(rule);
        series[z2] = series[z2] || [];
        series[z2].push({
          rule,
          value,
          source,
          field: z2
        });
      });
    });
    var errorFields = {};
    return asyncMap(series, options, function(data, doIt) {
      var rule = data.rule;
      var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
      deep = deep && (rule.required || !rule.required && data.value);
      rule.field = data.field;
      function addFullField(key, schema) {
        return _extends({}, schema, {
          fullField: rule.fullField + "." + key,
          fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
        });
      }
      function cb(e2) {
        if (e2 === void 0) {
          e2 = [];
        }
        var errorList = Array.isArray(e2) ? e2 : [e2];
        if (!options.suppressWarning && errorList.length) {
          Schema2.warning("async-validator:", errorList);
        }
        if (errorList.length && rule.message !== void 0) {
          errorList = [].concat(rule.message);
        }
        var filledErrors = errorList.map(complementError(rule, source));
        if (options.first && filledErrors.length) {
          errorFields[rule.field] = 1;
          return doIt(filledErrors);
        }
        if (!deep) {
          doIt(filledErrors);
        } else {
          if (rule.required && !data.value) {
            if (rule.message !== void 0) {
              filledErrors = [].concat(rule.message).map(complementError(rule, source));
            } else if (options.error) {
              filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
            }
            return doIt(filledErrors);
          }
          var fieldsSchema = {};
          if (rule.defaultField) {
            Object.keys(data.value).map(function(key) {
              fieldsSchema[key] = rule.defaultField;
            });
          }
          fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
          var paredFieldsSchema = {};
          Object.keys(fieldsSchema).forEach(function(field) {
            var fieldSchema = fieldsSchema[field];
            var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
            paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
          });
          var schema = new Schema2(paredFieldsSchema);
          schema.messages(options.messages);
          if (data.rule.options) {
            data.rule.options.messages = options.messages;
            data.rule.options.error = options.error;
          }
          schema.validate(data.value, data.rule.options || options, function(errs) {
            var finalErrors = [];
            if (filledErrors && filledErrors.length) {
              finalErrors.push.apply(finalErrors, filledErrors);
            }
            if (errs && errs.length) {
              finalErrors.push.apply(finalErrors, errs);
            }
            doIt(finalErrors.length ? finalErrors : null);
          });
        }
      }
      var res;
      if (rule.asyncValidator) {
        res = rule.asyncValidator(rule, data.value, cb, data.source, options);
      } else if (rule.validator) {
        try {
          res = rule.validator(rule, data.value, cb, data.source, options);
        } catch (error) {
          console.error == null ? void 0 : console.error(error);
          if (!options.suppressValidatorError) {
            setTimeout(function() {
              throw error;
            }, 0);
          }
          cb(error.message);
        }
        if (res === true) {
          cb();
        } else if (res === false) {
          cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
        } else if (res instanceof Array) {
          cb(res);
        } else if (res instanceof Error) {
          cb(res.message);
        }
      }
      if (res && res.then) {
        res.then(function() {
          return cb();
        }, function(e2) {
          return cb(e2);
        });
      }
    }, function(results) {
      complete(results);
    }, source);
  };
  _proto.getType = function getType(rule) {
    if (rule.type === void 0 && rule.pattern instanceof RegExp) {
      rule.type = "pattern";
    }
    if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
      throw new Error(format("Unknown rule type %s", rule.type));
    }
    return rule.type || "string";
  };
  _proto.getValidationMethod = function getValidationMethod(rule) {
    if (typeof rule.validator === "function") {
      return rule.validator;
    }
    var keys2 = Object.keys(rule);
    var messageIndex = keys2.indexOf("message");
    if (messageIndex !== -1) {
      keys2.splice(messageIndex, 1);
    }
    if (keys2.length === 1 && keys2[0] === "required") {
      return validators.required;
    }
    return validators[this.getType(rule)] || void 0;
  };
  return Schema2;
}();
Schema.register = function register(type4, validator) {
  if (typeof validator !== "function") {
    throw new Error("Cannot register a validator by type, validator is not a function");
  }
  validators[type4] = validator;
};
Schema.warning = warning;
Schema.messages = messages;
Schema.validators = validators;
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === "number" && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i2 = 0; i2 < newInputs.length; i2++) {
    if (!isEqual(newInputs[i2], lastInputs[i2])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var cache2 = null;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (cache2 && cache2.lastThis === this && isEqual2(newArgs, cache2.lastArgs)) {
      return cache2.lastResult;
    }
    var lastResult = resultFn.apply(this, newArgs);
    cache2 = {
      lastResult,
      lastArgs: newArgs,
      lastThis: this
    };
    return lastResult;
  }
  memoized.clear = function clear() {
    cache2 = null;
  };
  return memoized;
}
var v = false, o, f, s, u, d, N, l, p, m, w, D, x, E, M, F;
function a() {
  if (!v) {
    v = true;
    var e2 = navigator.userAgent, n2 = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e2), i2 = /(Mac OS X)|(Windows)|(Linux)/.exec(e2);
    if (x = /\b(iPhone|iP[ao]d)/.exec(e2), E = /\b(iP[ao]d)/.exec(e2), w = /Android/i.exec(e2), M = /FBAN\/\w+;/i.exec(e2), F = /Mobile/i.exec(e2), D = !!/Win64/.exec(e2), n2) {
      o = n2[1] ? parseFloat(n2[1]) : n2[5] ? parseFloat(n2[5]) : NaN, o && document && document.documentMode && (o = document.documentMode);
      var r2 = /(?:Trident\/(\d+.\d+))/.exec(e2);
      N = r2 ? parseFloat(r2[1]) + 4 : o, f = n2[2] ? parseFloat(n2[2]) : NaN, s = n2[3] ? parseFloat(n2[3]) : NaN, u = n2[4] ? parseFloat(n2[4]) : NaN, u ? (n2 = /(?:Chrome\/(\d+\.\d+))/.exec(e2), d = n2 && n2[1] ? parseFloat(n2[1]) : NaN) : d = NaN;
    } else o = f = s = d = u = NaN;
    if (i2) {
      if (i2[1]) {
        var t2 = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e2);
        l = t2 ? parseFloat(t2[1].replace("_", ".")) : true;
      } else l = false;
      p = !!i2[2], m = !!i2[3];
    } else l = p = m = false;
  }
}
var _ = { ie: function() {
  return a() || o;
}, ieCompatibilityMode: function() {
  return a() || N > o;
}, ie64: function() {
  return _.ie() && D;
}, firefox: function() {
  return a() || f;
}, opera: function() {
  return a() || s;
}, webkit: function() {
  return a() || u;
}, safari: function() {
  return _.webkit();
}, chrome: function() {
  return a() || d;
}, windows: function() {
  return a() || p;
}, osx: function() {
  return a() || l;
}, linux: function() {
  return a() || m;
}, iphone: function() {
  return a() || x;
}, mobile: function() {
  return a() || x || E || w || F;
}, nativeApp: function() {
  return a() || M;
}, android: function() {
  return a() || w;
}, ipad: function() {
  return a() || E;
} }, A = _;
var c = !!(typeof window < "u" && window.document && window.document.createElement), U = { canUseDOM: c }, h = U;
var X;
h.canUseDOM && (X = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true);
function S(e2, n2) {
  if (!h.canUseDOM || n2 && !("addEventListener" in document)) return false;
  var i2 = "on" + e2, r2 = i2 in document;
  if (!r2) {
    var t2 = document.createElement("div");
    t2.setAttribute(i2, "return;"), r2 = typeof t2[i2] == "function";
  }
  return !r2 && X && e2 === "wheel" && (r2 = document.implementation.hasFeature("Events.wheel", "3.0")), r2;
}
var b = S;
var O = 10, I = 40, P = 800;
function T(e2) {
  var n2 = 0, i2 = 0, r2 = 0, t2 = 0;
  return "detail" in e2 && (i2 = e2.detail), "wheelDelta" in e2 && (i2 = -e2.wheelDelta / 120), "wheelDeltaY" in e2 && (i2 = -e2.wheelDeltaY / 120), "wheelDeltaX" in e2 && (n2 = -e2.wheelDeltaX / 120), "axis" in e2 && e2.axis === e2.HORIZONTAL_AXIS && (n2 = i2, i2 = 0), r2 = n2 * O, t2 = i2 * O, "deltaY" in e2 && (t2 = e2.deltaY), "deltaX" in e2 && (r2 = e2.deltaX), (r2 || t2) && e2.deltaMode && (e2.deltaMode == 1 ? (r2 *= I, t2 *= I) : (r2 *= P, t2 *= P)), r2 && !n2 && (n2 = r2 < 1 ? -1 : 1), t2 && !i2 && (i2 = t2 < 1 ? -1 : 1), { spinX: n2, spinY: i2, pixelX: r2, pixelY: t2 };
}
T.getEventType = function() {
  return A.firefox() ? "DOMMouseScroll" : b("wheel") ? "wheel" : "mousewheel";
};
var Y = T;
/**
* Checks if an event is supported in the current execution environment.
*
* NOTE: This will not work correctly for non-generic events such as `change`,
* `reset`, `load`, `error`, and `select`.
*
* Borrows from Modernizr.
*
* @param {string} eventNameSuffix Event name, e.g. "click".
* @param {?boolean} capture Check if the capture phase is supported.
* @return {boolean} True if the event is supported.
* @internal
* @license Modernizr 3.0.0pre (Custom Build) | MIT
*/
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v2) => ({
  x: v2,
  y: v2
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt2 = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt2;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x: x2,
    y: y2,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y2,
    left: x2,
    right: x2 + width,
    bottom: y2 + height,
    x: x2,
    y: y2
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x: x2,
    y: y2
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i2 = 0; i2 < validMiddleware.length; i2++) {
    const {
      name,
      fn: fn2
    } = validMiddleware[i2];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn2({
      x: x2,
      y: y2,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x2 = nextX != null ? nextX : x2;
    y2 = nextY != null ? nextY : y2;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x: x2,
          y: y2
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i2 = -1;
    }
  }
  return {
    x: x2,
    y: y2,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow$1(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x: x2,
    y: y2,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x: x2,
    y: y2,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$1 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x: x2,
      y: y2,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x: x2,
      y: y2
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow$1(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d2) => d2.overflows[0] <= 0).sort((a2, b2) => a2.overflows[1] - b2.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d2) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d2.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d2) => [d2.placement, d2.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b2) => a2[1] - b2[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x: x2,
        y: y2,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x2 + diffCoords.x,
        y: y2 + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x: x2,
        y: y2,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x3,
              y: y3
            } = _ref;
            return {
              x: x3,
              y: y3
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x: x2,
        y: y2
      };
      const overflow = await detectOverflow$1(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x2,
          y: limitedCoords.y - y2,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e2) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $2
  } = getCssDimensions(domElement);
  let x2 = ($2 ? round(rect.width) : rect.width) / width;
  let y2 = ($2 ? round(rect.height) : rect.height) / height;
  if (!x2 || !Number.isFinite(x2)) {
    x2 = 1;
  }
  if (!y2 || !Number.isFinite(y2)) {
    y2 = 1;
  }
  return {
    x: x2,
    y: y2
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x2 = (clientRect.left + visualOffsets.x) / scale.x;
  let y2 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x2 *= iframeScale.x;
      y2 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x2 += left;
      y2 += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x2,
    y: y2
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x2 = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y2 = htmlRect.top + scroll.scrollTop;
  return {
    x: x2,
    y: y2
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y2 = -scroll.scrollTop;
  if (getComputedStyle(body).direction === "rtl") {
    x2 += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x2 = 0;
  let y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x2 = left * scale.x;
  const y2 = top * scale.y;
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache2) {
  const cachedResult = cache2.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache2.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y2 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x: x2,
    y: y2,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a2, b2) {
  return a2.x === b2.x && a2.y === b2.y && a2.width === b2.width && a2.height === b2.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root2 = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root2.clientWidth - (left + width));
    const insetBottom = floor(root2.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root2.ownerDocument
      });
    } catch (e2) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const detectOverflow = detectOverflow$1;
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const arrow = arrow$1;
const computePosition = (reference, floating, options) => {
  const cache2 = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache2
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
export {
  createCompileError as $,
  memoize as A,
  memoizeOne as B,
  isNull as C,
  merge as D,
  Ee as E,
  flatMap as F,
  arrow as G,
  computePosition as H,
  offset as I,
  flip as J,
  shift as K,
  autoUpdate as L,
  detectOverflow as M,
  omit as N,
  isBoolean$1 as O,
  makeSymbol as P,
  isPlainObject$2 as Q,
  isString$1 as R,
  Schema as S,
  TinyColor as T,
  DEFAULT_LOCALE as U,
  isArray$2 as V,
  isRegExp as W,
  isFunction$2 as X,
  Y,
  updateFallbackLocale as Z,
  inBrowser as _,
  isUndefined as a,
  assign as a0,
  isNumber$1 as a1,
  create as a2,
  deepCopy as a3,
  hasOwn as a4,
  createCoreContext as a5,
  isObject$2 as a6,
  clearDateTimeFormat as a7,
  clearNumberFormat as a8,
  setAdditionalMeta as a9,
  getFallbackContext as aa,
  NOT_REOSLVED as ab,
  fallbackWithLocaleChain as ac,
  setFallbackContext as ad,
  CORE_ERROR_CODES_EXTEND_POINT as ae,
  parseTranslateArgs as af,
  translate as ag,
  MISSING_RESOLVE_VALUE as ah,
  parseDateTimeArgs as ai,
  datetime as aj,
  parseNumberArgs as ak,
  number as al,
  isMessageAST as am,
  isMessageFunction as an,
  NUMBER_FORMAT_OPTIONS_KEYS as ao,
  DATETIME_FORMAT_OPTIONS_KEYS as ap,
  isEmptyObject$1 as aq,
  registerMessageCompiler as ar,
  registerMessageResolver as as,
  registerLocaleFallbacker as at,
  getGlobalThis as au,
  setDevToolsHook as av,
  compile as aw,
  resolveValue as ax,
  OverlayScrollbars as ay,
  dayjs as b,
  isEqual$1 as c,
  debounce as d,
  flattenDeep as e,
  fromPairs as f,
  get as g,
  cloneDeep as h,
  isNil as i,
  castArray as j,
  customParseFormat as k,
  localeData as l,
  flatten as m,
  advancedFormat as n,
  weekYear as o,
  pick as p,
  dayOfYear as q,
  isSameOrAfter as r,
  set as s,
  throttle as t,
  union as u,
  isSameOrBefore as v,
  weekOfYear as w,
  clone as x,
  yn as y,
  findLastIndex as z
};
