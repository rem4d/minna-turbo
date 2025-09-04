import { useEffect, useRef } from "react";
import { useTRPC } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

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

  return (
    <div className="bg-light-gray relative mx-auto h-screen min-h-[568px] max-w-[450px] min-w-[320px] overflow-hidden">
      <Outlet />
    </div>
  );
}
