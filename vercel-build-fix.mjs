#!/usr/bin/env node

/**
 * VERCEL DEPLOYMENT FIX
 * Resolves "spawn npm ENOENT" error during Vercel deployments
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 VERCEL BUILD - FIXING NPM PATH ISSUE');
console.log('📍 Node.js version:', process.version);
console.log('📍 Working directory:', process.cwd());

// Function to execute commands with proper error handling
function executeCommand(command, description) {
  try {
    console.log(`\n🔧 ${description}...`);
    console.log(`📝 Command: ${command}`);
    
    const result = execSync(command, {
      stdio: 'inherit',
      timeout: 300000,
      env: {
        ...process.env,
        PATH: process.env.PATH,
        NODE_ENV: 'production'
      }
    });
    
    console.log(`✅ ${description} completed successfully`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

// Main build process
async function main() {
  try {
    // Step 1: Verify environment
    console.log('\n📋 VERIFYING BUILD ENVIRONMENT');
    executeCommand('node --version', 'Node.js version check');
    executeCommand('npm --version', 'npm version check');
    
    // Step 2: Clean previous builds
    console.log('\n🧹 CLEANING PREVIOUS BUILDS');
    if (existsSync('dist')) {
      executeCommand('rm -rf dist', 'Removing old dist directory');
    }
    if (existsSync('node_modules/.cache')) {
      executeCommand('rm -rf node_modules/.cache', 'Clearing build cache');
    }
    
    // Step 3: Install dependencies
    console.log('\n📦 INSTALLING DEPENDENCIES');
    executeCommand('npm ci --production=false', 'Installing all dependencies');
    
    // Step 4: Type checking
    console.log('\n🔍 TYPE CHECKING');
    executeCommand('npm run type-check', 'TypeScript compilation check');
    
    // Step 5: Build the application
    console.log('\n🏗️ BUILDING APPLICATION');
    executeCommand('npm run build', 'Production build');
    
    // Step 6: Verify build output
    console.log('\n✅ VERIFYING BUILD OUTPUT');
    if (existsSync('dist/index.html')) {
      console.log('✅ index.html generated successfully');
    } else {
      throw new Error('Build failed: index.html not found');
    }
    
    if (existsSync('dist/assets')) {
      console.log('✅ Assets directory generated successfully');
    } else {
      throw new Error('Build failed: assets directory not found');
    }
    
    console.log('\n🎉 VERCEL BUILD COMPLETED SUCCESSFULLY!');
    console.log('📊 Build stats:');
    executeCommand('ls -la dist/', 'Listing build output');
    
  } catch (error) {
    console.error('\n💥 VERCEL BUILD FAILED!');
    console.error('❌ Error:', error.message);
    
    // Diagnostic information
    console.log('\n🔍 DIAGNOSTIC INFORMATION:');
    try {
      executeCommand('which node', 'Node.js location');
      executeCommand('which npm', 'npm location');
      executeCommand('echo $PATH', 'Environment PATH');
      executeCommand('ls -la node_modules/.bin/ | head -10', 'Available binaries');
    } catch (diagError) {
      console.log('Diagnostics failed:', diagError.message);
    }
    
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
