import Skeleton from "react-loading-skeleton";

export const LoadingMembersPlaceholder = ({
  membersLength,
}: {
  membersLength?: number;
}) => {
  return typeof membersLength === "number" && membersLength > 0 ? (
    <div className="absolute h-full w-full">
      <Skeleton
        inline
        containerClassName="flex flex-col space-y-4"
        height="25px"
        count={membersLength}
      />
    </div>
  ) : (
    <Skeleton
      inline
      containerClassName="flex flex-col space-y-4"
      height="25px"
      count={3}
    />
  );
};
