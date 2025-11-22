import type { FC } from "react";
import { useEffect, useState } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";
import { FooterMenu } from "@/components/FooterMenu";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "@/router/router";
import { paths } from "@/router/routes";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

export const LibraryPage: FC = () => {
  // const { data: list, isLoading } =
  //   api.viewer.member.suggestedVocabulariesList.useQuery(undefined, {
  //     throwOnError: true,
  //   });
  const [isLoading, setIsLoading] = useState(() => Math.random() > 0.5);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(id);
  }, []);

  const { t } = useTranslation();
  const { navigate } = useRouter();

  return (
    <>
      <Page>
        <div className="relative flex flex-col space-y-8 px-4 pb-(--footer-height)">
          {!isLoading && (
            <>
              <SectionHeader>{t("library")}</SectionHeader>
              <List title={t("kanji")}>
                <ListItem
                  title={t("see_all")}
                  icon={<KanjiIcon className="size-[20px]" />}
                  onClick={() =>
                    navigate(paths.allKanji, { animationStyle: "nav-forward" })
                  }
                  right="arrow"
                />
              </List>
              {/* <List title={t("recommended_vocabulary")}> */}
              {/*   {list?.map((data, i) => ( */}
              {/*     <ListItem */}
              {/*       key={`level-${data.level_from}`} */}
              {/*       title={`${t("level_uppercase")} ${i + 1}`} */}
              {/*       sub={`${data.cnt} ${t("word", { count: data.cnt ?? 0 })}`} */}
              {/*       to={`/library/dict/${i + 1}`} */}
              {/*       showBorder={i < list.length - 1} */}
              {/*       right="arrow" */}
              {/*     /> */}
              {/*   ))} */}
              {/* </List> */}
            </>
          )}

          {isLoading && (
            <div className="mt-13">
              <div className="mb-6 flex flex-col space-y-1">
                <Skeleton
                  className="mb-2 ml-3"
                  height="20px"
                  width="30%"
                  inline
                />
                <Skeleton
                  count={1}
                  height="60px"
                  inline
                  borderRadius={10}
                  containerClassName="flex flex-col space-y-2"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Skeleton
                  className="mb-2 ml-3"
                  height="20px"
                  width="30%"
                  inline
                />

                <Skeleton
                  count={6}
                  borderRadius={10}
                  height="60px"
                  inline
                  containerClassName="flex flex-col space-y-2"
                />
              </div>
            </div>
          )}
        </div>
      </Page>
      <FooterMenu />
    </>
  );
};

export default LibraryPage;
