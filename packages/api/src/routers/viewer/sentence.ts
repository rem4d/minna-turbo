import { z } from "zod";
import {
  authedProcedure,
  publicProcedure,
  redisPrecedure,
  router,
} from "../../trpc";
import { shuffle } from "../../util/shuffle";
import { dedup } from "../../util/dedup";
import { getUserByTelegramId } from "../util/getUserByTelegramId";
import { getStatementsForLevel } from "../util/getStatementsForLevel";

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

      void ctx.redis.set(`known.${userId}`, JSON.stringify(newKnown), {
        EX: 60 * 60 * 60 * 24,
      });

      return true;
    }),
  getRandomized: redisPrecedure.mutation(async ({ ctx }) => {
    const shift = 50;

    const storedUser = await getUserByTelegramId(ctx.user.id, ctx.db);

    if (!storedUser) {
      throw new Error("No user has been found");
    }

    const level = storedUser.level;
    const userId = storedUser.id;
    console.log(`Getting sentences for user with level = `, level);

    const numberOfUnknownKanji = 3;
    const { sentences /*, additional */ } = await getStatementsForLevel({
      level,
      shift,
      numberOfUnknownKanji,
      db: ctx.db,
      redis: ctx.redis,
    });

    let known: number[] = [];

    const knownKey = await ctx.redis.get(`known.${userId}`);

    if (knownKey) {
      known = JSON.parse(knownKey) as number[];
    }

    const sentencesFiltered = sentences.filter((s) => !known.includes(s.id));
    // const additionalFiltered = additional.filter((s) => !known.includes(s.id));

    // console.log(
    //   `Sentences: ${sentencesFiltered.length}, additional: ${additionalFiltered.length}`,
    // );
    console.log(`Sentences: ${sentencesFiltered.length}`);

    const shuffledS = shuffle(sentencesFiltered).slice(0, 10);
    // const shuffledA = shuffle(additionalFiltered).slice(0, 2);
    const shuffled = shuffle(shuffledS.concat(/*shuffledA*/ []));
    // const newKnown = known.concat(shuffled.map((s) => s.id));

    // void ctx.redis.set(`known.${level}-${shift}`, JSON.stringify(newKnown), {
    //   EX: 60 * 60 * 60 * 24, // expire in 3 months,
    // });

    return shuffled;
  }),
  resetCache: redisPrecedure.mutation(async ({ ctx }) => {
    const storedUser = await getUserByTelegramId(ctx.user.id, ctx.db);

    if (!storedUser) {
      throw new Error("No user has been found");
    }
    const userId = storedUser.id;
    try {
      void ctx.redis.del(`known.${userId}`);
      return true;
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
});
