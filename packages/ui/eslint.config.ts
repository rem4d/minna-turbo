import { defineConfig } from "eslint/config";

import { baseConfig } from "@minna/eslint-config/base";
import { reactConfig } from "@minna/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
