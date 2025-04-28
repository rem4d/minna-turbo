import type { FC, ReactElement } from "react";
import BubbleIcon from "@/assets/images/bubble2.svg?react";
import DeckIcon from "@/assets/images/deck.svg?react";
import { Page } from "@/components/Page";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const IndexPage: FC = () => {
  return (
    <Page footer>
      <div className="flex h-[calc(100%-var(--footer-height))] flex-col justify-center">
        <div className="flex flex-col items-center justify-center space-y-6 p-[33px]">
          <Card
            title="Фразы"
            desc="Читайте и слушайте реальные фразы на японском, состоящие только из изученных вами кандзи"
            to="/sentences"
            color="yellow"
            icon={
              <div className="absolute -right-2 -bottom-2 z-0 w-[40%] opacity-40">
                {/* <BubbleIcon className="size-full" /> */}
                <BubbleIcon className="size-full" />
              </div>
            }
          />
          <Card
            title="Карточки"
            desc="Повышайте свой уровень, изучая новые кандзи с помощью карточек"
            to="/flashcards"
            color="cyan"
            icon={
              <div className="absolute right-4 bottom-0 z-0 w-[70px] opacity-40">
                <DeckIcon className="size-full" />
              </div>
            }
          />
        </div>
      </div>
    </Page>
  );
};

interface CardProps {
  title: string;
  desc: string;
  to: string;
  color: "yellow" | "cyan";
  icon: ReactElement;
}

const Card: FC<CardProps> = ({ title, desc, to, color, icon }) => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    void navigate(to);
  };
  return (
    <div
      className={twMerge(
        "border-heatheredGray/40 relative flex h-[200px] w-full flex-col justify-between space-y-4 overflow-hidden rounded-[20px] border p-6 shadow-md",
        color === "cyan" ? "bg-polar" : "bg-half-dutch-white",
      )}
      onClick={handleButtonClick}
    >
      {icon}
      <div className="relative z-10 flex flex-col space-y-2">
        <div className="text-2xl font-semibold text-black">{title}</div>
        <div className="text-boulder text-sm">{desc}</div>
      </div>
      <button
        className={twMerge(
          "relative w-[50%] self-start rounded-[14px] py-2 text-base font-semibold text-black",
          color === "yellow" && "bg-[#ffd664] text-black",
          color === "cyan" && "bg-scooter text-white",
        )}
      >
        Начать
      </button>
    </div>
  );
};

export default IndexPage;
