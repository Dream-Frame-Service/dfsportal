const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk';
const supabase = createClient(supabaseUrl, supabaseKey);
async function testSupabaseConnection() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error('Error connecting to Supabase:', error);
    }
    else {
        console.log('Supabase connection successful. Data:', data);
    }
}
testSupabaseConnection();
