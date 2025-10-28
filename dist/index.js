// src/parse/ParserManager.js
import fs2 from "fs";

// node_modules/fflate/esm/index.mjs
import { createRequire } from "module";
var require2 = createRequire("/");
var Worker;
try {
  Worker = require2("worker_threads").Worker;
} catch (e) {
}
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
  var _a2 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
var z64e = function(d, b) {
  for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
    ;
  return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = o == 4294967295 || c == 65535;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

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
  getPosition() {
    return this.position;
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
  toString() {
    return `(${this.line}, ${this.column})`;
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
    let fd2 = void 0;
    try {
      fd2 = fs.openSync(filePath, "r");
      const buffer = Buffer.alloc(byteCount);
      const bytesRead = fs.readSync(fd2, buffer, 0, byteCount);
      return buffer.toString(encoding, 0, bytesRead);
    } finally {
      if (fd2 !== void 0)
        fs.closeSync(fd2);
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
    let token = tb.consumeToken();
    let value = token.getObject();
    if (value.toLowerCase() != expected.toLowerCase()) {
      throw `ERROR: ${token.getPosition().toString()} File starts with "${value}" instead of "${expected}"`;
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
        throw `Error: ${keyToken.getPosition().toString()} Value token expected`;
      }
      let separatorToken = tb.consumeToken();
      let rightToken = null;
      if (separatorToken.isBlockStartToken()) {
        rightToken = separatorToken;
      } else {
        if (!separatorToken.isSeparatorToken()) {
          throw `Erorr: ${separatorToken.getPosition().toString()} Separator token expected`;
        }
        rightToken = tb.consumeToken();
        if (!rightToken) {
          throw `Erorr: Unexpected end-of-token`;
        }
      }
      let key = keyToken.getObject();
      let value = this.#parseAnyRightHandside(tb, rightToken, `breadcrumb / ${key}`);
      if (value == null) {
        throw `ERROR: ${keyToken.getPosition().toString()} unable to parse token: "${rightToken}"`;
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
    let peek = tb.peekToken();
    let peek1 = tb.peekToken(1);
    if (!rightToken.isBlockStartToken() || peek1?.isSeparatorToken() || peek?.isSeparatorToken()) {
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
    const zipBuffer = fs2.readFileSync(filePath);
    const zipData = unzipSync(new Uint8Array(zipBuffer));
    for (const filename of Object.keys(zipData)) {
      const file = zipData[filename];
      let s = strFromU8(file, encoding);
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
/*!
 * Parse a - zip or plain text - Europa Universali (EU4) save game file
 * into a nested JavaScript object.
 * 
 * @param {*} filePath path to the zipped - or unzpped - save game file  
 * @param {*} encoding optional: encoding of either 
 *    (a) the text files with in the zip archive or
 *    (b) the plain text save game file
 * EU4 always uses the encoding latin1 (aka WINDOWS-1252). Therefor, this
 * opttional encoding parameter shoul be left out unless you have 
 * an encoding issue.
 */
function parseEu4Savegame(filePath, encoding = "latin1") {
  return new ParserManager().parseFile(filePath, encoding);
}
export {
  parseEu4Savegame
};
