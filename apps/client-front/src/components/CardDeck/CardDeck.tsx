import type { Kanji } from "@rem4d/db";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/icons/arrow-circle.svg?react";
import { getPosition } from "@/utils/event";
import { clamp } from "@rem4d/utils";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { twMerge } from "tailwind-merge";

import Card from "./Card";

interface CardDeckProps {
  total: number;
  cardList: Kanji[];
  onEvaluate?: (card: Kanji) => void;
}

interface InteractionStart {
  x: number;
  y: number;
  currentX: number;
  currentY: number;
  $card?: HTMLDivElement;
}

export function CardDeck({ cardList, total, onEvaluate }: CardDeckProps) {
  const interactionRef = useRef<InteractionStart>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(total > 0 ? total - 1 : 0);
    setLineProgress(0);
  }, [total]);

  const lp = useLaunchParams();
  const isMobile = !lp.platform.includes("desktop");

  // animation progress(-1 ~ 1)
  const [progress, setProgress] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);

  const handleStart = useCallback(
    (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    ) => {
      e.currentTarget.style.transition = "";
      const { x, y } = getPosition(e);

      interactionRef.current = {
        x,
        y,
        currentX: x,
        currentY: y,
        $card: e.currentTarget,
      };
    },
    [],
  );

  const handleMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      const { x, y } = getPosition(e);

      if (!interactionRef.current) {
        return;
      }
      interactionRef.current.currentX = x;
      interactionRef.current.currentY = y;

      const $card = interactionRef.current.$card;
      if (!$card) {
        return;
      }

      const dx = (x - interactionRef.current.x) * 0.8;
      const dy = (y - interactionRef.current.y) * 0.5;
      const deg = (dx / 600) * -30;

      $card.style.transform = `translate(${dx}px, ${dy}px) rotate(${deg}deg)`;

      const K = 70;
      const dxOffset = dx > 0 ? dx + K : dx - K;

      const newProgress = clamp(dxOffset / 100, -1, 1);

      const changedRight =
        Math.floor(Math.abs(newProgress)) === 1 &&
        Math.floor(Math.abs(progress)) === 0;
      const changedLeft =
        Math.floor(Math.abs(progress)) === 1 &&
        Math.floor(Math.abs(newProgress)) === 0;

      if (changedRight || changedLeft) {
        setProgress(newProgress);

        const inc = Math.abs(newProgress) === 1 ? 1 : 0;

        const lineProgress = Math.floor(
          (1 - (cardList.length - inc) / total) * 100,
        );
        setLineProgress(lineProgress);
      }
    },
    [cardList.length, total, progress],
  );

  const handleEnd = useCallback(() => {
    const $card = interactionRef.current?.$card;
    if (!$card) {
      return;
    }

    const isSelect = Math.abs(progress) === 1;
    const isGood = progress === 1;
    const [, currentXString] =
      /translate\(([^,]+), [^)]+\)/.exec($card.style.transform) ?? [];
    const [, currentYString] =
      /translate\([^,]+, ([^)]+)\)/.exec($card.style.transform) ?? [];
    const [, currentRotateString] =
      /rotate\(([^)]+)\)/.exec($card.style.transform) ?? [];

    const currentX = Number.parseInt(currentXString, 10);
    const currentY = Number.parseInt(currentYString, 10);
    const currentRotate = Number.parseInt(currentRotateString, 10);
    const dx = isGood
      ? window.innerWidth
      : (window.innerWidth + $card.getBoundingClientRect().width) * -1;

    $card.style.transition = "transform 0.3s ease-in-out";
    $card.style.transform = isSelect
      ? `translate(${currentX + dx}px, ${currentY}px) rotate(${currentRotate * 2}deg)`
      : "translate(0, 0) rotate(0deg)";

    interactionRef.current = null;
    setProgress(0);

    let K = 0;

    if (isSelect) {
      setActiveIndex((prev) => prev - 1);
      K = 1;
    }

    const lineProgress = (1 - (cardList.length - K) / total) * 100;
    setLineProgress(lineProgress);

    setTimeout(() => {
      if (isSelect) {
        const selectedCard = cardList[cardList.length - 1];

        if (cardList.length === 1) {
          setActiveIndex(total - 1);
        }

        onEvaluate?.(selectedCard);
      }
    }, 300);
  }, [cardList, onEvaluate, progress, total]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [handleMove, handleEnd]);

  const disablePrevNav = false;
  const disableNextNav = false;
  const handlePrevClick = () => {};
  const handleNextClick = () => {};

  return (
    <>
      <div className="relative h-[8px] w-full overflow-hidden rounded-full bg-white">
        <div
          className="absolute h-full rounded-tr-full rounded-br-full bg-black/30 transition-all"
          style={{
            width: `${lineProgress}%`,
          }}
        />
      </div>

      <div className="relative w-full">
        <div
          id="deck"
          className={twMerge(
            "absolute top-[calc(50vh/5)] h-[50vh] max-h-[500px] w-full",
            cardList.length === 0 && "hidden",
          )}
        >
          {cardList.map((c, index) => {
            const isActiveCard = index === activeIndex;
            const isLast = cardList.length - 1 === index;

            if (index < cardList.length - 3) {
              return null;
            }

            return (
              <div
                key={`card-${c.id}`}
                {...(isLast && {
                  onTouchStart: handleStart,
                  onMouseDown: handleStart,
                })}
                style={{
                  perspective: 1000,
                }}
              >
                <Card
                  k={c}
                  isActive={isActiveCard}
                  isInteracting={false}
                  index={cardList.length - 1 - index}
                  isMobile={isMobile}
                />
              </div>
            );
          })}
        </div>
      </div>
      <Arrows
        isMobile={isMobile}
        disableNextNav={disableNextNav}
        disablePrevNav={disablePrevNav}
        handleNextClick={handleNextClick}
        handlePrevClick={handlePrevClick}
      />
    </>
  );
}

interface ArrowProps {
  isMobile: boolean;
  disableNextNav: boolean;
  disablePrevNav: boolean;
  handleNextClick: () => void;
  handlePrevClick: () => void;
}

const Arrows: FC<ArrowProps> = ({
  isMobile,
  disableNextNav,
  disablePrevNav,
  handleNextClick,
  handlePrevClick,
}) => {
  return (
    <div
      className={twMerge(
        "absolute bottom-[80px] left-1/2 flex w-full -translate-x-1/2 justify-between",
        isMobile && "w-[80vw]",
        !isMobile && "w-[calc(320px+32px)]",
      )}
    >
      <div
        className={twMerge(
          "relative size-[32px] cursor-pointer",
          disablePrevNav && "pointer-events-none opacity-40",
        )}
        onClick={handlePrevClick}
      >
        <ArrowIcon className="text-azure-radiance absolute size-full -rotate-90 fill-current" />
      </div>
      <div
        className={twMerge(
          "relative size-[32px] cursor-pointer",
          disableNextNav && "pointer-events-none opacity-40",
        )}
        onClick={handleNextClick}
      >
        <ArrowIcon className="text-azure-radiance absolute size-full rotate-90 fill-current" />
      </div>
    </div>
  );
};
