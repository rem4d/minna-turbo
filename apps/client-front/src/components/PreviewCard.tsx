import React from "react";
import { useRouter } from "@/router/router";
import { type KanjiOutput } from "@rem4d/api";
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
  const _onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/kanji/" + d.id, { animationStyle: "remove" });
    onClick?.();
  };

  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );

  const data = d; // ?? mock;
  if (!d) return null;
  const means_ = transLang === "ru" ? data.ru : data.en;
  const means = means_?.split(/[,;]/)?.[0] ?? "";

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

// const mock: KanjiOutput = {
//   en: "a",
//   id: Date.now(),
//   kanji: "あ",
//   means: "",
//   position: 1,
//   on_: null,
//   kun: null,
//   ru: "",
//   updated_at: "",
// };

export default PreviewCard;
