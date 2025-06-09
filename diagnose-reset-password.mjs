#!/usr/bin/env node

/**
 * Reset Password Issue Diagnostic Tool
 * This script will help diagnose and fix Supabase reset password problems
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk';

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_EMAIL = 'mobil3801beach@gmail.com';

console.log('🔍 Supabase Reset Password Diagnostic Tool');
console.log('==========================================');
console.log(`Testing with email: ${TEST_EMAIL}`);
console.log('');

async function checkSupabaseConfiguration() {
  console.log('1️⃣ Checking Supabase Configuration...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    console.log('✅ Supabase connection: OK');
    console.log(`   Session available: ${data.session ? 'Yes' : 'No'}`);
  } catch (error) {
    console.log('❌ Supabase connection: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
  
  return true;
}

async function checkEmailSettings() {
  console.log('\n2️⃣ Checking Email Configuration...');
  
  // These settings need to be configured in Supabase Dashboard
  console.log('📧 Email settings to verify in Supabase Dashboard:');
  console.log('   → Authentication > Settings > Email Templates');
  console.log('   → Authentication > Settings > SMTP Settings');
  console.log('   → Authentication > Settings > Site URL');
  console.log('');
  
  console.log('Required settings:');
  console.log('   Site URL: http://localhost:5173 (development)');
  console.log('   Additional URLs: http://localhost:8080, http://localhost:8081');
  console.log('   Reset redirect: /resetpassword');
  console.log('');
}

async function testUserExists() {
  console.log('3️⃣ Checking if user exists...');
  
  try {
    // Try to trigger a password reset to see if user exists
    const { data, error } = await supabase.auth.resetPasswordForEmail(TEST_EMAIL, {
      redirectTo: `${process.env.NODE_ENV === 'production' ? 'https://dfsmanagerportal.netlify.app' : 'http://localhost:8080'}/resetpassword`
    });
    
    if (error) {
      if (error.message.includes('User not found') || error.message.includes('Invalid email')) {
        console.log('❌ User does not exist in Supabase');
        console.log('');
        console.log('💡 SOLUTION: Create the user first');
        console.log('   Method 1: Enable signups in Supabase Dashboard');
        console.log('   Method 2: Manually create user in Authentication > Users');
        console.log('   Method 3: Run: node create-admin-user.mjs');
        return false;
      } else {
        console.log(`❌ Reset password failed: ${error.message}`);
        return false;
      }
    } else {
      console.log('✅ Password reset email sent successfully!');
      console.log('📧 Check your email inbox');
      return true;
    }
  } catch (error) {
    console.log(`💥 Error testing user existence: ${error.message}`);
    return false;
  }
}

async function checkEmailProviderSetup() {
  console.log('\n4️⃣ Checking Email Provider Setup...');
  
  console.log('Supabase email configuration checklist:');
  console.log('');
  console.log('□ Go to Supabase Dashboard > Authentication > Settings');
  console.log('□ Check "Email" tab for SMTP configuration');
  console.log('□ If using default Supabase email:');
  console.log('  - Rate limits: 3 emails per hour');
  console.log('  - Production: Configure custom SMTP');
  console.log('□ Check "Site URL" and "Redirect URLs"');
  console.log('');
}

async function provideTroubleshootingSteps() {
  console.log('\n🛠️ Common Reset Password Issues & Solutions:');
  console.log('');
  
  console.log('Issue 1: No email received');
  console.log('  ✅ Check spam/junk folder');
  console.log('  ✅ Verify email exists in Authentication > Users');
  console.log('  ✅ Check SMTP settings in Dashboard');
  console.log('  ✅ Wait up to 5 minutes for delivery');
  console.log('');
  
  console.log('Issue 2: "User not found" error');
  console.log('  ✅ Create user manually in Supabase Dashboard');
  console.log('  ✅ Enable signups: Authentication > Settings > Allow new users to sign up');
  console.log('  ✅ Run: node create-admin-user.mjs');
  console.log('');
  
  console.log('Issue 3: Invalid redirect URL');
  console.log('  ✅ Add redirect URLs in Authentication > Settings');
  console.log('  ✅ Include: http://localhost:8080/resetpassword');
  console.log('  ✅ Include: https://yourdomain.com/resetpassword');
  console.log('');
  
  console.log('Issue 4: Email template not working');
  console.log('  ✅ Check Authentication > Settings > Email Templates');
  console.log('  ✅ Customize reset password template if needed');
  console.log('  ✅ Test with different email address');
  console.log('');
}

async function runFullDiagnostic() {
  console.log('🚀 Starting comprehensive diagnostic...\n');
  
  const connectionOK = await checkSupabaseConfiguration();
  if (!connectionOK) {
    console.log('\n❌ Basic connection failed. Check your credentials.');
    return;
  }
  
  await checkEmailSettings();
  
  const userExists = await testUserExists();
  
  await checkEmailProviderSetup();
  
  await provideTroubleshootingSteps();
  
  console.log('\n📋 QUICK FIX CHECKLIST:');
  console.log('========================');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select project "vetufvhzmawjbsumtplq"');
  console.log('3. Authentication > Users > Add user manually');
  console.log(`4. Create user: ${TEST_EMAIL}`);
  console.log('5. Set email confirmed: ✅ Yes');
  console.log('6. Try reset password again');
  console.log('');
  
  if (userExists) {
    console.log('🎉 SUCCESS! Reset password email should be in your inbox');
  } else {
    console.log('⚠️  User needs to be created first before reset password will work');
  }
}

// Run the diagnostic
runFullDiagnostic().catch(console.error);
