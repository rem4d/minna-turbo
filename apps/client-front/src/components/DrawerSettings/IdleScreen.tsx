import { useTRPC } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import { useTranslation } from "react-i18next";

import Button from "../Button";
import { List, ListItem } from "../List";

interface IdleScreenProps {
  selectedLevel: number;
  showRepeatDeckOption: boolean;
  rangeTo: number | null;
  rangeFrom: number | null;
  onChooseLastKanjiClick: () => void;
  onSelectRepeatDeckClick: () => void;
  onSubmit: () => void;
}

export default function IdleScreen({
  selectedLevel,
  rangeTo,
  rangeFrom,
  showRepeatDeckOption,
  onChooseLastKanjiClick,
  onSelectRepeatDeckClick,
  onSubmit,
}: IdleScreenProps) {
  const { t } = useTranslation();
  const trpc = useTRPC();
  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const kanjis = kanjisQuery.data ?? [];

  const currentK = kanjis.find((k) => k.position === selectedLevel);
  const kFrom = kanjis.find((k) => k.position === rangeFrom);
  const kTo = kanjis.find((k) => k.position === rangeTo);

  return (
    <motion.div
      key="c1"
      className="max-h-50vh flex h-full flex-col justify-between px-4 pb-6"
    >
      <div className="flex w-full flex-col space-y-4">
        <List title={t("the_last_kanji")}>
          <ListItem
            icon={
              currentK && <div className="text-[36px]">{currentK.kanji}</div>
            }
            right="change"
            onRightIconClick={onChooseLastKanjiClick}
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
                  onClick={onSelectRepeatDeckClick}
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
  );
}
