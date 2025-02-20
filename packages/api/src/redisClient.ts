import * as redis from "redis";

const url = process.env.REDIS_URL;

const client = redis.createClient(
  process.env.NODE_ENV === "production" ? { url: url } : undefined,
);

const init = async () => {
  await client.connect();
  client.on("error", (err) => console.log("Redis Client Error", err));
};

void init();
export default client;
