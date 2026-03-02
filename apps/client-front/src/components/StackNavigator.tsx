import { useCallback, useLayoutEffect, useRef } from "react";
import { useRouter } from "@/router/router";
import { useMotionValue } from "motion/react";

export default function StackNavigator() {
  const { canGoBack, currentScreen, previousScreen, isPending } = useRouter();
  const isNavigationDone = !isPending;

  const dragX = useMotionValue(0);

  const gestureStarted = useRef(false);
  const containerRef = useRef(null);

  // eslint-disable-next-line
  const handleTouchEnd = useCallback(() => {
    if (!gestureStarted.current || !canGoBack) return;

    gestureStarted.current = false;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragX, gestureStarted, canGoBack, previousScreen?.url]);

  useLayoutEffect(() => {
    if (isNavigationDone) {
      dragX.set(0);
    }
  }, [isNavigationDone, dragX]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {currentScreen && (
        <div className="current absolute top-0 right-0 bottom-0 left-0 flex h-full flex-col">
          <div className="h-full w-full">
            <currentScreen.element />
          </div>
        </div>
      )}
    </div>
  );
}
