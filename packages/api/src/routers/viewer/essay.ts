import { TRPCError } from "@trpc/server";
import z from "zod";

import { publicProcedure, router } from "../../trpc";

export const essayRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("essay_sentence")
        .select(
          "essay_id, position, ...sentences(id,text,ruby,level,en,ru,text_with_furigana)",
        )
        .order("position")
        .eq("essay_id", input.id);

      if (error) {
        console.log(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return data;
    }),
});
