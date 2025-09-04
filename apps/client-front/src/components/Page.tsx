/// <reference types="react/experimental" />
import type { PropsWithChildren } from "react";
import { useEffect, unstable_ViewTransition as ViewTransition } from "react";
import { useIsNavPending, useRouter } from "@/router/router";
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
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        void navigateBack(to);
      });
    } else {
      backButton.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [back]);

  let enter = "default";
  let exit = "default";

  if (animationStyle === "slide") {
    enter = direction === 1 ? "slide-in" : "slide-in-back";
    exit = direction === 1 ? "slide-out" : "slide-out-back";
  }
  console.log(animationStyle);

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
