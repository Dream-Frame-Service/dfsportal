#!/bin/bash

# Simple Vercel Deployment Script
# This script will build and deploy the latest version to Vercel

echo "🚀 Starting Vercel Deployment..."
echo "📅 $(date)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build:vercel

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod --yes
    echo "✅ Deployment completed!"
    echo ""
    echo "🎯 Your application should be live at:"
    echo "   https://dfsportal.vercel.app"
    echo ""
    echo "🔐 Admin can now login at:"
    echo "   https://dfsportal.vercel.app/login"
else
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
