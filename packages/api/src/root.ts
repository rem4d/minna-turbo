import { memberRouter } from "./router/member";
import { sentenceRouter } from "./router/sentence";
import { router } from "./trpc";

export const appRouter = router({
  sentence: sentenceRouter,
  member: memberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
