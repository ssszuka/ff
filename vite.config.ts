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
    allowedHosts: ["all", "localhost", "dfe97583-edc8-47ef-9e4d-23ea021d26e7-00-3246q5h0rvy31.pike.replit.dev"]
  },
});