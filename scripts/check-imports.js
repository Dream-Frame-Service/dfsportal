#!/usr/bin/env node
/**
 * Import checker script for DFS Manager Portal
 * Checks for common import issues and ensures consistency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking imports for consistency...');

// Common import issues to check for
const importChecks = [
  {
    name: 'Supabase client import consistency',
    pattern: /from ['"]@\/integrations\/supabase\/client['"]/g,
    suggestion: 'Use @/lib/supabase instead'
  },
  {
    name: 'Toast hook import consistency', 
    pattern: /from ['"]@\/components\/ui\/use-toast['"]/g,
    suggestion: 'Use @/hooks/use-toast instead'
  }
];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    importChecks.forEach(check => {
      if (check.pattern.test(content)) {
        issues.push({
          file: filePath,
          issue: check.name,
          suggestion: check.suggestion
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}`);
    return [];
  }
}

function scanDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const issues = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        issues.push(...scanDirectory(filePath, extensions));
      } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
        issues.push(...checkFile(filePath));
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dir}`);
  }
  
  return issues;
}

// Main execution
function main() {
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.log('✅ No src directory found, skipping import checks');
    process.exit(0);
  }
  
  console.log(`📁 Scanning ${srcDir} for import issues...`);
  const issues = scanDirectory(srcDir);
  
  if (issues.length === 0) {
    console.log('✅ No import issues found!');
    process.exit(0);
  } else {
    console.log(`⚠️  Found ${issues.length} import issue(s):`);
    issues.forEach(issue => {
      console.log(`   ${issue.file}: ${issue.issue}`);
      console.log(`   Suggestion: ${issue.suggestion}`);
    });
    
    // Don't fail the build for import warnings, just report them
    console.log('\n💡 These are warnings only and won\'t fail the build.');
    process.exit(0);
  }
}

main();
