import { type FC } from "react";
import { useParams } from "react-router-dom";
import SoundIcon from "@/assets/icons/sound.svg?react";

export const DictionaryPage: FC = () => {
  const { level } = useParams();
  if (!level) {
    return null;
  }

  return (
    <div className="mt-4 p-4">
      <div className="font-semibold text-base text-black mb-4">{`Словарь ${level} уровня`}</div>
      <div className="grid grid-cols-3 gap-4 p-2 bg-white rounded-[10px]">
        <div className="flex items-start space-x-2">
          <div className="whitespace-nowrap text-base text-denim">ともだち</div>
          <div className="cursor-pointer size-[24px]">
            <SoundIcon />
          </div>
        </div>
        <div className="whitespace-nowrap text-[18px]">友だち</div>
        <div className="text-sm">friend; companion</div>
      </div>
    </div>
  );
};

export default DictionaryPage;
