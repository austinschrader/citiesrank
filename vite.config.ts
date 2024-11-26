// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { getApiUrl } from './src/appConfig';

export default defineConfig(({ mode }) => {
  const env = loadEnv("", process.cwd(), ["VITE_", "PIXABAY_"]);
  const apiUrl = getApiUrl(env.VITE_ENV);

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/data": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/data/, "/api"),
          secure: true,
        },
      },
      // Add this to ensure we're listening on all available network interfaces
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
