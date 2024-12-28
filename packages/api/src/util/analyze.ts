import { Kanji, KanjiMapped, Sentence } from "../types";
import { tokenize } from "./tokenizer/tokenize";

export const analyze = async (
  sen: Sentence,
  knownKanjiMap: Map<string, Kanji>,
) => {
  let textWithHiraganaOutputHtml = "";
  let unknownKanjis = "";
  let knownKanjis = "";

  let tmpText: string | undefined = undefined;

  if (!sen || !sen.text) {
    throw new Error(
      `Invalid sentence (no .text property): ${JSON.stringify(sen, null, 2)} `,
    );
  }

  // replace "floor" kanji to かい
  if (/(?<=[一二三四五六七八く十])階/.test(sen.text)) {
    tmpText = sen.text.replace(/階/g, "かい");
  }

  // replace "ともだち" kanji
  if (/(?<=子)供/.test(sen.text)) {
    tmpText = sen.text.replace(/供/g, "ども");
  }

  // console.log(`Checking sentence: ${sen.text}`);
  const tokens = await tokenize(tmpText ?? sen.text);
  for (let token of tokens) {
    // console.log(`Checking token: `, token.original);
    let needReplace = false;

    // check kanjis in token
    for (let k of token.original) {
      const reg = /[一-龠]+/;

      if (reg.test(k)) {
        // console.log(`Found kanji in token: ${k}`);
        if (!knownKanjiMap.get(k)) {
          // console.log(`This kanji is unknown!`);
          unknownKanjis += k;
          needReplace = true;
        } else {
          knownKanjis += k;
        }
      }
    }
    // if need replace, replace
    if (needReplace) {
      textWithHiraganaOutputHtml += createRubyToken(token);
    } else {
      textWithHiraganaOutputHtml += token.original;
    }
  }
  // console.log(`Unknown kanjis: (${unknownKanjis.length}) `, unknownKanjis);
  // console.log(`Final sentence: ${outputHtml}`);
  //set level_processed

  const positions =
    knownKanjis.length > 0
      ? knownKanjis.split("").map((k) => {
          const existing = knownKanjiMap.get(k);
          if (existing) {
            return existing.position ?? -1;
          }
          console.log("Unexpected error: 1");
          return 0;
        })
      : [0];

  let level = Math.max(...positions);
  if (unknownKanjis.length > 0 && knownKanjis.length === 0) {
    level = 10000;
  }
  // console.log(`Unknown kanjis: (${unknownKanjis.length}) `, unknownKanjis);
  // console.log(`Final sentence: ${outputHtml}`);
  // console.log(`Level: ${level}`);

  return {
    sentenceId: sen.id,
    newLevel: level,
    textWithHiragana: textWithHiraganaOutputHtml,
    ruby: createRubySentence(tokens),
    unknownKanjiNumber: unknownKanjis.length,
  };
};

export const createRubyToken = ({ reading, original }: KanjiMapped): string => {
  if (!reading || reading === original) {
    return original;
  }

  // TODO:
  // test for middle:
  // 引き出し
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
