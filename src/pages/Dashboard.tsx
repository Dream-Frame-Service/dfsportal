import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Add formatCurrency function
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

interface DebugInfo {
  supabaseUrl: string;
  hasAnonKey: boolean;
  authStatus: string;
  networkRequests: Array<{
    type: string;
    success: boolean;
    timestamp: string;
    error?: any;
  }>;
  rlsError: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: '',
    hasAnonKey: false,
    authStatus: 'checking',
    networkRequests: [],
    rlsError: null
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check Supabase configuration
    const checkSupabaseConfig = () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('🔧 Supabase Configuration Check:');
      console.log('URL:', url ? `${url.substring(0, 30)}...` : 'NOT SET');
      console.log('Anon Key:', anonKey ? 'SET' : 'NOT SET');
      
      setDebugInfo(prev => ({
        ...prev,
        supabaseUrl: url || 'NOT SET',
        hasAnonKey: !!anonKey
      }));

      if (!url || !anonKey) {
        setError('Supabase environment variables are not properly configured');
        setLoading(false);
        return false;
      }
      return true;
    };

    // Check authentication and fetch data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check config first
        if (!checkSupabaseConfig()) {
          return;
        }

        // Get current session
        console.log('🔐 Checking authentication...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        console.log('📊 Session status:', session ? 'Active' : 'No session');
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        setDebugInfo(prev => ({
          ...prev,
          authStatus: user ? 'authenticated' : 'not authenticated',
          networkRequests: [...prev.networkRequests, {
            type: 'auth.getUser',
            success: !userError,
            timestamp: new Date().toISOString()
          }]
        }));

        if (userError) {
          console.error('❌ Error fetching user:', userError);
          throw userError;
        }

        if (!user) {
          console.log('🚪 No user found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('✅ User authenticated:', user.id);
        setUser(user);

        // Test RLS by fetching profile
        console.log('📝 Fetching user profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setDebugInfo(prev => ({
          ...prev,
          networkRequests: [...prev.networkRequests, {
            type: 'profiles.select',
            success: !profileError,
            error: profileError?.message,
            timestamp: new Date().toISOString()
          }]
        }));

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          
          // Check for RLS error
          if (profileError.message?.includes('policy')) {
            setDebugInfo(prev => ({
              ...prev,
              rlsError: 'Row Level Security (RLS) policy may be blocking access to profiles table'
            }));
          }
          
          // If profile doesn't exist, create one
          if (profileError.code === 'PGRST116') {
            console.log('📝 Profile not found, creating new profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  updated_at: new Date().toISOString()
                }
              ])
              .select()
              .single();

            setDebugInfo(prev => ({
              ...prev,
              networkRequests: [...prev.networkRequests, {
                type: 'profiles.insert',
                success: !createError,
                error: createError?.message,
                timestamp: new Date().toISOString()
              }]
            }));

            if (createError) {
              console.error('❌ Error creating profile:', createError);
              if (createError.message?.includes('policy')) {
                setDebugInfo(prev => ({
                  ...prev,
                  rlsError: 'RLS policy is blocking profile creation. Check INSERT policy for profiles table.'
                }));
              }
              throw createError;
            }
            setProfile(newProfile);
            console.log('✅ Profile created successfully');
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
          console.log('✅ Profile fetched successfully');
        }

        // Test other table access
        console.log('🧪 Testing access to other tables...');
        const tables = ['chats', 'messages', 'wisdom'];
        for (const table of tables) {
          try {
            const { error: tableError } = await supabase
              .from(table)
              .select('id')
              .limit(1);
            
            setDebugInfo(prev => ({
              ...prev,
              networkRequests: [...prev.networkRequests, {
                type: `${table}.select`,
                success: !tableError,
                error: tableError?.message,
                timestamp: new Date().toISOString()
              }]
            }));

            if (tableError?.message?.includes('policy')) {
              console.warn(`⚠️ RLS issue with ${table} table:`, tableError.message);
            }
          } catch (err) {
            console.error(`❌ Error testing ${table} table:`, err);
          }
        }

      } catch (err) {
        console.error('❌ Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Check console for details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchDashboardData();
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Initial fetch
    fetchDashboardData();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-red-500 mb-4">Error: {error}</p>
          
          {/* Debug information for error state */}
          <div className="bg-gray-100 p-4 rounded text-left mb-4">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Supabase URL:</strong> {debugInfo.supabaseUrl}</p>
              <p><strong>Anon Key:</strong> {debugInfo.hasAnonKey ? 'Present' : 'Missing'}</p>
              <p><strong>Auth Status:</strong> {debugInfo.authStatus}</p>
              {debugInfo.rlsError && (
                <p className="text-red-600"><strong>RLS Error:</strong> {debugInfo.rlsError}</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Enhanced debug information */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Debug Info:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">User Info:</h3>
            <p className="text-sm">User ID: {user?.id}</p>
            <p className="text-sm">Email: {user?.email}</p>
            <p className="text-sm">Auth Status: {debugInfo.authStatus}</p>
          </div>
          <div>
            <h3 className="font-medium">Supabase Config:</h3>
            <p className="text-sm">URL: {debugInfo.supabaseUrl?.substring(0, 30)}...</p>
            <p className="text-sm">Anon Key: {debugInfo.hasAnonKey ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium">Profile Data:</h3>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Network Requests:</h3>
          <div className="space-y-1 text-xs">
            {debugInfo.networkRequests.map((req, i) => (
              <div key={i} className={`p-1 ${req.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {req.timestamp}: {req.type} - {req.success ? '✅ Success' : `❌ Failed: ${req.error}`}
              </div>
            ))}
          </div>
        </div>

        {debugInfo.rlsError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700 font-medium">⚠️ RLS Policy Issue Detected:</p>
            <p className="text-red-600 text-sm">{debugInfo.rlsError}</p>
          </div>
        )}
      </div>

      {/* Your dashboard content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add your dashboard widgets/components */}
      </div>
    </div>
  );
};

export default Dashboard;