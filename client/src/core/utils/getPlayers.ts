import { Game, PlayerInfo } from '../kgs/types'

const getPlayers = (game: Game): PlayerInfo[] => {
  return Object.entries(game.players)
    .filter(([key]) => ['black', 'white'].includes(key))
    .map((value) => value[1])
}

export default getPlayers
