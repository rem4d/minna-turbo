import React from "react";
import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import Spinner from "@/components/Spinner";
import { twMerge } from "tailwind-merge";

interface Props {
  reading?: string | null;
  isLoading: boolean;
  isPlaying: boolean;
  onClick?: (r: string, index?: number) => void;
  index?: number;
}

function PlaySound({ onClick, isLoading, isPlaying, reading, index }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (reading) {
      onClick?.(reading, index);
    }
  };

  return (
    <div
      className={twMerge(
        "size-6 cursor-pointer",
        !reading && "pointer-events-none opacity-50",
      )}
      onClick={handleClick}
    >
      {isLoading && <Spinner className="text-blue-500" />}
      {!isLoading ? (
        isPlaying ? (
          <SoundPauseIcon className="size-6 fill-current text-blue-500" />
        ) : (
          <SoundIcon className="size-6" />
        )
      ) : null}
    </div>
  );
}

export default React.memo(PlaySound);
