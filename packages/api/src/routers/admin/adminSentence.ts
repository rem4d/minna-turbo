import { z } from "zod";

import { publicProcedure, router } from "../../trpc";

export const adminSentenceRouter = router({
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.db
      .from("sentences")
      .select()
      .eq("id", input)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }),
  list: publicProcedure
    .input(z.object({ maxPerPage: z.number().gt(0), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("sentences")
        .select("*")
        .gt("level", 0)
        .lt("level", 500)
        // .eq("source", "10k")
        // .not("members", "is", null)
        // .like("text", `%間%`)
        // .lt("unknown_kanji_number", numberOfUnknownKanji)
        // .order("aigloss_sentence(count)", { ascending: false })
        // .order("level", { ascending: true })
        .range(
          input.page * input.maxPerPage,
          (input.page + 1) * input.maxPerPage,
        );

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.db.from("sentences").delete().eq("id", input);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }),
  // analyze: publicProcedure
  //   .input(z.string())
  //   .mutation(async ({ ctx, input }) => {
  //     const allKanjiMap = new Map<string, Kanji>();
  //     const { data: kanjis, error } = await ctx.db.from("kanji").select();
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //     kanjis.forEach((d) => {
  //       allKanjiMap.set(d.kanji, d);
  //     });
  //     const result = await analyze(input, allKanjiMap);
  //     const params = {
  //       // new fields
  //       text_with_furigana: result.textWithHiragana,
  //       ruby: result.ruby,
  //       level: result.newLevel,
  //       unknown_kanji_number: result.unknownKanjiNumber,
  //     };
  //     return params;
  //   }),
  getFurigana: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const text = input.text;

      const result = await fetch("http://127.0.0.1:5000/furigana?text=" + text);

      if (!result.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = (await result.json()) as unknown as {
        kanji: string;
        reading: string;
        start: number;
        end: number;
      }[];

      return data;
    }),
  create: publicProcedure
    .input(
      z.object({
        input: z.object({
          text: z.string(),
          ruby: z.string(),
          level: z.number(),
          text_with_furigana: z.string(),
          unknown_kanji_number: z.number(),
          en: z.string(),
          ru: z.string(),
          translation: z.string(),
          source: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createInput = input.input;

      const { error } = await ctx.db.from("sentences").insert(createInput);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        input: z.object({
          text: z.string(),
          ruby: z.string(),
          // text_with_furigana: z.string(),
          en: z.string(),
          ru: z.string(),
          comment: z.string(),
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
