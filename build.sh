#!/bin/bash

# Production Build Script for Netlify
# This script ensures all dependencies are installed and builds the project

echo "🚀 Starting DFS Manager Portal Production Build..."

# Set Node.js version
echo "📦 Using Node.js version:"
node --version
npm --version

# Clean any existing node_modules and package-lock.json
echo "🧹 Cleaning previous installation..."
rm -rf node_modules
rm -f package-lock.json

# Install all dependencies (including devDependencies)
echo "📥 Installing all dependencies..."
npm install --include=dev

# Verify vite is available
echo "🔍 Verifying Vite installation..."
npx vite --version

# Build the project
echo "🔨 Building production bundle..."
npm run build

echo "✅ Build completed successfully!"

# List the output directory
echo "📁 Build output:"
ls -la dist/

echo "🎉 DFS Manager Portal build completed successfully!"
