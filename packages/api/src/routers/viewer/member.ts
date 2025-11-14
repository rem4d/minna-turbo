import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const memberRouter = router({
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

      const res = data
        .filter((m) => m.is_hidden === false && Boolean(m.jmdict_entry_id))
        .map((m) => ({
          ...m,
          entries: m.entries
            .toSorted((a, b) => a.position - b.position)
            .map((entry) => ({
              ...entry,
              ru: entry.ru ?? [],
              en: entry.en ?? [],
              // words: entry.words.filter((w) => w.is_common),
              words: entry.words ?? [],
            })),
        }));

      return res.toSorted((a, b) => a.position - b.position);
    }),
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
