import { AllKanjiPage } from "@/pages/AllKanjiPage";
import { DictionaryPage } from "@/pages/DictionaryPage";
import { FavouriteSentencesPage } from "@/pages/FavouriteSentencesPage";
import { IndexPage } from "@/pages/IndexPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { SentencesPage } from "@/pages/SentencesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SingleKanjiPage } from "@/pages/SingleKanjiPage";

import type { Route } from "./router";

export const paths = {
  home: "/",
  library: "/library",
  allKanji: "/all-kanji",
  settings: "/settings",
  dict: "/dict/:level", // temporary unavailable
  sentences: "/sentences",
  favouriteSentences: "/favorites",
  singleKanji: "/kanji",
};

export const routes: Route[] = [
  {
    path: paths.home,
    element: IndexPage,
    name: "index page",
  },
  {
    path: paths.sentences,
    element: SentencesPage,
    name: "sentences",
  },
  {
    path: paths.library,
    element: LibraryPage,
    name: "library",
  },
  {
    path: paths.settings,
    element: SettingsPage,
    name: "settings",
  },
  {
    path: paths.allKanji,
    element: AllKanjiPage,
    name: "all kanji",
    parentPath: paths.library,
  },
  {
    path: paths.dict,
    element: DictionaryPage,
    name: "dict",
  },
  {
    path: paths.favouriteSentences,
    element: FavouriteSentencesPage,
    name: "fav",
  },
  {
    path: paths.singleKanji,
    element: SingleKanjiPage,
    name: "single kanji",
    parentPath: paths.allKanji,
    approximate: true,
  },
];
