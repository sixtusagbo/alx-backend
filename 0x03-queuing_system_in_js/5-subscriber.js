import { createClient } from "redis";

const client = createClient();
const channelName = 'holberton school channel';

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err}`));

client.on('ready', () => console.log("Redis client connected to the server"));

client.subscribe(channelName);

client.on('message', (channel, message) => {
  if (channel === channelName) {
    console.log(message);
  }
  if (message === 'KILL_SERVER') {
    client.unsubscribe(channelName);
    client.quit();
  }
});

