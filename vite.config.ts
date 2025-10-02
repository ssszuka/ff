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
  root: path.resolve(import.meta.dirname, "client", "pages"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('wouter')) {
              return 'vendor';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui';
            }
            if (id.includes('framer-motion') || id.includes('@tanstack')) {
              return 'utils';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: PORT,
    allowedHosts: ["all", "localhost", "152638dc-b8ae-436b-948a-2ccb92e5cfd0-00-1gs50vzghontc.sisko.replit.dev"]
  },
});