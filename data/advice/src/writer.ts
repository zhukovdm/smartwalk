import fs from "fs";

const ASSETS_DIR = "../assets";

export default function writeToFile(keywords: string[]) {
  const fileName = `${ASSETS_DIR}/advice/keywords.txt`;
  fs.writeFileSync(fileName, keywords.join("\n"));
}
