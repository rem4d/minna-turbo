import React, { Suspense } from "react";
import { FooterMenu } from "@/components/FooterMenu";
import { Page } from "@/components/Page";
import Skeleton from "react-loading-skeleton";

const LazyContent = React.lazy(() => import("./LazyContent"));

export default function AllKanjiPage() {
  console.log("");
  return (
    <>
      <Page>
        {/* <SectionHeader>{t("all_kanji")}</SectionHeader> */}
        <Suspense fallback={<Fallback />}>
          <LazyContent />
        </Suspense>
      </Page>
      <FooterMenu />
    </>
  );
}

function Fallback() {
  return (
    <div className="h-full w-full overflow-hidden p-4">
      <Skeleton
        className="aspect-square"
        count={32}
        borderRadius={6}
        containerClassName="grid grid-cols-3 sm:grid-cols-4 gap-4"
        inline
      />
    </div>
  );
}
