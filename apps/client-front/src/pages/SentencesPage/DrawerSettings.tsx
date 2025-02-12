import { useState } from "react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";

import { AnimateHeight } from "./AnimateHeight";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function DrawerSettings({ open, onOpenChange }: Props) {
  const [view, setView] = useState<"idle" | "choose">("idle");

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onBackClick={() => setView("idle")}
      title={view === "choose" ? "Выберите последний изученный кандзи" : null}
      back={view === "choose"}
    >
      <AnimateHeight duration={0.4}>
        <div className="bg-super-silver relative flex flex-col px-2">
          {view === "idle" && (
            <>
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
            </>
          )}
          {view === "choose" && (
            <>
              <p className="text-gray-600">
                Nobody tells this to people who are beginners, I wish someone
                told me. All of us who do creative work, we get into it because
                we have good taste.
              </p>
              <p className="text-gray-600">
                But there is this gap. For the first couple years you make
                stuff, it’s just not that good. It’s trying to be good, it has
                potential, but it’s not. But your taste, the thing that got you
                into the game, is still killer. And your taste is why your work
                disappoints you. A lot of people never get past this phase, they
                quit.{" "}
              </p>
              <p className="text-gray-600">
                But there is this gap. For the first couple years you make
                stuff, it’s just not that good. It’s trying to be good, it has
                potential, but it’s not. But your taste, the thing that got you
                into the game, is still killer. And your taste is why your work
                disappoints you. A lot of people never get past this phase, they
                quit.{" "}
              </p>
              <p className="text-gray-600">
                But there is this gap. For the first couple years you make
                stuff, it’s just not that good. It’s trying to be good, it has
                potential, but it’s not. But your taste, the thing that got you
                into the game, is still killer. And your taste is why your work
                disappoints you. A lot of people never get past this phase, they
                quit.{" "}
              </p>
              <p className="text-gray-600">
                Most people I know who do interesting, creative work went
                through years of this. We know our work doesn’t have this
                special thing that we want it to have. We all go through this.
                And if you are just starting out or you are still in this phase,
                you gotta know its normal and the most important thing you can
                do is do a lot of work
              </p>
              <p className="text-gray-600">
                Put yourself on a deadline so that every week you will finish
                one story. It is only by going through a volume of work that you
                will close that gap, and your work will be as good as your
                ambitions. And I took longer to figure out how to do this than
                anyone I’ve ever met. It’s gonna take awhile. It’s normal to
                take awhile. You’ve just gotta fight your way through.
              </p>
            </>
          )}
        </div>
      </AnimateHeight>
    </Drawer>
  );
}
