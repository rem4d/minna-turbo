import type { StateCreator } from "zustand";
import { create } from "zustand";

type StoreType = ActiveIndexSlice & AccordionSlice & SearchSlice;

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

export const useAppStore = create<StoreType>((...a) => ({
  ...activeIndexSlice(...a),
  ...accordionSlice(...a),
  ...searchSlice(...a),
}));
