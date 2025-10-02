export const getExceptionNumberPrompt = (
  kana: string,
  sentenceText: string,
) => {
  let prompt = `
Given the list of grammatical meanings of "${kana}" in the following format:
<number>.  <meaning>
Here the list:
`;

  switch (kana) {
    case "〜られる":
      prompt += `
1. passive Voice
2. Potential Form
`;
      break;
    case "〜そうだ":
      prompt += `
1. hearsay
2. conjunction ("Looks like...", "Seems like...", "About to...")
`;
      break;
  }

  prompt += `
The following japanese sentence contains some of the grammar glosses from the list above:

${sentenceText}

Response json object with key "closest" containing the closest gloss number.
If nothing matches from the list, then answer with "NO MATCH". and put comment what it matches. `;
  return prompt;
};
