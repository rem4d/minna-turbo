import { useEffect, useRef, useState, type ReactElement } from "react";
import { Character } from "./Character";
import type { Sentence } from "@rem4d/db";
import { twMerge } from "tailwind-merge";
import { initTTS } from "@/utils/tts";
import SoundIcon from "@/assets/icons/sound-full.svg?react";
import SoundPauseIcon from "@/assets/icons/sound-pause.svg?react";

export interface PlayerProps {
  sentence: Sentence;
}

export function CompositePlayer({ sentence }: PlayerProps): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showFurigana, setShowFurigana] = useState(false);

  const hasCharacter = !!sentence.vox_speaker_id;

  useEffect(() => {
    setIsPlaying(false);
  }, [sentence.text]);

  const src = `${import.meta.env.VITE_BACKEND_URL}${sentence.vox_file_path}`;

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
    if (!hasCharacter) {
      void initTTS(sentence.text);
      return;
    }

    if (!audioRef.current) {
      return;
    }
    void audioRef.current.play();

    setIsPlaying(true);
  };

  const onShowFurigana = () => {
    setShowFurigana(!showFurigana);
  };

  return (
    <div className={!hasCharacter ? "w-full" : ""}>
      <div className="flex">
        {hasCharacter && (
          <div className="rounded-full overflow-hidden relative size-[40px]">
            <Character id={sentence.vox_speaker_id} size="1" />
          </div>
        )}
        <div
          className={twMerge(
            "flex flex-col flex-grow relative",
            hasCharacter && "top-[5px] left-[2px]",
          )}
        >
          <div className="">
            {hasCharacter && (
              <div className="size-[24px] left-[8px] relative">
                {isPlaying ? (
                  <SoundPauseIcon className="fill-current text-blue-500 size-[24px]" />
                ) : (
                  <SoundIcon
                    className="fill-current text-blue-500 size-[24px] cursor-pointer"
                    onClick={onPlayClick}
                  />
                )}
              </div>
            )}
          </div>
          <div className="overflow-hidden relative top-[5px] -left-[5px]">
            <div
              className={twMerge(
                "SpeakBlock relative ml-4 bg-white rounded-[10px] p-2 text-black font-klee text-[18px]",
                hasCharacter && "before:content-[''] rounded-tl-[0px]",
              )}
            >
              <div
                className={twMerge(
                  "flex gap-x-2 items-start",
                  !hasCharacter && "justify-center",
                )}
              >
                <div className="flex gap-2 flex-col justify-center items-center">
                  {showFurigana ? (
                    <div
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: sentence.ruby ?? "",
                      }}
                    />
                  ) : (
                    <div
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: sentence.text_with_furigana ?? "",
                      }}
                    />
                  )}

                  {!hasCharacter && (
                    <div>
                      {isPlaying ? (
                        <SoundPauseIcon className="fill-current text-blue-500 size-[24px]" />
                      ) : (
                        <SoundIcon
                          className="fill-current text-blue-500 size-[24px] cursor-pointer"
                          onClick={onPlayClick}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        className="hidden"
        ref={audioRef}
        controls
        preload="none"
        src={src}
      />
    </div>
  );
}
