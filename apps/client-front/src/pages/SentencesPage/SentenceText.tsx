import type { Sentence } from "@rem4d/db";
import type { ReactElement } from "react";
import { Character } from "@/components/Character";
import { twMerge } from "tailwind-merge";

export interface Props {
  sentence: Sentence;
  showFurigana: boolean;
}

export function SentenceText({ sentence, showFurigana }: Props): ReactElement {
  const hasCharacter = !!sentence.vox_speaker_id;

  const onlyOneHasFurigana =
    sentence.ruby?.includes("<rt>") &&
    !sentence.text_with_furigana?.includes("<rt>");

  return (
    <>
      <div className={!hasCharacter ? "w-full" : ""}>
        <div>
          <div className="flex">
            {hasCharacter && (
              <div className="relative size-[40px] overflow-hidden rounded-full">
                <Character id={sentence.vox_speaker_id} size="1" />
              </div>
            )}
            <div
              className={twMerge(
                "relative flex flex-grow flex-col",
                hasCharacter && "left-[2px] top-[19px]",
              )}
            >
              <div
                className={twMerge(
                  "relative w-full overflow-hidden",
                  hasCharacter && "-left-[5px] top-[5px]",
                  !hasCharacter && "mt-[24px]",
                )}
              >
                <div
                  className={twMerge(
                    "font-yuGothic relative rounded-[20px] border border-black/20 bg-white px-4 py-4 text-xl font-medium leading-5 text-black",
                    hasCharacter && "ml-4 rounded-tl-[0px]",
                  )}
                >
                  <div
                    className={twMerge(
                      "flex items-start gap-x-2",
                      !hasCharacter && "justify-center",
                    )}
                  >
                    <div className="flex select-none flex-col items-center justify-center gap-2">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
