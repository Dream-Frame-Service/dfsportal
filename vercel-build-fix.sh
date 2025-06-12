#!/bin/bash

# VERCEL DEPLOYMENT FIX - BASH VERSION
# Alternative approach for npm ENOENT issues

echo "🚀 VERCEL BUILD - BASH FALLBACK APPROACH"
echo "📍 Node.js version: $(node --version)"
echo "📍 Working directory: $(pwd)"

# Set up environment
export NODE_ENV=production
export CI=true

# Function to run commands with error handling
run_command() {
  local description="$1"
  local command="$2"
  
  echo ""
  echo "🔧 $description..."
  echo "📝 Command: $command"
  
  if eval "$command"; then
    echo "✅ $description completed successfully"
  else
    echo "❌ $description failed"
    echo "🔍 Debugging information:"
    echo "PATH: $PATH"
    echo "Node location: $(which node)"
    echo "npm location: $(which npm || echo 'npm not found')"
    exit 1
  fi
}

# Main build process
echo ""
echo "📋 STARTING VERCEL BUILD PROCESS"

# Clean previous builds
run_command "Cleaning previous builds" "rm -rf dist node_modules/.cache"

# Install dependencies using exact npm path
NPM_CMD=$(which npm || echo "npm")
run_command "Installing dependencies" "$NPM_CMD ci --production=false"

# Type check
run_command "Type checking" "$NPM_CMD run type-check"

# Build
run_command "Building application" "$NPM_CMD run build"

# Verify build
if [ -f "dist/index.html" ]; then
  echo "✅ Build verification: index.html exists"
else
  echo "❌ Build verification failed: index.html not found"
  exit 1
fi

if [ -d "dist/assets" ]; then
  echo "✅ Build verification: assets directory exists"
else
  echo "❌ Build verification failed: assets directory not found"
  exit 1
fi

echo ""
echo "🎉 VERCEL BUILD COMPLETED SUCCESSFULLY!"
echo "📊 Build output:"
ls -la dist/
