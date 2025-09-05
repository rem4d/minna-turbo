import type { CellComponentProps } from "react-window";
import React, { useRef } from "react";
import useObserveRect from "@/hooks/useObserveRect";
import { useTRPC } from "@/utils/api";
import { type KanjiOutput } from "@rem4d/api";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import { Grid } from "react-window";
import { twMerge } from "tailwind-merge";

interface ChooseLastKanjiScreenProps {
  selectedLevel: number;
  onLevelSelect: (position: number) => void;
}

export default React.memo(function ChooseLastKanjiScreen({
  onLevelSelect,
}: ChooseLastKanjiScreenProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { width: gridWidth } = useObserveRect(gridRef);

  const trpc = useTRPC();
  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const kanjis = kanjisQuery.data ?? [];

  const virtualizedRowCount = kanjis.length / 4 + 1;
  const colCount = gridWidth > 350 ? 9 : 8;
  const colSize = gridWidth / colCount;

  return (
    <div className="no-scroll h-[calc(100vh-170px)] w-full" ref={gridRef}>
      <Grid
        className="no-scroll flex flex-col items-center"
        cellComponent={KCell}
        cellProps={{ list: kanjis, onClick: onLevelSelect, colCount }}
        columnCount={colCount}
        columnWidth={colSize}
        rowCount={virtualizedRowCount}
        rowHeight={colSize}
      />
    </div>
  );

  // return (
  //   <motion.div className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2">
  //     {kanjis?.map((k) => (
  //       <KCell
  //         key={k.id}
  //         position={k.position}
  //         onClick={onLevelSelect}
  //         kanji={k.kanji}
  //         selected={k.position === selectedLevel}
  //       />
  //     ))}
  //   </motion.div>
  // );
});

interface KCellProps {
  list: KanjiOutput[];
  // selected: boolean;
  colCount: number;
  onClick: (position: number) => void;
}

function KCell({
  list,
  columnIndex,
  colCount,
  rowIndex,
  onClick,
  style,
}: CellComponentProps<KCellProps>) {
  const index = rowIndex * colCount + columnIndex;
  const kanji = list[index]?.kanji;
  const level = list[index]?.position;
  const selected = false;

  return (
    <motion.div
      style={style}
      // initial={{ scale: 1 }}
      whileTap={{ scale: 1.1 }}
      onClick={() => onClick(level)}
      className={twMerge(
        "flex aspect-square h-full w-full flex-col justify-center text-black",
        selected && "bg-outer-space rounded-md text-white",
        // inRange && "bg-geyser",
        // disabled && "pointer-events-none opacity-40",
      )}
    >
      <div className="font-hiragino cursor-pointer text-center text-[28px] font-bold select-none">
        {kanji}
      </div>
    </motion.div>
  );
}
