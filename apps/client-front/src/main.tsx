import { StrictMode } from "react";
import { init } from "@/init";
import { retrieveLaunchParams } from "@/utils/tgUtils";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./mockEnv.ts";
import "./index.css";

const root = document.getElementById("root");

try {
  // const launchParams = useLaunchParams();
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  // eslint-disable-next-line
  const isDev = import.meta.env.DEV;
  const debug =
    (launchParams.tgWebAppStartParam ?? "").includes("platformer_debug") ||
    isDev;

  // Configure all application dependencies.
  await init({
    debug,
    eruda: false, // debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() => {
    if (root) {
      createRoot(root).render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    }
  });
} catch (err) {
  console.error(err);
  if (root) {
    createRoot(root).render(
      <div>
        "You are using too old Telegram client to run this application"
      </div>,
    );
  }
}
