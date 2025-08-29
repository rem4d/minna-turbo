import type { FC } from "react";
import { useEffect, useState } from "react";
import LangIcon from "@/assets/icons/lang.svg?react";
import RadioCheckedIcon from "@/assets/icons/radio-checked.svg?react";
import RadioEmptyIcon from "@/assets/icons/radio-empty.svg?react";
import StarIcon from "@/assets/icons/star.svg?react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { FooterMenu } from "@/components/FooterMenu";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

export const SettingsPage: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { i18n } = useTranslation();

  const [transLang, setTransLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );

  const [selectedLang, setSelectedLang] = useState<"ru" | "en" | null>(
    transLang,
  );

  const { t } = useTranslation();

  useEffect(() => {
    setSelectedLang(transLang);
  }, [transLang]);

  useEffect(() => {
    if (transLang === null) {
      if (i18n.language === "en" || i18n.language === "ru") {
        setTransLang(i18n.language);
      }
    }
  }, [i18n.language, setTransLang, transLang]);

  const onModalOpenChange = () => {
    setModalOpen(false);
  };

  const onSubmit = () => {
    setTransLang(selectedLang);
    setModalOpen(false);
  };

  return (
    <>
      <Page>
        <div className="relative flex flex-col space-y-8 px-4 pb-(--footer-height)">
          <SectionHeader>{t("settings")}</SectionHeader>
          <List title={t("sentences")}>
            <ListItem
              title={t("fav_sentences")}
              icon={<StarIcon className="size-[20px]" />}
              to="/settings/fav-sentences"
              right="arrow"
            />
          </List>
          <List title={t("translation_language")}>
            <ListItem
              title={convert(transLang)}
              icon={<LangIcon className="size-[22px]" />}
              right="change"
              onRightIconClick={() => setModalOpen(true)}
            />
          </List>
        </div>
        <Drawer open={modalOpen} onOpenChange={onModalOpenChange} noContainer>
          <div className="flex h-[50vh] max-h-[50vh] flex-col justify-between px-4 pb-6">
            <div className="">
              <List title="">
                <ListItem
                  title="English"
                  icon={<RadioComponent selected={selectedLang === "en"} />}
                  showBorder
                  onClick={() => setSelectedLang("en")}
                />
                <ListItem
                  title="Русский"
                  icon={<RadioComponent selected={selectedLang === "ru"} />}
                  onClick={() => setSelectedLang("ru")}
                />
              </List>
            </div>
            <Button className="w-full" onClick={onSubmit}>
              {t("save")}
            </Button>
          </div>
        </Drawer>
      </Page>
      <FooterMenu />
    </>
  );
};

const RadioComponent = ({ selected }: { selected: boolean }) =>
  !selected ? (
    <RadioEmptyIcon className="size-[24px]" />
  ) : (
    <RadioCheckedIcon className="size-[24px]" />
  );

const convert = (lang: string | null) =>
  lang === "ru" ? "Русский" : "English";

export default SettingsPage;
