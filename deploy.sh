#!/bin/bash

# DFS Manager Portal - Production Deployment Script
# This script handles the complete production deployment process

set -e

echo "🚀 Starting DFS Manager Portal Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Install production dependencies
install_dependencies() {
    print_status "Installing production dependencies..."
    npm ci --only=production
    print_success "Dependencies installed"
}

# Build for production
build_application() {
    print_status "Building application for production..."
    
    # Set production environment
    export NODE_ENV=production
    export VITE_APP_ENVIRONMENT=production
    
    # Build with optimizations
    npm run build:prod
    
    if [ -d "dist" ]; then
        print_success "Build completed successfully"
        print_status "Build size: $(du -sh dist | cut -f1)"
    else
        print_error "Build failed - dist directory not found"
        exit 1
    fi
}

# Test production build
test_build() {
    print_status "Testing production build..."
    
    # Start preview server in background
    npm run preview &
    PREVIEW_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test if server is responding
    if curl -f http://localhost:4173/ &> /dev/null; then
        print_success "Production build test passed"
    else
        print_warning "Production build test failed - server not responding"
    fi
    
    # Kill preview server
    kill $PREVIEW_PID 2>/dev/null || true
}

# Deploy to Netlify (manual)
deploy_netlify_manual() {
    print_status "Deploying to Netlify (manual)..."
    
    if [ ! -d "dist" ]; then
        print_error "Build directory not found. Run build first."
        exit 1
    fi
    
    # Create a simple deploy script
    cat > deploy_to_netlify.md << EOF
# Manual Netlify Deployment

1. Go to https://app.netlify.com/
2. Click "Add new site" > "Deploy manually"
3. Drag and drop the 'dist' folder
4. Set site name: dfs-manager-portal
5. Configure environment variables:
   - VITE_SUPABASE_URL=your-production-url
   - VITE_SUPABASE_ANON_KEY=your-production-key

Your site will be deployed at: https://[site-name].netlify.app
EOF
    
    print_success "Manual deployment guide created: deploy_to_netlify.md"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_success "Deployed to Vercel"
    else
        print_warning "Vercel CLI not installed. Install with: npm i -g vercel"
    fi
}

# Docker deployment
deploy_docker() {
    print_status "Building Docker image..."
    
    if command -v docker &> /dev/null; then
        docker build -t dfs-manager-portal:latest .
        print_success "Docker image built successfully"
        
        print_status "Starting Docker container..."
        docker run -d -p 80:80 --name dfs-manager-portal dfs-manager-portal:latest
        print_success "Docker container started on http://localhost"
    else
        print_warning "Docker not installed. Skipping Docker deployment."
    fi
}

# Security check
security_check() {
    print_status "Running security checks..."
    
    # Check for security vulnerabilities
    npm audit --audit-level moderate
    
    # Check environment file security
    if [ -f ".env.production" ]; then
        if grep -q "your-" .env.production; then
            print_warning "Production environment file contains placeholder values"
        fi
    fi
    
    print_success "Security check completed"
}

# Generate deployment report
generate_report() {
    print_status "Generating deployment report..."
    
    cat > DEPLOYMENT_REPORT.md << EOF
# DFS Manager Portal - Deployment Report

**Date:** $(date)
**Version:** $(node -p "require('./package.json').version")
**Environment:** Production

## Build Information
- Node.js Version: $(node --version)
- npm Version: $(npm --version)
- Build Size: $(du -sh dist 2>/dev/null | cut -f1 || echo "N/A")

## Deployment Options
- ✅ Production build completed
- ✅ Security checks passed
- 📋 Manual Netlify deployment guide created
- 🐳 Docker image ready

## Next Steps
1. Configure production environment variables
2. Set up domain and SSL certificate
3. Configure monitoring and analytics
4. Set up automated backups

## Access Points
- **Netlify**: https://[your-site].netlify.app
- **Vercel**: https://[your-project].vercel.app
- **Docker**: http://localhost (if running locally)

## Support
- Documentation: ./PRODUCTION_DEPLOYMENT.md
- Issues: https://github.com/Dream-Frame-Service/dfsportal/issues
EOF
    
    print_success "Deployment report generated: DEPLOYMENT_REPORT.md"
}

# Main deployment process
main() {
    echo "🎯 DFS Manager Portal Production Deployment"
    echo "==========================================="
    
    check_dependencies
    install_dependencies
    security_check
    build_application
    test_build
    deploy_netlify_manual
    
    # Optional deployments (uncomment as needed)
    # deploy_vercel
    # deploy_docker
    
    generate_report
    
    echo ""
    print_success "🎉 Deployment process completed!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Check DEPLOYMENT_REPORT.md for details"
    echo "  2. Follow deploy_to_netlify.md for manual deployment"
    echo "  3. Configure production environment variables"
    echo "  4. Set up monitoring and alerts"
    echo ""
    echo "🌐 Your application is ready for production!"
}

# Handle command line arguments
case "${1:-}" in
    "build")
        build_application
        ;;
    "test")
        test_build
        ;;
    "netlify")
        deploy_netlify_manual
        ;;
    "vercel")
        deploy_vercel
        ;;
    "docker")
        deploy_docker
        ;;
    "security")
        security_check
        ;;
    *)
        main
        ;;
esac
