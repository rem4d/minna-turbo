export default function Spinner() {
  const Block = () => {
    return (
      <div className="absolute top-1/2 left-1/2 m-0 size-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2" />
    );
  };

  return (
    <div className="lds-ring relative size-[24px]">
      <Block />
      <Block />
      <Block />
      <Block />
    </div>
  );
}

export function SpinnerBig() {
  const Block = () => {
    return (
      <div className="absolute top-1/2 left-1/2 m-0 size-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4" />
    );
  };
  return (
    <div className="lds-ring relative size-[64px]">
      <Block />
      <Block />
      <Block />
      <Block />
    </div>
  );
}
