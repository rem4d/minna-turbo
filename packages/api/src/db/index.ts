import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { env } from "./envConfig";

const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);

export default supabase;
