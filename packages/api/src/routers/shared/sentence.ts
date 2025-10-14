import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { getStatementsForLevel } from "../util/getStatementsForLevel";

export const sentenceRouter = router({
  getSentencesForLevel: publicProcedure
    .input(
      z.object({
        level: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const shift = 0;
      const numberOfUnknownKanji = 3;
      console.log("find for level: ", input.level);

      const { sentences, additional } = await getStatementsForLevel({
        level: input.level,
        shift,
        numberOfUnknownKanji,
        db: ctx.db,
        redis: ctx.redis,
      });
      return { sentences, additional };
    }),
  // glosses: publicProcedure
  //   .input(z.object({ id: z.number() }))
  //   .query(async ({ input, ctx }) => {
  //     const { data, error } = await ctx.db
  //       .from("gloss_sentence")
  //       .select("*,...glosses(id, kana,romaji,comment)")
  //       .eq("sentence_id", Number(input.id));
  //
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //
  //     return data;
  //   }),
  aiGlosses: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("aigloss_sentence")
        .select("*,...aiglosses(id,kana,comment,number,is_hidden)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }
      const data_ = data.filter((d) => !d.is_hidden);

      return data_;
    }),
  gptGlosses: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("gpt_gloss_sentence")
        .select("*,...gpt_glosses(id,kana,comment,number,is_hidden)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }
      const data_ = data.filter((d) => !d.is_hidden);

      return data_;
    }),
  normalGlosses: publicProcedure
    .input(z.object({ sentenceId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .rpc("glosses_by_sentence_id", {
          sentence_id_arg: input.sentenceId,
        })
        .select("*");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  glosses2: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("gloss_sentence")
        .select("*, ...glosses(id,code,kana,comment,is_hidden)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
});
