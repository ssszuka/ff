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
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "client", "pages", "index.html"),
        portal: path.resolve(import.meta.dirname, "client", "pages", "portal.html"),
        "not-found": path.resolve(import.meta.dirname, "client", "pages", "not-found.html"),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  },
  server: {
    host: "0.0.0.0",
    port: PORT,
    allowedHosts: ["all", "localhost", "ddc157c2-c988-4b62-8a98-6a57530a3027-00-31a4byq853644.sisko.replit.dev"]
  },
});