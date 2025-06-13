#!/bin/bash

# DFS Portal - Final Production Deployment Script
# This script handles the complete production deployment process

set -e  # Exit on any error

echo "🚀 DFS Portal - Final Production Deployment"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in the correct directory. Please run from project root.${NC}"
    exit 1
fi

# Verify project name
PROJECT_NAME=$(grep '"name"' package.json | head -1 | cut -d'"' -f4)
if [ "$PROJECT_NAME" != "dfs-manager-portal" ]; then
    echo -e "${RED}❌ Error: Wrong project. Expected 'dfs-manager-portal', found '$PROJECT_NAME'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project verified: $PROJECT_NAME${NC}"

# Step 1: Final Quality Check
echo -e "\n${BLUE}📋 Step 1: Final Quality Check${NC}"
echo "Running comprehensive project validation..."

npm run lint
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️ Linting issues found. Auto-fixing...${NC}"
    npm run lint:fix
fi

npm run type-check
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ TypeScript errors found. Please fix before deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Quality check passed${NC}"

# Step 2: Production Build Test
echo -e "\n${BLUE}🔨 Step 2: Production Build Test${NC}"
# Optional Docker Hub login to reduce rate-limit issues
if [[ -n "$DOCKER_USERNAME" && -n "$DOCKER_PASSWORD" ]]; then
  echo -e "${BLUE}🔐 Logging in to Docker Hub as $DOCKER_USERNAME${NC}"
  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
fi
echo "Testing production build..."

npm run build:prod
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Production build failed. Please fix errors.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Production build successful${NC}"

# Step 3: Verify Environment Configuration
echo -e "\n${BLUE}⚙️ Step 3: Environment Configuration${NC}"

if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Missing .env.production file${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Production environment configured${NC}"

# Step 4: Git Status Check
echo -e "\n${BLUE}📝 Step 4: Git Status Check${NC}"

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️ Uncommitted changes found. Committing automatically...${NC}"
    git add .
    git commit -m "Final production optimizations - $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo -e "${GREEN}✅ Git repository clean${NC}"

# Step 5: Push to GitHub
echo -e "\n${BLUE}🌐 Step 5: Push to GitHub${NC}"
echo "Pushing final changes to trigger deployment..."

git push origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Changes pushed to GitHub${NC}"

# Step 6: GitHub Secrets Information
echo -e "\n${BLUE}🔐 Step 6: GitHub Secrets Configuration${NC}"
echo ""
echo "Please ensure these secrets are configured in your GitHub repository:"
echo "Repository URL: https://github.com/Dream-Frame-Service/dfsportal/settings/secrets/actions"
echo ""
echo -e "${YELLOW}Required Secrets:${NC}"
echo "1. VERCEL_TOKEN = Df9VdVMiA6JDBApzLr8om3SS"
echo "2. VERCEL_ORG_ID = team_3q6IOr30kaMWw9pfulba28ef"
echo "3. VERCEL_PROJECT_ID = prj_pCpaWRWFomnGIsvBEnzZeUrsWAgb"
echo "4. VITE_SUPABASE_URL = https://vetufvhzmawjbsumtplq.supabase.co"
echo "5. VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk"

# Step 7: Monitor Deployment
echo -e "\n${BLUE}📊 Step 7: Deployment Monitoring${NC}"
echo ""
echo "🔗 Monitor deployment progress:"
echo "• GitHub Actions: https://github.com/Dream-Frame-Service/dfsportal/actions"
echo "• Vercel Dashboard: https://vercel.com/team_3q6IOr30kaMWw9pfulba28ef"
echo ""

# Step 8: Post-Deployment URLs
echo -e "\n${BLUE}🌐 Step 8: Application URLs${NC}"
echo ""
echo "Once deployment completes, your application will be available at:"
echo "• Production URL: https://dfsportal.vercel.app (or your custom domain)"
echo "• Vercel Project: https://prj-pcpawrwfomngisvbenzzeurswaagb.vercel.app"
echo ""

# Final Status
echo -e "\n${GREEN}🎉 DEPLOYMENT INITIATED SUCCESSFULLY!${NC}"
echo ""
echo "Summary:"
echo "✅ Code quality validated"
echo "✅ Production build tested"
echo "✅ Environment configured"
echo "✅ Changes pushed to GitHub"
echo "✅ GitHub Actions workflow triggered"
echo ""
echo -e "${BLUE}📈 Next Steps:${NC}"
echo "1. Verify GitHub secrets are configured (see above)"
echo "2. Monitor GitHub Actions for deployment status"
echo "3. Test the live application once deployment completes"
echo "4. Configure any custom domain if needed"
echo ""
echo -e "${GREEN}🚀 Your DFS Portal is now deploying to production!${NC}"
echo ""
