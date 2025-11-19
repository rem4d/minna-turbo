import { Fragment, useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import MemberModalContent from "@/components/Modal/MemberModalContent";
import PlaySound from "@/components/PlaySound";
import { STORAGE_LANG } from "@/config/const";
import { usePlaySoundContext } from "@/context/playSoundContext";
import { getMemberShortText } from "@/utils/memberShortText";
import { useLocalStorage } from "@uidotdev/usehooks";
import { twMerge } from "tailwind-merge";

interface ListItem {
  text: string | null;
  pos: string | null;
  ruby: string | null;
  reading: string | null;
  en: string[] | null;
  ru: string[] | null;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    ListItem | null | undefined
  >(null);

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

  const onMemberClick = (txt: string | null) => {
    if (!txt) {
      return;
    }
    setModalOpen(true);
    setSelectedMember(list.find((m) => m.text === txt));
  };

  const grid = (
    <div className="font-yuGothic mb-[100px] grid grid-cols-3 gap-4 rounded-[10px] bg-white p-2">
      {list.map((data, i) => (
        <Fragment key={`${data.text}-${i}`}>
          <div className="flex items-start space-x-2">
            <div
              className="text-denim text-base whitespace-nowrap"
              onClick={() => onMemberClick(data.text)}
            >
              {data.reading === "" ? data.text : data.reading}
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
            {data.text === data.reading || data.reading === "" ? "" : data.text}
          </div>
          <div className="text-sm">
            {transLang === "en" ? data.en : data.ru}
          </div>
        </Fragment>
      ))}
    </div>
  );

  const l = list.map((data, i) => (
    <div
      key={`${data.text}-${i}`}
      className="flex cursor-default items-end space-x-2 border-b border-dashed border-transparent text-lg whitespace-nowrap hover:border-gray-600/40"
      onClick={() => onMemberClick(data.text)}
    >
      <div>
        <span className="">
          {data.text === data.reading || data.reading === "" ? "" : data.text}
        </span>
      </div>

      <div className="flex items-start space-x-2">
        {hideMeanings || (data.reading && data.reading.length > 7) ? null : (
          <div className="text-denim text-base whitespace-nowrap">
            {data.reading === "" ? data.text : data.reading}
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
      <div
        className={twMerge(
          "block truncate overflow-hidden text-sm",
          hideMeanings && "hidden",
        )}
      >
        {getMemberShortText({ transLang, ru: data.ru, en: data.en })}
      </div>
    </div>
  ));

  return (
    <>
      {asGrid ? grid : <div className="flex flex-col space-y-2">{l}</div>}

      <Drawer
        contentClassName="bg-white"
        open={!!modalOpen}
        onOpenChange={() => setModalOpen(false)}
      >
        {selectedMember && (
          <MemberModalContent
            pos={selectedMember.pos}
            ruby={selectedMember.ruby}
            reading={selectedMember.reading}
            en={selectedMember.en}
            ru={selectedMember.ru}
            entries={[]}
          />
        )}
      </Drawer>
    </>
  );
}
