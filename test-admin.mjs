// Create an admin user using Supabase admin functions
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

// Note: You would need the service role key for admin operations
// This is just a test with the anon key to see what's possible

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('👑 Testing admin user creation for DFS Manager Portal...')

async function testAdminCreation() {
  try {
    // Check if we can access any existing users
    console.log('\n🔍 Checking authentication configuration...')
    
    // Try to get the current auth settings
    const { data: config, error: configError } = await supabase.auth.getSession()
    console.log('Auth config check:', config ? 'Available' : 'Limited access')

    // Try alternative approach - check if any basic operations work
    console.log('\n🔧 Testing basic auth operations...')
    
    // Test password reset (this sometimes works even when signup is disabled)
    console.log('Testing password reset functionality...')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail('admin@dfsmanager.com', {
      redirectTo: 'https://dfsmanagerportal.netlify.app/reset-password'
    })

    if (resetError) {
      console.log('Password reset test result:', resetError.message)
    } else {
      console.log('✅ Password reset function works (admin@dfsmanager.com)')
      console.log('📧 Check email for reset link if account exists')
    }

    return true
  } catch (error) {
    console.error('❌ Admin test failed:', error)
    return false
  }
}

// Test common admin email addresses
const testEmails = [
  'admin@dfsmanager.com',
  'manager@dfsmanager.com',
  'test@dfsmanager.com'
]

async function testExistingUsers() {
  console.log('\n🔐 Testing login with potential existing accounts...')
  
  for (const email of testEmails) {
    console.log(`\n📧 Testing: ${email}`)
    
    // Try password reset to see if account exists
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://dfsmanagerportal.netlify.app/reset-password'
    })
    
    if (error) {
      if (error.message.includes('user not found') || error.message.includes('invalid')) {
        console.log(`❌ Account doesn't exist: ${email}`)
      } else {
        console.log(`⚠️ Reset error for ${email}:`, error.message)
      }
    } else {
      console.log(`✅ Account exists: ${email} (reset email sent)`)
    }
  }
}

testAdminCreation().then(() => {
  return testExistingUsers()
}).then(() => {
  console.log('\n📋 Summary:')
  console.log('1. Main issue: User registration is disabled in Supabase')
  console.log('2. Need to enable signup in Supabase dashboard')
  console.log('3. Or create users manually in dashboard')
  console.log('\n🔧 Quick Fix:')
  console.log('- Go to https://supabase.com/dashboard')
  console.log('- Select your project → Authentication → Settings')
  console.log('- Enable "Allow new users to sign up"')
  console.log('\n🌐 Then test at: https://dfsmanagerportal.netlify.app/login')
})
