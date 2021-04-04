import express, { Request, Response, NextFunction } from 'express';
import timeout from 'connect-timeout';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import api from './api';

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.ORIGIN || '*' }));

app.get('/', (req, res) => {
  res.json({
    hello: 'world',
  });
});

// We also have to use timeout, because KGS does not return errors
// for example when user or game is not found
app.use(timeout('20s', { respond: true }));

// halt-on-timed-out middleware
app.use((req, res, next) => {
  if (!req.timedout) next();
});

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
  res.status(err.message === 'Response timeout' ? 408 : (res.statusCode || 500));
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' && err.stack,
  });
});

export default app;
