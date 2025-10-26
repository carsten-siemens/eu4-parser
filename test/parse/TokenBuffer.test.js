import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { TokenBuffer } from '../../src/parse/TokenBuffer.js';
import { ValueToken } from '../../src/tokenize/token/ValueToken.js';

function createTokenBuffer(numberOfTokens){
  let tokens = [];
  for(let i= 0; i < numberOfTokens; i++){
    tokens.push(new ValueToken(i));
  }

  return new TokenBuffer(tokens);
}

createSuite(import.meta.url, tokenBufferSuite);
export function tokenBufferSuite() {
  describe("TokenBuffer", () => {

    it('hasToken() works before token consumption', () => {
      assert.deepStrictEqual(new TokenBuffer([]).hasTokens(), false);
      assert.deepStrictEqual(new TokenBuffer([new ValueToken("abc")]).hasTokens(), true);
    });

    it('hasToken() works during token consumption', () => {
      let tb = createTokenBuffer(5);

      for(let i=tb.tokens.length; i > 0; i--){
        assert.deepStrictEqual(tb.hasTokens(), true);
        tb.consumeToken();
      }

      assert.deepStrictEqual(tb.hasTokens(), false);
    });


    it('peakChar() works on empty token buffer', () => {
      let tb = new TokenBuffer([]);
      assert.deepStrictEqual(tb.peekToken(), null);
      assert.deepStrictEqual(tb.i, 0);
    });

    it('peakChar() works on non-empty token buffer', () => {
      let tb = createTokenBuffer(3);
      for(let i=0; i < tb.tokens.length; i++){
        assert.deepStrictEqual(tb.peekToken().getObject(), i);
        assert.deepStrictEqual(tb.peekToken().getObject(), i);
        assert.deepStrictEqual(tb.consumeToken().getObject(), i);
      }
    });

    it('consumeChar() works on empty token buffer', () => {
      let tb = new TokenBuffer([]);
      assert.deepStrictEqual(tb.consumeToken(), null);
      assert.deepStrictEqual(tb.i, 0);
    });

    it('consumeChar() works on non-empty token buffer', () => {
      let tb = createTokenBuffer(3);
      for(let i=0; i < tb.tokens.length; i++){
        assert.deepStrictEqual(tb.consumeToken().getObject(), i);
      }
    });

  });
}