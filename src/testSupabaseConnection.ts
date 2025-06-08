import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    console.log('Testing Supabase connection...');

    // Test insert operation
    const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert([
            {
                full_name: 'Test User',
                email: 'test@example.com',
                created_at: new Date().toISOString()
            }
        ])
        .select();

    if (insertError) {
        console.error('Error inserting test data:', insertError);
        return;
    }
    console.log('Successfully inserted test data:', insertData);

    // Test select operation
    const { data: selectData, error: selectError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

    if (selectError) {
        console.error('Error selecting data:', selectError);
    } else {
        console.log('Successfully selected data:', selectData);
    }
}

testSupabaseConnection();
