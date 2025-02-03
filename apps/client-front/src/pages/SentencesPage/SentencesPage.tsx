import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg?react";
import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import { Page } from "@/components/Page";
import { TopSettings } from "@/components/TopSettings";
import { api } from "@/utils/api";
import { initTTS } from "@rem4d/utils";

import Accordion from "./Accordion";
import { SentenceText } from "./SentenceText";

export const SentencesPage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: list, isLoading: loadingSentence } =
    api.sentence.getRandomized.useQuery({
      level: 96,
    });

  const sentence = list?.[activeIndex];
  const hasCharacter = !!sentence?.vox_speaker_id;

  useEffect(() => {
    setShowFurigana(false);
  }, [sentence?.id]);

  useEffect(() => {
    setIsPlaying(false);
  }, [sentence?.text]);

  useEffect(() => {
    if (!audioRef.current) {
      console.log("Error: no audioRef found.");
      return;
    }
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  }, []);

  const onPlayClick = () => {
    if (!sentence) {
      return;
    }
    if (!hasCharacter) {
      void initTTS(sentence.text);
      return;
    }

    if (!audioRef.current) {
      return;
    }
    void audioRef.current.play();

    setIsPlaying(true);
  };
  const handlePrevClick = () => {
    setActiveIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex + 1);
  };

  const src = `${import.meta.env.VITE_BACKEND_URL}${sentence?.vox_file_path}`;
  return (
    <Page back>
      <div className="relative h-full">
        <audio
          className="hidden"
          ref={audioRef}
          controls
          preload="none"
          src={src}
        />
        <div className="p-2">
          <TopSettings
            middleText={
              <span className="text-rollingStone text-xs leading-6">
                Ваш уровень: 12
              </span>
            }
          />
          {/* nav buttons */}
          <div className="mb-4 mt-4 flex justify-between px-14">
            <div
              className="relative size-[30px] cursor-pointer"
              onClick={handlePrevClick}
            >
              <ArrowIcon className="text-azureRadiance absolute size-[20px] rotate-90 fill-current" />
            </div>
            <div className="flex items-center space-x-6">
              <div className="size-[24px] cursor-pointer" onClick={onPlayClick}>
                {isPlaying ? (
                  <SoundPauseIcon className="size-[24px] fill-current text-blue-500" />
                ) : (
                  <SoundIcon className="size-[24px]" />
                )}
              </div>

              <ShowFuriganaComponent
                showFurigana={showFurigana}
                onClick={() => setShowFurigana((s) => !s)}
              />
            </div>
            <div
              className="relative size-[30px] cursor-pointer"
              onClick={handleNextClick}
            >
              <ArrowIcon className="text-azureRadiance absolute size-[20px] -rotate-90 fill-current" />
            </div>
          </div>
          {!sentence ? null : (
            <div className="mt-[0px] px-4">
              <SentenceText sentence={sentence} showFurigana={showFurigana} />
              <div className="absolute bottom-0 left-0 w-full px-2">
                <Accordion sentence={sentence} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

const ShowFuriganaComponent = ({
  onClick,
  showFurigana,
}: {
  showFurigana: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      {showFurigana ? (
        <EyeOpenIcon className="size-[24px] text-black/50" />
      ) : (
        <EyeClosedIcon className="size-[24px] text-black/50" />
      )}
    </div>
  );
};
export default SentencesPage;
