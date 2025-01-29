import { type FC } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import SoundIcon from "@/assets/icons/sound.svg?react";
import { api } from "@/utils/api";

export const DictionaryPage: FC = () => {
  const { level } = useParams();

  const { data: vocabList } = api.member.suggestedVocabularyByLevel.useQuery({
    level: Number(level),
  });

  if (!level) {
    return null;
  }

  return (
    <div className="h-screen overflow-x-hidden overflow-y-auto">
      <div className="p-4">
        <div className="font-semibold text-base text-black mb-4">{`Словарь ${level} уровня`}</div>
        <div className="grid grid-cols-3 gap-4 p-2 bg-white rounded-[10px] mb-[100px]">
          {vocabList?.map((data, i) => (
            <React.Fragment key={`${data.basic_form}-${i}`}>
              <div className="flex items-start space-x-2">
                <div className="whitespace-nowrap text-base text-denim">
                  {data.reading === "" ? data.basic_form : data.reading}
                </div>
                <div className="cursor-pointer size-[24px]">
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
  );
};

export default DictionaryPage;
