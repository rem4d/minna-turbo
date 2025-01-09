import { useMutation } from "@tanstack/react-query";

export const useVoicevoxMutation = () => {
  return useMutation({
    mutationFn: async ({
      speaker,
      text,
      speed,
    }: {
      speaker: number;
      text: string;
      speed: number;
    }) => {
      return fetch("/api/voicevox", {
        method: "POST",
        body: JSON.stringify({ speaker, text, speed }),
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => res.blob());
    },
  });
};
