import type { FC } from "react";
import { Page } from "@/components/Page";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const IndexPage: FC = () => {
  console.log("init");
  return (
    <Page footer>
      <div className="flex flex-col items-center justify-center space-y-6 p-[33px]">
        <Card
          title="Фразы"
          desc="Читайте и слушайте реальные фразы на японском, состоящие только из изученных вами кандзи"
          to="/sentences"
          color="yellow"
        />
        <Card
          title="Карточки"
          desc="Создавайте колоды карт из кандзи"
          to="/flashcards"
          color="cyan"
        />
      </div>
    </Page>
  );
};

interface CardProps {
  title: string;
  desc: string;
  to: string;
  color: "yellow" | "cyan";
}

const Card: FC<CardProps> = ({ title, desc, to, color }) => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    void navigate(to);
  };
  return (
    <div
      className={twMerge(
        "border-heatheredGray/40 relative flex h-[167px] w-full flex-col space-y-4 rounded-xl border p-4 pt-(--page-offset-top-full)",
        color === "cyan" ? "bg-polar" : "bg-half-dutch-white",
      )}
      onClick={handleButtonClick}
    >
      <div className="flex flex-col space-y-2">
        <div className="text-2xl font-semibold text-black">{title}</div>
        <div className="text-boulder text-sm">{desc}</div>
      </div>
      <button
        className={twMerge(
          "absolute bottom-4 w-[130px] self-end rounded-full py-2 text-base font-semibold text-black",
          color === "yellow" && "bg-supernova text-black",
          color === "cyan" && "bg-scooter text-white",
        )}
      >
        Начать
      </button>
    </div>
  );
};

export default IndexPage;
