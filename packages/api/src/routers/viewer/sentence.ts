import { z } from "zod";
import { authedProcedure, redisPrecedure, router } from "../../trpc";
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

      void ctx.redis.setEx(
        `known.${userId}`,
        60 * 24 * 60 * 60, // store data for 60 days
        JSON.stringify(newKnown),
      );

      return true;
    }),
  getRandomized: redisPrecedure.query(async ({ ctx }) => {
    const shift = 60;

    const storedUser = await getUserByTelegramId(ctx.user.id, ctx.db);

    if (!storedUser) {
      throw new Error("No user has been found");
    }

    const level = storedUser.level;
    const userId = storedUser.id;
    console.log(`Getting sentences for user with level = `, level);

    const numberOfUnknownKanji = 3;
    const { sentences, additional } = await getStatementsForLevel({
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
    const additionalFiltered = additional.filter((s) => !known.includes(s.id));

    console.log(
      `Sentences: ${sentencesFiltered.length}, additional: ${additionalFiltered.length}`,
    );

    const shuffledS = shuffle(sentencesFiltered).slice(0, 20);
    const shuffledA = shuffle(additionalFiltered).slice(0, 2);
    const shuffled = shuffle(shuffledS.concat(shuffledA));
    const newKnown = known.concat(shuffled.map((s) => s.id));

    void ctx.redis.setEx(
      `known.${level}-${shift}`,
      60 * 60,
      JSON.stringify(newKnown),
    );

    return shuffled;
  }),
});
