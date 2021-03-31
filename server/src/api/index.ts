import { Router } from 'express';
import leaderboard from './leaderboard';

const api = Router();

api.get('/leaderboard', leaderboard);

export default api;
