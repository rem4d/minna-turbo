import type { FC } from "react";
import React from "react";
import * as motion from "motion/react-client";
import { twMerge } from "tailwind-merge";

interface KCellProps {
  position: number;
  kanji: string;
  selected: boolean;
  inRange?: boolean;
  disabled?: boolean;
  onClick: (position: number) => void;
}

const KCell: FC<KCellProps> = React.memo(
  ({
    position,
    kanji,
    selected,
    inRange = false,
    disabled = false,
    onClick,
  }) => {
    return (
      <motion.div
        initial={{ scale: 1 }}
        whileTap={{ scale: 1.1 }}
        onClick={() => onClick(position)}
        className={twMerge(
          "relative flex aspect-square h-full w-full flex-col justify-center text-black",
          selected && "bg-outer-space rounded-md text-white",
          inRange && "bg-geyser",
          disabled && "pointer-events-none opacity-40",
        )}
      >
        <div className="font-hiragino cursor-pointer text-center text-[28px] font-bold select-none">
          {kanji}
        </div>
      </motion.div>
    );
  },
);
export default KCell;
