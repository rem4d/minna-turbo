import { useEffect } from "react";
import {
  miniApp,
  requestFullscreen,
  backButton as sdkBackButton,
  hapticFeedback as sdkHapticFeedback,
  retrieveLaunchParams as sdkRetrieveLaunchParams,
  useLaunchParams as sdkUseLaunchParams,
  swipeBehavior,
  viewport,
} from "@telegram-apps/sdk-react";

const noSdk = import.meta.env.VITE_NO_SDK === "true";

interface TgLaunchParams {
  platform: string;
  startParam: string;
  fullscreen: boolean;
  initDataRaw: string;
}

export const retrieveLaunchParams = (): TgLaunchParams => {
  if (noSdk) {
    return {
      platform: "ios",
      startParam: "",
      fullscreen: true,
      initDataRaw,
    };
  }
  const lp = sdkRetrieveLaunchParams() as TgLaunchParams;
  return lp;
};

export const useLaunchParams = () => {
  if (noSdk) {
    return {
      platform: "ios",
      initData: {
        user: { languageCode: "en" },
      },
    };
  }
  const lp = sdkUseLaunchParams() as unknown as {
    platform: string;
    initData: {
      user: { languageCode: string };
    };
  };
  return lp;
};

export const useMiniAppSetup = () => {
  const lp = useLaunchParams();

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

    if (fcIsAvail && !lp.platform.includes("desktop")) {
      // @eslint-disable-next-line
      requestFullscreen();
    }
  }, [lp.platform]);
};

export const backButton = {
  show() {
    if (noSdk) {
      return;
    }
    sdkBackButton.show();
  },
  hide() {
    if (noSdk) {
      return;
    }
    sdkBackButton.hide();
  },
  onClick(cb: () => void) {
    if (noSdk) {
      return;
    }
    sdkBackButton.onClick(cb);
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

const initDataRaw = new URLSearchParams([
  [
    "user",
    JSON.stringify({
      id: 99281932,
      first_name: "Andrew",
      last_name: "Rogue",
      username: "rogue",
      language_code: "en",
      is_premium: true,
      allows_write_to_pm: true,
    }),
  ],
  ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
  ["auth_date", "1716922846"],
  ["start_param", "debug"],
  ["chat_type", "sender"],
  ["chat_instance", "8428209589180549439"],
  ["signature", "6fbdaab833d39f54518bd5c3eb3f511d035e68cb"],
]).toString();
