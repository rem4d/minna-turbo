import { type FC } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import { api } from "@/utils/api";

export const LibraryPage: FC = () => {
  const { data: list } = api.member.suggestedVocabulariesList.useQuery();

  return (
    <Page back={false}>
      <div className="h-screen overflow-y-auto overflow-x-hidden">
        <div className="mb-[100px] mt-[20px] flex flex-col space-y-8 px-4">
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
