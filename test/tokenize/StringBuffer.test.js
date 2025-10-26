import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { StringBuffer } from '../../src/tokenize/StringBuffer.js';
import { Position } from '../../src/tokenize/Position.js';

function incLine(position){
  return new Position(position.line + 1, 1);  
}

function incColumn(position){
  return new Position(position.line, position.column +1);
}
function unchanged(position){
  return position;
}

function checkCharAndPosition(sb, expectedChar, expectedPositionBefore, positionUpdateFunction){
  // Peek char 
  assert.deepStrictEqual(sb.getPosition(), expectedPositionBefore);
  assert.deepStrictEqual(sb.peekChar(), expectedChar);
  assert.deepStrictEqual(sb.getPosition(), expectedPositionBefore);

  // Consume char
  let expectedPositionAfter = positionUpdateFunction(expectedPositionBefore);
  assert.deepStrictEqual(sb.consumeChar(), expectedChar);
  assert.deepStrictEqual(sb.getPosition(), expectedPositionAfter);

  return expectedPositionAfter;
}

createSuite(import.meta.url, stringBufferSuite);

export function stringBufferSuite() {
  describe("StringBuffer", () => {

    it('works with an empty string', () => {
      let sb = new StringBuffer("");

      let p = new Position(1, 1);
      checkCharAndPosition(sb, null,  p, unchanged);
    });

    it('works with non-empty string', () => {
      let sb = new StringBuffer('123\r\na \ncd');
      let p = new Position(1, 1);

      p = checkCharAndPosition(sb, '1',  p, incColumn);
      p = checkCharAndPosition(sb, '2',  p, incColumn);
      p = checkCharAndPosition(sb, '3',  p, incColumn);
      p = checkCharAndPosition(sb, '\r', p, incColumn);
      p = checkCharAndPosition(sb, '\n', p, incLine);
      p = checkCharAndPosition(sb, 'a',  p, incColumn);
      p = checkCharAndPosition(sb, ' ',  p, incColumn);
      p = checkCharAndPosition(sb, '\n', p, incLine);
      p = checkCharAndPosition(sb, 'c',  p, incColumn);
      p = checkCharAndPosition(sb, 'd',  p, incColumn);
      p = checkCharAndPosition(sb, null, p, unchanged);
    });

  });
}