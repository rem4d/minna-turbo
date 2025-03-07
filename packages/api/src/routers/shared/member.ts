import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const memberRouter = router({
  sentenceMembers: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.db
        .from("sentence_member")
        .select("*, members(*)")
        .eq("sentence_id", Number(input.id))
        .order("position", { ascending: true });

      // const { data, error } = await ctx.db
      //   .from("members")
      //   .select("*, sentence_member!inner(*)")
      //   .eq("sentence_member.sentence_id", Number(input.id))
      //
      if (error) {
        console.log(error);
        throw new Error("Unexpected error.");
      }
      //
      // const sorted = data.sort((a, b) =>
      //   Number(a.sentence_member[0]?.position) >
      //   Number(b.sentence_member[0]?.position)
      //     ? 1
      //     : -1,
      // );
      //
      // return sorted;
      return data;
    }),
});
