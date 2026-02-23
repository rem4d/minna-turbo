// import reactConfig from "@minna/eslint-config/react";
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
import baseConfig from "@minna/eslint-config/base";
import reactConfig from "@minna/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
