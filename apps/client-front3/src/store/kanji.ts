import type { StateCreator } from "zustand";

import type { KanjiMapSlice, StoreType } from "./types";

export const kanjiMapSlice: StateCreator<StoreType, [], [], KanjiMapSlice> = (
  set,
) => ({
  kanjiMap: new Map<string, number>(),
  setKanjiMap: (p) => {
    return set({ kanjiMap: new Map(p.map((k) => [k.kanji, k.id])) });
  },
});
