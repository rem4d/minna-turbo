import type { Sentence } from "@rem4d/db";
import type { FC } from "react";
import { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { SentenceViewer } from "@/components/SentenceViewer";
import SentenceNavButtons from "@/components/SentenceViewer/SentenceNavButtons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

export const FavouriteSentencesPage: FC = () => {
  const [favorites, setFavorites] = useLocalStorage<Sentence[]>(
    "kic:favorites",
    [],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const showId = false;

  const sentence = favorites[activeIndex];
  const { t } = useTranslation();

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
    <Page back>
      <div className="relative flex flex-col space-y-8 px-4 pb-(--footer-height)">
        <SectionHeader>{t("fav_sentences")}</SectionHeader>
        <List title={t("")}>
          {favorites.map((fav, index) => (
            <ListItem
              right="remove"
              key={`f-${index}`}
              sub={showId ? `${fav.id}` : null}
              title={fav.text}
              onRightIconClick={() => remove(fav.id)}
              onClick={() => onItemClick(fav.id)}
              showBorder={index < favorites.length - 1}
            />
          ))}
        </List>
      </div>
      <Drawer
        open={modalOpen}
        onOpenChange={setModalOpen}
        noContainer
        contentClassName="pb-0"
      >
        <div className="bg-super-silver relative flex h-[80vh] flex-col">
          <SentenceNavButtons
            disablePrevNav={activeIndex === 0}
            disableNextNav={disableNextNav}
            handleNextClick={handleNextClick}
            handlePrevClick={handlePrevClick}
          />
          <SentenceViewer sentence={sentence} />
        </div>
      </Drawer>
    </Page>
  );
};

export default FavouriteSentencesPage;
