import type { StateCreator } from "zustand";

import type {
  AccordionSlice,
  ActiveIndexSlice,
  SearchSlice,
  SentencesSlice,
  StoreType,
} from "./types";

export const activeIndexSlice: StateCreator<
  StoreType,
  [],
  [],
  ActiveIndexSlice
> = (set) => ({
  index: 0,
  increase: () => set((state) => ({ index: state.index + 1 })),
  decrease: () => set((state) => ({ index: state.index - 1 })),
  reset: () => set({ index: 0 }),
});

export const accordionSlice: StateCreator<StoreType, [], [], AccordionSlice> = (
  set,
) => ({
  openItems: [],
  setOpenItems: (p) => set({ openItems: p }),
  closeItem: (p) =>
    set((state) => ({ openItems: state.openItems.filter((i) => i !== p) })),
});

export const searchSlice: StateCreator<StoreType, [], [], SearchSlice> = (
  set,
) => ({
  text: "",
  setText: (p) => set({ text: p }),
});

export const sentencesSlice: StateCreator<StoreType, [], [], SentencesSlice> = (
  set,
) => ({
  sentences: [],
  idle: true,
  setSentences: (p) => set({ sentences: p }),
  concatSentences: (p) =>
    set((state) => ({ sentences: state.sentences.concat(p) })),
  setIdle: (p) => set({ idle: p }),
  resetSentences: () => set({ sentences: [] }),
});
