import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { ParserManager } from '../../src/parse/ParserManager.js';

function check(filePath, expectedObject){
  let o = new ParserManager().parseFile(filePath);
  assert.deepStrictEqual(o, expectedObject);
}

createSuite(import.meta.url, parserManagerSuite);

export function parserManagerSuite() {
  describe('ParserManager', () => {

    it('parse zip file with 3 files', () => {
      check(
        './test/data/eu4-ParserManager.zip',
        { ai: ["ai-value"], gamestate: ["gamestate-value"], meta: ["meta-value"] });
    });

    it.skip('parse LARGE zip file with 3 files', () => {
       let o = new ParserManager().parseFile('./data/Osterreich1570_09_01.eu4');
       assert.notEqual(o, null);
    });

    it('parse text file', () => {
      check(
        './test/data/eu4-ParserManager.txt',
        { sample: [ "sample-value" ] });
    });

    it('parse unknown file', () => {
      let ee = null;
      try {
        let o = new ParserManager().parseFile('./test/data/eu4-ParserManager.unknown');
      } catch(e) {
        ee = e;
      }

      assert.notDeepEqual(ee, null);

    });

 });
}