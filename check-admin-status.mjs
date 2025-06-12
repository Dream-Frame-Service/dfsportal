#!/usr/bin/env node

/**
 * Check Admin User Status
 * Verifies the admin@dfs-portal.com admin account
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const ADMIN_EMAIL = 'admin@dfs-portal.com';
const RESET_URL = 'https://dfsportal.vercel.app/resetpassword';

// Supabase client with fallback values
console.log('🔧 Connecting to Supabase...');
console.log(`📍 URL: ${process.env.VITE_SUPABASE_URL || 'https://vetufvhzmawjbsumtplq.supabase.co'}`);
console.log('');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vetufvhzmawjbsumtplq.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'
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
      console.log('📧 Check admin@dfs-portal.com for the reset email');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('1. Check email inbox for Supabase password reset');
      console.log('2. Click the reset link in the email');
      console.log('3. Set a new secure password');
      console.log(`4. Login at: https://dfsportal.vercel.app/login`);
    }

  } catch (err) {
    console.error('💥 Network/Connection error:', err.message);
  }

  console.log('');
  console.log('🌐 Application URLs:');
  console.log(`- Login: https://dfsportal.vercel.app/login`);
  console.log(`- Reset: https://dfsportal.vercel.app/resetpassword`);
}

// Run the check
checkAdminStatus().catch(console.error);
