import type { KanjiOutput, SentenceOutput } from "@rem4d/api";

export type StoreType = SentencesSlice &
  ActiveIndexSlice &
  AccordionSlice &
  SearchSlice &
  KanjiMapSlice;

export interface SentencesSlice {
  sentences: SentenceOutput[];
  idle: boolean;
  setSentences: (p: SentenceOutput[]) => void;
  concatSentences: (p: SentenceOutput[]) => void;
  resetSentences: () => void;
  setIdle: (p: boolean) => void;
}

export interface ActiveIndexSlice {
  index: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

export interface AccordionSlice {
  openItems: string[];
  setOpenItems: (p: string[]) => void;
  closeItem: (p: string) => void;
}

export interface SearchSlice {
  text: string;
  setText: (p: string) => void;
}

export interface SentencesSlice {
  sentences: SentenceOutput[];
  idle: boolean;
  setSentences: (p: SentenceOutput[]) => void;
  concatSentences: (p: SentenceOutput[]) => void;
  resetSentences: () => void;
  setIdle: (p: boolean) => void;
}

export interface KanjiMapSlice {
  kanjiMap: Map<string, number>;
  // setKanjiMap: (m: Map<string, number>) => void;
  setKanjiMap: (arr: KanjiOutput[]) => void;
}
