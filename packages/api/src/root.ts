import { batchRouter } from "./router/batch";
import { memberRouter } from "./router/member";
import { sentenceRouter } from "./router/sentence";
import { openAiRouter } from "./router/openAi";
import { router } from "./trpc";
import { ttsRouter } from "./router/tts";

export const appRouter = router({
  sentence: sentenceRouter,
  member: memberRouter,
  batch: batchRouter,
  openAi: openAiRouter,
  tts: ttsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
