import type { LaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import {
  miniApp,
  requestFullscreen,
  backButton as SDKBackButton,
  hapticFeedback as sdkHapticFeedback,
  initDataRaw as SDKInitDataRaw,
  retrieveLaunchParams as SDKRetrieveLaunchParams,
  swipeBehavior,
  viewport,
} from "@telegram-apps/sdk-react";

import {
  mockInitData,
  mockInitDataString,
  mockThemeParams,
} from "./tgMockData";

const noSdk = import.meta.env.VITE_NO_SDK === "true";

export const initDataRaw = () => {
  if (noSdk) {
    return mockInitDataString;
  }
  return SDKInitDataRaw();
};

export const useIsMobile = () => {
  const lp = retrieveLaunchParams();
  return !lp.tgWebAppPlatform.includes("desktop");
};

export const userLanguage = () => {
  const lp = retrieveLaunchParams();
  const lang = lp.tgWebAppData?.user?.language_code;
  return lang;
};

export const retrieveLaunchParams = (): LaunchParams => {
  if (noSdk) {
    return {
      tgWebAppPlatform: "ios",
      tgWebAppData: mockInitData,
      tgWebAppThemeParams: mockThemeParams,
      tgWebAppVersion: "8.4",
      tgWebAppStartParam: "",
    };
  }
  return SDKRetrieveLaunchParams();
};

export const useMiniAppSetup = () => {
  const lp = retrieveLaunchParams();

  useEffect(() => {
    if (noSdk) {
      return;
    }
    if (swipeBehavior.isSupported()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    }
    viewport.expand();

    miniApp.setBackgroundColor("#f3f3f3");
    miniApp.setHeaderColor("#f3f3f3");

    const fcIsAvail = requestFullscreen.isAvailable();

    if (fcIsAvail && !lp.tgWebAppPlatform.includes("desktop")) {
      void requestFullscreen();
    }
  }, [lp.tgWebAppPlatform]);
};

export const backButton = {
  isAvailable() {
    if (noSdk) {
      return false;
    }
    return SDKBackButton.mount.isAvailable();
  },
  show() {
    if (noSdk) {
      return;
    }
    SDKBackButton.show();
  },
  hide() {
    if (noSdk) {
      return;
    }
    SDKBackButton.hide();
  },
  onClick(cb: () => void) {
    if (!noSdk) {
      return SDKBackButton.onClick(cb);
    }
  },
};

export const hapticFeedback = (feedback: "medium" | "heavy" | "light") => {
  if (noSdk) {
    return;
  }
  if (sdkHapticFeedback.isSupported()) {
    sdkHapticFeedback.impactOccurred(feedback);
  }
};

// const initDataRaw = new URLSearchParams([
//   [
//     "user",
//     JSON.stringify({
//       id: 99281932,
//       first_name: "Andrew",
//       last_name: "Rogue",
//       username: "rogue",
//       language_code: "en",
//       is_premium: true,
//       allows_write_to_pm: true,
//     }),
//   ],
//   ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
//   ["auth_date", "1716922846"],
//   ["start_param", "debug"],
//   ["chat_type", "sender"],
//   ["chat_instance", "8428209589180549439"],
//   ["signature", "6fbdaab833d39f54518bd5c3eb3f511d035e68cb"],
// ]).toString();
