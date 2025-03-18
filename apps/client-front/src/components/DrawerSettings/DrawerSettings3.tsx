import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import { AnimatePresence, motion as m, usePresence } from "motion/react";

import Button from "../Button";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onChangeLevel: (id: number) => void;
  level: number;
  showRepeatDeckOption?: boolean;
}

export default function DrawerSettings({ open, onOpenChange }: Props) {
  const [view, setView] = useState<"screen1" | "screen2">("screen1");

  const onClick = () => {
    if (view === "screen1") {
      setView("screen2");
    } else {
      setView("screen1");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="bg-super-silver relative flex h-fit flex-col justify-between">
        <m.ul
          className="bg-denim mb-[50px] p-2"
          variants={container}
          initial="screen1"
          animate={view === "screen2" ? "screen2" : "screen1"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <Slide key={view}>
              {view === "screen1" && <Screen1 key="s1" onClick={onClick} />}
              {view === "screen2" && <Screen2 key="s2" onClick={onClick} />}
            </Slide>
          </AnimatePresence>
        </m.ul>

        <Button className="w-full" onClick={onClick}>
          Сохранить
        </Button>
      </div>
    </Drawer>
  );
}

const Slide = ({
  children,
  ref,
}: PropsWithChildren<{ ref: React.Ref<HTMLDivElement> }>) => {
  const direction = 1;

  // const [isPresent, safeToRemove] = usePresence();
  //
  // useEffect(() => {
  //   if (!isPresent) {
  //     setTimeout(safeToRemove, 100);
  //   }
  // }, [isPresent, safeToRemove]);
  return (
    <m.div
      ref={ref}
      initial={{ x: direction * 450 }}
      animate={{
        x: 0,
        transition: {
          delay: 0,
          ease: "linear",
          // visualDuration: 0.3,
        },
      }}
    >
      {children}
    </m.div>
  );
};

const Screen1 = ({ onClick }: { onClick: () => void }) => {
  return <div onClick={onClick}>Screen 1</div>;
};

const Screen2 = ({ onClick }: { onClick: () => void }) => {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      setTimeout(safeToRemove, 600);
    }
  }, [isPresent, safeToRemove]);

  const items = [1, 2, 3, 4];

  return (
    <m.div>
      {items.map((item) => (
        <Item key={`t-${item}`} onClick={onClick} text={item} />
      ))}
    </m.div>
  );
};

const Item = ({ onClick, text }: { onClick: () => void; text: number }) => {
  return (
    <m.li
      className="bg-super-silver p-3"
      variants={item}
      onClick={onClick}
      initial={{ scale: 1 }}
      whileTap={{ scale: 1.1 }}
    >
      {text}
    </m.li>
  );
};

const container = {
  screen1: {
    height: 50,
    transition: {
      when: "afterChildren",
      delayChildren: 0.5,
    },
  },
  screen2: {
    height: 250,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.3, // Stagger children by .3 seconds
    },
  },
};

const item = {
  screen1: { opacity: 0, transition: { duration: 2 } },
  screen2: { opacity: 1 },
};
