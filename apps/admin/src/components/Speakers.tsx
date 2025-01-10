import {
  Button,
  Flex,
  Grid,
  IconButton,
  Popover,
  Slider,
} from "@radix-ui/themes";
import { useRef, useState, type ReactElement } from "react";
import { Speaker } from "./Speaker";
import { useVoicevoxMutation } from "@/rq/useVoicevoxMutation";
import speakers from "@/utils/voicevoxSpeakerMap.json";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useSubmitVoiceMutation } from "@/rq/useSubmitVoiceMutation";

interface Props {
  input: string;
  sentenceId: number;
}

export default function Speakers({ input, sentenceId }: Props): ReactElement {
  const voicevoxAudioRef = useRef<HTMLAudioElement>(null);

  const [blobSrc, setBlobSrc] = useState("");
  const [speakerId, setSpeakerId] = useState(0);
  const voicevoxMutation = useVoicevoxMutation();
  const [sliderVal, setSliderVal] = useState([50]);

  const speed = (50 + sliderVal[0]) / 100;

  const submitVoiceMutation = useSubmitVoiceMutation();

  const onSpeakerClick = async (speakerId: number) => {
    setSpeakerId(speakerId);

    const blob = await voicevoxMutation.mutateAsync({
      speaker: speakerId,
      text: input,
      speed,
    });

    const objectURL = URL.createObjectURL(blob);

    setBlobSrc(objectURL);

    // if (voicevoxAudioRef.current) {
    //   void voicevoxAudioRef.current.play();
    // }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSliderVal([50]);
    }
  };

  const onSubmitClick = () => {
    if (!speakerId) {
      console.log("Has to assign speaker first.");
      return;
    }
    submitVoiceMutation.mutate({
      text: input,
      speed,
      sentenceId,
      speaker: speakerId,
    });
  };

  return (
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
                isPending={voicevoxMutation.isPending && speakerId === s.id}
              />
            )}
            <p className="text-[12px] leading-4 font-inter">{s.name}</p>
            {s.voices.length > 0 && (
              <Popover.Root onOpenChange={onOpenChange}>
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

      <audio ref={voicevoxAudioRef} autoPlay src={blobSrc} className="hidden" />
      <Button onClick={onSubmitClick}>Submit voice</Button>
    </Flex>
  );
}
