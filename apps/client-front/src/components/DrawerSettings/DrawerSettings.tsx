import type { FC } from "react";
import React, { useCallback, useState } from "react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { useTRPC } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import { hapticFeedback } from "@/utils/tgUtils";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import ChooseLastKanjiScreen from "./ChooseLastKanjiScreen";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onChangeLevel: (id: number) => void;
  level: number;
  showRepeatDeckOption?: boolean;
}

export default React.memo(function DrawerSettings({
  open,
  onOpenChange,
  onChangeLevel,
  level,
  showRepeatDeckOption = false,
}: Props) {
  const [view, setView] = useState<
    "idle" | "choose_last_kanji" | "choose_repeat_deck"
  >("idle");

  const [storedRangeFrom, setStoredRangeFrom] = useLocalStorage<number | null>(
    "kic:range_from",
    null,
  );
  const [storedRangeTo, setStoredRangeTo] = useLocalStorage<number | null>(
    "kic:range_to",
    null,
  );
  const trpc = useTRPC();

  const [selectedLevel, setSelectedLevel] = useState<number>(level);
  const [rangeFrom, setRangeFrom] = useState<number | null>(storedRangeFrom);
  const [rangeTo, setRangeTo] = useState<number | null>(storedRangeTo);

  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());

  const kanjis = kanjisQuery.data ?? [];
  const currentK = kanjis.find((k) => k.position === selectedLevel);
  const kFrom = kanjis.find((k) => k.position === rangeFrom);
  const kTo = kanjis.find((k) => k.position === rangeTo);

  const { t } = useTranslation();

  const onLevelSelect = useCallback(
    (position: number) => {
      setSelectedLevel(position);
      hapticFeedback("light");

      if (position < selectedLevel) {
        setRangeFrom(null);
        setRangeTo(null);
      }

      if (selectedLevel === position) {
        // setView("idle");
      }
    },
    [selectedLevel],
  );

  const onSubmit = () => {
    if (selectedLevel !== level) {
      onChangeLevel(selectedLevel);
    }

    onOpenChange(false);

    setStoredRangeFrom(rangeFrom);
    setStoredRangeTo(rangeTo);
  };

  const onRangeSelectClick = useCallback(
    (level: number) => {
      if (rangeTo) {
        setRangeFrom(level);
        setRangeTo(null);
      } else {
        if (level === rangeFrom) {
          return;
        }
        if (typeof rangeFrom === "number") {
          const max = Math.max(level, rangeFrom);
          const min = Math.min(level, rangeFrom);
          setRangeFrom(min);
          setRangeTo(max);
        } else {
          setRangeFrom(level);
        }
      }
    },
    [rangeTo, rangeFrom],
  );
  const onBackClick = () => {
    setView("idle");
    if (rangeFrom && rangeTo === null) {
      setRangeFrom(null);
    }
  };

  const rangeSelected =
    typeof rangeFrom === "number" && typeof rangeTo === "number";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onBackClick={onBackClick}
      title={view === "choose_last_kanji" ? t("choose_the_last_kanji") : ""}
      back={view === "choose_last_kanji" || view === "choose_repeat_deck"}
    >
      <motion.div
        className="bg-super-silver relative flex flex-col"
        initial="idle"
        animate={
          view === "choose_last_kanji" || view === "choose_repeat_deck"
            ? "choose"
            : "idle"
        }
        variants={parentVariant}
      >
        <AnimatePresence mode="wait">
          {view === "idle" && (
            <motion.div
              key="c1"
              className="max-h-50vh flex h-full flex-col justify-between px-4 pb-6"
            >
              <div className="flex w-full flex-col space-y-4">
                <List title={t("the_last_kanji")}>
                  <ListItem
                    icon={
                      currentK && (
                        <div className="text-[36px]">{currentK.kanji}</div>
                      )
                    }
                    right="change"
                    onRightIconClick={() => setView("choose_last_kanji")}
                    sub={`${convertLevel(currentK?.position)} ${t("level")}`}
                  />
                </List>
                {showRepeatDeckOption && (
                  <List title={t("repeat_deck")}>
                    <ListItem
                      icon={
                        <div className="text-[16px] whitespace-nowrap">
                          {kFrom && kTo
                            ? `${kFrom?.kanji}...${kTo?.kanji}`
                            : t("not_assigned")}
                        </div>
                      }
                      sub={
                        kFrom && kTo
                          ? `(${kTo.position - kFrom.position + 1})`
                          : undefined
                      }
                      right={
                        <button
                          className="text-azure-radiance text-md inline-block cursor-pointer bg-transparent"
                          onClick={() => setView("choose_repeat_deck")}
                        >
                          {t("change")}
                        </button>
                      }
                    />
                  </List>
                )}
              </div>
              <Button className="w-full" onClick={onSubmit}>
                {t("save")}
              </Button>
            </motion.div>
          )}
          {view === "choose_last_kanji" && (
            <ChooseLastKanjiScreen
              onLevelSelect={onLevelSelect}
              kanjis={kanjis}
              selectedLevel={selectedLevel}
            />
          )}
          {showRepeatDeckOption && view === "choose_repeat_deck" && (
            <motion.div
              key="c3"
              className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2"
            >
              {kanjis?.map((k) => (
                <KCard
                  key={k.id}
                  position={k.position}
                  onClick={onRangeSelectClick}
                  kanji={k.kanji}
                  disabled={k.position > selectedLevel}
                  selected={k.position === rangeFrom || k.position === rangeTo}
                  inRange={
                    rangeSelected &&
                    k.position > rangeFrom &&
                    k.position < rangeTo
                  }
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Drawer>
  );
});

interface KCardProps {
  position: number;
  kanji: string;
  selected: boolean;
  inRange?: boolean;
  disabled?: boolean;
  onClick: (position: number) => void;
}

const KCard: FC<KCardProps> = React.memo(
  ({
    position,
    kanji,
    selected,
    inRange = false,
    disabled = false,
    onClick,
  }) => {
    return (
      <motion.div
        initial={{ scale: 1 }}
        whileTap={{ scale: 1.1 }}
        onClick={() => onClick(position)}
        className={twMerge(
          "relative flex aspect-square h-full w-full flex-col justify-center text-black",
          selected && "bg-outer-space rounded-md text-white",
          inRange && "bg-geyser",
          disabled && "pointer-events-none opacity-40",
        )}
      >
        <div className="font-hiragino cursor-pointer text-center text-[28px] font-bold select-none">
          {kanji}
        </div>
      </motion.div>
    );
  },
);

const duration = 0.3;
const parentVariant = {
  idle: {
    height: "50vh",
    transition: {
      duration,
    },
  },
  choose: {
    height: "90vh",
    transition: {
      duration,
    },
  },
};
