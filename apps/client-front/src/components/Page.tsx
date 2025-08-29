import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useStackNavContext } from "@/context/stackNavContext";
import { backButton } from "@/utils/tgUtils";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface PageProps {
  back?: boolean;
  className?: string;
  maxOffset?: boolean;
  useRouter?: boolean;
  to?: string;
}

export function Page({
  children,
  className = "",
  back = false,
  maxOffset = false,
  useRouter = false,
  to = "/",
}: PropsWithChildren<PageProps>) {
  const { pop } = useStackNavContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        if (useRouter) {
          navigate(to);
        } else {
          pop();
        }
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
