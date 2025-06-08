#!/bin/bash
# Vercel build script for DFS Manager Portal
# This ensures proper permissions and environment setup

echo "🔧 Starting Vercel build process..."

# Ensure we have the right Node.js version
echo "📦 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Make vite executable (permission fix)
chmod +x node_modules/.bin/vite || true

# Build the application
echo "🔨 Building application..."
npx vite build

# Verify build output
if [ -d "dist" ]; then
  echo "✅ Build successful! Output in dist/"
  ls -la dist/
else
  echo "❌ Build failed - no dist directory found"
  exit 1
fi

echo "🚀 Build complete!"
