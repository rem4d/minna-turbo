import { useEffect, useRef } from "react";
import { useTRPC } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

import StackNavigator from "./StackNavigator";

export function Base() {
  const trpc = useTRPC();
  const userCreator = useMutation(trpc.viewer.user.create.mutationOptions());

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      userCreator.mutate();
      initialized.current = true;
    }
  }, [userCreator]);

  // const currentRoute = routes.find((route) => route.path === url);

  return (
    <div className="bg-light-gray relative mx-auto h-screen min-h-[568px] max-w-[450px] min-w-[320px] overflow-hidden">
      {/* {currentRoute?.element ? <currentRoute.element /> : <div>404</div>} */}
      <StackNavigator />
    </div>
  );
}
