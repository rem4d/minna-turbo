import type { FC } from "react";
import { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import { Page } from "@/components/Page";
import PlaySound from "@/components/PlaySound";
import SectionHeader from "@/components/SectionHeader";
import { SpinnerBig } from "@/components/Spinner";
import { api } from "@/utils/api";

export const AllKanjiPage: FC = () => {
  const [selectedKId, setSelectedKId] = useState<number | null>(null);

  const { data } = api.kanji.all.useQuery();
  const selectedK = data?.find((d) => d.id === selectedKId);

  const { data: examples, isLoading: examplesLoading } =
    api.kanji.examples.useQuery(
      { k: selectedK?.kanji ?? "" },
      { enabled: !!selectedK },
    );

  const [open, setOpen] = useState(false);

  const onCardClick = useCallback((id: number) => {
    setSelectedKId(id);
    setOpen(true);
  }, []);

  return (
    <Page back>
      <div className="flex flex-col space-y-8 px-4 pb-4">
        <SectionHeader>Все кандзи</SectionHeader>
        <div>Update.</div>
        <div className="grid grid-cols-4 gap-4">
          {data?.map((k) => (
            <Card
              key={k.id}
              id={k.id}
              kanji={k.kanji}
              level={k.position}
              en={k.en ?? ""}
              onClick={onCardClick}
            />
          ))}
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen} noContainer>
        <div className="min-h-[60vh] bg-white px-4 py-4 pb-(--page-offset-bottom)">
          {selectedK && (
            <div className="mb-4 flex space-x-4">
              <div className="flex aspect-square h-[96px] justify-center rounded-lg border border-black/10 bg-white drop-shadow-[3px_3px_0px_rgba(41,41,41,0.1)]">
                <div className="font-digi text-[60px] text-[#000]">
                  {selectedK.kanji}
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2">
                <span className="text-lg leading-6 font-bold">
                  {selectedK.en}
                </span>
                {selectedK.kun && selectedK.kun.length > 0 && (
                  <span className="font-digi rounded-[18px] border px-2 py-1 text-lg leading-5 text-black">
                    {selectedK.kun.join("、")}
                  </span>
                )}
                {selectedK.on_ && selectedK.on_.length > 0 && (
                  <span className="font-digi rounded-[18px] border px-2 py-1 text-lg leading-5 text-black">
                    {selectedK.on_.join("、")}
                  </span>
                )}
              </div>
            </div>
          )}
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
                    <PlaySound text={data.reading} />
                  </div>
                  <div className="mt-1.5 text-sm">{data.means}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </Page>
  );
};

interface CardProps {
  kanji: string;
  level: number;
  id: number;
  en: string;
  onClick: (id: number) => void;
}

const Card: FC<CardProps> = ({ kanji, en, id, level, onClick }) => {
  const means = en.split(";")[0];
  return (
    <div
      className="relative flex aspect-square cursor-pointer flex-col justify-center overflow-hidden rounded-md border border-black/10 bg-white px-2 py-4 shadow-[3px_3px_0px_rgba(41,41,41,0.1)]"
      onClick={() => onClick(id)}
    >
      <div className="text-rolling-stone/70 absolute top-2 left-2 text-xs">
        {level}
      </div>
      <div className="flex flex-col space-y-1">
        <div className="font-digi text-center text-3xl text-black">{kanji}</div>
        <div className="truncate text-center text-xs whitespace-nowrap text-black">
          {means}
        </div>
      </div>
    </div>
  );
};

export default AllKanjiPage;
