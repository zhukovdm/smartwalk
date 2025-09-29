import fs from "fs";
import readline from "readline";

const ASSETS_DIR = "../assets";

function getLines(objectKind: ObjectKind) {
  const path = `${ASSETS_DIR}/dump/${objectKind}.txt`;
  if (!fs.existsSync(path)) {
    throw Error(`File ${objectKind}.txt does not exist.`);
  }
  return readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity
  });
}

export const getKeywordLines = () => (getLines("keywords"));

export const getPlaceLines = () => (getLines("places"));
