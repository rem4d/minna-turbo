import type { FC, ReactElement, ReactNode } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface ListProps {
  title: string;
  children?: ReactNode;
}

export const List: FC<ListProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col">
      <div className="text-jumbo mb-3 ml-4 text-[13px] leading-none uppercase">
        {title}
      </div>
      <div className="rounded-[10px] bg-white">{children ?? null}</div>
    </div>
  );
};

interface ListItemProps {
  title?: string;
  sub?: string;
  icon?: ReactElement;
  iconRight?: "arrow" | "remove" | ReactElement;
  to?: string;
  showBorder?: boolean;
  onClick?: () => void;
  onRightIconClick?: () => void;
}

export const ListItem: FC<ListItemProps> = ({
  title,
  sub,
  icon,
  to,
  showBorder,
  onRightIconClick,
  onClick,
  iconRight = null,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      void navigate(to);
    }
    onClick?.();
  };

  const iconRightElem = () => {
    switch (iconRight) {
      case "arrow":
        return (
          <div className="size-[24px]" onClick={() => onRightIconClick?.()}>
            <ArrowIcon className="text-french-gray absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 fill-current" />
          </div>
        );
      case "remove":
        return (
          <div className="size-[24px]" onClick={() => onRightIconClick?.()}>
            <RemoveIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        );
      default:
        return iconRight;
    }
  };

  return (
    <div
      className="flex h-[60px] w-[calc(100%-16px)] cursor-pointer items-center overflow-hidden pl-[16px]"
      onClick={handleClick}
    >
      <div
        className={twMerge(
          "border-silver/60 flex w-full grow items-center justify-between px-0 py-[9px]",
          showBorder && "border-b",
        )}
      >
        <div className="flex grow items-center space-x-[8px] overflow-hidden">
          {icon ?? null}
          <div className="flex w-full flex-col">
            <div className="w-full overflow-hidden text-[17px] leading-5 overflow-ellipsis whitespace-nowrap">
              {title}
            </div>
            {sub && (
              <div className="text-jumbo text-[15px] leading-5">{sub}</div>
            )}
          </div>
        </div>
        <div className="relative mr-[10px]">{iconRightElem()}</div>
      </div>
    </div>
  );
};
