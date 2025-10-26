import { ParserManager } from "./src/parse/ParserManager";

export function parseEu4SavegameFromFile(filePath, encoding="latin1"){
  new ParserManager().parseFile(filePath, encoding)
}