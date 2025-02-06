import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
// import checker from "vite-plugin-checker";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const server =
    mode === "production"
      ? undefined
      : {
          port: 5174,
          host: true,
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
      nodePolyfills(),
      // Allows using React dev server along with building a React application with Vite.
      // https://npmjs.com/package/@vitejs/plugin-react-swc
      react(),
      // Allows using the compilerOptions.paths property in tsconfig.json.
      // https://www.npmjs.com/package/vite-tsconfig-paths
      tsconfigPaths(),

      // Create a custom SSL certificate valid for the local machine.
      // https://www.npmjs.com/package/vite-plugin-mkcert
      mkcert(),
      svgr(),
      tailwindcss(),

      // checker({
      //   typescript: true,
      //   eslint: {
      //     useFlatConfig: true,
      //     lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      //   },
      //   overlay: {
      //     initialIsOpen: false,
      //   },
      // }),
    ],
  };
});
