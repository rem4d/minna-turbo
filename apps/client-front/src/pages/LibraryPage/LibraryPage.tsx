import { type FC } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { api } from "@/utils/api";

export const LibraryPage: FC = () => {
  const { data: list } = api.member.suggestedVocabulariesList.useQuery();

  return (
    <Page>
      <div className="flex flex-col space-y-8 px-4">
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
      </div>
    </Page>
  );
};

export default LibraryPage;
