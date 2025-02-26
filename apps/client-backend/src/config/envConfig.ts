import dotenv from "dotenv";
// import { cleanEnv, host, port, str, testOnly } from "envalid";

dotenv.config();

// export const env = cleanEnv(process.env, {
// NODE_ENV: str({
//   devDefault: testOnly("test"),
//   choices: ["development", "production", "test"],
// }),
// HOST: host({ default: "localhost", devDefault: testOnly("localhost") }),
// PORT: port({ default: 1223, devDefault: testOnly(2222) }),
// REDIS_URL: str(),
// BOT_TOKEN: str(),
// });

export const env = {
  PORT: process.env.PORT || 1223,
  HOST: process.env.HOST || "localhost",
  BOT_TOKEN: process.env.BOT_TOKEN || "",
};
