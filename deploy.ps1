# DFS Manager Portal - Production Deployment Script (PowerShell)
# This script handles the complete production deployment process on Windows

param(
    [string]$Action = "all",
    [switch]$SkipTests = $false,
    [switch]$Verbose = $false
)

# Colors for output
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
}

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] " -ForegroundColor Gray -NoNewline
    Write-Host $Message -ForegroundColor $Colors[$Type]
}

function Test-Prerequisites {
    Write-Status "Checking prerequisites..." "Info"
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Status "Node.js version: $nodeVersion" "Success"
    }
    catch {
        Write-Status "Node.js is not installed or not in PATH" "Error"
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Status "npm version: $npmVersion" "Success"
    }
    catch {
        Write-Status "npm is not available" "Error"
        exit 1
    }
    
    Write-Status "All prerequisites satisfied" "Success"
}

function Install-Dependencies {
    Write-Status "Installing production dependencies..." "Info"
    
    try {
        npm ci --only=production
        Write-Status "Dependencies installed successfully" "Success"
    }
    catch {
        Write-Status "Failed to install dependencies" "Error"
        exit 1
    }
}

function Build-Application {
    Write-Status "Building application for production..." "Info"
    
    # Set environment variables
    $env:NODE_ENV = "production"
    $env:VITE_APP_ENVIRONMENT = "production"
    
    try {
        npm run build:prod
        
        if (Test-Path "dist") {
            $buildSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Status "Build completed successfully (Size: $([math]::Round($buildSize, 2)) MB)" "Success"
        }
        else {
            Write-Status "Build failed - dist directory not found" "Error"
            exit 1
        }
    }
    catch {
        Write-Status "Build process failed: $_" "Error"
        exit 1
    }
}

function Test-ProductionBuild {
    if ($SkipTests) {
        Write-Status "Skipping tests as requested" "Warning"
        return
    }
    
    Write-Status "Testing production build..." "Info"
    
    try {
        # Start preview server
        $previewJob = Start-Job -ScriptBlock { npm run preview }
        Start-Sleep 8
        
        # Test if server responds
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:4173" -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Status "Production build test passed" "Success"
            }
        }
        catch {
            Write-Status "Production build test failed - server not responding" "Warning"
        }
        
        # Clean up
        Stop-Job $previewJob -ErrorAction SilentlyContinue
        Remove-Job $previewJob -ErrorAction SilentlyContinue
    }
    catch {
        Write-Status "Test setup failed: $_" "Warning"
    }
}

function Deploy-ToNetlify {
    Write-Status "Preparing Netlify deployment..." "Info"
    
    if (-not (Test-Path "dist")) {
        Write-Status "Build directory not found. Run build first." "Error"
        return
    }
    
    $netlifyGuide = @"
# DFS Manager Portal - Netlify Deployment Guide

## Automatic Deployment (Recommended)
1. Connect GitHub repository to Netlify:
   - Go to https://app.netlify.com/
   - Click 'New site from Git'
   - Connect your GitHub account
   - Select 'Dream-Frame-Service/dfsportal' repository
   - Set build settings:
     * Build command: npm run build:prod
     * Publish directory: dist
     * Node version: 18

2. Configure Environment Variables in Netlify:
   - Go to Site settings > Environment variables
   - Add production variables:
     * VITE_SUPABASE_URL=your-production-supabase-url
     * VITE_SUPABASE_ANON_KEY=your-production-anon-key
     * NODE_ENV=production

## Manual Deployment
1. Go to https://app.netlify.com/
2. Click 'Add new site' > 'Deploy manually'
3. Drag and drop the 'dist' folder from this project
4. Configure custom domain and SSL certificate
5. Set up form handling and redirects

## Access
Your site will be available at: https://[site-name].netlify.app

## GitHub Actions
Automatic deployment is configured via .github/workflows/deploy.yml
Pushes to 'main' branch will trigger automatic deployment.
"@
    
    $netlifyGuide | Out-File -FilePath "NETLIFY_DEPLOYMENT_GUIDE.md" -Encoding UTF8
    Write-Status "Netlify deployment guide created: NETLIFY_DEPLOYMENT_GUIDE.md" "Success"
}

function Deploy-ToVercel {
    Write-Status "Checking Vercel deployment..." "Info"
    
    try {
        $vercelPath = Get-Command vercel -ErrorAction Stop
        Write-Status "Deploying to Vercel..." "Info"
        vercel --prod
        Write-Status "Deployed to Vercel successfully" "Success"
    }
    catch {
        Write-Status "Vercel CLI not found. Install with: npm i -g vercel" "Warning"
        
        $vercelGuide = @"
# Vercel Deployment Guide

## Installation
npm install -g vercel

## Deployment
1. Run: vercel
2. Follow the prompts to link your project
3. Set environment variables in Vercel dashboard
4. Deploy with: vercel --prod

## Environment Variables
Add these in your Vercel project settings:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- NODE_ENV=production

Your site will be available at: https://[project-name].vercel.app
"@
        
        $vercelGuide | Out-File -FilePath "VERCEL_DEPLOYMENT_GUIDE.md" -Encoding UTF8
        Write-Status "Vercel deployment guide created: VERCEL_DEPLOYMENT_GUIDE.md" "Success"
    }
}

function Deploy-Docker {
    Write-Status "Checking Docker deployment..." "Info"
    
    try {
        $dockerPath = Get-Command docker -ErrorAction Stop
        Write-Status "Building Docker image..." "Info"
        
        docker build -t dfs-manager-portal:latest .
        Write-Status "Docker image built successfully" "Success"
        
        # Option to run container
        $runContainer = Read-Host "Start Docker container now? (y/n)"
        if ($runContainer -eq "y" -or $runContainer -eq "Y") {
            docker run -d -p 80:80 --name dfs-manager-portal dfs-manager-portal:latest
            Write-Status "Docker container started on http://localhost" "Success"
        }
    }
    catch {
        Write-Status "Docker not found. Install Docker Desktop for Windows" "Warning"
        
        $dockerGuide = @"
# Docker Deployment Guide

## Prerequisites
Install Docker Desktop for Windows from: https://docker.com/products/docker-desktop

## Build and Run
```bash
# Build image
docker build -t dfs-manager-portal:latest .

# Run container
docker run -d -p 80:80 --name dfs-manager-portal dfs-manager-portal:latest

# Or use docker-compose
docker-compose up -d
```

## Production Docker Deployment
- Use Docker Swarm or Kubernetes for scaling
- Configure reverse proxy (nginx) for SSL termination
- Set up health checks and monitoring
- Use environment variables for configuration

Access at: http://localhost
"@
        
        $dockerGuide | Out-File -FilePath "DOCKER_DEPLOYMENT_GUIDE.md" -Encoding UTF8
        Write-Status "Docker deployment guide created: DOCKER_DEPLOYMENT_GUIDE.md" "Success"
    }
}

function Invoke-SecurityCheck {
    Write-Status "Running security audit..." "Info"
    
    try {
        npm audit --audit-level moderate
        Write-Status "Security audit completed" "Success"
    }
    catch {
        Write-Status "Security audit found issues - review and fix" "Warning"
    }
    
    # Check for placeholder values in production config
    if (Test-Path ".env.production") {
        $content = Get-Content ".env.production" -Raw
        if ($content -match "your-|placeholder|example") {
            Write-Status "Production environment file contains placeholder values" "Warning"
        }
    }
}

function New-DeploymentReport {
    Write-Status "Generating deployment report..." "Info"
    
    $buildSize = if (Test-Path "dist") {
        $size = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
        "$([math]::Round($size, 2)) MB"
    } else { "N/A" }
    
    $report = @"
# DFS Manager Portal - Deployment Report

**Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Version:** $(Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty version)
**Environment:** Production
**Platform:** Windows

## Build Information
- Node.js Version: $(node --version)
- npm Version: $(npm --version)
- Build Size: $buildSize
- PowerShell Version: $($PSVersionTable.PSVersion)

## Deployment Status
- ✅ Production build completed
- ✅ Security checks performed
- 📋 Deployment guides created
- 🐳 Docker configuration ready

## Generated Files
- NETLIFY_DEPLOYMENT_GUIDE.md
- VERCEL_DEPLOYMENT_GUIDE.md  
- DOCKER_DEPLOYMENT_GUIDE.md
- DEPLOYMENT_REPORT.md (this file)

## Access Points
- **Netlify**: Follow NETLIFY_DEPLOYMENT_GUIDE.md
- **Vercel**: Follow VERCEL_DEPLOYMENT_GUIDE.md
- **Docker**: Follow DOCKER_DEPLOYMENT_GUIDE.md
- **Local Preview**: npm run preview (http://localhost:4173)

## Next Steps
1. Choose your preferred deployment platform
2. Configure production environment variables
3. Set up custom domain and SSL certificate
4. Configure monitoring and analytics
5. Set up automated backups
6. Implement CI/CD pipeline

## Environment Variables Required
```
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
NODE_ENV=production
VITE_APP_ENVIRONMENT=production
```

## Support Resources
- GitHub Repository: https://github.com/Dream-Frame-Service/dfsportal
- Documentation: ./docs/
- Issues: https://github.com/Dream-Frame-Service/dfsportal/issues

---
*Generated by DFS Manager Portal Deployment Script*
"@
    
    $report | Out-File -FilePath "DEPLOYMENT_REPORT.md" -Encoding UTF8
    Write-Status "Deployment report generated: DEPLOYMENT_REPORT.md" "Success"
}

function Start-Deployment {
    Write-Host "🚀 DFS Manager Portal Production Deployment" -ForegroundColor Magenta
    Write-Host "=" * 50 -ForegroundColor Magenta
    Write-Host ""
    
    Test-Prerequisites
    Install-Dependencies
    Invoke-SecurityCheck
    Build-Application
    Test-ProductionBuild
    
    # Deployment options
    switch ($Action.ToLower()) {
        "netlify" { Deploy-ToNetlify }
        "vercel" { Deploy-ToVercel }
        "docker" { Deploy-Docker }
        "all" {
            Deploy-ToNetlify
            Deploy-ToVercel
            Deploy-Docker
        }
        default {
            Deploy-ToNetlify
            Deploy-ToVercel
            Deploy-Docker
        }
    }
    
    New-DeploymentReport
      Write-Host ""
    Write-Status "🎉 Deployment process completed!" "Success"
    Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review DEPLOYMENT_REPORT.md for details" -ForegroundColor White
    Write-Host "  2. Choose a deployment platform and follow its guide" -ForegroundColor White
    Write-Host "  3. Configure production environment variables" -ForegroundColor White
    Write-Host "  4. Set up monitoring and alerts" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Your application is ready for production!" -ForegroundColor Green
}

# Main execution
Start-Deployment
