import type { RedisClientType } from "@redis/client";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

import { client as db } from "@rem4d/db";

export interface ContextDeps {
  redis: RedisClientType;
}

type User = { username: string; id: number } | null;

export function createContextFactory(deps: ContextDeps) {
  return async function createContext(
    _options: trpcExpress.CreateExpressContextOptions,
    extra: { sessionId?: string },
  ) {
    const user = null as User;

    return {
      db,
      user,
      redis: deps.redis,
      sessionId: extra.sessionId,
    };
  };
}

export type Context = Awaited<
  ReturnType<ReturnType<typeof createContextFactory>>
>;

const t = initTRPC.context<Context>().create({
  // transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;

export const router = t.router;
export const mergeRouters = t.mergeRouters;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const authedProcedure = publicProcedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;
    const user = ctx.user;
    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  },
);

export const redisPrecedure = authedProcedure.use(
  async function isRedisUp(opts) {
    const { ctx } = opts;
    const redis = ctx.redis;
    if (!redis.isReady) {
      throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
    }
    return opts.next({
      ctx,
    });
  },
);
