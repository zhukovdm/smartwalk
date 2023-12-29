import fs from "fs";

const ASSETS_DIR = "../assets";

export default function writeToFile(keywords: string[]) {
  const fileName = `${ASSETS_DIR}/advice/keywords.html`;
  fs.writeFileSync(fileName, `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>SmartWalk | Examples of keywords</title>
</head>
<body>
<pre>
${keywords.join("\n")}
</pre>
</body>
</html>
`);
}
