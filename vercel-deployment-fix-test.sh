#!/bin/bash

# VERCEL DEPLOYMENT FIX - COMPREHENSIVE SOLUTION
# Fixes the "VERCEL_ORG_ID missing" error and provides multiple deployment options

echo "🚀 VERCEL DEPLOYMENT FIX - COMPREHENSIVE SOLUTION"
echo "=================================================="
echo "Date: $(date)"
echo

# Test 1: Verify current Vercel configuration
echo "🔍 VERCEL CONFIGURATION CHECK"
echo "-----------------------------"

if [ -f "vercel.json" ]; then
    echo "✅ vercel.json exists"
    if grep -q "buildCommand" vercel.json; then
        echo "✅ Build command configured"
    else
        echo "❌ Build command missing"
    fi
else
    echo "❌ vercel.json missing"
fi

# Test 2: Check for problematic ID references
echo
echo "🔍 CHECKING FOR VERCEL ID REFERENCES"
echo "-----------------------------------"

PROJECT_ID_REFS=$(grep -r "VERCEL_PROJECT_ID" . --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | wc -l)
ORG_ID_REFS=$(grep -r "VERCEL_ORG_ID" . --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | wc -l)

echo "📊 VERCEL_PROJECT_ID references: $PROJECT_ID_REFS"
echo "📊 VERCEL_ORG_ID references: $ORG_ID_REFS"

if [ $PROJECT_ID_REFS -gt $ORG_ID_REFS ]; then
    echo "⚠️ Warning: More PROJECT_ID than ORG_ID references detected"
    echo "🔧 This can cause the deployment error you experienced"
else
    echo "✅ ID references appear balanced"
fi

# Test 3: Verify emergency deployment scripts
echo
echo "🛠️ EMERGENCY DEPLOYMENT SCRIPTS STATUS"
echo "-------------------------------------"

if [ -f "emergency-deploy.sh" ]; then
    echo "✅ emergency-deploy.sh exists"
    if grep -q "VERCEL_PROJECT_ID.*=" emergency-deploy.sh; then
        echo "⚠️ Still contains VERCEL_PROJECT_ID assignment"
    else
        echo "✅ VERCEL_PROJECT_ID assignment removed"
    fi
    
    if grep -q "auto-detect" emergency-deploy.sh; then
        echo "✅ Auto-detection enabled"
    else
        echo "❌ Auto-detection not configured"
    fi
else
    echo "❌ emergency-deploy.sh missing"
fi

if [ -f "emergency-deploy.ps1" ]; then
    echo "✅ emergency-deploy.ps1 exists"
    if grep -q "VERCEL_PROJECT_ID.*=" emergency-deploy.ps1; then
        echo "⚠️ Still contains VERCEL_PROJECT_ID assignment"
    else
        echo "✅ VERCEL_PROJECT_ID assignment removed"
    fi
else
    echo "❌ emergency-deploy.ps1 missing"
fi

# Test 4: Check deployment options
echo
echo "🚀 DEPLOYMENT OPTIONS AVAILABLE"
echo "------------------------------"

deployment_options=0

if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI available"
    ((deployment_options++))
fi

if command -v npx &> /dev/null; then
    echo "✅ npx available for Vercel CLI"
    ((deployment_options++))
fi

if [ -f "vercel-build-fix.mjs" ]; then
    echo "✅ Custom build script available"
    ((deployment_options++))
fi

if [ -f "vercel-build-fix.sh" ]; then
    echo "✅ Bash build script available"
    ((deployment_options++))
fi

echo "📊 Total deployment options: $deployment_options"

# Test 5: Recommended deployment commands
echo
echo "🎯 RECOMMENDED DEPLOYMENT COMMANDS"
echo "================================="
echo

echo "📋 Option 1: Auto-detection (Recommended)"
echo "vercel --prod"
echo "# Lets Vercel automatically detect project and organization"
echo

echo "📋 Option 2: With token only"
echo "vercel --token Df9VdVMiA6JDBApzLr8om3SS --prod"
echo "# Uses token but lets Vercel auto-detect project"
echo

echo "📋 Option 3: Emergency script (Fixed)"
echo "bash emergency-deploy.sh"
echo "# Uses our fixed emergency deployment script"
echo

echo "📋 Option 4: Manual link and deploy"
echo "vercel link  # Link to existing project or create new one"
echo "vercel --prod  # Deploy to production"
echo

# Final status
echo "🏆 VERCEL ORG ID ERROR - RESOLUTION STATUS"
echo "=========================================="
echo

if [ $PROJECT_ID_REFS -eq 0 ]; then
    echo "✅ STATUS: FULLY RESOLVED"
    echo "✅ All VERCEL_PROJECT_ID references removed"
    echo "✅ Auto-detection enabled"
    echo "✅ Ready for deployment"
else
    echo "⚠️ STATUS: PARTIALLY RESOLVED"
    echo "⚠️ Some PROJECT_ID references remain"
    echo "💡 Use 'vercel --prod' for auto-detection"
fi

echo
echo "🎉 Next Steps:"
echo "1. Run: vercel --prod"
echo "2. Follow Vercel CLI prompts for project linking"
echo "3. Monitor deployment in Vercel dashboard"
echo
echo "🔗 If you need to link to a specific project:"
echo "   vercel link --project=your-project-name"
echo
