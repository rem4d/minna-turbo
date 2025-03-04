import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg?react";
import Dropdown from "@/components/Dropdown";
import { Page } from "@/components/Page";
import PlaySound from "@/components/PlaySound";
import { SpinnerBig } from "@/components/Spinner";
import Toast from "@/components/Toast";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { api } from "@/utils/api";
import hapticFeedback from "@/utils/hapticFeedback";
import { useUnmount } from "@rem4d/utils";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { twMerge } from "tailwind-merge";

import Accordion from "./Accordion";
import DrawerSettings from "./DrawerSettings";
import { SentenceText } from "./SentenceText";

export const SentencesPage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toastData, setToastOpen] = useState({
    open: false,
    text: "",
  });

  const [favorites, setFavorites] = useLocalStorage<Sentence[]>(
    "kic:favorites",
    [],
  );
  const [storedList, setStoredList] = useState<Sentence[]>([] as Sentence[]);

  const lp = useLaunchParams();
  const isMobile = !lp.platform.includes("desktop");

  const utils = api.useUtils();

  const { data: list } = api.sentence.getRandomized.useQuery(undefined);

  const markAsSeenMutation = api.sentence.markAsSeen.useMutation();

  const { data: user } = api.user.info.useQuery();

  const updateLevelMuatation = api.user.updateLevel.useMutation({
    onSuccess() {
      void utils.sentence.getRandomized.reset();
      void utils.user.info.reset();
    },
  });

  const sentence = storedList[activeIndex];

  // const hasCharacter = !!sentence?.vox_speaker_id;

  useUnmount(() => {
    const ids = storedList.slice(0, activeIndex).map((l) => l.id);
    if (ids.length > 0) {
      markAsSeenMutation.mutate({ ids });
    }
  });

  useEffect(() => {
    setShowFurigana(false);
  }, [sentence]);

  useEffect(() => {
    if (list && list.length > 0) {
      setStoredList((sl) => sl.concat(list));
    }
  }, [list]);

  useEffect(() => {
    if (activeIndex === storedList.length - 1) {
      const ids = storedList.map((l) => l.id);
      void markAsSeenMutation.mutate({ ids });
      void utils.sentence.getRandomized.invalidate();
    }
  }, [activeIndex, storedList.length, markAsSeenMutation.mutate]);

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
    activeIndex === storedList.length - 1 || storedList.length === 0;

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

  if (!sentence) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <SpinnerBig />
      </div>
    );
  }

  return (
    <Page back>
      <div className="relative h-full overflow-hidden">
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
          <div className="px-4">
            <SentenceText sentence={sentence} showFurigana={showFurigana} />
            <div className="absolute bottom-0 left-0 w-full px-2">
              <Accordion sentence={sentence} />
            </div>
          </div>
        </div>
      </div>
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
