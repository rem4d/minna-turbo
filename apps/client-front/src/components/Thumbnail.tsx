import type { PropsWithChildren } from "react";
import { use } from "react";
import ViewTransition from "@/components/ViewTransition";
import { IsHiddenScreenContext } from "@/context/isHiddenScreenContext";
import { twMerge } from "tailwind-merge";

interface ThumbnailProps {
  title: string;
  level: number;
  onClick?: (id: number) => void;
  id: number;
  means: string;
  large?: boolean;
  hideMeaning?: boolean;
}

export default function Thumbnail({
  title,
  level,
  means,
  large = false,
  hideMeaning = false,
}: PropsWithChildren<ThumbnailProps>) {
  const removeName = use(IsHiddenScreenContext);
  const containerProps = !removeName ? { name: `thumb-${level}-${title}` } : {};

  return (
    <ViewTransition {...containerProps}>
      <div
        className={twMerge(
          "relative flex aspect-square cursor-pointer flex-col justify-center overflow-hidden rounded-md border border-black/10 bg-white px-1 py-2 shadow-[3px_3px_0px_rgba(41,41,41,0.1)]",
        )}
      >
        {!hideMeaning && (
          <div className="text-rolling-stone/70 absolute top-2 left-2 text-xs">
            {level}
          </div>
        )}
        <div className="flex flex-col space-y-1">
          <div
            className={twMerge(
              "font-digi text-center text-3xl text-black",
              large && "relative bottom-1 text-[4.0rem]",
            )}
          >
            {title}
          </div>
          {!hideMeaning && (
            <div
              className={twMerge(
                "truncate text-center text-xs whitespace-nowrap text-black",
                large && "relative bottom-1.5 text-[1.3rem]",
              )}
            >
              {means}
            </div>
          )}
        </div>
      </div>
    </ViewTransition>
  );
}
