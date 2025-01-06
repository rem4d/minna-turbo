import db from "@rem4d/db/client";
import { SentenceMember } from "@rem4d/db";
import { JishoTranslate } from "./jisho";
import { tokenize } from "@rem4d/tokenizer";
// import logger from "./logger";

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

const main = async () => {
  /*
  const data = await db
    .from("sentences")
    .select()
    .eq("source", "source1")
    .gt("level", 0);

  const existingMembersMap: Map<string, SentenceMember> = new Map();

  const { data: got } = await db.from("sentence_members").select();

  if (got) {
    got.forEach((d) => {
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

  // console.log("Existing: ", existingMembersMap.size);
  const map_new = new Map<string, SentenceMemberInput>();

  if (data.data) {
    console.log(`Data length ${data.data?.length}`);

    let cnt = 1;
    let checkingIndex = 0;
    // console.log(existingMembersMap);

    for (const sentence of data.data) {
      checkingIndex++;

      const tokens = await tokenize(sentence.text);

      for (const t of tokens) {
        if (typesToIgnore.includes(t.pos)) {
          continue;
        }
        const T_KEY = mapKeyFn(t);

        if (existingMembersMap.get(T_KEY)) {
          continue;
        } else {
          const newMemberInput: SentenceMemberInput = {
            basic_form: t.basic_form,
            pos: t.pos,
            original_sentence: sentence.text,
            pos_detail_1: t.pos_detail_1,
            en: null,
            is_invalid: false,
            is_hidden: false,
            other: [],
          };

          // console.log(
          //   `Checking ${t.basic_form} from ${t.original} (${t.pos},${t.pos_detail_1}) (${checkingIndex}/${data.data.length}):`,
          // );
          const result = await JishoTranslate(t.basic_form);

          if (result.en) {
            // console.log(result.en);

            newMemberInput.en = result.en;
            map_new.set(T_KEY, newMemberInput);
          } else {
            console.log(
              `Could not parse results for: ${t.basic_form} (${t.pos})`,
            );
            newMemberInput.is_invalid = true;
          }

          // await sleep(10);
          const { error } = await db
            .from("sentence_members")
            .insert(newMemberInput);

          if (error) {
            console.log(
              `Error when insert ${newMemberInput.basic_form} (${newMemberInput.pos},${newMemberInput.pos_detail_1})`,
            );
          } else {
            console.log(
              `Inserted at ${cnt}: ${result.en} (${checkingIndex}/${data.data.length})`,
            );
          }

          cnt++;
          existingMembersMap.set(T_KEY, {
            ...newMemberInput,
            created_at: "",
            is_hidden: false,
            is_invalid: false,
            id: 0,
            m_type: "",
            other: [],
            ru: null,
          });
        }
      }
    }
  }
  */
  console.log("Done.");
  return true;
};

const typesToIgnore = [
  "assistant",
  "symbol",
  "prefix",
  "interjection",
  "フィラー",
];

type MapKeyFnType = <
  T extends { basic_form: string; pos: string; pos_detail_1: string },
>(
  arg: T,
) => string;

const mapKeyFn: MapKeyFnType = (t) =>
  `${t.basic_form}_${t.pos}_${t.pos_detail_1}`;

const sleep = async (sec: number) => {
  console.info(`Sleep ${sec} sec`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};
main();
