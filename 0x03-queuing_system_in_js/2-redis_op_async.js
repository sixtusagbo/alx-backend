import { createClient, print } from "redis";
const { promisify } = require('util');

let client;

(async () => {
  client = createClient();

  client.on("error", (err) => console.log(`Redis client not connected to the server: ${err}`));

  client.on("ready", () => console.log("Redis client connected to the server"));
})();

const getAsync = promisify(client.get).bind(client);

const setNewSchool = (schoolName, value) => client.set(schoolName, value, print);

const displaySchoolValue = async (schoolName) => await getAsync(schoolName)
  .then((value) => console.log(value))
  .catch((err) => console.error(err));

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
