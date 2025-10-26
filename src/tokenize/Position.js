export class Position {
  constructor(line=1, column=1) {
    this.line = line;
    this.column = column;
  }
  
  toString() {
    return `(${this.line}, ${this.column})`;
  }
}