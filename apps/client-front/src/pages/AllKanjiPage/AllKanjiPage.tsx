import type { FC } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import Thumbnail from "@/components/Thumbnail";
import { useRouter } from "@/router/router";
import { useTRPC } from "@/utils/api";
import { type KanjiOutput } from "@rem4d/api";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce, useSessionStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";
import { isHiragana, isKanji, isKatakana } from "wanakana";

import SearchBar from "./SearchBar";

export const AllKanjiPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
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

  const debouncedValue = useDebounce(searchValue, 400);
  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());

  const list = listQuery.data ?? [];

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

  const { t } = useTranslation();

  const len = displayData?.length ?? 0;

  const colCount = containerWidth > 350 ? 4 : 3;
  const colSize =
    containerWidth > 0 ? (containerWidth - (colCount - 1) * 21) / colCount : 90;

  const rowVirtualizer = useVirtualizer({
    count: len / colCount + 1,
    getScrollElement: () => containerRef.current,
    estimateSize: () => colSize,
    gap: 20,
    overscan: 1,
    initialOffset: () => listOffset,
    initialRect: { height: 300, width: 300 },
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: colCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => colSize,
    gap: 20,
    initialRect: { height: 300, width: 300 },
  });

  return (
    <Page backTo="/library" className="overflow-y-hidden">
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
        <div
          ref={containerRef}
          className="no-scroll flex h-full max-h-[calc(100vh-140px)] w-full overflow-scroll"
        >
          {/* <div className="flex flex-col space-y-8"> */}
          {/*   {filtered.map((d) => ( */}
          {/*     <PreviewCard key={d.id} d={d} onClick={onCardClick} /> */}
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
                    <PreviewCard
                      d={
                        displayData[
                          virtualRow.index * colCount + virtualColumn.index
                        ]
                      }
                      onClick={onCardClick}
                    />
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

const PreviewCard = React.memo(function PreviewCardFn({
  d,
  onClick,
}: {
  d: KanjiOutput;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();
  const _onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/kanji/" + d.id, { animationStyle: "remove" });
    onClick?.();
  };

  if (!d) {
    return null;
  }

  return (
    <div onClick={_onClick}>
      <Thumbnail
        title={d.kanji}
        level={d.position}
        id={d.id}
        means={d.en ?? ""}
      />
    </div>
  );
});

export default AllKanjiPage;
