import type { FC } from "react";
import { useState } from "react";
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
  console.log(showRepeatDeckOption);

  const { data: kanjis } = api.viewer.kanji.all.useQuery();
  const currentK = kanjis?.find((k) => k.position === selectedLevel);

  const onKSelect = (id: number) => {
    const found = kanjis?.find((k) => k.id === id);
    if (found) {
      setSelectedLevel(found.position);
      hapticFeedback("light");
      setView("idle");
    }
  };

  const onSubmit = () => {
    if (selectedLevel) {
      onChangeLevel(selectedLevel);
      onOpenChange(false);
    }
  };

  const onKRepeatFromSelect = () => {};
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
      back={view === "choose_last_kanji" || view === "choose_repeat_deck"}
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
                    iconRight={
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
                    iconRight={
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
                  id={k.id}
                  onClick={onKSelect}
                  kanji={k.kanji}
                  selected={k.position === selectedLevel}
                />
              ))}
            </m.div>
          )}
          {view === "choose_repeat_deck" && (
            <m.div
              key="c2"
              className="auto-rows-1fr mt-0 grid grid-cols-9 pb-2"
            >
              {kanjis?.map((k) => (
                <KCard
                  key={k.id}
                  id={k.id}
                  onClick={onKRepeatFromSelect}
                  kanji={k.kanji}
                  selected={k.position === selectedLevel}
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
  id: number;
  kanji: string;
  selected: boolean;
  onClick: (id: number) => void;
}

const KCard: FC<KCardProps> = ({ id, kanji, selected, onClick }) => {
  return (
    <m.div
      initial={{ scale: 1 }}
      whileTap={{ scale: 1.1 }}
      onClick={() => onClick(id)}
      className={twMerge(
        "relative flex aspect-square h-full w-full flex-col justify-center text-black",
        selected && "bg-outer-space rounded-md text-white",
      )}
    >
      <div className="font-hiragino cursor-pointer text-center text-[28px] font-bold select-none">
        {kanji}
      </div>
    </m.div>
  );
};

const duration = 0.4;
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
