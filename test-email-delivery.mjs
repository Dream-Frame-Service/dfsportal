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
const TEST_EMAIL = 'mobil3801beach@gmail.com';

console.log('📧 Email Delivery Comprehensive Test');
console.log('===================================');
console.log(`Testing email delivery to: ${TEST_EMAIL}`);
console.log('');

async function testEmailConfiguration() {
  console.log('1️⃣ Testing Email Configuration...');
  
  try {
    // Test password reset
    const { data, error } = await supabase.auth.resetPasswordForEmail(TEST_EMAIL, {
      redirectTo: 'http://localhost:5173/resetpassword'
    });

    if (error) {
      console.log('❌ Password reset failed:', error.message);
      return false;
    }

    console.log('✅ Password reset request sent successfully');
    console.log('📧 Email should be sent to:', TEST_EMAIL);
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function checkEmailSettings() {
  console.log('\n2️⃣ Email Settings Checklist...');
  console.log('');
  
  console.log('📋 REQUIRED SUPABASE DASHBOARD SETTINGS:');
  console.log('');
  console.log('🔗 Site URL Configuration:');
  console.log('   → Go to: Authentication > Settings > Site URL');
  console.log('   → Set: http://localhost:5173 (development)');
  console.log('   → Production: https://dfsmanagerportal.netlify.app');
  console.log('');
  
  console.log('🔗 Redirect URLs Configuration:');
  console.log('   → Go to: Authentication > Settings > Redirect URLs');
  console.log('   → Add: http://localhost:5173/resetpassword');
  console.log('   → Add: http://localhost:8080/resetpassword');
  console.log('   → Add: http://localhost:8081/resetpassword');
  console.log('   → Add: https://dfsmanagerportal.netlify.app/resetpassword');
  console.log('');
  
  console.log('📧 Email Provider Settings:');
  console.log('   → Go to: Authentication > Settings > SMTP Settings');
  console.log('   → Default Supabase: 3 emails/hour limit');
  console.log('   → Recommended: Configure custom SMTP provider');
  console.log('');
  
  console.log('📝 Email Templates:');
  console.log('   → Go to: Authentication > Settings > Email Templates');
  console.log('   → Check: Password Reset template is enabled');
  console.log('   → Test: Use template preview function');
  console.log('');
}

async function checkEmailDeliveryIssues() {
  console.log('3️⃣ Common Email Delivery Issues...');
  console.log('');
  
  console.log('🚨 MOST COMMON ISSUES:');
  console.log('');
  console.log('❌ Issue #1: Rate Limiting');
  console.log('   → Supabase default: 3 emails/hour');
  console.log('   → Solution: Wait 1 hour or configure custom SMTP');
  console.log('');
  
  console.log('❌ Issue #2: Spam Folder');
  console.log('   → Check: Gmail spam/junk folder');
  console.log('   → Check: All mail folders');
  console.log('   → Add: Supabase to safe senders list');
  console.log('');
  
  console.log('❌ Issue #3: Email Provider Blocking');
  console.log('   → Gmail: May block automated emails');
  console.log('   → Solution: Use business email or configure SMTP');
  console.log('');
  
  console.log('❌ Issue #4: Incorrect Redirect URL');
  console.log('   → Check: URL in email matches configured redirects');
  console.log('   → Fix: Add all possible URLs to Supabase settings');
  console.log('');
}

async function provideSolutions() {
  console.log('4️⃣ IMMEDIATE SOLUTIONS...');
  console.log('');
  
  console.log('🎯 QUICK FIXES:');
  console.log('');
  console.log('1. Configure Custom SMTP:');
  console.log('   → Use Gmail App Password or SendGrid');
  console.log('   → Set in Supabase Dashboard > Auth > SMTP');
  console.log('   → Test with higher rate limits');
  console.log('');
  
  console.log('2. Check Email Provider:');
  console.log('   → Try different email address (not Gmail)');
  console.log('   → Use business email if available');
  console.log('   → Test with multiple email providers');
  console.log('');
  
  console.log('3. Verify Supabase Project Settings:');
  console.log(`   → Project URL: ${supabaseUrl}`);
  console.log('   → Check project is active and not paused');
  console.log('   → Verify API keys are correct');
  console.log('');
  
  console.log('4. Manual Password Reset:');
  console.log('   → Go to Supabase Dashboard > Authentication > Users');
  console.log(`   → Find user: ${TEST_EMAIL}`);
  console.log('   → Click "Send Password Reset Email" manually');
  console.log('   → Check if manual reset works');
  console.log('');
}

async function runEmailDeliveryTest() {
  console.log('🚀 Running comprehensive email delivery test...');
  console.log('');
  
  const emailSent = await testEmailConfiguration();
  await checkEmailSettings();
  await checkEmailDeliveryIssues();
  await provideSolutions();
  
  console.log('='.repeat(50));
  console.log('📋 NEXT STEPS:');
  console.log('='.repeat(50));
  console.log('');
  
  if (emailSent) {
    console.log('✅ Technical setup is working correctly');
    console.log('📧 The issue is likely email delivery configuration');
    console.log('');
    console.log('🎯 PRIORITY ACTIONS:');
    console.log('1. Check Supabase Dashboard email settings');
    console.log('2. Configure custom SMTP provider');
    console.log('3. Test with different email address');
    console.log('4. Check spam folder thoroughly');
    console.log('');
  } else {
    console.log('❌ Technical configuration needs fixing');
    console.log('🔧 Check environment variables and Supabase setup');
  }
  
  console.log('📞 Support:');
  console.log('   → Supabase Dashboard: https://supabase.com/dashboard');
  console.log(`   → Project: ${supabaseUrl}`);
  console.log('   → Documentation: https://supabase.com/docs/guides/auth');
}

// Run the comprehensive test
runEmailDeliveryTest().catch(console.error);
