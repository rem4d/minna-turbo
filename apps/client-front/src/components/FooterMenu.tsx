import type { FC, ReactElement } from "react";
import LibraryIcon from "@/assets/icons/book.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import ViewTransition from "@/components/ViewTransition";
import { useRouter } from "@/router/router";
import { paths, routes } from "@/router/routes";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";

export function FooterMenu(): ReactElement {
  const homeMatch = useMatch(paths.home);
  const libraryMatch = useMatch(paths.library);
  const dictMatch = useMatch(paths.dict);
  const settingsMatch = useMatch(paths.settings);
  const favouritesMatch = useMatch(paths.favouriteSentences);
  const { t } = useTranslation();

  return (
    <ViewTransition
      default="none"
      update="none"
      exit="disabled"
      enter="disabled"
    >
      <div
        className={twJoin(
          "absolute bottom-0 h-[87px] w-full",
          "border-mercury bg-wild-sand z-10 border-t",
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
          to={paths.settings}
          title={t("settings")}
          icon={<SettingsIcon className="size-[22px] fill-current" />}
          active={Boolean(settingsMatch) || Boolean(favouritesMatch)}
        />
      </div>
    </ViewTransition>
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
  const { navigate } = useRouter();
  const onClick = () => {
    navigate(to, { animationStyle: "default", replace: true });
  };
  return (
    <div
      onClick={onClick}
      className={twMerge(navLinkCn, active && "text-mine-shaft")}
    >
      {icon}
      <span className="mt-1">{title}</span>
    </div>
  );
};

const useMatch = (path: string) => {
  const { url } = useRouter();
  const currentRoute = routes.find((route) => route.path === url);
  if (currentRoute) {
    return currentRoute.path === path;
  }
  return false;
};
