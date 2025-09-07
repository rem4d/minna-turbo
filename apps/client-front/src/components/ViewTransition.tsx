/// <reference types="react/experimental" />
import React from "react";
import { IsHiddenScreenContext } from "@/context/isHiddenScreenContext";

export default function ViewTransitionComponent({
  children,
  ...props
}: React.PropsWithChildren<
  React.ComponentProps<typeof React.unstable_ViewTransition>
>) {
  const removeName = React.use(IsHiddenScreenContext);

  if (removeName) {
    return <>{children}</>;
  }
  return (
    <React.unstable_ViewTransition {...props}>
      {children}
    </React.unstable_ViewTransition>
  );
}
