import { FC, useState } from "react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { api } from "@/utils/api";
import hapticFeedback from "@/utils/hapticFeedback";
import { twMerge } from "tailwind-merge";

import { AnimateHeight } from "./AnimateHeight";

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

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onBackClick={() => setView("idle")}
      title={view === "choose" ? "Выберите последний изученный кандзи" : null}
      back={view === "choose"}
    >
      <AnimateHeight duration={0.4}>
        <div className="bg-super-silver relative flex flex-col">
          {view === "idle" && (
            <div className="px-4 pb-6">
              <div className="mb-[30vh] w-full">
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
              <Button className="w-full">Сохранить</Button>
            </div>
          )}
          {view === "choose" && (
            <div className="auto-rows-1fr grid grid-cols-9 pb-2">
              {kanjis?.map((k) => (
                <KCard
                  key={k.id}
                  id={k.id}
                  onClick={onKSelect}
                  kanji={k.kanji}
                  selected={k.id === selectedId}
                />
              ))}
            </div>
          )}
        </div>
      </AnimateHeight>
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
    <div
      onClick={() => onClick(id)}
      className={twMerge(
        "relative flex aspect-square h-full w-full flex-col justify-center text-black",
        selected && "bg-outer-space rounded-md text-white",
      )}
    >
      <div className="font-hiragino text-center text-[28px] font-bold">
        {kanji}
      </div>
    </div>
  );
};
