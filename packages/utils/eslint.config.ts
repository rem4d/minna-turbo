import { defineConfig } from "eslint/config";

import { baseConfig } from "@rem4d/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
