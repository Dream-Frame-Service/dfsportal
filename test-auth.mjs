// Test authentication functionality with Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔐 Testing DFS Manager Portal Authentication...')

async function testAuth() {
  try {
    // Test 1: Check if authentication is set up
    console.log('\n1️⃣ Testing authentication setup...')
    const { data: session } = await supabase.auth.getSession()
    console.log('✅ Auth session check:', session.session ? 'Active session found' : 'No active session')

    // Test 2: Try to create a test user (sign up)
    console.log('\n2️⃣ Testing user registration...')
    const testEmail = 'test@dfsmanager.com'
    const testPassword = 'TestPassword123!'
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('ℹ️ Test user already exists, trying to sign in...')
        
        // Test 3: Try to sign in with existing user
        console.log('\n3️⃣ Testing user login...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        })

        if (signInError) {
          console.error('❌ Sign in failed:', signInError.message)
          return false
        } else {
          console.log('✅ Sign in successful!')
          console.log('👤 User ID:', signInData.user?.id)
          console.log('📧 User Email:', signInData.user?.email)
          
          // Test 4: Sign out
          console.log('\n4️⃣ Testing sign out...')
          const { error: signOutError } = await supabase.auth.signOut()
          if (signOutError) {
            console.error('❌ Sign out failed:', signOutError.message)
          } else {
            console.log('✅ Sign out successful!')
          }
          return true
        }
      } else {
        console.error('❌ Sign up failed:', signUpError.message)
        return false
      }
    } else {
      console.log('✅ Sign up successful!')
      console.log('👤 User ID:', signUpData.user?.id)
      console.log('📧 User Email:', signUpData.user?.email)
      console.log('⚠️ Note: Please check email for verification link')
      return true
    }
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
    return false
  }
}

testAuth().then(success => {
  if (success) {
    console.log('\n🎉 Authentication system is working correctly!')
    console.log('🌐 You can now test login at: https://dfsmanagerportal.netlify.app/login')
    console.log('📧 Test credentials: test@dfsmanager.com / TestPassword123!')
  } else {
    console.log('\n❌ Authentication system needs attention')
  }
})
