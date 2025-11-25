import type { Database, Kanji, Sentence, SupabaseClient } from "@rem4d/db";
// import { analyze } from "@rem4d/tokenizer";
import { clamp } from "@rem4d/utils";

import type { RedisClientType } from "../../trpc";

export const getStatementsForLevel = async ({
  level,
  shift,
  numberOfUnknownKanji,
  db,
  redis,
}: {
  level: number;
  shift: number;
  numberOfUnknownKanji: number;
  db: SupabaseClient<Database>;
  redis: RedisClientType;
}) => {
  // const cached = await redis.get(`${level}-${shift}`);
  // const isProd = true; // process.env.NODE_ENV !== "development";
  // if (cached && isProd) {
  //   const arr = JSON.parse(cached) as {
  //     additional: Sentence[];
  //     sentences: Sentence[];
  //   };
  //   return arr;
  // }

  const { data: sentences, error } = await db
    .from("sentences_jlpt5")
    .select("*")
    .lte("level", level)
    .gt("level", clamp(level - shift, 0, level))
    .not("ru", "is", null)
    .not("en", "is", null)
    // .lte("unknown_kanji_number", numberOfUnknownKanji)
    .limit(20);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  console.log(`Found: ${sentences.length} native sentences.`);
  const additional: Sentence[] = [];

  console.log(`Write cache for key: "${level}-${shift}"`);

  void redis.set(
    `${level}-${shift}`,
    JSON.stringify({ sentences, additional }),
    {
      EX: 24 * 60 * 60 * 60, // expire in 3 months
    },
  );
  return { sentences, additional };
};

// remove later
/*
  const userKanjiMap = new Map<string, Kanji>();
  const { data: userKanjis } = await db
    .from("kanji")
    .select()
    .lte("position", level);
  if (userKanjis) {
    userKanjis.forEach((d) => {
      userKanjiMap.set(d.kanji, d);
    });
  }


  if (userKanjiMap.size > 0) {
    const keys = [...userKanjiMap.keys()];
    const kanjiString = keys.join("");
    // console.log(kanjiString);

    console.log(`Searching sentences for ${kanjiString}...`);
    const frequency = 3;

    const { data: foundA } = await db
      .rpc("additional_sentences_p", {
        k_set_input: frequency,
        lvl_input: level,
      })
      .select();
    // .order('level', { ascending: false})

    console.log(`Found: ${foundA?.length} additional sentences.`);

    // add furigana to any unknown_by_user kanji in the sentence
    if (foundA) {
      for (const addit of foundA) {
        const result = await analyze(addit.text, userKanjiMap);
        if (result.newLevel > 500) {
          continue;
        }
        additional.push({
          ...addit,
          //new fields
          text_with_furigana: result.textWithHiragana,
          ruby: result.ruby,
          level: result.newLevel,
          unknown_kanji_number: result.unknownKanjiNumber,
          created_at: "",
          source: "",
          status: "",
          translation: null,
          updated_at: "",
          tmp: null,
          tmp_gloss: null,
          comment: null,
          is_invalid: false,
        });
      }
    } else {
      console.log(`No sentences found for : ${kanjiString} `);
    }

    console.log(`Write cache for key: "${level}-${shift}"`);

    void redis.set(
      `${level}-${shift}`,
      JSON.stringify({ sentences, additional }),
      {
        EX: 24 * 60 * 60 * 60, // expire in 3 months
      },
    );
  }
  */
