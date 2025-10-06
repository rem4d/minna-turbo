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
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { PropsWithChildren, useState } from "react";
import AITable from "./AITable";
import GlossTable from "./GlossTable";
import toast from "react-hot-toast";
import { useDebounce } from "@uidotdev/usehooks";
import { AdminSentenceOutput } from "@rem4d/api";

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
  const [glossesFilterValue, setGlossesFilterValue] = useState("");
  const debouncedValue = useDebounce(glossesFilterValue, 500);
  const [sentences, setSentences] = useState<AdminSentenceOutput[]>([]);

  const MAX_PER_PAGE = 20;
  const { data: glossesData, isLoading: glossesLoading } =
    api.admin.gloss.getGlosses.useQuery({
      limit: MAX_PER_PAGE,
      page: pageNumber,
      kana: debouncedValue,
    });

  const findAiSentences = api.admin.gloss.ai_getSentencesByGloss.useMutation({
    onSuccess(data) {
      setSentences(data);
    },
  });
  const findNormalGlossSentences =
    api.admin.gloss.getSentencesByGloss.useMutation({
      onSuccess(data) {
        // setSentences(data);
      },
    });

  const findByRegexMutation = api.admin.gloss.findByRegex.useMutation({
    onSuccess(data) {
      setAiGlosses(data);
    },
  });
  const createMutation = api.admin.gloss.createGloss.useMutation({
    onSuccess() {
      void utils.admin.gloss.getGlosses.invalidate();
      toast.success("Successfully created.");
    },
  });

  const connectGlosses = api.admin.gloss.connectGlosses.useMutation({
    onSuccess() {
      toast.success("Successfully connected.");
      findByRegexMutation.mutate({ regex: regexFieldValue });
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

  const sentencesLoading =
    findAiSentences.isPending || findNormalGlossSentences.isPending;

  const setHiddenMutation = api.admin.gloss.setHidden.useMutation({
    onSuccess() {
      toast.success("Success.");
      findByRegexMutation.mutate({ regex: regexFieldValue });
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
    setCurrentAIGlossId(null);
    const found = glossesData?.find((g) => g.id === id);
    // setRegexFieldValue(found?.kana?.slice(1) ?? "");
    void findByGlossIdMutation.mutate({ glossId: id });
    void findNormalGlossSentences.mutate({ glossId: id });
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
      toast.error("No selected gloss id.");
      return;
    }
    connectGlosses.mutate({ glossId: currentGlossId, aiGlossId: id });
    console.log("Connect with selected gloss: ", id);
  };

  const onSetHiddenClick = (id: number) => {
    setHiddenMutation.mutate(id);
  };
  const aiSentences = findAiSentences.data ?? [];

  return (
    <section>
      <Grid mb="8" columns="2" gap="4">
        <Box>
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
            <TextField.Root
              onChange={(e) => setGlossesFilterValue(e.target.value)}
              value={glossesFilterValue}
              placeholder="Search..."
            />
          </Flex>
          {glossesLoading && <Spinner />}
          {!glossesLoading && glossesData?.length === 0 && (
            <Text>No glosses found.</Text>
          )}
        </Box>
        <Box>
          <Flex gap="2">
            <TextField.Root
              onChange={(e) => setRegexFieldValue(e.target.value)}
              value={regexFieldValue}
              placeholder="Search..."
            />
            <Button onClick={onFindSimilarAis}>Search</Button>
          </Flex>
          {aiGlossesPending && <Spinner />}
          {!aiGlossesPending && (
            <Flex direction="column" gap="1">
              <Text size="1">
                <Text size="2">{aiGlosses.length}</Text> AI glosses found.
              </Text>
            </Flex>
          )}
        </Box>
        <ScrollAreaFn>
          {!glossesLoading && glossesData && glossesData.length > 0 && (
            <GlossTable
              glossesData={glossesData}
              currentGlossId={currentGlossId}
              onTableGlossClick={onTableGlossClick}
            />
          )}
        </ScrollAreaFn>
        <ScrollAreaFn>
          {!aiGlossesPending && (
            <AITable
              glossesData={aiGlosses}
              currentGlossId={currentAIGlossId}
              currentLeftTableGlossId={currentGlossId}
              onTableGlossClick={onAiGlossClick}
              onCreateGlossClick={onCreateGlossClick}
              onConnectWithSelected={onConnectWithSelectedClick}
              onSetHiddenClick={onSetHiddenClick}
            />
          )}
        </ScrollAreaFn>
      </Grid>
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
    </section>
  );
}

const ScrollAreaFn = ({ children }: PropsWithChildren) => {
  return (
    <ScrollArea.Root className="w-full h-[600px] relative overflow-hidden">
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
