import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from "fs";

import { createSuite } from '../createSuite.js';
import { Parser } from '../../src/parse/Parser.js';
import { Tokenizer } from '../../src/tokenize/Tokenizer.js';


function checkParser(input, expectedObject) {
  let tokens = new Tokenizer().tokenize(input);
  let o = new Parser(tokens).parse();

  assert.strictEqual(JSON.stringify(o), JSON.stringify(expectedObject));
}

createSuite(import.meta.url, parserSuite);

export function parserSuite() {
  describe('Parser', () => {

    it('parses simple attribute', () => {
      let input = 'EU4txt date=1570.9.1  end=x';
      let expected = { date: "1570.9.1", end: "x"};

      checkParser(input, expected);
    });

    it('parses simple attribute with 0', () => {
      let input = 'EU4txt zero=0  end=x';
      let expected = { zero: 0, end: "x"};

      checkParser(input, expected);
    });

    it('tolerates "<key>{" instead of "<key>={"', () => {
      let input = 'EU4txt zero=0  end=x';
      let expected = { zero: 0, end: "x"};

      checkParser(input, expected);
    });

    it('parses simple attribute with double-quoted value', () => {
      let input = 'EU4txt date="1570.9.1"  end=x';
      let expected = { date: "1570.9.1", end: "x"};

      checkParser(input, expected);
    });

    it('ignores surrounding quotes of a key token', () => {
      let input = 'EU4txt "date"=1570.9.1';
      let expected = { date: '1570.9.1' };

      checkParser(input, expected);
    });

    it('parses compex type', () => {
      let input = 'EU4txt name={ a=hello b=world }';
      let expected = { name: { a: "hello", b: "world" } };

      checkParser(input, expected);
    });

    it('parses compex type with 0', () => {
      let input = 'EU4txt name={ a=0 b=world }';
      let expected = { name: { a: 0, b: "world" } };

      checkParser(input, expected);
    });

    it('parses empty array', () => {
      let input = 'EU4txt name={ } end=x';
      let expected = { name: [], end: "x" };

      checkParser(input, expected);
    });

    it('parses array with 1 value', () => {
      let input = 'EU4txt name={ a } end=x';
      let expected = { name: [ "a" ], end: "x" };

      checkParser(input, expected);
    });

    it('parses array with several values', () => {
      let input = 'EU4txt name={ a 3.14 "hugo"} end=x';
      let expected = { name: [ "a", 3.14,  "hugo"], end: "x" };

      checkParser(input, expected);
    });

    it('parses array with 1 complex value', () => {
      let input = 'EU4txt name={ { a=1 b=2 }  } end=x';
      let expected = { name: [ {a:1, b:2} ], end: "x" };

      checkParser(input, expected);
    });

    it('parses array with several complex value', () => {
      let input = 'EU4txt name={ { a=1 b=2 } { c=3 d=4 } } end=x';
      let expected = { name: [ {a:1, b:2}, {c:3, d:4} ], end: "x" };

      checkParser(input, expected);
    });

    it('parses nested array with empty child array', () => {
      let input = 'EU4txt name={ { } } end=x';
      let expected = { name: [ [] ], end: "x" };

      checkParser(input, expected);
    });

    it('parses nested array with empty child arrays', () => {
      let input = 'EU4txt name={ {} {} } end=x';
      let expected = { name: [ [], [] ], end: "x" };

      checkParser(input, expected);
    });

    it('parses nested array with values', () => {
      let input = 'EU4txt name={ { a "b" } { c 3.14 } } end=x';
      let expected = { name: [ ["a", "b"], ["c", 3.14 ] ], end: "x" };

      checkParser(input, expected);
    });

    it('parses nested array 3 levels ', () => {
      let input = 'EU4txt name={ { a { b1 b2 } } { c 3.14 } } end=x';
      let expected = { name: [ ["a", [ "b1", "b2"]], [ "c", 3.14 ] ], end: "x" };

      checkParser(input, expected);
    });

    it('tolerates "<key>{" instead of "<key>={"', () => {
      let input = 'EU4txt tolarate{ a = 7 } end=x';
      let expected = { tolarate: {a: 7}, end: "x"};

      checkParser(input, expected);
    });

    it('ignores "{}" where value token is expected', () => {
      let input = 'EU4txt tolarate{ a = 7 } { } end=x';
      let expected = { tolarate: {a: 7}, end: "x"};

      checkParser(input, expected);
    });

    it.skip('parses an uncompresed real-life file', () => {
        let baseFilename = "uncompressed"
        const s1 = performance.now();
        let s = fs.readFileSync(`./data/${baseFilename}.txt`, { encoding: "latin1"});
        const e1 = performance.now();
        console.log(`Execution READ: ${(e1 - s1).toFixed(1)} ms`);

        const s2 = performance.now();
        let tokens = new Tokenizer().tokenize(s);
        const e2 = performance.now();
        console.log(`Execution TOKENIZE: ${(e2 - s2).toFixed(1)} ms`);

        const s3 = performance.now();
        let o = new Parser(tokens).parse();
        const e3 = performance.now();
        console.log(`Execution PARSE: ${(e3 - s3).toFixed(1)} ms`);

        assert.notEqual(o, null);
    });
  });
}