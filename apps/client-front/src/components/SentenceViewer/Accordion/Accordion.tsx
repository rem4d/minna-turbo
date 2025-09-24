import type { SentenceOutput } from "@rem4d/api";
import { useEffect, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { AnimateHeight } from "@/components/AnimateHeight";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import * as Accordion from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { runStream } from "./ai";
import AiScreen from "./AiScreen";
import GlossaryContent from "./Glossary";
import TranslationContent from "./TranslationContent";

interface AccordionProps {
  sentence: SentenceOutput;
}
export default function AccordionComponent({ sentence }: AccordionProps) {
  const [isAskAiClicked, setIsAskAiClicked] = useState(false);
  const [screen, setScreen] = useState<"ai" | "glossary">("glossary");
  const [chunks, setChunks] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const openItems = useAppStore((state) => state.openItems);
  const setOpenItems = useAppStore((state) => state.setOpenItems);
  const closeItem = useAppStore((state) => state.closeItem);

  const { t } = useTranslation();
  const [title, setTitle] = useState(t("glossary"));

  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );
  const trpc = useTRPC();

  const {
    data: members,
    isFetching: loadingMembers,
    isSuccess,
  } = useQuery(
    trpc.viewer.member.sentenceMembers2.queryOptions(
      { id: sentence.id },
      {
        enabled: !!sentence.text && openItems.includes("2"),
        placeholderData: (prev) => prev,
      },
    ),
  );

  const { data: kanjisInTheSentence } = useQuery(
    trpc.viewer.member.sentenceKanjis.queryOptions(
      { id: sentence.id },
      {
        enabled: !!sentence.text && openItems.includes("2"),
      },
    ),
  );

  const { data: glosses } = useQuery(
    trpc.viewer.sentence.glosses.queryOptions(
      { id: sentence.id },
      {
        enabled: !!sentence.text && openItems.includes("2"),
      },
    ),
  );

  console.log(glosses);
  useEffect(() => {
    setScreen("glossary");
    setIsAskAiClicked(false);
    setChunks("");
    setTitle(t("glossary"));
  }, [sentence.id, t]);

  useEffect(() => {
    if (openItems.includes("1")) {
      closeItem("1");
      // setOpenItems((prev) => prev.filter((item) => item !== "1"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence.id]);

  const onValueChange = (v: string[]) => {
    setOpenItems(v);
  };

  const handleAskAiClick = async () => {
    setScreen("ai");
    setIsAiLoading(true);
    setTitle(t("ai_review"));

    const stream = await runStream(sentence.text);

    for await (const delta of stream) {
      if ("content" in delta.data) {
        setIsAiLoading(false);
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
      value={openItems}
    >
      <TranslationContent
        val={openItems}
        transLang={transLang}
        sentence={sentence}
      />

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
                openItems.includes("2") && "rotate-180",
              )}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content
          className={twMerge(
            "px-4",
            openItems.includes("2")
              ? "animate-accordion-down"
              : "animate-accordion-up",
          )}
        >
          <AnimateHeight>
            {screen === "ai" && (
              <AiScreen loading={isAiLoading} text={chunks} />
            )}
            {screen === "glossary" && (
              <GlossaryContent
                members={members}
                kanjisInTheSentence={kanjisInTheSentence}
                grammarGlosses={glosses}
                loadingMembers={loadingMembers}
                isSuccess={isSuccess}
                askAiClicked={isAskAiClicked}
                onAskAiClick={handleAskAiClick}
                setAskAiClicked={setIsAskAiClicked}
                transLang={transLang}
              />
            )}
          </AnimateHeight>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
