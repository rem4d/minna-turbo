import * as redis from "@redis/client";

const url = process.env.REDIS_URL;

const client = redis.createClient({
  url: url ?? "127.0.0.1",
});

client.on("error", (err) => {
  console.log(`Redis client error: `, JSON.stringify(err));
});

const init = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log(`Could not connect to redis server: `, JSON.stringify(err));
  }
};

void init();
export default client;
