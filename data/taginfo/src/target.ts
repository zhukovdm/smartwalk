import fs from "fs";
import { ValueItem } from "./types.js";

const ASSETS_DIR = "../assets";

export default class Target {

  async load(key: string, list: ValueItem[]): Promise<void> {
    const fileName = `${ASSETS_DIR}/taginfo/${key}.json`;
    return fs.promises.writeFile(fileName, JSON.stringify(list, null, 2)); // overwrite existing
  }
}
