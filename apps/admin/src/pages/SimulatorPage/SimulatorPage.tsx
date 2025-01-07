import type { SentenceMemberOutput } from "../../types";
import {
  Box,
  Text,
  Button,
  Heading,
  Flex,
  Grid,
  Badge,
  DataList,
  Code,
  Switch,
  Spinner,
} from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { initTTS } from "@/utils/tts";
import { openUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import useUnmount from "@/hooks/useUnmount";

export const SimulatorPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);
  const [lang, setLang] = useState<"en" | "ru">("en");
  const [seenIds, setSeenIds] = useState<number[]>([]);

  const { data: list, isLoading: loadingSentence } =
    api.sentence.getRandomized.useQuery({
      level: 96,
    });
  const sentence = list?.[activeIndex];
  const markAsSeenMutation = api.sentence.markAsSeen.useMutation();

  useUnmount(() => {
    if (seenIds.length > 0) {
      markAsSeenMutation.mutate({ ids: seenIds });
    }
  });

  useEffect(() => {
    if (sentence && !seenIds.includes(sentence.id)) {
      setSeenIds((ids) => ids.concat(sentence.id));
    }
  }, [sentence, seenIds]);

  const navigate = useNavigate();

  const { data: members, isLoading: loadingMembers } =
    api.member.sentenceMembers.useQuery(
      { text: sentence?.text ?? "" },
      {
        enabled: !!sentence?.text,
      },
    );

  const onPlayAudio = () => {
    if (list?.[activeIndex]?.text) {
      // await initVoicevox(list[activeIndex].text);
      void initTTS(list[activeIndex].text);
    } else {
      console.log("No element!");
    }
  };

  const onMemberClick = useCallback((m: SentenceMemberOutput) => {
    openUrl(`https://jisho.org/search/${m.basic_form}`);
  }, []);

  const onShowFurigana = () => {
    setShowFurigana(!showFurigana);
  };

  const handleEditClick = () => {
    if (sentence) {
      void navigate("/edit/" + sentence.id);
    }
  };

  const handleSwitchChange = () => {
    setLang(lang === "en" ? "ru" : "en");
  };

  const handlePrevClick = () => {
    setActiveIndex(activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex + 1);
  };

  return (
    <Box>
      <Heading>SimulatorPage</Heading>
      <div>{loadingSentence ? "Loading..." : <>&nbsp;</>}</div>
      {!loadingSentence &&
      list &&
      list.length > 0 &&
      list[activeIndex] &&
      sentence ? (
        <Grid columns="2">
          <Flex direction="column" align="start" gapY="4">
            <Flex gap="2" mb="4">
              <Button disabled={activeIndex === 0} onClick={handlePrevClick}>
                Prev
              </Button>
              <Button
                disabled={activeIndex === list.length - 1}
                onClick={handleNextClick}
              >
                Next
              </Button>
            </Flex>
            <Flex gap="2">
              <Button onClick={onPlayAudio}>Play audio</Button>
              <Button color="yellow" onClick={handleEditClick}>
                Edit
              </Button>
              <Button color="gold" onClick={onShowFurigana}>
                {showFurigana ? "Hide furigana" : "Show furigana"}
              </Button>
            </Flex>
            <Box className="mt-2">
              <span className="font-klee">
                {showFurigana ? (
                  <Text
                    className="relative top-0"
                    size="6"
                    dangerouslySetInnerHTML={{
                      __html: list[activeIndex].ruby ?? "",
                    }}
                  />
                ) : (
                  <Text
                    className="relative top-2"
                    size="6"
                    dangerouslySetInnerHTML={{
                      __html: list[activeIndex].text_with_furigana ?? "",
                    }}
                  />
                )}
              </span>
            </Box>
            <div className="w-full mt-8" />
            {loadingMembers && <Spinner />}
            <Grid columns="4" className="font-klee text-xl" gap="4">
              {!loadingMembers &&
                members?.members.map((m) => (
                  <Flex key={m.basic_form} direction="column">
                    <Text
                      size="6"
                      onClick={() => onMemberClick(m)}
                      className="cursor-pointer whitespace-nowrap"
                      dangerouslySetInnerHTML={{
                        __html: m.html,
                      }}
                    />
                    <Text className="font-inter" size="2">
                      {lang === "en" ? m.meaning : m.ru ? m.ru : m.meaning}
                    </Text>
                    <Box mt="2">
                      <Badge color="sky" size="1">
                        {m.pos}
                      </Badge>
                      {m.pos_detail_1 === "suffix" ? (
                        <Badge color="red" size="1">
                          {m.pos_detail_1}
                        </Badge>
                      ) : null}
                    </Box>
                  </Flex>
                ))}
            </Grid>
            {lang === "ru" && <Text>ru: {sentence.ru}</Text>}
            {lang === "en" && <Text>en: {sentence.en}</Text>}
            <Text>tr: {sentence.translation}</Text>
          </Flex>
          <Flex direction="column" gap="6">
            <DataList.Root>
              <DataList.Item align="center">
                <DataList.Label minWidth="88px">Status</DataList.Label>
                <DataList.Value>
                  <Badge color="jade" variant="soft" radius="full">
                    Checked
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">ID</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Code variant="ghost">{sentence.id}</Code>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Level</DataList.Label>
                <DataList.Value>{sentence.level}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Unknown kanjis</DataList.Label>
                <DataList.Value>{sentence.unknown_kanji_number}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Source</DataList.Label>
                <DataList.Value>{sentence.source}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
            <Text size="3">{lang}</Text>
            <Switch
              checked={lang === "en"}
              onCheckedChange={handleSwitchChange}
            />
          </Flex>
        </Grid>
      ) : null}
    </Box>
  );
};
export default SimulatorPage;
