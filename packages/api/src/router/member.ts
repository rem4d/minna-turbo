import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { tokenize } from "../util/tokenizer/tokenize";
import {
  SentenceMember,
  SentenceMemberInput,
  SentenceMemberOutput,
} from "../types";
import { createRubySentence, createRubyToken } from "../util/analyze";
import { sleep } from "../util/sleep";
import { DeepLDictionary } from "../util/parse/puppetDict";

export const memberRouter = router({
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
  membesByPos: publicProcedure
    .input(z.object({ pos: z.string(), limit: z.number(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const pos = input.pos;
      const limit = input.limit;
      const page = input.page;
      const { data, error } = await ctx.db
        .from("sentence_members")
        .select()
        .eq("pos", pos)
        .eq("is_hidden", false)
        .eq("is_invalid", false)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit);

      if (error) {
        throw new Error("Not found.");
      }
      return data;
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
          japaneseNameMatches?.[0] === token.basic_form &&
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
  batchMembers: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .from("sentences")
      .select()
      .eq("source", "source2")
      .gt("level", 0);

    const existingMembersMap: Map<string, SentenceMember> = new Map();

    const { data: got } = await ctx.db.from("sentence_members").select();

    if (got) {
      got.forEach((d) => {
        existingMembersMap.set(
          mapKeyFn({
            basic_form: d.basic_form,
            pos: d.pos,
            pos_detail_1: d.pos_detail_1,
          }),
          d,
        );
      });
    }

    // console.log("Existing: ", existingMembersMap.size);
    const map_new = new Map<string, SentenceMemberInput>();

    if (data.data) {
      console.log(`Data length ${data.data?.length}`);

      let cnt = 1;
      let checkingIndex = 0;
      // console.log(existingMembersMap);

      for (const sentence of data.data) {
        checkingIndex++;

        const tokens = await tokenize(sentence.text);

        for (const t of tokens) {
          if (typesToIgnore.includes(t.pos)) {
            continue;
          }
          const T_KEY = mapKeyFn(t);

          if (existingMembersMap.get(T_KEY)) {
          } else {
            const newMemberInput: SentenceMemberInput = {
              basic_form: t.basic_form,
              pos: t.pos,
              original_sentence: sentence.text,
              pos_detail_1: t.pos_detail_1,
              en: null,
              is_invalid: false,
              is_hidden: false,
              other: [],
            };

            console.log(
              `Checking ${t.basic_form} from ${t.original} (${t.pos},${t.pos_detail_1}) (${checkingIndex}/${data.data.length}):`,
            );
            const result = await DeepLDictionary(t.basic_form);

            if (result.en && result.en.length > 0) {
              console.log(result.en);

              newMemberInput.en = result.en[0] ?? "";
              newMemberInput.other = result.en;
              map_new.set(T_KEY, newMemberInput);
            } else {
              console.log(
                `Could not parse results for: ${t.basic_form} (${t.pos})`,
              );
              newMemberInput.is_invalid = true;
            }

            await sleep(10);
            const { error } = await ctx.db
              .from("sentence_members")
              .insert(newMemberInput);

            if (error) {
              console.log(
                `Error when insert ${newMemberInput.basic_form} (${newMemberInput.pos},${newMemberInput.pos_detail_1})`,
              );
            } else {
              console.log(
                `Inserted at ${cnt}: ${newMemberInput.basic_form} (${newMemberInput.pos},${newMemberInput.pos_detail_1})`,
              );
            }

            cnt++;
            existingMembersMap.set(T_KEY, {
              ...newMemberInput,
              created_at: "",
              is_hidden: false,
              is_invalid: false,
              id: 0,
              m_type: "",
              other: [],
              ru: null,
            });
          }
        }
      }
      console.log(map_new);
    }
    return true;
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

const mapKeyFn = (
  t: Record<string, any> & {
    basic_form: string;
    pos: string;
    pos_detail_1: string;
  },
) => `${t.basic_form}_${t.pos}_${t.pos_detail_1}`;
