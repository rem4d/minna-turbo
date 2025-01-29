import { createBrowserRouter } from "react-router-dom";
import { Base } from "./components/Base";
import { IndexPage } from "./pages/IndexPage";
import { LibraryPage } from "./pages/LibraryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AllKanjiPage } from "./pages/AllKanjiPage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { SentencesPage } from "./pages/SentencesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Base />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: "/library",
        element: <LibraryPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/library/all-kanji",
        element: <AllKanjiPage />,
      },
      {
        path: "/library/dict/:level",
        element: <DictionaryPage />,
      },
      {
        path: "/sentences",
        element: <SentencesPage />,
      },
      {
        path: "/flashcards",
        element: <FlashcardsPage />,
      },
    ],
  },
]);
