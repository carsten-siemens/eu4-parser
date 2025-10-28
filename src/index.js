import { ParserManager } from "./parse/ParserManager";

/*!
 * Parse a - zip or plain text - Europa Universali (EU4) save game file
 * into a nested JavaScript object.
 * 
 * @param {*} filePath path to the zipped - or unzpped - save game file  
 * @param {*} encoding optional: encoding of either 
 *    (a) the text files with in the zip archive or
 *    (b) the plain text save game file
 * EU4 always uses the encoding latin1 (aka WINDOWS-1252). Therefor, this
 * opttional encoding parameter shoul be left out unless you have 
 * an encoding issue.
 */
export function parseEu4Savegame(filePath, encoding="latin1"){
  return new ParserManager().parseFile(filePath, encoding);
}