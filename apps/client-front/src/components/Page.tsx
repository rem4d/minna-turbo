/// <reference types="react/experimental" />
import type { PropsWithChildren } from "react";
import { useEffect, unstable_ViewTransition as ViewTransition } from "react";
import { useRouter } from "@/router/router";
import { backButton } from "@/utils/tgUtils";
import { twMerge } from "tailwind-merge";

interface PageProps {
  back?: boolean;
  className?: string;
  maxOffset?: boolean;
  to?: string;
}

export function Page({
  children,
  className = "",
  back = false,
  maxOffset = false,
  to = "/",
}: PropsWithChildren<PageProps>) {
  const { direction, navigateBack, animationStyle } = useRouter();

  useEffect(() => {
    let offClick: ReturnType<typeof backButton.onClick>;

    if (back && backButton.isAvailable()) {
      backButton.show();
      offClick = backButton.onClick(() => {
        void navigateBack(to, { animationStyle: "slide" });
      });
    } else {
      backButton.hide();
    }

    return () => {
      offClick?.();
    };
  }, [back]);

  let enter = "default";
  let exit = "default";

  if (animationStyle === "slide") {
    enter = direction === 1 ? "slide-in" : "slide-in-back";
    exit = direction === 1 ? "slide-out" : "slide-out-back";
  } else if (animationStyle === "freeze") {
    enter = "freeze-in";
  }

  return (
    <ViewTransition default="none" enter={enter} exit={exit}>
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
    </ViewTransition>
  );
}
