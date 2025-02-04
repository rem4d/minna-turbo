/* eslint-disable */
import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import { TRPCProvider } from "./utils/api";

import "./index.css";

import { useEffect } from "react";
import {
  exitFullscreen,
  requestFullscreen,
  swipeBehavior,
  useLaunchParams,
  viewport,
} from "@telegram-apps/sdk-react";

function App() {
  const lp = useLaunchParams();

  useEffect(() => {
    if (swipeBehavior.isSupported()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    }
    viewport.expand();

    const d = viewport.safeAreaInsets();
    const fcIsAvail = requestFullscreen.isAvailable();

    console.log(d);

    if (fcIsAvail) {
      if (lp.platform?.includes("desktop")) {
        exitFullscreen();
      } else {
        requestFullscreen();
      }
    }
  }, []);

  return (
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  );
}

export default App;
