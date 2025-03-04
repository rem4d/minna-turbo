import type { FC } from "react";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import WordReadings from "@/components/WordReadings";
import { api } from "@/utils/api";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";

export const DictionaryPage: FC = () => {
  const { level } = useParams();

  const { data: vocabList, isLoading } =
    api.member.suggestedVocabularyByLevel.useQuery({
      level: Number(level),
    });

  if (!level) {
    return null;
  }
  // const isLoading = true;

  return (
    <Page back>
      <div className="relative px-4">
        {!isLoading && (
          <>
            <SectionHeader>{`Словарь ${level} уровня`}</SectionHeader>
            <WordReadings list={vocabList} asGrid />
          </>
        )}

        {isLoading && (
          <div className="mt-14">
            <Skeleton
              count={16}
              borderRadius={8}
              height="30px"
              inline
              containerClassName="flex flex-col space-y-3"
            />
          </div>
        )}
      </div>
    </Page>
  );
};

export default DictionaryPage;
