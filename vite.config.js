// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = mode === 'production' ? env.VITE_API_URL_PRODUCTION : env.VITE_API_URL_DEVELOPMENT;
  console.log("API URL:", apiUrl);

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
