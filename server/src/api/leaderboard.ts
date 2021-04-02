import { Request, Response } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { Game } from '../kgsClient.d';
import client from '../kgs/client';

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
    const dataDetailed = await Promise.all(data.map(async (v) => {
      const { name } = v;
      console.log('attempting to get', name);
      try {
        const id = await client.getGames(name);

        const games = await client.gamesDeliver.get(id);
        console.log('got', name);
        // const games = await kgsClient.getGames(name);
        games.sort(({ timestamp: date1 }, { timestamp: date2 }) => (date1 < date2 ? 1 : -1));
        return {
          ...v,
          games: games.slice(0, 2),
        };
      } catch (e) {
        // console.log(e);
        return v;
      }
    }));

    res.json(dataDetailed);
    return;
  }
  res.json(data);
};

export default leaderboard;
