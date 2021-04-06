export interface KGSRequest {
  type: string
  [key: string]: any
}

export interface KGSMessage {
  type: string
  [key: string]: any
}

export interface KGSResponse {
  messages: KGSMessage[]
}

export interface PlayerInfo {
  name: string
  flags: string
  rank: string
  authLevel?: string
}

export interface Game {
  gameType: string
  score: string | number
  komi: number
  size: number
  players: {
    white: PlayerInfo
    black: PlayerInfo
  }
  timestamp: string
}

export interface Move {
  location: {
    x: number
    y: number
  }
  player: string
  nodeId: number
}

export interface Place {
  place: number
  name: string
  rank: string
  games?: Game[]
}

export type GameDetailed = Game & {
  moveNum: number
  global: boolean
  roomId: number
  channelId: number
  handicap: number
  moves: Move[]
}
