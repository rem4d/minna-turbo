import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { Drawer } from "vaul";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  back?: boolean;
  onBackClick?: () => void;
  children: React.ReactNode;
  noContainer?: boolean;
  title?: string | null;
}

export default function _Drawer({
  open,
  onOpenChange,
  onBackClick,
  children,
  title = null,
  back = false,
  noContainer = false,
}: Props) {
  const element = document.getElementById("page");
  const props = noContainer ? {} : { container: element };
  return (
    <Drawer.Root
      open={open}
      onOpenChange={() => onOpenChange(!open)}
      {...props}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="absolute inset-0 bg-black/40" />
        <Drawer.Content className="absolute right-0 bottom-0 left-0 mt-24 flex h-fit flex-col rounded-t-[10px] outline-none">
          <div className="bg-super-silver flex-1 rounded-t-[10px] pt-2">
            <div className="bg-gray-chateau mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full" />
            <div className="mb-8 grid w-full grid-cols-[50px_auto] items-center">
              {back && (
                <div
                  className="absolute top-5 left-0 ml-4 size-[24px]"
                  onClick={() => onBackClick?.()}
                >
                  <ArrowIcon className="text-rolling-stone absolute top-1/2 size-[20px] -translate-y-1/2 rotate-90 fill-current" />
                </div>
              )}

              <Drawer.Title className="absolute top-6 left-1/2 -translate-x-1/2 justify-self-center text-sm font-medium whitespace-nowrap text-black">
                {title}
              </Drawer.Title>
              <Drawer.Description></Drawer.Description>
            </div>
            <div className="no-scroll mx-auto max-h-[90vh] max-w-md overflow-y-scroll">
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
