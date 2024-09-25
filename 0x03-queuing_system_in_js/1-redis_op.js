import { createClient, print } from "redis";

let client;

(async () => {
  client = createClient();

  client.on("error", (err) => console.log(`Redis client not connected to the server: ${err}`));

  client.on("ready", () => console.log("Redis client connected to the server"));
})();

const setNewSchool = (schoolName, value) => client.set(schoolName, value, print);

const displaySchoolValue = (schoolName) => client.get(schoolName, (err, reply) => console.log(reply));

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
