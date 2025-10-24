import type { Database, Tables } from "./database.types.js";
import client from "./client";

type Sentence = Tables<"sentences">;
type Kanji = Tables<"kanji">;
type Member2 = Tables<"members2">;
type Member3 = Tables<"members3">;

export type { Tables, Database, Sentence, Kanji, Member2, Member3 };
export * from "@supabase/supabase-js";
export { client };
