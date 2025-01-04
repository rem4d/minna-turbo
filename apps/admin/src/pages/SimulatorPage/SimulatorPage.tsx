import { SentenceMemberOutput } from "../../types";
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
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { initTTS } from "@/utils/tts";
import { openUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";

export const SimulatorPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(false);

  const { data: list, isLoading: loadingSentence } =
    api.sentence.getRandomized.useQuery({
      level: 80,
    });
  const sentence = list?.[activeIndex];

  const navigate = useNavigate();

  const { data: members, isLoading: loadingMembers } =
    api.member.sentenceMembers.useQuery(
      { text: sentence?.text ?? "" },
      {
        enabled: !!sentence?.text,
      },
    );

  const onPlayAudio = async () => {
    if (list && list[activeIndex] && list[activeIndex].text) {
      // await initVoicevox(list[activeIndex].text);
      await initTTS(list[activeIndex].text);
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
              <Button
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex(activeIndex - 1)}
              >
                Prev
              </Button>
              <Button
                disabled={activeIndex === list.length - 1}
                onClick={() => setActiveIndex(activeIndex + 1)}
              >
                Next
              </Button>
            </Flex>
            <Flex gap="2">
              <Button onClick={onPlayAudio}>Play audio</Button>
              <Button
                color="yellow"
                onClick={() => navigate("/edit/" + sentence.id)}
              >
                Edit
              </Button>
              <Button color="gold" onClick={onShowFurigana}>
                {showFurigana ? "Hide furigana" : "Show furigana"}
              </Button>
            </Flex>
            {showFurigana ? (
              <Text
                size="6"
                dangerouslySetInnerHTML={{
                  __html: list[activeIndex].ruby ?? "",
                }}
              />
            ) : (
              <Text
                size="6"
                dangerouslySetInnerHTML={{
                  __html: list[activeIndex].text_with_furigana ?? "",
                }}
              />
            )}
            {loadingMembers && <span>Loading members...</span>}
            <Grid columns="4" className="font-klee text-xl" gap="4">
              {!loadingMembers &&
                members?.members &&
                members.members.map((m) => (
                  <Flex key={m.basic_form} direction="column">
                    <Text
                      size="6"
                      onClick={() => onMemberClick(m)}
                      className="cursor-pointer whitespace-nowrap"
                      dangerouslySetInnerHTML={{
                        __html: m.html,
                      }}
                    />
                    <Text className="select-none" size="2">
                      {m.meaning}
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
            <Text>ru: {sentence.ru}</Text>
            <Text>en: {sentence.translation}</Text>
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
          </Flex>
        </Grid>
      ) : null}
    </Box>
  );
};
export default SimulatorPage;
