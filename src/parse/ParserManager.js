import AdmZip from "adm-zip";
import { readFileSync } from 'node:fs';

import { Tokenizer } from "../tokenize/Tokenizer.js";
import { FileUtil } from "../utils/FileUtil.js";
import { Parser } from "./Parser.js";


export class ParserManager {
  parseFile(filePath, encoding = "latin1") {
    let fileType = FileUtil.guessFileType(filePath);

    switch(fileType){
      case "EU4txt":
        return this.#parseTxtFile(filePath, encoding);
      case "ZIP":
        return this.#parseZipFile(filePath, encoding);
      default:
        throw `ERROR: "${filePath}" is not an - zipped or unzipped - EU4 file`;
    }
  }

  #parseZipFile(filePath, encoding){
    let o = {}

    const zipEntries = new AdmZip(filePath).getEntries(); 
    for(const zipEntry of zipEntries){
      let s = zipEntry.getData().toString(encoding);
      this.#parseString(s, o)
    }

    return o;
  }

  #parseTxtFile(filePath, encoding){
    let o = {};
    let s = readFileSync(filePath, { encoding: encoding});
    this.#parseString(s, o);

    return o;
  }

  #parseString(s, o={}){
    let tokens = new Tokenizer().tokenize(s); 
    new Parser(tokens).parse(o);

    return o;
  }  
}