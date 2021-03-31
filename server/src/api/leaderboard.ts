import { Request, Response } from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

interface Place {
  place: number;
  name: string;
  rank: string;
}

const leaderboard = async (req: Request, res: Response<Place[]>) => {
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

  res.json(data);
};

export default leaderboard;
