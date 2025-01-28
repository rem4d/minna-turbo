import type { Sentence } from "@rem4d/db";
import type { MemberOutput } from "../../types";
import { CompositePlayer } from "./CompositePlayer";
import { openUrl } from "@/utils";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { api } from "@/utils/api";

import FuriganaVisibleIcon from "@/assets/icons/furigana-visible.svg?react";
import FuriganaHiddenIcon from "@/assets/icons/furigana-hidden.svg?react";

interface Props {
  lang: "en" | "ru";
  sentence: Sentence;
}

export default function MainScreen({ sentence, lang }: Props) {
  const [membersSpoilerOpen, setMembersSpoilerOpen] = useState(false);
  const [translationSpoilerOpen, setTranslationSpoilerOpen] = useState(false);

  const { data: members, isLoading: loadingMembers } =
    api.member.sentenceMembers.useQuery(
      { id: sentence.id },
      {
        enabled: !!sentence.text && membersSpoilerOpen,
      },
    );
  console.log(members);

  const onMemberClick = useCallback((m: MemberOutput) => {
    openUrl(`https://jisho.org/search/${m.basic_form}`);
  }, []);

  const onMembersSpoilerClick = () => {
    setMembersSpoilerOpen((s) => !s);
  };

  const onTranslationSpoilerClick = () => {
    setTranslationSpoilerOpen((s) => !s);
  };

  return (
    <div className="w-[440px] text-black bg-wildSand p-4 rounded-[10px]">
      <div className="flex relative flex-col gap-4 items-start">
        <CompositePlayer sentence={sentence} />
        <div className="w-full justify-center flex text-butterflyBush mt-2">
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={onMembersSpoilerClick}
          >
            <div className="text-sm select-none">Vocabulary</div>
            {membersSpoilerOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </div>
        </div>
        {membersSpoilerOpen && (
          <div className="bg-white border border-gallery w-full p-2 shadow-md">
            {loadingMembers && <div>Loading...</div>}
            <div className="grid grid-cols-3 font-klee text-[18px] gap-4">
              {members?.map((m) => (
                <div className="flex flex-col" key={m.basic_form}>
                  <div
                    onClick={() => onMemberClick(m)}
                    className="cursor-pointer whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: m.ruby,
                    }}
                  />
                  <div className="font-inter text-sm">
                    {lang === "en" ? m.en : m.ru ? m.ru : m.en}
                  </div>
                  <div className="mt-2">
                    <span className="text-sky-500">{m.pos}</span>
                    {m.pos_detail_1 === "suffix" ? (
                      <span className="text-red-800">{m.pos_detail_1}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="w-full justify-center flex text-butterflyBush mt-2">
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={onTranslationSpoilerClick}
          >
            <div className="text-sm select-none">Translation</div>
            {translationSpoilerOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </div>
        </div>

        {translationSpoilerOpen && (
          <div className="bg-white border border-gallery w-full p-2 shadow-md">
            {lang === "ru" && <div>{sentence.ru}</div>}
            {lang === "en" && <div>{sentence.en}</div>}
            {/* <Text>tr: {sentence.translation}</Text> */}
          </div>
        )}
      </div>
    </div>
  );
}
