import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test insert operation
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')      .insert([
        {
          role: 'Employee',
          station: 'Test Station',
          employee_id: 'TEST001',
          phone: '+1234567890',
          is_active: true,
          detailed_permissions: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (insertError) {
      console.error('Error inserting test data:', insertError)
      process.exit(1)
    }
    console.log('Successfully inserted test data:', insertData)
    
    // Test select operation
    const { data: selectData, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (selectError) {
      console.error('Error selecting data:', selectError)
      process.exit(1)
    }
    console.log('Successfully selected data:', selectData)
    process.exit(0)
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

main()
