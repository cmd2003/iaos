import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Backend URL is configurable via VITE_API_PROXY (defaults to :8000).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_PROXY || "http://localhost:8000";
  return {
    plugins: [react()],
    server: {
      // Honor an assigned PORT (preview harness / CI); default to 5173 locally.
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
      proxy: {
        // Dev: forward API calls to the FastAPI backend.
        "/api": target,
      },
    },
  };
});
