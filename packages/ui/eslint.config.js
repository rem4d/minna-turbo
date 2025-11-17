//
// /** @type {import('typescript-eslint').Config} */
// export default [
//   {
//     ignores: [".next/**"],
//   },
//   ...reactConfig,
// ];
//
//
import baseConfig from "@rem4d/eslint-config/base";
import reactConfig from "@rem4d/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
