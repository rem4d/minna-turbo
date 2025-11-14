import type { StateCreator } from "zustand";
import { type SentenceOutput } from "@rem4d/api";
import { create } from "zustand";

type StoreType = SentencesSlice &
  ActiveIndexSlice &
  AccordionSlice &
  SearchSlice;

interface SentencesSlice {
  sentences: SentenceOutput[];
  idle: boolean;
  setSentences: (p: SentenceOutput[]) => void;
  resetSentences: () => void;
  setIdle: (p: boolean) => void;
}

interface ActiveIndexSlice {
  index: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const activeIndexSlice: StateCreator<StoreType, [], [], ActiveIndexSlice> = (
  set,
) => ({
  index: 0,
  increase: () => set((state) => ({ index: state.index + 1 })),
  decrease: () => set((state) => ({ index: state.index - 1 })),
  reset: () => set({ index: 0 }),
});

interface AccordionSlice {
  openItems: string[];
  setOpenItems: (p: string[]) => void;
  closeItem: (p: string) => void;
}

const accordionSlice: StateCreator<StoreType, [], [], AccordionSlice> = (
  set,
) => ({
  openItems: [],
  setOpenItems: (p) => set({ openItems: p }),
  closeItem: (p) =>
    set((state) => ({ openItems: state.openItems.filter((i) => i !== p) })),
});

interface SearchSlice {
  text: string;
  setText: (p: string) => void;
}

const searchSlice: StateCreator<StoreType, [], [], SearchSlice> = (set) => ({
  text: "",
  setText: (p) => set({ text: p }),
});

const sentencesSlice: StateCreator<StoreType, [], [], SentencesSlice> = (
  set,
) => ({
  sentences: [],
  idle: true,
  setSentences: (p) =>
    set((state) => ({ sentences: state.sentences.concat(p) })),
  setIdle: (p) => set({ idle: p }),
  resetSentences: () => set({ sentences: [] }),
});

export const useAppStore = create<StoreType>((...a) => ({
  ...activeIndexSlice(...a),
  ...accordionSlice(...a),
  ...searchSlice(...a),
  ...sentencesSlice(...a),
}));
