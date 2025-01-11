import { useEffect, useRef, useState, type ReactElement } from "react";
import { Character } from "@/components/Character";
import type { Sentence } from "@rem4d/db";
import { twMerge } from "tailwind-merge";
import { initTTS } from "@/utils/tts";
import SoundIcon from "@/assets/icons/sound-full.svg?react";
import SoundPauseIcon from "@/assets/icons/sound-pause.svg?react";
import Dropdown from "@/components/Dropdown";

export interface PlayerProps {
  sentence: Sentence;
}

export function CompositePlayer({ sentence }: PlayerProps): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showFurigana, setShowFurigana] = useState(false);

  useEffect(() => {
    setShowFurigana(false);
  }, [sentence.id]);

  const hasCharacter = !!sentence.vox_speaker_id;
  const onlyOneHasFurigana =
    sentence.ruby?.includes("<rt>") &&
    !sentence.text_with_furigana?.includes("<rt>");

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

  return (
    <>
      <Dropdown onShowFuriganaClick={() => setShowFurigana(true)} />
      <div className={!hasCharacter ? "w-full" : ""}>
        <div>
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
              {hasCharacter && (
                <div className="flex justify-between">
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
                  {/* <div className="cursor-pointer " onClick={onShowFurigana}> */}
                  {/*   {showFurigana ? ( */}
                  {/*     <FuriganaVisibleIcon className="fill-current text-black/50 size-[24px]" /> */}
                  {/*   ) : ( */}
                  {/*     <FuriganaHiddenIcon className="fill-current text-black/50 size-[24px]" /> */}
                  {/*   )} */}
                  {/* </div> */}
                </div>
              )}
              <div
                className={twMerge(
                  "overflow-hidden relative w-full",
                  hasCharacter && "top-[5px] -left-[5px]",
                  !hasCharacter && "mt-[34px]",
                )}
              >
                <div
                  className={twMerge(
                    "SpeakBlock relative bg-white rounded-[10px] py-2 px-4 text-black font-klee text-[18px]",
                    hasCharacter && "before:content-[''] rounded-tl-[0px] ml-4",
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
                          className={onlyOneHasFurigana ? "mt-[6px]" : ""}
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
      </div>
    </>
  );
}
