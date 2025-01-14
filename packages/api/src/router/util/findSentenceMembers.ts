import type { Member, Sentence } from "@rem4d/db";
import db from "@rem4d/db/client";
import { tokenize } from "@rem4d/tokenizer";

export const findSentencesMembers = async (sentences: Sentence[]) => {
  const existingMembersMap = new Map<string, Member>();

  const { data: membersData } = await db.from("members").select();

  if (membersData) {
    membersData.forEach((d) => {
      existingMembersMap.set(
        mapKeyFn({
          basic_form: d.basic_form,
          pos: d.pos,
          pos_detail_1: d.pos_detail_1,
        }),
        d,
      );
    });
  }

  let insertBulk = [] as {
    member_id: number;
    sentence_id: number;
    position: number;
  }[];

  const japaneseNameRegexGlobal =
    /([\u4E00-\u9FAF]{1,2}|[ァ-ヴ]{2,12})(?=さん)/g;
  const japaneseNameRegex = /([\u4E00-\u9FAF]{1,2}|[ァ-ヴ]{2,12})(?=さん)/;

  for (const sentence of sentences) {
    const tokens = await tokenize(sentence.text);
    const memberIds = [] as number[];

    const hasSan = japaneseNameRegex.test(sentence.text);

    const allJapaneseNameMatches = [
      ...sentence.text.matchAll(japaneseNameRegexGlobal),
    ];

    for (const token of tokens) {
      if (typesToIgnore.includes(token.pos)) {
        continue;
      }
      let isJpName = false;

      if (hasSan) {
        for (const match of allJapaneseNameMatches) {
          const name = match[1];

          // corresponding token found
          if (token.basic_form === name) {
            // ignore names but keep exceptions
            if (!theseSoundLikeJapaneseNamesButTheyAreNot.includes(name)) {
              console.log(`Found san-name: `, name, `. Ignore.`);
              isJpName = true;
              continue;
            }
          }
        }
      }

      if (isJpName) {
        continue;
      }

      const T_KEY = mapKeyFn(token);
      const member = existingMembersMap.get(T_KEY);

      if (member) {
        if (member.is_invalid || member.is_hidden) {
          continue;
        }

        // no need duplicates
        if (!memberIds.includes(member.id)) {
          memberIds.push(member.id);
        }
      } else {
        console.log(`No member was found for: `, token.basic_form);
      }
    }
    const bulk = memberIds.map((m, i) => ({
      member_id: m,
      sentence_id: sentence.id,
      position: i,
    }));

    insertBulk = insertBulk.concat(bulk);
  }

  return insertBulk;
};

type MapKeyFnType = <
  T extends { basic_form: string; pos: string; pos_detail_1: string },
>(
  arg: T,
) => string;

const mapKeyFn: MapKeyFnType = (t) =>
  `${t.basic_form}_${t.pos}_${t.pos_detail_1}`;

const typesToIgnore = [
  "assistant",
  "symbol",
  "prefix",
  "interjection",
  "フィラー",
];
// const japaneseNamesWithoutSan = ["上田"];

const theseSoundLikeJapaneseNamesButTheyAreNot = [
  "皆", // all
  "弟", // sister
  "係長",
  "女将",
  "課長",
  "医者",
  "本屋", // principal
  "課長", // chief
  "お兄", // brother
  "お父", // father
  "お客", // guest
  "お子", // child
  "お母", // mother
  "お娘", // sister
  "女優", // actress
  "花屋", // flower shop
  "歯医者", // dentist
];
