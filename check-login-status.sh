#!/bin/bash

# Quick Login Status Check
# Verify if login is disabled and test the page

echo "🔍 DFS Portal Login Status Check"
echo "================================"
echo ""

# Check source code
echo "📁 Checking source code..."
if grep -q "LoginDisabledPage" src/App.tsx; then
    echo "✅ Source: Login is DISABLED"
    DISABLED_IN_CODE=true
else
    echo "❌ Source: Login is ENABLED"
    DISABLED_IN_CODE=false
fi

# Check build output
echo ""
echo "📦 Checking build output..."
if [ -f "dist/assets/"*"LoginDisabledPage"* ]; then
    echo "✅ Build: LoginDisabledPage chunk found"
    DISABLED_IN_BUILD=true
else
    echo "❌ Build: LoginDisabledPage chunk not found"
    DISABLED_IN_BUILD=false
fi

# Test local server if running
echo ""
echo "🌐 Testing local server..."
if curl -s http://localhost:3000/login > /dev/null 2>&1; then
    echo "✅ Local: Server responding on port 3000"
    LOCAL_RUNNING=true
else
    echo "⚠️  Local: No server detected on port 3000"
    LOCAL_RUNNING=false
fi

# Summary
echo ""
echo "📊 Summary:"
echo "=========="

if [ "$DISABLED_IN_CODE" = true ] && [ "$DISABLED_IN_BUILD" = true ]; then
    echo "🔒 Status: LOGIN FULLY DISABLED ✅"
    echo ""
    echo "🎯 What this means:"
    echo "  • Login form is not accessible"
    echo "  • Users see maintenance message"
    echo "  • Professional disabled page shown"
    echo "  • System remains secure"
    echo ""
    echo "🔄 To re-enable:"
    echo "  ./toggle-login.sh enable"
    echo "  ./toggle-login.sh build"
elif [ "$DISABLED_IN_CODE" = false ]; then
    echo "🔓 Status: LOGIN ENABLED ⚠️"
    echo ""
    echo "🎯 To disable login:"
    echo "  ./toggle-login.sh disable"
    echo "  ./toggle-login.sh build"
else
    echo "⚠️  Status: MIXED STATE - Please rebuild"
    echo ""
    echo "🔧 To fix:"
    echo "  ./toggle-login.sh build"
fi

if [ "$LOCAL_RUNNING" = true ]; then
    echo ""
    echo "🧪 Test URLs:"
    echo "  • Login: http://localhost:3000/login"
    echo "  • Reset: http://localhost:3000/resetpassword"
fi

echo ""
echo "📋 Available commands:"
echo "  ./toggle-login.sh status    - Check status"
echo "  ./toggle-login.sh disable   - Disable login"
echo "  ./toggle-login.sh enable    - Enable login"
echo "  ./toggle-login.sh build     - Build application"
