import { Router } from 'express';
import leaderboard from './leaderboard';
import game from './game';
import games from './games';

const api = Router();

api.get('/leaderboard', leaderboard);
api.get('/game/:timestamp', game);
api.get('/games/:name', games);

export default api;
