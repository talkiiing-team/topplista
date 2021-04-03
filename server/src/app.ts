import express from 'express';
import queue from 'express-queue';
import api from './api';

const app = express();

app.get('/', (req, res) => {
  res.json({
    hello: 'world',
  });
});

// The reason for the queue is that KGS responds without an unique ID for the game
// and we keep just a single instance of the game
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.use('/api', api);

export default app;
