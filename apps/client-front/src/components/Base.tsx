import { useEffect, useRef } from "react";
import { useRouter } from "@/router/router";
import { routes } from "@/router/routes";
import { useTRPC } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

export function Base() {
  const trpc = useTRPC();
  const userCreator = useMutation(trpc.viewer.user.create.mutationOptions());
  const { url } = useRouter();

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      userCreator.mutate();
      initialized.current = true;
    }
  }, [userCreator]);

  const currentRoute = routes.find((route) => route.path === url);

  return (
    <div className="bg-light-gray relative mx-auto h-screen min-h-[568px] max-w-[450px] min-w-[320px] overflow-hidden">
      {currentRoute?.element ?? <div>404</div>}
    </div>
  );
}
