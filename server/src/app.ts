import express from 'express';
import api from './api';

const app = express();

app.get('/', (req, res) => {
  res.json({
    hello: 'world',
  });
});

app.use('/api', api);

export default app;
