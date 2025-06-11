import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          
          // UI component libraries
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) {
            return 'ui-components';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'animations';
          }
          
          // Utility libraries
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/zod')) {
            return 'utilities';
          }
          
          // AWS SDK (large library)
          if (id.includes('node_modules/@aws-sdk')) {
            return 'aws-sdk';
          }
          
          // Admin pages (split by functionality to avoid large chunks)
          if (id.includes('src/pages/Admin/AdminPanel') || 
              id.includes('src/pages/Admin/AdminDashboard') ||
              id.includes('src/pages/Admin/UserManagement') ||
              id.includes('src/pages/Admin/SiteManagement')) {
            return 'admin-core';
          }
          
          if (id.includes('src/pages/Admin/SystemLogs') || 
              id.includes('src/pages/Admin/DatabaseMonitoring') ||
              id.includes('src/pages/Admin/MemoryMonitoring') ||
              id.includes('src/pages/Admin/AuditMonitoring')) {
            return 'admin-monitoring';
          }
          
          if (id.includes('src/pages/Admin/SecuritySettings') || 
              id.includes('src/pages/Admin/SMSAlertManagement') ||
              id.includes('src/pages/Admin/ErrorRecoveryPage')) {
            return 'admin-security';
          }
          
          if (id.includes('src/pages/Admin/DatabaseAutoSync') || 
              id.includes('src/pages/Admin/SupabaseConnectionTest') ||
              id.includes('src/pages/Admin/DevelopmentMonitoring') ||
              id.includes('src/pages/Admin/RoleTestingPage') ||
              id.includes('src/pages/Admin/AdvancedRealTimeFeatures')) {
            return 'admin-development';
          }
          
          // Catch any remaining admin pages
          if (id.includes('src/pages/Admin')) {
            return 'admin-misc';
          }
          
          // Business logic pages
          if (id.includes('src/pages/Products') || id.includes('src/pages/Sales') || 
              id.includes('src/pages/Orders') || id.includes('src/pages/Inventory')) {
            return 'business-pages';
          }
          
          // HR/Employee pages
          if (id.includes('src/pages/Employees') || id.includes('src/pages/Salary')) {
            return 'hr-pages';
          }
          
          // Other vendor packages
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development'
  }
}));