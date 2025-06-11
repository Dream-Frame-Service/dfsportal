#!/usr/bin/env node

/**
 * 🧪 Comprehensive Testing Script for Ezsite → Supabase Migration
 * 
 * This script validates all the functionality that was migrated from
 * ezsite APIs to Supabase APIs as identified in the code review.
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

console.log('🧪 Starting Ezsite → Supabase Migration Testing');
console.log('='.repeat(60));

/**
 * Test 1: Station Management (InitialStationSetup.tsx)
 */
async function testStationManagement() {
  console.log('\n📍 Testing Station Management...');
  
  try {
    // Test loading stations
    const { data: stations, error: loadError } = await supabase
      .from('stations')
      .select('*')
      .order('station_name', { ascending: true });
    
    if (loadError) throw loadError;
    console.log(`✅ Station Loading: Found ${stations?.length || 0} stations`);
    
    // Test creating a test station (using actual schema)
    const testStation = {
      station_name: `Test Station ${Date.now()}`,
      address: '123 Test St',
      phone: '555-0123',
      operating_hours: '9:00 AM - 5:00 PM',
      manager_name: 'Test Manager',
      status: 'active'
    };
    
    const { data: newStation, error: createError } = await supabase
      .from('stations')
      .insert([testStation])
      .select()
      .single();
    
    if (createError) throw createError;
    console.log(`✅ Station Creation: Created station ID ${newStation.id}`);
    
    // Test updating the station
    const { error: updateError } = await supabase
      .from('stations')
      .update({ station_name: `${testStation.station_name} (Updated)` })
      .eq('id', newStation.id);
    
    if (updateError) throw updateError;
    console.log(`✅ Station Update: Updated station ID ${newStation.id}`);
    
    // Test deleting the station
    const { error: deleteError } = await supabase
      .from('stations')
      .delete()
      .eq('id', newStation.id);
    
    if (deleteError) throw deleteError;
    console.log(`✅ Station Deletion: Deleted station ID ${newStation.id}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Station Management Test Failed:`, error.message);
    return false;
  }
}

/**
 * Test 2: Employee Management (since we have employees table)
 */
async function testEmployeeManagement() {
  console.log('\n👥 Testing Employee Management...');
  
  try {
    // Test loading employees
    const { data: employees, error: loadError } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (loadError) throw loadError;
    console.log(`✅ Employee Loading: Found ${employees?.length || 0} employees`);
    
    return true;
  } catch (error) {
    console.error(`❌ Employee Management Test Failed:`, error.message);
    return false;
  }
}

/**
 * Test 3: User Profiles (since we have profiles table)
 */
async function testUserProfiles() {
  console.log('\n👤 Testing User Profiles...');
  
  try {
    // Test loading user profiles
    const { data: profiles, error: loadError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
    
    if (loadError) throw loadError;
    console.log(`✅ User Profiles: Found ${profiles?.length || 0} profiles`);
    
    return true;
  } catch (error) {
    console.error(`❌ User Profiles Test Failed:`, error.message);
    return false;
  }
}

/**
 * Test 4: Authentication & Database Connection
 */
async function testDatabaseConnection() {
  console.log('\n🔐 Testing Database Connection...');
  
  try {
    // Test basic authentication/connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) throw authError;
    console.log(`✅ Database Connection: ${authData ? 'Connected successfully' : 'Anonymous connection'}`);
    
    // Test basic table access
    const { data: stationCount, error: countError } = await supabase
      .from('stations')
      .select('id', { count: 'exact' });
    
    if (countError) throw countError;
    console.log(`✅ Table Access: Can access tables (${stationCount?.length || 0} stations)`);
    
    return true;
  } catch (error) {
    console.error(`❌ Database Connection Test Failed:`, error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Running comprehensive migration tests...\n');
  
  const tests = [
    { name: 'Station Management', fn: testStationManagement },
    { name: 'Employee Management', fn: testEmployeeManagement },
    { name: 'User Profiles', fn: testUserProfiles },
    { name: 'Database Connection', fn: testDatabaseConnection }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const success = await test.fn();
      results.push({ name: test.name, success });
    } catch (error) {
      console.error(`❌ ${test.name} failed with error:`, error);
      results.push({ name: test.name, success: false });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY:');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  });
  
  console.log(`\n🎯 Overall Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All migration tests PASSED! Supabase integration is working correctly.');
  } else {
    console.log('⚠️  Some tests FAILED. Please review the errors above.');
  }
  
  return passed === total;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

export { runAllTests };
