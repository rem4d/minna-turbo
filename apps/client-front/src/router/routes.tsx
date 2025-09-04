import type { ReactElement } from "react";
import { AllKanjiPage } from "@/pages/AllKanjiPage";
import { DictionaryPage } from "@/pages/DictionaryPage";
import { FavouriteSentencesPage } from "@/pages/FavouriteSentencesPage";
import FlashcardsPage from "@/pages/FlashcardsPage/FlashcardsPage";
import { IndexPage } from "@/pages/IndexPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { SentencesPage } from "@/pages/SentencesPage";
import { SettingsPage } from "@/pages/SettingsPage";

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

interface Route {
  path: string;
  element: ReactElement;
  animationStyle: "slide" | "default";
}

export const routes: Route[] = [
  {
    path: paths.home,
    element: <IndexPage />,
    animationStyle: "default",
  },
  {
    path: paths.flashcards,
    element: <FlashcardsPage />,
    animationStyle: "slide",
  },
  {
    path: paths.sentences,
    element: <SentencesPage />,
    animationStyle: "slide",
  },
  {
    path: paths.library,
    element: <LibraryPage />,
    animationStyle: "default",
  },
  {
    path: paths.settings,
    element: <SettingsPage />,
    animationStyle: "default",
  },
  {
    path: paths.allKanji,
    element: <AllKanjiPage />,
    animationStyle: "slide",
  },
  {
    path: paths.dict,
    element: <DictionaryPage />,
    animationStyle: "default",
  },
  {
    path: paths.favouriteSentences,
    element: <FavouriteSentencesPage />,
    animationStyle: "slide",
  },
];
