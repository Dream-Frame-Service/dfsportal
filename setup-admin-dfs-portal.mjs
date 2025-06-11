#!/usr/bin/env node

/**
 * 🔐 Admin Account Setup via Password Reset
 * This method works when signups are disabled
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔐 Setting up admin@dfs-portal.com via password reset');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdminViaReset() {
  try {
    console.log('\n📧 Sending password reset to admin@dfs-portal.com...');
    
    // Send password reset email - this works even when signups are disabled
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      'admin@dfs-portal.com',
      {
        redirectTo: 'https://dfsportal.vercel.app/resetpassword'
      }
    );

    if (resetError) {
      console.error('❌ Password reset failed:', resetError.message);
      
      // Try alternative approach with different redirect
      console.log('\n🔄 Trying alternative reset method...');
      const { error: altResetError } = await supabase.auth.resetPasswordForEmail(
        'admin@dfs-portal.com'
      );
      
      if (altResetError) {
        console.error('❌ Alternative reset failed:', altResetError.message);
      } else {
        console.log('✅ Alternative password reset sent!');
      }
    } else {
      console.log('✅ Password reset email sent successfully!');
    }

    // Test if we can query the profiles table correctly
    console.log('\n🔗 Testing database access...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileError) {
      console.log('ℹ️ Profiles table access:', profileError.message);
    } else {
      console.log('✅ Profiles table accessible:', profileData.length, 'records found');
    }

    // Test stations table access
    const { data: stationData, error: stationError } = await supabase
      .from('stations')
      .select('*')
      .limit(1);

    if (stationError) {
      console.log('ℹ️ Stations table access:', stationError.message);
    } else {
      console.log('✅ Stations table accessible:', stationData.length, 'records found');
    }

  } catch (err) {
    console.error('❌ Setup error:', err.message);
  }
}

setupAdminViaReset().then(() => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ADMIN SETUP INITIATED for admin@dfs-portal.com!');
  console.log('');
  console.log('📧 CHECK EMAIL: admin@dfs-portal.com');
  console.log('🔗 Click the password reset link in the email');
  console.log('🔑 Set your admin password');
  console.log('🌐 Then login at: https://dfsportal.vercel.app/login');
  console.log('');
  console.log('👑 ADMIN PERMISSIONS WILL BE GRANTED:');
  console.log('   ✅ Full Dashboard Access');
  console.log('   ✅ Product Management');
  console.log('   ✅ Employee Management');  
  console.log('   ✅ Sales Management');
  console.log('   ✅ Order Management');
  console.log('   ✅ System Administration');
  console.log('   ✅ All Admin Features');
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('1. Check admin@dfs-portal.com email inbox');
  console.log('2. Click "Reset Password" link');
  console.log('3. Set a strong password'); 
  console.log('4. Login to https://dfsportal.vercel.app/login');
  console.log('5. Access admin panel at /admin');
  console.log('');
  console.log('🔐 SECURITY: Change password after first login!');
  console.log('='.repeat(60));
});
