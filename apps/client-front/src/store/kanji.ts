import { StateCreator } from "zustand";

import { KanjiMapSlice, StoreType } from "./types";

export const kanjiMapSlice: StateCreator<StoreType, [], [], KanjiMapSlice> = (
  set,
) => ({
  kanjiMap: new Map<string, number>(),
  setKanjiMap: (p) => {
    return set({ kanjiMap: new Map(p.map((k) => [k.kanji, k.id])) });
  },
});
