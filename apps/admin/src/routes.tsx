import { createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages/IndexPage";
import { NewSentencePage } from "./pages/NewSentencePage";
import { Base } from "./components/Base";
import { StatisticPage } from "./pages/StatisticPage";
import { EditSentencePage } from "./pages/EditSentencePage";
import { SimulatorPage } from "./pages/SimulatorPage";
import { DictionaryPage } from "./pages/DictionaryPage";

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
        path: "/new",
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
        path: "/simulator",
        element: <SimulatorPage />,
      },
      {
        path: "/dictionary",
        element: <DictionaryPage />,
      },
    ],
  },
]);
