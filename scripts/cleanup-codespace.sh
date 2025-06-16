#!/bin/bash

# DFS Portal Codespace Disk Space Management Script
echo "🧹 DFS Portal - Codespace Cleanup Script"
echo "========================================"

# Function to show disk usage
show_disk_usage() {
    echo "📊 Current Disk Usage:"
    df -h | grep -E "(Filesystem|/dev/|overlay)"
    echo ""
}

# Function to show directory sizes
show_directory_sizes() {
    echo "📁 Directory Sizes:"
    du -sh /workspaces/dfsportal/* 2>/dev/null | sort -hr | head -10
    echo ""
}

# Initial disk usage
echo "🔍 Before cleanup:"
show_disk_usage
show_directory_sizes

# Clean npm cache
echo "🗑️  Cleaning npm cache..."
npm cache clean --force

# Clean node_modules cache directories
echo "🗑️  Cleaning node_modules cache..."
find /workspaces/dfsportal/node_modules -name ".cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Clean build artifacts
echo "🗑️  Cleaning build artifacts..."
cd /workspaces/dfsportal
rm -rf dist/ build/ .next/ .nuxt/ 2>/dev/null || true

# Clean temporary files
echo "🗑️  Cleaning temporary files..."
find /workspaces/dfsportal -name "*.log" -delete 2>/dev/null || true
find /workspaces/dfsportal -name "*.tmp" -delete 2>/dev/null || true
find /workspaces/dfsportal -name ".DS_Store" -delete 2>/dev/null || true

# Clean TypeScript build info
echo "🗑️  Cleaning TypeScript build cache..."
find /workspaces/dfsportal -name "*.tsbuildinfo" -delete 2>/dev/null || true

# Clean Vite cache
echo "🗑️  Cleaning Vite cache..."
rm -rf /workspaces/dfsportal/.vite/ 2>/dev/null || true

# Clean ESLint cache
echo "🗑️  Cleaning ESLint cache..."
rm -rf /workspaces/dfsportal/.eslintcache 2>/dev/null || true

# Clean Docker if present
if command -v docker &> /dev/null; then
    echo "🐳 Cleaning Docker cache..."
    docker system prune -f 2>/dev/null || true
fi

# Final disk usage
echo "✅ After cleanup:"
show_disk_usage
show_directory_sizes

echo "🎉 Cleanup completed!"
echo ""
echo "💡 Additional tips:"
echo "   - Consider using 'npm ci' instead of 'npm install' for faster, space-efficient installs"
echo "   - Use '.dockerignore' and '.gitignore' to exclude unnecessary files"
echo "   - Regularly run this script to maintain optimal disk usage"
