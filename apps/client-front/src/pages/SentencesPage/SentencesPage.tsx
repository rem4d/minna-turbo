import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { DrawerSettings } from "@/components/DrawerSettings";
import { Page } from "@/components/Page";
import { SentenceViewer } from "@/components/SentenceViewer";
import { SpinnerBig } from "@/components/Spinner";
import Toast from "@/components/Toast";
import { api } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import hapticFeedback from "@/utils/hapticFeedback";
import { useUnmount } from "@rem4d/utils";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useLocalStorage } from "@uidotdev/usehooks";

export const SentencesPage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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

  const { data: list, isLoading } = api.viewer.sentence.getRandomized.useQuery(
    undefined,
    {
      throwOnError: true,
    },
  );

  const markAsSeenMutation = api.viewer.sentence.markAsSeen.useMutation();

  const { data: user } = api.viewer.user.info.useQuery(undefined, {
    throwOnError: true,
  });

  const updateLevelMuatation = api.viewer.user.updateLevel.useMutation({
    onSuccess() {
      void utils.viewer.sentence.getRandomized.reset();
      void utils.viewer.user.info.reset();
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
    if (list && list.length > 0) {
      setStoredList((sl) => sl.concat(list));
    }
  }, [list]);

  useEffect(() => {
    if (activeIndex === storedList.length - 1) {
      const ids = storedList.map((l) => l.id);
      void markAsSeenMutation.mutate({ ids });
      void utils.viewer.sentence.getRandomized.invalidate();
    }
  }, [activeIndex, storedList.length, markAsSeenMutation.mutate]);

  const handlePrevClick = () => {
    setActiveIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex + 1);
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

  const disableNextNav =
    activeIndex === storedList.length - 1 || storedList.length === 0;

  if (isLoading) {
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
          {user ? <>Ваш уровень: {convertLevel(user.level)}</> : <></>}
        </div>
        <div className={isMobile ? "mt-16" : "mt-10"}>
          <SentenceViewer
            sentence={sentence}
            dropdownItems={dropdownItems}
            disableNextNav={disableNextNav}
            disablePrevNav={activeIndex === 0}
            onNextClick={handleNextClick}
            onPrevClick={handlePrevClick}
          />
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

export default SentencesPage;
