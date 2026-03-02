import Cross2Icon from "@/assets/icons/close.svg?react";
import { twMerge } from "tailwind-merge";
import { Drawer } from "vaul";

interface Props {
  className?: string;
  onClick?: () => void;
  title?: string;
}

export default function GrabberAndCloseButton({
  className,
  title,
  onClick,
}: Props) {
  return (
    <div
      className={twMerge(
        "sticky top-0 z-10 flex w-full items-center justify-between bg-white p-4",
        className,
      )}
      onClick={() => onClick?.()}
    >
      <Drawer.Title className="font-semibold text-black">{title}</Drawer.Title>
      <Drawer.Close className="relative flex size-7 items-center justify-center">
        <Cross2Icon className="h-full w-full" />
      </Drawer.Close>
      {/* <div className="absolute top-2 left-1/2 h-1.5 w-12 shrink-0 -translate-x-1/2 rounded-full bg-gray-300" /> */}
    </div>
  );
}
