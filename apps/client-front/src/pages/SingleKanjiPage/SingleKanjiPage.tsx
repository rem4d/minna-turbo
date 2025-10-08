import type { ExampleOutput } from "@rem4d/api";
import type { UseQueryResult } from "@tanstack/react-query";
import React, { Suspense, useLayoutEffect, useState } from "react";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import SentenceNavButtons from "@/components/SentenceViewer/SentenceNavButtons";
import Thumbnail from "@/components/Thumbnail";
import WordReadings from "@/components/WordReadings";
import { STORAGE_LANG } from "@/config/const";
import { useRouter } from "@/router/router";
import { paths } from "@/router/routes";
import { useTRPC } from "@/utils/api";
import { hapticFeedback } from "@/utils/tgUtils";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { twMerge } from "tailwind-merge";

export default function SingleKanjiPage() {
  const [transLang] = useLocalStorage<"ru" | "en" | null>(STORAGE_LANG, null);

  const trpc = useTRPC();
  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());

  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const { url } = useRouter();
  const kanjiId = url.split("/").pop();

  const list = listQuery.data ?? [];

  useLayoutEffect(() => {
    if (activeIndex === -1) {
      const foundIndex = list.findIndex((d) => d.id === Number(kanjiId));
      setActiveIndex(foundIndex);
    }
  }, [list]);

  const found =
    activeIndex === -1
      ? list.find((d) => d.id === Number(kanjiId))
      : list[activeIndex];

  const examplesQuery = useQuery(
    trpc.viewer.kanji.examples.queryOptions(
      { k: found?.kanji ?? "" },
      { enabled: Boolean(found) },
    ),
  );

  if (!found) {
    return null;
  }

  const kanji = found.kanji;
  const level = found.position;

  const onClick = () => {};
  const id = found.id;

  const currentMeaning = String(
    transLang === "ru" ? found.ru : found.en,
  ).toLowerCase();

  const { kun, on_ } = found;

  const handlePrevClick = () => {
    hapticFeedback("light");
    setActiveIndex((i) => i - 1);
  };

  const handleNextClick = () => {
    hapticFeedback("light");
    setActiveIndex((i) => i + 1);
  };
  const disablePrevNav = activeIndex === 0;
  const disableNextNav = activeIndex === list.length - 1;

  return (
    <Page
      backTo={paths.allKanji}
      className="overflow-y-hidden"
      backAnimationStyle="remove"
    >
      <div className="flex h-full grow flex-col pt-4">
        <SectionHeader></SectionHeader>

        <div className="px-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <Thumbnail
                title={kanji}
                level={level}
                onClick={onClick}
                id={id}
                means={""}
                large
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <div className="font-inter mb-4 text-xl font-semibold text-black">
                {currentMeaning}
              </div>
              {kun && kun.length > 0 && (
                <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
                  {kun.join("、")}
                </span>
              )}
              {on_ && on_.length > 0 && (
                <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
                  {on_.join("、")}
                </span>
              )}
            </div>
          </div>
          {/* <Suspense fallback={<InfoFallback />}> */}
          {/*   <Info kanjiId={Number(kanjiId)} query={listQuery} /> */}
          {/* </Suspense> */}
        </div>
        <div className="relative mt-4 flex h-full grow flex-col bg-white px-4 pt-4">
          <Suspense fallback={<ExamplesFallback />}>
            <Examples query={examplesQuery} />
          </Suspense>
        </div>

        <SentenceNavButtons
          disablePrevNav={disablePrevNav}
          disableNextNav={disableNextNav}
          handleNextClick={handleNextClick}
          handlePrevClick={handlePrevClick}
          className={twMerge(
            // false && "top-1/2",
            "bottom-[calc(var(--tg-bottom)+25px)]",
          )}
        />
      </div>
    </Page>
  );
}

function ExamplesFallback() {
  return (
    <div className="flex h-full w-full flex-col space-y-3 opacity-80">
      <div className="fallback h-[28px] w-[70%]" />
      <div className="fallback h-[28px] w-[80%]" />
      <div className="fallback h-[28px] w-[90%]" />
      <div className="fallback h-[28px] w-[70%]" />
      <div className="fallback h-[28px] w-[80%]" />
      <div className="fallback h-[28px] w-[90%]" />
    </div>
  );
}

// function _InfoFallback() {
//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="fallback aspect-square" />
//       <div className="flex flex-col space-y-2">
//         <div className="fallback h-[28px] w-[80%]" />
//         <div className="fallback h-[28px] w-[60%]" />
//         <div className="fallback h-[28px] w-[60%]" />
//       </div>
//     </div>
//   );
// }

// function Info({
//   query,
//   kanjiId,
// }: {
//   kanjiId: number;
//   query: UseQueryResult<KanjiOutput[], any>;
// }) {
//   const list = React.use(query.promise);
//   const found = list.find((d) => d.id === Number(kanjiId));
//
//   const [transLang] = useLocalStorage<"ru" | "en" | null>(
//     "kic:translation_language",
//     null,
//   );
//
//   if (!found) {
//     return null;
//   }
//
//   const kanji = found.kanji;
//   const level = found.position;
//
//   const onClick = () => {};
//   const id = found.id;
//
//   const currentMeaning = String(
//     transLang === "ru" ? found.ru : found.en,
//   ).toLowerCase();
//
//   const { kun, on_ } = found;
//
//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="">
//         <Thumbnail
//           title={kanji}
//           level={level}
//           onClick={onClick}
//           id={id}
//           means={""}
//           large
//         />
//       </div>
//       <div className="flex flex-col items-start space-y-2">
//         <div className="font-inter mb-4 text-xl font-semibold text-black">
//           {currentMeaning}
//         </div>
//         {kun && kun.length > 0 && (
//           <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
//             {kun.join("、")}
//           </span>
//         )}
//         {on_ && on_.length > 0 && (
//           <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
//             {on_.join("、")}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }
//
function Examples({ query }: { query: UseQueryResult<ExampleOutput[], any> }) {
  const data = React.use(query.promise);

  return (
    <div className="h-full grow">
      <WordReadings list={data} hideMeanings={false} />
    </div>
  );
}
