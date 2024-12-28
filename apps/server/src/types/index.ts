import { Tables } from "@/types/database.types";

export type Sentence = Tables<"sentences">;
export type Kanji = Tables<"kanji">;
export type SentenceMember = Tables<"sentence_members">;

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

export interface Tokenizer {
  tokenize: (text: string) => MojiToken[];
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

export type SentenceMemberInput = Omit<
  SentenceMember,
  "created_at" | "id" | "m_type" | "ru"
>;

export type SentenceMemberOutput = {
  html: string;
  pos: string;
  pos_detail_1: string;
  basic_form: string;
  meaning?: string;
  id?: number;
};
