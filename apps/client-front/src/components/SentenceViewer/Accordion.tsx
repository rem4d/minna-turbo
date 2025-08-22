import type { SentenceOutput } from "@rem4d/api";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { api } from "@/utils/api";
import * as Accordion from "@radix-ui/react-accordion";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { AnimateHeight } from "../AnimateHeight";
import Button from "../Button";
import { runStream } from "./ai";
import AiScreen from "./AiScreen";
import { LoadingMembersPlaceholder } from "./LoadingMembersPlaceholder";

interface AccordionProps {
  sentence: SentenceOutput;
}

export default function AccordionComponent({ sentence }: AccordionProps) {
  const [val, setVal] = useState([] as string[]);
  const storedVal = useRef([] as string[]);
  const storedId = useRef<number | null>(null);
  const [askAiClicked, setAskAiClicked] = useState(false);
  const [screen, setScreen] = useState<"ai" | "glossary">("glossary");
  const [chunks, setChunks] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const { t } = useTranslation();
  const [title, setTitle] = useState(t("glossary"));

  useEffect(() => {
    storedVal.current = val;
  });

  useEffect(() => {
    storedId.current = sentence.id;
    setScreen("glossary");
    setAskAiClicked(false);
    setChunks("");
    setTitle(t("glossary"));
  }, [sentence.id, t]);
  console.log(".");

  // when sentence change
  useEffect(() => {
    // force close translation accordion
    const index = storedVal.current.indexOf("1");

    if (index > -1) {
      const arr = storedVal.current.toSpliced(index, 1);
      setVal(arr);
    }
  }, [sentence.id]);

  const memberAccordionOpen = val.includes("2");

  const {
    data: members,
    isFetching: loadingMembers,
    isSuccess,
  } = api.viewer.member.sentenceMembers2.useQuery(
    { id: sentence.id },
    {
      enabled: !!sentence.text && memberAccordionOpen,
      placeholderData: (prev) => prev,
    },
  );

  const onValueChange = (v: string[]) => {
    setVal(v);
  };

  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );

  const onAskAiClick = async () => {
    setScreen("ai");
    setAiLoading(true);
    setTitle(t("ai_review"));

    const stream = await runStream(sentence.text);

    for await (const delta of stream) {
      if ("content" in delta.data) {
        setAiLoading(false);
        // @ts-ignore
        const text = delta.data.content as unknown as string;
        setChunks((ch) => `${ch}${text}`);
      }
    }
  };

  return (
    <Accordion.Root
      type="multiple"
      className="bg-mine-shaft rounded-[24px]"
      onValueChange={onValueChange}
      value={val}
    >
      <Accordion.Item
        value="1"
        className="bg-mine-shaft overflow-hidden rounded-tl-[24px] rounded-tr-[24px] py-1 text-white/90"
      >
        <Accordion.Header>
          <Accordion.Trigger className="mt-2 flex w-full items-center justify-between px-4 py-2">
            <span className="font-medium">{t("translation")}</span>
            <ArrowIcon
              className={twMerge(
                "mr-2 fill-current",
                val.includes("1") && "rotate-180",
              )}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className={twMerge(
            "px-4",
            val.includes("1")
              ? "animate-accordion-down"
              : "animate-accordion-up",
          )}
        >
          <AnimateHeight>
            <div>
              <div className="text-sm">
                {transLang === "ru" ? sentence.ru : sentence.en}
              </div>
            </div>
          </AnimateHeight>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item
        className={twMerge(
          "rounded-tl-[24px] rounded-tr-[24px] bg-white",
          "pb-[calc(var(--page-offset-bottom)+20px)]",
        )}
        value="2"
      >
        <Accordion.Header>
          <Accordion.Trigger className="mt-2 flex w-full items-center justify-between px-4 py-3 pt-5">
            <span className="font-medium">{title}</span>
            <ArrowIcon
              className={twMerge(
                "mr-2 fill-current text-black",
                val.includes("2") && "rotate-180",
              )}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content
          className={twMerge(
            "px-4",
            val.includes("2")
              ? "animate-accordion-down"
              : "animate-accordion-up",
          )}
        >
          <AnimateHeight>
            {screen === "ai" && <AiScreen loading={aiLoading} text={chunks} />}
            {screen === "glossary" && (
              <div>
                <div className="no-scroll max-h-[40vh] w-full overflow-y-scroll py-2">
                  <div className="relative">
                    {loadingMembers ? (
                      <LoadingMembersPlaceholder
                        membersLength={members?.length}
                      />
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
            )}
          </AnimateHeight>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
