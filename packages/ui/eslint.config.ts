import { defineConfig } from "eslint/config";

import { baseConfig } from "@rem4d/eslint-config/base";
import { reactConfig } from "@rem4d/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
