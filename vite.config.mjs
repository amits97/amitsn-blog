import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(() => {
  return {
    plugins: [react()],
    esbuild: false,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        moment: "moment/moment.js",
      },
    },
    build: {
      outDir: "dist",
      commonjsOptions: { transformMixedEsModules: true },
      assetsInlineLimit: 0,
    },
    server: {
      port: 3000,
    },
  };
});
