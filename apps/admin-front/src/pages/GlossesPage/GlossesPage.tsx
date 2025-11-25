import { PropsWithChildren, useCallback } from "react";
import SentenceSearchResult from "@/components/shared/SentenceSearchResult";
import { api } from "@/utils/api";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Box, Flex, Grid, Spinner, Text } from "@radix-ui/themes";

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
                    className="cursor-pointer px-2 py-2 hover:bg-gray-500/10"
                    onClick={() => onTableGlossClick(gloss.id)}
                  >
                    <Grid gap="2" columns="0.3fr 1fr 1.2fr 2fr 1fr 0.3fr">
                      <Text size="1" color="gray">
                        {index + 1}
                      </Text>
                      <Text size="1" weight="bold">
                        {gloss.code}
                      </Text>
                      <Text size="1" className="whitespace-nowrap">
                        {gloss.kana}
                      </Text>
                      <Text size="1">{gloss.comment}</Text>
                      <Text size="1">{gloss.ref}</Text>
                      <Text size="1">
                        {gloss.jlpt_level ? `N${gloss.jlpt_level}` : null}
                      </Text>
                    </Grid>
                  </div>
                ))}
              </div>
            )}
          </ScrollAreaFn>
        </div>
        <div>
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
                ru={s.ru}
                en={s.en}
                source={s.source}
              />
            ))}
          </Flex>
        </div>
      </div>
    </section>
  );
}

const ScrollAreaFn = ({ children }: PropsWithChildren) => {
  return (
    <ScrollArea.Root className="relative h-[500px] w-full overflow-hidden">
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
