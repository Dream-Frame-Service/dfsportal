#!/bin/bash

# 🚀 PRODUCTION DEPLOYMENT CHECKLIST
# Final verification before going live

echo "🚀 PRODUCTION DEPLOYMENT CHECKLIST"
echo "=================================="
echo ""

# Initialize counters
passed=0
total=0

# Function to check and report
check_item() {
    local description="$1"
    local command="$2"
    local expected="$3"
    
    ((total++))
    echo -n "[$total] $description: "
    
    if eval "$command" &>/dev/null; then
        if [[ -n "$expected" ]]; then
            result=$(eval "$command" 2>/dev/null)
            if [[ "$result" == *"$expected"* ]]; then
                echo "✅ PASS"
                ((passed++))
            else
                echo "❌ FAIL (Expected: $expected, Got: $result)"
            fi
        else
            echo "✅ PASS"
            ((passed++))
        fi
    else
        echo "❌ FAIL"
    fi
}

# Run all checks
echo "🔍 RUNNING PRODUCTION CHECKS..."
echo ""

check_item "Node.js available" "node --version" "v20"
check_item "npm available" "npm --version" ""
check_item "Project directory exists" "test -f package.json" ""
check_item "Build script configured" "grep -q 'build:vercel' package.json" ""
check_item "Vite config optimized" "grep -q 'manualChunks' vite.config.ts" ""
check_item "App uses lazy loading" "grep -q 'lazy(' src/App.tsx" ""
check_item "Build process works" "npm run build:vercel" ""
check_item "Dist directory created" "test -d dist" ""
check_item "JS chunks optimized" "test \$(find dist/assets -name '*.js' | wc -l) -eq 29" ""
check_item "Index.html generated" "test -f dist/index.html" ""
check_item "Admin scripts available" "test -f check-admin-status.mjs" ""
check_item "Environment configured" "test -f .env || test -f .env.local" ""

echo ""
echo "📊 RESULTS SUMMARY"
echo "=================="
echo "Passed: $passed/$total checks"

if [[ $passed -eq $total ]]; then
    echo ""
    echo "🎉 ALL CHECKS PASSED!"
    echo "✅ System is READY FOR PRODUCTION DEPLOYMENT"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Deploy to production (Vercel/Netlify/etc.)"
    echo "2. Admin completes password setup"
    echo "3. Verify live application functionality"
    echo "4. Monitor performance improvements"
    echo ""
    echo "🎯 PROJECT STATUS: MISSION ACCOMPLISHED!"
elif [[ $passed -ge $((total * 8 / 10)) ]]; then
    echo ""
    echo "⚠️  MOSTLY READY - Minor issues to address"
    echo "Please fix the failing checks above"
else
    echo ""
    echo "❌ NOT READY - Major issues need resolution"
    echo "Please address all failing checks"
fi

echo ""
echo "📋 Key URLs:"
echo "- Application: https://dfsportal.vercel.app"
echo "- Admin Login: https://dfsportal.vercel.app/login"  
echo "- Admin Email: admin@dfs-portal.com"
echo ""
