import type { SentenceLike } from "@/types";
import type { GetGlossesOutput } from "@minna/api";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import SettingsIcon from "@/assets/icons/settings2.svg?react";
import { EyeToggle } from "@/components/EyeToggle";
import PlaySound from "@/components/PlaySound";
import Accordion from "@/components/SentenceViewer/Accordion";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { useTRPC } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";

import GlossModal from "../Modal/GlossModal";
import ModeButton from "./ModeButton";
import { SentenceText } from "./SentenceText";

interface Props {
  sentence?: SentenceLike;
  msg?: string;
  loading: boolean;
  onSettingsOpen: () => void;
}

const SentenceViewer: FC<Props> = ({
  sentence,
  msg,
  loading,
  onSettingsOpen,
}: Props) => {
  const [showFurigana, setShowFurigana] = useState(false);
  const [mode, setMode] = useState<"grammar" | "kanji" | null>(null);
  const [glosses, setGlosses] = useState<GetGlossesOutput[]>([]);
  const [glossModalOpen, setGlossModalOpen] = useState(false);
  const [selectedGloss, setSelectedGloss] = useState<GetGlossesOutput | null>(
    null,
  );

  const trpc = useTRPC();

  const getGlossesMutation = useMutation(
    trpc.viewer.sentence.getGlosses.mutationOptions({
      onSuccess(data) {
        // @TODO: show toast
        // if (data && data.length === 0) {
        // }
        setGlosses(data);
      },
    }),
  );

  useEffect(() => {
    // eslint-disable-next-line
    setShowFurigana(false);
    setMode(null);
    setGlosses([]);
  }, [sentence?.id]);

  const { isPlaying, isLoading: isLoadingSound, play } = usePlaySoundContext();

  const onPlayClick = useCallback(() => {
    if (sentence?.text) {
      play(sentence?.text, sentence?.text);
    }
  }, [sentence, play]);

  const _onSettingsOpen = () => {
    onSettingsOpen();
  };

  const onModeChange = (m: "grammar" | "kanji") => {
    if (m === mode) {
      setMode(null);
      return;
    }

    if (m === "grammar" && glosses.length === 0) {
      getGlossesMutation.mutate({ id: sentence?.id ?? 0 });
    }

    setMode(m);
  };

  const onGlossClick = (code: string) => {
    const found = glosses.find((g) => g.code === code);

    if (found) {
      setSelectedGloss(found);
      setGlossModalOpen(true);
    }
  };

  const { data: user } = useQuery(trpc.viewer.user.info.queryOptions());

  const showMeta = false;

  return (
    <div>
      <div className="flex justify-center px-4">
        <div className="flex items-center space-x-6">
          <PlaySound
            reading={sentence?.text}
            isLoading={isLoadingSound}
            isPlaying={isPlaying}
            onClick={onPlayClick}
          />
          <EyeToggle
            show={showFurigana}
            onClick={() => setShowFurigana((s) => !s)}
            disabled={!sentence?.id}
          />
          <ModeButton
            isLoading={getGlossesMutation.isPending}
            selected={mode === "grammar" && !getGlossesMutation.isPending}
            onClick={() => onModeChange("grammar")}
            mode="grammar"
            disabled={!sentence?.id}
          />
          <div
            className="inline-flex size-6 cursor-pointer"
            onClick={_onSettingsOpen}
          >
            <SettingsIcon className="stroke-rolling-stone absolute" />
          </div>
        </div>
      </div>
      {!loading && sentence ? (
        <div className="px-4">
          {showMeta && (
            <div className="absolute top-8 left-8 flex flex-col">
              <div className="text-mine-shaft/50 mt-2 text-center text-xs">
                ID: {sentence.id}
                <br /> shift: {user?.shift}
              </div>
              {msg && (
                <div className="text-mine-shaft/70 mt-2 text-center text-xs">
                  Msg: {msg}
                </div>
              )}
            </div>
          )}
          <SentenceText
            sentence={sentence}
            showFurigana={showFurigana}
            glosses={glosses}
            onGlossClick={onGlossClick}
            showGlosses={mode === "grammar"}
            userLevel={user?.level}
          />
          <div className="absolute bottom-0 left-0 w-full px-2">
            <Accordion sentence={sentence} />
          </div>
        </div>
      ) : null}
      {loading && <Fallback />}

      {selectedGloss && (
        <GlossModal
          gloss={selectedGloss}
          open={glossModalOpen}
          onOpenChange={setGlossModalOpen}
        />
      )}
    </div>
  );
};

const Fallback = () => {
  return (
    <div className="mt-6 px-4">
      <div className="flex h-full w-full flex-col space-y-3 opacity-80">
        <div className="fallback h-[67px] w-full rounded-[20px]" />
      </div>
    </div>
  );
};
export default SentenceViewer;
