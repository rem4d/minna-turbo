import type { SentenceLike } from "@/types";

import type { KanjiOutput } from "@minna/api";
import type { ReadingPositionItem } from "@minna/ui";

export const parseReadings = (
  sentence: SentenceLike,
  kanjiMap: Map<string, KanjiOutput>,
  userLevel?: number | null,
) => {
  const txt = sentence.text_with_furigana ?? "";
  try {
    const readings_ = JSON.parse(txt) as ReadingPositionItem[];
    if (!userLevel) {
      return readings_;
    }

    const hiddenAssigned = readings_.map((r) => {
      const arr = r.kanji.split("");
      const passed = arr.every((k) => kanjiMap.has(k));
      const levels = arr.map((k) => kanjiMap.get(k)?.position ?? 0);
      const maxLevel = Math.max(...levels);

      return {
        ...r,
        hidden: passed && maxLevel <= userLevel,
      };
    });

    return hiddenAssigned;
  } catch (error) {
    console.error(error);
    return [];
  }
};
