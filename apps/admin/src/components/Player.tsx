import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { Character } from "./Character";

export interface PlayerProps {
  filePath: string;
  speakerId: number;
}

export function Player({ filePath, speakerId }: PlayerProps): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  }, []);

  const onPlayClick = () => {
    if (!audioRef.current) {
      return;
    }
    void audioRef.current.play();

    setIsPlaying(true);
  };

  return (
    <Flex align="center" gap="4">
      <div className="size-[40px]">
        <Character id={speakerId} size="1" />
      </div>
      <div className="cursor-pointer">
        {isPlaying ? <PauseIcon /> : <PlayIcon onClick={onPlayClick} />}
      </div>
      <audio
        className="hidden"
        ref={audioRef}
        controls
        preload="none"
        src={filePath}
      />
    </Flex>
  );
}
