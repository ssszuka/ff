import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: PORT,
    allowedHosts: ["all", "localhost", "9faa8c73-97d7-4442-8839-4418d3da4ae0-00-2jg4t7q30c7ah.sisko.replit.dev"]
  },
});