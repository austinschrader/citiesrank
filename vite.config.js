import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var getApiUrl = function () {
    var env = process.env.VITE_ENV || "pre";
    var apiConfig = {
        dev: "http://127.0.0.1:8090",
        pre: "https://citiesrank-ppe.westus2.cloudapp.azure.com",
        prod: "https://api.citiesrank.com",
    };
    return apiConfig[env];
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
