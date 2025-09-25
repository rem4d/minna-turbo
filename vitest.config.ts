import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        root: "./apps",
      },
      {
        root: "./packages",
      },
    ],
  },
});
