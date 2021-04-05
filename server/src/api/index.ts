import { Router } from 'express';
import queue from 'express-queue';
import leaderboard from './leaderboard';
import game from './game';
import games from './games';
import app from '../app';

const api = Router();

api.get('/leaderboard', leaderboard);
api.get('/games/:name', games);

// The reason for the queue approach is that KGS responds without an unique ID
// for the game and we keep just a single instance of the game
api.use(queue({ activeLimit: 1, queuedLimit: -1 }));
api.get('/game/:timestamp', game);

export default api;
