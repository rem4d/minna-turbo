import { createBrowserRouter } from "react-router-dom";

import { Base } from "./components/Base";
import { AllKanjiPage } from "./pages/AllKanjiPage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { IndexPage } from "./pages/IndexPage";
import { LibraryPage } from "./pages/LibraryPage";
import { SentencesPage } from "./pages/SentencesPage";
import { SettingsPage } from "./pages/SettingsPage";

export const paths = {
  home: "/",
  library: "/library",
  allKanji: "/library/all-kanji",
  settings: "/settings",
  dict: "/library/dict/:level",
  sentences: "/sentences",
  flashcards: "/flashcards",
};

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <Base />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: paths.library,
        element: <LibraryPage />,
      },
      {
        path: paths.settings,
        element: <SettingsPage />,
      },
      {
        path: paths.allKanji,
        element: <AllKanjiPage />,
      },
      {
        path: paths.dict,
        element: <DictionaryPage />,
      },
      {
        path: paths.sentences,
        element: <SentencesPage />,
      },
      {
        path: paths.flashcards,
        element: <FlashcardsPage />,
      },
    ],
  },
]);
