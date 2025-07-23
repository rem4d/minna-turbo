import { useCallback, useEffect, useState } from "react";
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
import type { MemberOutput } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import { initTTS } from "../../utils/tts";
import { api } from "@/utils/api";
import Speakers from "@/components/Speakers";
import { Player } from "@/components/Player";
import { useRemoveSpeakerMutation } from "@/rq/useRemoveSpeakerMutation";
import { useSubmitVoiceMutation } from "@/rq/useSubmitVoiceMutation";

export const EditSentencePage: FC = () => {
  const [input, setInput] = useState("");
  const [rubyHtml, setRubyHtml] = useState("");
  const [textWithFuriganaHtml, setTextWithFuriganaHtml] = useState("");
  const [translation, setTranslation] = useState("");
  const [en, setEn] = useState("");
  const [ru, setRu] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sentence } = api.admin.sentence.getById.useQuery(Number(id), {
    enabled: !!id,
  });

  const { data: members } = api.admin.member.sentenceMembers.useQuery(
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

  const reassignMembersMutation = api.admin.member.reassignMembers.useMutation({
    onSuccess() {
      toast.success("Successfully reassigned.");
      void utils.admin.member.sentenceMembers.invalidate();
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
    }
  }, [sentence]);

  const onPlayAudio = async () => {
    await initTTS(input);
  };

  const onTrim = () => {
    setInput((i) => i.replace(new RegExp(" ", "g"), ""));
  };

  const onMemberClick = useCallback((bs: string) => {
    openUrl(`https://jisho.org/search/${bs}`);
  }, []);

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
  const handleReassignMembers = () => {
    if (sentence) {
      reassignMembersMutation.mutate({ id: sentence.id });
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
                <Flex key={m.members.basic_form} direction="column">
                  <Text
                    size="6"
                    onClick={() => onMemberClick(m.members.basic_form)}
                    className="cursor-pointer whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: m.members.ruby ?? "",
                    }}
                  />
                  <Text className="select-none" size="2">
                    {m.members.en}
                  </Text>
                  <Box>
                    <Badge color="sky" size="1">
                      {m.members.pos}
                    </Badge>
                    {m.members.pos_detail_1 === "suffix" && (
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
              disabled={reassignMembersMutation.isPending}
              color="cyan"
              size="3"
              onClick={handleReassignMembers}
            >
              Reassign members
            </Button>
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
