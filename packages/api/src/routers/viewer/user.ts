import { z } from "zod";

import { authedProcedure, router } from "../../trpc";

export const userRouter = router({
  info: authedProcedure.query(async ({ ctx }) => {
    return {
      level: ctx.user.level,
      shift: ctx.user.shift,
    };
  }),
  updateLevel: authedProcedure
    .input(z.object({ level: z.number(), shift: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // const user = await getUserByTelegramId(ctx.user.id, ctx.db);
      // const level = input.level;
      // const shift = input.shift;
      //
      // if (!user) {
      //   throw new TRPCError({ code: "NOT_FOUND" });
      // }
      //
      // const { error } = await ctx.db
      //   .from("users")
      //   .update({ level, shift })
      //   .eq("id", Number(user.id));
      //
      // if (error) {
      //   console.log(error);
      //   throw new Error(error.message);
      // }

      return true;
    }),
});
