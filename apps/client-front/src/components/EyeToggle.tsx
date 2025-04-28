import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg?react";

export const EyeToggle = ({
  onClick,
  show,
}: {
  show: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      {show ? (
        <EyeOpenIcon className="size-[24px] text-black/50" />
      ) : (
        <EyeClosedIcon className="size-[24px] text-black/50" />
      )}
    </div>
  );
};
