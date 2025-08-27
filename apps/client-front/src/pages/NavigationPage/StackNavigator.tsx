// @ts-nocheck
import React, { useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import "./StackNavigator.css";

const StackNavigator = ({ initialScreen }) => {
  const [screens, setScreens] = useState([
    {
      id: "initial",
      component: initialScreen,
      title: "Home",
      key: Date.now(),
    },
  ]);
  const [direction, setDirection] = useState(1);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [isGestureCompleting, setIsGestureCompleting] = useState(false);

  // Motion values for interactive gesture
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [0, 300], [0, 1]);

  // Pre-define transforms to avoid conditional hook calls
  const previousScreenTransform = useTransform(
    dragProgress,
    [0, 1],
    ["translateX(-30%) scale(0.95)", "translateX(0%) scale(1)"],
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

  const push = (ScreenComponent, title = "Screen") => {
    setDirection(1);
    setScreens((prev) => [
      ...prev,
      {
        id: `screen-${Date.now()}`,
        component: ScreenComponent,
        title,
        key: Date.now(),
      },
    ]);
  };

  const pop = useCallback(
    (skipAnimation = false) => {
      if (screens.length > 1) {
        setDirection(-1);
        if (skipAnimation) {
          setIsGestureCompleting(true);
        }
        setScreens((prev) => prev.slice(0, -1));
      }
    },
    [screens.length],
  );

  const canGoBack = screens.length > 1;
  const currentScreen = screens[screens.length - 1];
  const previousScreen = screens[screens.length - 2];

  // Handle touch start
  const handleTouchStart = (e) => {
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

  // Handle touch move with real-time tracking
  const handleTouchMove = (e) => {
    if (!gestureStarted.current || !canGoBack) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;

    // Only allow rightward swipes
    if (deltaX > 0) {
      e.preventDefault();
      // Update the drag position in real-time
      dragX.set(Math.min(deltaX, window.innerWidth * 0.8));
    }
  };

  // Handle touch end with spring animation
  const handleTouchEnd = () => {
    if (!gestureStarted.current || !canGoBack) return;

    const currentDragX = dragX.get();
    const threshold = window.innerWidth * 0.3;
    const velocity = dragX.getVelocity();

    gestureStarted.current = false;

    if (currentDragX > threshold || velocity > 500) {
      // Complete the gesture - animate to full width then pop
      animate(dragX, window.innerWidth, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          pop(true); // Skip exit animation
          setIsGestureActive(false);
          setIsGestureCompleting(false);
          dragX.set(0);
        },
      });
    } else {
      // Cancel the gesture - spring back to 0
      animate(dragX, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          setIsGestureActive(false);
        },
      });
    }
  };

  // Animation variants for screen transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-30%",
      opacity: direction < 0 ? 1 : 0.8,
    }),
  };

  const transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <div
      ref={containerRef}
      className="stack-navigator"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Previous screen - always rendered when there's a back stack */}
      {canGoBack && previousScreen && (
        <motion.div
          className="screen previous-screen"
          style={{
            zIndex: 0,
            transform: previousScreenTransform,
          }}
        >
          <NavigationBar
            title={previousScreen.title}
            canGoBack={screens.length > 2}
            onBack={() => {}}
          />
          <div className="screen-content">
            <previousScreen.component
              navigation={{ push, pop, canGoBack: screens.length > 2 }}
            />
          </div>
        </motion.div>
      )}

      {/* Current screen with gesture support */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentScreen.key}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit={isGestureCompleting ? false : "exit"}
          transition={transition}
          className="screen current-screen"
          style={{
            zIndex: 1,
            x: isGestureActive ? dragX : 0,
            boxShadow: isGestureActive
              ? currentScreenShadow
              : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          <NavigationBar
            title={currentScreen.title}
            canGoBack={canGoBack}
            onBack={pop}
          />
          <div className="screen-content">
            <currentScreen.component navigation={{ push, pop, canGoBack }} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Gesture indicator */}
      {isGestureActive && (
        <motion.div
          className="gesture-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </div>
  );
};

const NavigationBar = ({ title, canGoBack, onBack }) => {
  return (
    <div className="navigation-bar">
      <div className="nav-left">
        {canGoBack && (
          <button className="back-button" onClick={onBack}>
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
