import React from "react";
import { useRouter } from "@/router/router";
import { type KanjiOutput } from "@rem4d/api";

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

  if (!d) {
    return null;
  }

  return (
    <div onClick={_onClick}>
      <Thumbnail
        title={d.kanji}
        level={d.position}
        id={d.id}
        means={d.en ?? ""}
        hideMeaning={hideMeaning}
      />
    </div>
  );
});

export default PreviewCard;
