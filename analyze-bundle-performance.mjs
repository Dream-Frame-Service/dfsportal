#!/usr/bin/env node

/**
 * 📊 Bundle Performance Monitor
 * 
 * This script analyzes the production build to track performance metrics
 * and validate our bundle optimization results.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist/assets');

function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBundles() {
  console.log('📊 Bundle Performance Analysis');
  console.log('='.repeat(60));
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ No dist folder found. Run "npm run build" first.');
    return;
  }
  
  const files = fs.readdirSync(distPath).filter(file => file.endsWith('.js'));
  
  if (files.length === 0) {
    console.log('❌ No JavaScript bundles found.');
    return;
  }
  
  // Analyze bundle sizes
  const bundles = files.map(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    
    // Categorize bundles
    let category = 'Other';
    if (file.includes('vendor')) category = 'Vendor';
    else if (file.includes('admin')) category = 'Admin';
    else if (file.includes('business')) category = 'Business';
    else if (file.includes('ui-components')) category = 'UI';
    else if (file.includes('react')) category = 'React';
    else if (file.includes('aws-sdk')) category = 'AWS';
    else if (file.includes('supabase')) category = 'Supabase';
    else if (file.includes('index')) category = 'Core';
    
    return {
      name: file,
      size: stats.size,
      sizeKB: Math.round(sizeKB * 100) / 100,
      category
    };
  }).sort((a, b) => b.size - a.size);
  
  // Performance analysis
  console.log('\n📋 Bundle Analysis:');
  console.log('-'.repeat(60));
  
  bundles.forEach((bundle, index) => {
    const status = bundle.sizeKB > 1000 ? '❌' : bundle.sizeKB > 500 ? '⚠️' : '✅';
    console.log(`${status} ${bundle.name}`);
    console.log(`   Size: ${formatBytes(bundle.size)} (${bundle.sizeKB} KB)`);
    console.log(`   Category: ${bundle.category}`);
    if (index < bundles.length - 1) console.log('');
  });
  
  // Summary statistics
  const totalSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0);
  const largestBundle = bundles[0];
  const oversizedBundles = bundles.filter(b => b.sizeKB > 1000);
  const warningBundles = bundles.filter(b => b.sizeKB > 500 && b.sizeKB <= 1000);
  
  console.log('\n📊 Performance Summary:');
  console.log('-'.repeat(60));
  console.log(`📦 Total Bundles: ${bundles.length}`);
  console.log(`📈 Total Size: ${formatBytes(totalSize)}`);
  console.log(`🔥 Largest Bundle: ${largestBundle.name} (${formatBytes(largestBundle.size)})`);
  console.log(`❌ Oversized (>1000KB): ${oversizedBundles.length}`);
  console.log(`⚠️  Large (500-1000KB): ${warningBundles.length}`);
  console.log(`✅ Optimal (<500KB): ${bundles.length - oversizedBundles.length - warningBundles.length}`);
  
  // Category breakdown
  const categories = {};
  bundles.forEach(bundle => {
    if (!categories[bundle.category]) {
      categories[bundle.category] = { count: 0, totalSize: 0 };
    }
    categories[bundle.category].count++;
    categories[bundle.category].totalSize += bundle.size;
  });
  
  console.log('\n🏷️  Category Breakdown:');
  console.log('-'.repeat(60));
  Object.entries(categories).forEach(([category, data]) => {
    console.log(`${category}: ${data.count} bundles, ${formatBytes(data.totalSize)}`);
  });
  
  // Performance recommendations
  console.log('\n💡 Recommendations:');
  console.log('-'.repeat(60));
  
  if (oversizedBundles.length === 0) {
    console.log('🎉 EXCELLENT! All bundles are under 1000KB.');
    console.log('✅ No bundle size warnings will appear.');
  } else {
    console.log('⚠️  Consider further splitting these large bundles:');
    oversizedBundles.forEach(bundle => {
      console.log(`   - ${bundle.name} (${bundle.sizeKB}KB)`);
    });
  }
  
  if (warningBundles.length > 0) {
    console.log(`📋 Monitor these medium-sized bundles (${warningBundles.length}):`);
    warningBundles.slice(0, 3).forEach(bundle => {
      console.log(`   - ${bundle.name} (${bundle.sizeKB}KB)`);
    });
  }
  
  // Performance score
  let score = 100;
  score -= oversizedBundles.length * 30; // -30 points per oversized bundle
  score -= warningBundles.length * 10;   // -10 points per large bundle
  score = Math.max(0, score);
  
  console.log(`\n🎯 Bundle Performance Score: ${score}/100`);
  
  if (score >= 90) console.log('🏆 EXCELLENT bundle optimization!');
  else if (score >= 70) console.log('✅ Good bundle optimization.');
  else if (score >= 50) console.log('⚠️  Bundle optimization needs improvement.');
  else console.log('❌ Poor bundle optimization - requires attention.');
  
  return {
    bundles,
    totalSize,
    score,
    oversizedCount: oversizedBundles.length,
    categories
  };
}

// Run analysis if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeBundles();
}

export { analyzeBundles };
