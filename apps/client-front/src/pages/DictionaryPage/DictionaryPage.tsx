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
      <div className="h-screen overflow-x-hidden overflow-y-auto">
        <div className="px-4">
          <div className="mb-4 text-lg font-semibold text-black">{`Словарь ${level} уровня`}</div>
          <div className="font-yuGothic mb-[100px] grid grid-cols-3 gap-4 rounded-[10px] bg-white p-2">
            {vocabList?.map((data, i) => (
              <React.Fragment key={`${data.basic_form}-${i}`}>
                <div className="flex items-start space-x-2">
                  <div className="text-denim text-base whitespace-nowrap">
                    {data.reading === "" ? data.basic_form : data.reading}
                  </div>
                  <div className="size-[24px] cursor-pointer">
                    <SoundIcon />
                  </div>
                </div>
                <div className="text-[18px] whitespace-nowrap">
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
