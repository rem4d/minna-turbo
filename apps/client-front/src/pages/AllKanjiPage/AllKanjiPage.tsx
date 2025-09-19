import type { FC } from "react";
import React, { useCallback, useEffect, useRef } from "react";
import { Page } from "@/components/Page";
import PreviewCard from "@/components/PreviewCard";
import SectionHeader from "@/components/SectionHeader";
import ViewTransition from "@/components/ViewTransition";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import getSearchReadings from "@/utils/getSearchReadings";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce, useSessionStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";

import SearchBar from "./SearchBar";

export const AllKanjiPage: FC = () => {
  const searchValue = useAppStore((state) => state.text);
  const setSearchValue = useAppStore((state) => state.setText);
  const debounced = useDebounce(searchValue, 200);

  const searchValueDeferred = debounced; //useDeferredValue(debounced);

  const [listOffset, setListOffset] = useSessionStorage<number>(
    "listOffset",
    0,
  );
  const [containerWidth, setContainerWidth] = useSessionStorage<number>(
    "containerWidth",
    0,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue !== "") {
      containerRef.current?.scrollTo(0, 0);
    }
  }, [searchValue, setListOffset]);

  useEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.getBoundingClientRect().width;
      setContainerWidth(Math.max(w, containerWidth));
    }
  }, [containerRef, containerWidth, setContainerWidth]);

  const onCardClick = useCallback(() => {
    setListOffset(containerRef.current?.scrollTop ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  const trpc = useTRPC();

  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());

  const list = listQuery.data ?? [];

  const displayData = searchValueDeferred
    ? list?.filter((d) => {
        const value = searchValueDeferred.trim().toLowerCase();
        const containsWord = getSearchReadings(d).some((v) =>
          v.startsWith(value),
        );
        return value === d.kanji || containsWord;
      })
    : list;

  const { t } = useTranslation();

  const len = displayData.length;

  const colCount = containerWidth > 350 ? 4 : 3;

  const colSize =
    containerWidth > 0 ? (containerWidth - (colCount - 1) * 21) / colCount : 90;

  const rowCount = Math.ceil(len / colCount);

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

  return (
    <Page
      backTo="/library"
      className="overflow-y-hidden"
      backAnimationStyle="nav-back"
    >
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
        {len === 0 ? (
          <div className="text-black/60">{t("search_no_results")}</div>
        ) : null}
        <div
          ref={containerRef}
          className="no-scroll flex h-full max-h-[calc(100vh-140px)] w-full overflow-scroll"
        >
          {/* <div className="flex flex-col space-y-8"> */}
          {/*   {displayData.map((d) => ( */}
          {/*     <ViewTransition key={d.id}> */}
          {/*       <div className="size-[90px]" key={d.id}> */}
          {/*         <PreviewCard d={d} onClick={onCardClick} /> */}
          {/*       </div> */}
          {/*     </ViewTransition> */}
          {/*   ))} */}
          {/* </div> */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <React.Fragment key={virtualRow.key}>
                {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                  <div
                    key={virtualColumn.key}
                    className="absolute top-0 left-0"
                    style={{
                      width: `${virtualRow.size}px`,
                      height: `${virtualRow.size}px`,
                      transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ViewTransition
                      key={`vt-${displayData[virtualRow.index * colCount + virtualColumn.index]?.id}`}
                      update="none"
                      default="none"
                    >
                      <PreviewCard
                        d={
                          displayData[
                            virtualRow.index * colCount + virtualColumn.index
                          ]
                        }
                        onClick={onCardClick}
                      />
                    </ViewTransition>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AllKanjiPage;
