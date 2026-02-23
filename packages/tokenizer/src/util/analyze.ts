import type { Kanji } from "@minna/db";
import { tokenize } from "./tokenize";
import { createRubySentence, createRubyToken } from "./createRuby";

export const analyze = async (
  text: string,
  knownKanjiMap: Map<string, Kanji>,
) => {
  let textWithHiraganaOutputHtml = "";
  let unknownKanjis = "";
  let knownKanjis = "";

  let tmpText: string | undefined = undefined;

  if (!text) {
    throw new Error(
      `Invalid sentence (no .text property): ${JSON.stringify(text, null, 2)} `,
    );
  }

  // replace "floor" kanji to かい
  if (/(?<=[一二三四五六七八く十])階/.test(text)) {
    tmpText = text.replace(/階/g, "かい");
  }

  // replace "ともだち" kanji
  if (/(?<=子)供/.test(text)) {
    tmpText = text.replace(/供/g, "ども");
  }

  // console.log(`Checking sentence: ${text}`);
  const tokens = await tokenize(tmpText ?? text);
  // console.log(tokens);
  for (const token of tokens) {
    let unknownInToken = "";
    let knownInToken = "";
    let needReplace = false;
    let totalAmount = 0;

    // check kanjis in token
    for (const k of token.original) {
      const reg = /[一-龠]+/;

      if (reg.test(k)) {
        totalAmount++;
        // console.log(`Found kanji in token: ${k}`);
        if (!knownKanjiMap.get(k)) {
          // console.log(`This kanji is unknown!`);
          unknownInToken += k;
          needReplace = true;
        } else {
          knownInToken += k;
        }
      }
    }

    // solid check
    if (
      unknownInToken.length > 0 &&
      totalAmount === unknownInToken.length + knownInToken.length
    ) {
      unknownInToken += knownInToken;
      knownInToken = "";
    }

    unknownKanjis += unknownInToken;
    knownKanjis += knownInToken;

    // if need replace, replace
    if (needReplace) {
      textWithHiraganaOutputHtml += createRubyToken(token);
    } else {
      textWithHiraganaOutputHtml += token.original;
    }
  }

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
    newLevel: level,
    textWithHiragana: textWithHiraganaOutputHtml,
    ruby: createRubySentence(tokens),
    unknownKanjiNumber: unknownKanjis.length,
  };
};
