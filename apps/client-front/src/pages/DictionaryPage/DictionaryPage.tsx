import type { FC } from "react";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import WordReadings from "@/components/WordReadings";
import { api } from "@/utils/api";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";

export const DictionaryPage: FC = () => {
  const { level } = useParams();
  const { t } = useTranslation();

  const { data: vocabList, isLoading } =
    api.viewer.member.suggestedVocabularyByLevel.useQuery({
      level: Number(level),
    });

  if (!level) {
    return null;
  }

  return (
    <Page backTo="/library">
      <div className="relative px-4">
        {!isLoading && (
          <>
            <SectionHeader>{`${t("dict_level", { val: level ?? 1 })}`}</SectionHeader>
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
