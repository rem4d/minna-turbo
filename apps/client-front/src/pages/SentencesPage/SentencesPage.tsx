import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg?react";
// import InfoIcon from "@/assets/icons/info.svg?react";
import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Page } from "@/components/Page";
import Spinner from "@/components/Spinner";
import { useTtsMutation } from "@/rq/useTtsMutation";
import { api } from "@/utils/api";
import hapticFeedback from "@/utils/hapticFeedback";
import { useLaunchParams, viewport } from "@telegram-apps/sdk-react";
import { twMerge } from "tailwind-merge";
import { useLocalStorage } from "usehooks-ts";

import Accordion from "./Accordion";
import { SentenceText } from "./SentenceText";

export const SentencesPage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [safeAreas, setSafeAreas] = useState<{ top: number }>({ top: 0 });
  const [blobSrc, setBlobSrc] = useState("");

  const [favorites, setFavorites] = useLocalStorage<Sentence[]>(
    "kic:favorites",
    [],
  );

  const lp = useLaunchParams();
  const isMobile = !lp.platform.includes("desktop");

  const { data: list, isLoading: loadingSentence } =
    api.sentence.getRandomized.useQuery({
      level: 96,
    });

  const sentence = list?.[activeIndex];
  // const hasCharacter = !!sentence?.vox_speaker_id;

  const { mutateAsync: ttsMutate, isPending: ttsLoading } = useTtsMutation({
    onSuccess() {},
  });

  useEffect(() => {
    setShowFurigana(false);
    setIsPlaying(false);
    setBlobSrc("");
  }, [sentence?.id]);

  useEffect(() => {
    if (blobSrc) {
      if (audioRef.current) {
        void audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [blobSrc]);

  useLayoutEffect(() => {
    const sa = viewport.safeAreaInsets() as { top: number };
    setSafeAreas(sa);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      console.log("Error: no audioRef found.");
      return;
    }
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  }, []);

  const onPlayClick = async () => {
    if (!sentence) {
      return;
    }
    hapticFeedback("light");

    if (!blobSrc) {
      const blob = await ttsMutate({ text: sentence.text });
      const objectURL = URL.createObjectURL(blob);

      setBlobSrc(objectURL);
    } else {
      if (audioRef.current) {
        try {
          void audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const handlePrevClick = () => {
    hapticFeedback("light");
    setActiveIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    hapticFeedback("light");
    setActiveIndex(activeIndex + 1);
  };

  const onSettingsOpen = () => {
    hapticFeedback("light");
  };

  const dropdownItems = [
    {
      title: "Добавить в избранное",
      onClick() {
        if (sentence) {
          setFavorites(favorites.concat(sentence));
        }
      },
    },
    {
      title: "Настройки",
      onClick() {
        console.log("h");
      },
    },
    {
      title: "Помощь",
      onClick() {
        console.log("h");
      },
    },
  ];

  return (
    <Page back>
      <div className="relative h-full">
        <div
          className={"text-scorpion mb-3 flex justify-center text-sm"}
          style={{
            paddingTop: isMobile ? safeAreas.top + 16 : 0,
          }}
        >
          Ваш уровень: 12
        </div>
        <div className="mt-8">
          {/* nav buttons */}
          <div className="mb-4 flex justify-between px-4">
            <div
              className={twMerge(
                "relative size-[30px] cursor-pointer",
                activeIndex === 0 && "pointer-events-none opacity-50",
              )}
              onClick={handlePrevClick}
            >
              <ArrowIcon className="text-azure-radiance absolute size-[20px] rotate-90 fill-current" />
            </div>
            <div className="flex items-center space-x-6">
              <div className="size-[24px] cursor-pointer" onClick={onPlayClick}>
                {ttsLoading && <Spinner />}
                {!ttsLoading ? (
                  isPlaying ? (
                    <SoundPauseIcon className="size-[24px] fill-current text-blue-500" />
                  ) : (
                    <SoundIcon className="size-[24px]" />
                  )
                ) : null}
              </div>

              <ShowFuriganaComponent
                showFurigana={showFurigana}
                onClick={() => setShowFurigana((s) => !s)}
              />

              <Dropdown items={dropdownItems} onOpen={onSettingsOpen} />
              {/* <div */}
              {/*   className="relative size-[20px] cursor-pointer" */}
              {/*   onClick={handleInfoClick} */}
              {/* > */}
              {/*   <InfoIcon className="size-[20px]" /> */}
              {/* </div> */}
            </div>
            <div
              className="relative size-[30px] cursor-pointer"
              onClick={handleNextClick}
            >
              <ArrowIcon className="text-azure-radiance absolute size-[20px] -rotate-90 fill-current" />
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

      <audio
        className="hidden"
        ref={audioRef}
        controls
        preload="none"
        src={blobSrc}
      />
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
