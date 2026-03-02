import type { MemberOutputClient } from "@minna/api";
import React, { useState } from "react";
import GrabberAndCloseButton from "@/components/Drawer/GrabberAndCloseButton";
import MemberModalContent from "@/components/MemberModal/MemberModalContent";
import { getMemberShortText } from "@/utils/memberShortText";
import { twMerge } from "tailwind-merge";
import { Drawer } from "vaul";

import { LoadingMembersPlaceholder } from "./LoadingMembersPlaceholder";

type Id = MemberOutputClient["id"];

const GlossaryContent: React.FC<{
  members: MemberOutputClient[] | undefined;
  loadingMembers: boolean;
  transLang: "ru" | "en" | null;
}> = ({ members, loadingMembers, transLang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const onMemberClick = (id: Id) => {
    setSelectedMemberId(id);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="no-scroll max-h-[40vh] w-full overflow-y-scroll py-2">
        <div className="relative">
          {loadingMembers ? (
            <LoadingMembersPlaceholder membersLength={members?.length} />
          ) : null}
          <div
            className={twMerge(
              "grid grid-cols-[fit-content(50px)_auto] items-center gap-x-3 gap-y-2 text-[18px]",
              loadingMembers && "opacity-0",
            )}
          >
            {members?.map((m) => (
              <React.Fragment key={m.id}>
                <Drawer.Root
                  open={isOpen && m.id === selectedMemberId}
                  onOpenChange={() => setIsOpen(false)}
                >
                  <Drawer.Portal>
                    <Drawer.Overlay className="absolute inset-0 bg-black/40" />
                    <Drawer.Content className="fixed right-0 bottom-0 left-0 mt-24 flex h-dvh max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-t-[10px] bg-gray-100">
                      <Drawer.Title></Drawer.Title>
                      <Drawer.Description></Drawer.Description>
                      <div className="no-scroll relative flex-1 overflow-y-scroll rounded-t-[10px] bg-white">
                        <GrabberAndCloseButton />

                        <div className="flex flex-1 flex-col p-4 pt-0">
                          <MemberModalContent
                            pos={m.pos}
                            ruby={m.ruby}
                            reading={m.reading}
                            en={m.entries[0]?.en ?? null}
                            ru={m.entries[0]?.ru ?? null}
                            entries={m.entries}
                            readings={m.entries[0]?.readings}
                          />
                        </div>
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>

                <div
                  className="font-yu-gothic cursor-pointer border-b border-dashed border-transparent font-medium whitespace-nowrap hover:border-gray-600/40"
                  dangerouslySetInnerHTML={{
                    __html: m.ruby,
                  }}
                  onClick={() => onMemberClick(m.id)}
                />
                <div
                  className={twMerge(
                    "relative top-1 max-w-3/4 cursor-pointer truncate text-sm leading-5",
                    "border-b border-dashed border-transparent hover:border-gray-600/40",
                  )}
                  onClick={() => onMemberClick(m.id)}
                >
                  {getMemberShortText({
                    transLang,
                    ru: m.entries[0]?.ru ?? null,
                    en: m.entries[0]?.en ?? null,
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GlossaryContent;
