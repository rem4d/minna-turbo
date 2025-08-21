import type { SentenceOutput } from "@rem4d/api";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { api } from "@/utils/api";
import { Mistral } from "@mistralai/mistralai";
import * as Accordion from "@radix-ui/react-accordion";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import Markdown from "react-markdown";
import { twMerge } from "tailwind-merge";

import { AnimateHeight } from "../AnimateHeight";

interface AccordionProps {
  sentence: SentenceOutput;
}

export default function AccordionComponent({ sentence }: AccordionProps) {
  const [val, setVal] = useState([] as string[]);
  const storedVal = useRef([] as string[]);
  const storedId = useRef<number | null>(null);
  const [aiResopnse, setAiResopnse] = useState("");

  useEffect(() => {
    storedVal.current = val;
  });

  useEffect(() => {
    storedId.current = sentence.id;
  }, [sentence.id]);

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

  const { data: members, isFetching: loadingMembers } =
    api.viewer.member.sentenceMembers2.useQuery(
      { id: sentence.id },
      {
        enabled: !!sentence.text && memberAccordionOpen,
        placeholderData: (prev) => prev,
      },
    );

  const onValueChange = (v: string[]) => {
    setVal(v);
  };

  const { t } = useTranslation();
  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );

  const onAiClick = async () => {
    if (val.includes("3")) {
      console.log("closed");
    } else {
      if (aiResopnse) {
        return;
      }
      const response = await callApi(sentence.text);
      if (response) {
        setAiResopnse(response);
      }
      console.log("open");
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
        className={twMerge("rounded-tl-[24px] rounded-tr-[24px] bg-white py-1")}
        value="2"
      >
        <Accordion.Header>
          <Accordion.Trigger className="mt-2 flex w-full items-center justify-between px-4 py-2">
            <span className="font-medium">{t("glossary")}</span>
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
            <div className="no-scroll max-h-[40vh] w-full overflow-y-scroll py-2">
              <div className="relative">
                {loadingMembers ? (
                  members && members.length > 0 ? (
                    <div className="absolute h-full w-full">
                      <Skeleton
                        inline
                        containerClassName="flex flex-col space-y-4"
                        height="25px"
                        count={members.length}
                      />
                    </div>
                  ) : (
                    <Skeleton
                      inline
                      containerClassName="flex flex-col space-y-4"
                      height="25px"
                      count={3}
                    />
                  )
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
          </AnimateHeight>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item
        value="3"
        className={twMerge(
          "text-mine-shaft overflow-hidden rounded-tl-[24px] rounded-tr-[24px] bg-[#f3f3f3]",
          "pb-[calc(var(--page-offset-bottom)+20px)]",
        )}
        onClick={onAiClick}
      >
        <Accordion.Header>
          <Accordion.Trigger className="mt-2 flex w-full items-center justify-between px-4 py-3 pt-2">
            <span className="font-medium">AI</span>
            <ArrowIcon
              className={twMerge(
                "mr-2 fill-current",
                val.includes("3") && "rotate-180",
              )}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className={twMerge(
            "px-4",
            val.includes("3")
              ? "animate-accordion-down"
              : "animate-accordion-up",
          )}
        >
          <AnimateHeight>
            <div className="no-scroll max-h-[40vh] w-full overflow-y-scroll py-2">
              <div className="text-sm">
                <Markdown>{aiResopnse}</Markdown>
              </div>
            </div>
          </AnimateHeight>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

const mClient = new Mistral({
  apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
});

const callApi = async (text: string) => {
  const prompt = `Разбери на русском '${text}'`;
  const model = "mistral-large-latest";
  try {
    const response = await mClient.chat.complete({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const content = response?.choices[0]?.message.content;
    if (typeof content === "string") {
      return content;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
