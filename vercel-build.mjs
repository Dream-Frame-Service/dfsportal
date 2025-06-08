#!/usr/bin/env node

/**
 * Vercel Build Script - Permanent Fix for Permission Issues
 * 
 * This script uses Vite's programmatic API instead of relying on binary execution,
 * which completely bypasses permission issues on Vercel's deployment environment.
 */

import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = __dirname;

console.log('🚀 Starting Vercel build process...');
console.log('📍 Project root:', projectRoot);
console.log('🔧 Using Vite programmatic API to bypass permission issues');

async function buildApp() {
  try {
    // Verify we have a vite config
    const viteConfigPath = resolve(projectRoot, 'vite.config.ts');
    if (!fs.existsSync(viteConfigPath)) {
      throw new Error('vite.config.ts not found');
    }
    
    console.log('✅ Found vite.config.ts');
    
    // Import the vite config dynamically
    const viteConfig = {
      // Base Vite configuration for production build
      root: projectRoot,
      mode: 'production',
      build: {
        outDir: resolve(projectRoot, 'dist'),
        emptyOutDir: true,
        minify: true,
        sourcemap: false,
        target: 'es2015',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['react-router-dom'],
              ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
              query: ['@tanstack/react-query'],
              supabase: ['@supabase/supabase-js']
            }
          }
        }
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    };

    console.log('🔨 Starting Vite build...');
    console.time('Build completed in');

    // Use Vite's programmatic API to build
    await build(viteConfig);

    console.timeEnd('Build completed in');
    
    // Verify build output
    const distPath = resolve(projectRoot, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error('Build failed - dist directory not created');
    }

    const indexPath = resolve(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error('Build failed - index.html not created');
    }

    // List generated files
    console.log('✅ Build successful! Generated files:');
    const files = fs.readdirSync(distPath, { recursive: true });
    files.forEach(file => {
      const filePath = resolve(distPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const size = (stats.size / 1024).toFixed(2);
        console.log(`   📄 ${file} (${size} KB)`);
      }
    });

    console.log('🎉 Vercel build completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Try fallback build method
    console.log('🔄 Attempting fallback build method...');
    try {
      await fallbackBuild();
    } catch (fallbackError) {
      console.error('❌ Fallback build also failed:', fallbackError.message);
      process.exit(1);
    }
  }
}

async function fallbackBuild() {
  console.log('🛠️ Using fallback build method...');
  
  // Import child_process to run node directly
  const { spawn } = await import('child_process');
  
  return new Promise((resolve, reject) => {
    // Use node directly to run vite build
    const child = spawn('node', [
      '-e', 
      `
      import('vite').then(({ build }) => {
        return build({
          mode: 'production',
          build: {
            outDir: 'dist',
            emptyOutDir: true
          }
        });
      }).then(() => {
        console.log('Fallback build successful');
        process.exit(0);
      }).catch(err => {
        console.error('Fallback build failed:', err);
        process.exit(1);
      });
      `
    ], {
      stdio: 'inherit',
      cwd: projectRoot
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Fallback build completed successfully');
        resolve();
      } else {
        reject(new Error(`Fallback build failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the build process
buildApp();
