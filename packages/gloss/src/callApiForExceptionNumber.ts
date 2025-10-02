import callApi from "./callApi";
import { getExceptionNumberPrompt } from "./prompts1";

interface ExceptionNumberResponseType {
  closest: number | string | number[];
  comment?: string | null;
}

export interface FnResponseType {
  success: boolean;
  closest: number[];
  comment?: string | null;
}

export const callAiForExceptionNumber = async ({
  gloss,
  sentenceText,
  showLog = false,
}: {
  gloss: string;
  sentenceText: string;
  showLog?: boolean;
}): Promise<FnResponseType> => {
  const result = await callApi<ExceptionNumberResponseType>(
    getExceptionNumberPrompt(gloss, sentenceText),
    showLog,
  );

  if (!result) {
    console.log(`Unexpected response from AI: ${JSON.stringify(result)}`);
    return {
      success: false,
      closest: [],
      comment: null,
    };
  }

  if (typeof result.closest === "number") {
    return {
      success: true,
      closest: [result.closest],
      comment: null,
    };
  }

  if (Array.isArray(result.closest)) {
    return {
      success: true,
      closest: result.closest,
      comment: null,
    };
  }

  if (result.closest === "NO MATCH") {
    console.log(
      `ERROR____: Invalid closest number for ${gloss}, ${sentenceText}: ${result.closest}`,
    );

    return {
      success: false,
      closest: [0],
      comment: result.comment,
    };
  }

  const parsed = Number(result.closest);

  if (isNaN(parsed)) {
    console.log(`Unexpected response from AI: ${JSON.stringify(result)}`);
    return {
      success: false,
      closest: [],
      comment: null,
    };
  }

  return {
    success: true,
    closest: [parsed],
    comment: null,
  };
};
