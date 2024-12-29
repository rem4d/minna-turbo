import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { clamp } from "../util/math";
import { Kanji, Sentence } from "../types";
import { analyze } from "../util/analyze";

export const sentenceRouter = router({
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
    .input(z.object({ maxPerPage: z.number().gt(0), page: z.number().gt(0) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("sentences")
        .select()
        .eq("source", "source2")
        .gt("level", 0)
        .lt("level", 500)
        .not("updated_at", "is", null)
        .range(input.page, input.page + input.maxPerPage);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  getRandomized: publicProcedure.query(async ({ ctx }) => {
    const level = 80;
    const shift = 60;
    const numberOfUnknownKanji = 2;

    const { data } = await ctx.db
      .from("sentences")
      .select("*")
      .lte("level", level)
      // TODO: REMOVE LATER
      .eq("source", "source2")
      .lte("unknown_kanji_number", numberOfUnknownKanji)
      .gte("level", clamp(level - shift, 0, level))
      .order("level", { ascending: false });
    return data;
  }),
  getStatementsForLevel: publicProcedure.query(async ({ ctx }) => {
    const level = 80;
    const shift = 60;
    const numberOfUnknownKanji = 2;

    const { data: sentences } = await ctx.db
      .from("sentences")
      .select("*")
      .lte("level", level)
      // TODO: REMOVE LATER
      .eq("source", "source2")
      .lte("unknown_kanji_number", numberOfUnknownKanji)
      .gte("level", clamp(level - shift, 0, level))
      .order("level", { ascending: false });

    const userKanjiMap = new Map<string, Kanji>();
    const { data: userKanjis } = await ctx.db
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

      const { data: foundA } = await ctx.db
        .rpc("additional_sentences_p", {
          k_set_input: frequency,
          lvl_input: level,
        })
        .select();

      console.log(`Found: ${foundA?.length} sentences.`);

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
      // redisClient.setEx(
      //   `${level}-${shift}`,
      //   60 * 60,
      //   JSON.stringify({ sentences, additional }),
      // );
    }
    return { sentences, additional };
  }),
  analyzeRawForSource: publicProcedure.query(async ({ ctx }) => {
    const source = "source2";
    const data = await ctx.db
      .from("sentences")
      .select("*")
      .eq("source", source);
    const newSentences: Sentence[] = [];

    const MAX = 1000000000;

    if (data.data) {
      let cnt = 0;
      console.log(
        `Found ${data.data.length} sentences for source "${source}".`,
      );

      const allKanjiMap = new Map<string, Kanji>();
      const { data: kanjis } = await ctx.db.from("kanji").select();
      if (kanjis) {
        kanjis.forEach((d) => {
          allKanjiMap.set(d.kanji, d);
        });
      }
      for (const s of data.data) {
        if (cnt > MAX) break;
        console.log(`Processing ${s.id}`);
        const result = await analyze(s, allKanjiMap);
        newSentences.push({
          updated_at: "",
          id: s.id,
          text: s.text,
          en: s.en,
          ru: s.ru,
          created_at: s.created_at,
          source: s.source,
          translation: s.translation,
          // new fields
          text_with_furigana: result.textWithHiragana,
          ruby: result.ruby,
          level: result.newLevel,
          unknown_kanji_number: result.unknownKanjiNumber,
        });
        cnt++;
      }

      await ctx.db.from("sentences").upsert(newSentences, { onConflict: "id" });
      console.log("Done.");
    }
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
// satisfies TRPCRouterRecord;
