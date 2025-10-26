import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createSuite } from '../createSuite.js';
import { FileUtil } from '../../src/utils/FileUtil.js';


createSuite(import.meta.url, fileUtilSuite);

export function fileUtilSuite() {
  describe("FileUtil", () => {

    it('guessFileType detects EU4txt file', () => {
      let type = FileUtil.guessFileType("./test/data/eu4-guessfiletype.txt")
      assert.deepStrictEqual(type, "EU4txt");
    });

    it('guessFileType detects ZIP file', () => {
      let type = FileUtil.guessFileType("./test/data/eu4-guessfiletype.zip")
      assert.deepStrictEqual(type, "ZIP");
    });

    it('guessFileType detects unknown file', () => {
      let type = FileUtil.guessFileType("./test/data/eu4-guessfiletype.unknown")
      assert.deepStrictEqual(type, "unknown");
    });

  });
}