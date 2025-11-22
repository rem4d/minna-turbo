import type { GetGlossesOutput, SentenceOutput } from "@rem4d/api";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { EyeToggle } from "@/components/EyeToggle";
import PlaySound from "@/components/PlaySound";
import Accordion from "@/components/SentenceViewer/Accordion";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { useTRPC } from "@/utils/api";
import { hapticFeedback } from "@/utils/tgUtils";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { DropdownItem } from "../Dropdown";
import GlossModal from "../Modal/GlossModal";
import ModeButton from "./ModeButton";
import { SentenceText } from "./SentenceText";

interface Props {
  sentence?: SentenceOutput;
  dropdownItems?: DropdownItem[];
  msg?: string;
  loading: boolean;
}

export const SentenceViewer: FC<Props> = ({
  sentence,
  msg,
  dropdownItems,
  loading,
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

  const showMeta = user ? user.id === 4245 || user.id === 6176 : false;

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
            disabled={!sentence?.id}
          />
          <ModeButton
            isLoading={getGlossesMutation.isPending}
            selected={mode === "grammar" && !getGlossesMutation.isPending}
            onClick={() => onModeChange("grammar")}
            mode="grammar"
            disabled={!sentence?.id}
          />
          {/* <ModeButton */}
          {/*   selected={mode === "kanji"} */}
          {/*   onClick={() => onModeChange("kanji")} */}
          {/*   mode="kanji" */}
          {/* /> */}

          {dropdownItems && (
            <Dropdown items={dropdownItems} onOpen={onSettingsOpen} />
          )}
        </div>
      </div>
      {!loading && sentence ? (
        <div className="px-4">
          <SentenceText
            sentence={sentence}
            showFurigana={showFurigana}
            glosses={glosses}
            msg={msg}
            onGlossClick={onGlossClick}
            showGlosses={mode === "grammar"}
            showMeta={showMeta}
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
    <div className="mt-[24px] px-4">
      <div className="flex h-full w-full flex-col space-y-3 opacity-80">
        <div className="fallback h-[67px] w-full rounded-[20px]" />
      </div>
    </div>
  );
};
export default SentenceViewer;
