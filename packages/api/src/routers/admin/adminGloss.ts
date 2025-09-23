import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const adminGlossRouter = router({
  getGlosses: publicProcedure
    .input(z.object({ limit: z.number().gt(0), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const { data, error } = await ctx.db
        .from("glosses")
        .select()
        .range((page - 1) * limit, page * limit);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  glossesTotal: publicProcedure.query(async ({ ctx }) => {
    const { count: total, error } = await ctx.db
      .from("glosses")
      .select("*", { count: "exact" });

    if (error) {
      throw new Error(error.message);
    }

    return total;
  }),
  getSentencesByGloss: publicProcedure
    .input(z.object({ glossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const glossId = input.glossId;

      const { data, error } = await ctx.db
        .from("sentence_gloss")
        .select("id:sentence_id,...sentences(text,text_with_furigana,en,ru)")
        .eq("gloss_id", glossId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
});
