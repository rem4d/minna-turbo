import { useCallback } from "react";
import PlaySound from "@/components/PlaySound";
import { SpinnerBig } from "@/components/Spinner";
import { usePlaySoundConext } from "@/context/playSoundContext";
import { api } from "@/utils/api";

interface Props {
  selectedK: string;
}

export function KCard({ selectedK }: Props) {
  const { data: examples, isLoading: examplesLoading } =
    api.kanji.examples.useQuery(
      { k: selectedK ?? "" },
      { enabled: !!selectedK },
    );

  const {
    isPlaying,
    ttsLoading,
    onPlayClick,
    text: contextText,
  } = usePlaySoundConext();

  const onClick = (text: string) => {
    if (text) {
      onPlayClick(text);
    }
  };

  return (
    <div>
      {examplesLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpinnerBig />
        </div>
      )}
      {!examplesLoading && examples && (
        <div className="h-full">
          {examples.map((data, i) => (
            <div
              key={`${data.basic_form}-${i}`}
              className="flex space-y-3 space-x-2"
            >
              <div className="text-lg whitespace-nowrap">
                {data.basic_form === data.reading || data.reading === ""
                  ? ""
                  : data.basic_form}
              </div>

              <div className="mt-0.5 flex items-start space-x-2">
                <div className="text-denim text-base whitespace-nowrap">
                  {data.reading === "" ? data.basic_form : data.reading}
                </div>
                <PlaySound
                  reading={data.reading}
                  ttsLoading={data.reading === contextText && ttsLoading}
                  isPlaying={data.reading === contextText && isPlaying}
                  onClick={onClick}
                />
              </div>
              <div className="mt-1.5 text-sm">{data.means}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default KCard;
