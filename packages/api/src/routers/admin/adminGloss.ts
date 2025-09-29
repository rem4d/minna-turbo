import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const adminGlossRouter = router({
  getGlosses: publicProcedure
    .input(z.object({ limit: z.number().gt(0), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const { data, error } = await ctx.db
        .from("glosses")
        .select("*,gloss_sentence()")
        .eq("is_hidden", false)
        .range((page - 1) * limit, page * limit);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  getAllGlosses: publicProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from("glosses")
      .select()
      .eq("is_hidden", false);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }),
  glossesTotal: publicProcedure.query(async ({ ctx }) => {
    const { count: total, error } = await ctx.db
      .from("glosses")
      .select("*,gloss_sentence()", { count: "exact" })
      // .not("gloss_sentence", "is", null)
      .eq("is_hidden", false);

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
        .from("gloss_sentence")
        .select("id:sentence_id,...sentences(text,text_with_furigana,en,ru)")
        .eq("gloss_id", glossId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  ai_getSentencesByGloss: publicProcedure
    .input(z.object({ glossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const glossId = input.glossId;

      const { data, error } = await ctx.db
        .from("aigloss_sentence")
        .select("id:sentence_id,...sentences(text,text_with_furigana,en,ru)")
        .eq("gloss_id", glossId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  setHidden: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from("glosses")
        .update({ is_hidden: true })
        .eq("id", input);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    }),
  findByRegex: publicProcedure
    .input(z.object({ regex: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { regex } = input;
      const { data, error } = await ctx.db.rpc("get_ai_glosses_by_kana", {
        regex: regex,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
});
