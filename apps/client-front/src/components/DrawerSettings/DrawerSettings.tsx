import React, { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import { hapticFeedback } from "@/utils/tgUtils";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useTranslation } from "react-i18next";

import ChooseLastKanjiScreen from "./ChooseLastKanjiScreen";
import IdleScreen from "./IdleScreen";

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
}: Props) {
  const [view, setView] = useState<"idle" | "last_kanji" | "repeat_deck">(
    "idle",
  );

  const [selectedLevel, setSelectedLevel] = useState<number>(level);

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
  };

  const onBackClick = () => {
    setView("idle");
    // setTransitionDone(false);
  };
  const onChooseLastKanjiClick = () => {
    setView("last_kanji");
    // startTransition(() => {
    //   setTransitionDone(true);
    // });
  };

  const _onOpenChange = (open: boolean) => {
    onOpenChange(open);
    setView("idle");
    // startTransition(() => {
    //   if (open === false) {
    //     setView("idle");
    //   }
    // });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={_onOpenChange}
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
              selectedLevel={selectedLevel}
              onChooseLastKanjiClick={onChooseLastKanjiClick}
              onSubmit={onSubmit}
            />
          )}
          {
            /* transitionDone &&  */ view === "last_kanji" && (
              <ChooseLastKanjiScreen
                onLevelSelect={onLevelSelect}
                selectedLevel={selectedLevel}
              />
            )
          }
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
