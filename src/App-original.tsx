import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import InvalidCharacterErrorBoundary from './components/ErrorBoundary/InvalidCharacterErrorBoundary';
import { Suspense, lazy } from 'react';

// Layout components (loaded immediately)
import DashboardLayout from './components/Layout/DashboardLayout';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900">Loading DFS Portal</p>
        <p className="text-sm text-blue-600">Please wait...</p>
      </div>
    </div>
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

// Delivery pages
const DeliveryList = lazy(() => import('./pages/Delivery/DeliveryList'));
const DeliveryForm = lazy(() => import('./pages/Delivery/DeliveryForm'));

// License pages
const LicenseList = lazy(() => import('./pages/License/LicenseList'));
const LicenseForm = lazy(() => import('./pages/License/LicenseForm'));

// HR pages
const SalaryList = lazy(() => import('./pages/Salary/SalaryList'));
const SalaryForm = lazy(() => import('./pages/Salary/SalaryForm'));
const AttendanceList = lazy(() => import('./pages/Attendance/AttendanceList'));
const AttendanceForm = lazy(() => import('./pages/Attendance/AttendanceForm'));
const BenefitsList = lazy(() => import('./pages/Benefits/BenefitsList'));
const BenefitsForm = lazy(() => import('./pages/Benefits/BenefitsForm'));

// Admin pages
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const SystemSettings = lazy(() => import('./pages/Admin/SystemSettings'));
const AuditLogs = lazy(() => import('./pages/Admin/AuditLogs'));
const DatabaseManagement = lazy(() => import('./pages/Admin/DatabaseManagement'));
const SecurityCenter = lazy(() => import('./pages/Admin/SecurityCenter'));
const AuditMonitoring = lazy(() => import('./pages/Admin/AuditMonitoring'));
const ComplianceReports = lazy(() => import('./pages/Admin/ComplianceReports'));
const DataIntegrityCheck = lazy(() => import('./pages/Admin/DataIntegrityCheck'));
const PermissionMatrix = lazy(() => import('./pages/Admin/PermissionMatrix'));
const AppSettings = lazy(() => import('./pages/Admin/AppSettings'));

// Demo and development pages
const InvalidCharacterErrorDemo = lazy(() => import('./pages/Development/InvalidCharacterErrorDemo'));

// Create a default query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <InvalidCharacterErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SupabaseAuthProvider>
            <AuthProvider>
              <TooltipProvider>
                <Router>
                  <Suspense fallback={<PageLoader />}>
                    <DashboardLayout>
                      <Routes>
                        {/* Authentication Routes */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/login-disabled" element={<LoginDisabledPage />} />
                        <Route path="/on-auth-success" element={<OnAuthSuccessPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/resetpassword" element={<ResetPasswordPage />} />

                        {/* Main Dashboard */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Product Routes */}
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/new" element={<ProductForm />} />
                        <Route path="/products/:id/edit" element={<ProductForm />} />

                        {/* Employee Routes */}
                        <Route path="/employees" element={<EmployeeList />} />
                        <Route path="/employees/new" element={<EmployeeForm />} />
                        <Route path="/employees/:id/edit" element={<EmployeeForm />} />

                        {/* Sales Routes */}
                        <Route path="/sales" element={<SalesReportList />} />
                        <Route path="/sales/new" element={<SalesReportForm />} />
                        <Route path="/sales/:id/edit" element={<SalesReportForm />} />

                        {/* Vendor Routes */}
                        <Route path="/vendors" element={<VendorList />} />
                        <Route path="/vendors/new" element={<VendorForm />} />
                        <Route path="/vendors/:id/edit" element={<VendorForm />} />

                        {/* Order Routes */}
                        <Route path="/orders" element={<OrderList />} />
                        <Route path="/orders/new" element={<OrderForm />} />
                        <Route path="/orders/:id/edit" element={<OrderForm />} />

                        {/* Delivery Routes */}
                        <Route path="/deliveries" element={<DeliveryList />} />
                        <Route path="/deliveries/new" element={<DeliveryForm />} />
                        <Route path="/deliveries/:id/edit" element={<DeliveryForm />} />

                        {/* License Routes */}
                        <Route path="/licenses" element={<LicenseList />} />
                        <Route path="/licenses/new" element={<LicenseForm />} />
                        <Route path="/licenses/:id/edit" element={<LicenseForm />} />

                        {/* HR Routes */}
                        <Route path="/hr/salary" element={<SalaryList />} />
                        <Route path="/hr/salary/new" element={<SalaryForm />} />
                        <Route path="/hr/salary/:id/edit" element={<SalaryForm />} />
                        <Route path="/hr/attendance" element={<AttendanceList />} />
                        <Route path="/hr/attendance/new" element={<AttendanceForm />} />
                        <Route path="/hr/attendance/:id/edit" element={<AttendanceForm />} />
                        <Route path="/hr/benefits" element={<BenefitsList />} />
                        <Route path="/hr/benefits/new" element={<BenefitsForm />} />
                        <Route path="/hr/benefits/:id/edit" element={<BenefitsForm />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/settings" element={<SystemSettings />} />
                        <Route path="/admin/audit" element={<AuditLogs />} />
                        <Route path="/admin/database" element={<DatabaseManagement />} />
                        <Route path="/admin/security" element={<SecurityCenter />} />
                        <Route path="/admin/monitoring" element={<AuditMonitoring />} />
                        <Route path="/admin/compliance" element={<ComplianceReports />} />
                        <Route path="/admin/integrity" element={<DataIntegrityCheck />} />
                        <Route path="/admin/permissions" element={<PermissionMatrix />} />
                        <Route path="/admin/app-settings" element={<AppSettings />} />

                        {/* Development and Demo Routes */}
                        <Route path="/demo/invalid-character-error" element={<InvalidCharacterErrorDemo />} />

                        {/* Catch all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </DashboardLayout>
                  </Suspense>
                </Router>
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </SupabaseAuthProvider>
        </QueryClientProvider>
      </InvalidCharacterErrorBoundary>
    </GlobalErrorBoundary>
  );
}

export default App;
