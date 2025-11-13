import type { MemberOutputClient } from "@rem4d/api";
import React from "react";
import { twMerge } from "tailwind-merge";

import { LoadingMembersPlaceholder } from "./LoadingMembersPlaceholder";

const GlossaryContent: React.FC<{
  members: MemberOutputClient[] | undefined;
  loadingMembers: boolean;
  transLang: "ru" | "en" | null;
  onMemberClick: (id: number) => void;
}> = ({ members, loadingMembers, transLang, onMemberClick }) => {
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
                <div
                  onClick={() => onMemberClick(m.id)}
                  className="font-yu-gothic cursor-pointer font-medium whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: m.ruby,
                  }}
                />
                <div
                  className="relative top-1 max-w-3/4 truncate text-sm leading-5"
                  onClick={() => onMemberClick(m.id)}
                >
                  {transLang === "ru" ? m.entries[0]?.ru : m.entries[0]?.en}
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
