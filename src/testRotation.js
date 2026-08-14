import { mediumPuzzles, hardPuzzles } from "./dailyPuzzles.js"

const START_DATE = new Date("2026-08-12T00:00:00Z")

const getPuzzleIndexForDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`)

  const difference = Math.floor(
    (date - START_DATE) /
      (1000 * 60 * 60 * 24)
  )

  return ((difference % 1000) + 1000) % 1000
}

const testDates = [
  "2026-08-12",
  "2026-08-13",
  "2026-08-14",
  "2026-08-15",
  "2026-08-16",
  "2026-08-17",
  "2029-05-08",
  "2029-05-09",
  "2029-05-10",
]

console.log("")
console.log("========================================")
console.log("NEXT STOP — DAILY PUZZLE ROTATION TEST")
console.log("========================================")

testDates.forEach((date) => {
  const index = getPuzzleIndexForDate(date)

  console.log("")
  console.log(`DATE: ${date}`)
  console.log(`Puzzle number: ${index + 1}`)
  console.log(`Medium: ${mediumPuzzles[index]?.id}`)
  console.log(`Hard:   ${hardPuzzles[index]?.id}`)
})

console.log("")
console.log("========================================")
console.log("EXPECTED RESULT")
console.log("========================================")
console.log("2026-08-12 → Puzzle 1")
console.log("2026-08-13 → Puzzle 2")
console.log("2026-08-14 → Puzzle 3")
console.log("...")
console.log("2029-05-09 → Puzzle 1000")
console.log("2029-05-10 → Puzzle 1")
console.log("========================================")