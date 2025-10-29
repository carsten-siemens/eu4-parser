import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { TokenBuffer } from '../../src/parse/TokenBuffer.js';
import { ValueToken } from '../../src/tokenize/token/ValueToken.js';

function createTokenBuffer(numberOfTokens){
  let tb = new TokenBuffer();
  for(let i= 0; i < numberOfTokens; i++){
    tb.push(new ValueToken(i));
  }

  return tb;
}

createSuite(import.meta.url, tokenBufferSuite);
export function tokenBufferSuite() {
  describe("TokenBuffer", () => {

    it('hasToken() works before token consumption', () => {
      assert.deepStrictEqual(createTokenBuffer(0).hasTokens(), false);
      assert.deepStrictEqual(createTokenBuffer(1).hasTokens(), true);
      assert.deepStrictEqual(createTokenBuffer(2).hasTokens(), true);
    });

    it('hasToken() works during token consumption', () => {
      let len = 5;
      let tb = createTokenBuffer(len);

      for(let i=0; i < len; i++){
        assert.deepStrictEqual(tb.hasTokens(), true);
        tb.consumeToken();
      }

      assert.deepStrictEqual(tb.hasTokens(), false);
    });


    it('peakToken() works on empty token buffer', () => {
      let tb = createTokenBuffer(0);
      assert.deepStrictEqual(tb.peekToken(), null);
      assert.deepStrictEqual(tb.peekToken(), null);
    });

    it('peakToken() works on non-empty token buffer', () => {
      let len = 3;
      let tb = createTokenBuffer(len);
      for(let i=0; i < len; i++){
        assert.deepStrictEqual(tb.peekToken().getObject(), i);
        assert.deepStrictEqual(tb.peekToken().getObject(), i);
        assert.deepStrictEqual(tb.consumeToken().getObject(), i);
      }
    });

    it('consumeToken() works on empty token buffer', () => {
      let tb = createTokenBuffer(0);
      assert.deepStrictEqual(tb.consumeToken(), null);
      assert.deepStrictEqual(tb.consumeToken(), null);
    });

    it('consumeToken() works on non-empty token buffer', () => {
      let len = 3;
      let tb = createTokenBuffer(len);
      for(let i=0; i < len; i++){
        assert.deepStrictEqual(tb.consumeToken().getObject(), i);
      }
    });

  });
}