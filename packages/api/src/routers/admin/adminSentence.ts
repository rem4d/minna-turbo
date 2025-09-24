import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import type { Kanji, Sentence } from "@rem4d/db";
import { analyze } from "@rem4d/tokenizer";
import { findSingleSentenceMembers } from "../util/findSentenceMembers";

export const adminSentenceRouter = router({
  // findContainingText: publicProcedure
  //   .input(
  //     z.object({
  //       text: z.string(),
  //       pos: z.string(),
  //       pos_detail: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const filterText =
  //       input.pos === "verb"
  //         ? input.text.substring(0, input.text.length - 1)
  //         : input.text;
  //
  //     const { data, error } = await ctx.db
  //       .from("sentences")
  //       .select()
  //       .like("text", `%${filterText}%`)
  //       .limit(100);
  //     if (error) {
  //       throw new Error("No sentences found.");
  //     }
  //
  //     const result: Sentence[] = [];
  //
  //     for (const sentence of data) {
  //       const _tokens = await tokenize(sentence.text);
  //       const tokens = _tokens.filter((t) => t.pos === input.pos);
  //
  //       for (const t of tokens) {
  //         if (
  //           input.text === t.basic_form &&
  //           input.pos_detail === t.pos_detail_1
  //         ) {
  //           result.push(sentence);
  //         }
  //       }
  //     }
  //
  //     return result;
  //   }),
  findFurtherMembersUpdates: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const filterText = input.text;
      const qb = ctx.db
        .from("sentences")
        .select("*, members2(*)")
        .lt("level", 500);

      if (filterText) {
        qb.like("text", `%${filterText}%`);
      }
      qb.limit(1000);

      const { data, error } = await qb;
      // console.log(data);

      if (error) {
        throw new Error("No sentences found.");
      }

      const result: {
        new_members: { id: number; basic_form: string }[];
        sentence: Sentence;
      }[] = [];

      for (const sentence of data) {
        const memberIds = await findSingleSentenceMembers(sentence);
        const existingIds = sentence.members2.map((m) => m.id);

        if (
          memberIds.toSorted().toString() !== existingIds.toSorted().toString()
        ) {
          console.log(`Found: ${sentence.id}`);
          const { data: memberData } = await ctx.db
            .from("members")
            .select("id,basic_form")
            .in("id", memberIds);

          if (memberData) {
            result.push({
              new_members: memberData,
              sentence,
            });
          } else {
            console.log("Error while retrieving member data from db");
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
      throw new Error(error.message);
    }
    return data;
  }),
  list: publicProcedure
    .input(z.object({ maxPerPage: z.number().gt(0), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const numberOfUnknownKanji = 3;

      const { data, error } = await ctx.db
        .from("sentences")
        .select()
        .neq("source", "source1")
        .gt("level", 48)
        .lt("level", 500)
        .lt("unknown_kanji_number", numberOfUnknownKanji)
        .order("level", { ascending: true })
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
  analyze: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const allKanjiMap = new Map<string, Kanji>();
      const { data: kanjis, error } = await ctx.db.from("kanji").select();
      if (error) {
        throw new Error(error.message);
      }
      kanjis.forEach((d) => {
        allKanjiMap.set(d.kanji, d);
      });
      const result = await analyze(input, allKanjiMap);
      const params = {
        // new fields
        text_with_furigana: result.textWithHiragana,
        ruby: result.ruby,
        level: result.newLevel,
        unknown_kanji_number: result.unknownKanjiNumber,
      };
      return params;
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
