import { useEffect, useState } from "react";
import { useLaunchParams, viewport } from "@telegram-apps/sdk-react";
import { Outlet } from "react-router-dom";

import { FooterMenu } from "./FooterMenu";

export function Base() {
  const [sa, setSa] = useState<{ top: number }>({ top: 0 });
  const lp = useLaunchParams();

  useEffect(() => {
    if (!lp) {
      return;
    }

    if (lp.platform?.includes("desktop")) {
      return;
    }

    const sa = viewport.safeAreaInsets() as { top: number };

    setSa({ top: sa.top + 50 });
  }, [lp]);

  return (
    <div
      className="bg-lightGray relative mx-auto h-screen min-h-[568px] min-w-[320px] max-w-[450px] overflow-hidden"
      style={{ paddingTop: `${sa.top}px` }}
    >
      <Outlet />
      <FooterMenu />
    </div>
  );
}
