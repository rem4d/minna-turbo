import type { MemberOutput } from "@rem4d/api";
import Drawer from "@/components/Drawer";
import React, { useCallback, useState } from "react";




import { useAppStore } from "@/store";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import MemberModalEntry from "./MemberModalEntry";

const MemberModalContent = ({
  entries = [],
  pos,
  ruby,
  reading,
  readings,
  en,
  ru,
}: {
  pos: string | null;
  ruby: string | null;
  reading: string | null;
  readings?: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  entries?: MemberOutput["entries"];
}) => {
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const { t } = useTranslation();

  const onKanjiClick = useCallback((kId: number) => {
    setSecondModalOpen(true);
  }, []);

  return (
    <div className="bg-white px-4 py-4">
      <MemberModalEntry
        className="pt-0"
        ruby={ruby}
        reading={reading}
        readings={readings}
        en={en}
        ru={ru}
        pos={pos}
        onKanjiClick={onKanjiClick}
      />
      {entries.length > 1 ? (
        <div>
          <div className="my-4 h-[1px] w-full bg-black/20" />

          <div className="mb-4 cursor-default text-sm font-bold text-black/80">
            {t("member_modal.other")}
          </div>

          <div className="flex flex-col divide-y divide-black/20">
            {entries.slice(1).map((e) => (
              <MemberModalEntry
                key={e.id}
                ruby={null}
                text={e.words[0]?.txt}
                reading={e.readings[0]?.txt}
                readings={e.readings.slice(1)}
                en={e.en}
                ru={e.ru}
                pos={pos}
              />
            ))}
          </div>
        </div>
      ) : null}
      <Drawer

        contentClassName="bg-white" open={!!secondModalOpen} onOpenChange={() => setSecondModalOpen(false)}>text</Drawer>
    </div>
  );
};

export default MemberModalContent;
