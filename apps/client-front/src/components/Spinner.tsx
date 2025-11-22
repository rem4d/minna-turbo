export default function Spinner() {
  return (
    <div className="lds-ring relative size-[24px]">
      <BlockSmall />
      <BlockSmall />
      <BlockSmall />
      <BlockSmall />
    </div>
  );
}

export function SpinnerBig() {
  return (
    <div className="lds-ring relative size-[64px]">
      <BlockBig />
      <BlockBig />
      <BlockBig />
      <BlockBig />
    </div>
  );
}
const BlockSmall = () => {
  return (
    <div className="absolute top-1/2 left-1/2 m-0 size-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2" />
  );
};
const BlockBig = () => {
  return (
    <div className="absolute top-1/2 left-1/2 m-0 size-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4" />
  );
};
