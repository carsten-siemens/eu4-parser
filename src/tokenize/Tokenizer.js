import { BlockEndToken } from "./token/BlockEndToken.js";
import { BlockStartToken } from "./token/BlockStartToken.js";
import { SeparatorToken } from "./token/SeparatorToken.js";
import { ValueToken } from "./token/ValueToken.js";
import { StringBuffer } from "./StringBuffer.js";
import { TokenBuffer } from "../parse/TokenBuffer.js";

const WHITESPACES = "\t \r\n";
const PUNCTUATORS = "={}";
const SPECIALS = WHITESPACES + PUNCTUATORS;

export class Tokenizer {

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
    let tb = new TokenBuffer()

    for (this.#consumeWhitespace(sb); sb.hasChars(); this.#consumeWhitespace(sb)) {
      let c = sb.consumeChar();
      let position = sb.getPosition();

      switch (c) {
        case '"': {
          let item = c;
          while (sb.hasChars()) {
            let currentChar = sb.consumeChar();
            item += currentChar
            if (currentChar == '"') {
              break;
            }
          }
          tb.push(new ValueToken(item, position));
          break;
        }

        case '{':
          tb.push(new BlockStartToken(position));
          break;

        case '}':
          tb.push(new BlockEndToken(position));
          break;

        case '=':
          tb.push(new SeparatorToken(position));
          break;

        default:
          let item = c;
          while (sb.hasChars()) {
            let nextChar = sb.peekChar();
            if (this.#indexContains(sb, SPECIALS)) {
              // don't consume - belongs to next token
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
}
