#!/usr/bin/env node

/**
 * Check Admin User Status
 * Verifies the mobil3801beach@gmail.com admin account
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const ADMIN_EMAIL = 'admin@dfs-portal.com';
const RESET_URL = 'https://dfsportal.vercel.app/reset-password';

// Validate environment
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAdminStatus() {
  console.log('🔍 Checking admin user status...');
  console.log(`📧 Admin Email: ${ADMIN_EMAIL}`);
  console.log('');

  try {
    // Test password reset (this tells us if the user exists)
    console.log('🔄 Testing password reset for admin user...');
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      ADMIN_EMAIL,
      { redirectTo: RESET_URL }
    );

    if (error) {
      console.log('❌ Password reset failed:', error.message);
      
      if (error.message.includes('rate limit')) {
        console.log('⏰ Rate limited - admin user exists but too many requests');
      } else if (error.message.includes('not found')) {
        console.log('🚫 Admin user does not exist');
        console.log('💡 Run: node create-admin-user.mjs');
      }
    } else {
      console.log('✅ Password reset email sent successfully!');
      console.log('📧 Check mobil3801beach@gmail.com for the reset email');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('1. Check email inbox for Supabase password reset');
      console.log('2. Click the reset link in the email');
      console.log('3. Set a new secure password');
      console.log(`4. Login at: ${process.env.APP_URL}/login`);
    }

  } catch (err) {
    console.error('💥 Network/Connection error:', err.message);
  }

  console.log('');
  console.log('🌐 Application URLs:');
  console.log(`- Login: ${process.env.APP_URL}/login`);
  console.log(`- Reset: ${process.env.APP_URL}/reset-password`);
}

// Run the check
checkAdminStatus().catch(console.error);
