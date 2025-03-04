import type { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
}

export const SectionHeader: FC<PropsWithChildren<Props>> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={twMerge(
        "font-inter mt-2 mb-6 flex justify-center text-lg font-semibold text-black",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default SectionHeader;
