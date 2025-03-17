import type { Kanji } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useState } from "react";
import SettingsIcon from "@/assets/icons/settings2.svg?react";
import { CardDeck } from "@/components/CardDeck/CardDeck";
import { DrawerSettings } from "@/components/DrawerSettings";
import { Page } from "@/components/Page";
import Tabs from "@/components/Tabs";
import { api } from "@/utils/api";
import { clamp, shuffle } from "@rem4d/utils";

export const FlashcardsPage: FC = () => {
  const [cardListDisplay, setCardListDisplay] = useState<Kanji[]>([]);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const { data: list, isLoading } = api.viewer.kanji.all.useQuery();

  const { data: user } = api.viewer.user.info.useQuery(undefined, {
    throwOnError: true,
  });

  const total = clamp(list?.length ?? 0, 0, 20);

  useEffect(() => {
    const l = list ? shuffle(list) : [];
    setCardListDisplay(l);
  }, [list]);

  const onEvaluate = (card: Kanji) => {
    setCardListDisplay((prev) => prev.filter((c) => c.kanji !== card.kanji));
  };

  const onChangeLevel = (newLevel: number) => {
    // void updateLevelMuatation.mutate(newLevel);
    // hapticFeedback("medium");
  };

  return (
    <Page back maxOffset className="GradientBg overflow-hidden select-none">
      <div className="flex flex-col items-center space-y-6 px-6">
        <div className="flex items-center space-x-2">
          <Tabs />
          <div
            className="relative size-[44px]"
            onClick={() => setSettingsModalOpen(true)}
          >
            <SettingsIcon className="stroke-rolling-stone absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <CardDeck
          cardList={cardListDisplay}
          total={total}
          onEvaluate={onEvaluate}
        />
      </div>
      {user && (
        <DrawerSettings
          open={settingsModalOpen}
          level={user.level}
          onOpenChange={setSettingsModalOpen}
          onChangeLevel={onChangeLevel}
          showRepeatDeckOption
        />
      )}
    </Page>
  );
};

export default FlashcardsPage;
