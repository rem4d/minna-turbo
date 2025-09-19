import { Fragment, useCallback } from "react";
import PlaySound from "@/components/PlaySound";
import { STORAGE_LANG } from "@/config/const";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { useLocalStorage } from "@uidotdev/usehooks";
import { twMerge } from "tailwind-merge";

interface ListItem {
  basic_form: string | null;
  reading: string | null;
  en: string | null;
  ru: string | null;
}

interface Props {
  list?: ListItem[];
  asGrid?: boolean;
  hideMeanings?: boolean;
}

export default function WordReadings({
  list = [],
  asGrid = false,
  hideMeanings = false,
}: Props) {
  const {
    isPlaying,
    isLoading,
    currentIndex,
    onLoad,
    onPlayLatest,
    onStop,
    text: contextText,
  } = usePlaySoundContext();

  const [transLang] = useLocalStorage<"ru" | "en" | null>(STORAGE_LANG, null);

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

  const isCurrent = useCallback(
    (reading: string | null, index?: number) => {
      return contextText === reading && index === currentIndex;
    },
    [contextText, currentIndex],
  );

  const grid = (
    <div className="font-yuGothic mb-[100px] grid grid-cols-3 gap-4 rounded-[10px] bg-white p-2">
      {list.map((data, i) => (
        <Fragment key={`${data.basic_form}-${i}`}>
          <div className="flex items-start space-x-2">
            <div className="text-denim text-base whitespace-nowrap">
              {data.reading === "" ? data.basic_form : data.reading}
            </div>

            {data.reading && (
              <PlaySound
                reading={data.reading}
                index={i}
                isLoading={isCurrent(data.reading, i) && isLoading}
                isPlaying={isCurrent(data.reading, i) && isPlaying}
                onClick={
                  isCurrent(data.reading, i)
                    ? isPlaying
                      ? onStop
                      : onPlay
                    : onLoadSpeech
                }
              />
            )}
          </div>
          <div className="text-[18px] whitespace-nowrap">
            {data.basic_form === data.reading || data.reading === ""
              ? ""
              : data.basic_form}
          </div>
          <div className="text-sm">
            {transLang === "en" ? data.en : data.ru}
          </div>
        </Fragment>
      ))}
    </div>
  );

  const l = list.map((data, i) => (
    <div key={`${data.basic_form}-${i}`} className="flex space-y-3 space-x-2">
      <div className="text-lg whitespace-nowrap">
        {data.basic_form === data.reading || data.reading === ""
          ? ""
          : data.basic_form}
      </div>

      <div className="mt-0.5 flex items-start space-x-2">
        {hideMeanings || (data.reading && data.reading.length > 7) ? null : (
          <div className="text-denim text-base whitespace-nowrap">
            {data.reading === "" ? data.basic_form : data.reading}
          </div>
        )}
        {data.reading && (
          <PlaySound
            reading={data.reading}
            index={i}
            isLoading={isCurrent(data.reading, i) && isLoading}
            isPlaying={isCurrent(data.reading, i) && isPlaying}
            onClick={
              isCurrent(data.reading, i)
                ? isPlaying
                  ? onStop
                  : onPlay
                : onLoadSpeech
            }
          />
        )}
      </div>
      <div className={twMerge("mt-1.5 text-sm", hideMeanings && "hidden")}>
        {transLang === "en" ? data.en : data.ru}
      </div>
    </div>
  ));

  return asGrid ? grid : l;
}
