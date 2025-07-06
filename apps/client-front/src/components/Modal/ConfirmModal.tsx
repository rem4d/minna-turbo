import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import Button from "../Button";

interface ConfirmModalProps {
  open: boolean;
  onConfirm: (msg: string) => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [msg, setMsg] = useState("");
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(event.target.value);
  };
  return (
    <Dialog.Root open={open} onOpenChange={() => setMsg("")}>
      <Dialog.Title className="sr-only"></Dialog.Title>
      <Dialog.Description className="sr-only"></Dialog.Description>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
        <input
          type="text"
          onChange={handleValueChange}
          className="h-[30px] w-full rounded-sm border border-gray-400 bg-black/5 px-2"
        />
        <div className="itecms-center mt-4 flex justify-center space-x-4">
          <Button onClick={() => onConfirm(msg)}>Submit</Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
