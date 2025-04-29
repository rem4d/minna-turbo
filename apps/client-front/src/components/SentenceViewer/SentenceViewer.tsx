import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import Dropdown from "@/components/Dropdown";
import { EyeToggle } from "@/components/EyeToggle";
import PlaySound from "@/components/PlaySound";
import Accordion from "@/components/SentenceViewer/Accordion";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { hapticFeedback } from "@/utils/tgUtils";
import { twMerge } from "tailwind-merge";

import type { DropdownItem } from "../Dropdown";
import { SentenceText } from "./SentenceText";

interface Props {
  sentence?: Sentence;
  dropdownItems?: DropdownItem[];
  disablePrevNav: boolean;
  disableNextNav: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

export const SentenceViewer: FC<Props> = ({
  sentence,
  dropdownItems,
  disableNextNav,
  disablePrevNav,
  onPrevClick,
  onNextClick,
}: Props) => {
  const [showFurigana, setShowFurigana] = useState(false);

  useEffect(() => {
    setShowFurigana(false);
  }, [sentence]);

  const handlePrevClick = () => {
    hapticFeedback("light");
    onPrevClick?.();
  };

  const handleNextClick = () => {
    hapticFeedback("light");
    onNextClick?.();
  };

  const {
    isPlaying,
    isLoading: isLoadingSound,
    onLoad,
    onPlayLatest,
    onStop,
    text: contextText,
  } = usePlaySoundContext();

  const isCurrent = useCallback(
    (reading: string) => {
      return contextText === reading;
    },
    [contextText],
  );

  const onLoadSpeech = useCallback(
    (text: string, index: number | undefined) => {
      if (text) {
        onLoad(text, index);
      }
    },
    [onLoad],
  );

  const onPlay = useCallback(() => {
    onPlayLatest();
  }, [onPlayLatest]);

  const onSettingsOpen = () => {
    hapticFeedback("light");
  };

  return (
    sentence && (
      <div>
        {/* nav buttons */}
        <div className="mb-4 flex justify-between px-4">
          <div
            className={twMerge(
              "relative size-[30px] cursor-pointer",
              disablePrevNav && "pointer-events-none opacity-40",
            )}
            onClick={handlePrevClick}
          >
            <ArrowIcon className="text-azure-radiance absolute size-[20px] rotate-90 fill-current" />
          </div>
          <div className="flex items-center space-x-6">
            {sentence.text && (
              <PlaySound
                reading={sentence.text}
                isLoading={isLoadingSound}
                isPlaying={isPlaying}
                onClick={
                  isCurrent(sentence.text)
                    ? isPlaying
                      ? onStop
                      : onPlay
                    : onLoadSpeech
                }
              />
            )}
            <EyeToggle
              show={showFurigana}
              onClick={() => setShowFurigana((s) => !s)}
            />

            {dropdownItems && (
              <Dropdown items={dropdownItems} onOpen={onSettingsOpen} />
            )}
          </div>
          <div
            className={twMerge(
              "relative size-[30px] cursor-pointer",
              disableNextNav && "pointer-events-none opacity-40",
            )}
            onClick={handleNextClick}
          >
            <ArrowIcon className="text-azure-radiance absolute size-[20px] -rotate-90 fill-current" />
          </div>
        </div>
        <div className="min-h-[400px] px-4">
          <SentenceText sentence={sentence} showFurigana={showFurigana} />
          <div className="absolute bottom-0 left-0 w-full px-2">
            <Accordion sentence={sentence} />
          </div>
        </div>
      </div>
    )
  );
};
export default SentenceViewer;
