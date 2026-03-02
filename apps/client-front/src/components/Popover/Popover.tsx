import InfoIcon from "@/assets/icons/info.svg?react";
import * as Popover from "@radix-ui/react-popover";

import "./styles.css";

import { useCallback, useEffect, useRef, useState } from "react";

const Popover_ = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!triggerRef.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [handleTouchStart]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild ref={triggerRef} onClick={() => setOpen(true)}>
        <button>
          <InfoIcon className="size-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="PopoverContent w-[250px] rounded-md p-2"
          sideOffset={5}
          side="top"
        >
          <div className="text-xs text-black/90">{children}</div>
          {/* <Popover.Arrow className="PopoverArrow" /> */}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default Popover_;
