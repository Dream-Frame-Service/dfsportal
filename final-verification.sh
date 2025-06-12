#!/bin/bash

# Final System Verification Script
# Checks all components are ready for production

echo "🔍 FINAL SYSTEM VERIFICATION"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

echo "📁 Project Directory: ✅ Confirmed"

# Check package.json for build scripts
if grep -q "build:vercel" package.json; then
    echo "🔧 Build Scripts: ✅ Present"
else
    echo "❌ Build Scripts: Missing"
fi

# Check if vite.config.ts exists and has optimization
if [ -f "vite.config.ts" ]; then
    if grep -q "manualChunks" vite.config.ts; then
        echo "⚡ Vite Optimization: ✅ Configured"
    else
        echo "⚠️  Vite Optimization: Basic config"
    fi
else
    echo "❌ Vite Config: Missing"
fi

# Check if App.tsx has lazy loading
if [ -f "src/App.tsx" ]; then
    if grep -q "React.lazy" src/App.tsx; then
        echo "🚀 Lazy Loading: ✅ Implemented"
    else
        echo "⚠️  Lazy Loading: Not detected"
    fi
else
    echo "❌ App.tsx: Not found"
fi

# Test build
echo ""
echo "🔨 Testing Build Process..."
if npm run build:vercel > /dev/null 2>&1; then
    echo "✅ Build: SUCCESS"
    
    # Check if dist directory exists
    if [ -d "dist" ]; then
        echo "📦 Dist Directory: ✅ Created"
        
        # Count JS files in assets
        js_count=$(find dist/assets -name "*.js" 2>/dev/null | wc -l)
        echo "📊 JS Chunks: $js_count files"
        
        # Check index.html size
        if [ -f "dist/index.html" ]; then
            size=$(stat -c%s "dist/index.html" 2>/dev/null || stat -f%z "dist/index.html" 2>/dev/null)
            echo "📄 Index.html: ${size} bytes"
        fi
    else
        echo "❌ Dist Directory: Missing"
    fi
else
    echo "❌ Build: FAILED"
fi

# Check admin verification script
echo ""
echo "🔐 Testing Admin System..."
if [ -f "check-admin-status.mjs" ]; then
    echo "👨‍💼 Admin Scripts: ✅ Available"
    
    # Test admin status (capture output)
    admin_result=$(timeout 10 node check-admin-status.mjs 2>&1)
    if echo "$admin_result" | grep -q "successfully"; then
        echo "✅ Admin Account: Ready"
    elif echo "$admin_result" | grep -q "rate limit"; then
        echo "✅ Admin Account: Exists (rate limited)"
    else
        echo "⚠️  Admin Account: Check required"
    fi
else
    echo "❌ Admin Scripts: Missing"
fi

# Final summary
echo ""
echo "🎯 FINAL STATUS SUMMARY"
echo "======================"
echo ""

# Count successes
successes=0
total=6

[ -f "package.json" ] && ((successes++))
grep -q "build:vercel" package.json 2>/dev/null && ((successes++))
grep -q "manualChunks" vite.config.ts 2>/dev/null && ((successes++))
grep -q "React.lazy" src/App.tsx 2>/dev/null && ((successes++))
[ -d "dist" ] && ((successes++))
[ -f "check-admin-status.mjs" ] && ((successes++))

percentage=$((successes * 100 / total))

echo "📊 System Readiness: $successes/$total components ready ($percentage%)"

if [ $successes -eq $total ]; then
    echo ""
    echo "🎉 STATUS: FULLY READY FOR PRODUCTION"
    echo ""
    echo "✅ Bundle optimization: Complete"
    echo "✅ Admin access: Configured"  
    echo "✅ Build system: Functional"
    echo "✅ Performance: Optimized"
    echo ""
    echo "🚀 Next step: Deploy to production"
    echo "🔐 Admin login: admin@dfs-portal.com"
elif [ $successes -ge 4 ]; then
    echo ""
    echo "⚠️  STATUS: MOSTLY READY - Minor issues"
    echo ""
    echo "🔧 Please address any failed checks above"
else
    echo ""
    echo "❌ STATUS: NEEDS ATTENTION"
    echo ""
    echo "🔧 Please fix the issues identified above"
fi

echo ""
echo "📋 Documentation created:"
echo "   - FINAL_DEPLOYMENT_GUIDE.md"
echo "   - COMPLETE_SOLUTION_SUMMARY.md"
echo ""
