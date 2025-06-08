#!/usr/bin/env node

/**
 * Simple Vercel Build Script - Backup Method
 * 
 * This script uses a simple approach that should work on any Node.js environment
 */

console.log('🚀 Simple Vercel build starting...');

async function simpleBuild() {
  try {
    // Dynamic import to avoid permission issues
    const { execSync } = await import('child_process');
    
    console.log('📦 Node.js version:', process.version);
    console.log('📍 Working directory:', process.cwd());
    
    // Method 1: Try using node to run vite directly
    console.log('🔧 Method 1: Using node to execute vite...');
    try {
      execSync('node ./node_modules/vite/bin/vite.js build', { 
        stdio: 'inherit',
        timeout: 300000 // 5 minutes timeout
      });
      console.log('✅ Method 1 successful!');
      return;
    } catch (error) {
      console.log('⚠️ Method 1 failed, trying method 2...');
    }

    // Method 2: Try npx with explicit path
    console.log('🔧 Method 2: Using npx with explicit configuration...');
    try {
      execSync('npx --yes vite@latest build', { 
        stdio: 'inherit',
        env: { ...process.env, NPM_CONFIG_YES: 'true' },
        timeout: 300000
      });
      console.log('✅ Method 2 successful!');
      return;
    } catch (error) {
      console.log('⚠️ Method 2 failed, trying method 3...');
    }

    // Method 3: Use programmatic approach
    console.log('🔧 Method 3: Using programmatic Vite API...');
    try {
      const vitePath = './node_modules/vite/dist/node/index.js';
      const vite = await import(vitePath);
      
      await vite.build({
        mode: 'production',
        build: {
          outDir: 'dist',
          emptyOutDir: true,
          minify: true,
          rollupOptions: {
            output: {
              manualChunks: {
                vendor: ['react', 'react-dom'],
                router: ['react-router-dom'],
                ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
                supabase: ['@supabase/supabase-js']
              }
            }
          }
        }
      });
      
      console.log('✅ Method 3 successful!');
      return;
    } catch (error) {
      console.log('⚠️ Method 3 failed, trying final method...');
    }

    // Method 4: Final fallback - direct execution
    console.log('🔧 Method 4: Final fallback method...');
    execSync('npm run build', { 
      stdio: 'inherit',
      timeout: 300000
    });
    console.log('✅ Method 4 successful!');

  } catch (error) {
    console.error('❌ All build methods failed:', error.message);
    
    // Last resort: try to install and build
    console.log('🚨 Last resort: Reinstalling and building...');
    try {
      const { execSync } = await import('child_process');
      execSync('npm install', { stdio: 'inherit' });
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Last resort successful!');
    } catch (finalError) {
      console.error('💥 Complete build failure:', finalError.message);
      process.exit(1);
    }
  }
}

// Check if dist directory exists after build
async function verifyBuild() {
  const fs = await import('fs');
  const path = await import('path');
  
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(distPath)) {
    throw new Error('Build verification failed: dist directory does not exist');
  }
  
  if (!fs.existsSync(indexPath)) {
    throw new Error('Build verification failed: index.html does not exist');
  }
  
  console.log('✅ Build verification passed!');
  
  // Log file sizes
  const files = fs.readdirSync(distPath, { recursive: true });
  console.log('📁 Generated files:');
  files.forEach(file => {
    if (typeof file === 'string') {
      const filePath = path.join(distPath, file);
      if (fs.statSync(filePath).isFile()) {
        const size = fs.statSync(filePath).size;
        console.log(`   ${file}: ${(size / 1024).toFixed(1)} KB`);
      }
    }
  });
}

// Run the build
simpleBuild()
  .then(() => {
    return verifyBuild();
  })
  .then(() => {
    console.log('🎉 Simple build completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Simple build failed:', error.message);
    process.exit(1);
  });
