import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg?react";
import { twMerge } from "tailwind-merge";

export const EyeToggle = ({
  onClick,
  show,
  disabled,
}: {
  show: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "cursor-pointer",
        disabled && "pointer-events-none opacity-50",
      )}
      onClick={onClick}
    >
      {show ? (
        <EyeOpenIcon className="size-[24px] text-black/50" />
      ) : (
        <EyeClosedIcon className="size-[24px] text-black/50" />
      )}
    </div>
  );
};
