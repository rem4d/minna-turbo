import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mistral } from "@mistralai/mistralai";
import type { AIMember } from "./tools";

const mClient = new Mistral({
  apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
  serverURL: "http://localhost:11434",
});

export default function useMistral({ sentenceText }: { sentenceText: string }) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMembers, setAIMembers] = useState<AIMember[]>([] as AIMember[]);

  useEffect(() => {
    setAiPrompt(`Given the sentence '${sentenceText}'
Split it to parts of speech and put them into JSON array.

Each item in the array should have: original form (original), part of speech (pos), dictionary polite form (dict_form), english translation of 'dict_form' (en), russian translation of 'dict_form' (ru), reading of 'dict_form' in hiragana (reading).

Do not include punctuation.

Output using the following JSON format:

[
	{
		"original": "行かなければならない",
		"pos": "verb",
		"dict_form": "行く",
		'en': 'go',
		'ru': 'идти',
		'reading':'いく'
	}
]
For readings including comments use only hiragana.
`);
  }, [sentenceText]);

  const getMembers = async () => {
    // const model = "mistral-large-latest";
    const model = "mistral-small-latest";
    try {
      const response = await mClient.chat.complete({
        model,
        messages: [
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        responseFormat: { type: "json_object" },
      });
      const content = response.choices[0].message.content;
      console.log(content);

      if (typeof content === "string") {
        const members = JSON.parse(content) as unknown as AIMember[];
        const filtered = members.filter((m) => m.pos !== "particle");
        setAIMembers(filtered);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error getting AI members");
    }
  };

  return { aiPrompt, aiMembers, getMistralMembers: getMembers };
}

/*
  interjection  // すみません
  determiner  // この、その
  noun
  verb
  auxiliary //　ん
  copula // です
  conjunction // けど
  particle // の
*/
