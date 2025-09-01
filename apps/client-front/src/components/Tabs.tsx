import React from "react";
import { motion as m } from "motion/react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

interface TabsProps {
  current: number;
  onChange: (n: number) => void;
}

export default React.memo(function Tabs({ current, onChange }: TabsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-fit items-start overflow-hidden rounded-[30px] bg-black/10">
      <TabItem
        text={t("new")}
        isCurrent={current === 0}
        onClick={() => onChange(0)}
      />
      <TabItem
        text={t("repeat")}
        isCurrent={current === 1}
        onClick={() => onChange(1)}
      />
    </div>
  );
});

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
    <div className="relative flex cursor-pointer justify-center">
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
          className="bg-mine-shaft absolute bottom-0 left-0 h-full w-full"
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
