import type { GetGlossesOutput } from "@minna/api";
import CloseIcon from "@/assets/icons/close.svg?react";
import * as Dialog from "@radix-ui/react-dialog";

interface ConfirmModalProps {
  open: boolean;
  gloss: GetGlossesOutput;
  onOpenChange: (open: boolean) => void;
}

export default function GlossModal({
  open,
  gloss,
  onOpenChange,
}: ConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Title className="sr-only"></Dialog.Title>
      <Dialog.Description className="sr-only"></Dialog.Description>
      <Dialog.Overlay className="absolute inset-0 z-20 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-30 w-[320px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
        <Dialog.Close asChild className="absolute top-4 right-4">
          <div className="size-6">
            <CloseIcon className="size-full fill-current" />
          </div>
        </Dialog.Close>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full p-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="text-md">{gloss.kana}</div>
                <div className="text-sm font-semibold">{gloss.romaji}</div>
                <div className="rounded-md bg-[#F9F3EA] px-2 py-1 text-sm font-bold text-[#C76861]">
                  N{gloss.jlpt_level}
                </div>
              </div>
              <div className="text-sm">{gloss.comment}</div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
