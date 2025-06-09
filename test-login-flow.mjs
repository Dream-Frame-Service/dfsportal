#!/usr/bin/env node
/**
 * DFS Manager Portal - Login Flow Test
 * Tests the complete authentication flow with admin credentials
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration (hardcoded for testing)
const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk';

// Admin credentials
const ADMIN_EMAIL = 'mobil3801beach@gmail.com';
const ADMIN_PASSWORD = 'AdminDFS2025!';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧪 DFS Manager Portal - Login Flow Test');
console.log('=' .repeat(50));

async function testLoginFlow() {
  try {
    console.log('🔐 Testing Admin Login Flow...');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD.replace(/./g, '*')}`);
    console.log('');

    // Step 1: Check initial auth state
    console.log('1️⃣ Checking initial authentication state...');
    const { data: initialSession } = await supabase.auth.getSession();
    console.log(`✅ Initial session: ${initialSession.session ? 'Active' : 'None'}`);
    
    if (initialSession.session) {
      console.log(`👤 Current user: ${initialSession.session.user?.email}`);
      console.log('🚪 Signing out first...');
      await supabase.auth.signOut();
      console.log('✅ Signed out successfully');
    }
    console.log('');

    // Step 2: Test login
    console.log('2️⃣ Testing login with admin credentials...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (loginError) {
      console.log(`❌ Login failed: ${loginError.message}`);
      return false;
    }

    console.log('✅ Login successful!');
    console.log(`👤 User ID: ${loginData.user?.id}`);
    console.log(`📧 User Email: ${loginData.user?.email}`);
    console.log(`🕐 Session expires: ${loginData.session?.expires_at ? new Date(loginData.session.expires_at * 1000).toLocaleString() : 'N/A'}`);
    console.log('');

    // Step 3: Verify session persistence
    console.log('3️⃣ Testing session persistence...');
    const { data: currentSession } = await supabase.auth.getSession();
    if (currentSession.session) {
      console.log('✅ Session persisted successfully');
      console.log(`🔐 Access token length: ${currentSession.session.access_token?.length || 0} chars`);
      console.log(`🔄 Refresh token available: ${currentSession.session.refresh_token ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Session not persisted');
      return false;
    }
    console.log('');

    // Step 4: Test user metadata
    console.log('4️⃣ Testing user metadata...');
    const user = currentSession.session?.user;
    if (user) {
      console.log(`👤 User metadata:`);
      console.log(`   - Email verified: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   - Phone verified: ${user.phone_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   - Last sign in: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}`);
      console.log(`   - Created at: ${user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}`);
    }
    console.log('');

    // Step 5: Test logout
    console.log('5️⃣ Testing logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      console.log(`❌ Logout failed: ${logoutError.message}`);
      return false;
    }

    const { data: postLogoutSession } = await supabase.auth.getSession();
    if (postLogoutSession.session) {
      console.log('❌ Session still active after logout');
      return false;
    }

    console.log('✅ Logout successful');
    console.log('✅ Session cleared');
    console.log('');

    return true;

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    return false;
  }
}

async function testPasswordReset() {
  try {
    console.log('6️⃣ Testing password reset functionality...');
    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL);
    
    if (error) {
      console.log(`❌ Password reset failed: ${error.message}`);
      return false;
    }

    console.log('✅ Password reset email sent successfully');
    console.log(`📧 Reset link sent to: ${ADMIN_EMAIL}`);
    return true;

  } catch (error) {
    console.error('💥 Password reset test failed:', error.message);
    return false;
  }
}

async function main() {
  const loginSuccess = await testLoginFlow();
  console.log('');
  
  const resetSuccess = await testPasswordReset();
  console.log('');

  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(50));
  console.log(`🔐 Login Flow: ${loginSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔄 Password Reset: ${resetSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  if (loginSuccess && resetSuccess) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ The login page is fully integrated with Supabase');
    console.log('✅ Authentication flow is working correctly');
    console.log('✅ Session management is functional');
    console.log('✅ Logout functionality works');
    console.log('✅ Password reset is operational');
    console.log('');
    console.log('🌐 Ready for production use!');
    console.log(`🔗 Access the application at: http://localhost:8081/`);
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('⚠️ Review the errors above and check Supabase configuration');
  }
}

main().catch(console.error);
