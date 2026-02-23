import type { Database as SDatabase } from "@minna/db";

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

export interface KanjiMapped {
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
}

export interface MemberInput {
  basic_form: string;
  pos: string;
  original_sentence: string;
  pos_detail_1: string;
  en: string | null;
  is_invalid: boolean;
  is_hidden: boolean;
  other: string[];
}

export interface MemberOutput {
  basic_form: string;
  pos: string;
  pos_detail_1: string;
  html: string;
  meaning: string;
  ru?: string;
  id?: number;
}
