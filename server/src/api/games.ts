import { Request, Response } from 'express';
import kgsClient from '../kgsClient';

const games = async (req: Request, res: Response) => {
  const extended = 'extended' in req.query;

  const { name } = req.params;

  const data = await kgsClient.getGames(name);

  data.sort(({ timestamp: date1 }, { timestamp: date2 }) => (date1 < date2 ? 1 : -1));

  if (extended) {
    res.json(data);
    return;
  }

  res.json(data.slice(0, 2));
};

export default games;
