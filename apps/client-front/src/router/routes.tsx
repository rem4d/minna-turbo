import { AllKanjiPage } from "@/pages/AllKanjiPage";
import { DictionaryPage } from "@/pages/DictionaryPage";
import { FavouriteSentencesPage } from "@/pages/FavouriteSentencesPage";
import FlashcardsPage from "@/pages/FlashcardsPage/FlashcardsPage";
import { IndexPage } from "@/pages/IndexPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { SentencesPage } from "@/pages/SentencesPage";
import { SettingsPage } from "@/pages/SettingsPage";

import type { Route } from "./router";

export const paths = {
  home: "/",
  library: "/library",
  allKanji: "/all-kanji",
  settings: "/settings",
  dict: "/dict/:level",
  sentences: "/sentences",
  flashcards: "/flashcards",
  favouriteSentences: "/favorites",
};

export const routes: Route[] = [
  {
    path: paths.home,
    element: IndexPage,
    name: "index page",
  },
  {
    path: paths.flashcards,
    element: FlashcardsPage,
    name: "flashcards",
  },
  {
    path: paths.sentences,
    element: SentencesPage,
    name: "sentences",
  },
  {
    path: paths.library,
    element: LibraryPage,
  },
  {
    path: paths.settings,
    element: SettingsPage,
  },
  {
    path: paths.allKanji,
    element: AllKanjiPage,
  },
  {
    path: paths.dict,
    element: DictionaryPage,
  },
  {
    path: paths.favouriteSentences,
    element: FavouriteSentencesPage,
  },
];
