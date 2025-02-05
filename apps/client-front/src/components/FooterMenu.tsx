import { type FC, type ReactElement } from "react";
import LibraryIcon from "@/assets/icons/book.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import { paths } from "@/routes";
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
        "absolute bottom-0 z-40 h-[87px] w-full",
        "border-mercury bg-wild-sand/85 border-t backdrop-blur-[20px]",
        "animate-jump flex items-center justify-between divide-x overflow-hidden",
        "animate-once",
      )}
    >
      <Item
        to={paths.home}
        title="Главная"
        icon={<HomeIcon className="size-[20px] fill-current" />}
        active={Boolean(homeMatch)}
      />
      <Item
        to={paths.library}
        title="Библиотека"
        icon={<LibraryIcon className="size-[20px] fill-current" />}
        active={Boolean(libraryMatch) || Boolean(dictMatch)}
      />
      <Item
        to={paths.settings}
        title="Настройки"
        icon={<SettingsIcon className="size-[22px] fill-current" />}
        active={Boolean(settingsMatch)}
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
      className={twMerge(navLinkCn, active && "text-pacific-blue")}
    >
      {icon}
      <span className="mt-1">{title}</span>
    </NavLink>
  );
};
