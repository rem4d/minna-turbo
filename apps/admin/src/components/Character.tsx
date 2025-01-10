import { type ReactElement } from "react";

interface CharacterProps {
  id: number | null;
  size?: "1" | "2";
}

export function Character({ id, size = "2" }: CharacterProps): ReactElement {
  return (
    <div
      className="size-full bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `url("/characters/${id}.png")`,
        backgroundSize: size === "1" ? "130%" : "100%",
      }}
    ></div>
  );
}
