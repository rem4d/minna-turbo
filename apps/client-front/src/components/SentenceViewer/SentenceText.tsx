import type { ReadingPositionItem } from "@app/ui";
import type { GetGlossesOutput, SentenceOutput } from "@rem4d/api";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { TextVisualizer } from "@app/ui";
import { twMerge } from "tailwind-merge";

export interface Props {
  sentence: SentenceOutput;
  showFurigana: boolean;
  showGlosses: boolean;
  glosses: GetGlossesOutput[];
  msg?: string;
  onGlossClick: (code: string) => void;
  showMeta: boolean;
}

export function SentenceText({
  sentence,
  msg,
  glosses: glosses_,
  showFurigana,
  showGlosses,
  onGlossClick,
  showMeta,
}: Props): ReactElement {
  const glosses = glosses_.filter(isValid);
  const [readings, setReadings] = useState<ReadingPositionItem[]>([]);

  useEffect(() => {
    const parse = (txt: string) => {
      try {
        const arr = JSON.parse(txt) as ReadingPositionItem[];
        return arr;
      } catch (error) {
        console.error(error);
        return [];
      }
    };
    if (sentence.text_with_furigana) {
      setReadings(parse(sentence.text_with_furigana));
    }
  }, [sentence]);

  return (
    <div className="w-full">
      <div className={twMerge("relative flex grow flex-col")}>
        <div className={twMerge("relative mt-[24px] w-full overflow-hidden")}>
          {showMeta && (
            <div className="absolute top-0 left-0 z-10 flex flex-col">
              <div className="text-mine-shaft/50 mt-2 text-center text-xs">
                ID: {sentence.id}
              </div>
              {msg && (
                <div className="text-mine-shaft/70 mt-2 text-center text-xs">
                  Msg: {msg}
                </div>
              )}
            </div>
          )}
          <div
            className={twMerge(
              "font-yu-gothic relative min-h-[67px] rounded-[20px] border border-black/20 bg-white px-4 py-4 text-xl leading-6 font-medium text-black",
            )}
          >
            <div className={twMerge("flex items-start justify-center gap-x-2")}>
              <div className="flex flex-col items-center justify-center gap-2 leading-8">
                <div className="text-center">
                  {glosses && readings && (
                    <TextVisualizer
                      text={sentence.text}
                      showGlosses={showGlosses}
                      showReadings={showFurigana}
                      readings={readings}
                      glosses={glosses}
                      variant="dash"
                      onGlossClick={onGlossClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ValidGloss extends GetGlossesOutput {
  code: string;
}

function isValid(d: GetGlossesOutput): d is ValidGloss {
  return typeof d.code === "string";
}
