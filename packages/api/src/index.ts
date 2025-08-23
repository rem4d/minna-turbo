import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./routers/_app";
import { appRouter } from "./routers/_app";

import { createCallerFactory, createTRPCContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
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

// type AiMemberOutput = RouterOutputs["admin"]["member"]["aiMembers"][number];

export { createTRPCContext, appRouter, createCaller };
export type { AppRouter, SentenceOutput, Member2Output };
