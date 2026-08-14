import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const wordsFile = path.join(__dirname, "words.js")
const outputFile = path.join(__dirname, "dailyPuzzles.js")

// ============================================================
// SETTINGS
// ============================================================

const DAYS_TO_GENERATE = 1000

// Easy: 3-letter words, 2–4 changes
const EASY_MIN = 2
const EASY_MAX = 4

// Medium: 4–5 letter words, 3–5 changes
const MEDIUM_MIN = 3
const MEDIUM_MAX = 5

// Hard: 5-letter words, 5–7 changes
const HARD_MIN = 5
const HARD_MAX = 7

// ============================================================
// WORDS WE DEFINITELY DO NOT WANT
// ============================================================

const BLOCKED_WORDS = new Set([
  "AAA",
  "ABC",
  "ABCS",
  "ADV",
  "CDS",
  "FUD",
  "CEO",
  "CEOS",
  "CIA",
  "FBI",
  "GDP",
  "GPS",
  "HTML",
  "HTTP",
  "HTTPS",
  "ISBN",
  "MBA",
  "PHD",
  "UK",
  "USA",
  "US",
  "UAE",
  "UN",
  "EU",
  "TV",
  "DVD",
  "ATM",
  "PDF",
  "FAQ",
  "FAQS",
  "DIY",
  "DOB",
  "ETA",
  "ETC",
  "ETAL",
  "FYI",
  "ID",
  "IDS",
  "IQ",
  "ITS",
  "MR",
  "MRS",
  "MS",
  "DR",
  "ST",
  "JR",
  "SR",
  "ZZZ",
])

// ============================================================
// COMMON NORMAL 3-LETTER WORDS
// ============================================================
//
// For 3-letter Easy words, we use an allow-list.
// This is much safer than trying to guess whether a
// three-letter dictionary entry is an acronym.
//
// We can expand this list later if needed.
//

const GOOD_THREE_LETTER_WORDS = new Set([
  "ACE",
  "ACT",
  "ADD",
  "AGE",
  "AGO",
  "AID",
  "AIM",
  "AIR",
  "ALL",
  "AND",
  "ANT",
  "ANY",
  "APE",
  "APT",
  "ARC",
  "ARE",
  "ARM",
  "ART",
  "ASH",
  "ASK",
  "ATE",
  "AWE",
  "BAD",
  "BAG",
  "BAN",
  "BAR",
  "BAT",
  "BED",
  "BEE",
  "BET",
  "BIG",
  "BIN",
  "BIT",
  "BOB",
  "BOX",
  "BOY",
  "BUD",
  "BUG",
  "BUS",
  "BUT",
  "BUY",
  "CAB",
  "CAN",
  "CAP",
  "CAR",
  "CAT",
  "COB",
  "COD",
  "COG",
  "COP",
  "COT",
  "COW",
  "CRY",
  "CUP",
  "CUT",
  "DAD",
  "DAM",
  "DAY",
  "DEN",
  "DID",
  "DIE",
  "DIG",
  "DIM",
  "DIN",
  "DIP",
  "DOG",
  "DOT",
  "DRY",
  "DUE",
  "EAR",
  "EAT",
  "EGG",
  "ELF",
  "END",
  "ERA",
  "EVE",
  "EYE",
  "FAN",
  "FAR",
  "FAT",
  "FAX",
  "FED",
  "FEW",
  "FIG",
  "FIN",
  "FIT",
  "FIX",
  "FLY",
  "FOG",
  "FOR",
  "FOX",
  "FUN",
  "GAP",
  "GAS",
  "GEL",
  "GET",
  "GOD",
  "GOT",
  "GUM",
  "GUN",
  "GUY",
  "HAD",
  "HAM",
  "HAS",
  "HAT",
  "HAY",
  "HEN",
  "HER",
  "HIM",
  "HIP",
  "HIS",
  "HIT",
  "HOP",
  "HOT",
  "HOW",
  "ICE",
  "ILL",
  "INK",
  "JAM",
  "JAR",
  "JET",
  "JOB",
  "JOY",
  "KEY",
  "KID",
  "KIT",
  "LAB",
  "LAP",
  "LAW",
  "LAY",
  "LED",
  "LEG",
  "LET",
  "LID",
  "LIE",
  "LIP",
  "LOG",
  "LOT",
  "LOW",
  "MAD",
  "MAN",
  "MAP",
  "MAT",
  "MAY",
  "MEN",
  "MET",
  "MIX",
  "MOB",
  "MOM",
  "MUD",
  "MUG",
  "NAP",
  "NET",
  "NEW",
  "NOD",
  "NOT",
  "NOW",
  "NUT",
  "OAK",
  "OAR",
  "OIL",
  "OLD",
  "ONE",
  "OPT",
  "OUR",
  "OUT",
  "OWL",
  "OWN",
  "PAD",
  "PAN",
  "PEN",
  "PET",
  "PIE",
  "PIN",
  "PIT",
  "POD",
  "POP",
  "POT",
  "PUT",
  "RAG",
  "RAM",
  "RAN",
  "RAP",
  "RAT",
  "RED",
  "RID",
  "RIG",
  "RIP",
  "ROB",
  "ROD",
  "ROT",
  "ROW",
  "RUB",
  "RUN",
  "SAD",
  "SAW",
  "SAY",
  "SEA",
  "SEE",
  "SET",
  "SHE",
  "SHY",
  "SIT",
  "SIX",
  "SKY",
  "SOB",
  "SON",
  "SUN",
  "TAB",
  "TAG",
  "TAN",
  "TAP",
  "TAX",
  "TEA",
  "TEN",
  "THE",
  "TIE",
  "TIN",
  "TIP",
  "TOE",
  "TOP",
  "TOY",
  "TRY",
  "TUB",
  "TWO",
  "USE",
  "VAN",
  "VET",
  "WAR",
  "WAS",
  "WAY",
  "WEB",
  "WET",
  "WHO",
  "WHY",
  "WIN",
  "WIT",
  "WOW",
  "YAK",
  "YES",
  "YET",
  "YOU",
  "ZIP",
  "ZOO",
])

// ============================================================
// LOAD WORDS
// ============================================================

const source = fs.readFileSync(
  wordsFile,
  "utf8"
)

const matches = [
  ...source.matchAll(
    /["']([A-Z]{3,5})["']/g
  ),
]

const rawWords = [
  ...new Set(
    matches.map(
      (match) =>
        match[1].toUpperCase()
    )
  ),
]

console.log(
  `Loaded ${rawWords.length} dictionary entries.`
)

// ============================================================
// CLEAN DICTIONARY
// ============================================================

function isGoodWord(word) {
  if (!word) {
    return false
  }

  if (
    word.length < 3 ||
    word.length > 5
  ) {
    return false
  }

  if (!/^[A-Z]+$/.test(word)) {
    return false
  }

  if (
    BLOCKED_WORDS.has(word)
  ) {
    return false
  }

  // ----------------------------------------------------------
  // IMPORTANT:
  // For 3-letter words, only use our approved list.
  // This removes acronym-like entries such as FUD.
  // ----------------------------------------------------------

  if (word.length === 3) {
    return GOOD_THREE_LETTER_WORDS.has(
      word
    )
  }

  // ----------------------------------------------------------
  // For 4- and 5-letter words:
  // reject obvious acronym patterns.
  // ----------------------------------------------------------

  const vowels =
    word.match(/[AEIOU]/g)

  if (
    !vowels ||
    vowels.length === 0
  ) {
    return false
  }

  // Reject unusual repeated-letter patterns
  if (
    word.includes("QQ") ||
    word.includes("ZZ")
  ) {
    return false
  }

  return true
}

const allWords =
  rawWords.filter(
    isGoodWord
  )

console.log(
  `Usable words after filtering: ${allWords.length}`
)

// ============================================================
// GROUP WORDS BY LENGTH
// ============================================================

const wordsByLength =
  new Map()

for (
  const word of allWords
) {
  if (
    !wordsByLength.has(
      word.length
    )
  ) {
    wordsByLength.set(
      word.length,
      []
    )
  }

  wordsByLength
    .get(word.length)
    .push(word)
}

// ============================================================
// BUILD WORD GRAPH
// ============================================================

const patternMaps =
  new Map()

for (
  const [
    length,
    wordList,
  ] of wordsByLength
) {
  const map =
    new Map()

  for (
    const word of wordList
  ) {
    for (
      let i = 0;
      i < length;
      i++
    ) {
      const pattern =
        word.slice(0, i) +
        "_" +
        word.slice(i + 1)

      if (
        !map.has(pattern)
      ) {
        map.set(
          pattern,
          []
        )
      }

      map
        .get(pattern)
        .push(word)
    }
  }

  patternMaps.set(
    length,
    map
  )
}

// ============================================================
// NEIGHBOURS
// ============================================================

const neighbourCache =
  new Map()

function getNeighbours(
  word
) {
  if (
    neighbourCache.has(
      word
    )
  ) {
    return neighbourCache.get(
      word
    )
  }

  const map =
    patternMaps.get(
      word.length
    )

  const neighbours =
    new Set()

  if (!map) {
    return []
  }

  for (
    let i = 0;
    i < word.length;
    i++
  ) {
    const pattern =
      word.slice(0, i) +
      "_" +
      word.slice(i + 1)

    const matches =
      map.get(pattern) ||
      []

    for (
      const candidate
      of matches
    ) {
      if (
        candidate !== word
      ) {
        neighbours.add(
          candidate
        )
      }
    }
  }

  const result = [
    ...neighbours,
  ]

  neighbourCache.set(
    word,
    result
  )

  return result
}

// ============================================================
// SHUFFLE
// ============================================================

function shuffle(
  array
) {
  const result = [
    ...array,
  ]

  for (
    let i =
      result.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      )

    ;[
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ]
  }

  return result
}

// ============================================================
// FIND PATH
// ============================================================

function findPath(
  start,
  target,
  minimum,
  maximum
) {
  const queue = [
    {
      word: start,
      path: [start],
    },
  ]

  const visited =
    new Set([start])

  while (
    queue.length > 0
  ) {
    const current =
      queue.shift()

    const moves =
      current.path.length - 1

    if (
      current.word ===
      target
    ) {
      if (
        moves >= minimum &&
        moves <= maximum
      ) {
        return current.path
      }

      continue
    }

    if (
      moves >= maximum
    ) {
      continue
    }

    const neighbours =
      shuffle(
        getNeighbours(
          current.word
        )
      )

    for (
      const next
      of neighbours
    ) {
      if (
        visited.has(next)
      ) {
        continue
      }

      visited.add(next)

      queue.push({
        word: next,
        path: [
          ...current.path,
          next,
        ],
      })
    }
  }

  return null
}

// ============================================================
// GET TARGETS
// ============================================================

function getTargets(
  start,
  minimum,
  maximum
) {
  const results = []

  const queue = [
    {
      word: start,
      distance: 0,
    },
  ]

  const visited =
    new Set([start])

  while (
    queue.length > 0
  ) {
    const current =
      queue.shift()

    if (
      current.distance >=
      maximum
    ) {
      continue
    }

    const neighbours =
      getNeighbours(
        current.word
      )

    for (
      const next
      of neighbours
    ) {
      if (
        visited.has(next)
      ) {
        continue
      }

      visited.add(next)

      const distance =
        current.distance +
        1

      if (
        distance >= minimum &&
        distance <= maximum
      ) {
        results.push(next)
      }

      queue.push({
        word: next,
        distance,
      })
    }
  }

  return results
}

// ============================================================
// CANDIDATES
// ============================================================

const easyCandidates =
  shuffle(
    allWords.filter(
      (word) =>
        word.length === 3
    )
  )

const mediumCandidates =
  shuffle(
    allWords.filter(
      (word) =>
        word.length === 4 ||
        word.length === 5
    )
  )

const hardCandidates =
  shuffle(
    allWords.filter(
      (word) =>
        word.length === 5
    )
  )

console.log(
  `Easy candidates   : ${easyCandidates.length}`
)

console.log(
  `Medium candidates : ${mediumCandidates.length}`
)

console.log(
  `Hard candidates   : ${hardCandidates.length}`
)

// ============================================================
// USED PUZZLE PAIRS
// ============================================================

const usedPairs =
  new Set()

// ============================================================
// CREATE PUZZLE
// ============================================================

function createPuzzle(
  candidates,
  minimum,
  maximum,
  difficulty,
  puzzleNumber
) {
  const attempts =
    Math.min(
      candidates.length,
      5000
    )

  for (
    let attempt = 0;
    attempt < attempts;
    attempt++
  ) {
    const start =
      candidates[
        Math.floor(
          Math.random() *
            candidates.length
        )
      ]

    const possibleTargets =
      getTargets(
        start,
        minimum,
        maximum
      )

    if (
      possibleTargets.length ===
      0
    ) {
      continue
    }

    const targets =
      shuffle(
        possibleTargets
      )

    for (
      const target
      of targets
    ) {
      const pairKey =
        `${difficulty}-${start}-${target}`

      if (
        usedPairs.has(
          pairKey
        )
      ) {
        continue
      }

      const path =
        findPath(
          start,
          target,
          minimum,
          maximum
        )

      if (!path) {
        continue
      }

      const moves =
        path.length - 1

      if (
        moves < minimum ||
        moves > maximum
      ) {
        continue
      }

      usedPairs.add(
        pairKey
      )

      return {
        id:
          `${difficulty}-${String(
            puzzleNumber
          ).padStart(
            4,
            "0"
          )}`,

        difficulty,

        start,

        target,

        targetMoves:
          moves,

        route:
          path,
      }
    }
  }

  return null
}

// ============================================================
// GENERATE EASY
// ============================================================

const easyPuzzles = []

console.log(
  "\nGenerating Easy puzzles..."
)

for (
  let i = 1;
  i <= DAYS_TO_GENERATE;
  i++
) {
  const puzzle =
    createPuzzle(
      easyCandidates,
      EASY_MIN,
      EASY_MAX,
      "easy",
      i
    )

  if (!puzzle) {
    console.log(
      `Stopped at Easy puzzle ${i}.`
    )

    break
  }

  easyPuzzles.push(
    puzzle
  )

  if (
    i % 25 === 0 ||
    i === DAYS_TO_GENERATE
  ) {
    console.log(
      `Easy: ${i}/${DAYS_TO_GENERATE}`
    )
  }
}

// ============================================================
// GENERATE MEDIUM
// ============================================================

const mediumPuzzles = []

console.log(
  "\nGenerating Medium puzzles..."
)

for (
  let i = 1;
  i <= DAYS_TO_GENERATE;
  i++
) {
  const puzzle =
    createPuzzle(
      mediumCandidates,
      MEDIUM_MIN,
      MEDIUM_MAX,
      "medium",
      i
    )

  if (!puzzle) {
    console.log(
      `Stopped at Medium puzzle ${i}.`
    )

    break
  }

  mediumPuzzles.push(
    puzzle
  )

  if (
    i % 25 === 0 ||
    i === DAYS_TO_GENERATE
  ) {
    console.log(
      `Medium: ${i}/${DAYS_TO_GENERATE}`
    )
  }
}

// ============================================================
// GENERATE HARD
// ============================================================

const hardPuzzles = []

console.log(
  "\nGenerating Hard puzzles..."
)

for (
  let i = 1;
  i <= DAYS_TO_GENERATE;
  i++
) {
  const puzzle =
    createPuzzle(
      hardCandidates,
      HARD_MIN,
      HARD_MAX,
      "hard",
      i
    )

  if (!puzzle) {
    console.log(
      `Stopped at Hard puzzle ${i}.`
    )

    break
  }

  hardPuzzles.push(
    puzzle
  )

  if (
    i % 25 === 0 ||
    i === DAYS_TO_GENERATE
  ) {
    console.log(
      `Hard: ${i}/${DAYS_TO_GENERATE}`
    )
  }
}

// ============================================================
// WRITE OUTPUT
// ============================================================

const output = `
// ============================================================
// NEXT STOP — DAILY WORDSHIFT PUZZLES
// Generated automatically.
// ============================================================

const easyPuzzles = ${JSON.stringify(
  easyPuzzles,
  null,
  2
)}

const mediumPuzzles = ${JSON.stringify(
  mediumPuzzles,
  null,
  2
)}

const hardPuzzles = ${JSON.stringify(
  hardPuzzles,
  null,
  2
)}

export {
  easyPuzzles,
  mediumPuzzles,
  hardPuzzles,
}
`

fs.writeFileSync(
  outputFile,
  output,
  "utf8"
)

// ============================================================
// SUMMARY
// ============================================================

console.log(
  "\n========================================"
)

console.log(
  "DAILY PUZZLE GENERATION COMPLETE"
)

console.log(
  "========================================"
)

console.log(
  `Easy puzzles   : ${easyPuzzles.length}`
)

console.log(
  `Medium puzzles : ${mediumPuzzles.length}`
)

console.log(
  `Hard puzzles   : ${hardPuzzles.length}`
)

console.log(
  `Total puzzles  : ${
    easyPuzzles.length +
    mediumPuzzles.length +
    hardPuzzles.length
  }`
)

console.log(
  `Output file    : ${outputFile}`
)

console.log(
  "========================================"
)