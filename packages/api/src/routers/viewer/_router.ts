import { router } from "../../trpc";
import { kanjiRouter } from "./kanji";
import { memberRouter } from "./member";
import { sentenceRouter } from "./sentence";
import { userRouter } from "./user";
import { mergeRouters } from "../../trpc";
import * as sharedRoutes from "../shared";

export const viewerRouter = router({
  member: mergeRouters(memberRouter, sharedRoutes.memberRouter),
  sentence: mergeRouters(sentenceRouter, sharedRoutes.sentenceRouter),
  user: userRouter,
  kanji: kanjiRouter,
});
