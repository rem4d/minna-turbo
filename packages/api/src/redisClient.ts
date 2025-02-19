import * as redis from "redis";

const url = process.env.REDIS_URL;

const client = redis.createClient({ url: url });

const init = async () => {
  await client.connect();
  client.on("error", (err) => console.log("Redis Client Error", err));
};

void init();
export default client;
