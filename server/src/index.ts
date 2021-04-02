import app from './app';
import client from './kgs/client';

const PORT = process.env.PORT || 3000;

client.listen(() => {
  app.listen(PORT, () => console.log('Listening on', PORT));
});
