export default function Spinner() {
  return (
    <div className="lds-ring relative size-[24px]">
      <Block />
      <Block />
      <Block />
      <Block />
    </div>
  );
}

const Block = () => {
  return (
    <div className="absolute top-1/2 left-1/2 m-0 size-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2" />
  );
};
