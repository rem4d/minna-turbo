import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useStackNavContext } from "@/context/stackNavContext";
import { backButton } from "@/utils/tgUtils";
import { twMerge } from "tailwind-merge";

interface PageProps {
  back?: boolean;
  className?: string;
  maxOffset?: boolean;
}

export function Page({
  children,
  className = "",
  back = false,
  maxOffset = false,
}: PropsWithChildren<PageProps>) {
  const { pop } = useStackNavContext();

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        pop();
      });
    } else {
      backButton.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [back]);

  return (
    <div
      className={twMerge(
        "bg-athens-gray h-full overflow-x-hidden overflow-y-auto",
        !maxOffset && "pt-(--tg-top)",
        maxOffset && "pt-(--page-offset-top-full)",
        className,
      )}
    >
      {children}
    </div>
  );
}
