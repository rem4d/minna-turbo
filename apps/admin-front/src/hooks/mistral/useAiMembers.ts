import { api } from "@/utils/api";
import { useEffect, useState } from "react";

export default function useAiMembers(sentenceText: string) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMembers, setAIMembers] = useState<AIMember[]>([] as AIMember[]);

  useEffect(() => {
    setAiPrompt(`Given the sentence "${sentenceText}"
Split it to parts of speech and put them into JSON array.

Each item in the array should have: original form (original), part of speech (pos), dictionary polite form (dict_form), english translation of \"dict_form\" (en), russian translation of \"dict_form\"" (ru), reading of \"dict_form\" in hiragana (reading).

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

  const aiMembersMutation = api.admin.member.aiMembers.useMutation({
    onSuccess(data) {
      setAIMembers(data.filter((m) => m.pos !== "particle"));
      // toast.success("Got response.");
    },
  });

  const onGetAIMembers = () => {
    setAIMembers([]);
    aiMembersMutation.mutate({
      prompt: aiPrompt,
    });
  };

  return {
    onGetAIMembers,
    members: aiMembers,
    aiPrompt,
    isPending: aiMembersMutation.isPending,
    setAiPrompt,
  };
}

interface AIMember {
  original: string;
  pos: string;
  dict_form: string;
  en: string;
  ru: string;
  reading: string;
}
