// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/data": {
        target: "https://20.3.188.93",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
