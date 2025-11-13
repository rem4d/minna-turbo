import GrammarIcon from "@/assets/icons/mode-grammar.svg?react";
import KanjiIcon from "@/assets/icons/mode-kanji.svg?react";
import * as motion from "motion/react-client";
import { twMerge } from "tailwind-merge";

import Spinner from "../Spinner";

interface Props {
  onClick: () => void;
  selected?: boolean;
  isLoading: boolean;
  mode: "grammar" | "kanji" | null;
}

export default function ModeButton({
  onClick,
  selected,
  isLoading,
  mode,
}: Props) {
  let content: React.ReactNode;

  if (isLoading) {
    content = <Spinner />;
  } else {
    content =
      mode === "kanji" ? (
        <KanjiIcon className="fill-current" />
      ) : (
        <GrammarIcon className="fill-current" />
      );
  }

  return (
    <div
      className={twMerge(
        "relative flex size-[24px] items-center justify-center",
      )}
      onClick={onClick}
    >
      <motion.div
        initial={{ scale: 1 }}
        whileTap={{ scale: 1.2 }}
        className={twMerge(
          "flex aspect-square size-[34px] items-center justify-center",
          selected && "bg-outer-space rounded-md text-white",
        )}
      >
        <div
          className={twMerge(
            "aspect-square text-center",
            selected ? "text-white" : "text-rolling-stone",
          )}
        >
          {content}
        </div>
      </motion.div>
    </div>
  );
}
