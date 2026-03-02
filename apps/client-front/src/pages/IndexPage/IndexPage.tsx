import type { FC, ReactElement } from "react";
import React from "react";
import BubbleIcon from "@/assets/images/bubble2.svg?react";
import { FooterMenu } from "@/components/FooterMenu";
import { Page } from "@/components/Page";
import { useRouter } from "@/router/router";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

const IndexPage = React.memo(() => {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  return (
    <>
      <Page>
        <div className="flex h-[calc(100%-var(--footer-height))] flex-col justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 p-[33px]">
            <Card
              title={t("sentences")}
              desc={t("sentences_desc")}
              to="/sentences"
              color="yellow"
              onClick={() =>
                navigate("/sentences", { animationStyle: "nav-forward" })
              }
              icon={
                <div className="absolute -right-2 -bottom-2 z-0 w-[40%] opacity-40">
                  <BubbleIcon className="size-full" />
                </div>
              }
            />
          </div>
        </div>
      </Page>
      <FooterMenu />
    </>
  );
});

interface CardProps {
  title: string;
  desc: string;
  to: string;
  color: "yellow" | "cyan";
  icon: ReactElement;
  onClick: () => void;
}

const Card: FC<CardProps> = React.memo(
  ({ title, desc, onClick, color, icon }) => {
    const { t } = useTranslation();
    return (
      <div
        className={twMerge(
          "border-heatheredGray/40 relative flex h-[200px] w-full flex-col justify-between space-y-4 overflow-hidden rounded-[20px] border p-6 shadow-md",

          color === "cyan"
            ? "border-[#d1ccdb]/50 bg-[#e5e0f7] shadow-[#d1ccdb]"
            : "bg-half-dutch-white border-[#e7dfc7]/50 shadow-[#e7dfc7]",
        )}
        onClick={onClick}
      >
        {icon}
        <div className="relative z-10 flex flex-col space-y-2">
          <div
            className={twMerge(
              "text-2xl font-semibold",
              color === "cyan" ? "text-[#4c406e]" : "text-[#4b3e1a]",
            )}
          >
            {title}
          </div>
          <div className="text-boulder text-sm">{desc}</div>
        </div>
        <button
          className={twMerge(
            "relative w-[50%] self-start rounded-[14px] py-2 text-base font-semibold text-black",
            color === "yellow" && "bg-[#ffd664] text-black",
            color === "cyan" && "bg-[#705fa2] text-white",
          )}
        >
          {t("start")}
        </button>
      </div>
    );
  },
);

export default IndexPage;
