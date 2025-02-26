import { publicProcedure, router } from "../trpc";

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
});
