import { useMutation } from "@tanstack/react-query";

export const useRemoveSpeakerMutation = () => {
  return useMutation({
    mutationFn: async ({ sentenceId }: { sentenceId: number }) => {
      return fetch("/api/voicevox_remove", {
        method: "POST",
        body: JSON.stringify({ sentenceId }),
        headers: {
          "Content-type": "application/json",
        },
      });
    },
  });
};
