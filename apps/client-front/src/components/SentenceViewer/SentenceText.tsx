import type { Favourite } from "@/types";
import type { SentenceOutput } from "@rem4d/api";
import type { ReactElement } from "react";
import { Character } from "@/components/Character";
import { api } from "@/utils/api";
import { twMerge } from "tailwind-merge";

export interface Props {
  sentence: SentenceOutput | Favourite;
  showFurigana: boolean;
}

export function SentenceText({ sentence, showFurigana }: Props): ReactElement {
  const hasCharacter = false; // !!sentence.vox_speaker_id;

  const { data: user } = api.viewer.user.info.useQuery();

  const onlyOneHasFurigana =
    sentence.ruby?.includes("<rt>") &&
    !sentence.text_with_furigana?.includes("<rt>");

  const showMeta = user && user.id === 4245;

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
                {showMeta && (
                  <div className="flex flex-col">
                    <div className="text-mine-shaft/70 mt-2 text-center text-xs">
                      ID: {sentence.id}
                    </div>
                    {isFav(sentence) && (
                      <div className="text-mine-shaft/70 mt-2 text-center text-xs">
                        Msg: {sentence.msg}
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={twMerge(
                    "font-yu-gothic relative min-h-[67px] rounded-[20px] border border-black/20 bg-white px-4 py-4 text-xl leading-6 font-medium text-black",
                    hasCharacter && "ml-4 rounded-tl-[0px]",
                  )}
                >
                  <div
                    className={twMerge(
                      "flex items-start gap-x-2",
                      !hasCharacter && "justify-center",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      {showFurigana ? (
                        <div
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: sentence.ruby ?? "",
                          }}
                        />
                      ) : (
                        <div
                          className={onlyOneHasFurigana ? "mt-[13px]" : ""}
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

const isFav = (sentence: SentenceOutput | Favourite): sentence is Favourite => {
  return "msg" in sentence;
};
