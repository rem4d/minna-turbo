import type { Favourite } from "@/types";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import { DrawerSettings } from "@/components/DrawerSettings";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { Page } from "@/components/Page";
import { SentenceViewer } from "@/components/SentenceViewer";
import SentenceNavButtons from "@/components/SentenceViewer/SentenceNavButtons";
import { SpinnerBig } from "@/components/Spinner";
import Toast from "@/components/Toast";
import { api } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import { hapticFeedback, useLaunchParams } from "@/utils/tgUtils";
import useUnmount from "@/utils/useUnmount";
import { type SentenceOutput } from "@rem4d/api";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Trans, useTranslation } from "react-i18next";

export const SentencesPage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toastData, setToastOpen] = useState({
    open: false,
    text: "",
  });
  const [helpOpen, setHelpOpen] = useLocalStorage<boolean | null>(
    "kic:help_open",
    null,
  );
  const [showNoSentencesMessage, setShowNoSentencesMessage] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (helpOpen === null) {
      setHelpOpen(true);
    }
  }, [helpOpen, setHelpOpen]);

  const [favorites, setFavorites] = useLocalStorage<Favourite[]>(
    "kic:favorites",
    [],
  );
  const [storedList, setStoredList] = useState<SentenceOutput[]>(
    [] as SentenceOutput[],
  );

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
    trpc: {
      context: {
        skipBatch: true,
      },
    },
  });

  const updateLevelMuatation = api.viewer.user.updateLevel.useMutation({
    onSuccess() {
      void utils.viewer.sentence.getRandomized.reset();
      void utils.viewer.user.info.reset();
      setActiveIndex(0);
    },
  });

  const resetCacheMutation = api.viewer.sentence.resetCache.useMutation({
    onSuccess() {
      void utils.viewer.sentence.getRandomized.reset();
      setActiveIndex(0);
    },
  });
  const sentence = storedList[activeIndex];
  const { t } = useTranslation();

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
    if (list && list.length === 0 && activeIndex === storedList.length) {
      setShowNoSentencesMessage(true);
      // setStoredList([]);
    } else {
      setShowNoSentencesMessage(false);
    }
  }, [list, activeIndex, storedList]);

  useEffect(() => {
    if (activeIndex === storedList.length - 1) {
      const ids = storedList.map((l) => l.id);
      void markAsSeenMutation.mutate({ ids });
      void utils.viewer.sentence.getRandomized.invalidate();
    }
  }, [
    activeIndex,
    storedList,
    markAsSeenMutation,
    utils.viewer.sentence.getRandomized,
  ]);

  const handlePrevClick = () => {
    hapticFeedback("light");
    setActiveIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    hapticFeedback("light");
    setActiveIndex(activeIndex + 1);
  };

  const favIndex = sentence
    ? favorites.findIndex((e) => e.id === sentence.id)
    : -1;

  const addToFavFn = useCallback(() => {
    if (sentence) {
      if (favIndex === -1) {
        setConfirmModalOpen(true);
      } else {
        setFavorites(favorites.toSpliced(favIndex, 1));
        setToastOpen({ open: true, text: t("sentence_removed") });
      }
    }
  }, [t, sentence, favIndex, favorites, setFavorites, setConfirmModalOpen]);

  const dropdownItems = [
    {
      title: favIndex === -1 ? t("add_to_fav") : t("remove_from_fav"),
      disabled: !sentence,
      onClick() {
        addToFavFn();
      },
    },
    {
      title: t("settings"),
      onClick() {
        setSettingsModalOpen(true);
      },
    },
    {
      title: t("help"),
      onClick() {
        setHelpOpen(true);
      },
    },
  ];

  const onChangeLevel = (newLevel: number) => {
    void updateLevelMuatation.mutate(newLevel);
    hapticFeedback("medium");
  };

  const onResetCacheClick = () => {
    setStoredList([]);
    resetCacheMutation.mutate();
  };

  const disablePrevNav = activeIndex === 0;
  const disableNextNav =
    activeIndex === storedList.length || storedList.length === 0;

  const handleModalConfirm = (msg: string) => {
    setFavorites(favorites.concat({ ...sentence, msg }));
    setToastOpen({ open: true, text: t("sentence_added") });
    setConfirmModalOpen(false);
  };

  const handleModalCancel = () => {
    setConfirmModalOpen(false);
  };

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
          className="text-scorpion/90 absolute top-2 left-1/2 mb-3 flex h-4 -translate-x-1/2 justify-center text-sm"
          style={{
            paddingTop: isMobile ? 16 : 0,
          }}
        >
          {user ? (
            <>
              {t("your_level")} {convertLevel(user.level)}
            </>
          ) : (
            <></>
          )}
        </div>
        <SentenceNavButtons
          disablePrevNav={disablePrevNav}
          disableNextNav={disableNextNav}
          handleNextClick={handleNextClick}
          handlePrevClick={handlePrevClick}
        />
        <div className={isMobile ? "mt-16" : "mt-10"}>
          <SentenceViewer sentence={sentence} dropdownItems={dropdownItems} />

          {/* no sentences message*/}
          {showNoSentencesMessage && (
            <div className="tems-center mt-8 flex flex-col items-center justify-center space-y-8 px-4">
              <div className="text-scorpion/90 text-center text-sm">
                {/* <Trans i18nKey="no_sentences" /> */}
                <div className="mb-4">{t("no_sentences_title")}</div>
                <div>{t("no_sentences_desc")}</div>
              </div>
              <div
                className="w-fit cursor-pointer px-10 text-blue-500"
                onClick={() => onResetCacheClick?.()}
              >
                {t("reset_cache")}
              </div>
            </div>
          )}
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
      <Drawer open={!!helpOpen} onOpenChange={() => setHelpOpen(false)}>
        <div className="px-4 pb-4">
          <Trans
            i18nKey="help_sentences_modal"
            components={{ title: <div className="mb-4 text-center text-xl" /> }}
          />
        </div>
      </Drawer>
      <ConfirmModal
        open={confirmModalOpen}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </Page>
  );
};

export default SentencesPage;
