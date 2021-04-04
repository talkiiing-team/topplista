import { Game } from '../kgs/kgsClient'

const getPlayers = (game: Game) => {
  return Object.entries(game.players)
    .filter(([key, _]) => ['black', 'white'].includes(key))
    .map((value) => value[1])
}

export default getPlayers
