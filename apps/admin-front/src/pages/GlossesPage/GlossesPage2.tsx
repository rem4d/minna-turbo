import SentenceSearchResult from "@/components/shared/SentenceSearchResult";
import { api } from "@/utils/api";
import { Box, Flex, Grid, Text, Spinner } from "@radix-ui/themes";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { PropsWithChildren, useCallback } from "react";

export default function GlossesPage2() {
  const { data: glossesData, isLoading: glossesLoading } =
    api.admin.gloss.getGlosses2.useQuery();

  const findSentencesMutation =
    api.admin.gloss.getSentencesByGloss.useMutation();

  const sentencesLoading = findSentencesMutation.isPending;
  const aiSentences = findSentencesMutation.data ?? [];
  const showTable = !glossesLoading && glossesData && glossesData.length > 0;

  const onTableGlossClick = useCallback((id: number) => {
    findSentencesMutation.mutate({ glossId: id });
  }, []);

  return (
    <section>
      <div>
        <Box>
          {glossesLoading && <Spinner />}
          {!glossesLoading && glossesData?.length === 0 && (
            <Text>No glosses found.</Text>
          )}
        </Box>
        <div className="">
          <ScrollAreaFn>
            {showTable && (
              <div className="flex flex-col divide-y divide-gray-200">
                {glossesData.map((gloss, index) => (
                  <div
                    key={gloss.id}
                    className="hover:bg-gray-500/10 py-2 px-2 cursor-pointer"
                    onClick={() => onTableGlossClick(gloss.id)}
                  >
                    <Grid gap="2" columns="1fr 1.2fr 2fr 1fr">
                      <Text size="1" weight="bold">
                        {gloss.code}
                      </Text>
                      <Text size="1" className="whitespace-nowrap">
                        {gloss.kana}
                      </Text>
                      <Text size="1">{gloss.comment}</Text>
                      <Text size="1">{gloss.ref}</Text>
                    </Grid>
                  </div>
                ))}
              </div>
            )}
          </ScrollAreaFn>
        </div>
        <ScrollAreaFn>
          <Flex direction="column" gap="4">
            {sentencesLoading && <Spinner />}
            {aiSentences && (
              <Flex direction="column" gap="1">
                <Text size="1">
                  <Text size="2">{aiSentences.length}</Text> sentences found.
                </Text>
              </Flex>
            )}
            {aiSentences.map((s, index) => (
              <SentenceSearchResult
                key={s.id}
                text={s.text}
                id={s.id}
                index={index}
                html={s.text_with_furigana}
                ru={s.ru}
                en={s.en}
                source={s.source}
              />
            ))}
          </Flex>
        </ScrollAreaFn>
      </div>
    </section>
  );
}

const ScrollAreaFn = ({ children }: PropsWithChildren) => {
  return (
    <ScrollArea.Root className="w-full h-[500px] relative overflow-hidden">
      <ScrollArea.Viewport className="size-full">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="ScrollAreaCorner" />
    </ScrollArea.Root>
  );
};
