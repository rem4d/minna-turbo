import type { SentenceOutput } from "@rem4d/api";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { AnimateHeight } from "@/components/AnimateHeight";
import * as Accordion from "@radix-ui/react-accordion";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

const TranslationContent: React.FC<{
  val: string[];
  transLang: "ru" | "en" | null;
  sentence: SentenceOutput;
}> = ({ val, transLang, sentence }) => {
  const { t } = useTranslation();
  const text = transLang === "ru" ? sentence.ru : sentence.en;

  return (
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
          val.includes("1") ? "animate-accordion-down" : "animate-accordion-up",
        )}
      >
        <AnimateHeight>
          <div>
            <div className="text-sm">{text}</div>
          </div>
        </AnimateHeight>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default TranslationContent;
