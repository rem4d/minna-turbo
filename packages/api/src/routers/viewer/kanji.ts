import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const kanjiRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from("kanji")
      .select()
      .order("position", { ascending: true });

    if (error) {
      throw new Error("Error while getting kanji");
    }

    return data;
  }),
  examples: publicProcedure
    .input(
      z.object({
        k: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(1);
      const { data, error } = await ctx.db
        .rpc("kanji_examples2", {
          kanji_input: input.k,
        })
        .limit(8);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
});
