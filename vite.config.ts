import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

// Custom plugin to fix MIME types
const mimeTypePlugin = (): Plugin => ({
  name: 'mime-type-fix',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith('.js') || req.url?.includes('.js?')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (req.url?.endsWith('.mjs') || req.url?.includes('.mjs?')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (req.url?.endsWith('.ts') || req.url?.includes('.ts?')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (req.url?.endsWith('.tsx') || req.url?.includes('.tsx?')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith('.js') || req.url?.includes('.js?')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (req.url?.endsWith('.mjs') || req.url?.includes('.mjs?')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mimeTypePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    middlewareMode: false,
    cors: true,
    fs: {
      strict: false
    }
  },
  preview: {
    port: 4173,
    host: true,
    cors: true
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
});
