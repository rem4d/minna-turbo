import { type FC } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { api } from "@/utils/api";
import Skeleton from "react-loading-skeleton";

export const LibraryPage: FC = () => {
  const { data: list, isLoading } =
    api.member.suggestedVocabulariesList.useQuery();

  return (
    <Page>
      <div className="relative flex flex-col space-y-8 px-4 pb-(--footer-height)">
        {!isLoading && (
          <>
            <SectionHeader>Библиотека</SectionHeader>
            <List title="Кандзи">
              <ListItem
                title="Смотреть все"
                icon={<KanjiIcon className="size-[20px]" />}
                to="/library/all-kanji"
              />
            </List>
            <List title="Рекомендованные словари">
              {list?.map((data, i) => (
                <ListItem
                  key={`level-${data.level_from}`}
                  title={`Уровень ${i + 1}`}
                  sub={`${data.cnt} слов`}
                  to={`/library/dict/${i + 1}`}
                  showBorder={i < list.length - 1}
                />
              ))}
            </List>
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
  );
};

export default LibraryPage;
