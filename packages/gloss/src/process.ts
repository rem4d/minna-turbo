import { callAiForExceptionNumber } from "./callApiForExceptionNumber";
import { isValidGloss } from "./const/exceptions";
import type {
  AIGloss,
  DBGloss,
  DBGlossUpdateInput,
  DBGlossCreateInput,
  Relation,
} from "./types";

export interface ProcessArgs {
  sentence: { id: number; text: string };
  dbGlosses: DBGloss[];
  aiGlosses: AIGloss[];
  showLog?: boolean;
}

export const processSentenceGlosses = async ({
  sentence,
  dbGlosses,
  aiGlosses,
  showLog = false,
}: ProcessArgs) => {
  const newGlosses: DBGlossCreateInput[] = [];
  const newRelations: Relation[] = [];
  const glossesToUpdate: DBGlossUpdateInput[] = [];
  const errorMessages: { gloss: string; message: string }[] = [];

  for (const { gloss, comment } of aiGlosses) {
    if (gloss === "NO MATCH") {
      continue;
    }

    if (isValidGloss(gloss)) {
      const {
        closest,
        comment: aiComment,
        success,
      } = await callAiForExceptionNumber({
        gloss,
        sentenceText: sentence.text,
        showLog,
      });

      if (!success || closest.length === 0) {
        errorMessages.push({
          gloss,
          // message: `No exception number found for ${gloss}, [${sentence.id}] "${sentence.text}"`,
          message: aiComment ?? "",
        });
        continue;
      }

      for (const number of closest) {
        if (isNaN(number)) {
          errorMessages.push({
            gloss,
            message: "",
          });
          continue;
        }
        const r = checkSingleGloss({
          number: Number(number),
          dbGlosses,
          gloss,
          comment,
          sentenceId: sentence.id,
        });
        newGlosses.push(...r.newGlosses);
        newRelations.push(...r.newRelations);
        glossesToUpdate.push(...r.glossesToUpdate);
      }
    } else {
      const r = checkSingleGloss({
        number: null,
        dbGlosses,
        gloss,
        comment,
        sentenceId: sentence.id,
      });
      newGlosses.push(...r.newGlosses);
      newRelations.push(...r.newRelations);
      glossesToUpdate.push(...r.glossesToUpdate);
    }
  }

  return {
    newGlosses,
    newRelations,
    glossesToUpdate,
    errorMessages,
  };
};

const checkSingleGloss = ({
  number,
  dbGlosses,
  gloss,
  comment,
  sentenceId,
}: {
  number: number | null;
  dbGlosses: DBGloss[];
  gloss: string;
  comment: string;
  sentenceId: number;
}) => {
  const newGlosses = [];
  const newRelations = [];
  const glossesToUpdate = [];

  const found = dbGlosses.find((g) => g.kana === gloss && g.number === number);
  if (!found) {
    newGlosses.push({
      kana: gloss,
      number,
      comment,
      is_hidden: false,
      tmp: null,
    });
    newRelations.push({
      sentenceId: sentenceId,
      glossId: null,
      glossKana: gloss,
      glossComment: comment,
      glossNumber: number,
    });
  } else {
    // found one gloss, update relation
    newRelations.push({
      sentenceId: sentenceId,
      glossId: found.id,
    });
    // update tmp
    glossesToUpdate.push({
      id: found.id,
      tmp: `${found.tmp ? found.tmp + ";" : ""}[${sentenceId}]<${comment}>`,
    });
  }
  return { newGlosses, newRelations, glossesToUpdate };
};
