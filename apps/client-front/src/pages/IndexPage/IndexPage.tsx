import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const IndexPage: FC = () => {
  return (
    <div className="flex justify-center flex-col space-y-6 items-center p-[33px] mt-[120px]">
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
        "w-full h-[167px] rounded-xl p-4 flex flex-col space-y-4 border border-heatheredGray/40",
        color === "cyan" ? "bg-polar" : "bg-halfDutchWhite",
      )}
    >
      <div className="flex flex-col space-y-2">
        <div className="text-black text-2xl font-semibold">{title}</div>
        <div className="text-boulder text-sm">{desc}</div>
      </div>
      <button
        className={twMerge(
          "w-[130px] text-black text-base rounded-full font-semibold py-2 self-end",
          color === "yellow" && "text-black bg-supernova",
          color === "cyan" && "text-white bg-scooter",
        )}
        onClick={handleButtonClick}
      >
        Начать
      </button>
    </div>
  );
};

export default IndexPage;
