import { FC, useState } from "react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { api } from "@/utils/api";
import hapticFeedback from "@/utils/hapticFeedback";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-client";
import { twMerge } from "tailwind-merge";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function DrawerSettings({ open, onOpenChange }: Props) {
  const [view, setView] = useState<"idle" | "choose">("idle");
  const [selectedId, setSelectedId] = useState<null | number>(null);
  const { data: kanjis } = api.kanji.all.useQuery();

  const onKSelect = (id: number) => {
    setSelectedId(id);
    hapticFeedback("light");
  };

  const onSubmit = () => {
    const found = kanjis?.find((k) => k.id === selectedId);
    if (found) {
      onOpenChange(false);
    }
  };
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onBackClick={() => setView("idle")}
      title={view === "choose" ? "Выберите последний изученный кандзи" : ""}
      back={view === "choose"}
    >
      <m.div
        className="bg-super-silver relative flex flex-col"
        initial="idle"
        animate={view === "choose" ? "choose" : "idle"}
        variants={parentVariant}
      >
        <AnimatePresence mode="wait">
          {view === "idle" && (
            <m.div
              key="c1"
              className="max-h-50vh flex h-full flex-col justify-between px-4 pb-6"
            >
              <div className="mb-4 w-full">
                <List title="Последний выученный кандзи">
                  <ListItem
                    icon={<div className="text-[36px]">水</div>}
                    iconRight={
                      <button
                        className="text-azure-radiance text-md inline-block cursor-pointer bg-transparent"
                        onClick={() => setView("choose")}
                      >
                        Изменить
                      </button>
                    }
                    sub="98 уровень"
                  />
                </List>
              </div>
              <Button className="w-full" onClick={onSubmit}>
                Сохранить
              </Button>
            </m.div>
          )}
          {view === "choose" && (
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
                  selected={k.id === selectedId}
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
      <div className="font-hiragino text-center text-[28px] font-bold select-none">
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
    height: "100vh",
    transition: {
      duration,
    },
  },
};
