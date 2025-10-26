import fs from 'fs';

export class FileUtil {

  static guessFileType(filePath, encoding="latin1"){
    let s = FileUtil.#readFileStartAsString(filePath, 100, encoding);

    if (s.startsWith("PK")) {
      return "ZIP";
    }

    if (s.startsWith("EU4txt")) {
      return "EU4txt";
    }

    return "unknown";
  }

  static  #readFileStartAsString(filePath, byteCount, encoding){

    let fd = undefined
    try {
      fd = fs.openSync(filePath, 'r');
      const buffer = Buffer.alloc(byteCount);
      const bytesRead = fs.readSync(fd, buffer, 0, byteCount);

      return buffer.toString(encoding, 0, bytesRead);
    } finally {
      if (fd !== undefined)
        fs.closeSync(fd);
    } 
  }
}