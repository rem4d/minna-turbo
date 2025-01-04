import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";
import { env } from "./envConfig";

const db = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
export default db;
