import type { PropsWithChildren } from "react";
import React from "react";
import ViewTransition from "@/components/ViewTransition";
import { useRouter } from "@/router/router";
import { twMerge } from "tailwind-merge";

interface PageProps {
  className?: string;
  backTo?: string;
  backAnimationStyle?: "nav-back" | "remove";
}

export function Page({
  children,
  className = "",
  backTo,
  backAnimationStyle = "nav-back",
}: PropsWithChildren<PageProps>) {
  const { navigateBack, animationStyle: routerAnimationStyle } = useRouter();

  const back = Boolean(backTo);

  const vtProps: { enter?: object; exit?: object; default: string } = {
    default: "none",
  };

  vtProps.enter = {
    "nav-forward": "slide-in",
    "nav-back": "slide-in-back",
    default: "default",
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

  const handleNavBackClick = () => {
    navigateBack({ animationStyle: backAnimationStyle });
  };

  return (
    <Container {...props}>
      <div
        className={twMerge(
          "bg-athens-gray h-dvh overflow-x-hidden overflow-y-auto",
          className,
        )}
      >
        <div className="absolute top-2 left-2 z-1">
          {back && (
            <div
              className="flex w-[60px] cursor-pointer items-center justify-start rounded-2xl bg-black/25 px-2 py-2 backdrop-blur-xs"
              onClick={handleNavBackClick}
            >
              <div className="flex size-5 rotate-90 items-center justify-center">
                <IconBack />
              </div>
            </div>
          )}
        </div>
        <ViewTransition update="none">{children}</ViewTransition>
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
        fill="white"
        fillRule="nonzero"
        d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
        transform="translate(356.5 164.5)"
      />
      <polygon points="446 418 466 418 466 398 446 398" />
    </g>
  </svg>
);
