import { useTranslation } from "react-i18next";

import type { MemberOutput } from "@minna/api";

import MemberModalEntry from "./MemberModalEntry";

const MemberModalContent = ({
  entries = [],
  pos,
  ruby,
  reading,
  readings,
  en,
  ru,
  hideKanji,
}: {
  pos: string | null;
  ruby: string | null;
  reading: string | null;
  readings?: { txt: string | null }[] | null;
  en: string[] | null;
  ru: string[] | null;
  entries?: MemberOutput["entries"];
  hideKanji?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <MemberModalEntry
        className="pt-0"
        ruby={ruby}
        reading={reading}
        readings={readings}
        en={en}
        ru={ru}
        pos={pos}
        hideKanji={hideKanji}
      />
      {entries.length > 1 ? (
        <div>
          <div className="my-4 h-px w-full bg-black/20" />

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
                hideKanji
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MemberModalContent;
