import { mergeRouters, router } from "../../trpc";
import { adminMemberRouter } from "./adminMember";
import { adminSentenceRouter } from "./adminSentence";
import { adminStatRouter } from "./adminStat";
import { voicevoxRouter } from "./voiceVox";
import * as sharedRoutes from "../shared";

export const adminRouter = router({
  member: mergeRouters(adminMemberRouter, sharedRoutes.memberRouter),
  sentence: mergeRouters(adminSentenceRouter, sharedRoutes.sentenceRouter),
  stat: adminStatRouter,
  voicevox: voicevoxRouter,
});
