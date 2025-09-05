import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@/router/router";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

export default React.memo(function StackNavigator() {
  const { canGoBack, currentScreen, previousScreen, screens, navigateBack } =
    useRouter();

  const [isGestureActive, setIsGestureActive] = useState(false);

  // Motion values for interactive gesture
  const dragX = useMotionValue(0);
  const opac = useMotionValue(1);
  const dragProgress = useTransform(dragX, [0, 300], [0, 1]);

  const previousScreenTransform = useTransform(
    dragProgress,
    [0, 1],
    ["translateX(-30%)", "translateX(0%)"],
  );

  const currentScreenShadow = useTransform(
    dragProgress,
    [0, 0.5, 1],
    [
      "0 0 0 rgba(0,0,0,0)",
      "-10px 0 30px rgba(0,0,0,0.1)",
      "-20px 0 40px rgba(0,0,0,0.2)",
    ],
  );

  // Refs for gesture tracking
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
      setIsGestureActive(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canGoBack, gestureStarted],
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
          navigateBack(previousScreen?.url ?? "/settings");
          setIsGestureActive(false);
          dragX.set(0);
          opac.set(0);

          setTimeout(() => {
            // pop();
          }, 0);
        },
      });
    } else {
      // Cancel the gesture - spring back to 0
      animate(dragX, 0, {
        type: "tween",
        stiffness: 300,
        onComplete: () => {
          setIsGestureActive(false);
        },
      });
    }
  }, [dragX, gestureStarted, canGoBack, opac]);
  console.log(screens);

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
          className="previous absolute top-0 right-0 bottom-0 left-0 z-0 flex h-full flex-col"
          style={{
            zIndex: 0,
            transform: previousScreenTransform,
          }}
        >
          <div className="h-full w-full">
            <previousScreen.element />
          </div>
        </motion.div>
      )}

      {currentScreen && (
        <motion.div
          className="current absolute top-0 right-0 bottom-0 left-0 z-0 flex h-full flex-col"
          style={{
            // opacity: isGestureActive ? opac : 1,
            x: isGestureActive ? dragX : 0,
            boxShadow: isGestureActive
              ? currentScreenShadow.get()
              : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          <div className="h-full w-full">
            <currentScreen.element />
          </div>
        </motion.div>
      )}
    </div>
  );
});
