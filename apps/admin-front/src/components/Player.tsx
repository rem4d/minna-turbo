import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { Character } from "./Character";

export interface PlayerProps {
  speakerId: number;
  filePath: string;
}

export function Player({ filePath, speakerId }: PlayerProps): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsPlaying(false);
  }, [speakerId]);

  const src = `${import.meta.env.VITE_BACKEND_URL}${filePath}`;
  useEffect(() => {
    if (!audioRef.current) {
      console.log("Error: no audioRef found.");
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
      <div className="size-[30px]">
        <Character id={speakerId} size="1" />
      </div>
      <div className="">
        {isPlaying ? (
          <PauseIcon />
        ) : (
          <PlayIcon className="cursor-pointer" onClick={onPlayClick} />
        )}
      </div>
      <audio
        className="hidden"
        ref={audioRef}
        controls
        preload="none"
        src={src}
      />
    </Flex>
  );
}
