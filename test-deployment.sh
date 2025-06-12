#!/bin/bash

# Test GitHub Actions Deployment Script
# Run this after adding GitHub secrets to test the deployment

echo "🚀 Testing GitHub Actions Deployment"
echo "===================================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    git status --short
    echo ""
    echo "Run: git add . && git commit -m 'Update for deployment test'"
    exit 1
fi

# Check if we're on main or production branch
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "production" ]]; then
    echo "⚠️  Current branch ($CURRENT_BRANCH) won't trigger deployment."
    echo "   Deployment only triggers on 'main' or 'production' branches."
    echo ""
    read -p "Switch to main branch? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        echo "✅ Switched to main branch"
    else
        echo "ℹ️  Staying on current branch. Deployment won't trigger."
    fi
fi

# Create a test commit to trigger deployment
echo "📝 Creating test commit to trigger deployment..."
echo "# Deployment Test - $(date)" >> .deployment-test.log
git add .deployment-test.log
git commit -m "Test: Trigger GitHub Actions deployment - $(date)"

echo ""
echo "🔄 Pushing to trigger deployment..."
git push origin HEAD

echo ""
echo "✅ Push complete!"
echo ""
echo "📊 Monitor deployment progress at:"
echo "https://github.com/Dream-Frame-Service/dfsportal/actions"
echo ""
echo "🌐 Check Vercel deployment at:"
echo "https://vercel.com/team_3q6IOr30kaMWw9pfulba28ef/prj_pCpaWRWFomnGIsvBEnzZeUrsWAgb"
echo ""
echo "⏱️  Deployment typically takes 2-5 minutes to complete."
