import type { FC, PropsWithChildren } from "react";

export const Toast: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="animate-fade-up animate-duration-300 animate-once absolute bottom-[135px] z-60 flex w-full justify-center">
      <div className="relative flex h-[60px] w-[320px] items-center overflow-hidden rounded-[16px] border border-black/30 py-[12px] shadow-2xl">
        <div className="absolute z-[0] size-full bg-[#272F39]/80" />
        <div className="absolute z-[0] size-full backdrop-blur-[20px]" />
        <div className="relative z-10 px-[21px] text-sm leading-5 text-white">
          <div className="flex items-center space-x-[16px]">
            {/* <CheckIcon className="size-[28px]" /> */}
            <span>{children}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
