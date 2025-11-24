import React from "react";
import { useAppStore } from "@/store";


import { twMerge } from "tailwind-merge";

interface MemberModalEntryProps {
  ruby: string | null;
  text?: string | null;
  reading?: string | null;
  readings?: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  pos: string | null;
  className?: string;
  onKanjiClick?: (id: number) => void;
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
  onKanjiClick,
}: MemberModalEntryProps) => {
  const showRuby = ruby ? true : !ruby && !text && reading;
  const rubyText = ruby ?? reading;
  const kanjiMap = useAppStore((state) => state.kanjiMap);

  const tmpText = ruby ?? text ?? "";


  const kanjis = React.useMemo(() => {
    const kanjiRegex = /[\u4E00-\u9FAF]/;
    return tmpText
      .split("")
      .filter((ch) => kanjiRegex.exec(tmpText) && kanjiMap.get(ch))
      .map((k) => (
        <div
          className="inline items-center justify-center rounded-md border bg-white px-3 py-2"
          onClick={() => onKanjiClick?.(kanjiMap.get(k)!)}
          key={k}
        >
          <span className="text-md font-semibold">{k}</span>
        </div>
      ));
  }, [tmpText, kanjiMap, onKanjiClick]);

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
        <div className="flex space-x-4">{kanjis}</div>
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
