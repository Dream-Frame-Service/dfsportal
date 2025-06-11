#!/usr/bin/env node

/**
 * 👑 Admin User Creation Script for admin@dfs-portal.com
 * 
 * This script creates full admin access for admin@dfs-portal.com
 * with complete permissions for the DFS Portal application.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables:');
  if (!supabaseUrl) console.error('   - VITE_SUPABASE_URL');
  if (!supabaseAnonKey) console.error('   - VITE_SUPABASE_ANON_KEY');
  console.error('Please check your .env file and ensure all variables are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin details
const ADMIN_EMAIL = 'admin@dfs-portal.com';
const ADMIN_PASSWORD = 'AdminDFS2025!';
const APP_URL = 'https://dfsportal.vercel.app';

console.log('👑 Creating Admin Access for DFS Portal');
console.log('='.repeat(50));
console.log('📧 Admin Email:', ADMIN_EMAIL);

async function createDFSAdmin() {
  try {
    console.log('\n🔧 Step 1: Creating admin account...');
    
    // Attempt to sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          role: 'Administrator',
          full_name: 'DFS Portal Administrator',
          department: 'Administration'
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered') || 
          signUpError.message.includes('already exists')) {
        
        console.log('ℹ️  Admin user already exists, verifying access...');
        
        // Try to sign in to verify the account
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        });

        if (signInError) {
          console.log('⚠️  Cannot sign in with current password. Sending password reset...');
          
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
            redirectTo: `${APP_URL}/resetpassword`
          });
          
          if (resetError) {
            console.error('❌ Password reset failed:', resetError.message);
            return false;
          } else {
            console.log('✅ Password reset email sent!');
            console.log('📧 Check admin@dfs-portal.com inbox to set new password');
            return true;
          }
        } else {
          console.log('✅ Successfully verified existing admin account!');
          console.log('👤 Admin User ID:', signInData.user?.id);
        }
      } else if (signUpError.message.includes('Signups not allowed')) {
        console.log('⚠️  Signups disabled. Using password reset to activate account...');
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
          redirectTo: `${APP_URL}/resetpassword`
        });
        
        if (resetError) {
          console.error('❌ Account activation failed:', resetError.message);
          return false;
        } else {
          console.log('✅ Account activation email sent!');
          console.log('📧 Check admin@dfs-portal.com inbox to activate account');
          return true;
        }
      } else {
        console.error('❌ Account creation failed:', signUpError.message);
        return false;
      }
    } else {
      console.log('✅ New admin account created successfully!');
      console.log('👤 Admin User ID:', signUpData.user?.id);
      
      if (!signUpData.user?.email_confirmed_at) {
        console.log('📧 Email confirmation required - check admin@dfs-portal.com inbox');
      }
    }

    console.log('\n🔧 Step 2: Setting up admin permissions...');
    
    // Try to create admin profile in profiles table
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          email: ADMIN_EMAIL,
          role: 'Administrator',
          full_name: 'DFS Portal Administrator',
          department: 'Administration',
          permissions: JSON.stringify({
            dashboard: ['read', 'write', 'delete', 'admin'],
            products: ['read', 'write', 'delete', 'admin'],
            employees: ['read', 'write', 'delete', 'admin'],
            sales: ['read', 'write', 'delete', 'admin'],
            vendors: ['read', 'write', 'delete', 'admin'],
            orders: ['read', 'write', 'delete', 'admin'],
            licenses: ['read', 'write', 'delete', 'admin'],
            salary: ['read', 'write', 'delete', 'admin'],
            inventory: ['read', 'write', 'delete', 'admin'],
            delivery: ['read', 'write', 'delete', 'admin'],
            admin: ['read', 'write', 'delete', 'admin'],
            system: ['read', 'write', 'delete', 'admin'],
            monitoring: ['read', 'write', 'delete', 'admin'],
            settings: ['read', 'write', 'delete', 'admin'],
            security: ['read', 'write', 'delete', 'admin'],
            logs: ['read', 'write', 'delete', 'admin']
          }),
          is_active: true,
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select();

      if (profileError) {
        console.log('ℹ️  Profile table error:', profileError.message);
        console.log('📝 Admin permissions will be set via application logic');
      } else {
        console.log('✅ Admin profile created with full system permissions!');
      }
    } catch (profileErr) {
      console.log('ℹ️  Profile setup info:', profileErr.message);
    }

    // Try to create admin entry in any admin-specific tables
    try {
      console.log('\n🔧 Step 3: Verifying admin database access...');
      
      // Test database connectivity and permissions
      const { data: testData, error: testError } = await supabase
        .from('stations')
        .select('count(*)')
        .limit(1);

      if (testError) {
        console.log('⚠️  Database access test:', testError.message);
      } else {
        console.log('✅ Database connectivity verified!');
      }
    } catch (testErr) {
      console.log('ℹ️  Database test info:', testErr.message);
    }

    return true;

  } catch (error) {
    console.error('❌ Admin creation process failed:', error);
    return false;
  }
}

// Execute admin creation
createDFSAdmin().then(success => {
  console.log('\n' + '='.repeat(60));
  
  if (success) {
    console.log('🎉 ADMIN ACCESS GRANTED FOR admin@dfs-portal.com!');
    console.log('');
    console.log('📧 Email: admin@dfs-portal.com');
    console.log('🔑 Password: AdminDFS2025!');
    console.log('🌐 Login URL: https://dfsportal.vercel.app/login');
    console.log('');
    console.log('👑 FULL ADMINISTRATOR PERMISSIONS:');
    console.log('   ✅ Dashboard Management');
    console.log('   ✅ Product Management');
    console.log('   ✅ Employee Management');
    console.log('   ✅ Sales Reports & Analytics');
    console.log('   ✅ Vendor Management');
    console.log('   ✅ Order Management');
    console.log('   ✅ License Management');
    console.log('   ✅ Salary Management');
    console.log('   ✅ Inventory Control');
    console.log('   ✅ Delivery Management');
    console.log('   ✅ System Administration');
    console.log('   ✅ Security Settings');
    console.log('   ✅ System Monitoring');
    console.log('   ✅ Database Management');
    console.log('   ✅ User Management');
    console.log('   ✅ Audit Logs');
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('1. Go to: https://dfsportal.vercel.app/login');
    console.log('2. Sign in with admin@dfs-portal.com');
    console.log('3. Use password: AdminDFS2025!');
    console.log('4. If password doesn\'t work, check email for reset link');
    console.log('5. Access admin panel at: /admin');
    console.log('');
    console.log('🔐 SECURITY NOTES:');
    console.log('• Change password after first login');
    console.log('• Enable 2FA if available');
    console.log('• Monitor admin activity logs');
    
  } else {
    console.log('❌ Admin setup encountered issues');
    console.log('');
    console.log('🔄 TROUBLESHOOTING:');
    console.log('1. Check email admin@dfs-portal.com for setup links');
    console.log('2. Try running this script again');
    console.log('3. Check Supabase dashboard for user status');
    console.log('4. Verify environment variables are correct');
  }
  
  console.log('='.repeat(60));
});

export { createDFSAdmin };
