import type { FC } from "react";
import React from "react";
import { type KanjiOutput } from "@rem4d/api";
import * as motion from "motion/react-client";
import { twMerge } from "tailwind-merge";

interface ChooseLastKanjiScreenProps {
  kanjis: KanjiOutput[];
  selectedLevel: number;
  onLevelSelect: (position: number) => void;
}

export default React.memo(function ChooseLastKanjiScreen({
  kanjis,
  onLevelSelect,
  selectedLevel,
}: ChooseLastKanjiScreenProps) {
  return (
    <motion.div key="c2" className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2">
      {kanjis?.map((k) => (
        <KCard
          key={k.id}
          position={k.position}
          onClick={onLevelSelect}
          kanji={k.kanji}
          selected={k.position === selectedLevel}
        />
      ))}
    </motion.div>
  );
});

interface KCardProps {
  position: number;
  kanji: string;
  selected: boolean;
  inRange?: boolean;
  disabled?: boolean;
  onClick: (position: number) => void;
}

const KCard: FC<KCardProps> = React.memo(
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
