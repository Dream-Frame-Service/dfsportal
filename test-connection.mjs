// Test Supabase connection with the linked project
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔗 Testing connection to linked Supabase project...')
console.log('Project ID: vetufvhzmawjbsumtplq')

try {
  // Test basic connection
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .limit(3)

  if (error) {
    console.error('❌ Connection error:', error)
  } else {
    console.log('✅ Successfully connected to linked project!')
    console.log('📊 Sample data:', data)
    console.log(`📈 Found ${data?.length || 0} employee records`)
  }
} catch (err) {
  console.error('❌ Network error:', err)
}
