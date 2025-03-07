import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { findSentencesMembers } from "../util/findSentenceMembers";

export const adminMemberRouter = router({
  reassignMembers: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const sentenceId = input.id;

      const { data, error } = await ctx.db
        .from("sentences")
        .select()
        .eq("id", sentenceId);

      if (error) {
        throw new Error("Not found.");
      }

      await ctx.db
        .from("sentence_member")
        .delete()
        .eq("sentence_id", sentenceId);

      const insertBulk = await findSentencesMembers(data);

      const { error: error2 } = await ctx.db
        .from("sentence_member")
        .upsert(insertBulk);

      if (error2) {
        throw new Error("Unexpected error while calc bulk.");
      }

      return true;
    }),
  setInvalid: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from("members")
        .update({ is_invalid: true })
        .eq("id", input);

      if (error) {
        throw new Error("Error when update.");
      }
      return true;
    }),
  setHidden: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from("members")
        .update({ is_hidden: true })
        .eq("id", input);

      if (error) {
        throw new Error("Error when update.");
      }
      return true;
    }),
  updateMeaning: publicProcedure
    .input(
      z.object({
        id: z.number(),
        meaning: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("members")
        .update({
          en: input.meaning,
        })
        .eq("id", input.id)
        .select()
        .single();
      if (error) {
        throw new Error("Error when update.");
      }
      return data;
    }),
  updateRu: publicProcedure
    .input(
      z.object({
        id: z.number(),
        ru: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("members")
        .update({
          ru: input.ru,
        })
        .eq("id", input.id)
        .select()
        .single();
      if (error) {
        throw new Error("Error when update.");
      }
      return data;
    }),
  membesByPosTotal: publicProcedure
    .input(z.object({ pos: z.string() }))
    .query(async ({ ctx, input }) => {
      const { count: total, error: totalError } = await ctx.db
        .from("members")
        .select("*", { count: "exact" })
        .eq("pos", input.pos)
        .eq("is_hidden", false)
        .eq("is_invalid", false)
        .order("created_at", { ascending: true });

      if (totalError) {
        throw new Error("Not found.");
      }

      return total;
    }),
  membesByPos: publicProcedure
    .input(
      z.object({
        pos: z.string(),
        basic_form: z.string().optional(),
        limit: z.number(),
        page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pos = input.pos;
      const limit = input.limit;
      const page = input.page;
      const db = ctx.db
        .from("members")
        .select()
        .eq("pos", pos)
        .eq("is_hidden", false)
        .eq("is_invalid", false)
        .order("created_at", { ascending: true });

      if (input.basic_form) {
        db.eq("basic_form", input.basic_form);
      } else {
        db.range((page - 1) * limit, page * limit);
      }

      try {
        const { data, error } = await db.order("created_at", {
          ascending: true,
        });
        if (error) {
          throw new Error("Not found.");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
      return [];
    }),
  checkFilterList: publicProcedure.query(async ({ ctx }) => {
    return true;
  }),
});
