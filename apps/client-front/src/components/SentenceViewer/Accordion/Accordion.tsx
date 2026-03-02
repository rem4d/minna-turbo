import type { SentenceLike } from "@/types";
import { useEffect } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { AnimateHeight } from "@/components/AnimateHeight";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import * as Accordion from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import GlossaryContent from "./Glossary";
import TranslationContent from "./TranslationContent";

interface AccordionProps {
  sentence: SentenceLike;
}
export default function AccordionComponent({ sentence }: AccordionProps) {
  const openItems = useAppStore((state) => state.openItems);
  const setOpenItems = useAppStore((state) => state.setOpenItems);
  // const closeItem = useAppStore((state) => state.closeItem);

  const { t } = useTranslation();
  const title = t("glossary");

  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );
  const trpc = useTRPC();

  const { data: members, isFetching: loadingMembers } = useQuery(
    trpc.viewer.member.membersById.queryOptions(
      { id: sentence.id },
      {
        enabled: !!sentence.id && openItems.includes("2"),
      },
    ),
  );

  useEffect(() => {
    if (openItems.includes("1")) {
      // closeItem("1");
      // setOpenItems((prev) => prev.filter((item) => item !== "1"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence.id]);

  const onValueChange = (v: string[]) => {
    setOpenItems(v);
  };

  return (
    <Accordion.Root
      type="multiple"
      className="bg-mine-shaft rounded-3xl"
      onValueChange={onValueChange}
      value={openItems}
    >
      <TranslationContent
        val={openItems}
        transLang={transLang}
        en={sentence.en}
        ru={sentence.ru}
      />

      <Accordion.Item
        className={twMerge(
          "rounded-tl-3xl rounded-tr-3xl bg-white",
          "pb-[20px]",
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
            <GlossaryContent
              members={members}
              loadingMembers={loadingMembers}
              transLang={transLang}
            />
          </AnimateHeight>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
