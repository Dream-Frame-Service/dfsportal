#!/usr/bin/env node

/**
 * 🔍 Profiles Table Structure Inspector
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectProfilesTable() {
  try {
    console.log('🔍 Inspecting profiles table structure...');
    
    // Try to get any existing profiles to see the structure
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profileError) {
      console.log('❌ Profiles query error:', profileError.message);
    } else {
      console.log('✅ Profiles table data:', profileData);
      
      if (profileData.length > 0) {
        console.log('📋 Available columns:', Object.keys(profileData[0]));
      } else {
        console.log('📋 Table is empty, trying to insert minimal record...');
        
        // Try inserting a minimal record to see what's required
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({ email: 'admin@dfs-portal.com' })
          .select();

        if (insertError) {
          console.log('ℹ️ Insert error (shows required fields):', insertError.message);
        } else {
          console.log('✅ Minimal record created:', insertData);
        }
      }
    }

    // Now try to create proper admin profile with minimal fields
    console.log('\n👑 Creating admin profile with minimal required fields...');
    
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .upsert({
        email: 'admin@dfs-portal.com'
      }, {
        onConflict: 'email'
      })
      .select();

    if (adminError) {
      console.log('❌ Admin profile error:', adminError.message);
    } else {
      console.log('✅ Admin profile created!', adminData);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

inspectProfilesTable();
