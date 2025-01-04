import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { tokenize } from "../util/tokenizer/tokenize";
import { SentenceMemberOutput } from "../types";
import { createRubySentence, createRubyToken } from "../util/analyze";

export const memberRouter = router({
  setInvalid: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from("sentence_members")
        .update({ is_invalid: true })
        .eq("id", input);

      if (error) {
        throw new Error("Error when update.");
      }
      return true;
    }),
  setHidden: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from("sentence_members")
        .update({ is_hidden: true })
        .eq("id", input);

      if (error) {
        throw new Error("Error when update.");
      }
      return true;
    }),
  updateMeaning: publicProcedure
    .input(
      z.object({
        id: z.number(),
        meaning: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("sentence_members")
        .update({
          en: input.meaning,
        })
        .eq("id", input.id)
        .select()
        .single();
      if (error) {
        throw new Error("Error when update.");
      }
      return data;
    }),
  membesByPosTotal: publicProcedure
    .input(z.object({ pos: z.string() }))
    .query(async ({ ctx, input }) => {
      const { count: total, error: totalError } = await ctx.db
        .from("sentence_members")
        .select("*", { count: "exact" })
        .eq("pos", input.pos)
        .eq("is_hidden", false)
        .eq("is_invalid", false)
        .order("created_at", { ascending: true });

      if (totalError) {
        throw new Error("Not found.");
      }

      return total;
    }),
  membesByPos: publicProcedure
    .input(
      z.object({
        pos: z.string(),
        basic_form: z.string().optional(),
        limit: z.number(),
        page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pos = input.pos;
      const limit = input.limit;
      const page = input.page;
      const db = ctx.db
        .from("sentence_members")
        .select()
        .eq("pos", pos)
        .eq("is_hidden", false)
        .eq("is_invalid", false);

      if (input.basic_form) {
        db.eq("basic_form", input.basic_form);
      } else {
        db.range((page - 1) * limit, page * limit);
      }

      try {
        console.log(1);
        const { data, error } = await db.order("created_at", {
          ascending: true,
        });
        console.log(2);
        if (error) {
          throw new Error("Not found.");
        }
        console.log(3);
        return data;
      } catch (error) {
        console.log(4);
        console.log("ERROR::________-");
        console.log(error);
      }
      return [];
    }),
  sentenceMembers: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input, ctx }) => {
      const text = input.text;
      const tokens = await tokenize(text);

      const outputMembers: SentenceMemberOutput[] = [];

      const japaneseNameRegex = /[一-龠]{2}(?=さん)/;
      const japaneseNameMatches = text.match(japaneseNameRegex);

      for (const token of tokens) {
        // ignore specific types of speech
        if (typesToIgnore.includes(token.pos)) {
          continue;
        }

        // ignore japanese names
        if (
          (japaneseNameMatches?.[0] === token.basic_form ||
            japaneseNamesWithoutSan.includes(token.basic_form)) &&
          !theseSoundLikeJapaneseNamesButTheyAreNot.includes(token.basic_form)
        ) {
          continue;
        }

        const { data: member } = await ctx.db
          .from("sentence_members")
          .select()
          .eq("basic_form", token.basic_form)
          .eq("pos", token.pos)
          .eq("pos_detail_1", token.pos_detail_1)
          .single();

        const tmpToken = { ...token, original: token.basic_form };

        // console.log(tmpToken);

        // no need to push duplicates
        if (
          outputMembers.find(
            (o) =>
              o.basic_form === token.basic_form &&
              o.pos === token.pos &&
              o.pos_detail_1 === token.pos_detail_1,
          )
        ) {
          continue;
        }

        if (member) {
          if (member.is_invalid || member.is_hidden) {
            continue;
          }

          // tmpToken.en = member.en;
          let readings: { reading: string }[] = [];
          if (member.pos_detail_1 === "suffix") {
            readings = [{ reading: tmpToken.reading }];
          } else {
            readings = await tokenize(tmpToken.original);
          }

          tmpToken.reading = readings.reduce(
            (acc, curr) => acc.concat(curr.reading),
            "",
          );
        }

        outputMembers.push({
          basic_form: tmpToken.basic_form,
          pos: tmpToken.pos,
          pos_detail_1: tmpToken.pos_detail_1,
          html: createRubyToken(tmpToken),
          meaning: member?.en ?? "",
          id: member?.id,
        });
      }

      return {
        html: createRubySentence(tokens),
        members: outputMembers,
      };
    }),
});

const typesToIgnore = [
  "assistant",
  "symbol",
  "prefix",
  "interjection",
  "フィラー",
];

const theseSoundLikeJapaneseNamesButTheyAreNot = [
  "係長",
  "女将",
  "課長",
  "医者",
  "歯医者",
  "本屋",
  "課長",
];

const japaneseNamesWithoutSan = ["上田"];
