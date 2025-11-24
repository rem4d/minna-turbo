import { create } from "zustand";

import type { StoreType } from "./types";
import { kanjiMapSlice } from "./kanji";
import {
  accordionSlice,
  activeIndexSlice,
  searchSlice,
  sentencesSlice,
} from "./sentences";

export const useAppStore = create<StoreType>((...a) => ({
  ...activeIndexSlice(...a),
  ...accordionSlice(...a),
  ...searchSlice(...a),
  ...sentencesSlice(...a),
  ...kanjiMapSlice(...a),
}));
