import { Game } from '../kgs/kgsClient'
import getPlayers from './getPlayers'

const getOpponent = (game: Game, player: string) => {
  return getPlayers(game).filter((v) => v.name !== player)[0]
}

export default getOpponent
