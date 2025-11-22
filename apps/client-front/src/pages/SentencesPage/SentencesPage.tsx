import type { Favourite } from "@/types";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Drawer from "@/components/Drawer";
import { DrawerSettings } from "@/components/DrawerSettings";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { Page } from "@/components/Page";
import { SentenceViewer } from "@/components/SentenceViewer";
import SentenceNavButtons from "@/components/SentenceViewer/SentenceNavButtons";
import { SpinnerBig } from "@/components/Spinner";
import Toast from "@/components/Toast";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import { hapticFeedback, useIsMobile } from "@/utils/tgUtils";
import useUnmount from "@/utils/useUnmount";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Trans, useTranslation } from "react-i18next";

export const SentencesPage: FC = () => {
  const activeIndex = useAppStore((state) => state.index);
  const increaseActiveIndex = useAppStore((state) => state.increase);
  const decreaseActiveIndex = useAppStore((state) => state.decrease);
  const resetActiveIndex = useAppStore((state) => state.reset);
  const resetSentences = useAppStore((state) => state.resetSentences);
  const concatSentences = useAppStore((state) => state.concatSentences);

  const sentences = useAppStore((state) => state.sentences);
  const setSentences = useAppStore((state) => state.setSentences);
  const isIdle = useAppStore((state) => state.idle);
  const setIdle = useAppStore((state) => state.setIdle);

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

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (helpOpen === null) {
      setHelpOpen(true);
    }
  }, [helpOpen, setHelpOpen]);

  const [favorites, setFavorites] = useLocalStorage<Favourite[]>(
    "kic:favorites",
    [],
  );

  const _isMobile = useIsMobile();

  const {
    mutate: getRandomized,
    isPending: randomizedPending,
    // isIdle: randomizedIdle,
    // isSuccess: randomizedSuccess,
    data: list,
  } = useMutation(
    trpc.viewer.sentence.getRandomized.mutationOptions({
      onSuccess(data, variables) {
        if (variables?.init) {
          setIdle(false);
          setSentences(data);
          if (data.length === 0) {
            setShowNoSentencesMessage(true);
          }

          resetActiveIndex();
        } else {
          concatSentences(data);
        }
      },
    }),
  );

  const mountRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) {
      if (isIdle) {
        getRandomized({ init: true });
      }
      mountRef.current = true;
    }
  }, [isIdle, getRandomized]);

  const { mutate: markAsSeen } = useMutation(
    trpc.viewer.sentence.markAsSeen.mutationOptions({
      onSuccess(data) {
        concatSentences(data);
        if (data.length < 2) {
          setShowNoSentencesMessage(true);
        }
      },
    }),
  );

  const { data: user } = useQuery(
    trpc.viewer.user.info.queryOptions(undefined, {
      throwOnError: true,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    }),
  );

  const updateLevelMutation = useMutation(
    trpc.viewer.user.updateLevel.mutationOptions({
      onSuccess() {
        resetSentences();
        resetActiveIndex();
        getRandomized({ init: true });
        setShowNoSentencesMessage(false);
        void queryClient.resetQueries({
          queryKey: trpc.viewer.user.info.queryKey(),
        });
      },
    }),
  );

  const resetCacheMutation = useMutation(
    trpc.viewer.sentence.resetCache.mutationOptions({
      onSuccess(data) {
        setSentences(data);
        resetActiveIndex();
        if (data.length > 2) {
          setShowNoSentencesMessage(false);
        }
      },
    }),
  );

  const sentence = sentences[activeIndex];

  const { t } = useTranslation();

  useUnmount(() => {
    // if (list) {
    //   const ids = list.slice(0, activeIndex).map((l) => l.id);
    //   if (ids.length > 0) {
    //     markAsSeenMutation.mutate({ ids });
    //   }
    // }
  });

  useEffect(() => {
    if (list?.length === 0 && sentences.length === 0) {
      setShowNoSentencesMessage(true);
    }
  }, [list, activeIndex, sentences.length]);

  useEffect(() => {
    if (activeIndex === sentences.length - 1) {
      const ids = sentences.map((l) => l.id);
      void markAsSeen({ ids });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, sentences.length, markAsSeen]);

  const handlePrevClick = () => {
    hapticFeedback("light");
    decreaseActiveIndex();
  };

  const handleNextClick = () => {
    hapticFeedback("light");
    increaseActiveIndex();
  };

  const favIndex = sentence
    ? favorites.findIndex((e) => e.id === sentence.id)
    : -1;

  const addToFavFn = useCallback(() => {
    if (sentence) {
      if (favIndex === -1) {
        setConfirmModalOpen(true);
      } else {
        setFavorites(() => favorites.toSpliced(favIndex, 1));
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
    void updateLevelMutation.mutate(newLevel);
    hapticFeedback("medium");
  };

  const onResetCacheClick = () => {
    resetCacheMutation.mutate();
  };

  const disablePrevNav = activeIndex === 0;

  const disableNextNav =
    sentences.length === 0 || activeIndex === sentences.length - 1;

  const handleModalConfirm = (msg: string) => {
    if (sentence) {
      setFavorites((prev) => prev.concat({ id: sentence.id, msg }));
    }

    setToastOpen({ open: true, text: t("sentence_added") });
    setConfirmModalOpen(false);
  };

  const handleModalCancel = () => {
    setConfirmModalOpen(false);
  };

  const loader = (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SpinnerBig />
    </div>
  );

  const showLoader =
    (randomizedPending && isIdle) || resetCacheMutation.isPending;

  const getRandomizedStatus = useMutationState({
    filters: { mutationKey: [["viewer", "sentence", "getRandomized"]] },
    select: (m) => m.state.status,
  });

  const latest = getRandomizedStatus[getRandomizedStatus.length - 1];

  const showFallback = updateLevelMutation.isPending || latest === "pending";

  return (
    <Page backTo="/">
      {showLoader ? (
        loader
      ) : (
        <div className="relative h-full overflow-hidden">
          <div
            className="text-scorpion/90 absolute top-2 left-1/2 mb-3 flex h-4 -translate-x-1/2 justify-center text-sm"
            style={{
              paddingTop: _isMobile ? 16 : 0,
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
            className="top-[40%]"
          />
          <div className={_isMobile ? "mt-16" : "mt-10"}>
            <SentenceViewer
              sentence={sentence}
              loading={showFallback}
              dropdownItems={dropdownItems}
            />

            {/* no sentences message*/}
            {showNoSentencesMessage && (
              <div className="tems-center mt-12 flex flex-col items-center justify-center space-y-8 px-12">
                <div className="text-scorpion/90 text-center text-sm">
                  {/* <Trans i18nKey="no_sentences" /> */}
                  <div className="mb-4">{t("no_sentences_title")}</div>
                  <div>{t("no_sentences_desc")}</div>
                </div>
                <div
                  className="w-fit cursor-pointer px-10 text-blue-500"
                  onClick={() => onResetCacheClick()}
                >
                  {t("reset_cache")}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
