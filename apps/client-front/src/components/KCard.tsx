import type { Kanji } from "@rem4d/db";
import { useLayoutEffect, useRef, useState } from "react";
import { SpinnerBig } from "@/components/Spinner";
import WordReadings from "@/components/WordReadings";
import { api } from "@/utils/api";
import { useLocalStorage } from "@uidotdev/usehooks";
import { twMerge } from "tailwind-merge";

import { EyeToggle } from "./EyeToggle";

interface Props {
  k: Kanji;
  useEye?: boolean;
  containerClassName?: string;
  className?: string;
}

export function KCard({
  k,
  useEye = false,
  containerClassName = "",
  className = "",
}: Props) {
  const { kun, on_, en, ru, kanji } = k;
  const examplesRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);

  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );
  const { data: examples, isLoading: examplesLoading } =
    api.viewer.kanji.examples.useQuery({ k: k.kanji ?? "" }, { enabled: !!k });

  useLayoutEffect(() => {
    if (examplesRef.current) {
      const scrollHeight = examplesRef.current.scrollHeight;
      const clientHeight = examplesRef.current.clientHeight;

      setHasScroll(scrollHeight > clientHeight);
    }
  }, [examples, eyeOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (hasScroll) {
      e.stopPropagation();
    }
  };

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEyeOpen((s) => !s);
  };

  return (
    <div
      className={twMerge(
        "relative flex h-full grow scale-[0.9] flex-col",
        className,
      )}
    >
      <div className={twMerge("mb-4 flex space-x-4", useEye && "mb-0")}>
        <div className="flex aspect-square h-[96px] justify-center rounded-lg border border-black/10 bg-white drop-shadow-[3px_3px_0px_rgba(41,41,41,0.1)]">
          <div className="font-digi text-[60px] text-[#000]">{kanji}</div>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <span className="text-lg leading-6 font-bold">
            {transLang === "en" ? en : ru}
          </span>
          {kun && kun.length > 0 && (
            <span className="font-digi rounded-[18px] border px-2 py-1 text-lg leading-5 text-black">
              {kun.join("、")}
            </span>
          )}
          {on_ && on_.length > 0 && (
            <span className="font-digi rounded-[18px] border px-2 py-1 text-lg leading-5 text-black">
              {on_.join("、")}
            </span>
          )}
        </div>
      </div>

      {useEye ? (
        <div className="relative h-[40px] min-h-[30px] w-full">
          <div className="bg-gallery absolute top-1/2 h-[1px] w-full -translate-y-1/2"></div>
          <div className="border-gallery absolute top-1/2 right-2 size-[50px] -translate-y-1/2 cursor-pointer rounded-full border bg-white">
            <div className="flex size-full items-center justify-center">
              <EyeToggle show={eyeOpen} onClick={handleEyeClick} />
            </div>
          </div>
        </div>
      ) : null}

      {examplesLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpinnerBig />
        </div>
      )}

      {!examplesLoading && examples && (
        <div
          ref={examplesRef}
          className={twMerge("h-full grow", containerClassName)}
          onTouchStart={handleTouchStart}
        >
          <WordReadings
            list={examples}
            hideMeanings={useEye ? !eyeOpen : false}
          />
        </div>
      )}
    </div>
  );
}
export default KCard;
