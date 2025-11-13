import type { Database, Kanji, Sentence } from "@rem4d/db";
import { analyze } from "@rem4d/tokenizer";
import type { SupabaseClient } from "@rem4d/db";
import type { RedisClientType } from "../../trpc";
import { clamp } from "@rem4d/utils";

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
  const cached = await redis.get(`${level}-${shift}`);

  if (cached) {
    const arr = JSON.parse(cached) as {
      additional: Sentence[];
      sentences: Sentence[];
    };
    return arr;
  }

  const { data: sentences, error } = await db
    .from("sentences")
    .select(
      "id,text,ruby,level,text_with_furigana,en,ru,vox_file_path,vox_speaker_id",
    )
    .lte("level", level)
    .gt("level", clamp(level - shift, 0, level))
    .not("ru", "is", null)
    .not("en", "is", null)
    .in("source", ["djg", "10k", "massif"])
    .eq("status", "glossed")
    // .not("gloss_sentence()", "is", null)
    // .not("members()", "is", null)
    .lte("unknown_kanji_number", numberOfUnknownKanji);
  // .order("id")
  // .range(10, 1000);
  // .limit(1000);

  if (error) {
    throw new Error(error.message);
  }

  console.log(`Found: ${sentences.length} native sentences.`);

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

  const additional: Sentence[] = [];

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
  return { sentences, additional };
};
