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
      target: "es2015",
      rollupOptions: {
        output: {
          entryFileNames: `static/js/[name].js`,
          chunkFileNames: `static/js/[name].js`,
          assetFileNames: `static/css/[name].[ext]`,
        },
      },
    },
    server: {
      port: 3000,
    },
  };
});
