import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import runtimeEnv from "vite-plugin-runtime-env";

// https://vitejs.dev/config/
export default defineConfig(({}) => ({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [runtimeEnv(), react()].filter(Boolean),
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.ts",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
