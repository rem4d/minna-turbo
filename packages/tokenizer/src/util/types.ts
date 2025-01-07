import kuromoji from "@sglkc/kuromoji";
export type Tokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

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
