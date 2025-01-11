import type { Database, Tables } from "./database.types.js";

type Sentence = Tables<"sentences">;
type Kanji = Tables<"kanji">;
type Member = Tables<"members">;

export type { Tables, Database, Sentence, Kanji, Member };
export * from "@supabase/supabase-js";
