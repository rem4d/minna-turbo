import { useTRPC } from "@/utils/api";
import { convertLevel } from "@/utils/convert";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import { useTranslation } from "react-i18next";

import Button from "../Button";
import { List, ListItem } from "../List";

interface IdleScreenProps {
  selectedLevel: number;
  onChooseLastKanjiClick: () => void;
  onSubmit: () => void;
}

export default function IdleScreen({
  selectedLevel,
  onChooseLastKanjiClick,
  onSubmit,
}: IdleScreenProps) {
  const { t } = useTranslation();
  const trpc = useTRPC();
  const kanjisQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const kanjis = kanjisQuery.data ?? [];

  const currentK = kanjis.find((k) => k.position === selectedLevel);

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
      </div>
      <Button className="w-full" onClick={onSubmit}>
        {t("save")}
      </Button>
    </motion.div>
  );
}
