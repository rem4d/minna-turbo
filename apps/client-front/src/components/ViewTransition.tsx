import React, { ViewTransition } from "react";
import { IsHiddenScreenContext } from "@/context/isHiddenScreenContext";

export default function ViewTransitionComponent({
  children,
  ...props
}: React.PropsWithChildren<React.ComponentProps<typeof ViewTransition>>) {
  const removeName = React.use(IsHiddenScreenContext);

  if (removeName) {
    return <>{children}</>;
  }
  return <ViewTransition {...props}>{children}</ViewTransition>;
}
