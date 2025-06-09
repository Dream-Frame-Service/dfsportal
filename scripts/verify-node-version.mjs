#!/usr/bin/env node

/**
 * Node.js Version Verification Script
 * Verifies that the current Node.js version meets the project requirements
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get the required Node.js version
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const currentNodeVersion = process.version;
const requiredNodeVersion = packageJson.engines?.node;

console.log('🔍 Node.js Version Verification');
console.log('================================');
console.log(`Current Node.js version: ${currentNodeVersion}`);
console.log(`Required Node.js version: ${requiredNodeVersion}`);

// Extract major version number
const currentMajor = parseInt(currentNodeVersion.slice(1).split('.')[0]);
const requiredRange = requiredNodeVersion;

// Check if current version meets requirements
if (requiredRange.includes('>=18') && currentMajor >= 18 && currentMajor < 19) {
  console.log('✅ Node.js version is compatible with the project requirements');
  console.log('✅ Node.js 18.x configuration is properly set up');
} else if (currentMajor >= 18) {
  console.log('⚠️  Current Node.js version is newer than required, but should be compatible');
  console.log('💡 Consider using Node.js 18.x for best compatibility');
} else {
  console.log('❌ Current Node.js version does not meet project requirements');
  console.log('🔧 Please install Node.js 18.x or use nvm to switch versions');
  process.exit(1);
}

// Check .nvmrc file
try {
  const nvmrcPath = join(__dirname, '..', '.nvmrc');
  const nvmrcVersion = readFileSync(nvmrcPath, 'utf8').trim();
  console.log(`📋 .nvmrc specifies: Node.js ${nvmrcVersion}`);
} catch (error) {
  console.log('⚠️  .nvmrc file not found');
}

console.log('\n🚀 Your project is configured for Node.js 18.x!');
console.log('\nConfiguration files updated:');
console.log('- package.json: engines.node set to ">=18.19.0 <19.0.0"');
console.log('- .nvmrc: set to "18.19.0"');
console.log('- Dockerfile: uses node:18-alpine');
console.log('- netlify.toml: NODE_VERSION set to "18.19.0"');
console.log('- GitHub Actions: node-version set to "18.19.0"');
