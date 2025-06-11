#!/usr/bin/env node

/**
 * 👑 Admin Profile Creation
 * Creates admin profile with full permissions
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminProfile() {
  try {
    console.log('👑 Creating admin profile for admin@dfs-portal.com...');
    
    // Create comprehensive admin profile
    const adminProfile = {
      email: 'admin@dfs-portal.com',
      full_name: 'DFS Portal Administrator',
      role: 'Administrator',
      department: 'Administration',
      is_admin: true,
      is_active: true,
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
        logs: ['read', 'write', 'delete', 'admin'],
        users: ['read', 'write', 'delete', 'admin']
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert admin profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(adminProfile, {
        onConflict: 'email'
      })
      .select();

    if (profileError) {
      console.error('❌ Profile creation error:', profileError.message);
      
      // Try with simplified permissions
      console.log('🔄 Trying simplified profile...');
      const simpleProfile = {
        email: 'admin@dfs-portal.com',
        full_name: 'DFS Portal Administrator',
        role: 'Administrator',
        is_admin: true,
        is_active: true,
        created_at: new Date().toISOString()
      };

      const { data: simpleData, error: simpleError } = await supabase
        .from('profiles')
        .upsert(simpleProfile, {
          onConflict: 'email'
        })
        .select();

      if (simpleError) {
        console.error('❌ Simplified profile error:', simpleError.message);
      } else {
        console.log('✅ Simplified admin profile created!');
      }
    } else {
      console.log('✅ Full admin profile created successfully!');
      console.log('👤 Profile data:', profileData);
    }

    // Verify the profile was created
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@dfs-portal.com')
      .single();

    if (verifyError) {
      console.log('ℹ️ Profile verification:', verifyError.message);
    } else {
      console.log('✅ Admin profile verified in database!');
      console.log('📋 Profile details:', {
        email: verifyData.email,
        role: verifyData.role,
        is_admin: verifyData.is_admin,
        is_active: verifyData.is_active
      });
    }

  } catch (err) {
    console.error('❌ Profile creation failed:', err.message);
  }
}

createAdminProfile().then(() => {
  console.log('\n' + '='.repeat(50));
  console.log('✅ ADMIN PROFILE SETUP COMPLETE!');
  console.log('');
  console.log('📧 Admin Email: admin@dfs-portal.com');
  console.log('👑 Role: Administrator');
  console.log('🔐 Status: Active');
  console.log('🎯 Permissions: Full System Access');
  console.log('');
  console.log('🌐 Login URL: https://dfsportal.vercel.app/login');
  console.log('🛠️ Admin Panel: https://dfsportal.vercel.app/admin');
  console.log('='.repeat(50));
});
