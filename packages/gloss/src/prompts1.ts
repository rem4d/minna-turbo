import { isValidGloss, promptMap } from "./const/exceptions";

export const getGlossesPrompt = (sentenceText: string) => {
  return `
Grammar gloss is the grammar construction that is used in a japanese sentence.
Examples of grammar glosses are:

"〜を" - indicates direct object
"〜であっても" - though it may be <something>
"たとえ〜" - even if, no matter

What grammar glosses are used in the following japanese sentence?

${sentenceText}

Do not use direct words from the sentence. Use general grammar constructions similar as in examples above.
Put glosses in dictionary form.

Response following json array of objects:

  {
     "gloss": "〜を",
     "comment": "indicates direct object" // comment should be concise
  }`;
};

export const getExceptionNumberPrompt = (
  kana: string,
  sentenceText: string,
) => {
  let prompt = `
Given the list of grammatical meanings of "${kana}" in the following format:
<number>.  <meaning>
Here the list:
`;
  const isValid = isValidGloss(kana);
  if (!isValid) {
    throw new Error(`No prompt for ${kana}`);
  }
  prompt += promptMap[kana];

  prompt += `
The following japanese sentence contains some of the grammar glosses from the list above:

${sentenceText}

Response json object with key "closest" containing the closest gloss number. If multiple match, return multiple numbers.
If nothing matches from the list, then answer with "NO MATCH" and comment explaining the reason it didn't match. `;
  return prompt;
};
export default { getGlossesPrompt, getExceptionNumberPrompt };
