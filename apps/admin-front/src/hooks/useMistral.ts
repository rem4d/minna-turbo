import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useMistral({ sentenceText }: { sentenceText: string }) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMembers, setAIMembers] = useState<AIMember[]>([] as AIMember[]);

  const aiMembersMutation = api.admin.member.aiMembers.useMutation({
    onSuccess(data) {
      setAIMembers(data.filter((m) => m.pos !== "particle"));
      console.log(data);
      toast.success("Got response.");
    },
  });

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
		"en": "go",
		"ru": "идти",
		"reading":"いく"
	}
]
For readings including comments use only hiragana.
`);
  }, [sentenceText]);

  return { aiPrompt, aiMembers, aiMembersMutation };
}

export interface AIMember {
  original: string;
  pos: string;
  dict_form: string;
  en: string;
  ru: string;
  reading: string;
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
