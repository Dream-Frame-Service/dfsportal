#!/bin/bash

# Quick Production Deploy for DFS Portal
echo "🚀 DFS Portal - Quick Production Deploy"

# Build production
npm run build:quick

echo "✅ Production build complete!"
echo ""
echo "📁 Built files are in: ./dist/"
echo "🌐 Preview locally: npm run preview"
echo ""
echo "🔗 Deploy options:"
echo "1. Vercel: npm i -g vercel && vercel --prod"
echo "2. Netlify: Drag & drop ./dist folder to netlify.com/drop"
echo "3. GitHub Pages: Push to GitHub and enable Pages"
echo "4. Any static hosting: Upload ./dist folder contents"
echo ""
echo "🎉 Ready for production!"
