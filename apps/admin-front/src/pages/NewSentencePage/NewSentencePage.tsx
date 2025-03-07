import { useCallback, useState } from "react";
import type { FC } from "react";
import { openUrl } from "../../utils";
import {
  Flex,
  Text,
  Button,
  Heading,
  Box,
  TextArea,
  Grid,
  DataList,
} from "@radix-ui/themes";
import type { MemberOutput } from "../../types";
import { initTTS } from "../../utils/tts";
import { api } from "@/utils/api";

export const NewSentencePage: FC = () => {
  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState("");
  const [en, setEn] = useState("");
  const [ru, setRu] = useState("");
  // const [sentence, setSentence] = useState<Sentence | null>(null);

  const { data: analyzeData, mutate: analyze } =
    api.admin.sentence.analyze.useMutation();

  const createMutation = api.admin.sentence.create.useMutation({});

  const onPlayAudio = async () => {
    await initTTS(input);
  };

  const onTrim = () => {
    setInput((i) => i.replace(new RegExp(" ", "g"), ""));
  };

  const onMemberClick = useCallback((m: MemberOutput) => {
    openUrl(`https://jisho.org/search/${m.basic_form}`);
  }, []);

  const onAnalyze = () => {
    void analyze(input);
  };

  const handleCreateSubmit = () => {
    if (analyzeData) {
      createMutation.mutate({
        input: {
          text: input,
          ruby: analyzeData.ruby,
          level: analyzeData.level,
          unknown_kanji_number: analyzeData.unknown_kanji_number,
          text_with_furigana: analyzeData.text_with_furigana,
          translation,
          en,
          ru,
          source: "challenge",
        },
      });
    }
  };

  return (
    <Box>
      <Flex align="center" mr="5">
        <Heading size="5">Create sentence</Heading>
      </Flex>
      <Box>
        <Grid className="" columns="2" gap="4">
          <Flex direction="column">
            <TextArea
              mt="6"
              mb="6"
              rows={7}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste some text..."
            />

            <Button onClick={onAnalyze} disabled={input.length === 0}>
              Analyze
            </Button>
            <DataList.Root>
              <DataList.Item></DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Level</DataList.Label>
                <DataList.Value>{analyzeData?.level}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Source</DataList.Label>
                <DataList.Value>{"challenge"}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Unknown kanjis</DataList.Label>
                <DataList.Value>
                  {analyzeData?.unknown_kanji_number}
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>
          <Flex direction="column" gap="4">
            <Box>
              <Heading size="5">Translation</Heading>
              <TextArea
                rows={4}
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
              />
            </Box>
            <Box>
              <Heading size="5">en</Heading>
              <TextArea
                rows={4}
                value={en}
                onChange={(e) => setEn(e.target.value)}
              />
            </Box>
            <Box>
              <Heading size="5">ru</Heading>
              <TextArea
                rows={4}
                value={ru}
                onChange={(e) => setRu(e.target.value)}
              />
            </Box>
          </Flex>
        </Grid>
        <Grid className="" mt="6" columns="2" gap="2">
          <Flex direction="column" justify="start">
            <Flex gap="2" mb="7">
              <Button onClick={onPlayAudio}>Play audio</Button>
              <Button onClick={onTrim}>Trim</Button>
            </Flex>
            <Flex direction="column" gap="4">
              <Flex direction="column" gapY="2">
                <Heading size="4">Displayed as</Heading>
                <Text
                  size="7"
                  className="font-klee"
                  dangerouslySetInnerHTML={{
                    __html: analyzeData?.text_with_furigana ?? "",
                  }}
                ></Text>
                {/* <TextArea */}
                {/*   value={textWithFuriganaHtml} */}
                {/*   mb="6" */}
                {/*   onChange={(e) => setTextWithFuriganaHtml(e.target.value)} */}
                {/* /> */}
              </Flex>
              <Flex direction="column" gapY="2">
                <Heading size="4">Ruby</Heading>
                <Text
                  size="7"
                  className="font-klee"
                  dangerouslySetInnerHTML={{
                    __html: analyzeData?.ruby ?? "",
                  }}
                ></Text>
                {/* <TextArea */}
                {/*   value={rubyHtml} */}
                {/*   mb="6" */}
                {/*   onChange={(e) => setRubyHtml(e.target.value)} */}
                {/* /> */}
              </Flex>
            </Flex>
          </Flex>
        </Grid>

        <Grid columns="3" my="8" className="">
          <Grid
            columns="4"
            gridColumn="span 2"
            className="font-klee text-xl"
            gap="4"
          >
            {/* <div className="col-span-4"> */}
            {/*   <Flex direction="column" gapY="4" align="start"> */}
            {/*     <Button onClick={onTokenizeClick}>Tokenize</Button> */}
            {/*     <Text */}
            {/*       size="6" */}
            {/*       dangerouslySetInnerHTML={{ */}
            {/*         __html: tokenizedHtml, */}
            {/*       }} */}
            {/*     /> */}
            {/*     <Heading size="4">Members</Heading> */}
            {/*   </Flex> */}
            {/* </div> */}
          </Grid>
        </Grid>

        <div>
          <Button
            disabled={createMutation.isPending}
            color="lime"
            size="3"
            onClick={handleCreateSubmit}
          >
            Create
          </Button>
        </div>
        <Box className="mt-[600px]" />
      </Box>
    </Box>
  );
};
export default NewSentencePage;
