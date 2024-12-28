import { Tables } from "./database.types";

export type KanjiMapped = {
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
};

export type Sentence = Tables<"sentences">;

export type StatisticsItem = {
  kanji: string;
  lvl: number;
  cnt: number;
};

export type SentenceCreateParams = {
  text: string;
  ruby: string;
  translation: string;
  source: string;
};

export type SentenceUpdateParams = {
  text: string;
  translation: string;
  ruby: string;
  textWithFurigana: string;
  en: string | null;
  ru: string | null;
};

export type FindAllParams = {
  page: number;
  maxPerPage?: number;
};

export type GetSentencesForLevelReponse = {
  sentences: Sentence[];
  additional: Sentence[];
};

export type SentenceMemberOutput = {
  html: string;
  pos: string;
  pos_detail_1: string;
  basic_form: string;
  meaning?: string;
  id?: number;
};
