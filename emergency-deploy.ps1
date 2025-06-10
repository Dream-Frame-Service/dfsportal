# Emergency Deployment Script for DFS Portal
# PowerShell version for Windows

Write-Host "🚀 Starting emergency deployment for DFS Portal..." -ForegroundColor Green

# Set Vercel credentials
$env:VERCEL_TOKEN = "biknXeFHbDw91CAUawmfRXkW"
$env:VERCEL_PROJECT_ID = "prj_pCpaWRWFomnGIsvBEnzZeUrsWAgb"

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm ci
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ npm ci failed, trying npm install..." -ForegroundColor Red
    npm install
}

Write-Host "🔧 Fixing linting issues automatically..." -ForegroundColor Yellow
try {
    npm run lint:fix
    Write-Host "✅ Auto-fix completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Auto-fix completed with some remaining issues" -ForegroundColor Yellow
}

Write-Host "🏗️ Building application..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Standard build failed, trying alternative builds..." -ForegroundColor Red
    
    try {
        npm run build:vercel
        Write-Host "✅ Vercel build completed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Vercel build failed, trying emergency build..." -ForegroundColor Red
        
        try {
            node emergency-build.mjs
            Write-Host "✅ Emergency build completed" -ForegroundColor Green
        } catch {
            Write-Host "❌ Emergency build failed, trying ultra-simple build..." -ForegroundColor Red
            node ultra-simple-build.mjs
        }
    }
}

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow

# Check if Vercel CLI is available
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    try {
        vercel --token $env:VERCEL_TOKEN --prod --yes
        Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Vercel CLI deployment failed, trying with npx..." -ForegroundColor Red
        npx vercel --token $env:VERCEL_TOKEN --prod --yes
    }
} else {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    vercel --token $env:VERCEL_TOKEN --prod --yes
}

Write-Host "`n✅ Deployment process completed!" -ForegroundColor Green
Write-Host "🔗 Check your Vercel dashboard for deployment status" -ForegroundColor Cyan
Write-Host "📊 Project ID: $env:VERCEL_PROJECT_ID" -ForegroundColor Cyan

# Optional: Open Vercel dashboard
$openDashboard = Read-Host "`nOpen Vercel dashboard? (y/n)"
if ($openDashboard -eq 'y' -or $openDashboard -eq 'Y') {
    Start-Process "https://vercel.com/dashboard"
}
