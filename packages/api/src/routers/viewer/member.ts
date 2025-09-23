import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const memberRouter = router({
  suggestedVocabulariesList: publicProcedure.query(async () => {
    return [];
    // const { data, error } = await ctx.db
    //   .from("suggested_vocabularies_list")
    //   .select("*");
    //
    // if (error) {
    //   throw new Error("Error suggested_vocabularies_by_level.");
    // }
    // return data;
  }),
  suggestedVocabularyByLevel: publicProcedure
    .input(
      z.object({
        level: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const frontLevel = input.level;
      const levelFrom = frontLevel * 7 - 7;
      const levelTo = frontLevel * 7 - 1;

      // const { data, error } = await ctx.db
      //   .from("suggested_vocabularies")
      //   .select("*")
      //   .gte("level", levelFrom)
      //   .lt("level", levelTo);
      //
      // if (error) {
      //   throw new Error("Error suggested_vocabularies.");
      // }
      // return data;
      return [];
    }),
});
