import { mergeRouters, router } from "../../trpc";
import * as sharedRoutes from "../shared";
import { essayRouter } from "./essay";
import { kanjiRouter } from "./kanji";
import { memberRouter } from "./member";
import { sentenceRouter } from "./sentence";
import { userRouter } from "./user";

export const viewerRouter = router({
  member: mergeRouters(memberRouter, sharedRoutes.memberRouter),
  sentence: mergeRouters(sentenceRouter, sharedRoutes.sentenceRouter),
  essay: essayRouter,
  user: userRouter,
  kanji: kanjiRouter,
});
