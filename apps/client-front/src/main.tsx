import { StrictMode } from "react";
import { init } from "@/init.ts";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";
// Mock the environment in case, we are outside Telegram.
import "./mockEnv.ts";

const root = document.getElementById("root");

try {
  const lp = retrieveLaunchParams();
  console.log(lp);
  // Configure all application dependencies.
  init(lp.startParam === "debug" || import.meta.env.DEV);

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
