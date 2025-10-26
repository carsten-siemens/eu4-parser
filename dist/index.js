// src/parse/ParserManager.js
import AdmZip from "adm-zip";
import fs2 from "fs";

// src/tokenize/consts/TokenType.js
var TokenType = class {
};
TokenType.SEPARATOR = 0;
TokenType.BLOCK_START = 1;
TokenType.BLOCK_END = 2;
TokenType.VALUE = 3;

// src/tokenize/token/AbstractToken.js
var AbstractToken = class {
  constructor(tokenType, position) {
    this.tokenType = tokenType;
    this.position = position;
  }
  getTokenType() {
    return this.tokenType;
  }
  getObject() {
    throw `to be implemented by subclass`;
  }
  isValueToken() {
    return this.getTokenType() == TokenType.VALUE;
  }
  isBlockStartToken() {
    return this.getTokenType() == TokenType.BLOCK_START;
  }
  isBlockEndToken() {
    return this.getTokenType() == TokenType.BLOCK_END;
  }
  isSeparatorToken() {
    return this.getTokenType() == TokenType.SEPARATOR;
  }
};

// src/tokenize/token/BlockEndToken.js
var BlockEndToken = class extends AbstractToken {
  constructor(position) {
    super(TokenType.BLOCK_END, position);
  }
  toString() {
    return "}";
  }
  getObject() {
    return "}";
  }
};

// src/tokenize/token/BlockStartToken.js
var BlockStartToken = class extends AbstractToken {
  constructor(position) {
    super(TokenType.BLOCK_START, position);
  }
  toString() {
    return "{";
  }
  getObject() {
    return "{";
  }
};

// src/tokenize/token/SeparatorToken.js
var SeparatorToken = class extends AbstractToken {
  constructor(position) {
    super(TokenType.SEPARATOR, position);
  }
  toString() {
    return "=";
  }
  getObject() {
    return "=";
  }
};

// src/tokenize/token/ValueToken.js
var ValueToken = class extends AbstractToken {
  constructor(value, position) {
    super(TokenType.VALUE, position);
    this.value = value;
  }
  toString() {
    return this.value;
  }
  getObject() {
    if (/^".*"$/.test(this.value)) {
      return this.value.slice(1, -1);
    }
    if (/^-?(?:\d+|\d+\.\d+)$/.test(this.value)) {
      return Number(this.value);
    }
    return this.value;
  }
};

// src/tokenize/Position.js
var Position = class {
  constructor(line = 1, column = 1) {
    this.line = line;
    this.column = column;
  }
};

// src/tokenize/StringBuffer.js
var StringBuffer = class {
  constructor(s) {
    this.s = s;
    this.i = 0;
    this.line = 1;
    this.column = 1;
  }
  hasChars() {
    return this.i < this.s.length;
  }
  peekChar() {
    return this.hasChars() ? this.s[this.i] : null;
  }
  consumeChar() {
    if (!this.hasChars()) {
      return null;
    }
    let c = this.s[this.i++];
    if (c == "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return c;
  }
  getPosition() {
    return new Position(this.line, this.column);
  }
};

// src/tokenize/Tokenizer.js
var WHITESPACES = "	 \r\n";
var PUNCTUATORS = "={}";
var SPECIALS = WHITESPACES + PUNCTUATORS;
var Tokenizer = class {
  #indexContains(sb, chars) {
    return chars.indexOf(sb.peekChar()) >= 0;
  }
  #consumeWhitespace(sb) {
    while (sb.hasChars() && this.#indexContains(sb, WHITESPACES)) {
      sb.consumeChar();
    }
  }
  tokenize(input) {
    let sb = new StringBuffer(input);
    let tb = [];
    for (this.#consumeWhitespace(sb); sb.hasChars(); this.#consumeWhitespace(sb)) {
      let c = sb.consumeChar();
      let position = sb.getPosition();
      switch (c) {
        case '"': {
          let item2 = c;
          while (sb.hasChars()) {
            let currentChar = sb.consumeChar();
            item2 += currentChar;
            if (currentChar == '"') {
              break;
            }
          }
          tb.push(new ValueToken(item2, position));
          break;
        }
        case "{":
          tb.push(new BlockStartToken(position));
          break;
        case "}":
          tb.push(new BlockEndToken(position));
          break;
        case "=":
          tb.push(new SeparatorToken(position));
          break;
        default:
          let item = c;
          while (sb.hasChars()) {
            let nextChar = sb.peekChar();
            if (this.#indexContains(sb, SPECIALS)) {
              break;
            } else {
              item += sb.consumeChar();
            }
          }
          tb.push(new ValueToken(item, position));
      }
    }
    return tb;
  }
};

// src/utils/FileUtil.js
import fs from "fs";
var FileUtil = class _FileUtil {
  static guessFileType(filePath, encoding = "latin1") {
    let s = _FileUtil.#readFileStartAsString(filePath, 100, encoding);
    if (s.startsWith("PK")) {
      return "ZIP";
    }
    if (s.startsWith("EU4txt")) {
      return "EU4txt";
    }
    return "unknown";
  }
  static #readFileStartAsString(filePath, byteCount, encoding) {
    let fd = void 0;
    try {
      fd = fs.openSync(filePath, "r");
      const buffer = Buffer.alloc(byteCount);
      const bytesRead = fs.readSync(fd, buffer, 0, byteCount);
      return buffer.toString(encoding, 0, bytesRead);
    } finally {
      if (fd !== void 0)
        fs.closeSync(fd);
    }
  }
};

// src/parse/TokenBuffer.js
var TokenBuffer = class {
  constructor(tokens) {
    this.tokens = tokens;
    this.i = 0;
  }
  hasTokens() {
    return this.i < this.tokens.length;
  }
  peekToken(offset = 0) {
    let index = this.i + offset;
    return index < this.tokens.length ? this.tokens[index] : null;
  }
  consumeToken() {
    return this.hasTokens() ? this.tokens[this.i++] : null;
  }
};

// src/parse/Parser.js
var Parser = class {
  parse(tokens, o = {}) {
    let tb = new TokenBuffer(tokens);
    this.#checkFormatInfo(tb);
    this.#parseAny(tb, o, []);
    return o;
  }
  #checkFormatInfo(tb) {
    const expected = "EU4txt";
    let value = tb.consumeToken().getObject();
    if (value.toLowerCase() != expected.toLowerCase()) {
      throw `ERROR: File starts with "${value}" instead of "${expected}"`;
    }
  }
  #parseAny(tb, o, breadcrumb) {
    let keyToken = null;
    while ((keyToken = tb.consumeToken()) && !keyToken.isBlockEndToken()) {
      if (!keyToken.isValueToken()) {
        if (keyToken.isBlockStartToken() && tb.peekToken().isBlockEndToken) {
          tb.consumeToken();
          continue;
        }
        throw `Error: Value token expected`;
      }
      let separatorToken = tb.consumeToken();
      let rightToken = null;
      if (separatorToken.isBlockStartToken()) {
        rightToken = separatorToken;
      } else {
        if (!separatorToken.isSeparatorToken()) {
          throw `Erorr: Separator token expected`;
        }
        rightToken = tb.consumeToken();
        if (!rightToken) {
          throw `Erorr: Unexpected end-of-token`;
        }
      }
      let key = keyToken.getObject();
      let value = this.#parseAnyRightHandside(tb, rightToken, `breadcrumb / ${key}`);
      if (value == null) {
        throw `ERROR: unable to parse token: "${rightToken}"`;
      }
      o[key] = value;
    }
    return o;
  }
  #parseAnyRightHandside(tb, rightToken, breadcrumb) {
    let value = null;
    if ((value = this.#tryParseAttribute(tb, rightToken, breadcrumb)) != null) {
      return value;
    }
    if (value = this.#tryParseComplexType(tb, rightToken, breadcrumb)) {
      return value;
    }
    if (value = this.#tryParseArray(tb, rightToken, breadcrumb)) {
      return value;
    }
    return value;
  }
  #tryParseAttribute(tb, rightToken, breadcrumb) {
    return rightToken.isValueToken() ? rightToken.getObject() : null;
  }
  #tryParseComplexType(tb, rightToken, breadcrumb) {
    let isCompplexType = rightToken.isBlockStartToken() && tb.peekToken().isValueToken() && tb.peekToken(1).isSeparatorToken();
    let result = isCompplexType ? this.#parseAny(tb, {}, breadcrumb) : null;
    return result;
  }
  #tryParseArray(tb, rightToken, breadcrumb) {
    let peek1 = tb.peekToken(1);
    if (!rightToken.isBlockStartToken() || peek1.isSeparatorToken()) {
      return null;
    }
    let arr = [];
    let item = null;
    while ((item = tb.consumeToken()) && !item.isBlockEndToken()) {
      let value = this.#parseAnyRightHandside(tb, item, `${breadcrumb} / []`);
      arr.push(value);
    }
    return arr;
  }
};

// src/parse/ParserManager.js
var ParserManager = class {
  parseFile(filePath, encoding = "latin1") {
    let fileType = FileUtil.guessFileType(filePath);
    switch (fileType) {
      case "EU4txt":
        return this.#parseTxtFile(filePath, encoding);
      case "ZIP":
        return this.#parseZipFile(filePath, encoding);
      default:
        throw `ERROR: "${filePath}" is not an - zipped or unzipped - EU4 file`;
    }
  }
  #parseZipFile(filePath, encoding) {
    let o = {};
    const zipEntries = new AdmZip(filePath).getEntries();
    for (const zipEntry of zipEntries) {
      let s = zipEntry.getData().toString(encoding);
      this.#parseString(s, o);
    }
    return o;
  }
  #parseTxtFile(filePath, encoding) {
    let o = {};
    let s = fs2.readFileSync(filePath, { encoding });
    this.#parseString(s, o);
    return o;
  }
  #parseString(s, o = {}) {
    let tokens = new Tokenizer().tokenize(s);
    new Parser().parse(tokens, o);
    return o;
  }
};

// src/index.js
function parseEu4Savegame(filePath, encoding = "latin1") {
  return new ParserManager().parseFile(filePath, encoding);
}
export {
  parseEu4Savegame
};
