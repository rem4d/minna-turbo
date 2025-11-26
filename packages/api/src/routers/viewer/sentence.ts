import { z } from "zod";

import type { Context } from "../../trpc";
import {
  authedProcedure,
  publicProcedure,
  redisPrecedure,
  router,
} from "../../trpc";
import { dedup } from "../../util/dedup";
import { shuffle } from "../../util/shuffle";
import { getStatementsForLevel } from "../util/getStatementsForLevel";
import { getUserByTelegramId } from "../util/getUserByTelegramId";

const shuffleSentences = async (ctx: Context) => {
  if (!ctx.user) {
    throw new Error("No user has been found");
  }

  const storedUser = await getUserByTelegramId(ctx.user.id, ctx.db);

  if (!storedUser) {
    throw new Error("No user has been found");
  }

  const level = storedUser.level;
  const shift = storedUser.shift;

  let knownIds: number[] = [];
  const knownKey = await ctx.redis.get(`known.${storedUser.id}`);

  if (knownKey) {
    knownIds = JSON.parse(knownKey) as number[];
  }
  // const userId = storedUser.id;

  const numberOfUnknownKanji = 3;
  const { sentences /*, additional */ } = await getStatementsForLevel({
    level,
    shift,
    numberOfUnknownKanji,
    db: ctx.db,
    knownIds,
  });

  const sentencesFiltered = sentences;

  console.log(`Sentences: ${sentencesFiltered.length}`);

  const shuffled = shuffle(sentencesFiltered).slice(0, 10);

  return shuffled;
};

export const sentenceRouter = router({
  markAsSeen: authedProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const storedUser = await getUserByTelegramId(ctx.user.id, ctx.db);

      if (!storedUser) {
        throw new Error("No user has been found");
      }

      const userId = storedUser.id;
      let known: number[] = [];

      const knownKey = await ctx.redis.get(`known.${userId}`);

      if (knownKey) {
        known = JSON.parse(knownKey) as number[];
      }

      const newKnown = dedup(known.concat(input.ids));

      await ctx.redis.set(`known.${userId}`, JSON.stringify(newKnown), {
        EX: 60 * 60 * 60 * 24,
      });

      return shuffleSentences(ctx);
    }),
  getRandomized: redisPrecedure
    .input(z.object({ init: z.boolean() }).optional())
    .mutation(async ({ ctx }) => {
      return shuffleSentences(ctx);
    }),
  resetCache: redisPrecedure.mutation(async ({ ctx }) => {
    const storedUser = await getUserByTelegramId(ctx.user.id, ctx.db);

    if (!storedUser) {
      throw new Error("No user has been found");
    }
    const userId = storedUser.id;
    try {
      await ctx.redis.del(`known.${userId}`);
      return shuffleSentences(ctx);
    } catch {
      throw new Error("Redis error.");
    }
  }),
  getByIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ids = input.ids;
      if (ids.length === 0) {
        return [];
      }
      const { data, error } = await ctx.db
        .from("sentences")
        .select(
          "id,text,ruby,level,text_with_furigana,en,ru,vox_file_path,vox_speaker_id",
        )
        .in("id", ids);

      if (error) {
        throw new Error("Error getByIds.");
      }
      return data;
    }),
  // getFurigana: publicProcedure
  //   .input(
  //     z.object({
  //       text: z.string(),
  //     }),
  //   )
  //   .query(async ({ input }) => {
  //     const text = input.text;
  //
  //     const result = await fetch("http://127.0.0.1:5000/furigana?text=" + text);
  //
  //     if (!result.ok) {
  //       throw new Error("Failed to fetch response");
  //     }
  //
  //     const data = (await result.json()) as unknown as {
  //       kanji: string;
  //       reading: string;
  //       start: number;
  //       end: number;
  //     }[];
  //
  //     return data;
  //   }),
});
