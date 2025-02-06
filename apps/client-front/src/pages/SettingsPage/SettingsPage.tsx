import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useCallback } from "react";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { useLocalStorage } from "usehooks-ts";

export const SettingsPage: FC = () => {
  const [favorites, setFavorites] = useLocalStorage<Sentence[]>(
    "kic:favorites",
    [],
  );

  const remove = useCallback(
    (id: number) => {
      console.log(id);
      const index = favorites.findIndex((e) => e.id === id);
      if (index !== -1) {
        setFavorites(favorites.toSpliced(index, 1));
      }
    },
    [favorites, setFavorites],
  );

  return (
    <Page footer>
      <div className="flex flex-col space-y-8 px-4">
        <SectionHeader>Настройки</SectionHeader>
        <List title="Фразы">
          {favorites.map((fav, index) => (
            <ListItem
              iconRight="remove"
              key={`f-${index}`}
              sub={`${fav.id}`}
              title={fav.text}
              onRightIconClick={() => remove(fav.id)}
              showBorder={index < favorites.length - 1}
            />
          ))}
        </List>
      </div>
    </Page>
  );
};

export default SettingsPage;
