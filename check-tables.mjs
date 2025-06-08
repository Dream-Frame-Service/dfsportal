// Check available tables in the linked Supabase project
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Checking available tables in linked project...')

try {
  // Try to get schema information
  const { data, error } = await supabase.rpc('get_schema_tables')
  
  if (error) {
    console.log('📋 Trying alternate method to check tables...')
    
    // Try checking auth tables (these should exist)
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('🔐 Auth connection:', authError ? 'Failed' : 'Working')
    
    // Try a basic query on auth users metadata table
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('*')
      .limit(1)
      
    console.log('👥 Auth users query:', userError ? userError.message : 'Success')
    
  } else {
    console.log('✅ Available tables:', data)
  }
} catch (err) {
  console.error('❌ Error checking schema:', err)
}
