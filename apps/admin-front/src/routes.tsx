import { createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages/IndexPage";
import { NewSentencePage } from "./pages/NewSentencePage";
import { Base } from "./components/Base";
import { StatisticPage } from "./pages/StatisticPage";
import { EditSentencePage } from "./pages/EditSentencePage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { FilterListPage } from "./pages/FilterListPage";
import { RusificatorPage } from "./pages/RusificatorPage";

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
        path: "/create",
        element: <NewSentencePage />,
      },
      {
        path: "/edit/:id",
        element: <EditSentencePage />,
      },
      {
        path: "/stats",
        element: <StatisticPage />,
      },
      {
        path: "/dictionary",
        element: <DictionaryPage />,
      },
      {
        path: "/filter",
        element: <FilterListPage />,
      },
      {
        path: "/rusify",
        element: <RusificatorPage />,
      },
    ],
  },
]);
