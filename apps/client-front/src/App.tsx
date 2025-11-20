import { useEffect, useLayoutEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import {
  Provider as RollbarProvider,
  ErrorBoundary as RoollbarErrorBoundary,
} from "@rollbar/react";
import { useQuery } from "@tanstack/react-query";

import "./utils/i18n";
import "./index.css";
import "./transitions.css";

import { useTranslation } from "react-i18next";
import { SkeletonTheme } from "react-loading-skeleton";

import { Base } from "./components/Base";
import ErrorFallbackComponent from "./components/ErrorFallbackComponent";
import { PlaySoundContextProvider } from "./context/playSoundContext";
import { Router } from "./router/router";
import { routes } from "./router/routes";
import { ApiProvider, useTRPC } from "./utils/api";
import { useMiniAppSetup, userLanguage } from "./utils/tgUtils";

function App() {
  const { i18n } = useTranslation();
  const userLang = userLanguage() === "ru" ? "ru" : "en";
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

  useMiniAppSetup();

  const errorFallback = () => <ErrorFallbackComponent />;

  return (
    <RollbarProvider config={rollbarConfig}>
      <RoollbarErrorBoundary fallbackUI={errorFallback}>
        <ApiProvider>
          <Toast.Provider swipeDirection="down">
            <PlaySoundContextProvider>
              <SkeletonTheme baseColor="#dadada">
                {hasLoadedTrans ? (
                  <Router routes={routes}>
                    <Base />
                  </Router>
                ) : null}
                {/* {hasLoadedTrans ? <RouterProvider router={router} /> : null} */}
              </SkeletonTheme>
            </PlaySoundContextProvider>
          </Toast.Provider>
        </ApiProvider>
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
