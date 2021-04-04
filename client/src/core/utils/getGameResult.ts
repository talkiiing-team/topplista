import { Game } from '../kgs/kgsClient'

// (positive a black win, negative a white win)
const getGameResult = (game: Game) => {
  // Scores may be a floating point number, or a string.
  // Numbers indicate the score difference (positive a black win, negative a white win).
  // Strings may be UNKNOWN, UNFINISHED, NO_RESULT, B+RESIGN, W+RESIGN, B+FORFEIT, W+FORFEIT, B+TIME, or W+TIME.
  switch (typeof game.score) {
    case 'string':
      if (['UNKNOWN', 'UNFINISHED', 'NO_RESULT'].includes(game.score)) {
        return 0
      }
      if (game.score.slice(0, 2) === 'B+') {
        return 1
      } else return -1
    case 'number':
      return game.score ? Math.sign(game.score) : 0
  }
}

export default getGameResult
