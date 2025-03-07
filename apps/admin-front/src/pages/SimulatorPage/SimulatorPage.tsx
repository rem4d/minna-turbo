// import {
//   Box,
//   Text,
//   Button,
//   Heading,
//   Flex,
//   Grid,
//   Badge,
//   DataList,
//   Code,
//   Switch,
//   Link,
//   IconButton,
// } from "@radix-ui/themes";
// import { useEffect, useState } from "react";
// import { initTTS } from "@/utils/tts";
// import { api } from "@/utils/api";
// import useUnmount from "@/hooks/useUnmount";
// import { ThickArrowLeftIcon, ThickArrowRightIcon } from "@radix-ui/react-icons";
// import MainScreen from "./MainScreen";

export const SimulatorPage = () => {
  return <div>none</div>;
  /*
  const [activeIndex, setActiveIndex] = useState(0);
  const [lang, setLang] = useState<"en" | "ru">("en");
  const [seenIds, setSeenIds] = useState<number[]>([]);

  const { data: list, isLoading: loadingSentence } =
    api.admin.sentence.getRandomized.useQuery({
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

  const onPlayAudio = () => {
    if (list?.[activeIndex]?.text) {
      // await initVoicevox(list[activeIndex].text);
      void initTTS(list[activeIndex].text);
    } else {
      console.log("No element!");
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
      {!loadingSentence && list && list.length > 0 && sentence ? (
        <Grid columns="2" gapX="4">
          <Flex direction="column" align="start">
            <Flex mb="4" gap="2" align="center">
              <Button variant="soft" onClick={onPlayAudio}>
                Play audio
              </Button>
              <Link href={`/edit/${sentence.id}`} color="yellow">
                Edit
              </Link>
            </Flex>
            <Flex gap="2" mb="4">
              <IconButton
                variant="surface"
                disabled={activeIndex === 0}
                onClick={handlePrevClick}
              >
                <ThickArrowLeftIcon />
              </IconButton>
              <IconButton
                variant="surface"
                disabled={activeIndex === list.length - 1}
                onClick={handleNextClick}
              >
                <ThickArrowRightIcon />
              </IconButton>
            </Flex>

            <MainScreen lang={lang} sentence={sentence} />
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
    */
};
export default SimulatorPage;
