import { Game, PlayerInfo } from '../kgs/types'
import getPlayers from './getPlayers'

const getOpponent = (game: Game, player: string): PlayerInfo => {
  return getPlayers(game).filter((v) => v.name !== player)[0]
}

export default getOpponent
