import { useEffect, useLayoutEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import {
  Provider as RollbarProvider,
  ErrorBoundary as RoollbarErrorBoundary,
} from "@rollbar/react";
// Provider imports 'rollbar'
import {
  miniApp,
  requestFullscreen,
  swipeBehavior,
  useLaunchParams,
  viewport,
} from "@telegram-apps/sdk-react";
import { RouterProvider } from "react-router-dom";

import "./utils/i18n";

import { router } from "./routes";
import { TRPCProvider } from "./utils/api";

import "./index.css";

import { useTranslation } from "react-i18next";
import { SkeletonTheme } from "react-loading-skeleton";

import ErrorFallbackComponent from "./components/ErrorFallbackComponent";
import { PlaySoundContextProvider } from "./context/playSoundContext";

function App() {
  const lp = useLaunchParams() as unknown as {
    platform: string;
    user: { languageCode: string };
  };
  const { i18n } = useTranslation();
  const userLang = lp?.user?.languageCode ?? "en";
  const [hasLoadedTrans, setHasLoadedTrans] = useState(false);

  useLayoutEffect(() => {
    if (userLang && userLang === "ru") {
      void i18n.changeLanguage(userLang);
    } else {
      setHasLoadedTrans(true);
    }
  }, [userLang, i18n]);

  useEffect(() => {
    setHasLoadedTrans(true);
  }, [i18n.language]);

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

  const errorFallback = () => <ErrorFallbackComponent />;

  return (
    <RollbarProvider config={rollbarConfig}>
      <RoollbarErrorBoundary fallbackUI={errorFallback}>
        <TRPCProvider>
          <Toast.Provider swipeDirection="down">
            <PlaySoundContextProvider>
              <SkeletonTheme baseColor="#dadada">
                {hasLoadedTrans ? <RouterProvider router={router} /> : null}
              </SkeletonTheme>
            </PlaySoundContextProvider>
          </Toast.Provider>
        </TRPCProvider>
      </RoollbarErrorBoundary>
    </RollbarProvider>
  );
}

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_API_TOKEN,
  environment: import.meta.env.DEV ? "local" : "production",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export default App;
