import type { Database, Tables } from "./database.types.js";

type Sentence = Tables<"sentences">;
type Kanji = Tables<"kanji">;
type SentenceMember = Tables<"sentence_members">;

export type { Tables, Database, Sentence, Kanji, SentenceMember };
