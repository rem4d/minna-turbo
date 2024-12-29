/// <reference types="./types.d.ts" />
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import turboConfig from "eslint-config-turbo/flat";

export default tseslint.config(
  ...turboConfig,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules", "build"],
  },
);
