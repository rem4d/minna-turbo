import { z } from "zod";
import { toRomaji } from "wanakana";
import { publicProcedure, router } from "../../trpc";
import { callAiForExceptionNumber } from "@rem4d/gloss";

export const adminGlossRouter = router({
  getGlosses: publicProcedure
    .input(
      z.object({
        limit: z.number().gt(0),
        page: z.number(),
        kana: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, kana } = input;
      const { data, error } = await ctx.db
        .from("glosses")
        .select("*,connected:gloss_aigloss(*)")
        .eq("is_hidden", false)
        .order("created_at")
        .range((page - 1) * limit, page * limit)
        .like("kana", kana ? `%${kana}%` : "*");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  getGlosses2: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from("glosses")
      .select("*")
      .eq("is_hidden", false)
      .order("code")
      .not("code", "is", null);

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
      .select("*", { count: "exact" })
      .not("code", "is", null)
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
        .select("id:sentence_id,...sentences(*)")
        .eq("gloss_id", glossId)
        .order("sentences(created_at)", { ascending: false })
        .limit(100);

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
        .select("id:sentence_id,...sentences(*)")
        .eq("gloss_id", glossId)
        .order("sentences(created_at)", { ascending: false })
        .limit(100);

      if (!data) {
        console.log(error);
        throw new Error("No sentences found.");
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
  findByFilter: publicProcedure
    .input(z.object({ kana: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("glosses")
        .select("*")
        .like("kana", `%${input.kana}%`);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  checkNumber: publicProcedure
    .input(z.object({ sentenceId: z.number(), glossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data: sentence, error } = await ctx.db
        .from("sentences")
        .select("*")
        .eq("id", input.sentenceId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!sentence || !sentence?.text) {
        throw new Error("No sentence found.");
      }

      const { data: found, error: errorGloss } = await ctx.db
        .from("aiglosses")
        .select("*")
        .eq("id", input.glossId)
        .single();

      if (errorGloss) {
        throw new Error(errorGloss.message);
      }
      if (!found || !found.kana) {
        throw new Error("No gloss found.");
      }

      const response = await callAiForExceptionNumber({
        gloss: found.kana,
        sentenceText: sentence.text,
        showLog: true,
      });

      return {
        closest: response.closest,
        comment: response.comment,
        success: response.success,
      };
    }),
  updateNumber: publicProcedure
    .input(
      z.object({
        sentenceId: z.number(),
        glossId: z.number(),
        number: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("updateNumber: ", input);
      const { data: currentGloss, error } = await ctx.db
        .from("aiglosses")
        .select()
        .eq("id", input.glossId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      if (!currentGloss || !currentGloss.kana) {
        throw new Error("No gloss found.");
      }

      // find existing gloss by number
      const { data: glossUpdateTo, error: error2 } = await ctx.db
        .from("aiglosses")
        .select()
        .eq("number", input.number)
        .eq("kana", currentGloss.kana)
        .single();

      if (error2) {
        throw new Error(error2.message);
      }
      if (!glossUpdateTo) {
        throw new Error("No gloss found.");
      }

      // update current raltion setting found gloss id
      const { error: errorUpdate } = await ctx.db
        .from("aigloss_sentence")
        .update({
          gloss_id: glossUpdateTo.id,
        })
        .eq("gloss_id", currentGloss.id)
        .eq("sentence_id", input.sentenceId);

      if (errorUpdate) {
        throw new Error(errorUpdate.message);
      }

      return true;
    }),
  grammarify: publicProcedure
    .input(z.object({ sentenceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data: sentence, error } = await ctx.db
        .from("sentences")
        .select("*")
        .eq("id", input.sentenceId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!sentence || !sentence?.text) {
        throw new Error("No sentence found.");
      }
      const { data: dbGlosses, error: dbError } = await ctx.db
        .from("glosses")
        .select("*")
        .eq("is_hidden", false);

      if (dbError || !dbGlosses) {
        throw new Error("No glosses found");
      }

      const res = await fetch(
        "http://127.0.0.1:5000/gen?text=" + sentence.text,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }
      const response = (await res.json()) as unknown as {
        gloss: string;
        start: number;
        end: number;
      }[];

      const bulks = [];

      for (const gloss of response) {
        const foundGloss = dbGlosses.find((g) => g.code === gloss.gloss);

        if (!foundGloss || error) {
          console.log(gloss.gloss);
          throw new Error("No gloss found");
        }

        bulks.push({
          sentence_id: sentence.id,
          gloss_id: foundGloss.id,
          start: gloss.start,
          end: gloss.end,
        });
      }

      const { error: errDelete } = await ctx.db
        .from("gloss_sentence")
        .delete()
        .eq("sentence_id", sentence.id);

      if (errDelete) {
        throw new Error(errDelete.message);
      }

      const { error: errorBulk } = await ctx.db
        .from("gloss_sentence")
        .insert(bulks);

      if (errorBulk) {
        throw new Error(errorBulk.message);
      }
      return true;
    }),
});
