import type { Sentence } from "@rem4d/db";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { api } from "@/utils/api";
import * as Accordion from "@radix-ui/react-accordion";
import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";

import "react-loading-skeleton/dist/skeleton.css";

import { AnimateHeight } from "./AnimateHeight";

interface AccordionProps {
  sentence: Sentence;
}

export default function AccordionComponent({ sentence }: AccordionProps) {
  const [val, setVal] = useState([] as string[]);
  const storedVal = useRef([] as string[]);
  const storedId = useRef<number>(sentence.id);

  useEffect(() => {
    storedVal.current = val;
    storedId.current = sentence.id;
  });

  const utils = api.useUtils();

  const clearMembers = useCallback(() => {
    if (sentence.id !== storedId.current) {
      return utils.member.sentenceMembers.setData({ id: sentence.id }, []);
    }
  }, [utils, sentence.id]);

  // when sentence change
  useEffect(() => {
    // force close translation accordion
    const index = storedVal.current.indexOf("1");
    if (index > -1) {
      const arr = storedVal.current.toSpliced(index, 1);
      setVal(arr);
    }

    // clean members if member accordion closed
    if (!storedVal.current.includes("2")) {
      void clearMembers();
    }
  }, [sentence.id, clearMembers]);

  const memberAccordionOpen = val.includes("2");

  const { data: members, isFetching: loadingMembers } =
    api.member.sentenceMembers.useQuery(
      { id: sentence.id },
      {
        enabled: !!sentence.text && memberAccordionOpen,
        placeholderData: (prev) => prev,
      },
    );

  const onValueChange = (v: string[]) => {
    setVal(v);
  };

  return (
    <div>
      <Accordion.Root
        type="multiple"
        className="bg-mine-shaft rounded-[24px]"
        onValueChange={onValueChange}
        value={val}
      >
        <Accordion.Item
          value="1"
          className="bg-mine-shaft mt-[1px] overflow-hidden rounded-[24px] px-4 py-3 text-white/90"
        >
          <Accordion.Header>
            <Accordion.Trigger className="my-2 flex w-full items-center justify-between">
              <span className="font-medium">Перевод</span>
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
            className={
              val.includes("1")
                ? "animate-accordion-down"
                : "animate-accordion-up"
            }
          >
            <AnimateHeight>
              <div>
                <div className="text-sm">{sentence.ru}</div>
              </div>
            </AnimateHeight>
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
                  "mr-2 fill-current text-black",
                  val.includes("2") && "rotate-180",
                )}
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={
              val.includes("2")
                ? "animate-accordion-down"
                : "animate-accordion-up"
            }
          >
            <AnimateHeight>
              <div className="max-h-[40vh] w-full overflow-y-scroll p-2">
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
                      <React.Fragment key={m.members.basic_form}>
                        <div
                          className="font-yu-gothic cursor-pointer font-medium whitespace-nowrap"
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
              </div>
            </AnimateHeight>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
