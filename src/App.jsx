import { useEffect, useState } from "react"
import "./App.css"
import words from "./words"
import {
  easyPuzzles,
  mediumPuzzles,
  hardPuzzles,
} from "./dailyPuzzles"

const games = [
  {
    id: "wordtrace",
    title: "Word Trace",
    icon: "🔤",
    className: "wordtrace",
    description:
      "Transform one word into another, one letter at a time.",
  },
  {
    id: "target",
    title: "Target",
    icon: "🔢",
    className: "target",
    description:
      "Use numbers and maths to hit today's target.",
  },
  {
    id: "changed",
    title: "What Changed?",
    icon: "👀",
    className: "changed",
    description:
      "Look closely. Remember what you saw. Find what changed.",
  },
  {
    id: "sixty",
    title: "60 Seconds",
    icon: "⚡",
    className: "sixty",
    description:
      "How many challenges can you solve before the clock runs out?",
  },
]

/*
============================================================
DAILY PUZZLE
============================================================
*/

const getDailyPuzzleIndex = () => {
  const startDate = new Date("2026-08-12T00:00:00")

  const now = new Date()

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  )

  const difference = Math.floor(
    (today - start) /
      (1000 * 60 * 60 * 24)
  )

  return (
    ((difference % 1000) + 1000) %
    1000
  )
}

/*
============================================================
GET TODAY'S PUZZLE
============================================================
*/

const getDailyPuzzle = (level) => {
  const index = getDailyPuzzleIndex()

  if (level === "easy") {
    return easyPuzzles[index]
  }

  if (level === "medium") {
    return mediumPuzzles[index]
  }

  return hardPuzzles[index]
}

/*
============================================================
PUZZLE SCORE KEY
============================================================
*/

const getPuzzleScoreKey = (level, puzzle) => {
  return `${level}-${puzzle.id}`
}

/*
============================================================
APP
============================================================
*/

function App() {
  const [screen, setScreen] =
    useState("home")

  // Always return to the top when changing screens.
  // This prevents mobile users from landing halfway
  // down the next screen.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    })
  }, [screen])

  const [difficulty, setDifficulty] =
    useState(null)

  const [currentPuzzle, setCurrentPuzzle] =
    useState(null)

  const [currentWord, setCurrentWord] =
    useState("")

  const [wordHistory, setWordHistory] =
    useState([])

  const [message, setMessage] =
    useState("")

  const [seconds, setSeconds] =
    useState(0)

  const [gameFinished, setGameFinished] =
    useState(false)

  const [attemptScore, setAttemptScore] =
    useState(0)

  const [officialScores, setOfficialScores] =
    useState({})

  const [sharedScore, setSharedScore] =
    useState(null)

  const [sharedDifficulty, setSharedDifficulty] =
    useState(null)

  const [sharedMoves, setSharedMoves] =
    useState(null)

  const [sharedTime, setSharedTime] =
    useState(null)

  /*
  ============================================================
  LOAD OFFICIAL SCORES
  ============================================================
  */

  useEffect(() => {
    const savedScores =
      localStorage.getItem(
        "brainTraceOfficialScores"
      )

    if (savedScores) {
      try {
        const parsed =
          JSON.parse(savedScores)

        setOfficialScores(
          parsed || {}
        )
      } catch (error) {
        console.error(
          "Could not load saved scores.",
          error
        )
      }
    }
  }, [])

  /*
  ============================================================
  SAVE OFFICIAL SCORE
  ============================================================
  */

  const lockOfficialScore = (
    puzzleKey,
    score
  ) => {
    const currentOfficialScore =
      officialScores[puzzleKey]

    if (
      currentOfficialScore !==
      undefined
    ) {
      return currentOfficialScore
    }

    const updatedScores = {
      ...officialScores,
      [puzzleKey]: score,
    }

    setOfficialScores(
      updatedScores
    )

    localStorage.setItem(
      "brainTraceOfficialScores",
      JSON.stringify(
        updatedScores
      )
    )

    return score
  }

  /*
  ============================================================
  CHECK FOR SHARED SCORE
  ============================================================
  */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      )

    const score =
      params.get("score")

    const level =
      params.get("level")

    const moves =
      params.get("moves")

    const time =
      params.get("time")

    if (
      score !== null &&
      (
        level === "easy" ||
        level === "medium" ||
        level === "hard"
      )
    ) {
      setSharedScore(
        Number(score)
      )

      setSharedDifficulty(
        level
      )

      setSharedMoves(
        moves !== null
          ? Number(moves)
          : null
      )

      setSharedTime(
        time !== null
          ? Number(time)
          : null
      )

      setScreen("shared")
    }
  }, [])

  /*
  ============================================================
  HOME
  ============================================================
  */

  const goHome = () => {
    window.history.replaceState(
      {},
      "",
      window.location.pathname
    )

    setScreen("home")
    setDifficulty(null)
    setCurrentPuzzle(null)
    setCurrentWord("")
    setWordHistory([])
    setMessage("")
    setSeconds(0)
    setGameFinished(false)
    setAttemptScore(0)

    setSharedScore(null)
    setSharedDifficulty(null)
    setSharedMoves(null)
    setSharedTime(null)
  }

  /*
  ============================================================
  WORD TRACE LEVEL SCREEN
  ============================================================
  */

  const openWordTrace = () => {
    setScreen(
      "wordtrace-level"
    )
  }

  /*
  ============================================================
  START GAME
  ============================================================
  */

  const startWordTrace = (
    level
  ) => {
    const puzzle =
      getDailyPuzzle(level)

    if (!puzzle) {
      console.error(
        "No puzzle found for level:",
        level
      )

      return
    }

    window.history.replaceState(
      {},
      "",
      window.location.pathname
    )

    setDifficulty(level)

    setCurrentPuzzle(
      puzzle
    )

    setCurrentWord(
      puzzle.start
    )

    setWordHistory([
      puzzle.start,
    ])

    setMessage("")
    setSeconds(0)
    setGameFinished(false)
    setAttemptScore(0)

    setSharedScore(null)
    setSharedDifficulty(null)
    setSharedMoves(null)
    setSharedTime(null)

    setScreen("wordtrace")
  }

  /*
  ============================================================
  TIMER
  ============================================================
  */

  useEffect(() => {
    if (
      screen !== "wordtrace" ||
      gameFinished
    ) {
      return
    }

    const timer =
      setInterval(() => {
        setSeconds(
          (previous) =>
            previous + 1
        )
      }, 1000)

    return () =>
      clearInterval(timer)
  }, [
    screen,
    gameFinished,
  ])

  /*
  ============================================================
  ONE LETTER CHANGE
  ============================================================
  */

  const isOneLetterChange = (
    oldWord,
    newWord
  ) => {
    if (
      oldWord.length !==
      newWord.length
    ) {
      return false
    }

    let differences = 0

    for (
      let i = 0;
      i < oldWord.length;
      i++
    ) {
      if (
        oldWord[i] !==
        newWord[i]
      ) {
        differences++
      }
    }

    return differences === 1
  }

  /*
  ============================================================
  LOCAL DICTIONARY CHECK
  ============================================================
  */

  const checkDictionary = (
    word
  ) => {
    return words.has(
      word.toUpperCase()
    )
  }

  /*
  ============================================================
  SCORE
  ============================================================

  Score is ONLY calculated when the player finishes.

  IMPORTANT:
  - Score is never displayed during gameplay.
  - A completed puzzle can never score 0.
  - Resetting the route does NOT reset the timer.
  - Resetting the route starts the route again from START.
  - The final score uses the total elapsed time and
    the number of moves in the successful route.

  ============================================================
  */

  const calculateScore = (
    moves,
    timeTaken
  ) => {
    const movePenalty =
      Math.max(
        0,
        moves - 3
      ) * 10

    const timePenalty =
      Math.floor(
        timeTaken / 30
      ) * 2

    const calculated =
      100 -
      movePenalty -
      timePenalty

    /*
    A player who actually completes the puzzle
    should NEVER receive zero.
    */

    return Math.max(
      1,
      calculated
    )
  }

  /*
  ============================================================
  RESET ROUTE
  ============================================================

  IMPORTANT:
  - Timer continues.
  - Score is not shown.
  - Current route is cleared.
  - Player starts again from the original START word.
  - Official score is untouched.
  - Game remains the same puzzle.

  ============================================================
  */

  const resetRoute = () => {
    if (
      !currentPuzzle ||
      gameFinished
    ) {
      return
    }

    setCurrentWord(
      currentPuzzle.start
    )

    setWordHistory([
      currentPuzzle.start,
    ])

    setMessage("")
  }

  /*
  ============================================================
  SUBMIT WORD
  ============================================================
  */

  const submitWord = (
    event
  ) => {
    event.preventDefault()

    if (
      gameFinished ||
      !currentPuzzle
    ) {
      return
    }

    const input =
      event.target.elements.word.value
        .trim()
        .toUpperCase()

    if (!input) {
      return
    }

    if (
      !isOneLetterChange(
        currentWord,
        input
      )
    ) {
      setMessage(
        "You can only change one letter at a time."
      )

      return
    }

    if (
      wordHistory.includes(
        input
      )
    ) {
      setMessage(
        "You've already used that word."
      )

      return
    }

    if (
      !checkDictionary(input)
    ) {
      setMessage(
        "That word isn't in the dictionary."
      )

      return
    }

    const newHistory = [
      ...wordHistory,
      input,
    ]

    setWordHistory(
      newHistory
    )

    setCurrentWord(
      input
    )

    setMessage("")

    event.target.reset()

    /*
    ==========================================================
    WIN
    ==========================================================
    */

    if (
      input ===
      currentPuzzle.target
    ) {
      const moves =
        newHistory.length -
        1

      const score =
        calculateScore(
          moves,
          seconds
        )

      setAttemptScore(
        score
      )

      const puzzleKey =
        getPuzzleScoreKey(
          difficulty,
          currentPuzzle
        )

      const officialScore =
        lockOfficialScore(
          puzzleKey,
          score
        )

      /*
      Make sure the result screen has
      the locked official score.
      */

      setAttemptScore(
        officialScore
      )

      setGameFinished(true)

      setScreen("result")
    }
  }

  /*
  ============================================================
  SHARE SCORE
  ============================================================
  */

  const shareScore = async () => {
    if (
      !currentPuzzle ||
      !difficulty
    ) {
      return
    }

    const puzzleKey =
      getPuzzleScoreKey(
        difficulty,
        currentPuzzle
      )

    const officialScore =
      officialScores[
        puzzleKey
      ]

    const scoreToShare =
      officialScore !==
      undefined
        ? officialScore
        : attemptScore

    const moves =
      wordHistory.length -
      1

    const shareUrl =
      `${window.location.origin}` +
      `${window.location.pathname}` +
      `?score=${scoreToShare}` +
      `&level=${difficulty}` +
      `&moves=${moves}` +
      `&time=${seconds}`

    const shareText =
      `🧠 BRAIN TRACE — Word Trace\n\n` +
      `I scored ${scoreToShare} points!\n\n` +
      `Can you beat my score?\n\n` +
      `Play Brain Trace 👇`

    if (
      navigator.share
    ) {
      try {
        await navigator.share({
          title:
            "BRAIN TRACE — Word Trace",
          text: shareText,
          url: shareUrl,
        })

        return
      } catch (error) {
        if (
          error.name ===
          "AbortError"
        ) {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${shareText}\n${shareUrl}`
      )

      setMessage(
        "Your score link has been copied!"
      )
    } catch (error) {
      window.prompt(
        "Copy your score link:",
        shareUrl
      )
    }
  }

  /*
  ============================================================
  SHARED SCORE SCREEN
  ============================================================
  */

  const renderSharedScore =
    () => {
      const levelName =
        sharedDifficulty === "easy"
          ? "Easy"
          : sharedDifficulty === "hard"
            ? "Hard"
            : "Medium"

      return (
        <section className="game-screen">

          <div className="game-navigation">

            <button
              className="home-button"
              onClick={goHome}
            >
              ← Home
            </button>

          </div>

          <div
            className="result-screen"
            style={{
              position:
                "relative",
            }}
          >

            <div
              style={{
                fontSize:
                  "3.5rem",
                marginBottom:
                  "15px",
              }}
            >
              🧠
            </div>

            <p className="eyebrow">
              BRAIN TRACE · WORD TRACE
            </p>

            <h1 className="result-title">
              Can you beat them?
            </h1>

            <p className="result-subtitle">
              Someone has challenged
              you to today's
              Word Trace.
            </p>

            <div className="official-score-card">

              <div className="official-label">
                THEIR SCORE
              </div>

              <div className="official-score-number">
                {sharedScore}
              </div>

              <div className="official-points">
                POINTS
              </div>

            </div>

            <p
              style={{
                marginTop:
                  "20px",
                fontWeight: 600,
              }}
            >
              {levelName} ·
              Score to beat:{" "}
              {sharedScore}
            </p>

            <p
              style={{
                maxWidth:
                  "500px",
                margin:
                  "15px auto 30px",
                lineHeight: 1.6,
              }}
            >
              The answer is hidden.
              Play the challenge
              yourself and see if
              you can beat their
              score.
            </p>

            <button
              className="play-again-button"
              onClick={() =>
                startWordTrace(
                  sharedDifficulty
                )
              }
            >
              Play This Challenge
            </button>

            <button
              className="back-to-games-result"
              onClick={goHome}
            >
              Back to Home
            </button>

          </div>

        </section>
      )
    }

  /*
  ============================================================
  HOME
  ============================================================
  */

  const renderHome = () => (
    <>
      <section className="hero">

        <p className="eyebrow">
          YOUR DAILY BRAIN BREAK
        </p>

        <h1>
          Ready for your
          <br />
          next challenge?
        </h1>

        <p className="description">
          Four fresh challenges
          every day. Test your
          words, numbers, memory
          and speed.
        </p>

      </section>

      <section className="games">

        <div className="section-heading">

          <p>
            TODAY'S CHALLENGES
          </p>

          <h2>
            Choose your game
          </h2>

        </div>

        <div className="game-grid">

          {games.map(
            (
              game,
              index
            ) => (

              <div
                key={game.id}
                className={`game-card ${game.className}`}
              >

                <div className="game-icon">
                  {game.icon}
                </div>

                <p className="game-number">
                  0{index + 1}
                </p>

                <h3>
                  {game.title}
                </h3>

                <p>
                  {game.description}
                </p>

                <button
                  onClick={
                    game.id ===
                    "wordtrace"
                      ? openWordTrace
                      : undefined
                  }
                >
                  Play{" "}
                  {game.title}
                </button>

              </div>
            )
          )}

        </div>

      </section>

      <section className="daily-message">

        <div className="message-icon">
          🧠
        </div>

        <h2>
          Your commute just
          got
          <br />
          a little more
          interesting.
        </h2>

        <p>
          Come back tomorrow
          for four new
          challenges.
        </p>

      </section>
    </>
  )

  /*
  ============================================================
  WORD TRACE LEVEL SELECTION
  ============================================================
  */

  const renderWordTraceLevels =
    () => {
      const puzzleNumber =
        String(
          getDailyPuzzleIndex() + 1
        ).padStart(3, "0")

      return (
        <section className="game-screen">

          <div className="game-navigation">

            <button
              className="home-button"
              onClick={goHome}
            >
              ← Home
            </button>

          </div>

          <div className="game-screen-content">

            {/* DAILY PUZZLE */}

            <div
              style={{
                marginBottom:
                  "25px",
                textAlign:
                  "center",
              }}
            >

              <p className="eyebrow">
                TODAY'S WORD TRACE
              </p>

              <h1
                style={{
                  marginBottom:
                    "8px",
                }}
              >
                Puzzle #{puzzleNumber}
              </h1>

              <p
                style={{
                  margin: 0,
                  opacity: 0.7,
                }}
              >
                A new puzzle arrives
                every day at midnight.
              </p>

            </div>

            <p className="eyebrow">
              HOW TO PLAY
            </p>

            <h2>
              Change one letter at a time.
            </h2>

            <p className="description">
              Every word must be a real
              word. Keep changing one
              letter until you reach the
              target.
            </p>

            {/* EXAMPLE */}

            <div
              style={{
                maxWidth: "700px",
                margin: "35px auto 50px",
                padding: "30px 25px",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >

              <p
                style={{
                  marginBottom:
                    "25px",
                  fontWeight: 700,
                  fontSize:
                    "0.85rem",
                  letterSpacing:
                    "0.12em",
                }}
              >
                FOR EXAMPLE
              </p>

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  gap: "12px",
                  flexWrap:
                    "wrap",
                  marginBottom:
                    "25px",
                }}
              >

                <span
                  style={{
                    fontSize:
                      "2.2rem",
                    fontWeight:
                      900,
                    color:
                      "#2f80ed",
                  }}
                >
                  CAT
                </span>

                <span
                  style={{
                    fontSize:
                      "1.5rem",
                    opacity: 0.5,
                  }}
                >
                  →
                </span>

                <span
                  style={{
                    fontSize:
                      "1.7rem",
                    fontWeight:
                      800,
                  }}
                >
                  C
                  <span
                    style={{
                      color:
                        "#2f80ed",
                      background:
                        "#eaf3ff",
                      padding:
                        "2px 5px",
                      borderRadius:
                        "6px",
                    }}
                  >
                    O
                  </span>
                  T
                </span>

                <span
                  style={{
                    fontSize:
                      "1.5rem",
                    opacity: 0.5,
                  }}
                >
                  →
                </span>

                <span
                  style={{
                    fontSize:
                      "1.7rem",
                    fontWeight:
                      800,
                  }}
                >
                  CO
                  <span
                    style={{
                      color:
                        "#e05656",
                      background:
                        "#fff0f0",
                      padding:
                        "2px 5px",
                      borderRadius:
                        "6px",
                    }}
                  >
                    G
                  </span>
                </span>

                <span
                  style={{
                    fontSize:
                      "1.5rem",
                    opacity: 0.5,
                  }}
                >
                  →
                </span>

                <span
                  style={{
                    fontSize:
                      "2.2rem",
                    fontWeight:
                      900,
                    color:
                      "#e05656",
                  }}
                >
                  DOG
                </span>

              </div>

              <p
                style={{
                  margin: 0,
                  lineHeight:
                    1.7,
                  fontSize:
                    "1rem",
                }}
              >
                Start with{" "}
                <strong>CAT</strong>.
                Change just{" "}
                <strong>
                  one letter
                </strong>{" "}
                at a time.
                Every step must
                be a real word.
                Keep going until
                you reach{" "}
                <strong>DOG</strong>.
              </p>

            </div>

            {/* DIFFICULTY */}

            <h2
              style={{
                marginBottom:
                  "10px",
              }}
            >
              Choose your difficulty
            </h2>

            <p
              style={{
                marginBottom:
                  "30px",
              }}
            >
              Pick the challenge
              that suits you.
            </p>

            <div className="difficulty-grid">

              {/* EASY */}

              <div
                className="difficulty-card easy"
                style={{
                  borderTop:
                    "5px solid #58a55c",
                }}
              >

                <div className="difficulty-icon">
                  🌱
                </div>

                <p className="difficulty-number">
                  LEVEL 01
                </p>

                <h2>
                  Easy
                </h2>

                <p>
                  <strong>
                    Start here
                  </strong>
                  <br />
                  3-letter words
                  <br />
                  A quick warm-up
                </p>

                <div className="difficulty-details">

                  <span>
                    🧠 Unlimited attempts
                  </span>

                  <span>
                    ⏱ Beat the clock
                  </span>

                </div>

                <button
                  onClick={() =>
                    startWordTrace(
                      "easy"
                    )
                  }
                >
                  Play Easy
                </button>

              </div>

              {/* MEDIUM */}

              <div className="difficulty-card medium">

                <div className="difficulty-icon">
                  🚉
                </div>

                <p className="difficulty-number">
                  LEVEL 02
                </p>

                <h2>
                  Medium
                </h2>

                <p>
                  <strong>
                    The daily challenge
                  </strong>
                  <br />
                  4–5 letter words
                  <br />
                  A little trickier
                </p>

                <div className="difficulty-details">

                  <span>
                    🧠 Unlimited attempts
                  </span>

                  <span>
                    ⏱ Beat the clock
                  </span>

                </div>

                <button
                  onClick={() =>
                    startWordTrace(
                      "medium"
                    )
                  }
                >
                  Play Medium
                </button>

              </div>

              {/* HARD */}

              <div className="difficulty-card hard">

                <div className="difficulty-icon">
                  🔥
                </div>

                <p className="difficulty-number">
                  LEVEL 03
                </p>

                <h2>
                  Hard
                </h2>

                <p>
                  <strong>
                    For word puzzle experts
                  </strong>
                  <br />
                  5-letter words
                  <br />
                  Longer ladders
                </p>

                <div className="difficulty-details">

                  <span>
                    🧠 Unlimited attempts
                  </span>

                  <span>
                    ⏱ Beat the clock
                  </span>

                </div>

                <button
                  onClick={() =>
                    startWordTrace(
                      "hard"
                    )
                  }
                >
                  Play Hard
                </button>

              </div>

            </div>

          </div>

        </section>
      )
    }

  /*
  ============================================================
  WORD TRACE GAME
  ============================================================
  */

  const renderWordTrace =
    () => {
      if (!currentPuzzle) {
        return null
      }

      const moves =
        wordHistory.length -
        1

      const puzzleNumber =
        String(
          getDailyPuzzleIndex() + 1
        ).padStart(3, "0")

      return (
        <section className="game-screen">

          <div className="game-navigation">

            <button
              className="home-button"
              onClick={goHome}
            >
              ← Home
            </button>

            <button
              className="back-button"
              onClick={() =>
                setScreen(
                  "wordtrace-level"
                )
              }
            >
              ← Change level
            </button>

          </div>

          <div className="game-screen-content">

            {/* DAILY PUZZLE HEADER */}

            <div
              style={{
                textAlign:
                  "center",
                marginBottom:
                  "25px",
              }}
            >

              <p className="eyebrow">
                TODAY'S WORD TRACE
              </p>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  fontWeight:
                    700,
                  opacity: 0.7,
                }}
              >
                Puzzle #{puzzleNumber}
              </p>

            </div>

            <p className="daily-puzzle-label">
              WORD TRACE ·{" "}
              {difficulty.toUpperCase()}
            </p>

            <h1>
              Reach the target
            </h1>

            {/* CLEAR GAME RULES */}

            <div
              style={{
                maxWidth:
                  "600px",
                margin:
                  "20px auto 30px",
                padding:
                  "20px 24px",
                background:
                  "#ffffff",
                borderRadius:
                  "16px",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.06)",
                textAlign:
                  "center",
              }}
            >

              <p
                style={{
                  margin:
                    "0 0 8px",
                  fontWeight:
                    800,
                  fontSize:
                    "1.05rem",
                }}
              >
                CHANGE ONE LETTER AT A TIME
              </p>

              <p
                style={{
                  margin:
                    0,
                  lineHeight:
                    1.6,
                  opacity:
                    0.75,
                }}
              >
                Every word must be a real
                word. You can use as many
                moves as you need.
              </p>

            </div>

            {/* START → TARGET */}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap:
                  "18px",
                flexWrap:
                  "wrap",
                margin:
                  "25px auto 25px",
              }}
            >

              <div
                style={{
                  textAlign:
                    "center",
                }}
              >

                <p
                  style={{
                    margin:
                      "0 0 8px",
                    fontSize:
                      "0.75rem",
                    fontWeight:
                      800,
                    letterSpacing:
                      "0.12em",
                    opacity:
                      0.65,
                  }}
                >
                  START
                </p>

                <div
                  className="starting-word"
                >
                  {currentPuzzle.start}
                </div>

              </div>

              <div
                style={{
                  fontSize:
                    "1.8rem",
                  opacity:
                    0.45,
                }}
              >
                →
              </div>

              <div
                style={{
                  textAlign:
                    "center",
                }}
              >

                <p
                  style={{
                    margin:
                      "0 0 8px",
                    fontSize:
                      "0.75rem",
                    fontWeight:
                      800,
                    letterSpacing:
                      "0.12em",
                    opacity:
                      0.65,
                  }}
                >
                  TARGET
                </p>

                <div
                  className="target-word"
                >
                  {currentPuzzle.target}
                </div>

              </div>

            </div>

            {/* TARGET MOVES EXPLANATION */}

            <p
              className="description"
              style={{
                marginBottom:
                  "20px",
                textAlign:
                  "center",
              }}
            >
              Try to reach{" "}
              <strong>
                {currentPuzzle.target}
              </strong>{" "}
              in as few changes as possible.
            </p>

            <div className="timer-display">

              <span>
                TIME
              </span>

              <strong>
                {String(
                  Math.floor(
                    seconds / 60
                  )
                ).padStart(
                  2,
                  "0"
                )}
                :
                {String(
                  seconds % 60
                ).padStart(
                  2,
                  "0"
                )}
              </strong>

            </div>

            {/* YOUR ROUTE */}

            <div className="word-history">

              <h3>
                Your route
              </h3>

              <div className="word-history-list">

                {wordHistory.map(
                  (
                    word,
                    index
                  ) => (

                    <span
                      key={`${word}-${index}`}
                      className="history-word"
                    >
                      {word}
                    </span>

                  )
                )}

              </div>

            </div>

            <form
              className="word-input-area"
              onSubmit={
                submitWord
              }
            >

              <input
                name="word"
                type="text"
                autoComplete="off"
                maxLength={
                  currentPuzzle.start.length
                }
                placeholder="Enter next word"
                aria-label="Enter next word"
              />

              <button
                type="submit"
              >
                Submit
              </button>

            </form>

            <p className="puzzle-message">
              {message}
            </p>

            {/* RESET ROUTE */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "center",
                margin:
                  "18px 0 30px",
              }}
            >

              <button
                type="button"
                onClick={
                  resetRoute
                }
                style={{
                  background:
                    "#263238",
                  color:
                    "#ffffff",
                  border:
                    "2px solid #263238",
                  borderRadius:
                    "10px",
                  padding:
                    "11px 22px",
                  fontWeight:
                    800,
                  fontSize:
                    "0.9rem",
                  cursor:
                    "pointer",
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.12)",
                }}
              >
                ↻ Reset Route
              </button>

            </div>

            {/* GAME STATS */}

            <div
              className="game-stats"
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(140px, 1fr))",
                gap:
                  "16px",
                maxWidth:
                  "520px",
                margin:
                  "0 auto",
              }}
            >

              <div>

                <span>
                  MOVES
                </span>

                <strong>
                  {moves}
                </strong>

              </div>

              <div>

                <span>
                  TARGET MOVES
                </span>

                <strong>
                  {
                    currentPuzzle.targetMoves
                  }
                </strong>

              </div>

            </div>

            {/* SCORE IS INTENTIONALLY NOT SHOWN HERE */}

          </div>

        </section>
      )
    }

  /*
  ============================================================
  RESULT
  ============================================================
  */

  const renderResult =
    () => {
      if (!currentPuzzle) {
        return null
      }

      const moves =
        wordHistory.length -
        1

      const isPerfect =
        moves ===
        currentPuzzle.targetMoves

      const puzzleKey =
        getPuzzleScoreKey(
          difficulty,
          currentPuzzle
        )

      const officialScore =
        officialScores[
          puzzleKey
        ]

      return (
        <section className="game-screen">

          <div className="game-navigation">

            <button
              className="home-button"
              onClick={goHome}
            >
              ← Home
            </button>

            <button
              className="back-button"
              onClick={() =>
                setScreen(
                  "wordtrace-level"
                )
              }
            >
              Play another level
            </button>

          </div>

          <div className="result-screen">

            {/* OFFICIAL SCORE AT TOP */}

            <div
              style={{
                marginBottom:
                  "25px",
              }}
            >

              <div className="official-score-card">

                <div className="official-label">
                  SCORE
                </div>

                <div className="official-score-number">
                  {officialScore}
                </div>

                <div className="official-points">
                  POINTS
                </div>

              </div>

            </div>

            {isPerfect && (

              <div className="confetti-container">

                <span className="confetti confetti-1" />
                <span className="confetti confetti-2" />
                <span className="confetti confetti-3" />
                <span className="confetti confetti-4" />
                <span className="confetti confetti-5" />
                <span className="confetti confetti-6" />
                <span className="confetti confetti-7" />
                <span className="confetti confetti-8" />
                <span className="confetti confetti-9" />
                <span className="confetti confetti-10" />
                <span className="confetti confetti-11" />
                <span className="confetti confetti-12" />

              </div>

            )}

            {isPerfect && (

              <div className="result-celebration">
                🎉
              </div>

            )}

            <p className="eyebrow">
              TODAY'S WORD TRACE
            </p>

            <p
              style={{
                marginBottom:
                  "5px",
                opacity:
                  0.7,
                fontWeight:
                  700,
              }}
            >
              Puzzle #
              {String(
                getDailyPuzzleIndex() + 1
              ).padStart(3, "0")}
            </p>

            <p className="eyebrow">
              WORD TRACE ·{" "}
              {difficulty.toUpperCase()}
            </p>

            <h1 className="result-title">

              {isPerfect
                ? "PERFECT!"
                : "YOU DID IT!"}

            </h1>

            <p className="result-subtitle">

              {isPerfect
                ? "You found the shortest route."
                : "You reached the target!"}

            </p>

            <div
              className="final-time"
              style={{
                marginTop:
                  "25px",
              }}
            >

              <span>
                TIME
              </span>

              <strong>

                {String(
                  Math.floor(
                    seconds / 60
                  )
                ).padStart(
                  2,
                  "0"
                )}

                :

                {String(
                  seconds % 60
                ).padStart(
                  2,
                  "0"
                )}

              </strong>

            </div>

            <p className="result-description">

              You reached{" "}

              <strong>
                {
                  currentPuzzle.target
                }
              </strong>{" "}

              in{" "}

              <strong>
                {moves} changes
              </strong>.

            </p>

            <div className="result-history">

              <div className="word-history-list">

                {wordHistory.map(
                  (
                    word,
                    index
                  ) => (

                    <span
                      key={`${word}-${index}`}
                      className="history-word"
                    >
                      {word}
                    </span>

                  )
                )}

              </div>

            </div>

            {/* SIMPLE FINAL STATS */}

            <div className="result-stats">

              <div className="result-stat">

                <span>
                  CHANGES
                </span>

                <strong>
                  {moves}
                </strong>

              </div>

              <div className="result-stat">

                <span>
                  TARGET MOVES
                </span>

                <strong>
                  {
                    currentPuzzle.targetMoves
                  }
                </strong>

              </div>

              <div className="result-stat">

                <span>
                  SCORE
                </span>

                <strong>
                  {officialScore}
                </strong>

              </div>

            </div>

            <div
              style={{
                marginTop:
                  "30px",
                display:
                  "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                gap: "12px",
              }}
            >

              <button
                className="play-again-button"
                onClick={
                  shareScore
                }
                style={{
                  minWidth:
                    "230px",
                }}
              >
                📤 Share My Score
              </button>

              {message && (

                <p
                  style={{
                    marginTop:
                      "5px",
                    fontWeight:
                      600,
                  }}
                >
                  {message}
                </p>

              )}

            </div>

            <div
              style={{
                marginTop:
                  "20px",
              }}
            >

              <button
                className="play-again-button"
                onClick={() =>
                  startWordTrace(
                    difficulty
                  )
                }
              >
                Play Again
              </button>

              <button
                className="back-to-games-result"
                onClick={() =>
                  setScreen(
                    "wordtrace-level"
                  )
                }
              >
                Choose another
                difficulty
              </button>

            </div>

          </div>

        </section>
      )
    }

  /*
  ============================================================
  MAIN SCREEN
  ============================================================
  */

  return (
    <div className="app">

      <header className="header">

        <div
          className="logo"
          onClick={goHome}
          style={{
            cursor:
              "pointer",
          }}
        >
          BRAIN TRACE
        </div>

        <div className="tagline">
          4 puzzles. Every day.
        </div>

      </header>

      <main>

        {screen ===
          "home" &&
          renderHome()}

        {screen ===
          "wordtrace-level" &&
          renderWordTraceLevels()}

        {screen ===
          "wordtrace" &&
          renderWordTrace()}

        {screen ===
          "result" &&
          renderResult()}

        {screen ===
          "shared" &&
          renderSharedScore()}

      </main>

      <footer className="footer">

        <p>
          © 2026 BRAIN TRACE
        </p>

        <p>
          Think. Play. Repeat.
        </p>

      </footer>

    </div>
  )
}

export default App