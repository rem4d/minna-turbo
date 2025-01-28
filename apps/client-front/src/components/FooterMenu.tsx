import { type ReactElement, type FC } from "react";
import { NavLink, useMatch } from "react-router-dom";
import { twJoin, twMerge } from "tailwind-merge";
import HomeIcon from "@/assets/icons/home.svg?react";
import LibraryIcon from "@/assets/icons/book.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";

export function FooterMenu(): ReactElement {
  return (
    <div
      className={twJoin(
        "h-[87px] w-full absolute z-[40] bottom-0",
        "border-t border-mercury bg-wildSand/90 backdrop-blur-lg",
        "flex animate-jump items-center justify-between divide-x overflow-hidden",
        "animate-once ",
      )}
    >
      <Item
        to="/"
        title="Главная"
        icon={<HomeIcon className="size-[20px] fill-current" />}
      />
      <Item
        to="/library"
        title="Библиотека"
        icon={<LibraryIcon className="size-[20px] fill-current" />}
      />
      <Item
        to="/settings"
        title="Настройки"
        icon={<SettingsIcon className="size-[22px] fill-current" />}
      />
    </div>
  );
}

interface ItemProps {
  to: string;
  title: string;
  icon: ReactElement;
}

const Item: FC<ItemProps> = ({ to, title, icon }) => {
  const libraryMatch = useMatch(to);
  const navLinkCn = `
flex w-1/3 relative h-full cursor-pointer flex-col items-center pt-3
text-[11px] font-unbounded font-normal text-grayChateau
`;
  return (
    <NavLink
      to={to}
      className={twMerge(navLinkCn, libraryMatch && "text-pacificBlue")}
    >
      {icon}
      <span className="mt-1">{title}</span>
    </NavLink>
  );
};
