import { publicProcedure, router } from "../../trpc";

export const adminStatRouter = router({
  getStat: publicProcedure.query(async ({ ctx }) => {
    const shift = 60;
    const { data, error } = await ctx.db
      .rpc("stat_kanji_list3", {
        shift_input: shift,
      })
      .select();
    if (error) {
      throw new Error("No stat found.");
    }

    return data;
  }),
});
