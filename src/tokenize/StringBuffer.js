import { Position } from "./Position.js";

export class StringBuffer {
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
    return this.hasChars()
      ? this.s[this.i]
      : null;
  }

  consumeChar() {
    if (!this.hasChars()) {
      return null;
    }

    let c = this.s[this.i++];
    if (c=='\n'){
      this.line++;
      this.column = 1;
    } else {
      // '\r\n' look like *one* char in an editor
      //if (c != '\r') {
        this.column++;
      //}
    }

    return c;
  }

  getPosition() {
    return new Position(this.line, this.column);
  }
}