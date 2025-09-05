import React, { useCallback, useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import { hapticFeedback } from "@/utils/tgUtils";
import { useLocalStorage, usePrevious } from "@uidotdev/usehooks";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useTranslation } from "react-i18next";

import ChooseLastKanjiScreen from "./ChooseLastKanjiScreen";
import IdleScreen from "./IdleScreen";
import RepeatDeckScreen from "./RepeatDeckScreen";

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
  const [view, setView] = useState<"idle" | "last_kanji" | "repeat_deck">(
    "idle",
  );

  const [storedRangeFrom, setStoredRangeFrom] = useLocalStorage<number | null>(
    "kic:range_from",
    null,
  );
  const [storedRangeTo, setStoredRangeTo] = useLocalStorage<number | null>(
    "kic:range_to",
    null,
  );

  const [selectedLevel, setSelectedLevel] = useState<number>(level);
  const [rangeFrom, setRangeFrom] = useState<number | null>(storedRangeFrom);
  const [rangeTo, setRangeTo] = useState<number | null>(storedRangeTo);

  const previousLevel = usePrevious(selectedLevel);

  useEffect(() => {
    if (previousLevel > selectedLevel) {
      setRangeFrom(null);
      setRangeTo(null);
    }
  }, [previousLevel, selectedLevel]);

  const { t } = useTranslation();

  const onLevelSelect = useCallback((position: number) => {
    setSelectedLevel(position);
    hapticFeedback("light");
  }, []);

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

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onBackClick={onBackClick}
      title={view === "last_kanji" ? t("choose_the_last_kanji") : ""}
      back={view === "last_kanji" || view === "repeat_deck"}
    >
      <motion.div
        className="bg-super-silver relative flex flex-col"
        initial="idle"
        animate={
          view === "last_kanji" || view === "repeat_deck"
            ? "fullScreen"
            : "halfScreen"
        }
        variants={parentVariant}
      >
        <AnimatePresence mode="wait">
          {view === "idle" && (
            <IdleScreen
              showRepeatDeckOption={showRepeatDeckOption}
              selectedLevel={selectedLevel}
              rangeTo={rangeTo}
              rangeFrom={rangeFrom}
              onChooseLastKanjiClick={() => setView("last_kanji")}
              onSelectRepeatDeckClick={() => setView("repeat_deck")}
              onSubmit={onSubmit}
            />
          )}
          {view === "last_kanji" && (
            <ChooseLastKanjiScreen
              onLevelSelect={onLevelSelect}
              selectedLevel={selectedLevel}
            />
          )}
          {showRepeatDeckOption && view === "repeat_deck" && (
            <RepeatDeckScreen
              rangeTo={rangeTo}
              rangeFrom={rangeFrom}
              selectedLevel={selectedLevel}
              onRangeSelectClick={onRangeSelectClick}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Drawer>
  );
});

const duration = 0.3;
const parentVariant = {
  halfScreen: {
    height: "50vh",
    transition: {
      duration,
    },
  },
  fullScreen: {
    height: "90vh",
    transition: {
      duration,
    },
  },
};
