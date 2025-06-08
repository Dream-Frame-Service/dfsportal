import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk';

const supabase = createClient(supabaseUrl, supabaseKey);

const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('user_profiles').select('*').limit(1);
        if (error) {
            console.error('Error connecting to Supabase:', error);
        } else {
            console.log('Supabase connection successful. Data:', data);
        }
    } catch (err) {
        console.error('Exception:', err);
    }
};

// Run the test
testSupabaseConnection();
