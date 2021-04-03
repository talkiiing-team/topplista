import { Request, Response } from 'express';
import client from '../kgs/client';

const game = async (req: Request, res: Response) => {
  const { timestamp } = req.params;

  const id = await client.getGame(timestamp);

  const { gameDeliver } = client;
  gameDeliver.wait(id, () => {
    console.log('Got a game in callback');
    // We listen for ANY data in gameDeliver container because KGS
    // responds without an unique ID for the game
    const data = gameDeliver.receive(id);
    if (data) {
      res.json(data);
    }
  });
};

export default game;
