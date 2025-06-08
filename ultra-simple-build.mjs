#!/usr/bin/env node

/**
 * Ultra-Simple Vercel Build Script
 * 
 * This is the most basic approach possible - just executes the vite binary
 * directly through various methods to bypass permission issues.
 */

console.log('🔧 Ultra-simple Vercel build starting...');

async function ultraSimpleBuild() {
  const { spawn } = await import('child_process');
  
  // Method 1: Direct node execution of vite
  console.log('🎯 Attempting direct node execution...');
  
  return new Promise((resolve, reject) => {
    const child = spawn('node', [
      './node_modules/vite/bin/vite.js',
      'build'
    ], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Ultra-simple build successful!');
        resolve();
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('❌ Process error:', error.message);
      reject(error);
    });
  });
}

ultraSimpleBuild()
  .then(() => {
    console.log('🎉 Ultra-simple build completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Ultra-simple build failed:', error.message);
    process.exit(1);
  });
