import { useMutation } from "@tanstack/react-query";

export const useSubmitVoiceMutation = () => {
  return useMutation({
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
      });
    },
  });
};
