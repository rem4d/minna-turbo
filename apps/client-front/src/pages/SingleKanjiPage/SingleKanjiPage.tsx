import { useState } from "react";
import KanjiInfo from "@/components/KanjiInfo";
import { Page } from "@/components/Page";
import SentenceNavButtons from "@/components/SentenceViewer/SentenceNavButtons";
import { useRouter } from "@/router/router";
import { paths } from "@/router/routes";
import { useTRPC } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

export default function SingleKanjiPage() {
  const trpc = useTRPC();
  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const [navIndex, setNavIndex] = useState(-1);

  const { url } = useRouter();
  const kanjiId = url.split("/").pop();

  const list = listQuery.data ?? [];

  const activeIndex =
    navIndex === -1
      ? list.findIndex((d) => d.id === Number(kanjiId))
      : navIndex;

  const found = list[activeIndex];

  const handlePrevClick = () => {
    setNavIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    setNavIndex(activeIndex + 1);
  };
  const disablePrevNav = activeIndex === 0;
  const disableNextNav = activeIndex === list.length - 1;

  if (!found) {
    return <Page />;
  }

  return (
    <Page
      backTo={paths.allKanji}
      className="relative overflow-y-hidden"
      backAnimationStyle="remove"
    >
      <div className="mt-12">
        <KanjiInfo kanjiSymbol={found.kanji} nested={false} />
        <div className="flex h-full grow flex-col pt-4">
          <SentenceNavButtons
            disablePrevNav={disablePrevNav}
            disableNextNav={disableNextNav}
            handleNextClick={handleNextClick}
            handlePrevClick={handlePrevClick}
            className={twMerge("bottom-6")}
          />
        </div>
      </div>
    </Page>
  );
}
