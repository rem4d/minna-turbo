import type { FC, PropsWithChildren } from "react";
import * as Toast from "@radix-ui/react-toast";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const ToastComp: FC<PropsWithChildren<Props>> = ({
  children,
  open,
  onOpenChange,
}) => {
  return (
    <>
      <Toast.Root
        className="ToastRoot flex flex-col items-center rounded-2xl border bg-white p-4 shadow-xl"
        open={open}
        onOpenChange={onOpenChange}
        duration={1000 * 2}
      >
        {/* <Toast.Title className="mb-2">Scheduled: Catch up</Toast.Title> */}
        <Toast.Description asChild className="text-center text-black">
          <p>{children}</p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport fixed bottom-8 left-1/2 z-50 flex w-[320px] max-w-[90vw] -translate-x-1/2 flex-col outline-none" />
    </>
  );
};

export default ToastComp;
