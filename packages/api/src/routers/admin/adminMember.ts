import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const adminMemberRouter = router({
  membersById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("members")
        .select(
          `
*, entries:member_jmdict_entry!left(*, ...jmdict_entries!left(*, words:jmdict_words(*), readings:jmdict_readings(txt)))`,
        )
        .eq("sentence_id", input.id);

      if (error) {
        console.log(error.message);
        throw new Error(error.message);
      }

      const res = data.map((m) => {
        return {
          ...m,
          entries: m.entries
            .toSorted((a, b) => a.position - b.position)
            .map((entry) => ({
              ...entry,
              words: entry.words,
            })),
        };
      });

      return res.toSorted((a, b) => a.position - b.position);
    }),
  membersBySentenceId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("members")
        .select("*")
        .eq("sentence_id", input.id);

      if (error) {
        console.log(error.message);
        throw new Error(error.message);
      }

      return data.toSorted((a, b) => a.position - b.position);
    }),
  // entriesByMemberId: publicProcedure
  //   .input(z.object({ id: z.number(), text: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const { data, error } = await ctx.db
  //       .from("member_jmdict_entry")
  //       .select(
  //         "*, jmdict_entries(*, words:jmdict_words(txt), readings:jmdict_readings(txt))",
  //       )
  //       .eq("member_id", input.id)
  //       .order("position");
  //
  //     if (error) {
  //       console.log(error.message);
  //       throw new Error(error.message);
  //     }
  //
  //     return [];
  //   }),
  assignMembers: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const text = input.text;
      const result = await fetch("http://127.0.0.1:5000/dictionary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (!result.ok) {
        console.log(result);
        throw new Error("Failed to fetch response");
      }

      const data = (await result.json()) as unknown as {
        entries: {
          id: number;
          text: string;
          reading: string;
          readings: string[];
          romaji: string;
          pos: string;
          is_hidden: string;
          ruby: string;
          en: string[];
          ru: string[];
          is_crush: boolean;
          is_jmdict: boolean;
          pattern_match: string;
          is_different_reading: boolean;
          is_expression: boolean;
        }[];
      }[];

      return data;
    }),
});
