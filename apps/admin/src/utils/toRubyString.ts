import { KanjiMapped } from "../types";

export const createRubyOne = (t: KanjiMapped): string => {
  const form = "original"; // options?.form ?? "original";
  //
  // if (form === "original") {
  if (!t.reading || t.reading === t.original) {
    return t.original;
  }
  return `<ruby>${form === "original" ? t.original : t.basic_form}<rt>${t.reading}</rt></ruby>`;
  // } else {
  //   return t.is_kanji
  //     ? `<ruby>${t.basic_form}<rt>${t.reading}</rt></ruby>`
  //     : t.basic_form;
  // }
};

export const createRuby = (tokens: KanjiMapped[]): string => {
  return tokens.reduce((acc, curr) => {
    return acc + createRubyOne(curr);
  }, "");
};
