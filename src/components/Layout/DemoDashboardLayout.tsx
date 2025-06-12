import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Fuel,
  Truck,
  Settings,
  Shield,
  Database,
  UserCheck,
  Globe,
  MessageSquare,
  Activity,
  User,
  Eye,
  Code2
} from 'lucide-react';

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

const DemoDashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isMobile } = useResponsiveLayout();

  // Demo user data
  const demoUser = {
    email: 'demo@dfs-portal.com',
    user_metadata: {
      full_name: 'Demo Administrator'
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      name: 'Products',
      path: '/products',
      icon: <Package className="w-5 h-5" />
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Sales Reports',
      path: '/sales',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      name: 'Vendors',
      path: '/vendors',
      icon: <Building2 className="w-5 h-5" />
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      name: 'Licenses',
      path: '/licenses',
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: 'Salary',
      path: '/salary',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      name: 'Inventory',
      path: '/inventory/alerts',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      name: 'Gas Delivery',
      path: '/gas-delivery',
      icon: <Fuel className="w-5 h-5" />
    },
    {
      name: 'Delivery',
      path: '/delivery',
      icon: <Truck className="w-5 h-5" />
    },
    {
      name: 'Admin Panel',
      path: '/admin',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Demo Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 shadow-lg">
        <div className="flex items-center justify-center space-x-2 text-sm font-medium">
          <Eye className="w-4 h-4" />
          <span>DEMO MODE - Development Preview</span>
          <Code2 className="w-4 h-4" />
          <span className="ml-4 text-blue-200">All features enabled • No authentication required</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg flex flex-col mt-12`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <Logo className="w-8 h-8" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">DFS Portal</h1>
                  <p className="text-xs text-blue-600 font-medium">DEMO MODE</p>
                </div>
              </div>
            ) : (
              <Logo className="w-8 h-8 mx-auto" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActiveRoute(item.path) ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen ? 'px-2' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Button>
          ))}
        </nav>

        {/* Demo User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${!sidebarOpen ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Demo Admin</p>
                <p className="text-xs text-blue-600 truncate">demo@dfs-portal.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-12">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {navigationItems.find(item => isActiveRoute(item.path))?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-blue-600">Development Preview Mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700 font-medium">All Systems Operational</span>
              </div>
              
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                <Eye className="w-4 h-4 mr-2" />
                Preview Mode
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <PageErrorBoundary>
            <Outlet />
          </PageErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DemoDashboardLayout;
