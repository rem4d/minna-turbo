import dotenv from "dotenv";
// import { cleanEnv, host, port, str, testOnly } from "envalid";

dotenv.config();

/*
export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(2222) }),
});
*/
export const env = {
  PORT: process.env.PORT || 1223,
  HOST: process.env.HOST || "localhost",
};
