import { createClient } from "@redis/client";

const client = createClient({
  socket: {
    host: "redis_db",
    port: 6379,
  },
  // username: "default", // Use 'default' for standard password auth
  // password: process.env.REDIS_PASSWORD,
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
