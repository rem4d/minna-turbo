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
        .from("gloss_sentence")
        .select("*, ...glosses(id,code,kana,comment,is_hidden,romaji)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // type DataType = (typeof data)[number];
        // interface ValidGloss extends DataType {
        //   code: string;
        // }
        //
        // function isValid(d: DataType): d is ValidGloss {
        //   return typeof d.code === "string";
        // }
        //
        // const filtered = data.filter(isValid);
        // return filtered;
        return data;
      }
    }),
  getGlosses: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("gloss_sentence")
        .select(
          "*, ...glosses(id,code,kana,comment,is_hidden, romaji, jlpt_level)",
        )
        .eq("sentence_id", Number(input.id));

      if (error) {
        throw new Error(error.message);
      }
      const mapped = data.map((d) => {
        return {
          ...d,
          romaji: d.romaji?.replace(/~/g, "〜"),
        };
      });

      return mapped;
    }),
});
