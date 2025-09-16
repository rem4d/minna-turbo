import { Page } from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import Thumbnail from "@/components/Thumbnail";
import { useRouter } from "@/router/router";
import { paths } from "@/router/routes";
import { useTRPC } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function SingleKanjiPage() {
  const { url } = useRouter();
  const kanjiId = url.split("/").pop() ?? "1";

  const trpc = useTRPC();
  const listQuery = useQuery(trpc.viewer.kanji.all.queryOptions());
  const list = listQuery.data ?? [];
  const found = list.find((d) => d.id === Number(kanjiId));

  const [transLang] = useLocalStorage<"ru" | "en" | null>(
    "kic:translation_language",
    null,
  );

  if (!found) {
    return null;
  }

  const kanji = found.kanji;
  const level = found.position;

  const onClick = () => {};
  const id = found.id;

  const currentMeaning = String(
    transLang === "ru" ? found.ru : found.en,
  ).toLowerCase();

  const { kun, on_ } = found;
  // const means = currentMeaning?.split(/[;/,]/)[0];

  return (
    <Page
      backTo={paths.allKanji}
      className="overflow-y-hidden"
      backAnimationStyle="remove"
    >
      <div className="flex flex-col px-4 pt-4">
        <SectionHeader></SectionHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <Thumbnail
              title={kanji}
              level={level}
              onClick={onClick}
              id={id}
              means={""}
              large
            />
          </div>
          <div className="flex flex-col items-start space-y-2">
            <div className="font-inter mb-4 text-xl font-semibold text-black">
              {currentMeaning}
            </div>
            {kun && kun.length > 0 && (
              <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
                {kun.join("、")}
              </span>
            )}
            {on_ && on_.length > 0 && (
              <span className="font-digi rounded-[18px] border bg-white px-2 py-1 text-lg leading-5 text-black">
                {on_.join("、")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
