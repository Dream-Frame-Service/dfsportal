#!/bin/bash

# Netlify Build Script for DFS Manager Portal
echo "🚀 Starting Netlify build for DFS Manager Portal..."

# Display versions
echo "📋 Environment info:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Current directory: $(pwd)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Verify vite is installed and accessible
echo "🔍 Verifying Vite..."
if npm list vite; then
    echo "✅ Vite is installed"
else
    echo "❌ Vite not found, installing..."
    npm install vite
fi

# Check if vite command is available
if npx vite --version; then
    echo "✅ Vite command is working"
else
    echo "❌ Vite command failed"
    exit 1
fi

# Run the build
echo "🔨 Building the application..."
npx vite build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Build successful! Output directory created:"
    ls -la dist/
else
    echo "❌ Build failed - no dist directory"
    exit 1
fi

echo "🎉 Netlify build completed successfully!"
