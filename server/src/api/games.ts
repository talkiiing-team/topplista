import { NextFunction, Request, Response } from 'express';
import client from '../kgs/client';

const games = async (req: Request, res: Response, next: NextFunction) => {
  const extended = 'extended' in req.query;

  const { name } = req.params;

  try {
    const id = await client.getGames(name);

    const { gamesDeliverer } = client;
    gamesDeliverer.wait(id, (gotName) => {
      if (gotName === name) {
        const data = gamesDeliverer.receive(id)?.filter(({ gameType }) => gameType !== 'demonstration');
        if (data) {
          data.sort(({ timestamp: date1 }, { timestamp: date2 }) => (date1 < date2 ? 1 : -1));

          if (extended) {
            res.json(data);
            return;
          }
          res.json(data.slice(0, 2));
          return;
        }
        next(new Error(`Cannot get games of ${name}`));
      }
    });
  } catch (e) {
    res.status(500);
    next(new Error(`Cannot get games of ${name}`));
  }
};

export default games;
