import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { EyeToggle } from "@/components/EyeToggle";
import PlaySound from "@/components/PlaySound";
import Accordion from "@/components/SentenceViewer/Accordion";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { hapticFeedback } from "@/utils/tgUtils";
import { useTranslation } from "react-i18next";

import type { DropdownItem } from "../Dropdown";
import { SentenceText } from "./SentenceText";

interface Props {
  sentence?: Sentence;
  dropdownItems?: DropdownItem[];
  onResetCacheClick: () => void;
}

export const SentenceViewer: FC<Props> = ({
  sentence,
  dropdownItems,
  onResetCacheClick,
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
  const { t } = useTranslation();

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
      ) : (
        <div className="tems-center mt-8 flex flex-col items-center justify-center space-y-8 px-4">
          <div className="text-scorpion/90 text-center text-sm">
            {/* <Trans i18nKey="no_sentences" /> */}
            <div className="mb-4">{t("no_sentences_title")}</div>
            <div>{t("no_sentences_desc")}</div>
          </div>
          <div
            className="w-fit cursor-pointer px-10 text-blue-500"
            onClick={onResetCacheClick}
          >
            {t("reset_cache")}
          </div>
        </div>
      )}
    </div>
  );
};
export default SentenceViewer;
