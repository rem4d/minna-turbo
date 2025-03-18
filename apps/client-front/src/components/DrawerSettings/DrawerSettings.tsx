import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { api } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import hapticFeedback from "@/utils/hapticFeedback";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-client";
import { twMerge } from "tailwind-merge";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onChangeLevel: (id: number) => void;
  level: number;
  showRepeatDeckOption?: boolean;
}

export default function DrawerSettings({
  open,
  onOpenChange,
  onChangeLevel,
  level,
  showRepeatDeckOption = false,
}: Props) {
  const [view, setView] = useState<
    "idle" | "choose_last_kanji" | "choose_repeat_deck"
  >("idle");
  const [selectedLevel, setSelectedLevel] = useState<number>(level);
  const [rangeFrom, setRangeFrom] = useState<number | null>(null);
  const [rangeTo, setRangeTo] = useState<number | null>(null);

  const { data: kanjis } = api.viewer.kanji.all.useQuery();
  const currentK = kanjis?.find((k) => k.position === selectedLevel);

  const onLevelSelect = (position: number) => {
    setSelectedLevel(position);
    hapticFeedback("light");
  };

  const onSubmit = () => {
    if (selectedLevel) {
      onChangeLevel(selectedLevel);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setView("idle");
    }, 100);

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [selectedLevel]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined = undefined;

    if (typeof rangeTo === "number") {
      id = setTimeout(() => {
        setView("idle");
      }, 200);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [rangeTo]);

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

  const rangeSelected =
    typeof rangeFrom === "number" && typeof rangeTo === "number";
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onBackClick={() => setView("idle")}
      title={
        view === "choose_last_kanji"
          ? "Выберите последний изученный кандзи"
          : ""
      }
      back={
        false /*view === "choose_last_kanji" || view === "choose_repeat_deck"*/
      }
    >
      <m.div
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
            <m.div
              key="c1"
              className="max-h-50vh flex h-full flex-col justify-between px-4 pb-6"
            >
              <div className="flex w-full flex-col space-y-4">
                <List title="Последний выученный кандзи">
                  <ListItem
                    icon={
                      currentK && (
                        <div className="text-[36px]">{currentK.kanji}</div>
                      )
                    }
                    right={
                      <button
                        className="text-azure-radiance text-md inline-block cursor-pointer bg-transparent"
                        onClick={() => setView("choose_last_kanji")}
                      >
                        Изменить
                      </button>
                    }
                    sub={`${convertLevel(currentK?.position)} уровень`}
                  />
                </List>
                <List title="Колода для повторения">
                  <ListItem
                    icon={
                      <div className="text-[16px] whitespace-nowrap">
                        {"私...私"}
                      </div>
                    }
                    right={
                      <button
                        className="text-azure-radiance text-md inline-block cursor-pointer bg-transparent"
                        onClick={() => setView("choose_repeat_deck")}
                      >
                        Изменить
                      </button>
                    }
                  />
                </List>
              </div>
              <Button className="w-full" onClick={onSubmit}>
                Сохранить
              </Button>
            </m.div>
          )}
          {view === "choose_last_kanji" && (
            <m.div
              key="c2"
              className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2"
            >
              {kanjis?.map((k) => (
                <KCard
                  key={k.id}
                  position={k.position}
                  onClick={onLevelSelect}
                  kanji={k.kanji}
                  selected={k.position === selectedLevel}
                />
              ))}
            </m.div>
          )}
          {showRepeatDeckOption && view === "choose_repeat_deck" && (
            <m.div
              key="c2"
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
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </Drawer>
  );
}

interface KCardProps {
  position: number;
  kanji: string;
  selected: boolean;
  inRange?: boolean;
  disabled?: boolean;
  onClick: (position: number) => void;
}

const KCard: FC<KCardProps> = ({
  position,
  kanji,
  selected,
  inRange = false,
  disabled = false,
  onClick,
}) => {
  return (
    <m.div
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
    </m.div>
  );
};

const duration = 0.3;
const parentVariant = {
  idle: {
    height: "50vh",
    transition: {
      duration,
    },
  },
  choose: {
    height: "85vh",
    transition: {
      duration,
    },
  },
};
