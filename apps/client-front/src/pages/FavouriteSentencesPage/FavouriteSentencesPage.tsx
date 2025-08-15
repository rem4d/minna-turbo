import type { Favourite } from "@/types";
import type { FC } from "react";
import { useCallback, useState } from "react";
import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { SentenceViewer } from "@/components/SentenceViewer";
import SentenceNavButtons from "@/components/SentenceViewer/SentenceNavButtons";
import { SpinnerBig } from "@/components/Spinner";
import { api } from "@/utils/api";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

export const FavouriteSentencesPage: FC = () => {
  const [favorites, setFavorites] = useLocalStorage<Favourite[]>(
    "kic:favorites",
    [],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const showId = false;
  const ids = favorites.map((f) => f.id);

  const { data: sentences, isLoading } = api.viewer.sentence.getByIds.useQuery(
    {
      ids,
    },
    // { enabled: ids && ids.length > 0 },
  );

  const sentence = sentences ? sentences[activeIndex] : undefined;
  const msg = favorites[activeIndex]?.msg;
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

  // const onRightIconClick = useCallback(
  //   (e: React.MouseEvent, id: number) => {},
  //   [],
  // );

  return (
    <Page back>
      <div className="relative flex h-full flex-col space-y-8 px-4 pb-(--footer-height)">
        <SectionHeader>{t("fav_sentences")}</SectionHeader>
        {isLoading ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <SpinnerBig />
          </div>
        ) : (
          <List title={t("")}>
            {sentences?.map((sen, index) => (
              <ListItem
                right="remove"
                key={`s-${index}`}
                sub={showId ? `${sen.id}` : null}
                title={sen.text}
                onRightIconClick={(e) => {
                  e.stopPropagation();
                  remove(sen.id);
                }}
                onClick={() => onItemClick(sen.id)}
                showBorder={index < sentences.length - 1}
              />
            ))}
          </List>
        )}
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
          <SentenceViewer msg={msg} sentence={sentence} />
        </div>
      </Drawer>
    </Page>
  );
};

export default FavouriteSentencesPage;
