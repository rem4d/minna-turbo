import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";
import ViewTransition from "@/components/ViewTransition";
import { useRouter } from "@/router/router";
import { backButton } from "@/utils/tgUtils";
import { twMerge } from "tailwind-merge";

interface PageProps {
  className?: string;
  maxOffset?: boolean;
  backTo?: string;
  backAnimationStyle?: "nav-back" | "remove";
}

export function Page({
  children,
  className = "",
  maxOffset = false,
  backTo,
  backAnimationStyle = "nav-back",
}: PropsWithChildren<PageProps>) {
  const { navigateBack, animationStyle: routerAnimationStyle } = useRouter();
  const showNav = import.meta.env.DEV;

  const back = Boolean(backTo);

  useEffect(() => {
    let offClick: ReturnType<typeof backButton.onClick>;

    if (back && backButton.isAvailable()) {
      backButton.show();
      offClick = backButton.onClick(() => {
        void navigateBack(backTo!, { animationStyle: backAnimationStyle });
      });
    } else {
      backButton.hide();
    }

    return () => {
      offClick?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [back, backTo]);

  const vtProps: { enter?: any; exit?: any } = {};

  vtProps.enter = {
    "nav-forward": "slide-in",
    "nav-back": "slide-in-back",
    deeault: "default",
    disabled: "disabled",
  };
  vtProps.exit = {
    "nav-forward": "slide-out",
    "nav-back": "slide-out-back",
    default: "default",
    disabled: "disabled",
  };

  const props = routerAnimationStyle === "remove" ? {} : vtProps;

  const Container =
    routerAnimationStyle === "remove" ? React.Fragment : ViewTransition;

  return (
    <Container {...props}>
      {showNav && (
        <div className="absolute z-20 inline h-[40px] w-[40px] items-center bg-black/0">
          {back && (
            <div
              className="flex size-[40px] rotate-90 items-center justify-center"
              onClick={() =>
                navigateBack(backTo!, { animationStyle: backAnimationStyle })
              }
            >
              <IconBack />
            </div>
          )}
        </div>
      )}
      <div
        className={twMerge(
          "bg-athens-gray h-full overflow-x-hidden overflow-y-auto",
          !maxOffset && "pt-(--tg-top)",
          maxOffset && "pt-(--page-offset-top-full)",
          className,
        )}
      >
        <ViewTransition default="none">{children}</ViewTransition>
      </div>
    </Container>
  );
}

const IconBack = () => (
  <svg
    className="chevron-left"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
  >
    <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
        transform="translate(356.5 164.5)"
      />
      <polygon points="446 418 466 418 466 398 446 398" />
    </g>
  </svg>
);
