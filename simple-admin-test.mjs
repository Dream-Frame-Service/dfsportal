#!/usr/bin/env node

/**
 * 🧪 Simple Admin Creation Test
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🧪 Testing Admin Creation for admin@dfs-portal.com');
console.log('URL:', supabaseUrl ? 'Available' : 'Missing');
console.log('Key:', supabaseAnonKey ? 'Available' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  try {
    console.log('\n📧 Creating admin@dfs-portal.com...');
    
    // Try to create the admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@dfs-portal.com',
      password: 'AdminDFS2025!',
      options: {
        data: {
          role: 'Administrator',
          full_name: 'DFS Portal Admin'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ User already exists - sending password reset...');
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          'admin@dfs-portal.com',
          { redirectTo: 'https://dfsportal.vercel.app/resetpassword' }
        );
        
        if (resetError) {
          console.error('❌ Reset error:', resetError.message);
        } else {
          console.log('✅ Password reset sent to admin@dfs-portal.com');
        }
      } else {
        console.error('❌ Signup error:', error.message);
      }
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('👤 User ID:', data.user?.id);
    }

    // Test database connection
    console.log('\n🔗 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.log('ℹ️ Profiles table:', testError.message);
    } else {
      console.log('✅ Database connection working');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createAdmin().then(() => {
  console.log('\n🎯 ADMIN CREDENTIALS:');
  console.log('📧 Email: admin@dfs-portal.com');
  console.log('🔑 Password: AdminDFS2025!');
  console.log('🌐 Login: https://dfsportal.vercel.app/login');
  console.log('\n📋 If password doesn\'t work, check email for reset link!');
});
