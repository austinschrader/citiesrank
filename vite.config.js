// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { getApiUrl } from './src/appConfig';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv("", process.cwd(), ["VITE_", "PIXABAY_"]);
    var apiUrl = getApiUrl(env.VITE_ENV);
    return {
        plugins: [react()],
        server: {
            proxy: {
                "/data": {
                    target: apiUrl,
                    changeOrigin: true,
                    rewrite: function (path) { return path.replace(/^\/data/, "/api"); },
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
