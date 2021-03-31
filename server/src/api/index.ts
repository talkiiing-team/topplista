import { Router } from 'express';
import leaderboard from './leaderboard';
import game from './game';

const api = Router();

api.get('/leaderboard', leaderboard);
api.get('/game/:timestamp', game);

export default api;
