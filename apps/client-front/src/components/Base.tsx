import { useEffect, useRef } from "react";
import { api } from "@/utils/api";
import { Outlet } from "react-router-dom";

import { FooterMenu } from "./FooterMenu";

export function Base() {
  const createUser = api.user.create.useMutation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      createUser.mutate();
      initialized.current = true;
    }
  }, [createUser]);

  return (
    <div className="bg-light-gray relative mx-auto h-screen min-h-[568px] max-w-[450px] min-w-[320px] overflow-hidden">
      <Outlet />
      <FooterMenu />
    </div>
  );
}
