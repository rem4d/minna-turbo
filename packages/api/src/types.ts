import { Tables, Database as SDatabase } from "./db/database.types";

export type Sentence = Tables<"sentences">;
export type Kanji = Tables<"kanji">;
export type SentenceMember = Tables<"sentence_members">;
export type Database = SDatabase;

export interface MojiToken {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading: string;
  pronunciation: string;
}

export type KanjiMapped = {
  original: string;
  reading: string;
  start: number;
  end: number;
  pos: string;
  pos_detail_1: string;
  basic_form: string;
  is_kanji: boolean;
  is_kana: boolean;
  en?: string;
};

export type SentenceMemberInput = Omit<
  SentenceMember,
  "created_at" | "id" | "m_type" | "ru"
>;

export type SentenceMemberOutput = {
  basic_form: string;
  pos: string;
  pos_detail_1: string;
  html: string;
  meaning: string;
  id?: number;
};
