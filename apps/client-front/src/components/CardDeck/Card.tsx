import type { Kanji } from "@rem4d/db";
import React, { useState } from "react";
import { motion } from "motion/react";
import { twJoin, twMerge } from "tailwind-merge";

import KCard from "../KCard";

interface CardProps {
  k: Kanji;
  isActive: boolean;
  isInteracting: boolean;
  index: number;
  isMobile: boolean;
}

export default React.memo(function Card({
  k,
  isActive,
  index,
  isMobile,
}: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => {
    if (isActive) {
      setIsFlipped(!isFlipped);
    }
  };
  const duration = 0.4;

  return (
    <motion.div
      onClick={handleClick}
      animate={{
        rotateY: isFlipped ? 180 : 0,
        scale: isActive ? 1.1 : 1,
        translateY: isActive ? -30 : 0,
      }}
      onAnimationComplete={() => setLoaded(true)}
      className={twMerge(
        "absolute left-1/2 h-[50vh] max-h-[500px] -translate-x-1/2 cursor-pointer text-[#000] select-none",
        isMobile && "w-[75vw]",
        !isMobile && "w-[320px]",
      )}
      transition={{ duration }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* front */}
      <motion.div
        className={twJoin(
          "bg-balticSea relative top-0 left-0 size-full overflow-hidden rounded-[16px] border border-black/10 bg-white",
          index === 2 && "shadow-[0_4px_9px_rgba(216,205,192,0.5)]",
        )}
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0, transition: { duration: 0.2 } }}
          className={twMerge(
            "flex size-full items-center justify-center p-6 opacity-0",
            isActive && "opacity-100",
          )}
        >
          <div className="font-digi text-[80px]">{k.kanji}</div>
        </motion.div>
      </motion.div>

      {/* back */}
      <motion.div
        className="bg-balticSea absolute top-0 left-0 size-full overflow-hidden rounded-[16px] border border-black/10 bg-white px-2"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        {loaded && (
          <div className="size-full">
            <KCard
              k={k}
              containerClassName="overflow-y-scroll overflow-x-hidden"
              useEye
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});
