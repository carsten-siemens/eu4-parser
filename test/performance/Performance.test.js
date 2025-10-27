import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';

import { createSuite } from '../createSuite.js';
import { Tokenizer } from '../../src/tokenize/Tokenizer.js';
import { Parser } from '../../src/parse/Parser.js';


createSuite(import.meta.url, performanceSuite);

export function performanceSuite() {
  describe("Perfomance Test", () => {

    it.skip('Read, tokenize, and parse', () => {
      let baseFilename = "gamestate"
      const s1 = performance.now();
      let s = fs.readFileSync(`./data/${baseFilename}.txt`, { encoding: "latin1"});
      const e1 = performance.now();
      console.log(`Execution READ: ${(e1 - s1).toFixed(1)} ms`);

      const s2 = performance.now();
      let tokens = new Tokenizer().tokenize(s);
      const e2 = performance.now();
      console.log(`Execution TOKENIZE: ${(e2 - s2).toFixed(1)} ms`);

      const s3 = performance.now();
      let o = new Parser().parse(tokens);
      const e3 = performance.now();
      console.log(`Execution PARSE: ${(e3 - s3).toFixed(1)} ms`);
    });
  });
}