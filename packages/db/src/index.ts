import type { Database, Tables } from "./database.types.js";
import client from "./client";

type Sentence = Tables<"sentences">;
type Kanji = Tables<"kanji">;
type Member = Tables<"members">;
type Member2 = Tables<"members2">;

export type { Tables, Database, Sentence, Kanji, Member, Member2 };
export * from "@supabase/supabase-js";
export { client };
