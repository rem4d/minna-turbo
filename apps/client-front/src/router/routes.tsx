import FlashcardsPage from "@/pages/FlashcardsPage/FlashcardsPage";
import { IndexPage } from "@/pages/IndexPage";
import { SentencesPage } from "@/pages/SentencesPage";

export const routes = [
  {
    path: "/",
    component: <IndexPage />,
  },
  {
    path: "/flashcards",
    component: <FlashcardsPage />,
  },
  {
    path: "/sentences",
    component: <SentencesPage />,
  },
];
