import SoundPauseIcon from "@/assets/icons/pause.svg?react";
import SoundIcon from "@/assets/icons/sound.svg?react";
import Spinner from "@/components/Spinner";
import { usePlaySoundConext } from "@/context/playSoundContext";

interface Props {
  text?: string | null;
}
export default function PlaySound({ text }: Props) {
  const {
    isPlaying,
    ttsLoading,
    onPlayClick,
    text: contextText,
  } = usePlaySoundConext();

  const onClick = () => {
    if (text) {
      onPlayClick(text);
    }
  };

  if (text === contextText) {
    return (
      <div className="size-[24px] cursor-pointer" onClick={onClick}>
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

  return (
    <div className="size-[24px] cursor-pointer" onClick={onClick}>
      <SoundIcon className="size-[24px]" />
    </div>
  );
}
