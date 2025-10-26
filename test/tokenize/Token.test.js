import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { BlockEndToken } from '../../src/tokenize/token/BlockEndToken.js';
import { ValueToken } from '../../src/tokenize/token/ValueToken.js';
import { SeparatorToken } from '../../src/tokenize/token/SeparatorToken.js';
import { BlockStartToken } from '../../src/tokenize/token/BlockStartToken.js';
import { AbstractToken } from '../../src/tokenize/token/AbstractToken.js';
import { TokenType } from '../../src/tokenize/consts/TokenType.js';
import { Position } from '../../src/tokenize/Position.js';

function checkToken(token, expectedString, expectedObject){
  assert.deepStrictEqual(token.toString(), expectedString);
  assert.deepStrictEqual(token.getObject(), expectedObject);
}

createSuite(import.meta.url, tokenSuite);

export function tokenSuite() {
  describe('Token', () => {

    it('AbstractToken subclasses must implement getObject()', () => {
      try {
        new AbstractToken(TokenType.VALUE, new Position(1,1)).getObject();
        assert.fail("AbstractToken.getObject() did not fail as expected")
      }catch(e) {
        // OK  - intentionally empty
      }
    });

    it('BlockEndToken implements abstract methods', () => {
      checkToken(new BlockEndToken(), "}", "}")
    });

    it('BlockStartToken implements abstract methods', () => {
      checkToken(new BlockStartToken(), "{", "{")
    });

    it('Separator implements abstract methods', () => {
      checkToken(new SeparatorToken(), "=", "=")
    });

    it('ValueToken implements abstract methods', () => {
      let s = "abc";
      checkToken(new ValueToken(s), s, s);
    });

    it('ValueToken handles numbers, quoted and unquoted string', () => {
      assert.deepEqual(new ValueToken('3.14').getObject(), 3.14);
      assert.deepEqual(new ValueToken('unquoted string').getObject(), 'unquoted string');
      assert.deepEqual(new ValueToken('"quoted string"').getObject(), 'quoted string');
    });

  })
}