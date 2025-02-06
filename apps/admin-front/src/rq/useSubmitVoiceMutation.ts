import { useMutation } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
}

export const useSubmitVoiceMutation = ({ onSuccess }: Props) => {
  return useMutation({
    onSuccess() {
      onSuccess?.();
    },
    mutationFn: async ({
      speaker,
      text,
      speed,
      sentenceId,
    }: {
      speaker: number;
      text: string;
      speed: number;
      sentenceId: number;
    }) => {
      return fetch("/api/voicevox_submit", {
        method: "POST",
        body: JSON.stringify({ sentenceId, speaker, text, speed }),
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => res.blob());
    },
  });
};
