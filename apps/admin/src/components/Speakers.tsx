import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  IconButton,
  Popover,
  Slider,
  Text,
} from "@radix-ui/themes";
import { useEffect, useState, type ReactElement } from "react";
import { Speaker } from "./Speaker";
import { useVoicevoxMutation } from "@/rq/useVoicevoxMutation";
import speakers from "@/utils/voicevoxSpeakerMap.json";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";

interface Props {
  input: string;
  isPending: boolean;
  onSubmit: (opts: { speed: number; speaker: number }) => void;
}

export default function Speakers({
  input,
  onSubmit,
  isPending,
}: Props): ReactElement {
  const [blobSrc, setBlobSrc] = useState("");
  const [speakerId, setSpeakerId] = useState<number | null>(null);
  const voicevoxMutation = useVoicevoxMutation();
  const [sliderVal, setSliderVal] = useState([50]);
  const [open, setOpen] = useState(false);

  const speakersFlat = speakers.reduce(
    (acc, { voices, speed, jp, id }) =>
      acc.concat(voices).concat({ jp, id, speed }),
    [],
  ) as { jp: string | undefined; id: number; speed: number | undefined }[];

  const speed = (50 + sliderVal[0]) / 100;

  useEffect(() => {
    if (!open) {
      setBlobSrc("");
      setSpeakerId(null);
    }
  }, [open]);

  const onSpeakerClick = async (speakerId: number) => {
    setSpeakerId(speakerId);

    const found = speakersFlat.find((s) => s.id === speakerId);
    let newVal = 50;

    if (found?.speed) {
      newVal = found.speed * 100 - 50;
    }

    setSliderVal([newVal]);
    const speed_ = (50 + newVal) / 100;

    const blob = await voicevoxMutation.mutateAsync({
      speaker: speakerId,
      text: input,
      speed: speed_,
    });

    const objectURL = URL.createObjectURL(blob);

    setBlobSrc(objectURL);
  };

  const onSubmitClick = () => {
    if (!speakerId) {
      console.log("Has to assign speaker first.");
      return;
    }
    setOpen(false);
    onSubmit({
      speed,
      speaker: speakerId,
    });
  };

  return (
    <Box>
      <Button variant="soft" onClick={() => setOpen((s) => !s)}>
        {open ? "Hide speakers" : "Show speakers"}
      </Button>
      {open && (
        <Card mt="4">
          <Flex direction="column">
            <Grid columns="6" gap="2" mb="4">
              {speakers.map((s) => (
                <Flex
                  key={`speaker-${s.id}`}
                  direction="column"
                  gap="2"
                  className="relative"
                >
                  {typeof s.id === "number" && (
                    <Speaker
                      id={s.id}
                      onClick={() => onSpeakerClick(s.id)}
                      isPending={
                        voicevoxMutation.isPending && speakerId === s.id
                      }
                    />
                  )}
                  <p className="text-[12px] leading-4 font-inter">{s.name}</p>
                  {s.voices.length > 0 && (
                    <Popover.Root>
                      <Popover.Trigger className="absolute right-6 top-0">
                        <IconButton size="1">
                          <MixerHorizontalIcon />
                        </IconButton>
                      </Popover.Trigger>
                      <Popover.Content sideOffset={5}>
                        <Grid columns="5" gap="1" mb="2">
                          {s.voices.map((v) => (
                            <Speaker
                              key={`s-${s.id}v-${v.id}`}
                              id={v.id}
                              name={v.en}
                              onClick={() => onSpeakerClick(v.id)}
                              isPending={
                                voicevoxMutation.isPending && speakerId === v.id
                              }
                            />
                          ))}
                        </Grid>
                        <Text>{speed}</Text>
                        <Slider
                          defaultValue={[50]}
                          value={sliderVal}
                          size="1"
                          variant="classic"
                          color="cyan"
                          onValueChange={(v) => setSliderVal(v)}
                        />
                      </Popover.Content>
                    </Popover.Root>
                  )}
                </Flex>
              ))}
            </Grid>
            <audio autoPlay src={blobSrc} className="hidden" />
            <Button disabled={isPending || !speakerId} onClick={onSubmitClick}>
              Submit voice
            </Button>
          </Flex>
        </Card>
      )}
    </Box>
  );
}
