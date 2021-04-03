interface KGSRequest {
  type: string;
  [key: string]: any;
}

interface KGSMessage {
  type: string;
  [key: string]: any;
}

interface KGSResponse {
  messages: KGSMessage[];
}

interface PlayerInfo {
  name: string;
  flags: string;
  rank: string;
  authLevel?: string;
}

interface Game {
  gameType: string;
  score: string | number;
  komi: number;
  size: number;
  players: {
    white: PlayerInfo;
    black: PlayerInfo;
  };
  timestamp: string;
}

interface Move {
  location: {
    x: number;
    y: number;
  };
  player: string;
  nodeId: number;
}

type GameDetailed = Game & {
  moveNum: number;
  global: boolean;
  roomId: number;
  channelId: number;
  handicap: number;
  moves: Move[];
}

interface Place {
  place: number;
  name: string;
  rank: string;
  games?: Game[];
}
