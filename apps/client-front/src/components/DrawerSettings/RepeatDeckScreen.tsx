import { useTRPC } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";

import KCell from "./KCell";

interface RepeatDeckScreenProps {
  selectedLevel: number;
  rangeTo: number | null;
  rangeFrom: number | null;
  onRangeSelectClick: (position: number) => void;
}

export default function RepeatDeckScreen({
  selectedLevel,
  onRangeSelectClick,
  rangeTo,
  rangeFrom,
}: RepeatDeckScreenProps) {
  const trpc = useTRPC();
  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const kanjis = kanjisQuery.data ?? [];

  const rangeSelected =
    typeof rangeFrom === "number" && typeof rangeTo === "number";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2"
    >
      {kanjis?.map((k) => (
        <KCell
          key={k.id}
          position={k.position}
          onClick={onRangeSelectClick}
          kanji={k.kanji}
          disabled={k.position > selectedLevel}
          selected={k.position === rangeFrom || k.position === rangeTo}
          inRange={
            rangeSelected && k.position > rangeFrom && k.position < rangeTo
          }
        />
      ))}
    </motion.div>
  );
}
