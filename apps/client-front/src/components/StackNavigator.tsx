import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  unstable_ViewTransition as ViewTransition,
} from "react";
import { IsHiddenScreenContext } from "@/context/isHiddenScreenContext";
import { useRouter } from "@/router/router";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

export default function StackNavigator() {
  const { canGoBack, currentScreen, previousScreen, navigateBack, isPending } =
    useRouter();
  const isNavigationDone = !isPending;

  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [0, 300], [0, 1]);

  const previousScreenTransform = useTransform(
    dragProgress,
    [0, 0.005, 1],
    ["translateX(0)", "translateX(-30%)", "translateX(0%)"],
  );

  const currentOverlayOpacity = useTransform(dragProgress, [0, 1], [0.2, 0]);

  const touchStartX = useRef(0);
  const gestureStarted = useRef(false);
  const containerRef = useRef(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!canGoBack) return;

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;

    // Only start gesture from left edge (first 20px)
    if (touch.clientX <= 20) {
      gestureStarted.current = true;
      dragX.set(0);
    }
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!gestureStarted.current || !canGoBack) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;

      // Only allow rightward swipes
      if (deltaX > 0) {
        // Update the drag position in real-time
        dragX.set(Math.min(deltaX, window.innerWidth * 0.8));
      }
    },
    [canGoBack, gestureStarted, dragX],
  );

  const handleTouchEnd = useCallback(() => {
    if (!gestureStarted.current || !canGoBack) return;

    const currentDragX = dragX.get();
    const threshold = window.innerWidth * 0.3;
    const velocity = dragX.getVelocity();

    gestureStarted.current = false;

    if (currentDragX > threshold || velocity > 500) {
      // Complete the gesture - animate to full width then pop
      animate(dragX, window.innerWidth, {
        type: "tween",
        stiffness: 300,
        duration: 0.3,
        onComplete: () => {
          navigateBack({
            animationStyle: "disabled",
          });
        },
      });
    } else {
      animate(dragX, 0, {
        type: "tween",
        stiffness: 300,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragX, gestureStarted, canGoBack, previousScreen?.url]);

  useLayoutEffect(() => {
    if (isNavigationDone) {
      dragX.set(0);
    }
  }, [isNavigationDone, dragX]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {canGoBack && previousScreen && (
        <motion.div
          key="prev"
          className="previous absolute top-0 right-0 bottom-0 left-0 flex h-full flex-col"
          style={{
            zIndex: 0,
            transform: previousScreenTransform,
          }}
        >
          <div className="h-full w-full">
            <motion.div
              className="absolute h-full w-full bg-black"
              style={{
                opacity: currentOverlayOpacity,
                zIndex: 15,
              }}
            />
            <IsHiddenScreenContext value={true}>
              <previousScreen.element />
            </IsHiddenScreenContext>
          </div>
        </motion.div>
      )}

      {currentScreen && (
        <motion.div
          key="current"
          className="current absolute top-0 right-0 bottom-0 left-0 flex h-full flex-col"
          style={{
            zIndex: 1,
            x: canGoBack ? dragX : 0,
          }}
        >
          <div className="h-full w-full">
            <IsHiddenScreenContext value={false}>
              <ViewTransition update="none">
                <currentScreen.element />
              </ViewTransition>
            </IsHiddenScreenContext>
          </div>
        </motion.div>
      )}
    </div>
  );
}
