import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const adminStatRouter = router({
  getStat: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db.from("stat_list_0").select("*");

    if (error) {
      throw new Error("No stat found.");
    }

    return data;
  }),
  getSentencesForLevel: publicProcedure
    .input(
      z.object({
        level: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data: sentences, error } = await ctx.db
        .from("sentences")
        .select("id,text,ruby,source,level,text_with_furigana,en,ru")
        .lt("unknown_kanji_number", 3)
        // .eq("source", "djg")
        .eq("level", input.level)
        .order("unknown_kanji_number");

      if (error) {
        throw new Error(error.message);
      }

      return { sentences };
    }),
});
