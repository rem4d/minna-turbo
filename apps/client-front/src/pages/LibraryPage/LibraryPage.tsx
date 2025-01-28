import { List, ListItem } from "@/components/List";
import { type FC } from "react";
import KanjiIcon from "@/assets/icons/kanji.svg?react";

export const LibraryPage: FC = () => {
  const levels = Array(48)
    .fill(null)
    .map((_, i) => i + 1);
  return (
    <div className="h-[calc(100vh-90px)] overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col space-y-8 px-4">
        <List title="Кандзи">
          <ListItem
            title="Все кандзи"
            icon={<KanjiIcon className="size-[20px]" />}
            to="/all-kanji"
          />
        </List>
        <List title="Рекомендованные словари">
          {levels.map((level, index) => (
            <ListItem
              key={`level-${level}`}
              title={`Уровень ${level}`}
              sub="57 слов"
              to={`/dict/${level}`}
              showBorder={index < levels.length - 1}
            />
          ))}
        </List>
      </div>
    </div>
  );
};

export default LibraryPage;
