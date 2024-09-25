import redis, { createClient } from "redis";

const client = createClient();
const key = 'HolbertonSchools';

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err}`));

client.on('ready', () => console.log("Redis client connected to the server"));

client.hset(key, 'Portland', '50', redis.print);
client.hset(key, 'Seattle', '80', redis.print);
client.hset(key, 'New York', '20', redis.print);
client.hset(key, 'Bogota', '20', redis.print);
client.hset(key, 'Cali', '40', redis.print);
client.hset(key, 'Paris', '2', redis.print);

client.hgetall(key, (e, r) => console.log(r));
