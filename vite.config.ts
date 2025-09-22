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
    allowedHosts: ["all", "localhost", "d57f66b1-e739-43e7-865d-415138282795-00-31clty1uedt5j.sisko.replit.dev"]
  },
});