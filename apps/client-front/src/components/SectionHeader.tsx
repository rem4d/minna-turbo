import type { FC } from "react";
import type { PropsWithChildren } from "react";

export const SectionHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="font-inter mt-2 mb-6 flex justify-center text-lg font-semibold text-black">
      {children}
    </div>
  );
};

export default SectionHeader;
