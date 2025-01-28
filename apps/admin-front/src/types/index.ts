import type { Sentence } from "@rem4d/db";

export interface KanjiMapped {
  word_id: number;
  original: string;
  reading: string;
  start: number;
  end: number;
  type: string;
  basic_form: string;
  is_kanji: boolean;
  is_kana: boolean;
  en?: string;
}

export interface StatisticsItem {
  kanji: string;
  lvl: number;
  cnt: number;
}

export interface SentenceCreateParams {
  text: string;
  ruby: string;
  translation: string;
  source: string;
}

export interface SentenceUpdateParams {
  text: string;
  translation: string;
  ruby: string;
  textWithFurigana: string;
  en: string | null;
  ru: string | null;
}

export interface FindAllParams {
  page: number;
  maxPerPage?: number;
}

export interface GetSentencesForLevelReponse {
  sentences: Sentence[];
  additional: Sentence[];
}

export interface MemberOutput {
  html: string;
  pos: string;
  pos_detail_1: string;
  basic_form: string;
  meaning?: string;
  id?: number;
}
