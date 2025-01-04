import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  SUPABASE_URL: str(),
  SUPABASE_ANON_KEY: str(),
});
