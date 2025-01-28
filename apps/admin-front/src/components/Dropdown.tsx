import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DropdownDotsIcon from "@/assets/icons/dropdown-dots.svg?react";

interface Props {
  onShowFuriganaClick(): void;
}

export default function Dropdown({ onShowFuriganaClick }: Props) {
  const itemClassName =
    "relative flex cursor-default select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors focus:bg-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex absolute z-10 top-2 right-2 items-center justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-black/30">
        <DropdownDotsIcon className="fill-current transform rotate-90" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="DropdownMenuContent z-50 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-slate-800 shadow-xl shadow-black/[.08] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          align="end"
          sideOffset={12}
        >
          <DropdownMenu.Item
            onClick={onShowFuriganaClick}
            className={itemClassName}
          >
            Show furigana
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClassName}>
            Don't show it again
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
