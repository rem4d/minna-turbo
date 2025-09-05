import React from "react";
import { useTRPC } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";

import KCell from "./KCell";

interface ChooseLastKanjiScreenProps {
  selectedLevel: number;
  onLevelSelect: (position: number) => void;
}

export default React.memo(function ChooseLastKanjiScreen({
  onLevelSelect,
  selectedLevel,
}: ChooseLastKanjiScreenProps) {
  const trpc = useTRPC();
  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const kanjis = kanjisQuery.data ?? [];

  return (
    <motion.div key="c2" className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2">
      {kanjis?.map((k) => (
        <KCell
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
