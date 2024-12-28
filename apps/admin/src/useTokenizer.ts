import { useCallback, useState } from "react";
import { SentenceMemberOutput } from "./types";

export default function useTokenizer() {
  const [tokenizedHtml, setTokenizedHtml] = useState("");
  const [members, setMembers] = useState<SentenceMemberOutput[]>([]);

  const onGetTranslations = useCallback(() => {}, []);

  const onGetMemberReadings = useCallback(() => {
    const fetchData = async () => {
      const syms = members.map((m) => m.basic_form);
      const res = await fetch("/api/token/tokenize_members", {
        method: "POST",
        body: JSON.stringify({ m: syms }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await res.json();
      if (data.html && data.members) {
        setMembers(data.members);
        setTokenizedHtml(data.html);
      }
    };
    fetchData();
  }, [members]);

  const onTokenize = useCallback((text: string) => {
    const fetchData = async () => {
      // const res = await fetch("/api/token/tokenize?text=" + text);
      const res = await fetch("/api/members/members?text=" + text);
      const { data } = await res.json();
      if (data.html && data.members) {
        setMembers(data.members);
        setTokenizedHtml(data.html);
      }
    };

    fetchData();
  }, []);

  return {
    onTokenize,
    members,
    tokenizedHtml,
    onGetMemberReadings,
    onGetTranslations,
  };
}
