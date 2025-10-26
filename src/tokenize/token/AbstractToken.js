import { TokenType } from "../consts/TokenType.js";

export class AbstractToken {
  constructor(tokenType, position) {
    this.tokenType = tokenType
    this.position = position;
  }

  getTokenType() {
    return this.tokenType;
  }  

  getObject(){
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
  
  getPosition(){
    return this.position;
  }
}