import { test } from 'node:test';

import { stringBufferSuite } from './tokenize/StringBuffer.test.js';
import { tokenizerSuite } from './tokenize/Tokenizer.test.js';
import { parserSuite } from './parse/Parser.test.js';
import { tokenSuite } from './tokenize/Token.test.js';
import { fileUtilSuite } from './utils/FileUtil.test.js';
import { parserManagerSuite } from './parse/ParserManager.test.js';
import { tokenBufferSuite } from './parse/TokenBuffer.test.js';

test('Package UTILS', () => {
  fileUtilSuite();
});

test('Package TOKENIZE', () => {
  stringBufferSuite();
  tokenSuite();
  tokenizerSuite();
});

test('Package PARSE', () => {
  tokenBufferSuite();
  parserSuite();
  parserManagerSuite();
});


