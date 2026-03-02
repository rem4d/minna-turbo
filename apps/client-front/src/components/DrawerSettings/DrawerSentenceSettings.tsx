import { useState } from "react";
import GrabberAndCloseButton from "@/components/Drawer/GrabberAndCloseButton";
import { useTRPC } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Drawer } from "vaul";

import Button from "../Button";
import { List, ListItem } from "../List";
import Popover from "../Popover";
import KCell from "./KCell";

interface DrawerProps {
  level: number;
  shift: number;
  onOpenChange: (o: boolean) => void;
  onSubmitLevelRange: ({
    level,
    shift,
  }: {
    level: number;
    shift: number;
  }) => void;
  open: boolean;
}

export default function DrawerSentenceSettings({
  open,
  onOpenChange,
  onSubmitLevelRange,
  level,
}: DrawerProps) {
  const [rangeFrom, setRangeFrom] = useState<number | null>(null);
  const [rangeTo, setRangeTo] = useState<number | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<number>(level);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  // useEffect(() => {
  //   if (previousLevel > selectedLevel) {
  //     setRangeFrom(null);
  //     setRangeTo(null);
  //   }
  // }, [previousLevel, selectedLevel]);

  const [nestedOpen, setNestedOpen] = useState(false);

  const { t } = useTranslation();
  const trpc = useTRPC();
  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const kanjis = kanjisQuery.data ?? [];

  const currentK = kanjis.find((k) => k.position === selectedLevel);

  const onNestedOpenChange = (o: boolean) => {
    setNestedOpen(o);
    setRangeFrom(null);
    setRangeTo(null);
  };

  // const onKanjiClick = (position: number) => {
  //   setClickedLevel(position);
  // };

  const onConfirmClick = () => {
    if (rangeTo && rangeFrom) {
      setSelectedLevel(rangeTo);
      setSelectedShift(rangeTo - rangeFrom);
      onNestedOpenChange(false);
      setRangeFrom(null);
      setRangeTo(null);
    }
  };

  const onSubmit = () => {
    // setStoredRangeFrom(rangeFrom);
    // setStoredRangeTo(rangeTo);

    if (selectedLevel !== level && selectedShift !== null) {
      onSubmitLevelRange({ level: selectedLevel, shift: selectedShift });
    }

    onOpenChange(false);
  };

  const onRangeSelectClick = (level: number) => {
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
  };

  const rangeSelected =
    typeof rangeFrom === "number" && typeof rangeTo === "number";

  return (
    <>
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className="absolute inset-0 bg-black/40" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 mt-24 flex h-full max-h-[60vh] flex-col rounded-t-[10px] bg-gray-100">
            <Drawer.Description></Drawer.Description>
            <div className="no-scroll bg-super-silver relative flex flex-1 flex-col overflow-y-scroll rounded-t-[10px]">
              <GrabberAndCloseButton
                className="bg-super-silver"
                title={t("settings")}
              />

              <div className="flex flex-1 flex-col px-4">
                <div className="flex w-full flex-1 flex-col justify-between space-y-4">
                  <List
                    title={
                      <div className="relative flex items-center space-x-2">
                        <span>{t("the_last_kanji")}</span>{" "}
                        <Popover>{t("kanjiRangeTip")}</Popover>
                      </div>
                    }
                  >
                    <ListItem
                      icon={
                        currentK && (
                          <div className="text-[36px]">{currentK.kanji}</div>
                        )
                      }
                      onRightIconClick={() => setNestedOpen(true)}
                      right={"change"}
                      sub={`${convertLevel(currentK?.position)} ${t("level")}`}
                    />
                  </List>

                  <Button className="mx-auto mb-4 w-full" onClick={onSubmit}>
                    {t("save")}
                  </Button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <Drawer.Root
        open={nestedOpen}
        onOpenChange={onNestedOpenChange}
        autoFocus={true}
        dismissible={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="absolute inset-0" />
          <Drawer.Content className="bg-super-silver fixed right-0 bottom-0 left-0 mt-24 flex h-[calc(100dvh-1rem)] flex-col rounded-t-[10px]">
            <Drawer.Description></Drawer.Description>
            <div className="no-scroll bg-super-silver relative flex-1 overflow-y-scroll overscroll-none rounded-t-[10px]">
              <GrabberAndCloseButton
                className="bg-super-silver"
                onClick={() => onNestedOpenChange(false)}
              />
              <div className="auto-rows-1fr mx-auto grid max-w-md grid-cols-9 pb-2">
                {kanjis.map((k) => (
                  <KCell
                    key={k.id}
                    position={k.position}
                    onClick={onRangeSelectClick}
                    kanji={k.kanji}
                    selected={
                      k.position === rangeFrom || k.position === rangeTo
                    }
                    inRange={
                      rangeSelected &&
                      k.position > rangeFrom &&
                      k.position < rangeTo
                    }
                  />
                ))}
              </div>
              {rangeFrom && (
                <motion.div
                  initial={{
                    y: 50,
                  }}
                  animate={{
                    y: rangeFrom ? 0 : -50,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="sticky bottom-0 flex items-center justify-center space-x-6 px-4 pb-4"
                >
                  <div className="masked-shadow bg-super-silver absolute top-0 left-0 z-[-1] size-full" />
                  <Button
                    className="w-3/4"
                    variant="secondary"
                    onClick={() => onNestedOpenChange(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button className="w-3/4" onClick={onConfirmClick}>
                    {t("confirm")}
                  </Button>
                </motion.div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
