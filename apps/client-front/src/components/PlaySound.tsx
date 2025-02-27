import React from "react";
import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import Spinner from "@/components/Spinner";

interface Props {
  reading: string;
  ttsLoading: boolean;
  isPlaying: boolean;
  onClick: (r: string) => void;
}

function PlaySound({ onClick, ttsLoading, isPlaying, reading }: Props) {
  return (
    <div
      className="size-[24px] cursor-pointer"
      onClick={() => onClick(reading)}
    >
      {ttsLoading && <Spinner />}
      {!ttsLoading ? (
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
