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
} from "@radix-ui/themes";
import type { MemberOutput } from "../../types";
import { useParams } from "react-router-dom";
import { initTTS } from "../../utils/tts";
import { api } from "@/utils/api";
import Speakers from "@/components/Speakers";
import { Player } from "@/components/Player";
import { useRemoveSpeakerMutation } from "@/rq/useRemoveSpeakerMutation";

export const EditSentencePage: FC = () => {
  const [input, setInput] = useState("");
  const [rubyHtml, setRubyHtml] = useState("");
  const [textWithFuriganaHtml, setTextWithFuriganaHtml] = useState("");
  const [translation, setTranslation] = useState("");
  const [en, setEn] = useState("");
  const [ru, setRu] = useState("");
  const [openAiResponse, setOpenAiResponse] = useState("");
  const [openAiTranslation, setOpenAiTranslation] = useState("");
  const toastId = useRef<Id | null>(null);

  const { id } = useParams();

  const { data: sentence } = api.sentence.getById.useQuery(Number(id), {
    enabled: !!id,
  });

  const { data: members } = api.member.sentenceMembers.useQuery(
    { id: sentence?.id ?? 0 },
    {
      enabled: !!sentence?.id,
    },
  );

  const removeSpeakerMutation = useRemoveSpeakerMutation();
  const { data: analyzeData, mutate: analyze } =
    api.sentence.analyze.useMutation();

  useEffect(() => {
    if (analyzeData) {
      setTextWithFuriganaHtml(analyzeData.text_with_furigana);
      setRubyHtml(analyzeData.ruby);
    }
  }, [analyzeData]);

  const updateMutation = api.sentence.update.useMutation({
    onSuccess() {
      if (toastId.current) {
        toast.update(toastId.current, {
          type: "success",
          autoClose: 3000,
          render: "Successfully updated.",
        });
      }
    },
  });
  const { mutate: deleteMutation, isPending: isDeleting } =
    api.sentence.delete.useMutation();

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

  useEffect(() => {
    if (sentence) {
      setInput(sentence.text);
      setTranslation(sentence.translation ?? "");
      setRubyHtml(sentence.ruby ?? "");
      setTextWithFuriganaHtml(sentence.text_with_furigana ?? "");
      setEn(sentence.en ?? "");
      setRu(sentence.ru ?? "");
    }
  }, [sentence]);

  const onPlayAudio = async () => {
    await initTTS(input);
  };

  const onTrim = () => {
    setInput((i) => i.replace(new RegExp(" ", "g"), ""));
  };

  const onMemberClick = useCallback((m: MemberOutput) => {
    openUrl(`https://jisho.org/search/${m.basic_form}`);
  }, []);

  const handleUpdateData = () => {
    if (typeof id !== "string") {
      return;
    }
    toastId.current = toast("Sending...");
    updateMutation.mutate({
      id: id,
      input: {
        text: input,
        ruby: rubyHtml,
        translation,
        en,
        ru,
        text_with_furigana: textWithFuriganaHtml,
      },
    });
  };

  const handleDeleteData = () => {
    if (sentence) {
      deleteMutation(sentence.id);
    }
  };

  const onAnalyze = () => {
    void analyze(input);
  };

  const onRemoveSpeaker = () => {
    if (sentence) {
      void removeSpeakerMutation.mutate({ sentenceId: sentence.id });
    }
  };
  return (
    <Box>
      <Flex align="center" mr="5">
        <Heading size="5">Edit sentence</Heading>
      </Flex>
      {sentence && (
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

              <Button
                className="self-start"
                onClick={onAnalyze}
                disabled={input.length === 0}
                mb="4"
              >
                Analyze
              </Button>
              <Speakers sentenceId={sentence.id} input={input} />

              <DataList.Root mt="4">
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
                {sentence.vox_speaker_id && sentence.vox_file_path && (
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Speaker</DataList.Label>
                    <DataList.Value>
                      <Flex gap="2" align="center">
                        <div>{sentence.vox_speaker_id}</div>
                        <Player
                          filePath={sentence.vox_file_path}
                          speakerId={sentence.vox_speaker_id}
                        />
                        <Button
                          color="red"
                          variant="soft"
                          onClick={onRemoveSpeaker}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </DataList.Value>
                  </DataList.Item>
                )}
                <DataList.Item>
                  <DataList.Label minWidth="88px">Source</DataList.Label>
                  <DataList.Value>{sentence.source}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">
                    Unknown kanjis
                  </DataList.Label>
                  <DataList.Value>
                    {sentence.unknown_kanji_number}
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
                <Button color="red" onClick={handleDeleteData}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </Flex>
              <Flex direction="column" gap="4">
                <Flex direction="column" gapY="2">
                  <Heading size="4">Displayed as</Heading>
                  <Text
                    size="7"
                    className="font-klee"
                    dangerouslySetInnerHTML={{ __html: textWithFuriganaHtml }}
                  ></Text>
                  <TextArea
                    value={textWithFuriganaHtml}
                    mb="6"
                    onChange={(e) => setTextWithFuriganaHtml(e.target.value)}
                  />
                </Flex>
                <Flex direction="column" gapY="2">
                  <Heading size="4">Ruby</Heading>
                  <Text
                    size="7"
                    className="font-klee"
                    dangerouslySetInnerHTML={{
                      __html: rubyHtml,
                    }}
                  ></Text>
                  <TextArea
                    value={rubyHtml}
                    mb="6"
                    onChange={(e) => setRubyHtml(e.target.value)}
                  />
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
                {openAiLoading ? <Text>Loading...</Text> : null}
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
              {members?.map((m) => (
                <Flex key={m.basic_form} direction="column">
                  <Text
                    size="6"
                    onClick={() => onMemberClick(m)}
                    className="cursor-pointer whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: m.ruby ?? "",
                    }}
                  />
                  <Text className="select-none" size="2">
                    {m.en}
                  </Text>
                  <Box>
                    <Badge color="sky" size="1">
                      {m.pos}
                    </Badge>
                    {m.pos_detail_1 === "suffix" && (
                      <Badge color="red" size="1">
                        suffix
                      </Badge>
                    )}
                  </Box>
                </Flex>
              ))}
            </Grid>
          </Grid>

          <div>
            <Button
              disabled={updateMutation.isPending}
              color="lime"
              size="3"
              onClick={handleUpdateData}
            >
              Update
            </Button>
          </div>
          <Box className="mt-[600px]" />
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};
export default EditSentencePage;
