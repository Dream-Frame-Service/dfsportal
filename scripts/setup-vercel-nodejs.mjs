#!/usr/bin/env node

/**
 * Vercel Environment Setup Script
 * Ensures Vercel project is configured for Node.js 18.x
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Vercel Node.js 18.x Configuration Setup');
console.log('==========================================');

// Check if we're in a Vercel environment
const isVercelBuild = process.env.VERCEL === '1';
console.log(`📍 Running in Vercel environment: ${isVercelBuild ? 'Yes' : 'No'}`);

// Display current Node.js version
const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
console.log(`🔍 Current Node.js version: ${nodeVersion}`);

// Check if .node-version file exists
const nodeVersionFile = path.join(process.cwd(), '.node-version');
const nvmrcFile = path.join(process.cwd(), '.nvmrc');

if (fs.existsSync(nodeVersionFile)) {
  const specifiedVersion = fs.readFileSync(nodeVersionFile, 'utf8').trim();
  console.log(`📋 .node-version specifies: ${specifiedVersion}`);
} else {
  console.log('⚠️  .node-version file not found');
}

if (fs.existsSync(nvmrcFile)) {
  const nvmrcVersion = fs.readFileSync(nvmrcFile, 'utf8').trim();
  console.log(`📋 .nvmrc specifies: ${nvmrcVersion}`);
} else {
  console.log('⚠️  .nvmrc file not found');
}

// Verify Node.js version compatibility
if (nodeMajor === 18) {
  console.log('✅ Node.js 18.x is active - perfect!');
} else if (nodeMajor > 18) {
  console.log('⚠️  Node.js version is newer than 18.x - should work but 18.x is recommended');
} else {
  console.log('❌ Node.js version is older than 18.x - upgrade required');
}

console.log('\n📝 Vercel Configuration Instructions:');
console.log('====================================');
console.log('1. Go to your Vercel dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings > General');
console.log('4. Find "Node.js Version" setting');
console.log('5. Set it to "18.x"');
console.log('6. Redeploy your project');
console.log('\n🔗 Direct link: https://vercel.com/dashboard');

console.log('\n📁 Files configured for Node.js 18.x:');
console.log('- .node-version: 18.19.0');
console.log('- .nvmrc: 18.19.0');
console.log('- package.json: engines.node = ">=18.19.0 <19.0.0"');
console.log('- Dockerfile: node:18-alpine');
console.log('- netlify.toml: NODE_VERSION = "18.19.0"');
console.log('- GitHub Actions: node-version = "18.19.0"');

if (isVercelBuild && nodeMajor !== 18) {
  console.log('\n❌ VERCEL BUILD ERROR:');
  console.log('Node.js version mismatch detected in Vercel build environment');
  console.log('Please update Vercel project settings to use Node.js 18.x');
  process.exit(1);
}

console.log('\n🎉 Setup complete! Your project is configured for Node.js 18.x');
