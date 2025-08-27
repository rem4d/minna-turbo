import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, spring } from "motion";

import "./StackNavigator.css";

interface NavigationAPI {
  push: (ScreenComponent: React.ComponentType<any>, title?: string) => void;
  pop: () => void;
  canGoBack: boolean;
}

interface ScreenData {
  id: string;
  component: React.ComponentType<{ navigation: NavigationAPI }>;
  title: string;
  key: number;
}

interface StackNavigatorProps {
  initialScreen: React.ComponentType<{ navigation: NavigationAPI }>;
}

interface GestureData {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

interface NavigationBarProps {
  title: string;
  canGoBack: boolean;
  onBack: () => void;
  isGesturing?: boolean;
}

const StackNavigator: React.FC<StackNavigatorProps> = ({ initialScreen }) => {
  const [screens, setScreens] = useState<ScreenData[]>([
    {
      id: "initial",
      component: initialScreen,
      title: "Home",
      key: Date.now(),
    },
  ]);
  const [direction, setDirection] = useState(1);
  const [isGesturing, setIsGesturing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for animation control
  const currentScreenRef = useRef<HTMLDivElement>(null);
  const previousScreenRef = useRef<HTMLDivElement>(null);
  const gestureData = useRef<GestureData>({
    startX: 0,
    currentX: 0,
    isDragging: false,
  });

  const push = useCallback(
    (
      ScreenComponent: React.ComponentType<{ navigation: NavigationAPI }>,
      title = "Screen",
    ) => {
      if (isAnimating) return;

      setDirection(1);
      setIsAnimating(true);

      const newScreen = {
        id: `screen-${Date.now()}`,
        component: ScreenComponent,
        title,
        key: Date.now(),
      };

      setScreens((prev) => {
        const newScreens = [...prev, newScreen];

        // Animate in the new screen after state update
        setTimeout(() => {
          if (currentScreenRef.current) {
            void (animate as any)(
              currentScreenRef.current,
              { x: "0%", opacity: 1 },
              {
                duration: 0.4,
                easing: (spring as any)({
                  keyframes: [0, 1],
                  stiffness: 400,
                  damping: 40,
                  mass: 0.8,
                }),
              },
            ).then(() => {
              setIsAnimating(false);
            });
          }
        }, 0);

        return newScreens;
      });
    },
    [isAnimating],
  );

  const pop = useCallback(() => {
    if (screens.length <= 1 || isAnimating) return;

    setDirection(-1);
    setIsAnimating(true);

    if (currentScreenRef.current && previousScreenRef.current) {
      // Animate current screen out and previous screen in

      const currentAnimation = (animate as any)(
        currentScreenRef.current,
        { x: "100%", opacity: 1 },
        {
          duration: 0.4,
          easing: (spring as any)({
            keyframes: [0, 1],
            stiffness: 400,
            damping: 40,
            mass: 0.8,
          }),
        },
      );

      const previousAnimation = (animate as any)(
        previousScreenRef.current,
        { x: "0%", scale: 1, opacity: 1 },
        {
          duration: 0.4,
          easing: (spring as any)({
            keyframes: [0, 1],
            stiffness: 400,
            damping: 40,
            mass: 0.8,
          }),
        },
      );

      void Promise.all([currentAnimation, previousAnimation]).then(() => {
        setScreens((prev) => prev.slice(0, -1));
        setIsAnimating(false);
      });
    } else {
      setScreens((prev) => prev.slice(0, -1));
      setIsAnimating(false);
    }
  }, [screens.length, isAnimating]);

  const canGoBack = screens.length > 1;
  const currentScreen = screens[screens.length - 1];
  const previousScreen =
    screens.length > 1 ? screens[screens.length - 2] : null;

  // Touch/Mouse gesture handling
  const handlePointerStart = useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!canGoBack || isAnimating) return;

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;

      // Only allow gestures from left edge
      if (clientX < 20) {
        setIsGesturing(true);
        gestureData.current = {
          startX: clientX,
          currentX: clientX,
          isDragging: true,
        };

        if (currentScreenRef.current) {
          currentScreenRef.current.style.transition = "none";
        }
        if (previousScreenRef.current) {
          previousScreenRef.current.style.transition = "none";
        }
      }
    },
    [canGoBack, isAnimating],
  );

  const handlePointerMove = useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!isGesturing || !gestureData.current.isDragging) return;

      event.preventDefault();
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const deltaX = Math.max(0, clientX - gestureData.current.startX);

      gestureData.current.currentX = clientX;

      if (currentScreenRef.current) {
        currentScreenRef.current.style.transform = `translateX(${deltaX}px)`;
        currentScreenRef.current.style.boxShadow =
          deltaX > 0 ? "0 10px 30px rgba(0,0,0,0.3)" : "none";
        currentScreenRef.current.style.borderRadius =
          deltaX > 0 ? "10px" : "0px";
        currentScreenRef.current.style.scale = deltaX > 0 ? "0.98" : "1";
      }

      if (previousScreenRef.current) {
        const progress = Math.min(deltaX / 150, 1);
        const opacity = 0.8 + 0.2 * progress;
        const scale = 0.95 + 0.05 * progress;

        previousScreenRef.current.style.opacity = opacity.toString();
        previousScreenRef.current.style.transform = `scale(${scale})`;
      }
    },
    [isGesturing],
  );

  const handlePointerEnd = useCallback(
    (_event: TouchEvent | MouseEvent) => {
      if (!isGesturing || !gestureData.current.isDragging) return;

      const deltaX = gestureData.current.currentX - gestureData.current.startX;
      const velocity = Math.abs(deltaX) / 100; // Simple velocity calculation

      setIsGesturing(false);
      gestureData.current.isDragging = false;

      const threshold = window.innerWidth * 0.3;
      const shouldGoBack = deltaX > threshold || velocity > 5;

      if (currentScreenRef.current) {
        currentScreenRef.current.style.transition =
          "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
      }
      if (previousScreenRef.current) {
        previousScreenRef.current.style.transition =
          "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
      }

      if (shouldGoBack) {
        // Complete the back navigation
        if (currentScreenRef.current) {
          void (animate as any)(
            currentScreenRef.current,
            { x: window.innerWidth, opacity: 1 },
            { duration: 0.3, easing: "ease-out" },
          );
        }
        if (previousScreenRef.current) {
          void (animate as any)(
            previousScreenRef.current,
            { opacity: 1, scale: 1 },
            { duration: 0.3, easing: "ease-out" },
          );
        }

        setTimeout(() => {
          setScreens((prev) => prev.slice(0, -1));
          if (currentScreenRef.current) {
            currentScreenRef.current.style.transform = "translateX(0)";
            currentScreenRef.current.style.transition = "";
          }
          if (previousScreenRef.current) {
            previousScreenRef.current.style.transform = "scale(1)";
            previousScreenRef.current.style.transition = "";
          }
        }, 300);
      } else {
        // Spring back to original position
        if (currentScreenRef.current) {
          void (animate as any)(
            currentScreenRef.current,
            { x: 0, scale: 1 },
            {
              duration: 0.3,
              easing: (spring as any)({
                keyframes: [0, 1],
                stiffness: 400,
                damping: 30,
              }),
            },
          ).then(() => {
            if (currentScreenRef.current) {
              currentScreenRef.current.style.boxShadow = "none";
              currentScreenRef.current.style.borderRadius = "0px";
              currentScreenRef.current.style.transition = "";
            }
          });
        }
        if (previousScreenRef.current) {
          void (animate as any)(
            previousScreenRef.current,
            { opacity: 0.8, scale: 0.95 },
            { duration: 0.3, easing: "ease-out" },
          ).then(() => {
            if (previousScreenRef.current) {
              previousScreenRef.current.style.transition = "";
            }
          });
        }
      }
    },
    [isGesturing],
  );

  // Set up event listeners
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => handlePointerStart(e);
    const handleTouchMove = (e: TouchEvent) => handlePointerMove(e);
    const handleTouchEnd = (e: TouchEvent) => handlePointerEnd(e);
    const handleMouseDown = (e: MouseEvent) => handlePointerStart(e);
    const handleMouseMove = (e: MouseEvent) => handlePointerMove(e);
    const handleMouseUp = (e: MouseEvent) => handlePointerEnd(e);

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handlePointerStart, handlePointerMove, handlePointerEnd]);

  // Initialize screen animations
  useEffect(() => {
    if (currentScreenRef.current && direction === 1) {
      // Entering from right
      currentScreenRef.current.style.transform = "translateX(100%)";
      currentScreenRef.current.style.opacity = "1";

      requestAnimationFrame(() => {
        if (currentScreenRef.current) {
          void (animate as any)(
            currentScreenRef.current,
            { x: "0%" },
            {
              duration: 0.4,
              easing: (spring as any)({
                keyframes: [0, 1],
                stiffness: 400,
                damping: 40,
                mass: 0.8,
              }),
            },
          );
        }
      });
    }
  }, [currentScreen.key, direction]);

  return (
    <div className="stack-navigator">
      {/* Previous screen for gesture feedback */}
      {previousScreen && (
        <div
          ref={previousScreenRef}
          className="screen previous-screen"
          style={{
            opacity: isGesturing ? "0.8" : "0",
            transform: "scale(0.95)",
            zIndex: 0,
          }}
        >
          <NavigationBar
            title={previousScreen.title}
            canGoBack={screens.length > 2}
            onBack={() => {}}
            isGesturing={true}
          />
          <div className="screen-content">
            <previousScreen.component
              navigation={{ push, pop, canGoBack: screens.length > 2 }}
            />
          </div>
        </div>
      )}

      {/* Current screen */}
      <div
        ref={currentScreenRef}
        className="screen current-screen"
        style={{
          transform: "translateX(0%)",
          opacity: 1,
          zIndex: 1,
        }}
      >
        <NavigationBar
          title={currentScreen.title}
          canGoBack={canGoBack}
          onBack={pop}
          isGesturing={isGesturing}
        />
        <div className="screen-content">
          <currentScreen.component navigation={{ push, pop, canGoBack }} />
        </div>
      </div>

      {/* Screen stack shadow overlay */}
      {screens.length > 1 && !isGesturing && <div className="screen-shadow" />}

      {/* Gesture edge indicator */}
      {canGoBack && <div className="gesture-edge-indicator" />}

      {/* Gesture hint for first-time users */}
      {canGoBack && <GestureHint />}
    </div>
  );
};

const GestureHint: React.FC = () => {
  const [showHint, setShowHint] = useState(() => {
    return !localStorage.getItem("swipe-gesture-hint-shown");
  });
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showHint && hintRef.current) {
      // Animate in
      hintRef.current.style.opacity = "0";
      hintRef.current.style.transform = "translateX(-50px)";

      void (animate as any)(
        hintRef.current,
        { opacity: 1, x: 0 },
        {
          duration: 0.5,
          easing: "ease-out",
        },
      );

      const timer = setTimeout(() => {
        if (hintRef.current) {
          void (animate as any)(
            hintRef.current,
            { opacity: 0, x: -50 },
            {
              duration: 0.5,
              easing: "ease-in",
            },
          ).then(() => {
            setShowHint(false);
            localStorage.setItem("swipe-gesture-hint-shown", "true");
          });
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showHint]);

  if (!showHint) return null;

  return (
    <div ref={hintRef} className="gesture-hint">
      <div className="gesture-hint-content">
        <div className="gesture-hint-icon">👈</div>
        <div className="gesture-hint-text">Swipe from edge to go back</div>
      </div>
    </div>
  );
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  canGoBack,
  onBack,
  isGesturing = false,
}) => {
  return (
    <div className={`navigation-bar ${isGesturing ? "gesturing" : ""}`}>
      <div className="nav-left">
        {canGoBack && (
          <button
            className="back-button"
            onClick={onBack}
            style={{ opacity: isGesturing ? 0.5 : 1 }}
          >
            <svg width="13" height="21" viewBox="0 0 13 21" fill="none">
              <path
                d="M12 1L2 10.5L12 20"
                stroke="#007AFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </button>
        )}
      </div>

      <div className="nav-center">
        <h1 className="nav-title">{title}</h1>
      </div>

      <div className="nav-right">
        {/* Right navigation items can go here */}
      </div>
    </div>
  );
};

export default StackNavigator;
