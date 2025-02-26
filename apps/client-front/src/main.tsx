import { StrictMode } from "react";
import { init } from "@/init.ts";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./mockEnv.ts";
import "./index.css";

const root = document.getElementById("root");

try {
  const lp = retrieveLaunchParams() as {
    platform: string;
    startParam: string;
    fullscreen: boolean;
  };

  // Configure all application dependencies.
  init({
    debug: lp.startParam === "debug" || import.meta.env.DEV,
  });

  if (root) {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
} catch (err) {
  if (root) {
    createRoot(root).render(
      <div>
        "You are using too old Telegram client to run this application"
      </div>,
    );
  }
}
