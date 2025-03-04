import React from "react";
import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import Spinner from "@/components/Spinner";

interface Props {
  reading: string;
  isLoading: boolean;
  isPlaying: boolean;
  onClick?: (r: string, index?: number) => void;
  index?: number;
}

function PlaySound({ onClick, isLoading, isPlaying, reading, index }: Props) {
  // console.log("PlaySound render" + reading);
  if (!reading) {
    return null;
  }
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    onClick?.(reading, index);
  };

  return (
    <div className="size-[24px] cursor-pointer" onClick={handleClick}>
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
