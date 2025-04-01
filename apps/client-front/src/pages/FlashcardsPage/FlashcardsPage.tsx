import type { Kanji } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import SettingsIcon from "@/assets/icons/settings2.svg?react";
import { CardDeck } from "@/components/CardDeck/CardDeck";
import DrawerSettings from "@/components/DrawerSettings/DrawerSettings";
import { Page } from "@/components/Page";
import { SpinnerBig } from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import { api } from "@/utils/api";
import hapticFeedback from "@/utils/hapticFeedback";
import { shuffle } from "@rem4d/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Link } from "react-router-dom";

export const FlashcardsPage: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [storedRangeFrom] = useLocalStorage<number | null>(
    "kic:range_from",
    null,
  );
  const [storedRangeTo] = useLocalStorage<number | null>("kic:range_to", null);

  const { data: user, isLoading } = api.viewer.user.info.useQuery(undefined, {
    throwOnError: true,
  });

  const { data: list } = api.viewer.kanji.all.useQuery();

  const newList = useMemo(
    () =>
      user?.level
        ? (list ?? [])
            .filter(
              (a) => a.position > user.level && a.position < user.level + 8,
            )
            .toSorted((a, b) => (a.position < b.position ? 1 : -1))
        : [],
    [user?.level, list],
  );

  const repeatList = useMemo(() => {
    return storedRangeTo && storedRangeFrom
      ? shuffle(
          (list ?? []).filter(
            (a) => a.position <= storedRangeTo && a.position >= storedRangeFrom,
          ),
        )
      : [];
  }, [storedRangeFrom, storedRangeTo, list]);

  const utils = api.useUtils();
  const updateLevelMuatation = api.viewer.user.updateLevel.useMutation({
    onSuccess() {
      void utils.viewer.user.info.reset();
    },
  });

  const onChangeLevel = (newLevel: number) => {
    // setSelectedLevel(newLevel);
    void updateLevelMuatation.mutate(newLevel);
    hapticFeedback("medium");
  };

  const onTabChange = (n: number) => {
    setCurrentTab(n);
  };

  return (
    <Page back maxOffset className="GradientBg overflow-hidden select-none">
      <div className="relative flex h-full flex-col items-center space-y-6 px-6">
        <div className="flex items-center space-x-2">
          <Tabs current={currentTab} onChange={onTabChange} />
          <div
            className="relative size-[44px]"
            onClick={() => setSettingsModalOpen(true)}
          >
            <SettingsIcon className="stroke-rolling-stone absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        {currentTab === 0 ? (
          <NewScreen
            list={newList}
            isLoading={isLoading}
            onUpgradeLevel={onChangeLevel}
          />
        ) : (
          <RepeatScreen list={repeatList} isLoading={isLoading} />
        )}
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

interface NewScreenProps {
  isLoading: boolean;
  list: Kanji[];
  onUpgradeLevel: (lvl: number) => void;
}

const NewScreen: FC<NewScreenProps> = ({ isLoading, list, onUpgradeLevel }) => {
  const [cardListDisplay, setCardListDisplay] = useState<Kanji[]>(list);
  const [isFinished, setFinished] = useState(false);
  const total = list.length;

  useEffect(() => {
    setCardListDisplay(list);
  }, [list]);

  const onEvaluate = (card: Kanji) => {
    setCardListDisplay((prev) => prev.filter((c) => c.kanji !== card.kanji));

    if (cardListDisplay.length === 1) {
      setFinished(true);
      onUpgradeLevel(card.position);
    }
  };

  const onCloseClick = () => {
    setFinished(false);
    setCardListDisplay(list);
  };

  if (isFinished) {
    return (
      <div className="text-center">
        <div className="mb-4">
          Congrats screen. You have learned 7 new kanji.
        </div>
        <div onClick={onCloseClick} className="cursor-pointer text-red-400">
          close
        </div>
        <div>
          <Link className="text-denim" to="/sentences">
            Practice new sentences
          </Link>{" "}
        </div>
      </div>
    );
  }

  return isLoading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SpinnerBig />
    </div>
  ) : (
    <CardDeck
      cardList={cardListDisplay}
      total={total}
      onEvaluate={onEvaluate}
    />
  );
};

interface RepeatScreenProps {
  isLoading: boolean;
  list: Kanji[];
}

const RepeatScreen: FC<RepeatScreenProps> = ({ isLoading, list }) => {
  const [cardListDisplay, setCardListDisplay] = useState<Kanji[]>(list);
  const [isFinished, setFinished] = useState(false);
  const total = list.length;
  const isAssign = false;

  useEffect(() => {
    setCardListDisplay(list);
  }, [list]);

  const onEvaluate = (card: Kanji) => {
    setCardListDisplay((prev) => prev.filter((c) => c.kanji !== card.kanji));

    if (cardListDisplay.length === 1) {
      setFinished(true);
    }
  };

  const onAgainClick = () => {
    setFinished(false);
    setCardListDisplay(shuffle(list));
  };

  if (isFinished) {
    return (
      <div className="text-center" onClick={onAgainClick}>
        Again
      </div>
    );
  }

  if (isAssign) {
    return <div className="text-center">Please assign a deck for repeat.</div>;
  }

  return isLoading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SpinnerBig />
    </div>
  ) : (
    <CardDeck
      cardList={cardListDisplay}
      total={total}
      onEvaluate={onEvaluate}
    />
  );
};

export default FlashcardsPage;
