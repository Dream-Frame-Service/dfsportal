#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '.env.local');
let envContent = '';
try {
  envContent = readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('❌ Could not load .env.local file');
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing Multiple Email Providers');
console.log('===================================');

// Test with multiple email providers
const testEmails = [
  'mobil3801beach@gmail.com',
  'test@outlook.com',
  'test@yahoo.com'
];

async function testMultipleEmails() {
  for (const email of testEmails) {
    console.log(`\n📧 Testing email: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/resetpassword'
      });

      if (error) {
        console.log(`❌ Failed: ${error.message}`);
      } else {
        console.log('✅ Reset email sent successfully');
        console.log('📬 Check inbox and spam folder');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Wait between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function manualSupabaseTest() {
  console.log('\n🔧 Manual Supabase Dashboard Test Instructions:');
  console.log('='.repeat(50));
  console.log('');
  console.log('1. Go to: https://supabase.com/dashboard/project/vetufvhzmawjbsumtplq');
  console.log('2. Navigate to: Authentication > Users');
  console.log('3. Find user: mobil3801beach@gmail.com');
  console.log('4. Click the "..." menu next to the user');
  console.log('5. Select "Send Password Reset Email"');
  console.log('6. Check if email arrives when sent manually');
  console.log('');
  console.log('This will help determine if it\'s a dashboard config issue vs API issue.');
}

async function runTests() {
  await testMultipleEmails();
  await manualSupabaseTest();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY:');
  console.log('='.repeat(50));
  console.log('');
  console.log('✅ If ANY email provider works: Configuration issue');
  console.log('❌ If NO email providers work: SMTP/Rate limiting issue');
  console.log('🔧 If manual dashboard test works: API redirect issue');
  console.log('');
  console.log('💡 MOST LIKELY SOLUTIONS:');
  console.log('1. Configure custom SMTP in Supabase Dashboard');
  console.log('2. Check redirect URLs in Authentication settings');
  console.log('3. Wait 1 hour if hit rate limit (3 emails/hour)');
  console.log('4. Try with business email instead of Gmail');
}

runTests().catch(console.error);
