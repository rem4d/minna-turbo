import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./routers/_app";
import { appRouter } from "./routers/_app";

import { createCallerFactory, createContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 /*
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;
type SentenceOutput =
  RouterOutputs["viewer"]["sentence"]["getRandomized"][number];

type Member2Output =
  RouterOutputs["viewer"]["member"]["sentenceMembers2"][number];

type KanjiOutput = RouterOutputs["viewer"]["kanji"]["all"][number];
type ExampleOutput = RouterOutputs["viewer"]["kanji"]["examples"][number];
type KanjiInTheSentenceOutput =
  RouterOutputs["viewer"]["member"]["sentenceKanjis"][number];
// type GlossOutput = RouterOutputs["viewer"]["sentence"]["glosses"][number];

type AdminGlossOutput = RouterOutputs["admin"]["gloss"]["getGlosses"][number];
type AdminGlossOutput2 = RouterOutputs["admin"]["gloss"]["getGlosses2"][number];
type AdminSentenceOutput = RouterOutputs["admin"]["sentence"]["list"][number];

export { createContext as createTRPCContext, appRouter, createCaller };
export type {
  AdminSentenceOutput,
  AppRouter,
  SentenceOutput,
  Member2Output,
  KanjiOutput,
  KanjiInTheSentenceOutput,
  ExampleOutput,
  AdminGlossOutput,
  AdminGlossOutput2,
};
