import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";

import "./index.css";
import App from "./App";
import { Theme } from "@radix-ui/themes";
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Theme accentColor="cyan" appearance="dark">
        <App />
        {/* <ThemePanel /> */}
      </Theme>
    </StrictMode>,
  );
}
