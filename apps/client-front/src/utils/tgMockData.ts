import type { InitData } from "@telegram-apps/sdk-react";

export const mockInitDataString = new URLSearchParams([
  ["auth_date", ((new Date().getTime() / 1000) | 0).toString()],
  ["hash", "some-hash"],
  ["signature", "some-signature"],
  [
    "user",
    JSON.stringify({
      id: 1,
      first_name: "Andrew",
      last_name: "Rogue",
      username: "rogue",
    }),
  ],
]).toString();

export const mockInitData: InitData = {
  user: {
    id: 1,
    first_name: "Andrew",
    last_name: "Rogue",
    username: "rogue",
    language_code: "en",
    is_premium: true,
    allows_write_to_pm: true,
  },
  hash: "some-hash",
  auth_date: new Date(),
  start_param: "debug",
  chat_type: "sender",
  chat_instance: "8428209589180549439",
  signature: "some-signature",
};

export const mockThemeParams = {
  accent_text_color: "#6ab2f2",
  bg_color: "#17212b",
  button_color: "#5288c1",
  button_text_color: "#ffffff",
  destructive_text_color: "#ec3942",
  header_bg_color: "#17212b",
  hint_color: "#708499",
  link_color: "#6ab3f3",
  secondary_bg_color: "#232e3c",
  section_bg_color: "#17212b",
  section_header_text_color: "#6ab3f3",
  subtitle_text_color: "#708499",
  text_color: "#f5f5f5",
} as const;
