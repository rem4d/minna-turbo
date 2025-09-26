import SentenceSearchResult from "@/components/shared/SentenceSearchResult";
import { api } from "@/utils/api";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Box,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
  Text,
  SegmentedControl,
  Table,
  TextField,
  Spinner,
  TextArea,
  Button,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function GlossesPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [currentGlossId, setCurrentGlossId] = useState<number | null>(null);
  const [textareaValue, setTextareaValue] = useState("");

  const MAX_PER_PAGE = 10;
  const { data: glossesData, isLoading: glossesLoading } =
    api.admin.gloss.getGlosses.useQuery({
      limit: MAX_PER_PAGE,
      page: pageNumber,
    });

  const findSentencesMutation =
    api.admin.gloss.getSentencesByGloss.useMutation();

  const utils = api.useUtils();
  const { data: total } = api.admin.gloss.glossesTotal.useQuery();

  const onFindSentencesClick = useCallback(
    (glossId: number) => {
      const found = glossesData?.find((m) => m.id === glossId);
      if (found) {
        setCurrentGlossId(glossId);

        void findSentencesMutation.mutate({
          glossId,
        });
      } else {
        console.error("No corresponding member found.");
      }
    },
    [glossesData, findSentencesMutation],
  );
  const foundSentences = findSentencesMutation.data ?? [];
  const sentencesLoading = findSentencesMutation.isPending;

  const setHiddenMutation = api.admin.gloss.setHidden.useMutation({
    onSuccess() {
      void utils.admin.gloss.getGlosses.invalidate();
    },
  });
  const askAiMutation = api.admin.gloss.askAi.useMutation();
  const onSetHiddenClick = useCallback(
    (id: number) => {
      setHiddenMutation.mutate(id);
    },
    [setHiddenMutation],
  );

  const onGeneratePromptClick = () => {
    // allGlossesMutation.mutate();
  };
  const onAskAiToMakeGlossesClick = () => {
    askAiMutation.mutate({
      prompt: textareaValue,
    });
  };

  return (
    <section>
      <Grid columns="60% auto" gap="4">
        <Flex gap="2" align="center">
          <Flex gap="2">
            <IconButton
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 1}
            >
              <ArrowLeftIcon width="18" height="18" />
            </IconButton>
            <IconButton
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={glossesData && glossesData.length < MAX_PER_PAGE}
            >
              <ArrowRightIcon width="18" height="18" />
            </IconButton>

            <Flex align="center" gap="2"></Flex>
          </Flex>
          <Flex>
            <Text size="1" color="gray">
              {pageNumber * MAX_PER_PAGE} /{total}
            </Text>
          </Flex>
        </Flex>
      </Grid>
      {glossesLoading && <Spinner />}
      {!glossesLoading && (
        <Grid columns="60% auto" gap="4">
          <Table.Root size="2" variant="ghost">
            <Table.Header>
              <Table.Row>
                {/* <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell> */}
                <Table.ColumnHeaderCell>
                  <Text color="gray">romaji</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="whitespace-nowrap">
                  <Text color="gray">kana</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="whitespace-nowrap">
                  <Text color="gray">comment</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text color="gray">kanji form</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text color="gray">references</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {glossesData?.map((gloss) => (
                <Table.Row
                  key={gloss.id}
                  className={twMerge(
                    gloss.id === currentGlossId && "bg-gray-800",
                  )}
                >
                  <Table.Cell className="whitespace-nowrap">
                    {gloss.romaji}
                  </Table.Cell>
                  <Table.Cell>{gloss.kana}</Table.Cell>
                  <Table.Cell>
                    <Text size="1">{gloss.comment}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" color="gray">
                      {gloss.kanji_form}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{gloss.references}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton size="1" variant="soft">
                          <DropdownMenu.TriggerIcon />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => onFindSentencesClick(gloss.id)}
                        >
                          Find sentences
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          onClick={() => onSetHiddenClick(gloss.id)}
                        >
                          Set hidden
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex direction="column" gap="4">
            {sentencesLoading && <Spinner />}
            {foundSentences && !sentencesLoading && (
              <Flex direction="column" gap="1">
                <Text size="1">
                  <Text size="2">{foundSentences.length}</Text> sentences found.
                </Text>
              </Flex>
            )}
            {foundSentences.map((s, index) => (
              <SentenceSearchResult
                key={s.id}
                id={s.id}
                index={index}
                html={s.text_with_furigana}
                ru={s.ru}
                en={s.en}
              />
            ))}
          </Flex>
        </Grid>
      )}

      <Box className="mt-8">
        <Button onClick={onAskAiToMakeGlossesClick}>Ask Ai</Button>
        <Button onClick={onGeneratePromptClick}>Generate glosses</Button>
        <TextArea mt="6" mb="6" rows={7} value={textareaValue} />
      </Box>
    </section>
  );
}
