import redis, { createClient } from 'redis';
const util = require('util');

let client;

(async () => {
  client = createClient();

  client.on('error', err =>
    console.log(`Redis client not connected to the server:  ${err}`)
  );

  client.on('ready', () => console.log('Redis client connected to the server'));
})();

const getAsync = util.promisify(client.get).bind(client);

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, redis.print);
};

const displaySchoolValue = async schoolName => {
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (err) {
    console.error(err);
  }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
