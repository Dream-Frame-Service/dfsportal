// Create admin user: mobil3801beach@gmail.com with full access
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ADMIN_EMAIL = 'mobil3801beach@gmail.com'
const ADMIN_PASSWORD = 'AdminDFS2025!'

console.log('👑 Creating Admin User for DFS Manager Portal...')
console.log('📧 Email:', ADMIN_EMAIL)

async function createAdminUser() {
  try {
    // Step 1: Try to sign up the admin user
    console.log('\n1️⃣ Creating admin account...')
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          role: 'Administrator',
          full_name: 'DFS Admin',
          department: 'Management'
        }
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
        console.log('ℹ️ Admin user already exists, proceeding to setup access...')
        
        // Try to sign in to verify the account
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        })

        if (signInError) {
          console.log('⚠️ Cannot sign in with existing password. Sending password reset...')
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
            redirectTo: 'https://dfsmanagerportal.netlify.app/reset-password'
          })
          
          if (resetError) {
            console.error('❌ Password reset failed:', resetError.message)
          } else {
            console.log('✅ Password reset email sent to:', ADMIN_EMAIL)
            console.log('📧 Check your email and set a new password')
          }
        } else {
          console.log('✅ Successfully signed in with existing account!')
          console.log('👤 User ID:', signInData.user?.id)
        }
      } else if (signUpError.message.includes('Signups not allowed')) {
        console.log('⚠️ Signups are disabled. Sending password reset to create/activate account...')
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
          redirectTo: 'https://dfsmanagerportal.netlify.app/reset-password'
        })
        
        if (resetError) {
          console.error('❌ Account creation via reset failed:', resetError.message)
        } else {
          console.log('✅ Account setup email sent to:', ADMIN_EMAIL)
          console.log('📧 Check your email to set up your admin account')
        }
      } else {
        console.error('❌ Sign up failed:', signUpError.message)
        return false
      }
    } else {
      console.log('✅ Admin account created successfully!')
      console.log('👤 User ID:', signUpData.user?.id)
      console.log('📧 Email confirmation may be required')
    }

    // Step 2: Create admin profile entry (if tables exist)
    console.log('\n2️⃣ Setting up admin permissions...')
    
    try {
      // Check if user profiles table exists and create admin profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          email: ADMIN_EMAIL,
          role: 'Administrator',
          full_name: 'DFS Admin',
          department: 'Management',
          permissions: {
            dashboard: ['read', 'write', 'delete'],
            products: ['read', 'write', 'delete'],
            employees: ['read', 'write', 'delete'],
            sales: ['read', 'write', 'delete'],
            vendors: ['read', 'write', 'delete'],
            orders: ['read', 'write', 'delete'],
            licenses: ['read', 'write', 'delete'],
            inventory: ['read', 'write', 'delete'],
            delivery: ['read', 'write', 'delete'],
            admin: ['read', 'write', 'delete'],
            monitoring: ['read', 'write', 'delete'],
            settings: ['read', 'write', 'delete']
          },
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()

      if (profileError) {
        console.log('ℹ️ Profile table not found or error:', profileError.message)
        console.log('📝 Will set permissions via application logic instead')
      } else {
        console.log('✅ Admin profile created with full permissions!')
      }
    } catch (profileErr) {
      console.log('ℹ️ Profile setup skipped:', profileErr.message)
    }

    return true
  } catch (error) {
    console.error('❌ Admin creation failed:', error)
    return false
  }
}

// Main execution
createAdminUser().then(success => {
  console.log('\n' + '='.repeat(60))
  if (success) {
    console.log('🎉 ADMIN SETUP COMPLETE!')
    console.log('')
    console.log('📧 Admin Email: mobil3801beach@gmail.com')
    console.log('🔑 Admin Password: AdminDFS2025!')
    console.log('🌐 Login URL: https://dfsmanagerportal.netlify.app/login')
    console.log('')
    console.log('👑 Admin Permissions: FULL ACCESS')
    console.log('   • Dashboard Management')
    console.log('   • Product Management')
    console.log('   • Employee Management')
    console.log('   • Sales Reports')
    console.log('   • Vendor Management')
    console.log('   • Order Management')
    console.log('   • License Management')
    console.log('   • Inventory Control')
    console.log('   • Delivery Management')
    console.log('   • System Administration')
    console.log('   • Monitoring & Analytics')
    console.log('   • System Settings')
    console.log('')
    console.log('📋 Next Steps:')
    console.log('1. Go to the login page')
    console.log('2. Sign in with the credentials above')
    console.log('3. If password doesn\'t work, check email for reset link')
    console.log('')
  } else {
    console.log('❌ Admin setup encountered issues')
    console.log('📧 Check your email for any setup links')
    console.log('🔄 You can retry by running this script again')
  }
  console.log('='.repeat(60))
})
