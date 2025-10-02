import callApi from "./callApi";
import { getExceptionNumberPrompt } from "./prompts1";

type ExceptionNumberResponseType = {
  closest: number | string | number[];
  comment?: string | null;
};

type ReturnType = {
  success: boolean;
  closest: number[];
  comment?: string | null;
};

export const callAiForExceptionNumber = async ({
  gloss,
  sentenceText,
}: {
  gloss: string;
  sentenceText: string;
}): Promise<ReturnType> => {
  const result = await callApi<ExceptionNumberResponseType>(
    getExceptionNumberPrompt(gloss, sentenceText),
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
    return result.closest;
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
