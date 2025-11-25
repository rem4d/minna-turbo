import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { Player } from "@/components/Player";
import Speakers from "@/components/Speakers";
import { useRemoveSpeakerMutation } from "@/rq/useRemoveSpeakerMutation";
import { useSubmitVoiceMutation } from "@/rq/useSubmitVoiceMutation";
import { api } from "@/utils/api";
import {
  Badge,
  Box,
  Button,
  Code,
  DataList,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  TextArea,
} from "@radix-ui/themes";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { AdminMemberOutput } from "@rem4d/api";
import { ReadingPositionItem, TextVisualizer } from "@rem4d/ui";

import { initTTS } from "../../utils/tts";
import Members from "./Members";

export const EditSentencePage: FC = () => {
  const [input, setInput] = useState("");
  const [rubyHtml, setRubyHtml] = useState("");
  const [translation, setTranslation] = useState("");
  const [en, setEn] = useState("");
  const [ru, setRu] = useState("");
  const [comment, setComment] = useState("");
  const [members3, setMembers3] = useState<AdminMemberOutput[]>([]);

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

  const { data: members } = api.admin.member.membersById.useQuery(
    { id: sentence?.id ?? 0 },
    {
      enabled: !!sentence?.id,
    },
  );

  const assignMembersMutation = api.admin.member.assignMembers.useMutation({
    onSuccess() {
      toast.success("Successfully assigned members.");
      void utils.admin.member.membersById.invalidate();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const { data: glosses, isLoading: glossesLoading } =
    api.admin.sentence.glosses.useQuery(
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

  // const { data: furigana } = api.admin.sentence.getFurigana.useQuery(
  //   {
  //     text: sentence?.text ?? "",
  //   },
  //   { enabled: !!sentence?.text },
  // );

  useEffect(() => {
    if (analyzeData) {
      // setTextWithFuriganaHtml(analyzeData.text_with_furigana);
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
      // setTextWithFuriganaHtml(sentence.text_with_furigana ?? "");
      setEn(sentence.en ?? "");
      setRu(sentence.ru ?? "");
      setComment(sentence.comment ?? "");
    }
  }, [sentence]);

  const readings = useMemo(() => {
    const txt = sentence?.text_with_furigana ?? "";
    if (!txt) return [];

    try {
      const arr = JSON.parse(txt) as ReadingPositionItem[];
      return arr;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [sentence?.text_with_furigana]);

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
      id: Number(id),
      input: {
        text: input,
        ruby: rubyHtml,
        translation,
        en,
        ru,
        comment,
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

  const onGetFurigana = () => {
    // void getFurigana(input);
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
      void utils.admin.sentence.glosses.invalidate();
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

  const onAssignMembersClick = () => {
    if (sentence) {
      assignMembersMutation.mutate({ text: input, sentenceId: sentence?.id });
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
                <Box mt="4" py="2">
                  {showGrammarSpinner && <Spinner />}
                  {!showGrammarSpinner &&
                    glosses &&
                    glosses.length > 0 &&
                    glosses.map((g) => (
                      <Flex gap="2" key={g.id}>
                        <Text
                          weight="bold"
                          size="2"
                          className="whitespace-nowrap"
                        >
                          {g.kana}
                        </Text>
                        <Text
                          weight="bold"
                          size="2"
                          className="whitespace-nowrap"
                        >
                          {g.code}
                        </Text>
                        <Text
                          weight="bold"
                          size="2"
                          className="whitespace-nowrap"
                        >
                          {g.romaji}
                        </Text>
                        <Text size="2">{g.comment}</Text>
                        <Text size="2">
                          {g.start},{g.end}
                        </Text>
                      </Flex>
                    ))}
                  <Box mb="8" />
                  {!showGrammarSpinner && glosses && glosses.length === 0 && (
                    <Text>No glosses found.</Text>
                  )}
                  {glosses && (
                    <div className="flex flex-wrap items-end">
                      <TextVisualizer
                        text={sentence.text}
                        readings={readings}
                        glosses={glosses}
                        variant="color"
                        showReadings={true}
                        showGlosses={true}
                      />
                    </div>
                  )}
                  {/* <GlossVisualizer text={sentence.text} glosses={glosses2} /> */}
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
              {/* <GrammarGlosses sentenceId={sentence?.id} /> */}
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

                <Flex direction="column" justify="start">
                  <Button
                    onClick={onGetFurigana}
                    disabled={input.length === 0}
                    mb="4"
                  >
                    Get furigana
                  </Button>
                  {/* <TextVisualizer text={input} furigana={furigana} /> */}
                </Flex>
              </Flex>
            </Flex>
          </Grid>
          {members2 && members2.length > 0 && (
            <MembersOld n={2} members={members2} sentenceId={sentence?.id} />
          )}
          {members3 && members3.length > 0 && (
            <MembersNew
              n={3}
              members={members3}
              sentenceId={sentence?.id}
              showRuby
            />
          )}
          {members && members.length > 0 && <Members members={members} />}
          <Button onClick={onAssignMembersClick}> Assign members</Button>

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

const MemberItem = ({ entry }: { entry: AdminMemberOutput["entries"][0] }) => {
  const [showMeaning, setShowMeaning] = useState(false);
  return (
    <div
      className="relative rounded-md bg-slate-500/9 p-2"
      onClick={() => setShowMeaning(!showMeaning)}
    >
      <Flex direction="column">
        <Text size="3" truncate>
          {entry.text}
        </Text>
        <Text size="1">({entry.reading})</Text>
      </Flex>
      <Box className="absolute top-0 right-2">
        <Flex direction="column" gap="1">
          {entry.pos !== "VERB" ? (
            <Badge color="sky" size="1">
              {entry.pos}
            </Badge>
          ) : (
            <Badge color="green" size="1">
              {entry.pattern_match}
            </Badge>
          )}
          {entry.is_crush && (
            <Badge color="bronze" size="1">
              crush
            </Badge>
          )}
          {entry.is_different_reading && (
            <Badge color="yellow" size="1">
              different reading
            </Badge>
          )}
          {entry.is_hidden && (
            <Badge color="bronze" size="1">
              hidden
            </Badge>
          )}
          {entry.is_expression && (
            <Badge color="red" size="1">
              Expression
            </Badge>
          )}
        </Flex>
      </Box>
      <div className={showMeaning ? "block" : "hidden"}>
        {entry.ru.length > 0 && (
          <Box className="p-2">
            <Heading mb="2" size="2">
              Ru
            </Heading>
            <Flex direction="column" gap="1">
              {entry.ru.map((e) => (
                <Text key={e} className="" size="2">
                  {e}
                </Text>
              ))}
            </Flex>
          </Box>
        )}
        {entry.en.length > 0 && (
          <Box className="mt-2 rounded-md p-2">
            <Heading mb="2" size="2">
              En
            </Heading>
            <Flex direction="column" gap="1">
              {entry.en.map((e) => (
                <Text key={e} className="" size="2">
                  {e}
                </Text>
              ))}
            </Flex>
          </Box>
        )}
        <div>
          [
          {entry.readings.map((r) => (
            <Text size="2">{r}, </Text>
          ))}
          ]
        </div>
      </div>
    </div>
  );
};

const MembersNew = ({
  members,
  showRuby = false,
  n,
}: {
  members: AdminMemberOutput[];
  sentenceId: number;
  n: number;
  showRuby?: boolean;
}) => {
  return (
    <Box>
      <Heading size="5">Members {n}</Heading>
      <Grid columns="3" my="8" className="">
        <Grid
          columns="4"
          gridColumn="span 2"
          className="font-klee text-xl"
          gap="4"
        >
          {members?.map((m, i) => (
            <Flex key={m.entries[0].id + i} direction="column">
              {showRuby ? (
                <Text
                  truncate
                  size="6"
                  className="whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: m.entries[0]?.ruby,
                  }}
                />
              ) : null}
              {m.entries[0] ? (
                <>
                  <Text size="2" truncate>
                    {m.entries[0].ru?.[0]}
                  </Text>
                  <Text size="2" truncate>
                    {m.entries[0].en?.[0]}
                  </Text>
                </>
              ) : null}
              <Flex direction="column" gap="2">
                {m.entries.map((entry) => (
                  <div key={entry.id}>
                    <MemberItem entry={entry} />
                  </div>
                ))}
              </Flex>
            </Flex>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

const MembersOld = ({
  members,
  showRuby = false,
  n,
}: {
  members: {
    basic_form: string;
    reading: string | null;
    original: string | null;
    pos: string | null;
    en: string | null;
    ru: string | null;
    ruby: string | null;
    is_jmdict: boolean;
    is_crush: boolean;
    pattern_match: string;
  }[];
  sentenceId: number;
  n: number;
  showRuby?: boolean;
}) => {
  return (
    <Box>
      <Heading size="5">Members {n}</Heading>
      <Grid columns="3" my="8" className="">
        <Grid
          columns="4"
          gridColumn="span 2"
          className="font-klee text-xl"
          gap="4"
        >
          {members?.map((m) => (
            <Flex key={m.basic_form} direction="column">
              {showRuby ? (
                <Text
                  size="6"
                  className="whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: m.ruby ?? "",
                  }}
                />
              ) : (
                <>
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
                </>
              )}
              <Text className="select-none" size="2">
                {m.en}
              </Text>
              <Text className="select-none" size="2">
                {m.ru}
              </Text>
              <Box>
                {m.pos !== "VERB" && (
                  <Badge color="sky" size="1">
                    {m.pos}
                  </Badge>
                )}
                {m.is_jmdict && (
                  <Badge color="yellow" size="1">
                    jmdict
                  </Badge>
                )}
                {m.is_crush && (
                  <Badge color="bronze" size="1">
                    crush
                  </Badge>
                )}
                {m.pattern_match && (
                  <Badge color="green" size="1">
                    {m.pattern_match}
                  </Badge>
                )}
              </Box>
            </Flex>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditSentencePage;
