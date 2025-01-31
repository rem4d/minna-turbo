import type { FC, FunctionComponent, ReactElement, SVGProps } from "react";
import InfoIcon from "@/assets/icons/info.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import { twMerge } from "tailwind-merge";

interface Props {
  middleText?: ReactElement | string;
}

export const TopSettings: FC<Props> = ({ middleText }) => {
  return (
    <div className="mt-3 flex items-center justify-between">
      <IconButton icon={InfoIcon} />
      {middleText ?? null}
      <IconButton icon={SettingsIcon} iconProps="fill-current text-white" />
    </div>
  );
};

interface IconButtonProps {
  // icon: ReactElement
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  iconProps?: string;
}

const IconButton: FC<IconButtonProps> = ({ icon, iconProps }) => {
  const Icon = icon;
  return (
    <div className="bg-scorpion/40 relative size-[32px] cursor-pointer rounded-full">
      <Icon
        className={twMerge(
          "absolute left-1/2 top-1/2 size-[20px] -translate-x-1/2 -translate-y-1/2",
          iconProps,
        )}
      />
    </div>
  );
};
