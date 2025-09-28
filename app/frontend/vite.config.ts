import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    base: "/",
    build: {
      chunkSizeWarningLimit: 2500.0
    },
    plugins: [
      react(),
    ],
  };
});
