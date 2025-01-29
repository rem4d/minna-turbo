import type { FC, ReactNode } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { twMerge } from "tailwind-merge";

interface ListProps {
  title: string;
  children?: ReactNode;
}

export const List: FC<ListProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col">
      <div className="text-jumbo ml-4 uppercase mb-3 text-[13px] leading-none">
        {title}
      </div>
      <div className="bg-white rounded-[10px]">{children ?? null}</div>
    </div>
  );
};

interface ListItemProps {
  title: string;
  sub?: string;
  icon?: ReactElement;
  to: string;
  showBorder?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
  title,
  sub,
  icon,
  to,
  showBorder,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    void navigate(to);
  };
  return (
    <div
      className="h-[60px] pl-[16px] flex items-center w-full cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={twMerge(
          "py-[9px] items-center px-0 justify-between border-silver/60 flex flex-grow",
          showBorder && "border-b",
        )}
      >
        <div className="flex items-center space-x-[8px]">
          {icon ?? null}
          <div className="flex flex-col">
            <div className="text-[17px] leading-5">{title}</div>
            {sub && (
              <div className="text-jumbo text-[15px] leading-5">{sub}</div>
            )}
          </div>
        </div>
        <div className="relative size-[24px] mr-[10px]">
          <ArrowIcon className="absolute -rotate-90 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 fill-current text-frenchGray" />
        </div>
      </div>
    </div>
  );
};
