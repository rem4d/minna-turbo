import { Badge, Spinner } from "@radix-ui/themes";

interface Props {
  id: number;
  isPending: boolean;
  name: string;
  onClick?(id: number): void;
}

export const Speaker = ({ id, name, isPending, onClick }: Props) => {
  return (
    <div>
      {name && <Badge color="iris">{name}</Badge>}
      <div className="relative size-[60px]">
        <div
          onClick={() => (onClick ? onClick(id) : {})}
          className="size-[60px] rounded-[6px] border border-sky-500"
        >
          <div
            className="cursor-pointer size-full bg-no-repeat bg-center bg-contain"
            style={{
              backgroundImage: `url("/characters/${id}.png")`,
            }}
          ></div>
        </div>
        {/* <Badge className="absolute top-0 left-0">{id}</Badge> */}

        {isPending && (
          <div className="size-full rounded-[6px] bg-black/70 absolute top-0 left-0">
            <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>
    </div>
  );
};
