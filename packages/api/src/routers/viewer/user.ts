import { TRPCError } from "@trpc/server";
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
      const user = ctx.user;
      const level = input.level;
      const shift = input.shift;

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      try {
        const raw = await ctx.redis.get(`session:${user.id}`);
        const storedUser = raw ? JSON.parse(raw) : null;

        await ctx.redis.set(
          `session:${ctx.sessionId}`,
          JSON.stringify({ createdAt: storedUser.createdAt, level, shift }),
        );
        console.log(`Updated level for: `, ctx.sessionId);

        return true;
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
