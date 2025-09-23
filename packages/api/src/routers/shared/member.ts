import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const memberRouter = router({
  sentenceMembers2: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("sentence_member2")
        .select("*, ...members2(basic_form, original, pos, en, ru, reading)")
        .eq("sentence_id", Number(input.id))
        .eq("members2.is_hidden", false)
        .order("position", { ascending: true })
        .not("members2", "is", null);

      if (error) {
        console.log(error);
        throw new Error("Unexpected error.");
      }

      return data;
    }),
  sentenceKanjis: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("sentence_kanji")
        .select("position,...kanji(*)")
        .eq("sentence_id", Number(input.id))
        .order("position", { ascending: true });

      if (error) {
        console.log(error);
        throw new Error("Unexpected error.");
      }

      return data;
    }),
  sentenceGlosses: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("sentence_gloss")
        .select("*,...glosses(kana,references,romaji,comment)")
        .eq("sentence_id", Number(input.id));

      if (error) {
        console.log(error);
        throw new Error("Unexpected error.");
      }

      return data;
    }),
});
