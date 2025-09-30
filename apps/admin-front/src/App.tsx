import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { TRPCProvider } from "./utils/api";
import { Theme, Text } from "@radix-ui/themes";
import { ToastBar, Toaster } from "react-hot-toast";
import "@radix-ui/themes/styles.css";

import "./index.css";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "@uidotdev/usehooks";

function App() {
  const [theme] = useLocalStorage<"dark" | "light">("theme", "light");

  return (
    <TRPCProvider>
      <Theme accentColor="cyan" appearance={theme}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              // duration: 1000 * 60,
              style: {
                background: "#062b38",
              },
            },
            error: {
              // duration: 1000 * 60,
              style: {
                background: "#3b121b",
              },
            },
          }}
        >
          {(t) => (
            <ToastBar
              toast={t}
              style={{
                background: "#111113",
                animation: t.visible
                  ? "fadeIn 300ms ease"
                  : "fadeOut 300ms ease forwards",
              }}
            >
              {({ message }) => (
                <div
                  className="flex items-center"
                  style={{ color: "var(--accent-a11)" }}
                >
                  <InfoCircledIcon />
                  <Text size="2">{message}</Text>
                </div>
              )}
            </ToastBar>
          )}
        </Toaster>
        {/* <ThemePanel /> */}
      </Theme>
    </TRPCProvider>
  );
}

export default App;
