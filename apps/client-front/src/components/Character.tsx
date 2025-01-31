import { type ReactElement } from "react";

interface CharacterProps {
  id: number | null;
  size?: "1" | "2";
}

export function Character({ id, size = "2" }: CharacterProps): ReactElement {
  return (
    <div
      className="size-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: id
          ? `url("/characters/${id}.png")`
          : `url("/characters/default.jpg")`,
        backgroundSize: size === "1" ? "130%" : "100%",
      }}
    ></div>
  );
}
