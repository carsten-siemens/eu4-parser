import { TokenType } from "../consts/TokenType.js";
import { AbstractToken } from "./AbstractToken.js";

export class SeparatorToken extends AbstractToken {
  constructor(position) {
    super(TokenType.SEPARATOR, position);
  }

  toString() {
    return '=';
  }
  
  getObject(){
    return '=';
  }
}