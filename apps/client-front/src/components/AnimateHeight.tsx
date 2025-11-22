import type React from "react";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { motion as m } from "motion/react";

interface AnimateChangeInHeightProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const AnimateHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
  duration = 0.1,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries[0]?.contentRect.height ?? 0;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        // Cleanup the observer when the component is unmounted
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <m.div
      className={classNames(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration }}
    >
      <div ref={containerRef}>{children}</div>
    </m.div>
  );
};
