import { useEffect, useRef, useState } from "react";
import { useStackNavContext } from "@/context/stackNavContext";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";

export default function StackNavigator() {
  const { pop, len, direction, currentScreen, previousScreen } =
    useStackNavContext();

  const canGoBack = len > 1;

  const [isGestureActive, setIsGestureActive] = useState(false);

  // Motion values for interactive gesture
  const dragX = useMotionValue(0);
  const opac = useMotionValue(1);
  const [show, setShow] = useState(true);
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

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setShow(true);
        opac.set(1);
      }, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

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
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!gestureStarted.current || !canGoBack) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;

    // Only allow rightward swipes
    if (deltaX > 0) {
      // e.preventDefault();

      // Update the drag position in real-time
      // console.log("Update the drag position in real-time");
      dragX.set(Math.min(deltaX, window.innerWidth * 0.8));
    }
  };

  const handleTouchEnd = () => {
    if (!gestureStarted.current || !canGoBack) return;

    const currentDragX = dragX.get();
    const threshold = window.innerWidth * 0.3;
    const velocity = dragX.getVelocity();

    gestureStarted.current = false;

    if (currentDragX > threshold || velocity > 500) {
      // Complete the gesture - animate to full width then pop
      animate(dragX, window.innerWidth, {
        // type: "spring",
        // stiffness: 400,
        // damping: 30,
        type: "tween",
        stiffness: 300,
        // duration: 0.3,
        onComplete: () => {
          opac.set(0);
          setShow(false);
          setTimeout(() => {
            setIsGestureActive(false);
            pop();
            dragX.set(0);
          }, 1);
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
  };

  // Animation variants for screen transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      zIndex: 1, // comment it as temp workaround, have to fix Drawer z index
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? "100%" : "-30%",
        opacity: 1,
        // opacity: direction < 0 ? 1 : 0.8,
      };
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Previous screen - always rendered when there's a back stack */}
      {canGoBack && previousScreen && (
        <motion.div
          className="previous absolute top-0 right-0 bottom-0 left-0 z-0 flex h-full flex-col"
          style={{
            zIndex: 0,
            transform: previousScreenTransform,
          }}
        >
          <div className="h-full w-full">
            <previousScreen.component />
          </div>
        </motion.div>
      )}

      {/* Current screen with gesture support */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentScreen.key}
          custom={direction}
          variants={slideVariants}
          initial={show ? "enter" : undefined}
          animate={show ? "center" : undefined}
          exit={show ? "exit" : undefined}
          transition={{
            type: "tween",
            stiffness: 300,
            duration: 0.3,
          }}
          className="absolute top-0 right-0 bottom-0 left-0 z-0 flex h-full flex-col"
          style={{
            // zIndex: 1,
            opacity: isGestureActive ? opac : 1,
            x: isGestureActive ? dragX : 0,
            boxShadow: isGestureActive
              ? currentScreenShadow
              : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          <div className="h-full w-full">
            <currentScreen.component />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
