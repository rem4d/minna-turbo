import type { Kanji } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { CardDeck } from "@/components/CardDeck/CardDeck";
import { Page } from "@/components/Page";
import { api } from "@/utils/api";
import { clamp } from "@rem4d/utils";

export const FlashcardsPage: FC = () => {
  const [cardListDisplay, setCardListDisplay] = useState<Kanji[]>([]);

  const { data: list, isLoading } = api.kanji.all.useQuery();

  const total = clamp(list?.length ?? 0, 0, 20);

  useEffect(() => {
    setCardListDisplay(list ? shuffle(list) : []);
  }, [list]);

  const onEvaluate = (card: Kanji) => {
    setCardListDisplay((prev) => prev.filter((c) => c.kanji !== card.kanji));
  };

  return (
    <Page back className="GradientBg overflow-hidden select-none">
      <div className="GradientBg h-full w-full px-6">
        <CardDeck
          cardList={cardListDisplay}
          total={total}
          onEvaluate={onEvaluate}
        />
      </div>
    </Page>
  );
};

export function shuffle<T>(array: T[]) {
  const tmp = [...array];

  for (let i = tmp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const c = tmp[i];
    tmp[i] = tmp[j];
    tmp[j] = c;
  }
  return tmp.slice(0, 20);
}
export default FlashcardsPage;
