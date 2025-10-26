export class TokenBuffer {
  constructor(tokens) {
    this.tokens = tokens;
    this.i = 0;
  }

  hasTokens() {
    return this.i < this.tokens.length;
  }

  peekToken(offset = 0) {
    let index = this.i + offset;
    return index < this.tokens.length
      ? this.tokens[index]
      : null;
  }

  consumeToken() {
    return this.hasTokens()
      ? this.tokens[this.i++]
      : null;
  }
}