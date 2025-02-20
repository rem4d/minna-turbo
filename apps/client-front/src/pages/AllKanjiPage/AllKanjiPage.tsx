import { type FC } from "react";
import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import { api } from "@/utils/api";

export const AllKanjiPage: FC = () => {
  const { data } = api.kanji.all.useQuery();
  console.log(data);

  return (
    <Page back sa="content">
      <div className="flex flex-col space-y-8 px-4">
        <SectionHeader>Все кандзи</SectionHeader>
        <div className="grid grid-cols-4 gap-3">
          {data?.map((k) => (
            <Card key={k.id} kanji={k.kanji} level={k.position} />
          ))}
        </div>
      </div>
    </Page>
  );
};

interface CardProps {
  kanji: string;
  level: number;
}

const Card: FC<CardProps> = ({ kanji, level }) => {
  return (
    <div className="relative flex flex-col justify-center rounded-md bg-white p-4 shadow-md">
      <div className="text-rolling-stone absolute top-2 left-2 text-xs">
        {level}
      </div>
      <div className="font-yu-gothic text-center text-3xl font-semibold text-black">
        {kanji}
      </div>
    </div>
  );
};

export default AllKanjiPage;
