import { useMutation } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
}
export const useTtsMutation = ({ onSuccess }: Props) => {
  return useMutation({
    onSuccess() {
      onSuccess?.();
    },
    mutationFn: async ({ text }: { text: string }) => {
      return fetch(`${import.meta.env.VITE_API_SERVER}tts/ms-tts`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => res.blob());
    },
  });
};
