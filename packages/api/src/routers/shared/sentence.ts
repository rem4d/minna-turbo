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
  glosses: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("sentence_gloss")
        .select("*,...glosses(kana,kanji_form,references,romaji,comment)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  aiGlosses: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("sentence_aigloss")
        .select("*,...aiglosses(id,kana,comment,number,is_hidden)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }
      const data_ = data.filter((d) => !d.is_hidden);

      return data_;
    }),
});
