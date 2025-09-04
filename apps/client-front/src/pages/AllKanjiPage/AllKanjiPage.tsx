import type { FC } from "react";
import type { CellComponentProps } from "react-window";
import { useCallback, useEffect, useRef, useState } from "react";
import Drawer from "@/components/Drawer";
import KCard from "@/components/KCard";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { useTRPC } from "@/utils/api";
import { type KanjiOutput } from "@rem4d/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { Grid } from "react-window";
import { twMerge } from "tailwind-merge";
import { isHiragana, isKanji, isKatakana } from "wanakana";

import SearchBar from "./SearchBar";

export const AllKanjiPage: FC = () => {
  const [selectedKId, setSelectedKId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);

  const trpc = useTRPC();

  useEffect(() => {
    const elem = gridRef.current;
    if (!elem) return;

    const observer = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setGridWidth(w);
    });
    observer.observe(elem);

    return () => {
      observer.unobserve(elem);
    };
  }, []);

  const debouncedValue = useDebounce(searchValue, 400);

  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());

  const list = listQuery.data ?? [];

  const selectedK = list.find((d) => d.id === selectedKId);

  const displayData = debouncedValue
    ? list?.filter((d) => {
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
    : list;

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const onCardClick = useCallback((id: number) => {
    setSelectedKId(id);
    setOpen(true);
  }, []);

  const len = displayData?.length ?? 0;
  const virtualizedRowCount = len / 4 + 1;

  const colCount = gridWidth > 350 ? 4 : 3;
  const colSize = gridWidth / colCount;

  return (
    <Page back className="overflow-y-hidden">
      <div
        className={twMerge(
          "flex flex-col space-y-8 px-4 pb-4",
          listQuery.isLoading && "h-full overflow-hidden",
        )}
      >
        <SectionHeader className={listQuery.isLoading ? "opacity-0" : ""}>
          {t("all_kanji")}
        </SectionHeader>
        <SearchBar
          onChange={setSearchValue}
          value={searchValue}
          placeholderText={t("find")}
        />
        {listQuery.isLoading && (
          <Skeleton
            className="aspect-square"
            count={32}
            borderRadius={6}
            containerClassName="grid grid-cols-3 sm:grid-cols-4 gap-4"
            inline
          />
        )}
        <div className="no-scroll h-[calc(100vh-170px)] w-full" ref={gridRef}>
          {!listQuery.isLoading && (
            <Grid
              className="no-scroll flex flex-col items-center"
              cellComponent={Card}
              cellProps={{ list: displayData ?? [], onClick: onCardClick }}
              columnCount={colCount}
              columnWidth={colSize}
              rowCount={virtualizedRowCount}
              rowHeight={colSize}
            />
          )}
        </div>
      </div>

      <Drawer open={open} onOpenChange={setOpen} noContainer>
        <div className="flex h-full min-h-[60vh] flex-col bg-white px-4 py-4 pb-(--page-offset-bottom)">
          {selectedK && <KCard k={selectedK} className="scale-[1.0]" />}
        </div>
      </Drawer>
    </Page>
  );
};

function Card({
  list,
  columnIndex,
  rowIndex,
  style,
  onClick,
}: CellComponentProps<{
  list: KanjiOutput[];
  onClick?: (id: number) => void;
}>) {
  const index = rowIndex * 4 + columnIndex;

  const en = list[index]?.en;
  const means = en?.split(";")[0];

  const kanji = list[index]?.kanji;
  const level = list[index]?.position;
  const id = list[index]?.id;

  // eslint-disable-next-line
  const handleClick = () => onClick?.(id);

  if (!id) return null;

  return (
    <div className="" style={style} onClick={handleClick}>
      <div className="relative m-2 flex aspect-square cursor-pointer flex-col justify-center overflow-hidden rounded-md border border-black/10 bg-white px-1 py-2 shadow-[3px_3px_0px_rgba(41,41,41,0.1)]">
        <div className="text-rolling-stone/70 absolute top-2 left-2 text-xs">
          {level}
        </div>
        <div className="flex flex-col space-y-1">
          <div className="font-digi text-center text-3xl text-black">
            {kanji}
          </div>
          <div className="truncate text-center text-xs whitespace-nowrap text-black">
            {means}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllKanjiPage;
