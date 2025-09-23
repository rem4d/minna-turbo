import type { GlossOutput, Member2Output } from "@rem4d/api";
import React from "react";
import Button from "@/components/Button";
import PreviewCard from "@/components/PreviewCard";
import { type KanjiInTheSentenceOutput } from "@rem4d/api";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { LoadingMembersPlaceholder } from "./LoadingMembersPlaceholder";

const GlossaryContent: React.FC<{
  members: Member2Output[] | undefined;
  kanjisInTheSentence: KanjiInTheSentenceOutput[] | undefined;
  grammarGlosses: GlossOutput[] | undefined;
  loadingMembers: boolean;
  isSuccess: boolean;
  askAiClicked: boolean;
  onAskAiClick: () => void;
  setAskAiClicked: React.Dispatch<React.SetStateAction<boolean>>;
  transLang: "ru" | "en" | null;
}> = ({
  members,
  grammarGlosses,
  kanjisInTheSentence,
  loadingMembers,
  isSuccess,
  askAiClicked,
  onAskAiClick,
  setAskAiClicked,
  transLang,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="no-scroll max-h-[40vh] w-full overflow-y-scroll py-2">
        <div className="relative">
          {loadingMembers ? (
            <LoadingMembersPlaceholder membersLength={members?.length} />
          ) : null}
          <div
            className={twMerge(
              "grid grid-cols-[fit-content(50px)_auto] items-center gap-x-3 gap-y-2 text-[18px]",
              loadingMembers && "opacity-0",
            )}
          >
            {members?.map((m) => (
              <React.Fragment key={m.basic_form}>
                <div
                  className="font-yu-gothic cursor-pointer font-medium whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: m.basic_form,
                  }}
                />
                <div className="relative top-1 text-sm leading-5">
                  {transLang === "ru" ? m.ru : m.en}
                </div>
              </React.Fragment>
            ))}
          </div>
          {false && !loadingMembers && (
            <div>
              <p className="text-md mt-6 mb-3 font-medium">
                {t("kanji_in_this_sentence")}
              </p>
              <div className="mt-2 grid grid-cols-4 gap-4">
                {kanjisInTheSentence?.map((k) => (
                  <div key={k.id} className="">
                    <PreviewCard d={k} hideMeaning />
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loadingMembers && (
            <div>
              <p className="text-md mt-6 mb-3 font-medium">Grammar glosses</p>
              <div className="my-2 flex flex-col gap-2">
                {grammarGlosses?.map((k) => (
                  <div className="flex space-x-4" key={k.gloss_id}>
                    <div className="whitespace-nowrap">{k.kana}</div>
                    <div className="">{k.comment}</div>
                    <div />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        {!loadingMembers && isSuccess && (
          <div
            className="absolute right-2 bottom-0 flex justify-end"
            onClick={() => setAskAiClicked(true)}
          >
            {!askAiClicked ? (
              <div className="text-mine-shaft/50 text-[22px]">?</div>
            ) : (
              <Button onClick={onAskAiClick}>Ask AI</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default GlossaryContent;
