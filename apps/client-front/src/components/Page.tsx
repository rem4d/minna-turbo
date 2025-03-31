/* eslint-disable */
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface PageProps {
  back?: boolean;
  footer?: boolean;
  className?: string;
  maxOffset?: boolean;
}

export function Page({
  children,
  className = "",
  back = false,
  // footer = false,
  maxOffset = false,
}: PropsWithChildren<PageProps>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        navigate(-1);
      });
    }
    backButton.hide();
  }, [back]);

  return (
    <div
      id="page"
      className={twMerge(
        "h-full overflow-x-hidden overflow-y-auto",
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
