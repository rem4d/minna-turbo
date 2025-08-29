import type { FC } from "react";
import type { CellComponentProps } from "react-window";
import { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import KCard from "@/components/KCard";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { api } from "@/utils/api";
import { type KanjiOutput } from "@rem4d/api";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { Grid } from "react-window";
import { twMerge } from "tailwind-merge";
import { isHiragana, isKanji, isKatakana } from "wanakana";

import SearchBar from "./SearchBar";

export const AllKanjiPage: FC = () => {
  const [selectedKId, setSelectedKId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 400);

  const { data: list, isLoading } = api.viewer.kanji.all.useQuery();
  const selectedK = list?.find((d) => d.id === selectedKId);

  const displayData = debouncedValue
    ? list?.filter((d) => {
        const value = debouncedValue.trim();

        if (isHiragana(value)) {
          return d.kun?.join(";").includes(debouncedValue);
        }

        if (isKatakana(value)) {
          return d.on_?.join(";").includes(debouncedValue);
        }

        if (isKanji(value)) {
          return d.kanji === debouncedValue.trim();
        }

        return d.en?.includes(debouncedValue.toLowerCase());
      })
    : list;

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const onCardClick = useCallback((id: number) => {
    setSelectedKId(id);
    setOpen(true);
  }, []);

  const len = displayData?.length ?? 0;
  const virtualizedRowCount = len / 4 + 1;

  return (
    <Page back useRouter to="/library">
      <div
        className={twMerge(
          "flex flex-col space-y-8 px-4 pb-4",
          isLoading && "h-full overflow-hidden",
        )}
      >
        <SectionHeader className={isLoading ? "opacity-0" : ""}>
          {t("all_kanji")}
        </SectionHeader>
        <SearchBar
          onChange={setSearchValue}
          value={searchValue}
          placeholderText={t("find")}
        />
        {isLoading && (
          <Skeleton
            className="aspect-square"
            count={displayData?.length ?? 0}
            borderRadius={6}
            containerClassName="grid grid-cols-3 sm:grid-cols-4 gap-4"
            inline
          />
        )}
        {!isLoading && (
          <div className="no-scroll h-[calc(100vh-160px)] overflow-y-scroll">
            <Grid
              className="no-scroll flex flex-col items-center"
              cellComponent={Card}
              cellProps={{ list: displayData ?? [], onClick: onCardClick }}
              columnCount={4}
              columnWidth={90}
              rowCount={virtualizedRowCount}
              rowHeight={90}
            />
          </div>
        )}
        {/* {!isLoading && ( */}
        {/*   <div className="grid grid-cols-3 gap-4 sm:grid-cols-4"> */}
        {/*     {displayData?.map((k) => ( */}
        {/*       <Card */}
        {/*         key={k.id} */}
        {/*         id={k.id} */}
        {/*         kanji={k.kanji} */}
        {/*         level={k.position} */}
        {/*         en={k.en ?? ""} */}
        {/*         onClick={onCardClick} */}
        {/*       /> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* )} */}
      </div>

      <Drawer open={open} onOpenChange={setOpen} noContainer>
        <div className="flex h-full min-h-[60vh] flex-col bg-white px-4 py-4 pb-(--page-offset-bottom)">
          {selectedK && <KCard k={selectedK} className="scale-[1.0]" />}
        </div>
      </Drawer>
    </Page>
  );
};

function Card({
  list,
  columnIndex,
  rowIndex,
  style,
  onClick,
}: CellComponentProps<{
  list: KanjiOutput[];
  onClick?: (id: number) => void;
}>) {
  const index = rowIndex * 4 + columnIndex;

  const en = list[index]?.en;
  const means = en?.split(";")[0];

  const kanji = list[index]?.kanji;
  const level = list[index]?.position;
  const id = list[index]?.id;

  if (!id) return null;

  return (
    <div className="" style={style} onClick={() => onClick?.(id)}>
      <div className="relative m-2 flex aspect-square cursor-pointer flex-col justify-center overflow-hidden rounded-md border border-black/10 bg-white px-1 py-2 shadow-[3px_3px_0px_rgba(41,41,41,0.1)]">
        <div className="text-rolling-stone/70 absolute top-2 left-2 text-xs">
          {level}
        </div>
        <div className="flex flex-col space-y-1">
          <div className="font-digi text-center text-3xl text-black">
            {kanji}
          </div>
          <div className="truncate text-center text-xs whitespace-nowrap text-black">
            {means}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllKanjiPage;
