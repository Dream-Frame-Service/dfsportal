import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Home,
  Package,
  Users,
  TrendingUp,
  Building2,
  ShoppingCart,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Fuel,
  Truck,
  Settings,
  Shield,
  Database,
  UserCheck,
  Globe,
  MessageSquare,
  Activity,
  LogOut,
  User } from
'lucide-react';

import Logo from '@/components/Logo';
import HeaderLogo from '@/components/HeaderLogo';
import { PageErrorBoundary } from '@/components/ErrorBoundary';
import { useResponsiveLayout } from '@/hooks/use-mobile';


interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  children?: NavigationItem[];
}

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useSupabaseAuth();
  const responsive = useResponsiveLayout();

  // Responsive state management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(responsive.isMobile);

  // Auto-adjust sidebar based on device
  useEffect(() => {
    if (responsive.isMobile) {
      setSidebarCollapsed(true);
      setSidebarOpen(false);
    } else if (responsive.isTablet) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [responsive.isMobile, responsive.isTablet]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="bbssoqznu" data-path="src/components/Layout/DashboardLayout.tsx">
        <div className="text-center" data-id="war3qv969" data-path="src/components/Layout/DashboardLayout.tsx">
          <Logo size="lg" className="mb-4" data-id="7wmg5hrdq" data-path="src/components/Layout/DashboardLayout.tsx" />
          <div className="text-gray-600" data-id="af951csro" data-path="src/components/Layout/DashboardLayout.tsx">Loading...</div>
        </div>
      </div>);

  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Base navigation items (available to all users)
  const baseNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" data-id="w6b41tkdr" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'All Products', path: '/products', icon: <Package className="w-5 h-5" data-id="dxry7z7e6" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'All Employees', path: '/employees', icon: <Users className="w-5 h-5" data-id="xndnl7o7f" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'Sales Reports', path: '/sales', icon: <TrendingUp className="w-5 h-5" data-id="h9tawyt3d" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'Add Report', path: '/sales/new', icon: <Plus className="w-5 h-5" data-id="5z2obvvuf" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'Salary Records', path: '/salary', icon: <DollarSign className="w-5 h-5" data-id="3orrqf8ot" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'Inventory Alerts', path: '/inventory/alerts', icon: <AlertTriangle className="w-5 h-5" data-id="kzw1fniy1" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'New Delivery', path: '/delivery', icon: <Truck className="w-5 h-5" data-id="qt97dp9u5" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'All Vendors', path: '/vendors', icon: <Building2 className="w-5 h-5" data-id="u3t517beq" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'All Orders', path: '/orders', icon: <ShoppingCart className="w-5 h-5" data-id="6ry3uqv1b" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'Create Order', path: '/orders/new', icon: <Plus className="w-5 h-5" data-id="3khim14qd" data-path="src/components/Layout/DashboardLayout.tsx" /> },
  { name: 'All Licenses', path: '/licenses', icon: <FileText className="w-5 h-5" data-id="r2a4pt9vw" data-path="src/components/Layout/DashboardLayout.tsx" /> }];


  // Admin-only navigation items
  const adminNavigationItems: NavigationItem[] = [
  { name: 'Admin Panel', path: '/admin', icon: <Settings className="w-5 h-5" data-id="8xt4z7ijl" data-path="src/components/Layout/DashboardLayout.tsx" /> }];


  // Combine navigation items based on user role
  // For now, show admin panel to all users - you can implement role-based logic later
  const navigationItems: NavigationItem[] = [
    ...baseNavigationItems,
    ...adminNavigationItems
  ];






  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = location.pathname === item.path;

    return (
      <Button
        key={item.path}
        variant="ghost"
        className={`w-full justify-start text-left h-11 hover:bg-gray-100 transition-colors px-4 ${
        isActive ? 'bg-brand-50 text-brand-800 border-r-2 border-brand-700' : ''}`
        }
        onClick={() => handleNavigation(item.path)}
        title={sidebarCollapsed ? item.name : undefined} data-id="2q87d80um" data-path="src/components/Layout/DashboardLayout.tsx">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`} data-id="1zwjj4gax" data-path="src/components/Layout/DashboardLayout.tsx">
          {item.icon}
          {!sidebarCollapsed && <span className="font-medium" data-id="uxnp0r856" data-path="src/components/Layout/DashboardLayout.tsx">{item.name}</span>}
        </div>
      </Button>);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/employees')) return 'Employees';
    if (path.startsWith('/sales')) return 'Sales Reports';
    if (path.startsWith('/salary')) return 'Salary Management';
    if (path.startsWith('/inventory')) return 'Inventory Management';
    if (path.startsWith('/delivery')) return 'Delivery Management';
    if (path.startsWith('/vendors')) return 'Vendors';
    if (path.startsWith('/orders')) return 'Orders';
    if (path.startsWith('/licenses')) return 'Licenses & Certificates';
    if (path === '/admin') return 'Admin Panel';
    if (path.startsWith('/admin/user-management')) return 'User Management';
    if (path.startsWith('/admin/site-management')) return 'Site Management';
    if (path.startsWith('/admin/sms-alert-management')) return 'SMS Alert Management';
    if (path.startsWith('/admin/system-logs')) return 'System Logs';
    if (path.startsWith('/admin/security-settings')) return 'Security Settings';
    if (path.startsWith('/admin/error-recovery')) return 'Error Recovery Center';
    if (path.startsWith('/admin/memory-monitoring')) return 'Memory Leak Monitoring';
    if (path.startsWith('/admin/database-monitoring')) return 'Database Connection Monitoring';
    if (path.startsWith('/admin/audit-monitoring')) return 'Audit & Security Monitoring';
    if (path.startsWith('/admin/database-autosync')) return 'Database Auto-Sync';
    if (path.startsWith('/admin/supabase-test')) return 'Supabase Connection Test';
    if (path.startsWith('/admin/development-monitoring')) return 'Development Monitoring';
    if (path.startsWith('/admin/role-testing')) return 'Role Testing & Customization';
    if (path.startsWith('/admin/advanced-realtime')) return 'Advanced Real-Time Features';
    if (path.startsWith('/admin')) return 'Site & User Management';
    return 'DFS Manager';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-id="m78hpzuje" data-path="src/components/Layout/DashboardLayout.tsx">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && responsive.isMobile &&
      <div className="fixed inset-0 z-40" data-id="6p2mnz0wv" data-path="src/components/Layout/DashboardLayout.tsx">
          <div className="absolute inset-0 bg-gray-600/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} data-id="bsrjv8pks" data-path="src/components/Layout/DashboardLayout.tsx" />
        </div>
      }

      {/* Sidebar - Fully responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
      responsive.isMobile ?
      sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64' :
      'translate-x-0'} ${

      !responsive.isMobile && sidebarCollapsed ? 'w-16' : !responsive.isMobile ? 'w-64' : ''}`

      } data-id="2brsxr0s4" data-path="src/components/Layout/DashboardLayout.tsx">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200 flex-shrink-0" data-id="ug07s8ehf" data-path="src/components/Layout/DashboardLayout.tsx">
          <Logo
            size={sidebarCollapsed ? 'sm' : responsive.isMobile ? 'md' : 'md'}
            showText={!sidebarCollapsed}
            className={sidebarCollapsed ? 'justify-center w-full' : ''} data-id="mkrh4cels" data-path="src/components/Layout/DashboardLayout.tsx" />

          <div className="flex items-center space-x-2" data-id="yl1omp3b7" data-path="src/components/Layout/DashboardLayout.tsx">
            {/* Minimize/Expand button for desktop/tablet */}
            {!responsive.isMobile &&
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Minimize sidebar'} data-id="tircdao9t" data-path="src/components/Layout/DashboardLayout.tsx">
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" data-id="tl6a6s3ns" data-path="src/components/Layout/DashboardLayout.tsx" /> : <ChevronLeft className="w-4 h-4" data-id="zqy3kcvg8" data-path="src/components/Layout/DashboardLayout.tsx" />}
              </Button>
            }
            {/* Close button for mobile */}
            {responsive.isMobile &&
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)} data-id="vbkakxv70" data-path="src/components/Layout/DashboardLayout.tsx">
                <X className="w-5 h-5" data-id="0wkp1nmoo" data-path="src/components/Layout/DashboardLayout.tsx" />
              </Button>
            }
          </div>
        </div>

        <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
        style={{ height: 'calc(100vh - 4rem)' }} data-id="bl4nfrkle" data-path="src/components/Layout/DashboardLayout.tsx">
          {navigationItems.map((item) => renderNavigationItem(item))}
        </nav>
      </div>

      {/* Main content - Responsive margin adjustment */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
      responsive.isMobile ?
      'ml-0' :
      sidebarCollapsed ?
      'ml-16' :
      'ml-64'}`
      } data-id="7yoq55kpx" data-path="src/components/Layout/DashboardLayout.tsx">
        {/* Top bar - Responsive */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 flex-shrink-0" data-id="y762ydjcv" data-path="src/components/Layout/DashboardLayout.tsx">
          {/* Mobile menu button */}
          {responsive.isMobile &&
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)} data-id="35ji52axt" data-path="src/components/Layout/DashboardLayout.tsx">
              <Menu className="w-5 h-5" data-id="i6jqg70za" data-path="src/components/Layout/DashboardLayout.tsx" />
            </Button>
          }
          
          {/* Page title with logo - Responsive */}
          <div className={`flex items-center ${responsive.isMobile ? 'flex-1 justify-center' : 'space-x-4'}`} data-id="ai89qjsvy" data-path="src/components/Layout/DashboardLayout.tsx">
            {/* Your actual logo in header for desktop/tablet */}
            {!responsive.isMobile &&
              <HeaderLogo 
                size="sm" 
                showText={false} 
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            }
            <h1 className={`font-semibold text-brand-900 ${
            responsive.isMobile ? 'text-lg' : 'text-xl'}`
            } data-id="h40aqmhpa" data-path="src/components/Layout/DashboardLayout.tsx">
              {responsive.isMobile ? getPageTitle().split(' ')[0] : getPageTitle()}
            </h1>
          </div>

          {/* User menu - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-4" data-id="tsu161qej" data-path="src/components/Layout/DashboardLayout.tsx">
            {!responsive.isMobile &&
            <span className="text-sm text-gray-600" data-id="xpmm8zh9k" data-path="src/components/Layout/DashboardLayout.tsx">
                Welcome, {user.email}
              </span>
            }
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-600 hover:text-red-600" data-id="tkx0t0bur" data-path="src/components/Layout/DashboardLayout.tsx">
              <LogOut className="w-4 h-4 sm:mr-2" data-id="epj2w8zvt" data-path="src/components/Layout/DashboardLayout.tsx" />
              {!responsive.isMobile && <span data-id="as13dy93q" data-path="src/components/Layout/DashboardLayout.tsx">Logout</span>}
            </Button>
          </div>
        </div>

        {/* Page content - Responsive padding */}
        <main className={`flex-1 overflow-y-auto ${
        responsive.isMobile ?
        'p-3' :
        responsive.isTablet ?
        'p-4' :
        'p-6 lg:p-8'}`
        } data-id="m3jim0193" data-path="src/components/Layout/DashboardLayout.tsx">
          <div className={`space-y-4 sm:space-y-6 max-w-full ${
          responsive.isDesktop ? 'container mx-auto' : ''}`
          } data-id="gltz776g6" data-path="src/components/Layout/DashboardLayout.tsx">
            <PageErrorBoundary pageName={getPageTitle()} data-id="ss6en3ngh" data-path="src/components/Layout/DashboardLayout.tsx">
              <Outlet data-id="o7q11fq0w" data-path="src/components/Layout/DashboardLayout.tsx" />
            </PageErrorBoundary>
          </div>
        </main>
      </div>
    </div>);

};

export default DashboardLayout;
