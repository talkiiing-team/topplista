import { NextFunction, Request, Response } from 'express';
import cheerio from 'cheerio';
import axios from 'axios';
import client from '../kgs/client';

const leaderboard = async (req: Request, res: Response<Place[]>, next: NextFunction) => {
  const extended = 'extended' in req.query;

  try {
    const { data: html } = await axios.get('https://www.gokgs.com/top100.jsp');

    const data: Place[] = [];

    const $ = cheerio.load(html);

    $('table.grid tr').each((i, elem) => {
      const a: string[] = [];
      $(elem).children().each((_, child) => a.push($(child).text()));
      const place = parseInt(a[0], 10);
      const [, name, rank] = a;
      if (place) data.push({ place, name, rank });
    });

    if (extended) {
      const dataDetailed = await Promise.all(data.map(async (v) => {
        const { name } = v;
        try {
          const id = await client.getGames(name);

          const games = await client.gamesDeliverer.get(id);
          games.sort(({ timestamp: date1 }, { timestamp: date2 }) => (date1 < date2 ? 1 : -1));

          return {
            ...v,
            games: games ? games.slice(0, 2) : [],
          };
        } catch (e) {
          return v;
        }
      }));

      res.json(dataDetailed);
      return;
    }
    res.json(data);
  } catch (e) {
    res.status(500);
    next(new Error('Cannot get leaderboard'));
  }
};

export default leaderboard;
