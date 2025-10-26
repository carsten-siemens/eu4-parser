import { TokenType } from "../consts/TokenType.js";
import { AbstractToken } from "./AbstractToken.js";

export class BlockEndToken extends AbstractToken {
  constructor(position) {
    super(TokenType.BLOCK_END, position);
  }

  toString() {
    return '}';
  }

  getObject(){
    return '}';
  }
}