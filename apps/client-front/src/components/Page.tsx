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
  const props = {};

  if (animationStyle === "slide") {
    enter = direction === 1 ? "slide-in" : "slide-in-back";
    exit = direction === 1 ? "slide-out" : "slide-out-back";
  } else if (animationStyle === "freeze") {
    enter = "freeze-in";
    // exit = "freeze-out";

    // props = { update: "none" };
  }

  return (
    <ViewTransition default="none" enter={enter} exit={exit} {...props}>
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
