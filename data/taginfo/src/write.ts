import fs from "fs";
import { ValueItem } from "./types";

export default function writeToFile(key: string, list: ValueItem[]) {
  const fileName = `../assets/taginfo/${key}.json`;
  fs.writeFileSync(fileName, JSON.stringify(list, null, 2));
}
