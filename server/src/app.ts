import express, { Request, Response, NextFunction } from 'express';
import queue from 'express-queue';
import timeout from 'connect-timeout';
import api from './api';

const app = express();

app.get('/', (req, res) => {
  res.json({
    hello: 'world',
  });
});

// The reason for the queue approach is that KGS responds without an unique ID
// for the game and we keep just a single instance of the game
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

// We also have to use timeout, because KGS does not return errors
// for example when user or game is not found
app.use(timeout('20s'));

app.use('/api', api);

// 404 middleware
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not found: ${req.originalUrl}`);
  next(error);
});

// error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' && err.stack,
  });
});

export default app;
