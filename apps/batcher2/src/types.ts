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

export type SentenceMemberInput = {
  basic_form: string;
  pos: string;
  original_sentence: string;
  pos_detail_1: string;
  en: string | null;
  is_invalid: boolean;
  is_hidden: boolean;
  other: string[];
};
