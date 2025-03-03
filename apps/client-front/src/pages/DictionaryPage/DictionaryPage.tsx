import type { FC } from "react";
import { Page } from "@/components/Page";
import WordReadings from "@/components/WordReadings";
import { api } from "@/utils/api";
import { useParams } from "react-router-dom";

export const DictionaryPage: FC = () => {
  const { level } = useParams();

  const { data: vocabList } = api.member.suggestedVocabularyByLevel.useQuery({
    level: Number(level),
  });

  if (!level) {
    return null;
  }

  return (
    <Page back>
      <div className="h-screen overflow-x-hidden overflow-y-auto">
        <div className="px-4">
          <div className="mb-4 text-lg font-semibold text-black">{`Словарь ${level} уровня`}</div>
          <WordReadings list={vocabList} asGrid />
        </div>
      </div>
    </Page>
  );
};

export default DictionaryPage;
