#!/bin/bash

# Login Toggle Script
# Easily enable or disable the login page

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_FILE="$SCRIPT_DIR/src/App.tsx"

show_status() {
    if grep -q "LoginDisabledPage" "$APP_FILE"; then
        echo "🔒 Login is currently DISABLED"
    else
        echo "🔓 Login is currently ENABLED"
    fi
}

enable_login() {
    echo "🔓 Enabling login page..."
    
    # Replace LoginDisabledPage with LoginPage
    sed -i 's/LoginDisabledPage/LoginPage/g' "$APP_FILE"
    
    echo "✅ Login page has been ENABLED"
    echo "📝 Please rebuild and deploy the application"
}

disable_login() {
    echo "🔒 Disabling login page..."
    
    # Replace LoginPage with LoginDisabledPage (but keep the import)
    sed -i 's/<LoginPage data-id="bgd4txzpb"/<LoginDisabledPage data-id="bgd4txzpb"/g' "$APP_FILE"
    
    echo "✅ Login page has been DISABLED" 
    echo "📝 Please rebuild and deploy the application"
}

build_and_test() {
    echo "🔨 Building application..."
    cd "$SCRIPT_DIR"
    npm run build:vercel
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
        echo "🧪 You can test locally with: npx serve dist -s -l 3000"
    else
        echo "❌ Build failed!"
        exit 1
    fi
}

show_help() {
    echo "🔧 DFS Portal Login Toggle Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  status    Show current login status"
    echo "  enable    Enable the login page"
    echo "  disable   Disable the login page"
    echo "  build     Build the application after changes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 disable"
    echo "  $0 build"
    echo "  $0 enable"
}

case "$1" in
    "status")
        show_status
        ;;
    "enable")
        enable_login
        show_status
        ;;
    "disable")
        disable_login
        show_status
        ;;
    "build")
        build_and_test
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        echo "🔧 DFS Portal Login Toggle"
        echo ""
        show_status
        echo ""
        echo "Use '$0 help' for available commands"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for available commands"
        exit 1
        ;;
esac
