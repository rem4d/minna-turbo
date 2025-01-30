import type { FC, ReactElement, ReactNode } from "react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface ListProps {
  title: string;
  children?: ReactNode;
}

export const List: FC<ListProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col">
      <div className="text-jumbo mb-3 ml-4 text-[13px] uppercase leading-none">
        {title}
      </div>
      <div className="rounded-[10px] bg-white">{children ?? null}</div>
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
      className="flex h-[60px] w-full cursor-pointer items-center pl-[16px]"
      onClick={handleClick}
    >
      <div
        className={twMerge(
          "border-silver/60 flex flex-grow items-center justify-between px-0 py-[9px]",
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
        <div className="relative mr-[10px] size-[24px]">
          <ArrowIcon className="text-frenchGray absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 fill-current" />
        </div>
      </div>
    </div>
  );
};
