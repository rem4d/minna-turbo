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
      const shift = 60;
      const numberOfUnknownKanji = 2;
      const { sentences, additional } = await getStatementsForLevel({
        level: input.level,
        shift,
        numberOfUnknownKanji,
        db: ctx.db,
        redis: ctx.redis,
      });
      return { sentences, additional };
    }),
});
