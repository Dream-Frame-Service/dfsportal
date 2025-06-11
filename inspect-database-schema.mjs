#!/usr/bin/env node

/**
 * 🔍 Database Schema Inspector
 * 
 * This script examines the current Supabase database structure
 * to understand what tables and columns are available.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('🔍 Inspecting Database Schema...');
  console.log('='.repeat(50));
  
  try {
    // Get all tables in the public schema
    const { data: tables, error } = await supabase
      .rpc('get_tables_info');
    
    if (error) {
      // If RPC doesn't exist, try to list tables directly
      console.log('📊 Attempting to detect tables by querying common table names...\n');
      
      const commonTables = [
        'profiles', 'stations', 'employees', 'schedules', 
        'activity_logs', 'system_alerts', 'twilio_config',
        'sms_settings', 'notifications', 'shifts'
      ];
      
      for (const tableName of commonTables) {
        try {
          const { data, error: tableError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (!tableError) {
            console.log(`✅ Table '${tableName}' exists`);
            
            // Get column info by examining the data structure
            if (data && data.length > 0) {
              const columns = Object.keys(data[0]);
              console.log(`   Columns: ${columns.join(', ')}`);
            } else {
              console.log(`   Table is empty - cannot determine columns`);
            }
          } else {
            console.log(`❌ Table '${tableName}' does not exist`);
          }
        } catch (e) {
          console.log(`❌ Table '${tableName}' does not exist or is inaccessible`);
        }
      }
    } else {
      console.log('📊 Database Tables Found:');
      tables.forEach(table => {
        console.log(`✅ ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Schema inspection failed:', error.message);
  }
}

// Run inspection if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  inspectSchema().catch(error => {
    console.error('❌ Inspector failed:', error);
    process.exit(1);
  });
}

export { inspectSchema };
