import type { FC } from "react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import PreviewCard from "@/components/PreviewCard";
import SectionHeader from "@/components/SectionHeader";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import getSearchReadings from "@/utils/getSearchReadings";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce, useSessionStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import type { KanjiOutput } from "@minna/api";

import SearchBar from "./SearchBar";

const AllKanjiLazy: FC = () => {
  const searchValue = useAppStore((state) => state.text);
  const setSearchValue = useAppStore((state) => state.setText);
  const debounced = useDebounce(searchValue, 200);

  const searchValueDeferred = debounced; //useDeferredValue(debounced);

  const [listOffset, setListOffset] = useSessionStorage<number>(
    "listOffset",
    0,
  );

  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // always remember the last position
    return () => {
      // eslint-disable-next-line
      const ref = containerRef?.current;
      if (ref) {
        setListOffset(ref?.scrollTop ?? 0);
      }
    };
    // eslint-disable-next-line
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.getBoundingClientRect().width;
      setContainerWidth(w);
    }
  }, []);

  useEffect(() => {
    if (searchValue !== "") {
      containerRef.current?.scrollTo(0, 0);
    }
  }, [searchValue]);

  const onCardClick = useCallback(() => {
    setListOffset(containerRef.current?.scrollTop ?? 0);
    // eslint-disable-next-line
  }, []);

  const trpc = useTRPC();

  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());

  const list = listQuery.data ?? [];

  const displayData = searchValueDeferred
    ? list.filter((d) => {
        const value = searchValueDeferred.trim().toLowerCase();
        const containsWord = getSearchReadings(d).some((v) =>
          v.startsWith(value),
        );
        return value === d.kanji || containsWord;
      })
    : list;

  const { t } = useTranslation();

  const len = displayData.length;

  const colCount = containerWidth > 350 || containerWidth === 0 ? 4 : 3;

  const colSize =
    containerWidth > 0 ? (containerWidth - (colCount - 1) * 21) / colCount : 87;

  const rowCount = Math.ceil(len / colCount);

  // eslint-disable-next-line
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => colSize,
    gap: 20,
    overscan: 1,
    initialOffset: () => listOffset,
    initialRect: { height: 700, width: 350 },
    paddingEnd: 12,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: colCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => colSize,
    gap: 20,
    initialRect: { height: 0, width: 300 },
  });

  // update columns dynamically
  useLayoutEffect(() => {
    columnVirtualizer.measure();
  }, [columnVirtualizer]);

  const cols = columnVirtualizer.getVirtualItems();

  return (
    <div
      className={twMerge(
        "flex flex-col space-y-8 px-4 pb-4",
        listQuery.isLoading && "h-full overflow-hidden",
      )}
    >
      <div
        ref={containerRef}
        className="no-scroll flex h-[calc(100dvh-87px)] w-full flex-col overflow-scroll overflow-x-hidden"
      >
        <SectionHeader className={listQuery.isLoading ? "opacity-0" : ""}>
          {t("all_kanji")}
        </SectionHeader>
        <SearchBar
          onChange={setSearchValue}
          value={searchValue}
          placeholderText={t("find")}
        />
        {len === 0 ? (
          <div className="text-black/60">{t("search_no_results")}</div>
        ) : null}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <React.Fragment key={virtualRow.key}>
              {cols.map((virtualColumn) => (
                <CardView
                  key={virtualColumn.key}
                  size={virtualColumn.size}
                  id={`vt-${displayData[virtualRow.index * colCount + virtualColumn.index]?.id}`}
                  transform={`translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`}
                  onClick={onCardClick}
                  data={
                    displayData[
                      virtualRow.index * colCount + virtualColumn.index
                    ]!
                  }
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  id: string;
  size: number;
  transform: string;
  data: KanjiOutput;
  onClick(): void;
}

function Card(props: CardProps) {
  // eslint-disable-next-line
  const { size, transform, data, onClick } = props;
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: transform,
      }}
    >
      <PreviewCard d={data} onClick={onClick} />
    </div>
  );
}

const CardView = React.memo(Card);

export default AllKanjiLazy;
