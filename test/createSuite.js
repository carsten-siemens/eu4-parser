import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

/**
 * Registers a test suite only if the current file is executed directly.
 * @param {string} importMetaUrl - The import.meta.url of the current module.
 * @param {Function} suiteFn - Function that defines the suite (usually contains describe/it).
 * @param {Object} [options] - Optional flags: { only: boolean, skip: boolean }
 */
export function createSuite(importMetaUrl, suiteFn, options = {}) {  
  const isDirect = importMetaUrl === pathToFileURL(process.argv[1]).href;
  const suiteName = "STANDALONE";

  if (!isDirect) return;

  if (options.only) {
    test.only(suiteName, suiteFn);
  } else if (options.skip) {
    test.skip(suiteName, suiteFn);
  } else {
    test(suiteName, suiteFn);
  }
}