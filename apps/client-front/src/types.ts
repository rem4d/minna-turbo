import type { GetGlossesOutput } from "@minna/api";

export interface SentenceLike {
  id: number;
  text: string;
  ruby: string | null;
  text_with_furigana?: string | null;
  level: number | null;
  en: string | null;
  ru: string | null;
}

export interface ValidGloss extends GetGlossesOutput {
  code: string;
}
export function isValidGloss(d: GetGlossesOutput): d is ValidGloss {
  return typeof d.code === "string";
}
