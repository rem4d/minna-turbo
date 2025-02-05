import { type FC } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import { api } from "@/utils/api";

export const LibraryPage: FC = () => {
  const { data: list } = api.member.suggestedVocabulariesList.useQuery();

  return (
    <Page back={false}>
      <div className="mt-(--tg-viewport-content-safe-area-inset-top) h-[calc(100%-100px)] overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col space-y-8 px-4">
          <div className="font-inter mt-2 mb-6 flex justify-center text-lg font-semibold text-black">
            Библиотека
          </div>
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
        </div>
      </div>
    </Page>
  );
};

export default LibraryPage;
