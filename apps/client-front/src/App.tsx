import { useEffect, useLayoutEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import {
  Provider as RollbarProvider,
  ErrorBoundary as RoollbarErrorBoundary,
} from "@rollbar/react";

// Provider imports 'rollbar'
// import { RouterProvider } from "react-router-dom";

import "./utils/i18n";
// import { router } from "./routes";

import "./index.css";

import { useTranslation } from "react-i18next";
import { SkeletonTheme } from "react-loading-skeleton";

import { Base } from "./components/Base";
import ErrorFallbackComponent from "./components/ErrorFallbackComponent";
import { PlaySoundContextProvider } from "./context/playSoundContext";
import { Router } from "./router/router";
import { ApiProvider } from "./utils/api";
import { useLaunchParams, useMiniAppSetup } from "./utils/tgUtils";

function App() {
  const lp = useLaunchParams() as unknown as {
    platform: string;
    initData: {
      user: { languageCode: string };
    };
  };
  const { i18n } = useTranslation();
  const userLang = lp?.initData?.user?.languageCode === "ru" ? "ru" : "en";
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
                <Router>
                  <Base />
                </Router>
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
