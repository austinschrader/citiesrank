import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const getApiUrl = () => {
  const env = process.env.VITE_ENV || "pre";
  const apiConfig = {
    dev: "http://127.0.0.1:8090",
    pre: "https://citiesrank-ppe.westus2.cloudapp.azure.com",
    prod: "https://api.citiesrank.com",
  } as const;
  return apiConfig[env as keyof typeof apiConfig];
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/data": {
        target: getApiUrl(),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data/, "/api"),
        secure: true,
      },
    },
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});