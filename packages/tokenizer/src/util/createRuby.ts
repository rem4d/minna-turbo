import type { KanjiMapped } from "./types";

export const createRubyToken = ({ reading, original }: KanjiMapped): string => {
  if (!reading || reading === original) {
    return original;
  }

  // TODO:
  // test for middle:
  // 引き出し -> ひきだし
  // 申し上げる -> もうしあげる

  let html_beg = "";
  let html_end = "";
  const beg = /^[ぁ-ゔ]+/g;

  const orig_begin_matches = original.match(beg);
  const reading_begin_matches = original.match(beg);

  if (
    orig_begin_matches &&
    reading_begin_matches &&
    orig_begin_matches.length === reading_begin_matches.length
  ) {
    const len = orig_begin_matches[0].length;

    if (orig_begin_matches[0] === reading_begin_matches[0]) {
      html_beg = orig_begin_matches[0];
      original = original.substring(len);
      reading = reading.substring(len);
    }
  }

  const end = /[ぁ-ゔ]+$/g;

  const orig_end_matches = original.match(end);
  const reading_end_matches = original.match(end);
  if (
    orig_end_matches &&
    reading_end_matches &&
    orig_end_matches.length === reading_end_matches.length
  ) {
    const len = orig_end_matches[0].length;

    if (orig_end_matches[0] === reading_end_matches[0]) {
      html_end = orig_end_matches[0];
      original = original.substring(0, original.length - len);
      reading = reading.substring(0, reading.length - len);
    }
  }

  return `${html_beg}<ruby>${original}<rt>${reading}</rt></ruby>${html_end}`;
};

export const createRubySentence = (tokens: KanjiMapped[]): string => {
  return tokens.reduce((acc, curr) => {
    return acc + createRubyToken(curr);
  }, "");
};
