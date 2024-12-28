import { useState, useCallback, useEffect } from "react";

type OResponse = string;

export default function useOpenAi() {
  const [openAiResponse, setOpenAiResponse] = useState<OResponse | null>(null);
  const [openAiLoading, setOpenAiLoading] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctVersion, setCorrectVersion] = useState("");
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    if (openAiResponse) {
      const hasError = openAiResponse.match(/contains a grammatical error/);
      if (hasError) {
        const reg = new RegExp(
          /A correct version would be:\s*[\n]*([^\n(\s]*)\s*\n\(?([^)]*)/,
        );
        const correctMatch = openAiResponse.match(
          reg,
          // /A correct version would be:\s*\n*([^\n(\s]*)/,
        );
        if (correctMatch && correctMatch.length > 0) {
          setCorrectVersion(correctMatch[1] ?? "");
          setTranslation(correctMatch[2] ?? "");
        }
        setCorrect(false);
      } else {
        setCorrect(true);
        setCorrectVersion("");
        setTranslation("");
        const m = openAiResponse.match(/ranslat[^"]*"([^"\\]*)/);

        if (m && m.length > 0) {
          const last = m[m.length - 1];
          if (last) {
            setTranslation(last.replace(/"/g, ""));
          }
        } else {
          console.log("No matches found for:");
          console.log(JSON.stringify(openAiResponse));
        }
      }
    }
  }, [openAiResponse]);

  const onSubmitGrammarCheck = useCallback((text: string) => {
    const fetchData = async () => {
      setOpenAiLoading(true);
      setOpenAiResponse(null);
      try {
        const response = await fetch("/api/openai/check_grammar?text=" + text);
        const res = await response.json();
        setOpenAiResponse(res.result);
        setOpenAiLoading(false);
      } catch (err) {
        console.log(err);
        setOpenAiLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    onSubmitGrammarCheck,
    openAiLoading,
    openAiResponse,
    correctVersion,
    correct,
    translation,
  };
}
