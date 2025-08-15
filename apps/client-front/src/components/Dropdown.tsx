import type { PropsWithChildren } from "react";
import { useState } from "react";
// import DropdownDotsIcon from "@/assets/icons/dropdown-dots.svg?react";
import SettingsIcon from "@/assets/icons/settings2.svg?react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { sleep } from "@rem4d/utils";
import { AnimatePresence, motion as m, useAnimation } from "motion/react";
import { twMerge } from "tailwind-merge";

export interface DropdownItem {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  items: DropdownItem[];
  onOpen?: () => void;
}

export default function Dropdown({ items, onOpen }: Props) {
  const [open, setOpen] = useState(false);

  const controls = useAnimation();

  async function closeMenu() {
    await controls.start("closed");
    setOpen(false);
  }

  const onOpenChange = (o: boolean) => {
    if (o) {
      onOpen?.();
    }
    setOpen(o);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger className="z-0 inline-flex size-[24px] cursor-pointer items-center justify-center whitespace-nowrap select-none focus-visible:outline-none">
        {/* <DropdownDotsIcon className="stroke-rolling-stone" /> */}
        <SettingsIcon className="stroke-rolling-stone absolute" />
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              align="start"
              className="bg-athens-gray mt-1 origin-top-left overflow-hidden rounded-xl border text-left shadow-xl"
              asChild
            >
              <m.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  ease: "easeOut",
                  duration: 0.15,
                }}
              >
                {items.map((item, index) => (
                  <Item
                    closeMenu={closeMenu}
                    key={`${item.title}-${index}`}
                    className={twMerge(
                      index === items.length - 1 && "border-none",
                      item.disabled && "pointer-events-none opacity-50",
                    )}
                    onSelect={item.onClick}
                  >
                    {item.title}
                  </Item>
                ))}
              </m.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

function Item({
  children,
  onSelect = () => {},
  closeMenu,
  className,
}: PropsWithChildren<{
  closeMenu: () => void;
  className: string;
  onSelect?: () => void;
}>) {
  const controls = useAnimation();

  const itemClassName =
    "relative border-b flex cursor-default select-none items-center px-4 py-2.5 text-base outline-none transition-colors focus:bg-black/10";

  return (
    <DropdownMenu.Item
      onSelect={async (e) => {
        e.preventDefault();

        await controls.start({
          backgroundColor: "#ccc",
          transition: { duration: 0.04 },
        });
        await sleep(0.075);

        closeMenu();
        onSelect();
      }}
      className={twMerge(itemClassName, className)}
      asChild
    >
      <m.div animate={controls}>{children}</m.div>
    </DropdownMenu.Item>
  );
}
