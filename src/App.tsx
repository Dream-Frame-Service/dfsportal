import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { GlobalErrorBoundary } from '@/components/ErrorBoundary';
import { GlobalFallback } from '@/components/GlobalFallback';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const ResetPasswordPage = React.lazy(() => import('@/pages/ResetPasswordPage'));

// Admin pages
const AdminPanel = React.lazy(() => import('@/pages/Admin/AdminPanel'));
const AdminDashboard = React.lazy(() => import('@/pages/Admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('@/pages/Admin/UserManagement'));
const SystemLogs = React.lazy(() => import('@/pages/Admin/SystemLogs'));

// Business pages
const ProductList = React.lazy(() => import('@/pages/Products/ProductList'));
const ProductForm = React.lazy(() => import('@/pages/Products/ProductForm'));
const SalesReportList = React.lazy(() => import('@/pages/Sales/SalesReportList'));
const SalesReportForm = React.lazy(() => import('@/pages/Sales/SalesReportForm'));
const EmployeeList = React.lazy(() => import('@/pages/Employees/EmployeeList'));
const EmployeeForm = React.lazy(() => import('@/pages/Employees/EmployeeForm'));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (failureCount < 2) return true;
        return false;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// App initialization hook
const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing DFS Manager Portal...');
        
        // Check environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase configuration');
        }
        
        console.log('✅ Environment variables validated');
        console.log('✅ Supabase configuration found');
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
        
        // Add app-loaded class to body
        document.body.classList.add('app-loaded');
        
        setIsInitialized(true);
        console.log('✅ App initialization complete');
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
      }
    };

    initializeApp();
  }, []);

  return { isInitialized, initError };
};

// Main App Component
const App: React.FC = () => {
  const { isInitialized, initError } = useAppInitialization();

  // Show error if initialization failed
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Initialization Error</h1>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  // Show loading while initializing
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <GlobalErrorBoundary fallback={GlobalFallback}>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/resetpassword" element={<ResetPasswordPage />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="Administrator">
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="Administrator">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="Administrator">
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/logs" element={
                    <ProtectedRoute requiredRole="Administrator">
                      <SystemLogs />
                    </ProtectedRoute>
                  } />
                  
                  {/* Business routes */}
                  <Route path="/products" element={
                    <ProtectedRoute>
                      <ProductList />
                    </ProtectedRoute>
                  } />
                  <Route path="/products/new" element={
                    <ProtectedRoute>
                      <ProductForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/products/edit/:id" element={
                    <ProtectedRoute>
                      <ProductForm />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales" element={
                    <ProtectedRoute>
                      <SalesReportList />
                    </ProtectedRoute>
                  } />
                  <Route path="/sales/new" element={
                    <ProtectedRoute>
                      <SalesReportForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/sales/edit/:id" element={
                    <ProtectedRoute>
                      <SalesReportForm />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/employees" element={
                    <ProtectedRoute>
                      <EmployeeList />
                    </ProtectedRoute>
                  } />
                  <Route path="/employees/new" element={
                    <ProtectedRoute>
                      <EmployeeForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/employees/edit/:id" element={
                    <ProtectedRoute>
                      <EmployeeForm />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              
              {/* Global components */}
              <Toaster />
            </div>
          </Router>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
