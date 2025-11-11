import type { Database, Tables } from "./database.types.js";
import client from "./client";

type Sentence = Tables<"sentences">;
type Kanji = Tables<"kanji">;
type Member2 = Tables<"members2">;
type Member = Tables<"members">;
type MemberJmdictEntry = Tables<"member_jmdict_entry">;

export type {
  Tables,
  Database,
  Sentence,
  Kanji,
  Member2,
  Member,
  MemberJmdictEntry,
};
export * from "@supabase/supabase-js";
export { client };
