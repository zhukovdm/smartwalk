import fs from "fs";
import Logger from "./logger.js";

const ASSETS_DIR = "../assets";

type FileName = "places" | "keywords";

export default class Target {

  private appendedPlacesCur = 0;
  private appendedPlacesTot = 0;
  private appendedKeywordsTot = 0;
  private readonly logger: Logger;

  private getFilePath(fileName: string) {
    return `${ASSETS_DIR}/dump/${fileName}.txt`;
  }

  private deleteFile(fileName: FileName) {
    const path = this.getFilePath(fileName);
    if (fs.existsSync(path)) { fs.unlinkSync(path); }
  }

  private appendToFile(fileName: FileName, obj: any) {
    const filePath = this.getFilePath(fileName);
    fs.appendFileSync(filePath, JSON.stringify(obj) + "\n");
  }

  constructor(logger: Logger) {
    this.logger = logger;
    this.deleteFile("places");
    this.deleteFile("keywords");
  }

  writePlace(obj: any) {
    this.appendToFile("places", obj);

    if (++this.appendedPlacesCur >= 10000) {

      this.appendedPlacesTot += this.appendedPlacesCur;
      this.logger.logPlacesAppendedCur(this.appendedPlacesTot);
      this.appendedPlacesCur = 0;
    }
  };

  reportPlacesProcessed() {
    this.logger.logPlacesAppendedTot(this.appendedPlacesTot + this.appendedPlacesCur)
  }

  writeKeyword(obj: any) {
    this.appendToFile("keywords", obj);
    ++this.appendedKeywordsTot;
  }

  reportKeywordsProcessed() {
    this.logger.logKeywordsAppendedTot(this.appendedKeywordsTot);
  }
}
