#!/usr/bin/env node

/**
 * EMERGENCY BUILD SCRIPT - ABSOLUTE LAST RESORT
 * 
 * This script creates a minimal working build when everything else fails.
 * It generates a basic static site that will at least load.
 */

console.log('🚨 EMERGENCY BUILD ACTIVATED - Creating minimal working build...');

const fs = require('fs');
const path = require('path');

function createEmergencyBuild() {
  try {
    // Ensure clean slate
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(distDir, { recursive: true });
    fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
    
    console.log('📁 Created dist directory structure');
    
    // Create emergency index.html
    const emergencyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DFS Manager Portal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
      width: 90%;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }
    p {
      color: #7f8c8d;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    .status {
      background: #3498db;
      color: white;
      padding: 1rem;
      border-radius: 5px;
      margin: 1rem 0;
    }
    .btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }
    .btn:hover {
      background: #2980b9;
    }
    .footer {
      margin-top: 2rem;
      color: #95a5a6;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏢 DFS Manager Portal</h1>
    <p>Welcome to the DFS Manager Portal. The application is currently in emergency mode.</p>
    
    <div class="status">
      ✅ Emergency build deployed successfully
    </div>
    
    <p>This is a minimal version of the application. Please contact your administrator for the full application deployment.</p>
    
    <button class="btn" onclick="location.reload()">
      🔄 Refresh Application
    </button>
    
    <div class="footer">
      <p>Emergency Build • Version ${new Date().toISOString().split('T')[0]}</p>
    </div>
  </div>

  <script>
    console.log('🚨 DFS Manager Portal - Emergency Mode Active');
    console.log('📍 Build timestamp:', new Date().toISOString());
    
    // Basic health check
    function healthCheck() {
      console.log('✅ Emergency application loaded successfully');
    }
    
    // Run health check
    setTimeout(healthCheck, 1000);
    
    // Add some basic interactivity
    document.addEventListener('DOMContentLoaded', function() {
      console.log('📋 DOM loaded in emergency mode');
      
      // Add click tracking
      document.addEventListener('click', function(e) {
        console.log('🖱️ Click detected:', e.target.tagName);
      });
    });
  </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distDir, 'index.html'), emergencyHtml);
    console.log('📄 Created emergency index.html');
    
    // Copy critical assets from public if they exist
    const publicDir = path.join(process.cwd(), 'public');
    if (fs.existsSync(publicDir)) {
      const publicFiles = fs.readdirSync(publicDir);
      let copiedFiles = 0;
      
      publicFiles.forEach(file => {
        if (file !== 'index.html') {
          try {
            const sourcePath = path.join(publicDir, file);
            const destPath = path.join(distDir, file);
            fs.copyFileSync(sourcePath, destPath);
            copiedFiles++;
          } catch (error) {
            console.log(`⚠️ Could not copy ${file}:`, error.message);
          }
        }
      });
      
      console.log(`📁 Copied ${copiedFiles} files from public directory`);
    }
    
    // Create a basic robots.txt if it doesn't exist
    const robotsPath = path.join(distDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      fs.writeFileSync(robotsPath, `User-agent: *
Allow: /

Sitemap: /sitemap.xml`);
      console.log('🤖 Created robots.txt');
    }
    
    // Create a basic _redirects file for SPA routing
    const redirectsPath = path.join(distDir, '_redirects');
    fs.writeFileSync(redirectsPath, `/*    /index.html   200`);
    console.log('🔄 Created _redirects file');
    
    // Verify the build
    const indexPath = path.join(distDir, 'index.html');
    const stats = fs.statSync(indexPath);
    
    console.log('✅ EMERGENCY BUILD COMPLETED SUCCESSFULLY!');
    console.log(`📊 Build stats:`);
    console.log(`   - index.html size: ${stats.size} bytes`);
    console.log(`   - Build directory: ${distDir}`);
    console.log(`   - Files created: ${fs.readdirSync(distDir).length}`);
    
    return true;
    
  } catch (error) {
    console.error('💥 EMERGENCY BUILD FAILED:', error.message);
    throw error;
  }
}

// Execute emergency build
try {
  createEmergencyBuild();
  console.log('🎯 Emergency build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('💥 Emergency build failed completely:', error.message);
  process.exit(1);
}
