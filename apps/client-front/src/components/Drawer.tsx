import { Drawer } from "vaul";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function _Drawer({ open, onOpenChange, children }: Props) {
  const element = document.getElementById("page");
  console.log(element);
  return (
    <Drawer.Root
      open={open}
      onOpenChange={() => onOpenChange(!open)}
      container={element}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 flex h-fit flex-col rounded-t-[8px] outline-none">
          <Drawer.Title></Drawer.Title>
          <Drawer.Description></Drawer.Description>
          <div className="bg-super-silver flex-1 rounded-t-[8px] py-4">
            <div
              aria-hidden
              className="bg-gray-chateau mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full"
            />
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
