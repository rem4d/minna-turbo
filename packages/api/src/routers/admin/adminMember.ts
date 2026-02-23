import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { Member, MemberJmdictEntry } from "@minna/db";

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
    .input(z.object({ text: z.string(), sentenceId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const text = input.text;
      const sentenceId = input.sentenceId;

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
        pos: string;
        text: string;
        entries: {
          id: number;
          text: string;
          reading: string;
          pos: string;
          is_hidden: boolean;
          romaji: string;
          ruby: string;
          phrase: string;
          adp: string[];
          adp_kanji: boolean;
          is_crush: boolean;
          is_expression: boolean;
          pattern_match: string;
          is_jmdict: boolean;
          is_different_reading: boolean;
        }[];
      }[];
      const { error: delError } = await ctx.db
        .from("members")
        .delete()
        .eq("sentence_id", sentenceId);

      if (delError) {
        console.log(delError.message);
        throw new Error("Could not delete sentences");
      }

      let ind = 0;

      let memberBulks: Omit<Member, "id">[] = [];
      let entBulks: Array<MemberJmdictEntry[] | null> = [];

      for (const pMember of data) {
        ind++;
        let entries = pMember.entries;
        const first = entries[0];

        if (!first) {
          throw new Error("No first entry found.");
        }
        const tmpId = Date.now();

        const memberInput = {
          sentence_id: sentenceId,
          is_different_reading: first.is_different_reading,
          is_expression: first.is_expression ?? false,
          is_hidden: first.is_hidden,
          jmdict_entry_id: first.id ?? null,
          pattern_match: first.pattern_match,
          ruby: first.ruby,
          reading: first.reading,
          position: ind,
          pos: pMember.pos,
          text: pMember.text,
        };

        memberBulks.push(memberInput);

        if (first.id) {
          const mappedEntries = entries.map((entry, i) => {
            return {
              member_id: tmpId,
              jmdict_entry_id: entry.id,
              position: i + 1,
            };
          });
          entBulks.push(mappedEntries);
        } else {
          entBulks.push(null);
        }
      }

      const { data: insertData, error: insertError } = await ctx.db
        .from("members")
        .insert(memberBulks)
        .select("id, sentence_id");

      if (!insertData || insertError) {
        console.log(insertError);
        throw new Error("Unexpected error while inserting member");
      }

      const memberJmdictEntryBulks = entBulks
        .map((e, index) =>
          e
            ? e.map((entry) => ({ ...entry, member_id: insertData[index]!.id }))
            : null,
        )
        .filter(Boolean)
        .flat() as MemberJmdictEntry[];

      const { error: errorBulk } = await ctx.db
        .from("member_jmdict_entry")
        .upsert(memberJmdictEntryBulks);

      if (errorBulk) {
        console.log("Unexpected error while insert memberJmdictEntryBulks.");
        throw new Error(errorBulk.message);
      }

      return data;
    }),
});
