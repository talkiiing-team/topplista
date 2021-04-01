import { Request, Response } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import BPromise from 'bluebird';
import kgsClient from '../kgsClient';
import { Game } from '../kgsClient.d';

interface Place {
  place: number;
  name: string;
  rank: string;
  games?: Game[];
}

const leaderboard = async (req: Request, res: Response<Place[]>) => {
  const extended = 'extended' in req.query;

  const response = await fetch('https://www.gokgs.com/top100.jsp');
  const html = await response.text();

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
    const dataDetailed = await BPromise.map(data, async (v) => {
      const { name } = v;
      const games = await kgsClient.getGames(name);
      games.sort(({ timestamp: date1 }, { timestamp: date2 }) => (date1 < date2 ? 1 : -1));
      return {
        ...v,
        games: games.slice(0, 2),
      };
    }, { concurrency: 1 });

    res.json(dataDetailed);
    return;
  }
  res.json(data);
};

export default leaderboard;
