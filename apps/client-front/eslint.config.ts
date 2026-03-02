import { baseConfig } from "@minna/eslint-config/base";
import { reactConfig } from "@minna/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig(baseConfig, reactConfig);
