import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { SentenceViewer } from "@/components/SentenceViewer";
import { useLocalStorage } from "@uidotdev/usehooks";

export const SettingsPage: FC = () => {
  const [favorites, setFavorites] = useLocalStorage<Sentence[]>(
    "kic:favorites",
    [],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const sentence = favorites[activeIndex];
  console.log(sentence);

  const remove = useCallback(
    (id: number) => {
      const index = favorites.findIndex((e) => e.id === id);
      if (index !== -1) {
        setFavorites(favorites.toSpliced(index, 1));
      }
    },
    [favorites, setFavorites],
  );

  const onItemClick = useCallback(
    (id: number) => {
      const index = favorites.findIndex((e) => e.id === id);
      if (index === -1) {
        return;
      }
      setModalOpen(true);
      setActiveIndex(index);
    },
    [favorites],
  );

  const handlePrevClick = () => {
    setActiveIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex + 1);
  };
  const disableNextNav =
    activeIndex === favorites.length - 1 || favorites.length === 0;

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
              onClick={() => onItemClick(fav.id)}
              showBorder={index < favorites.length - 1}
            />
          ))}
        </List>
      </div>
      <Drawer open={modalOpen} onOpenChange={setModalOpen} noContainer>
        <div className="bg-super-silver relative flex h-[90vh] flex-col">
          <SentenceViewer
            sentence={sentence}
            disableNextNav={disableNextNav}
            disablePrevNav={activeIndex === 0}
            onNextClick={handleNextClick}
            onPrevClick={handlePrevClick}
          />
        </div>
      </Drawer>
    </Page>
  );
};

export default SettingsPage;
