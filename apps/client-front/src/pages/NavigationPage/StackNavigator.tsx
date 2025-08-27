// @ts-nocheck
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StackNavigator.css';

const StackNavigator = ({ initialScreen }) => {
  const [screens, setScreens] = useState([
    {
      id: 'initial',
      component: initialScreen,
      title: 'Home',
      key: Date.now()
    }
  ]);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);

  const push = (ScreenComponent, title = 'Screen') => {
    setDirection(1);
    setScreens(prev => [...prev, {
      id: `screen-${Date.now()}`,
      component: ScreenComponent,
      title,
      key: Date.now()
    }]);
  };

  const pop = () => {
    if (screens.length > 1) {
      setDirection(-1);
      setScreens(prev => prev.slice(0, -1));
    }
  };

  const canGoBack = screens.length > 1;
  const currentScreen = screens[screens.length - 1];

  // Gesture handling for swipe back
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;

    // Only enable swipe from left edge
    if (touchStartX.current < 20 && canGoBack) {
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    touchCurrentX.current = e.touches[0].clientX;
    const deltaX = touchCurrentX.current - touchStartX.current;

    // Only allow rightward swipes
    if (deltaX > 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const deltaX = touchCurrentX.current - touchStartX.current;
    const threshold = window.innerWidth * 0.3;

    if (deltaX > threshold && canGoBack) {
      pop();
    }

    isDragging.current = false;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-30%',
      opacity: direction < 0 ? 1 : 0.8,
    }),
  };

  const transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <div
      className="stack-navigator"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentScreen.key}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="screen"
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

      {/* Previous screen shadow overlay */}
      {screens.length > 1 && (
        <div className="previous-screen-overlay" />
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
