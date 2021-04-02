import { Request, Response } from 'express';
import client from '../kgs/client';

const game = async (req: Request, res: Response) => {
  const { timestamp } = req.params;

  const id = await client.getGame(timestamp);

  const { gameDeliver } = client;
  gameDeliver.wait(id, (gotTimestamp) => {
    if (gotTimestamp === timestamp) {
      console.log('Got timestamp === timestamp');
      const data = gameDeliver.receive(id);
      if (data) {
        (data as any).sort(({ timestamp: date1 }: any, { timestamp: date2 }: any) => (
          date1 < date2 ? 1 : -1));
        res.json(data);
      }
    }
  });
};

export default game;
