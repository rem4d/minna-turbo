import { memberRouter } from "./router/member";
import { sentenceRouter } from "./router/sentence";
import { openAiRouter } from "./router/openAi";

import { router } from "./trpc";
import { ttsRouter } from "./router/tts";
import { statRouter } from "./router/stat";
import { kanjiRouter } from "./router/kanji";
import { userRouter } from "./router/user";

export const appRouter = router({
  sentence: sentenceRouter,
  member: memberRouter,
  openAi: openAiRouter,
  stat: statRouter,
  tts: ttsRouter,
  kanji: kanjiRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
