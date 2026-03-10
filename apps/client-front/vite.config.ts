import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react-swc";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import checker from "vite-plugin-checker";
import { VitePluginRadar } from "vite-plugin-radar";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const server =
    mode === "production"
      ? undefined
      : {
          port: 5174,
          host: true,
          // https: true,
          proxy: {
            "/trpc/api": {
              target: "http://localhost:1223/",
              // changeOrigin: true,
            },
            "/tts": {
              target: "http://localhost:1223",
              // changeOrigin: true,
            },
            "/m": {
              target: "http://localhost:1223",
              // changeOrigin: true,
            },
          },
        };
  return {
    server,
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      // Allows using the compilerOptions.paths property in tsconfig.json.
      // https://www.npmjs.com/package/vite-tsconfig-paths
      tsconfigPaths(),
      svgr(),
      tailwindcss(),

      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
        overlay: {
          initialIsOpen: false,
          position: "br",
        },
      }),
      visualizer({
        filename: "stats.html",
        emitFile: true,
      }),

      VitePluginRadar({
        // Google Analytics tag injection
        analytics: {
          id: "G-NB2ZXX0SP6",
        },
      }),
    ],
    build: {
      sourcemap: "hidden",
    },
  };
});
