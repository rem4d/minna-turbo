import { useCallback, useEffect, useState, useRef } from "react";
import type { FC } from "react";
import type { Id } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import { openUrl } from "../../utils";
import {
  Flex,
  Text,
  Button,
  Heading,
  Box,
  TextArea,
  Grid,
  Badge,
  DataList,
  Code,
  Spinner,
} from "@radix-ui/themes";
import type { MemberOutput } from "../../types";
import { initTTS } from "../../utils/tts";
import { api } from "@/utils/api";

export const NewSentencePage: FC = () => {
  const [input, setInput] = useState("");
  const [rubyHtml, setRubyHtml] = useState("");
  const [textWithFuriganaHtml, setTextWithFuriganaHtml] = useState("");
  const [translation, setTranslation] = useState("");
  const [en, setEn] = useState("");
  const [ru, setRu] = useState("");
  const [openAiResponse, setOpenAiResponse] = useState("");
  const [openAiTranslation, setOpenAiTranslation] = useState("");
  const toastId = useRef<Id | null>(null);
  // const [sentence, setSentence] = useState<Sentence | null>(null);

  const { data: analyzeData, mutate: analyze } =
    api.sentence.analyze.useMutation();

  const { data: members } = api.member.sentenceMembers.useQuery(
    { text: input },
    {
      enabled: !!input && !!analyzeData,
    },
  );
  const createMutation = api.sentence.create.useMutation({
    onSuccess() {
      if (toastId.current) {
        toast.update(toastId.current, {
          type: "success",
          autoClose: 3000,
          render: "Successfully created.",
        });
      }
    },
  });

  const { mutate: checkGrammar, isPending: openAiLoading } =
    api.openAi.check.useMutation({
      onSuccess(data) {
        setOpenAiResponse(data);

        const m = /ranslat[^"]*"([^"\\]*)/.exec(data);

        if (m && m.length > 0) {
          const last = m[m.length - 1];
          if (last) {
            setOpenAiTranslation(last.replace(/"/g, ""));
          }
        }
      },
    });

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
    toastId.current = toast("Submitted.");
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
          <div>
            <Flex direction="column" align="start" gap="4">
              <Button onClick={() => checkGrammar(input)}>
                Check via OpenAI
              </Button>
              {openAiResponse && (
                <Heading size="4" mb="4">
                  OpenAI response
                </Heading>
              )}
              {openAiLoading ? <Spinner /> : null}
              {/* {!correct && !openAiLoading && openAiResponse ? ( */}
              {/*   <Badge color="red">Incorrect</Badge> */}
              {/* ) : null} */}
              {/* {correct && !openAiLoading ? ( */}
              {/*   <Badge color="green">Correct</Badge> */}
              {/* ) : null} */}
              {openAiResponse && (
                <TextArea
                  className="w-full"
                  rows={4}
                  value={openAiTranslation}
                />
              )}
              {openAiResponse ? (
                <Box mt="2">
                  <Text>{openAiResponse}</Text>
                </Box>
              ) : null}
            </Flex>
          </div>
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
            {members?.members.map((m) => (
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
                <Box>
                  <Badge color="sky" size="1">
                    {m.pos}
                  </Badge>
                </Box>
              </Flex>
            ))}
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
      <ToastContainer />
    </Box>
  );
};
export default NewSentencePage;
