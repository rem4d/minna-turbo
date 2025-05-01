import type { SentenceOutput } from "@rem4d/api";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { EyeToggle } from "@/components/EyeToggle";
import PlaySound from "@/components/PlaySound";
import Accordion from "@/components/SentenceViewer/Accordion";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { hapticFeedback } from "@/utils/tgUtils";

import type { DropdownItem } from "../Dropdown";
import { SentenceText } from "./SentenceText";

interface Props {
  sentence?: SentenceOutput;
  dropdownItems?: DropdownItem[];
}

export const SentenceViewer: FC<Props> = ({
  sentence,
  dropdownItems,
}: Props) => {
  const [showFurigana, setShowFurigana] = useState(false);

  useEffect(() => {
    setShowFurigana(false);
  }, [sentence]);

  const {
    isPlaying,
    isLoading: isLoadingSound,
    onLoad,
    onPlayLatest,
    onStop,
    text: contextText,
  } = usePlaySoundContext();

  const isCurrent = useCallback(
    (reading?: string | null) => {
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
    <div>
      <div className="flex justify-center px-4">
        <div className="flex items-center space-x-6">
          <PlaySound
            reading={sentence?.text}
            isLoading={isLoadingSound}
            isPlaying={isPlaying}
            onClick={
              isCurrent(sentence?.text)
                ? isPlaying
                  ? onStop
                  : onPlay
                : onLoadSpeech
            }
          />
          <EyeToggle
            show={showFurigana}
            onClick={() => setShowFurigana((s) => !s)}
          />

          {dropdownItems && (
            <Dropdown items={dropdownItems} onOpen={onSettingsOpen} />
          )}
        </div>
      </div>
      {sentence ? (
        <div className="min-h-[400px] px-4">
          <SentenceText sentence={sentence} showFurigana={showFurigana} />
          <div className="absolute bottom-0 left-0 w-full px-2">
            <Accordion sentence={sentence} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default SentenceViewer;
