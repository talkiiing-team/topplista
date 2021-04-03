import { NextFunction, Request, Response } from 'express';
import client from '../kgs/client';

const game = async (req: Request, res: Response, next: NextFunction) => {
  const { timestamp } = req.params;

  const id = await client.getGame(timestamp);

  const { gameDeliverer } = client;
  gameDeliverer.wait(id, () => {
    // We listen for ANY data in gameDeliver container because KGS
    // responds without an unique ID for the game
    const data = gameDeliverer.receive(id);
    if (data) {
      res.json(data);
    } else {
      next(new Error(`Cannot get game with timestamp ${timestamp}`));
    }
  });
};

export default game;
