import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { clamp } from "../util/math";
import type { Database, Kanji, Sentence } from "@rem4d/db";
import { shuffle } from "../util/shuffle";
import { tokenize, analyze } from "@rem4d/tokenizer";
import type { SupabaseClient } from "@rem4d/db";
import type { RedisClientType } from "../trpc";
import { dedup } from "../util/dedup";

export const sentenceRouter = router({
  findContainingText: publicProcedure
    .input(
      z.object({
        text: z.string(),
        pos: z.string(),
        pos_detail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const filterText =
        input.pos === "verb"
          ? input.text.substring(0, input.text.length - 1)
          : input.text;

      const { data, error } = await ctx.db
        .from("sentences")
        .select()
        .like("text", `%${filterText}%`)
        .limit(100);
      if (error) {
        throw new Error("No sentences found.");
      }

      const result: Sentence[] = [];

      for (const sentence of data) {
        const _tokens = await tokenize(sentence.text);
        const tokens = _tokens.filter((t) => t.pos === input.pos);

        for (const t of tokens) {
          if (
            input.text === t.basic_form &&
            input.pos_detail === t.pos_detail_1
          ) {
            result.push(sentence);
          }
        }
      }

      return result;
    }),
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.db
      .from("sentences")
      .select()
      .eq("id", input)
      .single();
    if (error) {
      throw new Error("No sentence found.");
    }
    return data;
  }),
  list: publicProcedure
    .input(z.object({ maxPerPage: z.number().gt(0), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("sentences")
        .select()
        .eq("source", "challenge")
        // .gt("level", 0)
        // .lt("level", 500)
        // .order("updated_at", { ascending: false })
        .range(
          input.page * input.maxPerPage,
          (input.page + 1) * input.maxPerPage,
        );
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  markAsSeen: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = 2234;
      let known: number[] = [];

      const knownKey = await ctx.redis.get(`known.${userId}`);

      if (knownKey) {
        known = JSON.parse(knownKey) as number[];
      }

      const newKnown = dedup(known.concat(input.ids));

      void ctx.redis.setEx(
        `known.${userId}`,
        24 * 60 * 60,
        JSON.stringify(newKnown),
      );

      return true;
    }),
  getRandomized: publicProcedure
    .input(
      z.object({
        level: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const shift = 60;
      const level = input.level;
      const userId = 2234;
      const { sentences, additional } = await getStatementsForLevel({
        level,
        shift,
        numberOfUnknownKanji: 1,
        db: ctx.db,
        redis: ctx.redis,
      });

      let known: number[] = [];

      const knownKey = await ctx.redis.get(`known.${userId}`);

      if (knownKey) {
        known = JSON.parse(knownKey) as number[];
      }

      const sentencesFiltered = sentences.filter((s) => !known.includes(s.id));
      const additionalFiltered = additional.filter(
        (s) => !known.includes(s.id),
      );

      console.log(
        `Sentences: ${sentencesFiltered.length}, additional: ${additionalFiltered.length}`,
      );

      const shuffledS = shuffle(sentencesFiltered).slice(0, 20);
      const shuffledA = shuffle(additionalFiltered).slice(0, 2);
      const shuffled = shuffle(shuffledS.concat(shuffledA));
      // const newKnown = known.concat(shuffled.map((s) => s.id));

      // void ctx.redis.setEx(
      //   `known.${level}-${shift}`,
      //   60 * 60,
      //   JSON.stringify(newKnown),
      // );

      return shuffled;
    }),
  getStatementsForLevel: publicProcedure
    .input(
      z.object({
        level: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { sentences, additional } = await getStatementsForLevel({
        level: input.level,
        shift: 60,
        numberOfUnknownKanji: 2,
        db: ctx.db,
        redis: ctx.redis,
      });
      return { sentences, additional };
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.db.from("sentences").delete().eq("id", input);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        input: z.object({
          text: z.string(),
          ruby: z.string(),
          text_with_furigana: z.string(),
          en: z.string(),
          ru: z.string(),
          translation: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = input.id;
      const updateInput = input.input;

      const { data: existing } = await ctx.db
        .from("sentences")
        .select("*")
        .eq("id", id)
        .single();

      if (existing) {
        const { error } = await ctx.db
          .from("sentences")
          .update(updateInput)
          .eq("id", id);

        if (error) {
          console.log(`Error while updating sentence ${id}`);
          return null;
        }

        return true;
      } else {
        console.log(`No sentence found with id ${id}`);
        return null;
      }
    }),
});

const getStatementsForLevel = async ({
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
    console.log(`Return cached value`);
    return JSON.parse(cached) as {
      additional: Sentence[];
      sentences: Sentence[];
    };
  }

  const { data: sentences, error } = await db
    .from("sentences")
    .select()
    .lte("level", level)
    .eq("source", "source4")
    .lte("unknown_kanji_number", numberOfUnknownKanji)
    .gte("level", clamp(level - shift, 0, level))
    .order("level", { ascending: false });

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

    console.log(`Found: ${foundA?.length} additional sentences.`);

    // add furigana to any unknown_by_user kanji in the sentence
    if (foundA) {
      for (const addit of foundA) {
        const result = await analyze(addit, userKanjiMap);
        additional.push({
          ...addit,
          //new fields
          text_with_furigana: result.textWithHiragana,
          ruby: result.ruby,
          level: result.newLevel,
          unknown_kanji_number: result.unknownKanjiNumber,
        });
      }
    } else {
      console.log(`No sentences found for : ${kanjiString} `);
    }

    console.log(`Write cache for key: "${level}-${shift}"`);
    void redis.setEx(
      `${level}-${shift}`,
      24 * 60 * 60, // expire in seconds
      JSON.stringify({ sentences, additional }),
    );
  }
  return { sentences, additional };
};
