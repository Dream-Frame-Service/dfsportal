import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3, Users, Package, FileText, Truck, Settings,
  DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Shield, Eye, Plus, Edit, Download, Bell, Zap, Calendar } from
'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedRoleAccess } from '@/hooks/use-enhanced-role-access';
import { useNavigate } from 'react-router-dom';

interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
  actionPath?: string;
  actionLabel?: string;
  requiredPermission?: string;
}

const RoleBasedDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const roleAccess = useEnhancedRoleAccess();
  const navigate = useNavigate();

  const getAdministratorWidgets = (): DashboardWidget[] => [
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Overall system performance and monitoring',
    icon: <Zap className="h-6 w-6" data-id="09obquoni" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '98.5%',
    change: '+2.1%',
    trend: 'up',
    color: 'bg-green-500',
    actionPath: '/admin/monitoring',
    actionLabel: 'View Details'
  },
  {
    id: 'user-management',
    title: 'Active Users',
    description: 'Total system users and access levels',
    icon: <Users className="h-6 w-6" data-id="djccwcgr4" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '24',
    change: '+3',
    trend: 'up',
    color: 'bg-blue-500',
    actionPath: '/admin/user-management',
    actionLabel: 'Manage Users'
  },
  {
    id: 'security-alerts',
    title: 'Security Alerts',
    description: 'Active security notifications',
    icon: <Shield className="h-6 w-6" data-id="lg2ey3dki" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '2',
    change: '-1',
    trend: 'down',
    color: 'bg-yellow-500',
    actionPath: '/admin/security',
    actionLabel: 'Review Alerts'
  },
  {
    id: 'revenue-overview',
    title: 'Total Revenue',
    description: 'All stations combined revenue',
    icon: <DollarSign className="h-6 w-6" data-id="msq4jrmfx" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '$48,250',
    change: '+12.3%',
    trend: 'up',
    color: 'bg-green-600',
    actionPath: '/sales',
    actionLabel: 'View Reports'
  },
  {
    id: 'station-status',
    title: 'Station Status',
    description: 'Operational status across all stations',
    icon: <CheckCircle className="h-6 w-6" data-id="62qvyn6lo" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '3/3',
    change: 'All Online',
    trend: 'up',
    color: 'bg-green-500',
    actionPath: '/admin/site-management',
    actionLabel: 'Manage Stations'
  },
  {
    id: 'license-alerts',
    title: 'License Alerts',
    description: 'Expiring licenses and certificates',
    icon: <Bell className="h-6 w-6" data-id="qpadzfb80" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '4',
    change: '2 expiring soon',
    trend: 'neutral',
    color: 'bg-orange-500',
    actionPath: '/licenses',
    actionLabel: 'Review Licenses'
  }];


  const getManagementWidgets = (): DashboardWidget[] => [
  {
    id: 'daily-sales',
    title: 'Today\'s Sales',
    description: 'Current day sales performance',
    icon: <DollarSign className="h-6 w-6" data-id="esy3tnwp4" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '$12,450',
    change: '+8.2%',
    trend: 'up',
    color: 'bg-green-500',
    actionPath: '/sales',
    actionLabel: 'View Details'
  },
  {
    id: 'employee-overview',
    title: 'Active Employees',
    description: 'Currently working staff',
    icon: <Users className="h-6 w-6" data-id="ts46jqql1" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '12',
    change: '8 on duty',
    trend: 'neutral',
    color: 'bg-blue-500',
    actionPath: '/employees',
    actionLabel: 'Manage Staff'
  },
  {
    id: 'inventory-status',
    title: 'Inventory Alerts',
    description: 'Low stock and reorder notifications',
    icon: <Package className="h-6 w-6" data-id="ea6k632n4" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '6',
    change: '3 critical',
    trend: 'neutral',
    color: 'bg-yellow-500',
    actionPath: '/inventory/alerts',
    actionLabel: 'Check Inventory'
  },
  {
    id: 'fuel-levels',
    title: 'Fuel Inventory',
    description: 'Current fuel tank levels',
    icon: <Truck className="h-6 w-6" data-id="3bt7np94x" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '85%',
    change: 'Regular: 90%, Plus: 80%',
    trend: 'up',
    color: 'bg-blue-600',
    actionPath: '/inventory/gas-delivery',
    actionLabel: 'View Tanks'
  },
  {
    id: 'reports-pending',
    title: 'Pending Reports',
    description: 'Reports requiring review',
    icon: <FileText className="h-6 w-6" data-id="kvrggasnx" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '3',
    change: '2 from yesterday',
    trend: 'neutral',
    color: 'bg-purple-500',
    actionPath: '/sales/reports',
    actionLabel: 'Review Reports'
  },
  {
    id: 'vendor-orders',
    title: 'Active Orders',
    description: 'Pending vendor deliveries',
    icon: <Calendar className="h-6 w-6" data-id="8dnn310tb" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '8',
    change: '2 arriving today',
    trend: 'neutral',
    color: 'bg-indigo-500',
    actionPath: '/orders',
    actionLabel: 'Track Orders'
  }];


  const getEmployeeWidgets = (): DashboardWidget[] => [
  {
    id: 'my-tasks',
    title: 'My Tasks',
    description: 'Assigned tasks for today',
    icon: <CheckCircle className="h-6 w-6" data-id="sdzft2479" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '5',
    change: '2 completed',
    trend: 'up',
    color: 'bg-green-500'
  },
  {
    id: 'shift-sales',
    title: 'Shift Sales',
    description: 'Sales during my shift',
    icon: <DollarSign className="h-6 w-6" data-id="rthv925av" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '$3,240',
    change: '+15.5%',
    trend: 'up',
    color: 'bg-blue-500',
    actionPath: '/sales/new',
    actionLabel: 'Add Sale'
  },
  {
    id: 'inventory-check',
    title: 'Inventory Items',
    description: 'Items to check or restock',
    icon: <Package className="h-6 w-6" data-id="f0snrzj95" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '12',
    change: '3 low stock',
    trend: 'neutral',
    color: 'bg-yellow-500',
    actionPath: '/products',
    actionLabel: 'View Products'
  },
  {
    id: 'delivery-schedule',
    title: 'Deliveries Today',
    description: 'Expected deliveries for processing',
    icon: <Truck className="h-6 w-6" data-id="jmleh799l" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />,
    value: '2',
    change: '1 in progress',
    trend: 'neutral',
    color: 'bg-purple-500',
    actionPath: '/delivery',
    actionLabel: 'Track Deliveries'
  }];


  const getCurrentUserWidgets = (): DashboardWidget[] => {
    switch (roleAccess.userRole) {
      case 'Administrator':
        return getAdministratorWidgets();
      case 'Management':
        return getManagementWidgets();
      case 'Employee':
        return getEmployeeWidgets();
      default:
        return [];
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" data-id="gid343fvy" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" data-id="yagvguw5a" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" data-id="y23likxk1" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />;
    }
  };

  const handleWidgetAction = (actionPath?: string) => {
    if (actionPath) {
      navigate(actionPath);
    }
  };

  const widgets = getCurrentUserWidgets();

  if (!roleAccess.userRole) {
    return (
      <Alert data-id="x1nlxqt2d" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
        <AlertTriangle className="h-4 w-4" data-id="46n9t3da2" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />
        <AlertDescription data-id="04rxkos4j" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          Please log in to access your personalized dashboard.
        </AlertDescription>
      </Alert>);

  }

  return (
    <div className="space-y-6" data-id="ffrsocarf" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="5jqim9tqh" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
        <div data-id="vo2xmg3ks" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          <h2 className="text-2xl font-bold" data-id="ened1t6n8" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            {roleAccess.userRole} Dashboard
          </h2>
          <p className="text-gray-600" data-id="pxx6ktrdd" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            Welcome back! Here's your personalized overview.
          </p>
        </div>
        <div className="flex items-center gap-2" data-id="vn9pca80h" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          <Badge className={`${
          roleAccess.userRole === 'Administrator' ? 'bg-red-500' :
          roleAccess.userRole === 'Management' ? 'bg-blue-500' : 'bg-green-500'}`
          } data-id="ae86147kq" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            {roleAccess.userRole}
          </Badge>
          <Badge variant="outline" data-id="j38dzgkve" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            {roleAccess.stationAccess}
          </Badge>
        </div>
      </div>

      {/* Role-specific alert */}
      <Alert data-id="grlgmzjdi" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
        <Shield className="h-4 w-4" data-id="ej8xyrle5" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />
        <AlertDescription data-id="p8zstx3g6" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          {roleAccess.getRestrictedMessage('dashboard access')}
        </AlertDescription>
      </Alert>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-id="kc6uilnun" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
        {widgets.map((widget) =>
        <Card key={widget.id} className="hover:shadow-lg transition-shadow" data-id="cb4b0f40k" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            <CardHeader className="pb-2" data-id="r8mzfk4uj" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
              <div className="flex items-center justify-between" data-id="8w4n9uvry" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                <div className={`p-2 rounded-lg ${widget.color} text-white`} data-id="sknw2h6mh" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                  {widget.icon}
                </div>
                {widget.trend && getTrendIcon(widget.trend)}
              </div>
            </CardHeader>
            <CardContent data-id="edwoye2jg" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
              <div className="space-y-2" data-id="0p032ukjc" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                <h3 className="font-semibold text-lg" data-id="mia1k5n0g" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">{widget.title}</h3>
                <p className="text-sm text-gray-600" data-id="h1c3axpsv" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">{widget.description}</p>
                
                {widget.value &&
              <div className="flex items-baseline gap-2" data-id="gmdplute9" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                    <span className="text-2xl font-bold" data-id="c76c0xvct" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">{widget.value}</span>
                    {widget.change &&
                <span className={`text-sm ${
                widget.trend === 'up' ? 'text-green-600' :
                widget.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`
                } data-id="kx6qw9iet" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                        {widget.change}
                      </span>
                }
                  </div>
              }
                
                {widget.actionPath && widget.actionLabel &&
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => handleWidgetAction(widget.actionPath)} data-id="7f532wnuw" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">

                    {widget.actionLabel}
                  </Button>
              }
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card data-id="ec7cpdr9z" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
        <CardHeader data-id="5zp6sh34z" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          <CardTitle data-id="1gwdz8q9r" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent data-id="3hx4ayy37" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-id="qhq0f46p3" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            {roleAccess.hasFeatureAccess('sales', 'canCreate') &&
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/sales/new')} data-id="4wjudhw3g" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">

                <Plus className="h-4 w-4" data-id="i8kbjjygh" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />
                New Sale
              </Button>
            }
            
            {roleAccess.hasFeatureAccess('products', 'canView') &&
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/products')} data-id="ln8i2s8sd" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">

                <Eye className="h-4 w-4" data-id="tkaf25yyl" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />
                View Products
              </Button>
            }
            
            {roleAccess.hasFeatureAccess('delivery', 'canCreate') &&
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/delivery/new')} data-id="27xv3rrj1" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">

                <Truck className="h-4 w-4" data-id="lhjrz17mg" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />
                Log Delivery
              </Button>
            }
            
            {roleAccess.hasFeatureAccess('sales', 'canExport') &&
            <Button
              variant="outline"
              className="flex items-center gap-2" data-id="09xl1c3zh" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">

                <Download className="h-4 w-4" data-id="7khunegaf" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx" />
                Export Reports
              </Button>
            }
          </div>
        </CardContent>
      </Card>

      {/* Access Summary */}
      <Card data-id="pkjgvr9ei" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
        <CardHeader data-id="ngdu39raa" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          <CardTitle data-id="530oyu0dy" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">Your Access Level</CardTitle>
        </CardHeader>
        <CardContent data-id="j6xw6dhov" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-id="w8ir0ulhf" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
            <div className="text-center" data-id="odknbo9fr" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="vgzetzewi" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                {roleAccess.hasFeatureAccess('dashboard', 'canView') ? '✓' : '✗'}
              </div>
              <div className="text-sm" data-id="qihectv29" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">Dashboard</div>
            </div>
            <div className="text-center" data-id="b90mv651a" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="j8i4j3btu" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                {roleAccess.canAccessAdminArea ? '✓' : '✗'}
              </div>
              <div className="text-sm" data-id="pk5gaoj2u" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">Admin Area</div>
            </div>
            <div className="text-center" data-id="qnjm3e8f3" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="lr0s2vdcr" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                {roleAccess.canAccessMonitoringArea ? '✓' : '✗'}
              </div>
              <div className="text-sm" data-id="5rkn0yt6t" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">Monitoring</div>
            </div>
            <div className="text-center" data-id="ghi5p3sur" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="ygm8ktjll" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">
                {roleAccess.canManageOtherUsers ? '✓' : '✗'}
              </div>
              <div className="text-sm" data-id="nz7utnu0v" data-path="src/components/RoleTesting/RoleBasedDashboard.tsx">User Management</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default RoleBasedDashboard;
