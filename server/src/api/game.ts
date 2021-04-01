import { Request, Response } from 'express';
import kgsClient from '../kgsClient';

const game = async (req: Request, res: Response) => {
  const { timestamp } = req.params;

  const data = await kgsClient.getGame(timestamp);

  res.json(data);
};

export default game;
