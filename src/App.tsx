import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DemoAuthProvider } from './contexts/DemoAuthContext';
import { GlobalErrorBoundary, InvalidCharacterErrorBoundary } from './components/ErrorBoundary';
import { Suspense, lazy } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

// Layout components (loaded immediately)
import DemoDashboardLayout from './components/Layout/DemoDashboardLayout';

// Loading component with better error handling
const PageLoader = () => {
  console.log('🔄 PageLoader rendering...');
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-pulse mx-auto"></div>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">DFS Manager Portal</h2>
          <p className="text-lg text-blue-600 font-medium">Loading Application...</p>
          <p className="text-sm text-gray-600">Demo Mode - Development Environment</p>
          <div className="flex justify-center items-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lazy load all page components with error handling
const Dashboard = lazy(() => 
  import('./pages/Dashboard').catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Failed to Load Dashboard</h2>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    )
  }))
);

const NotFound = lazy(() => 
  import('./pages/NotFound').catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
        <button 
          onClick={() => window.location.href = '/'} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    )
  }))
);

// Product pages
const ProductList = lazy(() => import('./pages/Products/ProductList'));
const ProductForm = lazy(() => import('./pages/Products/ProductForm'));

// Employee pages
const EmployeeList = lazy(() => import('./pages/Employees/EmployeeList'));
const EmployeeForm = lazy(() => import('./pages/Employees/EmployeeForm'));

// Sales pages
const SalesReportList = lazy(() => import('./pages/Sales/SalesReportList'));
const SalesReportForm = lazy(() => import('./pages/Sales/SalesReportForm'));

// Vendor pages
const VendorList = lazy(() => import('./pages/Vendors/VendorList'));
const VendorForm = lazy(() => import('./pages/Vendors/VendorForm'));

// Order pages
const OrderList = lazy(() => import('./pages/Orders/OrderList'));
const OrderForm = lazy(() => import('./pages/Orders/OrderForm'));

// License pages
const LicenseList = lazy(() => import('./pages/Licenses/LicenseList'));
const LicenseForm = lazy(() => import('./pages/Licenses/LicenseForm'));

// Salary pages
const SalaryList = lazy(() => import('./pages/Salary/SalaryList'));
const SalaryForm = lazy(() => import('./pages/Salary/SalaryForm'));

// Inventory pages
const InventoryAlerts = lazy(() => import('./pages/Inventory/InventoryAlerts'));

// Gas Delivery
const GasDeliveryInventory = lazy(() => import('./pages/Inventory/GasDeliveryInventory'));

// Delivery pages
const DeliveryList = lazy(() => import('./pages/Delivery/DeliveryList'));
const DeliveryForm = lazy(() => import('./pages/Delivery/DeliveryForm'));

// Settings
const AppSettings = lazy(() => import('./pages/Settings/AppSettings'));

// Admin pages (heavy - lazy load)
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const SiteManagement = lazy(() => import('./pages/Admin/SiteManagement'));
const SystemLogs = lazy(() => import('./pages/Admin/SystemLogs'));
const SecuritySettings = lazy(() => import('./pages/Admin/SecuritySettings'));
const SMSAlertManagement = lazy(() => import('./pages/Admin/SMSAlertManagement'));
const ErrorRecoveryPage = lazy(() => import('./pages/Admin/ErrorRecoveryPage'));
const MemoryMonitoring = lazy(() => import('./pages/Admin/MemoryMonitoring'));
const DatabaseMonitoring = lazy(() => import('./pages/Admin/DatabaseMonitoring'));
const AuditMonitoring = lazy(() => import('./pages/Admin/AuditMonitoring'));
const DatabaseAutoSyncPage = lazy(() => import('./pages/Admin/DatabaseAutoSync'));
const SupabaseConnectionTestPage = lazy(() => import('./pages/Admin/SupabaseConnectionTest'));
const DevelopmentMonitoringPage = lazy(() => import('./pages/Admin/DevelopmentMonitoring'));
const RoleTestingPage = lazy(() => import('./pages/Admin/RoleTestingPage'));
const AdvancedRealTimeFeatures = lazy(() => import('./pages/Admin/AdvancedRealTimeFeatures'));

// Heavy components
const S3StorageManager = lazy(() => import('./components/S3StorageManager').then(module => ({ default: module.S3StorageManager })));
const InvalidCharacterErrorDemo = lazy(() => import('./components/InvalidCharacterErrorDemo'));

// Create a query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.log(`Query failed ${failureCount} times:`, error);
        return failureCount < 2; // Retry up to 2 times
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <InvalidCharacterErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <DemoAuthProvider>
            <TooltipProvider>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Demo routes - no authentication required */}
                    <Route path="/" element={<DemoDashboardLayout />}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      
                      {/* Products routes */}
                      <Route path="products" element={<ProductList />} />
                      <Route path="products/new" element={<ProductForm />} />
                      <Route path="products/edit/:id" element={<ProductForm />} />
                      
                      {/* Employees routes */}
                      <Route path="employees" element={<EmployeeList />} />
                      <Route path="employees/new" element={<EmployeeForm />} />
                      <Route path="employees/edit/:id" element={<EmployeeForm />} />
                      
                      {/* Sales routes */}
                      <Route path="sales" element={<SalesReportList />} />
                      <Route path="sales/new" element={<SalesReportForm />} />
                      <Route path="sales/edit/:id" element={<SalesReportForm />} />
                      
                      {/* Vendors routes */}
                      <Route path="vendors" element={<VendorList />} />
                      <Route path="vendors/new" element={<VendorForm />} />
                      <Route path="vendors/edit/:id" element={<VendorForm />} />
                      
                      {/* Orders routes */}
                      <Route path="orders" element={<OrderList />} />
                      <Route path="orders/new" element={<OrderForm />} />
                      <Route path="orders/edit/:id" element={<OrderForm />} />
                      
                      {/* Licenses routes */}
                      <Route path="licenses" element={<LicenseList />} />
                      <Route path="licenses/new" element={<LicenseForm />} />
                      <Route path="licenses/edit/:id" element={<LicenseForm />} />
                      
                      {/* Salary routes */}
                      <Route path="salary" element={<SalaryList />} />
                      <Route path="salary/new" element={<SalaryForm />} />
                      <Route path="salary/:id" element={<SalaryForm />} />
                      <Route path="salary/:id/edit" element={<SalaryForm />} />
                      
                      {/* Inventory routes */}
                      <Route path="inventory/alerts" element={<InventoryAlerts />} />
                      <Route path="inventory/settings" element={<AppSettings />} />
                      
                      {/* Gas Delivery routes */}
                      <Route path="gas-delivery" element={<GasDeliveryInventory />} />
                      
                      {/* Delivery routes */}
                      <Route path="delivery" element={<DeliveryList />} />
                      <Route path="delivery/new" element={<DeliveryForm />} />
                      <Route path="delivery/edit/:id" element={<DeliveryForm />} />
                      
                      {/* Admin routes */}
                      <Route path="admin" element={<AdminPanel />} />
                      <Route path="admin/dashboard" element={<AdminDashboard />} />
                      <Route path="admin/user-management" element={<UserManagement />} />
                      <Route path="admin/site-management" element={<SiteManagement />} />
                      <Route path="admin/system-logs" element={<SystemLogs />} />
                      <Route path="admin/security-settings" element={<SecuritySettings />} />
                      <Route path="admin/sms-alert-management" element={<SMSAlertManagement />} />
                      <Route path="admin/error-recovery" element={<ErrorRecoveryPage />} />
                      <Route path="admin/memory-monitoring" element={<MemoryMonitoring />} />
                      <Route path="admin/database-monitoring" element={<DatabaseMonitoring />} />
                      <Route path="admin/audit-monitoring" element={<AuditMonitoring />} />
                      <Route path="admin/database-autosync" element={<DatabaseAutoSyncPage />} />
                      <Route path="admin/supabase-test" element={<SupabaseConnectionTestPage />} />
                      <Route path="admin/development-monitoring" element={<DevelopmentMonitoringPage />} />
                      <Route path="admin/role-testing" element={<RoleTestingPage />} />
                      <Route path="admin/advanced-realtime" element={<AdvancedRealTimeFeatures />} />
                      <Route path="admin/s3-storage" element={<S3StorageManager />} />
                      <Route path="admin/invalid-character-demo" element={<InvalidCharacterErrorDemo />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Router>
              <Toaster />
              <SpeedInsights />
              <Analytics />
            </TooltipProvider>
          </DemoAuthProvider>
        </QueryClientProvider>
      </InvalidCharacterErrorBoundary>
    </GlobalErrorBoundary>
  );
}

export default App;
