import { TokenType } from "../consts/TokenType.js";
import { AbstractToken } from "./AbstractToken.js";

export class BlockStartToken extends AbstractToken {
  constructor(position) {
    super(TokenType.BLOCK_START, position);
  }

  toString() {
    return '{';
  }

  getObject(){
    return '{';
  }

}