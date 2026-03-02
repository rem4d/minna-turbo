import * as Toast from "@radix-ui/react-toast";
import {
  Provider as RollbarProvider,
  ErrorBoundary as RoollbarErrorBoundary,
} from "@rollbar/react";

import "./utils/i18n";
import "./index.css";
import "./transitions.css";

import { SkeletonTheme } from "react-loading-skeleton";

import { Base } from "./components/Base";
import ErrorFallbackComponent from "./components/ErrorFallbackComponent";
import { PlaySoundContextProvider } from "./context/playSoundContext";
import { useTransLoaded } from "./hooks/useTransLoaded";
import { Router } from "./router/router";
import { routes } from "./router/routes";
import { ApiProvider } from "./utils/api";

function App() {
  const hasTransLoaded = useTransLoaded();

  const errorFallback = () => <ErrorFallbackComponent />;

  return (
    <RollbarProvider config={rollbarConfig}>
      <RoollbarErrorBoundary fallbackUI={errorFallback}>
        <ApiProvider>
          <Toast.Provider swipeDirection="down">
            <PlaySoundContextProvider>
              <SkeletonTheme baseColor="#dadada">
                {hasTransLoaded ? (
                  <Router routes={routes}>
                    <Base />
                  </Router>
                ) : null}
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
