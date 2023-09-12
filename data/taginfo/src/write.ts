import fs from "fs";
import { ValueItem } from "./types";

const ASSETS_DIR = "../assets";

export default function writeToFile(key: string, list: ValueItem[]) {
  const fileName = `${ASSETS_DIR}/taginfo/${key}.json`;
  fs.writeFileSync(fileName, JSON.stringify(list, null, 2));
}
