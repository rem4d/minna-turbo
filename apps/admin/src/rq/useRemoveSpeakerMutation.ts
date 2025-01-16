import { useMutation } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
}

export const useRemoveSpeakerMutation = ({ onSuccess }: Props) => {
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
    onSuccess() {
      onSuccess?.();
    },
  });
};
