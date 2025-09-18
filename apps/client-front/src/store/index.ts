import type { StateCreator } from "zustand";
import { create } from "zustand";

interface ActiveIndexSlice {
  index: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

interface AccordionSlice {
  openItems: string[];
  setOpenItems: (p: string[]) => void;
  closeItem: (p: string) => void;
}

type StoreType = ActiveIndexSlice & AccordionSlice;

const activeIndexSlice: StateCreator<StoreType, [], [], ActiveIndexSlice> = (
  set,
) => ({
  index: 0,
  increase: () => set((state) => ({ index: state.index + 1 })),
  decrease: () => set((state) => ({ index: state.index - 1 })),
  reset: () => set({ index: 0 }),
});

const accordionSlice: StateCreator<StoreType, [], [], AccordionSlice> = (
  set,
) => ({
  openItems: [],
  setOpenItems: (p) => set({ openItems: p }),
  closeItem: (p) =>
    set((state) => ({ openItems: state.openItems.filter((i) => i !== p) })),
});

export const useGlobalStore = create<StoreType>((...a) => ({
  ...activeIndexSlice(...a),
  ...accordionSlice(...a),
}));
