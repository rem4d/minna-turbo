import type { Kanji } from "@rem4d/db";
import { SpinnerBig } from "@/components/Spinner";
import WordReadings from "@/components/WordReadings";
import { api } from "@/utils/api";

interface Props {
  k: Kanji;
}

export function KCard({ k }: Props) {
  const { kun, on_, en, kanji } = k;

  const { data: examples, isLoading: examplesLoading } =
    api.kanji.examples.useQuery({ k: k.kanji ?? "" }, { enabled: !!k });

  return (
    <div>
      <div className="mb-4 flex space-x-4">
        <div className="flex aspect-square h-[96px] justify-center rounded-lg border border-black/10 bg-white drop-shadow-[3px_3px_0px_rgba(41,41,41,0.1)]">
          <div className="font-digi text-[60px] text-[#000]">{kanji}</div>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <span className="text-lg leading-6 font-bold">{en}</span>
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

      {examplesLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpinnerBig />
        </div>
      )}
      {!examplesLoading && examples && (
        <div className="h-full">
          <WordReadings list={examples} />
        </div>
      )}
    </div>
  );
}
export default KCard;
