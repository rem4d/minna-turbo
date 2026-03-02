import React, { use, useCallback, useEffect } from "react";
import PlaySound from "@/components/PlaySound";
import { STORAGE_LANG } from "@/config/const";
import {
  PlaySoundContext,
  usePlaySoundContext,
} from "@/context/playSoundContext";
import { getMemberShortText } from "@/utils/memberShortText";
import { useLocalStorage } from "@uidotdev/usehooks";

// import MemberModalContent from "@/components/MemberModal/MemberModalContent";
// import { twMerge } from "tailwind-merge";
// import { Drawer } from "vaul";
// import GrabberAndCloseButton from "./Drawer/GrabberAndCloseButton";

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
  nested?: boolean;
}

export default function WordReadings({ list = [] /* , nested */ }: Props) {
  // const [selectedMember, setSelectedMember] = useState<
  //   ListItem | null | undefined
  // >(null);

  // eslint-disable-next-line
  const { isCurrent, play, clear } = usePlaySoundContext();

  useEffect(() => {
    return () => {
      void clear();
    };
  }, [list, clear]);

  const [transLang] = useLocalStorage<"ru" | "en" | null>(STORAGE_LANG, null);

  const onSoundClick = useCallback(
    (reading: string | null, index?: number) => {
      if (!reading) {
        return;
      }
      play(reading, `${reading}+${index}`);
    },
    [play],
  );

  const onMemberClick = useCallback((txt: string | null) => {
    if (!txt) {
      return;
    }
    // setModalOpen(true);
    // setSelectedMember(list.find((m) => m.text === txt));
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      {list.map((data, i) => (
        <ListRow
          key={`${data.text}-${i}`}
          index={i}
          isCurrent={isCurrent(`${data.reading}+${i}`)}
          text={data.text ?? ""}
          reading={data.reading ?? ""}
          translation={getMemberShortText({
            transLang,
            ru: data.ru,
            en: data.en,
          })}
          onMemberClick={onMemberClick}
          onSoundClick={onSoundClick}
          children={
            undefined /* (
            // @TODO: separate if possible
            <Drawer.NestedRoot>
              <Drawer.Trigger className="block truncate overflow-hidden text-sm">
                {getMemberShortText({ transLang, ru: data.ru, en: data.en })}
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content
                  className={twMerge(
                    "fixed right-0 bottom-0 left-0 mt-24 flex h-full max-h-[calc(100%-var(--page-offset-top-full)-16px)] flex-col rounded-t-[10px] bg-gray-100 lg:h-[327px]",
                    nested &&
                      "max-h-[calc(100%-var(--page-offset-top-full)-32px)]",
                  )}
                >
                  <Drawer.Title></Drawer.Title>
                  <Drawer.Description></Drawer.Description>
                  <div className="no-scroll relative flex-1 overflow-y-scroll rounded-t-[10px] bg-white">
                    <GrabberAndCloseButton />

                    <div className="flex flex-1 flex-col p-4 pt-0">
                      {selectedMember && (
                        <MemberModalContent
                          pos={selectedMember.pos}
                          ruby={selectedMember.ruby}
                          reading={selectedMember.reading}
                          en={selectedMember.en ?? null}
                          ru={selectedMember.ru ?? null}
                          entries={[]}
                          hideKanji
                        />
                      )}
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.NestedRoot>
          )*/
          }
        />
      ))}
    </div>
  );
}

const ListRow = React.memo(function ListRow_({
  text,
  reading,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onMemberClick,
  index: i,
  isCurrent,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onSoundClick,
  translation,
}: {
  text: string;
  reading: string;
  translation: string;
  onMemberClick(t: string): void;
  index: number;
  isCurrent: boolean;
  onSoundClick(d: string | null, i: number): void;
  children?: React.ReactNode; // tmp
}) {
  let isLoading = false,
    isPlaying = false;

  if (isCurrent) {
    const contextData = use(PlaySoundContext);
    isLoading = contextData.isLoading;
    isPlaying = contextData.isPlaying;
  }

  return (
    <div
      className="flex cursor-default items-end space-x-2 border-b border-dashed border-transparent text-lg whitespace-nowrap hover:border-gray-600/40"
      onClick={() => (text ? onMemberClick(text) : {})}
    >
      <div>
        <span className="">
          {text === reading || reading === "" ? "" : text}
        </span>
      </div>

      <div className="flex items-start space-x-2">
        {reading && reading.length > 7 ? null : (
          <div className="text-denim text-base whitespace-nowrap">
            {reading === "" ? text : reading}
          </div>
        )}
        {reading && (
          <PlaySound
            reading={reading}
            isLoading={isLoading}
            isPlaying={isPlaying}
            onClick={() => onSoundClick(reading, i)}
          />
        )}
      </div>
      <div className="block truncate overflow-hidden text-sm">
        {translation}
      </div>
    </div>
  );
});
