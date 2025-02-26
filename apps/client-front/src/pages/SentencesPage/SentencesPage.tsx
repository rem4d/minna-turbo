import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg?react";
import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import Dropdown from "@/components/Dropdown";
import { Page } from "@/components/Page";
import Spinner, { SpinnerBig } from "@/components/Spinner";
import Toast from "@/components/Toast";
import { useTtsMutation } from "@/rq/useTtsMutation";
import { api } from "@/utils/api";
import hapticFeedback from "@/utils/hapticFeedback";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { twMerge } from "tailwind-merge";
import { useLocalStorage } from "usehooks-ts";

import Accordion from "./Accordion";
import DrawerSettings from "./DrawerSettings";
import { SentenceText } from "./SentenceText";

export const SentencesPage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [blobSrc, setBlobSrc] = useState<string | undefined>(undefined);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toastData, setToastOpen] = useState({
    open: false,
    text: "",
  });

  const [favorites, setFavorites] = useLocalStorage<Sentence[]>(
    "kic:favorites",
    [],
  );

  const lp = useLaunchParams();
  const isMobile = !lp.platform.includes("desktop");

  const utils = api.useUtils();

  const { data: list, isLoading: loadingSentences } =
    api.sentence.getRandomized.useQuery(undefined);

  const { data: user, isLoading: loadingUser } = api.user.info.useQuery();

  const updateLevelMuatation = api.user.updateLevel.useMutation({
    onSuccess() {
      void utils.sentence.getRandomized.reset();
      // void utils.sentence.getRandomized.invalidate();
      void utils.user.info.reset();
    },
  });
  // const updateMeaningMutation = api.member.updateMeaning.useMutation({
  //   onSuccess() {
  //     void utils.member.membesByPos.invalidate();
  //   },
  // });
  // const change

  const sentence = list?.[activeIndex] ?? null;
  // const hasCharacter = !!sentence?.vox_speaker_id;

  const { mutateAsync: ttsMutate, isPending: ttsLoading } = useTtsMutation({
    onSuccess() {},
  });

  useEffect(() => {
    setShowFurigana(false);
    setIsPlaying(false);
    setBlobSrc(undefined);
  }, [sentence]);

  useEffect(() => {
    if (blobSrc) {
      if (audioRef.current) {
        void audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [blobSrc]);

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

    if (!isPlaying && !ttsLoading) {
      hapticFeedback("light");
    }

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

  const favIndex = sentence
    ? favorites.findIndex((e) => e.id === sentence.id)
    : -1;

  const dropdownItems = [
    {
      title: favIndex === -1 ? "Добавить в избранное" : "Убрать из избранного",
      onClick() {
        if (sentence) {
          if (favIndex === -1) {
            setFavorites(favorites.concat(sentence));
            setToastOpen({ open: true, text: "Фраза добавлена в избранное." });
          } else {
            setFavorites(favorites.toSpliced(favIndex, 1));
            setToastOpen({ open: true, text: "Фраза удалена из избранного." });
          }
        }
      },
    },
    {
      title: "Настройки",
      onClick() {
        setSettingsModalOpen(true);
      },
    },
    {
      title: "Помощь",
      onClick() {
        console.log("h");
      },
    },
  ];

  const onChangeLevel = (newLevel: number) => {
    void updateLevelMuatation.mutate(newLevel);
    hapticFeedback("medium");
  };

  const disableRightNav =
    (list && (activeIndex === list.length - 1 || list.length === 0)) ?? !list;

  return (
    <Page back>
      <div className="relative h-full overflow-hidden" id="page">
        <div
          className="text-scorpion absolute top-2 left-1/2 mb-3 flex h-4 -translate-x-1/2 justify-center text-sm"
          style={{
            paddingTop: isMobile ? 16 : 0,
          }}
        >
          {user ? <>Ваш уровень: {user.level}</> : <></>}
        </div>
        <div className={isMobile ? "mt-16" : "mt-10"}>
          {/* nav buttons */}
          <div className="mb-4 flex justify-between px-4">
            <div
              className={twMerge(
                "relative size-[30px] cursor-pointer",
                activeIndex === 0 && "pointer-events-none opacity-40",
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
            </div>
            <div
              className={twMerge(
                "relative size-[30px] cursor-pointer",
                disableRightNav && "pointer-events-none opacity-40",
              )}
              onClick={handleNextClick}
            >
              <ArrowIcon className="text-azure-radiance absolute size-[20px] -rotate-90 fill-current" />
            </div>
          </div>
          {loadingSentences && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <SpinnerBig />
            </div>
          )}
          {sentence && (
            <div className="px-4">
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
      <Toast
        open={toastData.open}
        onOpenChange={(open) => setToastOpen((v) => ({ ...v, open: open }))}
      >
        {toastData.text}
      </Toast>
      {user && (
        <DrawerSettings
          open={settingsModalOpen}
          level={user.level}
          onOpenChange={setSettingsModalOpen}
          onChangeLevel={onChangeLevel}
        />
      )}
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
