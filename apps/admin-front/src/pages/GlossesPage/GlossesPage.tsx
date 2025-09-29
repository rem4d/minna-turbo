import SentenceSearchResult from "@/components/shared/SentenceSearchResult";
import { api } from "@/utils/api";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Grid,
  IconButton,
  Text,
  TextField,
  Spinner,
  Button,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import AITable from "./AITable";
import GlossTable from "./GlossTable";
import toast from "react-hot-toast";

type AiGlossOutput = {
  id: number;
  kana: string | null;
  comment: string | null;
  number: number | null;
  cnt?: number | null;
};

export default function GlossesPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [currentGlossId, setCurrentGlossId] = useState<number | null>(null);
  const [currentAIGlossId, setCurrentAIGlossId] = useState<number | null>(null);
  const [regexFieldValue, setRegexFieldValue] = useState("");
  const [aiGlosses, setAiGlosses] = useState<AiGlossOutput[]>([]);

  const MAX_PER_PAGE = 10;
  const { data: glossesData, isLoading: glossesLoading } =
    api.admin.gloss.getGlosses.useQuery({
      limit: MAX_PER_PAGE,
      page: pageNumber,
    });

  const findAiSentences = api.admin.gloss.ai_getSentencesByGloss.useMutation();
  const findByRegexMutation = api.admin.gloss.findByRegex.useMutation({
    onSuccess(data) {
      setAiGlosses(data);
    },
  });
  const createMutation = api.admin.gloss.createGloss.useMutation({
    onSuccess() {
      void utils.admin.gloss.getGlosses.invalidate();
    },
  });

  const connectGlosses = api.admin.gloss.connectGlosses.useMutation({
    onSuccess() {
      toast.success("Success.");
      // void utils.admin.gloss.findByRegex.invalidate();
    },
  });

  const findByGlossIdMutation = api.admin.gloss.findByGlossId.useMutation({
    onSuccess(data) {
      setAiGlosses(data);
    },
  });

  const aiGlossesPending =
    findByRegexMutation.isPending || findByGlossIdMutation.isPending;

  const utils = api.useUtils();
  const { data: total } = api.admin.gloss.glossesTotal.useQuery();

  const foundSentences = findAiSentences.data ?? [];
  const sentencesLoading = findAiSentences.isPending;

  const setHiddenMutation = api.admin.gloss.setHidden.useMutation({
    onSuccess() {
      toast.success("Success.");
      // void utils.admin.gloss.findByRegex.invalidate();
    },
  });

  const onAiGlossClick = (id: number) => {
    setCurrentAIGlossId(id);
    void findAiSentences.mutate({
      glossId: id,
    });
  };

  const onTableGlossClick = (id: number) => {
    setCurrentGlossId(id);
    const found = glossesData?.find((g) => g.id === id);
    setRegexFieldValue(found?.kana ?? "");
    void findByGlossIdMutation.mutate({ glossId: id });
  };

  const onFindSimilarAis = () => {
    findByRegexMutation.mutate({ regex: regexFieldValue });
  };

  const onCreateGlossClick = (id: number) => {
    createMutation.mutate({ id });
    console.log("Create gloss with id: ", id);
  };

  const onConnectWithSelectedClick = (id: number) => {
    if (!currentGlossId) {
      console.log("No selected gloss id.");
      toast.error("No selected gloss id.");
      return;
    }
    connectGlosses.mutate({ glossId: currentGlossId, aiGlossId: id });
    console.log("Connect with selected gloss: ", id);
  };

  const onSetHiddenClick = (id: number) => {
    setHiddenMutation.mutate(id);
  };

  return (
    <section>
      {!glossesLoading && glossesData?.length === 0 && (
        <Box>
          <Text>No glosses found.</Text>
        </Box>
      )}

      {glossesLoading && <Spinner />}
      {!glossesLoading && glossesData && glossesData.length > 0 && (
        <>
          <Grid mb="8" columns="2" gap="4">
            <Flex gap="2" align="center" justify="start">
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
              <Flex gap="2">
                <TextField.Root
                  onChange={(e) => setRegexFieldValue(e.target.value)}
                  value={regexFieldValue}
                  placeholder="Regex"
                />
                <Button onClick={onFindSimilarAis}>Search</Button>
              </Flex>
            </Flex>

            <Box>
              {aiGlossesPending && <Spinner />}
              {!aiGlossesPending && (
                <Flex direction="column" gap="1">
                  <Text size="1">
                    <Text size="2">{aiGlosses.length}</Text> AI glosses found.
                  </Text>
                </Flex>
              )}
            </Box>
            <GlossTable
              glossesData={glossesData}
              currentGlossId={currentGlossId}
              onTableGlossClick={onTableGlossClick}
            />
            {!aiGlossesPending && (
              <AITable
                glossesData={aiGlosses}
                currentGlossId={currentAIGlossId}
                onTableGlossClick={onAiGlossClick}
                onCreateGlossClick={onCreateGlossClick}
                onConnectWithSelected={onConnectWithSelectedClick}
                onSetHiddenClick={onSetHiddenClick}
              />
            )}
          </Grid>
        </>
      )}
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
            source={s.source}
          />
        ))}
      </Flex>
    </section>
  );
}
