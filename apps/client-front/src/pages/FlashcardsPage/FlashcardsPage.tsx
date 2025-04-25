import type { Kanji } from "@rem4d/db";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import AgainIcon from "@/assets/icons/again.svg?react";
import CrossIcon from "@/assets/icons/cross.svg?react";
import FireworksIcon from "@/assets/icons/fireworks.svg?react";
import SettingsIcon from "@/assets/icons/settings2.svg?react";
import { CardDeck } from "@/components/CardDeck/CardDeck";
import DrawerSettings from "@/components/DrawerSettings/DrawerSettings";
import { Page } from "@/components/Page";
import { SpinnerBig } from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import { api } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import hapticFeedback from "@/utils/hapticFeedback";
import { shuffle } from "@rem4d/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Link } from "react-router-dom";

export const FlashcardsPage: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [level, setLevel] = useState(0);

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

  const onTabChange = (n: number) => {
    setCurrentTab(n);
  };

  const onFinish = (newLevel: number) => {
    setLevel(newLevel);
    setFinished(true);
    onChangeLevel(newLevel);
  };

  const onChangeLevel = (newLevel: number) => {
    // setSelectedLevel(newLevel);
    void updateLevelMuatation.mutate(newLevel);
    hapticFeedback("medium");
  };

  const onCongratsCloseClick = () => {
    setFinished(false);
  };

  return (
    <Page back maxOffset className="GradientBg overflow-hidden select-none">
      {isFinished ? (
        <CongratsScreen
          onCloseClick={onCongratsCloseClick}
          level={convertLevel(level)}
        />
      ) : (
        <>
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
                onFinish={onFinish}
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
        </>
      )}
    </Page>
  );
};

interface NewScreenProps {
  isLoading: boolean;
  list: Kanji[];
  onFinish: (newLevel: number) => void;
}

const NewScreen: FC<NewScreenProps> = ({ isLoading, list, onFinish }) => {
  const [cardListDisplay, setCardListDisplay] = useState<Kanji[]>(list);
  const total = list.length;

  useEffect(() => {
    setCardListDisplay(list);
  }, [list]);

  const onEvaluate = (card: Kanji) => {
    setCardListDisplay((prev) => prev.filter((c) => c.kanji !== card.kanji));

    if (cardListDisplay.length === 1) {
      onFinish(card.position);
    }
  };

  const onPrevClick = (card: Kanji) => {
    const cardIndex = list.findIndex((c) => c.id === card.id);
    if (cardIndex !== -1) {
      const newCardIndex = cardIndex + 1;
      setCardListDisplay((l) => l.concat(list[newCardIndex]));
    }
  };

  return isLoading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SpinnerBig />
    </div>
  ) : (
    <CardDeck
      cardList={cardListDisplay}
      total={total}
      onEvaluate={onEvaluate}
      onPrevClick={onPrevClick}
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
  const isAssign = cardListDisplay.length === 0;

  useEffect(() => {
    setCardListDisplay(list);
    setFinished(false);
  }, [list]);

  const onPrevClick = (card: Kanji) => {
    const cardIndex = list.findIndex((c) => c.id === card.id);
    if (cardIndex !== -1) {
      const newCardIndex = cardIndex + 1;
      setCardListDisplay((l) => l.concat(list[newCardIndex]));
    }
  };

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
      <div className="flex size-full flex-col justify-center text-center">
        <div
          className="flex flex-col items-center space-y-6"
          onClick={onAgainClick}
        >
          <AgainIcon className="text-denim size-[80px] fill-current" />
          <div className="text-black/90">Еще раз</div>
        </div>
      </div>
    );
  }

  if (isAssign) {
    return (
      <div className="flex size-full flex-col items-center justify-center text-center">
        Назначте колоду для повторения в настройках
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
      onPrevClick={onPrevClick}
    />
  );
};

interface CongratsScreenProps {
  onCloseClick: () => void;
  level: number;
}

const CongratsScreen = ({ onCloseClick, level }: CongratsScreenProps) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full">
      <div className="relative top-[40px] mt-(--page-offset-top-full) w-full">
        <div
          className="absolute top-6 right-3 size-[40px] cursor-pointer rounded-full bg-white"
          onClick={onCloseClick}
        >
          <CrossIcon className="absolute top-1/2 left-1/2 size-[34px] -translate-x-1/2 -translate-y-1/2 rotate-[45deg]" />
        </div>
      </div>
      <div className="absolute top-1/2 flex size-full h-auto min-h-[300px] -translate-y-1/2 flex-col space-y-6 px-3 text-center">
        <div className="relative mx-3 rounded-[20px] bg-white px-3">
          <div className="absolute top-[-70px] left-1/2 mt-3 w-[95px] -translate-x-1/2">
            <FireworksIcon className="size-full" />
          </div>
          <div className="mt-[100px] py-6 text-center">
            <div className="text-[24px]">Congratulations!</div>
            <div className="text-[24px]">You learned 7 new kanji</div>
            <div className="mt-4 text-[14px] text-black/90">
              now your level is <b>{level}</b>
            </div>
          </div>
        </div>
        <div>
          <Link className="text-denim" to="/sentences">
            Practice sentences
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
