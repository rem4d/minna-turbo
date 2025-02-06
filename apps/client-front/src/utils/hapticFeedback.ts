import { hapticFeedback as tgHF } from "@telegram-apps/sdk-react";

const hapticFeedback = (feedback: "medium" | "heavy" | "light") => {
  if (tgHF.isSupported()) {
    tgHF.impactOccurred(feedback);
  }
};

export default hapticFeedback;
