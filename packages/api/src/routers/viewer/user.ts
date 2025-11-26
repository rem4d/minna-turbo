import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authedProcedure, router } from "../../trpc";
import { getUserByTelegramId } from "../util/getUserByTelegramId";

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
      .eq("id", Number(user.id))
      .limit(1)
      .single();

    return result.data;
  }),
  create: authedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;
    const userId = user.id;
    const username = user.username ?? "N/A";

    if (!userId) {
      console.log("Empty userId. Could not create user.");
      console.log(user);
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const { data, error } = await ctx.db
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

    if (data && data.length > 0) {
      return {
        user: data[0],
      };
    }

    if (error) {
      console.log(error);
    }

    throw new Error("Could not create user.");
  }),
  updateLevel: authedProcedure
    .input(z.object({ level: z.number(), shift: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getUserByTelegramId(ctx.user.id, ctx.db);
      const level = input.level;
      const shift = input.shift;

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { error } = await ctx.db
        .from("users")
        .update({ level, shift })
        .eq("id", Number(user.id));

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return true;
    }),
});
