import type { UseQueryResult } from "@tanstack/react-query";
import React, { Suspense } from "react";
import Thumbnail from "@/components/Thumbnail";
import WordReadings from "@/components/WordReadings";
import { STORAGE_LANG } from "@/config/const";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";

import type { ExampleOutput } from "@minna/api";

interface Props {
  kanjiSymbol: string;
  nested?: boolean;
}

export default function KanjiInfo({ kanjiSymbol, nested = false }: Props) {
  const [transLang] = useLocalStorage<"ru" | "en" | null>(STORAGE_LANG, null);
  const trpc = useTRPC();
  const kanji = useAppStore((s) => s.kanjiMap.get(kanjiSymbol));

  const examplesQuery = useQuery(
    trpc.viewer.kanji.examples.queryOptions(
      { k: kanjiSymbol },
      {
        enabled: Boolean(kanji),
      },
    ),
  );

  if (!kanji) {
    return null;
  }

  const currentMeaning = String(
    transLang === "ru" ? kanji.ru : kanji.en,
  ).toLowerCase();

  return (
    <div className="flex h-full grow flex-col">
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <Thumbnail
              title={kanji.kanji}
              level={kanji.position}
              id={kanji.id}
              means={""}
              large
            />
          </div>
          <div className="flex flex-col items-start space-y-2">
            <div className="font-inter mb-4 text-xl font-semibold text-black">
              {currentMeaning}
            </div>
            {kanji.kun && kanji.kun.length > 0 && (
              <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
                {kanji.kun.join("、")}
              </span>
            )}
            {kanji.on_ && kanji.on_.length > 0 && (
              <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
                {kanji.on_.join("、")}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex h-full grow flex-col bg-white px-4 pt-4">
        <Suspense fallback={<ExamplesFallback />}>
          <Examples query={examplesQuery} nested={nested} />
        </Suspense>
      </div>
    </div>
  );
}

function ExamplesFallback() {
  return (
    <div className="flex h-full w-full flex-col space-y-3 opacity-80">
      <div className="fallback h-7 w-[70%] rounded-lg" />
      <div className="fallback h-7 w-[80%] rounded-lg" />
      <div className="fallback h-7 w-[90%] rounded-lg" />
      <div className="fallback h-7 w-[70%] rounded-lg" />
      <div className="fallback h-7 w-[80%] rounded-lg" />
      <div className="fallback h-7 w-[90%] rounded-lg" />
    </div>
  );
}

function Examples({
  query,
  nested,
}: {
  nested: boolean;
  query: UseQueryResult<ExampleOutput[], any>;
}) {
  const data = React.use(query.promise);

  return (
    <div className="h-full grow">
      <WordReadings list={data} nested={nested} />
    </div>
  );
}
