import type { Kanji } from "@rem4d/db";
import { useState } from "react";
import { motion } from "motion/react";
import { twJoin, twMerge } from "tailwind-merge";

interface CardProps extends Kanji {
  isActive: boolean;
  index: number;
}

export default function Card({
  kanji,
  means,
  kun,
  on_,
  isActive,
  index,
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
      className="absolute top-0 left-0 size-full h-[400px] w-[300px] cursor-pointer text-black select-none"
      transition={{ duration }}
      style={{
        transformStyle: "preserve-3d",
        marginTop: 30,
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
          <div className="font-kyokasho text-[80px]">{kanji}</div>
        </div>
      </motion.div>

      {/* back */}
      <motion.div
        id="back"
        className="bg-balticSea absolute top-0 left-0 size-full overflow-hidden rounded-[16px] border border-black/10 bg-white py-3"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="size-full py-3">
          <div className="flex space-x-4 px-4">
            <div className="flex shrink-0 items-center justify-center rounded-[8px] border border-black/10 p-4">
              <span className="font-kyokasho text-[56px]">{kanji}</span>
            </div>
            <div className="text-md flex flex-col items-center space-y-2 leading-none">
              <div className="text-sm">{means}</div>
              <div className="flex h-full flex-col items-center justify-center space-y-2">
                {kun ? <ReadingBlock arr={kun} /> : null}
                {kun && kun.length > 0 && on_ && on_.length > 0 ? (
                  <div className="size-[4px] rounded-full bg-black/50" />
                ) : null}
                {on_ ? <ReadingBlock arr={on_} /> : null}
              </div>
            </div>
          </div>
          <div className="mt-8 flex h-full flex-col">
            {/* <div
              ref={examplesRef}
              className="gapy-y-2 font-genei grid grid-cols-[1fr,1.5fr,auto] items-center gap-x-3 text-base whitespace-nowrap"
            >
              {examples.map(({ sentence, kana, prefix, means }) => (
                <div
                  className="col-span-3 grid grid-cols-subgrid px-4"
                  key={`${kana}-${means}`}
                >
                  <div className="text-base">{sentence}</div>
                  <div className="w-full">
                    <div
                      className={twMerge(
                        "w-full text-sm",
                        hideKana && "opacity-0",
                      )}
                    >
                      {kana}
                    </div>
                  </div>
                  <div className="font-inter w-full">
                    <div
                      className={twMerge(
                        "font-inter w-full text-xs",
                        hideTranslation && "opacity-0",
                      )}
                    >
                      {prefix ? <i>{prefix} </i> : null}
                      {means}
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const ReadingBlock = ({ arr }: { arr: string[] }) => {
  const len = arr.length;
  return (
    <div
      className={twMerge(
        "font-genei grid gap-2",
        arr.length === 1 && "grid-cols-1",
        arr.length >= 2 && "grid-cols-2",
      )}
    >
      {arr?.map((k, index) => (
        <span
          key={`${k}`}
          className={twMerge(
            "text-center whitespace-nowrap",
            len === 3 && index === 2 && "col-span-full",
          )}
        >
          {k}
        </span>
      ))}
    </div>
  );
};
