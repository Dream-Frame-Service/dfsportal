#!/bin/bash

# SIMPLE VERCEL DEPLOYMENT - NO ID CONFLICTS
# This script avoids the VERCEL_ORG_ID error by using auto-detection

echo "🚀 SIMPLE VERCEL DEPLOYMENT"
echo "=========================="
echo "Deploying DFS Portal without ID conflicts"
echo

# Step 1: Ensure dependencies are installed
echo "📦 Installing dependencies..."
npm ci --silent || npm install --silent

# Step 2: Build the application
echo "🏗️ Building application..."
npm run build

# Step 3: Check if build was successful
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build successful - dist directory created"
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Step 4: Deploy with auto-detection (no PROJECT_ID or ORG_ID needed)
echo "🚀 Deploying to Vercel..."
echo "📍 Using auto-detection (no project/org ID conflicts)"

# Try multiple deployment approaches
if command -v vercel &> /dev/null; then
    echo "Using installed Vercel CLI..."
    vercel --prod --yes
elif command -v npx &> /dev/null; then
    echo "Using npx vercel..."
    npx vercel --prod --yes
else
    echo "Installing and using Vercel CLI..."
    npm install -g vercel
    vercel --prod --yes
fi

# Check deployment result
DEPLOY_EXIT_CODE=$?
if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🔗 Check your Vercel dashboard for the deployment URL"
else
    echo "❌ Deployment failed with exit code: $DEPLOY_EXIT_CODE"
    echo "💡 Try: vercel link (to connect to existing project)"
    echo "💡 Or: vercel --prod (for interactive setup)"
fi

echo
echo "🎯 DEPLOYMENT COMPLETE"
echo "====================="
echo "Status: $([ $DEPLOY_EXIT_CODE -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')"
echo "Time: $(date)"
