#!/bin/bash

# GitHub Vercel Secrets Verification Script
# This script helps verify that your GitHub secrets are properly configured

echo "🔍 GitHub Vercel Secrets Setup Verification"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from your project root."
    exit 1
fi

# Get repository information
REPO_URL=$(git config --get remote.origin.url)
if [[ $REPO_URL == *"github.com"* ]]; then
    echo "✅ Git repository detected"
    echo "   Repository: $REPO_URL"
else
    echo "❌ GitHub repository not detected"
    exit 1
fi

# Check if workflow file exists
WORKFLOW_FILE=".github/workflows/deploy.yml"
if [ -f "$WORKFLOW_FILE" ]; then
    echo "✅ GitHub Actions workflow found: $WORKFLOW_FILE"
    
    # Check if Vercel deployment step exists
    if grep -q "amondnet/vercel-action" "$WORKFLOW_FILE"; then
        echo "✅ Vercel deployment action found in workflow"
    else
        echo "❌ Vercel deployment action not found in workflow"
    fi
    
    # Check if secrets are referenced
    if grep -q "secrets.VERCEL_TOKEN" "$WORKFLOW_FILE" && \
       grep -q "secrets.VERCEL_ORG_ID" "$WORKFLOW_FILE" && \
       grep -q "secrets.VERCEL_PROJECT_ID" "$WORKFLOW_FILE"; then
        echo "✅ All required Vercel secrets are referenced in workflow"
    else
        echo "❌ Missing Vercel secret references in workflow"
    fi
else
    echo "❌ GitHub Actions workflow not found: $WORKFLOW_FILE"
fi

# Check Vercel configuration
if [ -f "vercel.json" ]; then
    echo "✅ Vercel configuration found: vercel.json"
else
    echo "⚠️  Vercel configuration not found (optional)"
fi

echo ""
echo "📋 Required GitHub Secrets to Add:"
echo "=================================="
echo "Secret Name: VERCEL_TOKEN"
echo "Secret Value: Df9VdVMiA6JDBApzLr8om3SS"
echo ""
echo "Secret Name: VERCEL_ORG_ID"
echo "Secret Value: team_3q6IOr30kaMWw9pfulba28ef"
echo ""
echo "Secret Name: VERCEL_PROJECT_ID" 
echo "Secret Value: prj_pCpaWRWFomnGIsvBEnzZeUrsWAgb"
echo ""

echo "🔗 Add secrets at:"
echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/settings/secrets/actions"
echo ""

echo "✅ Setup Complete!"
echo "After adding the secrets, push to main branch to trigger deployment."
