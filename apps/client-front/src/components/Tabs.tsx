import { useState } from "react";
import { motion as m } from "motion/react";
import { twMerge } from "tailwind-merge";

export default function Tabs() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex w-fit items-start overflow-hidden rounded-[30px] bg-black/10">
      <TabItem
        text="Новые"
        isCurrent={current === 0}
        onClick={() => setCurrent(0)}
      />
      <TabItem
        text="Повторить"
        isCurrent={current === 1}
        onClick={() => setCurrent(1)}
      />
    </div>
  );
}

const TabItem = ({
  text,
  isCurrent,
  onClick,
}: {
  text: string;
  isCurrent: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="relative flex justify-center">
      {isCurrent ? (
        <m.div
          initial={false}
          transition={{ duration: 0.3 }}
          layout
          layoutId="black-bg"
          id="black-bg"
          style={{
            borderRadius: 30,
          }}
          className="absolute bottom-0 left-0 h-full w-full bg-[#000]/90"
        />
      ) : null}

      <m.div
        initial={false}
        className={twMerge("relative z-0 px-4 py-2 text-sm font-semibold")}
        animate={{
          color: isCurrent ? "#fff" : "#000",
        }}
        onClick={onClick}
        transition={{ duration: 0.3 }}
      >
        {text}
      </m.div>
    </div>
  );
};
