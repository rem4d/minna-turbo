import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { backButton } from "@/utils/tgUtils";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface PageProps {
  footer?: boolean;
  className?: string;
  maxOffset?: boolean;
  backTo?: string;
}

export function Page({
  children,
  backTo,
  className = "",
  // footer = false,
  maxOffset = false,
}: PropsWithChildren<PageProps>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (backTo) {
      backButton.show();
      return backButton.onClick(() => {
        void navigate(backTo);
      });
    }
    backButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backTo]);

  return (
    <div
      className={twMerge(
        "bg-athens-gray h-full overflow-x-hidden overflow-y-auto",
        !maxOffset && "pt-(--tg-top)",
        maxOffset && "pt-(--page-offset-top-full)",
        // footer && "h-[calc(100%-var(--footer-height))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
