import type { FC } from "react";
import StarIcon from "@/assets/icons/star.svg?react";
import { List, ListItem } from "@/components/List";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { useTranslation } from "react-i18next";

export const SettingsPage: FC = () => {
  const { t } = useTranslation();

  return (
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
      </div>
    </Page>
  );
};

export default SettingsPage;
