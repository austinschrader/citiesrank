// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/data": {
        target: "http://20.3.188.93", // Using http since this works
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data/, "/api"),
        secure: false,
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
});
