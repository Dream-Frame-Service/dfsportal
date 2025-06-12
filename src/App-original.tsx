import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/comp                      
                      <Route path="*" element={<NotFound data-id="ji4dojk4b" data-path="src/App.tsx" />} data-id="8o55mvfg2" data-path="src/App.tsx" />
                    </Routes>
                  </Suspense>
                </Router>
                <Toaster data-id="4zc2ut5go" data-path="src/App.tsx" />
              </TooltipProvider>
            </DemoAuthProvider>
        </QueryClientProvider>
      </InvalidCharacterErrorBoundary>
    </GlobalErrorBoundary>
  );
}tip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DemoAuthProvider } from './contexts/DemoAuthContext';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import InvalidCharacterErrorBoundary from './components/ErrorBoundary/InvalidCharacterErrorBoundary';
import { Suspense, lazy } from 'react';

// Layout components (loaded immediately)
import DemoDashboardLayout from './components/Layout/DemoDashboardLayout';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load all page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const LoginDisabledPage = lazy(() => import('./pages/LoginDisabledPage'));
const OnAuthSuccessPage = lazy(() => import('./pages/OnAuthSuccessPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

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

const queryClient = new QueryClient();

function App() {
  return (
    <GlobalErrorBoundary data-id="rhvqlyp7i" data-path="src/App.tsx">
      <InvalidCharacterErrorBoundary data-id="1eigqonnd" data-path="src/App.tsx">
        <QueryClientProvider client={queryClient} data-id="tc4ddtbq9" data-path="src/App.tsx">
          <DemoAuthProvider data-id="t55psw9bt" data-path="src/App.tsx">
            <TooltipProvider data-id="j7l3kdmaj" data-path="src/App.tsx">
              <Router data-id="oprl0yk0e" data-path="src/App.tsx">
                <Suspense fallback={<PageLoader />}>
                  <Routes data-id="2g8tmrz0u" data-path="src/App.tsx">
                    {/* Demo routes - no authentication required */}
                    <Route path="/" element={<DemoDashboardLayout data-id="zjyfkhhow" data-path="src/App.tsx" />} data-id="qe5e3l9wg" data-path="src/App.tsx">
                      <Route index element={<Navigate to="/dashboard" replace data-id="l5ryk1kr6" data-path="src/App.tsx" />} data-id="bhl8z2uwf" data-path="src/App.tsx" />
                      <Route path="dashboard" element={<Dashboard data-id="31fh7o19j" data-path="src/App.tsx" />} data-id="rl9fokjk6" data-path="src/App.tsx" />
                        
                        {/* Products routes */}
                        <Route path="products" element={<ProductList data-id="8lcwdu6mp" data-path="src/App.tsx" />} data-id="rvwvo0san" data-path="src/App.tsx" />
                        <Route path="products/new" element={<ProductForm data-id="0mr7tgjp0" data-path="src/App.tsx" />} data-id="9i6fc6b1i" data-path="src/App.tsx" />
                        <Route path="products/edit/:id" element={<ProductForm data-id="khh3rk5oc" data-path="src/App.tsx" />} data-id="gqjbkzw10" data-path="src/App.tsx" />
                        
                        {/* Employees routes */}
                        <Route path="employees" element={<EmployeeList data-id="qmtkl199s" data-path="src/App.tsx" />} data-id="2iixpu257" data-path="src/App.tsx" />
                        <Route path="employees/new" element={<EmployeeForm data-id="a3rbznvhe" data-path="src/App.tsx" />} data-id="nitnfo7gb" data-path="src/App.tsx" />
                        <Route path="employees/edit/:id" element={<EmployeeForm data-id="48u1thwbu" data-path="src/App.tsx" />} data-id="atj1pxpw8" data-path="src/App.tsx" />
                        
                        {/* Sales routes */}
                        <Route path="sales" element={<SalesReportList data-id="ux5reg5sc" data-path="src/App.tsx" />} data-id="kujm8xbq2" data-path="src/App.tsx" />
                        <Route path="sales/new" element={<SalesReportForm data-id="up53p9nrs" data-path="src/App.tsx" />} data-id="fcyubdas9" data-path="src/App.tsx" />
                        <Route path="sales/edit/:id" element={<SalesReportForm data-id="c323zqwqx" data-path="src/App.tsx" />} data-id="sb3iqqo7l" data-path="src/App.tsx" />
                        
                        {/* Vendors routes */}
                        <Route path="vendors" element={<VendorList data-id="hrhxoz3dz" data-path="src/App.tsx" />} data-id="oxn3qspdc" data-path="src/App.tsx" />
                        <Route path="vendors/new" element={<VendorForm data-id="gvg8ixwcx" data-path="src/App.tsx" />} data-id="yerse7jcz" data-path="src/App.tsx" />
                        <Route path="vendors/edit/:id" element={<VendorForm data-id="kwq8dj6a4" data-path="src/App.tsx" />} data-id="l9c1brn92" data-path="src/App.tsx" />
                        
                        {/* Orders routes */}
                        <Route path="orders" element={<OrderList data-id="lgcser0dq" data-path="src/App.tsx" />} data-id="4s6h3tuwy" data-path="src/App.tsx" />
                        <Route path="orders/new" element={<OrderForm data-id="6xwg2nbrx" data-path="src/App.tsx" />} data-id="9mj2xjrx4" data-path="src/App.tsx" />
                        <Route path="orders/edit/:id" element={<OrderForm data-id="14q4kx1pi" data-path="src/App.tsx" />} data-id="gvr7zg69y" data-path="src/App.tsx" />
                        
                        {/* Licenses routes */}
                        <Route path="licenses" element={<LicenseList data-id="hoz0d5e2n" data-path="src/App.tsx" />} data-id="3nhxaoyt4" data-path="src/App.tsx" />
                        <Route path="licenses/new" element={<LicenseForm data-id="006pnnuet" data-path="src/App.tsx" />} data-id="kheioazn2" data-path="src/App.tsx" />
                        <Route path="licenses/edit/:id" element={<LicenseForm data-id="p1xzoakbg" data-path="src/App.tsx" />} data-id="texbifiam" data-path="src/App.tsx" />
                        
                        {/* Salary routes */}
                        <Route path="salary" element={<SalaryList data-id="nbfkddgwc" data-path="src/App.tsx" />} data-id="nqnjfioeo" data-path="src/App.tsx" />
                        <Route path="salary/new" element={<SalaryForm data-id="nl2fo230e" data-path="src/App.tsx" />} data-id="sv2nsl2gq" data-path="src/App.tsx" />
                        <Route path="salary/:id" element={<SalaryForm data-id="cnfqr55k3" data-path="src/App.tsx" />} data-id="unpang9yr" data-path="src/App.tsx" />
                        <Route path="salary/:id/edit" element={<SalaryForm data-id="pfn2jn7km" data-path="src/App.tsx" />} data-id="az3dhaxtd" data-path="src/App.tsx" />
                        
                        {/* Inventory routes */}
                        <Route path="inventory/alerts" element={<InventoryAlerts data-id="ua4nsftnc" data-path="src/App.tsx" />} data-id="yq8y4srcx" data-path="src/App.tsx" />
                        <Route path="inventory/settings" element={<AppSettings data-id="vk491aqu1" data-path="src/App.tsx" />} data-id="ikhih3pl0" data-path="src/App.tsx" />
                        
                        {/* Gas Delivery routes */}
                        <Route path="gas-delivery" element={<GasDeliveryInventory data-id="pii4n8can" data-path="src/App.tsx" />} data-id="dzodn7oj5" data-path="src/App.tsx" />
                        
                        {/* Delivery routes */}
                        <Route path="delivery" element={<DeliveryList data-id="e7rbndf9y" data-path="src/App.tsx" />} data-id="6635tw5yc" data-path="src/App.tsx" />
                        <Route path="delivery/new" element={<DeliveryForm data-id="nqztykcnu" data-path="src/App.tsx" />} data-id="8z3pz75na" data-path="src/App.tsx" />
                        <Route path="delivery/edit/:id" element={<DeliveryForm data-id="gc2t4qf9f" data-path="src/App.tsx" />} data-id="a3cnon94p" data-path="src/App.tsx" />
                        
                        {/* Admin routes */}
                        <Route path="admin" element={<AdminPanel data-id="iry4mlfvi" data-path="src/App.tsx" />} data-id="2j2qcrv2f" data-path="src/App.tsx" />
                        <Route path="admin/dashboard" element={<AdminDashboard data-id="lyhzm8bpz" data-path="src/App.tsx" />} data-id="iaommuoy1" data-path="src/App.tsx" />
                        <Route path="admin/user-management" element={<UserManagement data-id="rw0yq168j" data-path="src/App.tsx" />} data-id="tg0c09whp" data-path="src/App.tsx" />
                        <Route path="admin/site-management" element={<SiteManagement data-id="l99h65y3q" data-path="src/App.tsx" />} data-id="ighv11fwc" data-path="src/App.tsx" />
                        <Route path="admin/system-logs" element={<SystemLogs data-id="7jmbf1tlr" data-path="src/App.tsx" />} data-id="a6j28l3hg" data-path="src/App.tsx" />
                        <Route path="admin/security-settings" element={<SecuritySettings data-id="1b14jo1ik" data-path="src/App.tsx" />} data-id="w9klprtb2" data-path="src/App.tsx" />
                        <Route path="admin/sms-alert-management" element={<SMSAlertManagement data-id="wcdjxh6b4" data-path="src/App.tsx" />} data-id="aspyxid7a" data-path="src/App.tsx" />
                        <Route path="admin/error-recovery" element={<ErrorRecoveryPage data-id="70tvu2bq3" data-path="src/App.tsx" />} data-id="igh0wt5zy" data-path="src/App.tsx" />
                        <Route path="admin/memory-monitoring" element={<MemoryMonitoring data-id="2p9rruufb" data-path="src/App.tsx" />} data-id="tcffvzwcv" data-path="src/App.tsx" />
                        <Route path="admin/database-monitoring" element={<DatabaseMonitoring data-id="vu7cl3tik" data-path="src/App.tsx" />} data-id="au4i627fo" data-path="src/App.tsx" />
                        <Route path="admin/audit-monitoring" element={<AuditMonitoring data-id="vi4ezyx04" data-path="src/App.tsx" />} data-id="3syhjb28w" data-path="src/App.tsx" />
                        <Route path="admin/database-autosync" element={<DatabaseAutoSyncPage data-id="101lgf8po" data-path="src/App.tsx" />} data-id="8xvbn1s9t" data-path="src/App.tsx" />
                        <Route path="admin/supabase-test" element={<SupabaseConnectionTestPage data-id="gewgeb48o" data-path="src/App.tsx" />} data-id="8v67jrysn" data-path="src/App.tsx" />
                        <Route path="admin/development-monitoring" element={<DevelopmentMonitoringPage data-id="9d5cohjl0" data-path="src/App.tsx" />} data-id="hczq096m7" data-path="src/App.tsx" />
                        <Route path="admin/role-testing" element={<RoleTestingPage data-id="jjuhq2n2f" data-path="src/App.tsx" />} data-id="ql1afhmsd" data-path="src/App.tsx" />
                        <Route path="admin/advanced-realtime" element={<AdvancedRealTimeFeatures data-id="xweh7nd7p" data-path="src/App.tsx" />} data-id="xiytml6mt" data-path="src/App.tsx" />
                        <Route path="admin/s3-storage" element={<S3StorageManager />} />
                        <Route path="admin/invalid-character-demo" element={<InvalidCharacterErrorDemo data-id="fde5j3qek" data-path="src/App.tsx" />} data-id="is4j177lj" data-path="src/App.tsx" />
                      </Route>
                      
                      <Route path="*" element={<NotFound data-id="ji4dojk4b" data-path="src/App.tsx" />} data-id="8o55mvfg2" data-path="src/App.tsx" />
                    </Routes>
                  </Suspense>
                </Router>
                <Toaster data-id="4zc2ut5go" data-path="src/App.tsx" />
              </TooltipProvider>
            </AuthProvider>
          </SupabaseAuthProvider>
        </QueryClientProvider>
      </InvalidCharacterErrorBoundary>
    </GlobalErrorBoundary>
  );
}

export default App;