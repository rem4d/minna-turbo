import type { Sentence } from "@rem4d/db";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { api } from "@/utils/api";
import * as Accordion from "@radix-ui/react-accordion";
import { twMerge } from "tailwind-merge";

interface AccordionProps {
  sentence: Sentence;
}

export default function AccordionComponent({ sentence }: AccordionProps) {
  const [val, setVal] = useState([] as string[]);
  const stored = useRef([] as string[]);

  useEffect(() => {
    stored.current = val;
  });

  useEffect(() => {
    const index = stored.current.indexOf("1");

    if (index > -1) {
      const arr = stored.current.toSpliced(index, 1);
      setVal(arr);
    }
  }, [sentence.id]);

  const { data: members, isLoading: loadingMembers } =
    api.member.sentenceMembers.useQuery(
      { id: sentence.id },
      {
        enabled: !!sentence.text && val.includes("2"),
      },
    );

  const onValueChange = (v: string[]) => {
    setVal(v);
  };

  return (
    <Accordion.Root
      type="multiple"
      className="bg-mineShaft rounded-[24px]"
      onValueChange={onValueChange}
      value={val}
    >
      <Accordion.Item
        value="1"
        className="bg-mineShaft mt-[1px] overflow-hidden rounded-[24px] px-4 py-3 text-white/90"
      >
        <Accordion.Header>
          <Accordion.Trigger className="my-2 flex w-full items-center justify-between">
            <span className="font-medium">Перевод</span>
            <ArrowIcon
              className={twMerge(
                "fill-current",
                val.includes("1") && "rotate-180",
              )}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className={
            val.includes("1")
              ? "animate-accordion-down"
              : "animate-accordion-up"
          }
        >
          <div className="text-sm">{sentence.ru}</div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item
        className="rounded-tl-[24px] rounded-tr-[24px] bg-white px-4 py-3 pb-[50px]"
        value="2"
      >
        <Accordion.Header>
          <Accordion.Trigger className="my-2 flex w-full items-center justify-between">
            <span className="font-medium">Словарь</span>
            <ArrowIcon
              className={twMerge(
                "fill-current text-black",
                val.includes("2") && "rotate-180",
              )}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className={twMerge(
            "",
            val.includes("2")
              ? "animate-accordion-down"
              : "animate-accordion-up",
          )}
        >
          <div className="max-h-[40vh] w-full overflow-y-scroll p-2">
            {loadingMembers && <div>Loading...</div>}
            <div className="grid grid-cols-[fit-content(50px),auto] items-center gap-x-3 gap-y-2 text-[18px]">
              {members?.map((m) => (
                <React.Fragment key={m.members.basic_form}>
                  <div
                    className="font-klee cursor-pointer whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: m.members.ruby ?? "",
                    }}
                  />
                  <div className="relative top-1 text-sm leading-5">
                    {m.members.en}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
