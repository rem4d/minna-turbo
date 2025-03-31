import type { FC } from "react";
import { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import KCard from "@/components/KCard";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { api } from "@/utils/api";
import { useDebounce } from "@uidotdev/usehooks";
import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";
import { isHiragana, isKanji, isKatakana } from "wanakana";

import SearchBar from "./SearchBar";

export const AllKanjiPage: FC = () => {
  const [selectedKId, setSelectedKId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 400);

  const { data, isLoading } = api.viewer.kanji.all.useQuery();
  const selectedK = data?.find((d) => d.id === selectedKId);

  const displayData = debouncedValue
    ? data?.filter((d) => {
        const value = debouncedValue.trim();

        if (isHiragana(value)) {
          return d.kun?.join(";").includes(debouncedValue);
        }

        if (isKatakana(value)) {
          return d.on_?.join(";").includes(debouncedValue);
        }

        if (isKanji(value)) {
          return d.kanji === debouncedValue.trim();
        }

        return d.en?.includes(debouncedValue.toLowerCase());
      })
    : data;

  const [open, setOpen] = useState(false);

  const onCardClick = useCallback((id: number) => {
    setSelectedKId(id);
    setOpen(true);
  }, []);

  return (
    <Page back>
      <div
        className={twMerge(
          "flex flex-col space-y-8 px-4 pb-4",
          isLoading && "h-full overflow-hidden",
        )}
      >
        <SectionHeader className={isLoading ? "opacity-0" : ""}>
          Все кандзи
        </SectionHeader>
        <SearchBar onChange={setSearchValue} value={searchValue} />
        {isLoading && (
          <Skeleton
            className="aspect-square"
            count={38}
            borderRadius={6}
            containerClassName="grid grid-cols-3 sm:grid-cols-4 gap-4"
            inline
          />
        )}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {displayData?.map((k) => (
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
        )}
      </div>

      <Drawer open={open} onOpenChange={setOpen} noContainer>
        <div className="min-h-[60vh] bg-white px-4 py-4 pb-(--page-offset-bottom)">
          {selectedK && <KCard k={selectedK} />}
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
