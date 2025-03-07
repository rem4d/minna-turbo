import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../../trpc";
import { getUserByTelegramId } from "../util/getUserByTelegramId";
import { z } from "zod";

export const userRouter = router({
  info: authedProcedure.query(async ({ ctx }) => {
    const id = ctx.user.id;
    const user = await getUserByTelegramId(id, ctx.db);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    const result = await ctx.db
      .from("users")
      .select()
      .eq("id", user.id)
      .limit(1)
      .single();

    return result.data;
  }),
  create: authedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;
    const userId = user.id;
    const username = user.username;

    try {
      const data = await ctx.db
        .from("users")
        .upsert(
          {
            telegram_id: String(userId),
            telegram_username: username,
            last_visited: new Date().toISOString(),
          },
          { onConflict: "telegram_id" },
        )
        .select();

      if (data.data && data.data.length > 0) {
        return {
          user: data.data[0],
        };
      }
    } catch (err) {
      throw new TRPCError({ code: "BAD_GATEWAY" });
    }
  }),
  updateLevel: authedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getUserByTelegramId(ctx.user.id, ctx.db);

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { error } = await ctx.db
        .from("users")
        .update({ level: input })
        .eq("id", Number(user.id));

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return true;
    }),
});
