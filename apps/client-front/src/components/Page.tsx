/* eslint-disable */
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface PageProps {
  back?: boolean;
  footer?: boolean;
  sa?: "content" | "notch";
}

export function Page({
  children,
  back = false,
  footer = false,
  sa = "content",
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
      className={twMerge(
        "h-full overflow-x-hidden overflow-y-auto",
        footer && "h-[calc(100%-100px)]",
        sa === "content" && "pt-(--tg-viewport-content-safe-area-inset-top)",
        sa === "notch" && "pt-(--tg-viewport-safe-area-inset-top)",
      )}
    >
      {children}
    </div>
  );
}
