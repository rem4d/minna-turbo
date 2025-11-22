import type { MemberOutput } from "@rem4d/api";
import React from "react";
import { useRouter } from "@/router/router";
import { useAppStore } from "@/store";
import { twMerge } from "tailwind-merge";

interface EntryProps {
  ruby: string | null;
  text?: string | null;
  reading?: string | null;
  readings?: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  pos: string | null;
  className?: string;
}

const Entry = ({
  ruby,
  text,
  reading,
  readings = [],
  en,
  ru,
  pos,
  className,
}: EntryProps) => {
  const showRuby = ruby ? true : !ruby && !text && reading;
  const rubyText = ruby ?? reading;
  const kanjiMap = useAppStore((state) => state.kanjiMap);

  const tmpText = ruby ?? text ?? "";
  const { navigate } = useRouter();

  const kanjis = React.useMemo(() => {
    const kanjiRegex = /[\u4E00-\u9FAF]/;
    return tmpText
      .split("")
      .filter((ch) => kanjiRegex.exec(tmpText) && kanjiMap.get(ch))
      .map((k) => (
        <div
          className="inline items-center justify-center rounded-md border bg-white px-3 py-2"
          onClick={() => navigate(`/kanji/${kanjiMap.get(k)}`)}
          key={k}
        >
          <span className="text-md font-semibold">{k}</span>
        </div>
      ));
  }, [tmpText, navigate, kanjiMap]);

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

const MemberModalContent = ({
  entries = [],
  pos,
  ruby,
  reading,
  readings,
  en,
  ru,
}: {
  pos: string | null;
  ruby: string | null;
  reading: string | null;
  readings?: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  entries?: MemberOutput["entries"];
}) => {
  return (
    <div className="bg-white px-4 py-4">
      <Entry
        className="pt-0"
        ruby={ruby}
        reading={reading}
        readings={readings}
        en={en}
        ru={ru}
        pos={pos}
      />
      {entries.length > 1 ? (
        <div>
          <div className="my-4 h-[1px] w-full bg-black/20" />

          <div className="text-bold mb-4 cursor-default text-sm">
            Возможные другие значения
          </div>

          <div className="flex flex-col divide-y divide-black/20">
            {entries.slice(1).map((e) => (
              <Entry
                key={e.id}
                ruby={null}
                text={e.words[0]?.txt}
                reading={e.readings[0]?.txt}
                readings={e.readings.slice(1)}
                en={e.en}
                ru={e.ru}
                pos={pos}
              />
            ))}
          </div>
        </div>
      ) : null}
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
export default MemberModalContent;
