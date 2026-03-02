import type { SentenceLike } from "@/types";
import type { GetGlossesOutput } from "@minna/api";
import type { ReactElement } from "react";
import { useAppStore } from "@/store";
import { isValidGloss } from "@/types";
import { parseReadings } from "@/utils/parseReadings";
import { TextVisualizer } from "@minna/ui";
import { twMerge } from "tailwind-merge";

interface Props {
  sentence: SentenceLike;
  showFurigana: boolean;
  showGlosses: boolean;
  glosses: GetGlossesOutput[];
  onGlossClick: (code: string) => void;
  userLevel?: number;
}

export function SentenceText({
  sentence,
  glosses: glosses_,
  showFurigana,
  showGlosses,
  onGlossClick,
  userLevel,
}: Props): ReactElement {
  const glosses = glosses_.filter(isValidGloss);
  const kanjiMap = useAppStore((state) => state.kanjiMap);
  const readings = parseReadings(sentence, kanjiMap, userLevel);

  return (
    <div className="w-full">
      <div className={twMerge("relative flex grow flex-col")}>
        <div className={twMerge("relative mt-6 w-full overflow-hidden")}>
          <div
            className={twMerge(
              "font-yu-gothic relative min-h-[67px] rounded-[20px] border border-black/20 bg-white px-4 pt-2 pb-4 text-xl leading-6 font-normal text-black",
            )}
          >
            <div className={twMerge("flex items-start justify-center gap-x-2")}>
              <div className="flex flex-col items-center justify-center gap-2 leading-none">
                <div className="text-center">
                  <TextVisualizer
                    glossClassName="mx-2 cursor-pointer border-b border-dashed border-black/60"
                    text={sentence.text}
                    showGlosses={showGlosses}
                    showReadings={showFurigana}
                    readings={readings}
                    glosses={glosses}
                    variant="dash"
                    onGlossClick={onGlossClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
