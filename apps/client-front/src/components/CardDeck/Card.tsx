import type { Kanji } from "@rem4d/db";
import React, { useState } from "react";
import { motion } from "motion/react";
import { twJoin, twMerge } from "tailwind-merge";

import KCard from "../KCard";

interface CardProps {
  k: Kanji;
  isActive: boolean;
  index: number;
  isMobile: boolean;
}

export default React.memo(function Card({
  k,
  isActive,
  index,
  isMobile,
}: CardProps) {
  // const cardRef = useRef<HTMLDivElement>(null);
  // const frontRef = useRef<HTMLDivElement>(null);
  // const backRef = useRef<HTMLDivElement>(null);
  // const examplesRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // const tl = gsap.timeline();
  //
  // useLayoutEffect(() => {
  //   const ctx = gsap.context(() => {
  //     if (isActive) {
  //       gsap.to(cardRef.current, {
  //         scale: 1.1,
  //         y: -30,
  //       });
  //     }
  //   });
  //   return () => {
  //     ctx.revert();
  //   };
  // }, [isActive]);

  const handleClick = () => {
    if (isActive) {
      setIsFlipped(!isFlipped);
    }
  };
  const duration = 0.4;

  return (
    <motion.div
      onClick={handleClick}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      className={twMerge(
        "absolute top-0 left-1/2 h-[60vh] -translate-x-1/2 cursor-pointer text-[#000] select-none",
        isMobile && "w-[80vw]",
        !isMobile && "w-[350px]",
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
        <div className={"flex size-full items-center justify-center p-6"}>
          <div className="font-digi text-[80px]">{k.kanji}</div>
        </div>
      </motion.div>

      {/* back */}
      <motion.div
        className="bg-balticSea absolute top-0 left-0 size-full overflow-hidden rounded-[16px] border border-black/10 bg-white px-6 py-3"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="size-full py-3">
          <KCard k={k} />
        </div>
      </motion.div>
    </motion.div>
  );
});
