import { TRPCClientError } from "@trpc/client";
import { createBrowserRouter, useRouteError } from "react-router-dom";

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

const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (error instanceof TRPCClientError) {
    return (
      <div className="bg-athens-gray w-full">
        <div className="text-center text-black">
          Connection error has occurered.
        </div>
      </div>
    );
    // TODO: add other 4xx errors here. For example: 401, 403
  } else {
    // re-throw to let the parent Sentry.ErrorBoundary handles
    // it and logs it.
    console.log(error);
    throw error;
  }
};
export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <Base />,
    errorElement: <RouteErrorBoundary />,
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
