import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface GlobalStore {
  index: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
  openItems: string[];
  setOpenItems: (p: string[]) => void;
  closeItem: (p: string) => void;
}

export const useGlobalStore = create<GlobalStore>()(
  devtools((set) => ({
    index: 0,
    increase: () => set((state) => ({ index: state.index + 1 })),
    decrease: () => set((state) => ({ index: state.index - 1 })),
    reset: () => set({ index: 0 }),
    openItems: [],
    setOpenItems: (p) => set({ openItems: p }),
    closeItem: (p) =>
      set((state) => ({ openItems: state.openItems.filter((i) => i !== p) })),
  })),
);
