import GrabberAndCloseButton from "@/components/Drawer/GrabberAndCloseButton";
import { useAppStore } from "@/store";
import { twMerge } from "tailwind-merge";
import { Drawer } from "vaul";

import KanjiInfo from "../KanjiInfo";

interface MemberModalEntryProps {
  ruby: string | null;
  text?: string | null;
  reading?: string | null;
  readings?: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  pos: string | null;
  className?: string;
  hideKanji?: boolean;
}

const MemberModalEntry = ({
  ruby,
  text,
  reading,
  readings = [],
  en,
  ru,
  pos,
  className,
  hideKanji = false,
}: MemberModalEntryProps) => {
  const showRuby = ruby ? true : !ruby && !text && reading;
  const rubyText = ruby ?? reading;
  const kanjiMap = useAppStore((state) => state.kanjiMap);
  const keys = [...kanjiMap.keys()];

  const tmpText = (ruby ?? text ?? "").split("");

  const tmp: string[] = [];
  const kanjiRegex = /[\u4E00-\u9FAF]/;

  for (const ch of tmpText) {
    if (tmp.includes(ch)) {
      continue;
    }
    if (kanjiRegex.exec(ch) && keys.includes(ch)) {
      tmp.push(ch);
    }
  }

  const kanjis = tmp.map((k) => (
    <div key={k}>
      <Drawer.NestedRoot>
        <Drawer.Trigger className="text-md inline items-center justify-center rounded-md border bg-white px-3 py-2 font-semibold">
          <span className="text-md font-semibold">{k}</span>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 mt-24 flex h-full max-h-[calc(100%-16px)] flex-col rounded-t-[10px] bg-gray-100">
            <Drawer.Title></Drawer.Title>
            <Drawer.Description></Drawer.Description>
            <div className="no-scroll relative flex-1 overflow-y-scroll rounded-t-[10px] bg-white">
              <GrabberAndCloseButton />
              <KanjiInfo kanjiSymbol={k} nested={true} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.NestedRoot>
    </div>
  ));

  return (
    <div className={twMerge("flex items-start space-x-8 py-4", className)}>
      <div className="flex flex-col space-y-2">
        {showRuby && (
          <div
            className="font-yu-gothic text-xl font-medium whitespace-nowrap"
            dangerouslySetInnerHTML={{
              __html: rubyText ?? "",
            }}
          />
        )}
        {!ruby && text && (
          <div className="flex flex-col space-y-1">
            <div className="font-yu-gothic text-xl font-medium whitespace-nowrap">
              {text}
            </div>
            {reading && <span className="text-denim text-xs">[{reading}]</span>}
          </div>
        )}
        {pos && <Badge color="blue">{pos.toLowerCase()}</Badge>}
        {readings && readings.length > 1 && (
          <div>
            [
            {readings.map((r) => (
              <span key={r.txt} className="text-denim text-xs">
                {r.txt},{" "}
              </span>
            ))}
            ]
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <div
          className={twMerge("flex flex-col space-y-4 overflow-hidden text-sm")}
        >
          <div className="flex flex-col space-y-2">
            {ru?.map((r, i) => (
              <div key={r + i}>{r}</div>
            ))}
          </div>
          <Badge color="purple">En</Badge>
          <div className="flex flex-col space-y-2">
            {en?.map((r, i) => (
              <div key={r + i}>{r}</div>
            ))}
          </div>
        </div>
        {!hideKanji && kanjis.length > 0 && (
          <div className="flex space-x-4">{kanjis}</div>
        )}
      </div>
    </div>
  );
};

const Badge = ({
  children,
  color,
}: React.PropsWithChildren<{ color: "blue" | "purple" }>) => {
  return (
    <span
      className={twMerge(
        "self-start rounded-md px-3 py-1 text-sm font-bold",
        color === "blue" && "bg-sea-serpent/20 text-sea-serpent",
        color === "purple" && "bg-slate-blue/20 text-slate-blue",
      )}
    >
      {children}
    </span>
  );
};
export default MemberModalEntry;
