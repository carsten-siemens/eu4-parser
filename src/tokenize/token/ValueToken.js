import { TokenType } from "../consts/TokenType.js";
import { AbstractToken } from "./AbstractToken.js";

export class ValueToken extends AbstractToken {
  constructor(value, position) {
    super(TokenType.VALUE, position);
    this.value = value;
  }

  toString() {
    return this.value;
  }

  getObject() {
    // Remove double-quotes from string
    if (/^".*"$/.test(this.value)) {
      return this.value.slice(1, -1);
    }

    // Number
    if (/^-?(?:\d+|\d+\.\d+)$/.test(this.value)) {
      return Number(this.value);
    }

    // Default: unchanged string
    return this.value;
  }
}