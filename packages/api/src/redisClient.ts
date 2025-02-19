import * as redis from "redis";

const client = redis.createClient();

const init = async () => {
  await client.connect();
  client.on("error", (err) => console.log("Redis Client Error", err));
};

void init();
export default client;
