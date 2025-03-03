import { SpinnerBig } from "@/components/Spinner";
import WordReadings from "@/components/WordReadings";
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

  return (
    <div>
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
