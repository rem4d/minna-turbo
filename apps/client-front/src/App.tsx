import { useEffect } from "react";
import {
  miniApp,
  requestFullscreen,
  swipeBehavior,
  useLaunchParams,
  viewport,
} from "@telegram-apps/sdk-react";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import { TRPCProvider } from "./utils/api";

import "./index.css";

function App() {
  const lp = useLaunchParams() as { platform: string };

  useEffect(() => {
    if (swipeBehavior.isSupported()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    }
    viewport.expand();

    miniApp.setBackgroundColor("#f3f3f3");
    miniApp.setHeaderColor("#f3f3f3");

    const fcIsAvail = requestFullscreen.isAvailable();

    if (fcIsAvail && !lp.platform.includes("desktop")) {
      requestFullscreen();
    }
  }, [lp.platform]);

  return (
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  );
}

export default App;
