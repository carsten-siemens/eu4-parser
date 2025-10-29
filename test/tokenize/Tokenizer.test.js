import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { Tokenizer } from '../../src/tokenize/Tokenizer.js';

function checkTokenize(input, expectedTokenStrings){
  let tb = new Tokenizer().tokenize(input);
  let tokenStrings = [...tb].map(x => x.toString());

  assert.deepStrictEqual(tokenStrings, expectedTokenStrings);
}

createSuite(import.meta.url, tokenizerSuite);

export function tokenizerSuite() {
  describe('Tokenizer', () => {

    it('tokenizes long example', () => {
      let input = `EU4txt
          date=1570.9.1
          save_game="abc.eu4"
          complex= {
            first=1
            second=2
          }
          array={ a b c }
          end = done`;

      let expected = ["EU4txt", 
        "date", "=", "1570.9.1", 
        "save_game", "=", "\"abc.eu4\"",
        "complex", "=", "{", "first", "=", "1", "second", "=", "2", "}",
        "array", "=", "{",  "a", "b", "c", "}",
        "end", "=", "done" ];

      checkTokenize(input, expected);
    });

    it('tokenizes a non-quoted value', () => {
      let x = "abc";
      checkTokenize(x, [x]);
    });

    it('tokenizes a quoted value', () => {
      let x = "\"abc\"";
      checkTokenize(x, [x]);
    });

    it('tokenizes a quoted value with blanks', () => {
      checkTokenize("a b c", ["a", "b", "c"]);
    });

    it('tokenizes a numeric value', () => {
      checkTokenize("3.14 42", ["3.14", "42"]);
    });

    it('tokenizes a complex type', () => {
      checkTokenize("{ a = 3.14 b= 42}", ["{", "a", "=", "3.14", "b", "=", "42", "}"]);
    });

    it('tokenizes an empty array', () => {
      checkTokenize("{}", ["{", "}"]);
    });

    it('tokenizes a nested empty arry', () => {
      checkTokenize("{{}}", ["{", "{", "}", "}"]);
    });

  })
}