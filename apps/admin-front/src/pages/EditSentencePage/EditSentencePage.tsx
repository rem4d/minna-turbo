import { Fragment, useCallback, useEffect, useState } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
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
import { useNavigate, useParams } from "react-router-dom";
import { initTTS } from "../../utils/tts";
import { api } from "@/utils/api";
import Speakers from "@/components/Speakers";
import { Player } from "@/components/Player";
import { useRemoveSpeakerMutation } from "@/rq/useRemoveSpeakerMutation";
import { useSubmitVoiceMutation } from "@/rq/useSubmitVoiceMutation";
import GrammarGlosses from "./GrammarGlosses";
import { GlossVisualizer } from "@/components/GlossVisualizer";

export const EditSentencePage: FC = () => {
  const [input, setInput] = useState("");
  const [rubyHtml, setRubyHtml] = useState("");
  const [textWithFuriganaHtml, setTextWithFuriganaHtml] = useState("");
  const [translation, setTranslation] = useState("");
  const [en, setEn] = useState("");
  const [ru, setRu] = useState("");
  const [comment, setComment] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sentence } = api.admin.sentence.getById.useQuery(Number(id), {
    enabled: !!id,
  });

  const { data: members2 } = api.admin.member.sentenceMembers2.useQuery(
    { id: sentence?.id ?? 0 },
    {
      enabled: !!sentence?.id,
    },
  );

  const { data: glosses2, isLoading: glossesLoading } =
    api.admin.sentence.glosses2.useQuery(
      { id: sentence?.id ?? 0 },
      {
        enabled: !!sentence?.id,
      },
    );

  const { data: kanjisInTheSentence } =
    api.admin.member.sentenceKanjis.useQuery(
      { id: sentence?.id ?? 0 },
      {
        enabled: !!sentence?.id,
      },
    );

  const utils = api.useUtils();

  const submitVoiceMutation = useSubmitVoiceMutation({
    onSuccess() {
      toast.success("Successfully assigned speaker.");
      void utils.admin.sentence.getById.invalidate();
    },
  });

  const removeSpeakerMutation = useRemoveSpeakerMutation({
    onSuccess() {
      toast.success("Successfully removed speaker.");
      void utils.admin.sentence.getById.invalidate();
    },
  });

  const { data: analyzeData, mutate: analyze } =
    api.admin.sentence.analyze.useMutation({
      onSuccess() {
        toast.success("Got response.");
        void utils.admin.sentence.getById.invalidate();
      },
    });

  useEffect(() => {
    if (analyzeData) {
      setTextWithFuriganaHtml(analyzeData.text_with_furigana);
      setRubyHtml(analyzeData.ruby);
    }
  }, [analyzeData]);

  const updateMutation = api.admin.sentence.update.useMutation({
    onSuccess() {
      toast.success("Successfully updated.");
      void utils.admin.sentence.getById.invalidate();
    },
    onError() {
      toast.error("Unexpected error during update.");
    },
  });

  const { mutate: deleteMutation, isPending: isDeleting } =
    api.admin.sentence.delete.useMutation({
      onSuccess() {
        void navigate("/");
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
      setComment(sentence.comment ?? "");
    }
  }, [sentence]);

  const onPlayAudio = async () => {
    await initTTS(input);
  };

  const onTrim = () => {
    setInput((i) => i.replace(new RegExp(" ", "g"), ""));
  };

  const handleUpdateData = () => {
    if (typeof id !== "string") {
      return;
    }

    updateMutation.mutate({
      id: id,
      input: {
        text: input,
        ruby: rubyHtml,
        translation,
        en,
        ru,
        comment,
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

  const onSubmitSpeaker = ({
    speaker,
    speed,
  }: {
    speaker: number;
    speed: number;
  }) => {
    if (sentence?.id) {
      submitVoiceMutation.mutate({
        text: input,
        speed,
        sentenceId: sentence.id,
        speaker,
      });
    }
  };

  const grammarifyMutation = api.admin.gloss.grammarify.useMutation({
    onSuccess() {
      toast.success("Successfully grammarified.");
      void utils.admin.sentence.glosses2.invalidate();
    },
    onError(msg) {
      toast.error(JSON.stringify(msg.message.slice(0, 100)));
    },
  });
  const showGrammarSpinner = glossesLoading || grammarifyMutation.isPending;

  const onGrammarifyClick = () => {
    if (sentence && sentence.id) {
      grammarifyMutation.mutate({ sentenceId: sentence.id });
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
              <Speakers
                input={input}
                onSubmit={onSubmitSpeaker}
                isPending={submitVoiceMutation.isPending}
              />

              <DataList.Root mt="4">
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">Status</DataList.Label>
                  <DataList.Value>
                    <Badge color="yellow" variant="soft" radius="full">
                      {sentence.status}
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
                  <DataList.Label minWidth="88px">Speaker</DataList.Label>
                  <DataList.Value>
                    {submitVoiceMutation.isPending && <Spinner />}
                    {!submitVoiceMutation.isPending ? (
                      sentence.vox_speaker_id && sentence.vox_file_path ? (
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
                      ) : (
                        <>N/A</>
                      )
                    ) : null}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Source</DataList.Label>
                  <DataList.Value>
                    {sentence.source}{" "}
                    {sentence.source === "source1" && sentence.tmp}
                  </DataList.Value>
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
              <Box mt="8">
                <Button onClick={onGrammarifyClick}>Grammarify</Button>
                <Box mt="4">
                  {showGrammarSpinner && <Spinner />}
                  {!showGrammarSpinner &&
                    glosses2 &&
                    glosses2.length > 0 &&
                    glosses2.map((g) => (
                      <Flex gap="2" key={g.id}>
                        <Text
                          weight="bold"
                          size="2"
                          className="whitespace-nowrap"
                        >
                          {g.kana}
                        </Text>
                        <Text size="2">{g.comment}</Text>
                        <Text size="2">
                          {g.start},{g.end}
                        </Text>
                      </Flex>
                    ))}
                  {!showGrammarSpinner && glosses2 && glosses2.length === 0 && (
                    <Text>No glosses found.</Text>
                  )}
                  <GlossVisualizer text={sentence.text} glosses={glosses2} />
                </Box>
              </Box>
            </Flex>
            <Flex direction="column" gap="4" className="">
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
              <Box>
                <Heading size="5">comment</Heading>
                <TextArea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Box>
              <GrammarGlosses sentenceId={sentence?.id} />
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
          </Grid>

          {members2 && members2.length > 0 && (
            <Box>
              <Heading size="5">Members</Heading>
              <Grid columns="3" my="8" className="">
                <Grid
                  columns="4"
                  gridColumn="span 2"
                  className="font-klee text-xl"
                  gap="4"
                >
                  {members2?.map((m) => (
                    <Flex key={m.basic_form} direction="column">
                      {/* <Text */}
                      {/*   size="6" */}
                      {/*   onClick={() => onMemberClick(m.basic_form)} */}
                      {/*   className="cursor-pointer whitespace-nowrap" */}
                      {/*   dangerouslySetInnerHTML={{ */}
                      {/*     __html: m.members.ruby ?? "", */}
                      {/*   }} */}
                      {/* /> */}
                      <Text size="1">{m.reading}</Text>
                      <Text className="" size="6">
                        {m.pos === "auxiliary verb" || m.pos === "auxiliary" ? (
                          <>
                            {m.original} <Text size="2">({m.basic_form})</Text>
                          </>
                        ) : (
                          m.basic_form
                        )}
                      </Text>
                      <Text className="select-none" size="2">
                        {m.en}
                      </Text>
                      <Text className="select-none" size="2">
                        {m.ru}
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
            </Box>
          )}
          <Heading size="5">Kanjis in the sentence</Heading>
          <Box>
            <Flex my="8" className="">
              {kanjisInTheSentence?.map((m) => (
                <Text size="6" key={m.id}>
                  {m.kanji}
                </Text>
              ))}
            </Flex>
          </Box>

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
    </Box>
  );
};
export default EditSentencePage;
