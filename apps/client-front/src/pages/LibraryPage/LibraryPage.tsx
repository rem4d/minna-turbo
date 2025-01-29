import { List, ListItem } from "@/components/List";
import { type FC } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";

export const LibraryPage: FC = () => {
  const levels = Array(48)
    .fill(null)
    .map((_, i) => i + 1);
  return (
    <div className="h-screen overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col space-y-8 px-4 mb-[100px] mt-[20px]">
        <List title="Кандзи">
          <ListItem
            title="Смотреть все"
            icon={<KanjiIcon className="size-[20px]" />}
            to="/library/all-kanji"
          />
        </List>
        <List title="Рекомендованные словари">
          {levels.map((level, index) => (
            <ListItem
              key={`level-${level}`}
              title={`Уровень ${level}`}
              sub="57 слов"
              to={`/library/dict/${level}`}
              showBorder={index < levels.length - 1}
            />
          ))}
        </List>
      </div>
    </div>
  );
};

export default LibraryPage;
