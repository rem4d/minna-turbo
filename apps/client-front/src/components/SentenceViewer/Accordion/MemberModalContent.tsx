import { type MemberOutput } from "@rem4d/api";
import { twMerge } from "tailwind-merge";

interface EntryProps {
  ruby: string | null;
  text?: string | null;
  reading?: string | null;
  readings: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  pos: string | null;
  className?: string;
}

const Entry = ({
  ruby,
  text,
  reading,
  readings,
  en,
  ru,
  pos,
  className,
}: EntryProps) => {
  const showRuby = ruby ? true : !ruby && !text && reading;
  const rubyText = ruby ? ruby : reading;

  return (
    <div className={twMerge("flex items-start space-x-8 py-4", className)}>
      <div className="flex flex-col space-y-2">
        {showRuby && (
          <div
            className="font-yu-gothic cursor-pointer text-xl font-medium whitespace-nowrap"
            dangerouslySetInnerHTML={{
              __html: rubyText ?? "",
            }}
          />
        )}
        {!ruby && text && (
          <div className="flex flex-col space-y-1">
            <div className="font-yu-gothic cursor-pointer text-xl font-medium whitespace-nowrap">
              {text}
            </div>
            {reading && <span className="text-denim text-xs">[{reading}]</span>}
          </div>
        )}
        {pos && <Badge color="blue">{pos.toLowerCase()}</Badge>}
        {readings && readings.length > 0 && (
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
            {ru?.map((r, i) => <div key={r + i}>{r}</div>)}
          </div>
          <Badge color="purple">En</Badge>
          <div className="flex flex-col space-y-2">
            {en?.map((r, i) => <div key={r + i}>{r}</div>)}
          </div>
        </div>
        {/* <div */}
        {/*   onClick={() => setExpanded(!expanded)} */}
        {/*   className="text-denim cursor-pointer self-start text-sm font-semibold" */}
        {/* > */}
        {/*   Развернуть */}
        {/* </div> */}
      </div>
    </div>
  );
};

const MemberModalContent = ({ member }: { member: MemberOutput }) => {
  const first = member.entries[0];

  return (
    <div className="bg-white px-4 py-4">
      <Entry
        className="pt-0"
        ruby={member.ruby}
        reading={member.reading}
        readings={[]}
        en={first.en}
        ru={first.ru}
        pos={member.pos}
      />
      {member.entries.length > 1 ? (
        <div>
          <div className="my-4 h-[1px] w-full bg-black/20" />

          <div className="text-bold mb-4 text-sm font-semibold text-black/80">
            Возможные другие значения
          </div>

          <div className="flex flex-col divide-y divide-black/20">
            {member.entries.slice(1).map((e) => (
              <Entry
                key={e.id}
                ruby={null}
                text={e.words[0]?.txt}
                reading={e.readings[0]?.txt}
                readings={e.readings.slice(1)}
                en={e.en}
                ru={e.ru}
                pos={member.pos}
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
