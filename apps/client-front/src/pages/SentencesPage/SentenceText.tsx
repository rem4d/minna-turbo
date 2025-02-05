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
                "relative flex grow flex-col",
                hasCharacter && "top-[19px] left-[2px]",
              )}
            >
              <div
                className={twMerge(
                  "relative w-full overflow-hidden",
                  hasCharacter && "top-[5px] -left-[5px]",
                  !hasCharacter && "mt-[24px]",
                )}
              >
                <div
                  className={twMerge(
                    "font-yu-gothic relative rounded-[20px] border border-black/20 bg-white px-4 py-4 text-xl leading-5 font-medium text-black",
                    hasCharacter && "ml-4 rounded-tl-[0px]",
                  )}
                >
                  <div
                    className={twMerge(
                      "flex items-start gap-x-2",
                      !hasCharacter && "justify-center",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 select-none">
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
