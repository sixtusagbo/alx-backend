import { createClient } from 'redis';

(async () => {
  let client = createClient();

  client.on('error', err =>
    console.log(`Redis client not connected to the server:  ${err}`)
  );

  client.on('ready', () => console.log('Redis client connected to the server'));
})();
