import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { twMerge } from "tailwind-merge";

interface Props {
  disablePrevNav: boolean;
  disableNextNav: boolean;
  handlePrevClick: () => void;
  handleNextClick: () => void;
}
export default function SentenceNavButtons({
  disablePrevNav,
  disableNextNav,
  handlePrevClick,
  handleNextClick,
}: Props) {
  return (
    <div className="absolute top-[40%] flex w-full -translate-y-1/2 justify-between px-2">
      <div
        className={twMerge(
          "relative flex size-[30px] cursor-pointer items-center justify-center",
          disablePrevNav && "pointer-events-none opacity-40",
        )}
        onClick={handlePrevClick}
      >
        <ArrowIcon className="text-azure-radiance absolute size-[20px] rotate-90 fill-current" />
      </div>
      <div
        className={twMerge(
          "relative flex size-[30px] cursor-pointer items-center justify-center",
          disableNextNav && "pointer-events-none opacity-40",
        )}
        onClick={handleNextClick}
      >
        <ArrowIcon className="text-azure-radiance absolute size-[20px] -rotate-90 fill-current" />
      </div>
    </div>
  );
}
