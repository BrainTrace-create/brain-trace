import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORD_LIST_URL =
  "https://raw.githubusercontent.com/en-wl/wordlist-diff/master/en_AU.txt";

async function buildDictionary() {
  console.log("Downloading Australian English dictionary...");

  const response = await fetch(WORD_LIST_URL);

  if (!response.ok) {
    throw new Error(
      `Could not download dictionary. HTTP ${response.status}`
    );
  }

  const text = await response.text();

  console.log("Dictionary downloaded.");
  console.log("Filtering to 3–5 letter words...");

  const words = text
    .split(/\r?\n/)
    .map((word) => word.trim().toUpperCase())
    .filter((word) => /^[A-Z]{3,5}$/.test(word));

  const uniqueWords = [...new Set(words)].sort();

  const three = uniqueWords.filter(
    (word) => word.length === 3
  );

  const four = uniqueWords.filter(
    (word) => word.length === 4
  );

  const five = uniqueWords.filter(
    (word) => word.length === 5
  );

  console.log("");
  console.log(`3-letter words: ${three.length}`);
  console.log(`4-letter words: ${four.length}`);
  console.log(`5-letter words: ${five.length}`);
  console.log(`TOTAL: ${uniqueWords.length}`);

  const output = `// WordShift dictionary
// Australian English
// 3–5 letter words
// Generated automatically from ESDB

const words = new Set(${JSON.stringify(
    uniqueWords,
    null,
    2
)});

export default words;
`;

  const outputPath = path.join(
    __dirname,
    "words.js"
  );

  fs.writeFileSync(
    outputPath,
    output,
    "utf8"
  );

  console.log("");
  console.log("================================");
  console.log("DICTIONARY BUILD SUCCESSFUL!");
  console.log("================================");
  console.log("");
  console.log(`Created: ${outputPath}`);
  console.log("");
  console.log(`3 letters : ${three.length}`);
  console.log(`4 letters : ${four.length}`);
  console.log(`5 letters : ${five.length}`);
  console.log(`TOTAL     : ${uniqueWords.length}`);
}

buildDictionary().catch((error) => {
  console.error("");
  console.error("================================");
  console.error("DICTIONARY BUILD FAILED");
  console.error("================================");
  console.error("");
  console.error(error);
  process.exit(1);
});