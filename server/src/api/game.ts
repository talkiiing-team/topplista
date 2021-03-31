import { Request, Response } from 'express';
import kgsClient from '../kgsClient';

interface Move {
  side: string,
  id: number,
  location: {
    x: number,
    y: number
  }
}

interface PlayerInfo {
  name: string;
  rank: number;
}

interface Game {
  players: {
    white: PlayerInfo;
    black: PlayerInfo;
  };
  moves: Move[]
}

const game = async (req: Request, res: Response<Game>) => {
  const { timestamp } = req.params;
  res.json(await kgsClient.request({
    type: 'ROOM_LOAD_GAME',
    timestamp,
    private: true,
    channelId: 22,
  }));
};

export default game;
