import type { KanjiOutput } from "@minna/api";
import React from "react";
import { STORAGE_LANG } from "@/config/const";
import { useRouter } from "@/router/router";
import { useLocalStorage } from "@uidotdev/usehooks";

import Thumbnail from "./Thumbnail";

interface PreviewCardProps {
  d: KanjiOutput;
  onClick?: () => void;
  hideMeaning?: boolean;
}

const PreviewCard = React.memo(function PreviewCardFn({
  d,
  onClick,
  hideMeaning = false,
}: PreviewCardProps) {
  const { navigate } = useRouter();
  const [transLang] = useLocalStorage<"ru" | "en" | null>(STORAGE_LANG, null);

  const data = d; // ?? mock;
  if (!data) return null;

  const _onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/kanji/" + d.id, { animationStyle: "remove" });
    onClick?.();
  };

  const means_ = transLang === "ru" ? data.ru : data.en;
  const means = means_?.split(/[,;]/)[0] ?? "";

  return (
    <div onClick={_onClick}>
      <Thumbnail
        title={data.kanji}
        level={data.position}
        id={data.id}
        means={means.toLowerCase()}
        hideMeaning={hideMeaning}
      />
    </div>
  );
});

export default PreviewCard;
