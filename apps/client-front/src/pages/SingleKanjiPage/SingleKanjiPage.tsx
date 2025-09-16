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

  const means = currentMeaning?.split(/[;/,]/)[0];

  return (
    <Page
      backTo={paths.allKanji}
      className="overflow-y-hidden"
      backAnimationStyle="remove"
    >
      <SectionHeader></SectionHeader>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <Thumbnail
              title={kanji}
              level={level}
              onClick={onClick}
              id={id}
              means={means}
              large
            />
          </div>
          <div>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
        </div>
      </div>
    </Page>
  );
}
