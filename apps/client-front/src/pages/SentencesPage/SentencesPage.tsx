import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import DrawerSentenceSettings from "@/components/DrawerSettings/DrawerSentenceSettings";
import { Page } from "@/components/Page";
import {
  SentenceNavButtons,
  SentenceViewer,
} from "@/components/SentenceViewer";
import { SpinnerBig } from "@/components/Spinner";
import Toast from "@/components/Toast";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import useUnmount from "@/utils/useUnmount";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

const SentencesPage: FC = () => {
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

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (helpOpen === null) {
      setHelpOpen(true);
    }
  }, [helpOpen, setHelpOpen]);

  const {
    mutate: getRandomized,
    isPending: randomizedPending,
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
    decreaseActiveIndex();
  };

  const handleNextClick = () => {
    increaseActiveIndex();
  };

  const onSubmitLevelRange = ({
    level,
    shift,
  }: {
    level: number;
    shift: number;
  }) => {
    void updateLevelMutation.mutate({ level, shift });
  };

  const onResetCacheClick = () => {
    resetCacheMutation.mutate();
  };

  const disablePrevNav = activeIndex === 0;

  const disableNextNav =
    sentences.length === 0 || activeIndex === sentences.length - 1;

  const loader = (
    <div className="grid h-full place-items-center">
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
              paddingTop: 16,
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
          <div className="mt-16">
            <SentenceViewer
              sentence={sentence}
              loading={showFallback}
              onSettingsOpen={() => setSettingsModalOpen(true)}
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
        <DrawerSentenceSettings
          open={settingsModalOpen}
          onOpenChange={setSettingsModalOpen}
          onSubmitLevelRange={onSubmitLevelRange}
          level={user.level}
          shift={user.shift}
        />
      )}
    </Page>
  );
};

export default SentencesPage;
