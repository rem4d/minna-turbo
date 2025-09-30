import { z } from "zod";
import { toRomaji } from "wanakana";
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
        .order("created_at")
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
        .select(
          "id:sentence_id,...sentences(text,text_with_furigana,en,ru,source)",
        )
        .eq("gloss_id", glossId)
        .limit(100);

      // .order("source");

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  setHidden: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("aiglosses")
        .update({ is_hidden: true })
        .eq("id", input);

      if (error) {
        throw new Error(error.message);
      }
      return data;
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
  findByGlossId: publicProcedure
    .input(z.object({ glossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.rpc("get_ai_glosses_by_gloss_id", {
        glossid: input.glossId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  createGloss: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data: aiGloss, error } = await ctx.db
        .from("aiglosses")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!aiGloss) {
        throw new Error("No gloss found.");
      }
      if (!aiGloss.kana) {
        throw new Error("No kana found.");
      }

      const { data: newGloss, error: errorInsert } = await ctx.db
        .from("glosses")
        .insert({
          comment: aiGloss.comment,
          kana: aiGloss.kana,
          number: aiGloss.number,
          romaji: toRomaji(aiGloss.kana),
        })
        .select()
        .single();

      if (errorInsert) {
        throw new Error(errorInsert.message);
      }
      if (!newGloss) {
        throw new Error("No gloss found.");
      }

      const { error: errorInsertRelation } = await ctx.db
        .from("gloss_aigloss")
        .insert({
          gloss_id: newGloss.id,
          aigloss_id: aiGloss.id,
        });

      if (errorInsertRelation) {
        throw new Error(errorInsertRelation.message);
      }

      return true;
    }),
  connectGlosses: publicProcedure
    .input(z.object({ glossId: z.number(), aiGlossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { error: errorInsertRelation } = await ctx.db
        .from("gloss_aigloss")
        .insert({
          gloss_id: input.glossId,
          aigloss_id: input.aiGlossId,
        });

      if (errorInsertRelation) {
        throw new Error(errorInsertRelation.message);
      }

      return true;
    }),
});
