import type { FC } from "react";
import React from "react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import { Page } from "@/components/Page";
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
      <div className="h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-4">
          <div className="mb-4 text-base font-semibold text-black">{`Словарь ${level} уровня`}</div>
          <div className="mb-[100px] grid grid-cols-3 gap-4 rounded-[10px] bg-white p-2">
            {vocabList?.map((data, i) => (
              <React.Fragment key={`${data.basic_form}-${i}`}>
                <div className="flex items-start space-x-2">
                  <div className="text-denim whitespace-nowrap text-base">
                    {data.reading === "" ? data.basic_form : data.reading}
                  </div>
                  <div className="size-[24px] cursor-pointer">
                    <SoundIcon />
                  </div>
                </div>
                <div className="whitespace-nowrap text-[18px]">
                  {data.basic_form === data.reading || data.reading === ""
                    ? ""
                    : data.basic_form}
                </div>
                <div className="text-sm">{data.en}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DictionaryPage;
