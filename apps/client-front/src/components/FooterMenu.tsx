import { type FC, type ReactElement } from "react";
import LibraryIcon from "@/assets/icons/book.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import { paths } from "@/routes";
import { useTranslation } from "react-i18next";
import { NavLink, useMatch } from "react-router-dom";
import { twJoin, twMerge } from "tailwind-merge";

export function FooterMenu(): ReactElement {
  const homeMatch = useMatch(paths.home);
  const libraryMatch = useMatch(paths.library);
  const dictMatch = useMatch(paths.dict);
  const allKanjiMatch = useMatch(paths.allKanji);
  const settingsMatch = useMatch(paths.settings);
  const sentencesMatch = useMatch(paths.sentences);
  const flashcardsMatch = useMatch(paths.flashcards);
  const favouritesMatch = useMatch(paths.favouriteSentences);
  const { t } = useTranslation();

  const hideFooter =
    Boolean(dictMatch) ||
    Boolean(sentencesMatch) ||
    Boolean(flashcardsMatch) ||
    Boolean(allKanjiMatch);

  if (hideFooter) {
    return <></>;
  }

  return (
    <div
      className={twJoin(
        "absolute bottom-0 h-[87px] w-full",
        "border-mercury bg-wild-sand border-t",
        // "border-mercury bg-wild-sand/85 border-t backdrop-blur-[20px]",
        "animate-jump flex items-center justify-between divide-x overflow-hidden",
        "animate-once",
      )}
    >
      <Item
        to={paths.home}
        title={t("home")}
        icon={<HomeIcon className="size-[20px] fill-current" />}
        active={Boolean(homeMatch)}
      />
      <Item
        to={paths.library}
        title={t("library")}
        icon={<LibraryIcon className="size-[20px] fill-current" />}
        active={Boolean(libraryMatch) || Boolean(dictMatch)}
      />
      <Item
        to="/nav"
        title={t("settings")}
        icon={<SettingsIcon className="size-[22px] fill-current" />}
        active={Boolean(settingsMatch) || Boolean(favouritesMatch)}
      />
    </div>
  );
}

interface ItemProps {
  to: string;
  title: string;
  icon: ReactElement;
  active: boolean;
}

const Item: FC<ItemProps> = ({ to, title, icon, active }) => {
  const navLinkCn = `
flex w-1/3 relative h-full cursor-pointer flex-col items-center pt-3
text-[11px] font-unbounded font-normal text-gray-chateau
`;
  return (
    <NavLink
      to={to}
      className={twMerge(navLinkCn, active && "text-mine-shaft")}
    >
      {icon}
      <span className="mt-1">{title}</span>
    </NavLink>
  );
};
