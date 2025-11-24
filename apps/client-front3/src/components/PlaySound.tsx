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
        "size-[24px] cursor-pointer",
        !reading && "pointer-events-none opacity-50",
      )}
      onClick={handleClick}
    >
      {isLoading && <Spinner />}
      {!isLoading ? (
        isPlaying ? (
          <SoundPauseIcon className="size-[24px] fill-current text-blue-500" />
        ) : (
          <SoundIcon className="size-[24px]" />
        )
      ) : null}
    </div>
  );
}

export default React.memo(PlaySound);
