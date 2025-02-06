/* eslint-disable */
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export function Page({
  children,
  back = false,
  footer = false,
}: PropsWithChildren<{
  back?: boolean;
  footer?: boolean;
}>) {
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
        "mt-(--tg-viewport-content-safe-area-inset-top) h-screen overflow-x-hidden overflow-y-auto",
        footer && "h-[calc(100%-100px)]",
      )}
    >
      {children}
    </div>
  );
}
