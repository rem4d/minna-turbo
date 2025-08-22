import { Mistral } from "@mistralai/mistralai";

const mClient = new Mistral({
  apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
});

const model = "mistral-large-latest";

export const runStream = async (text: string) => {
  const prompt = `'${text}' разбери грамматику на русском. Если есть чтения, отобрази в виде хираганы. Не отображай чтения на русском.`;
  const response = mClient.beta.conversations.startStream({
    model,
    inputs: prompt,
  });

  return response;
};
