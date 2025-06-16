import React, { useState, useEffect } from 'react';
import DatabaseService from '@/services/databaseService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3, Users, Package, FileText, Truck, Settings,
  DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Shield, Eye, Plus, Edit, Download, Bell, Zap, Calendar,
  Rocket, Target, Info, ChevronRight, X } from
'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedRoleAccess } from '@/hooks/use-enhanced-role-access';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SetupGuidance from '@/components/SetupGuidance';
import QuickStartGuide from '@/components/QuickStartGuide';

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

interface SystemStatus {
  setupProgress: number;
  criticalAlerts: number;
  pendingTasks: number;
  systemHealth: number;
}

const EnhancedDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const roleAccess = useEnhancedRoleAccess();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSetupGuide, setShowSetupGuide] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    setupProgress: 0,
    criticalAlerts: 0,
    pendingTasks: 0,
    systemHealth: 98.5
  });

  // Real-time data states
  const [realTimeData, setRealTimeData] = useState({
    userCount: 0,
    employeeCount: 0,
    totalRevenue: 0,
    stationCount: 0,
    todaySales: 0,
    activeEmployees: 0,
    lowStockItems: 0,
    activeOrders: 0,
    myShiftSales: 0,
    inventoryItems: 0,
    todayDeliveries: 0
  });

  useEffect(() => {
    checkSystemStatus();
    fetchRealTimeData();
  }, []);

  const fetchRealTimeData = async () => {
    try {
      console.log('Fetching real-time dashboard data...');

      // Fetch all data in parallel
      const [userData, empData, stationData, salesData, orderData, prodData, deliveryData] = await Promise.all([
      DatabaseService.tablePage(11725, { PageNo: 1, PageSize: 1, Filters: [] }),
      DatabaseService.tablePage(11727, { PageNo: 1, PageSize: 1, Filters: [] }),
      DatabaseService.tablePage(12599, { PageNo: 1, PageSize: 100, Filters: [] }),
      DatabaseService.tablePage(12356, { PageNo: 1, PageSize: 100, OrderByField: "report_date", IsAsc: false, Filters: [] }),
      DatabaseService.tablePage(11730, { PageNo: 1, PageSize: 1, Filters: [{ name: "status", op: "Equal", value: "Pending" }] }),
      DatabaseService.tablePage(11726, { PageNo: 1, PageSize: 100, Filters: [] }),
      DatabaseService.tablePage(12196, { PageNo: 1, PageSize: 1, Filters: [] })]
      );

      // Calculate values
      const userCount = userData.data?.VirtualCount || 0;
      const employeeCount = empData.data?.VirtualCount || 0;
      const stationCount = stationData.data?.VirtualCount || 0;
      const activeOrders = orderData.data?.VirtualCount || 0;
      const inventoryItems = prodData.data?.VirtualCount || 0;
      const todayDeliveries = deliveryData.data?.VirtualCount || 0;

      // Calculate revenue
      let totalRevenue = 0;
      let todaySales = 0;
      if (salesData.data?.List) {
        totalRevenue = salesData.data.List.reduce((sum: number, report: any) => {
          return sum + (report.total_sales || 0);
        }, 0);

        // Today's sales
        const today = new Date().toISOString().split('T')[0];
        const todayReports = salesData.data.List.filter((report: any) =>
        report.report_date?.includes(today)
        );
        todaySales = todayReports.reduce((sum: number, report: any) => {
          return sum + (report.total_sales || 0);
        }, 0);
      }

      // Calculate low stock items
      let lowStockItems = 0;
      if (prodData.data?.List) {
        lowStockItems = prodData.data.List.filter((product: any) =>
        product.quantity_in_stock <= product.minimum_stock && product.minimum_stock > 0
        ).length;
      }

      // Active employees (assume all are active if not specified)
      const activeEmployees = employeeCount;
      const myShiftSales = todaySales; // For employee view

      setRealTimeData({
        userCount,
        employeeCount,
        totalRevenue,
        stationCount,
        todaySales,
        activeEmployees,
        lowStockItems,
        activeOrders,
        myShiftSales,
        inventoryItems,
        todayDeliveries
      });

      console.log('Real-time dashboard data loaded successfully');
    } catch (error) {
      console.error('Error fetching real-time dashboard data:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Check if basic setup is completed
      const setupChecks = await Promise.all([
      checkAdminUsers(),
      checkStationsSetup(),
      checkSMSConfig(),
      checkLicensesSetup()]
      );

      const completedTasks = setupChecks.filter(Boolean).length;
      const setupProgress = Math.round(completedTasks / setupChecks.length * 100);

      // Check for critical alerts
      const criticalAlerts = await checkCriticalAlerts();

      // Check pending tasks
      const pendingTasks = await checkPendingTasks();

      setSystemStatus({
        setupProgress,
        criticalAlerts,
        pendingTasks,
        systemHealth: 98.5 // Mock value
      });

      // Auto-hide setup guide if setup is mostly complete
      if (setupProgress >= 80) {
        setShowSetupGuide(false);
      }
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };

  const checkAdminUsers = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(11725, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [{ "name": "role", "op": "Equal", "value": "Administrator" }]
      });
      return !error && data?.List?.length > 0;
    } catch {
      return false;
    }
  };

  const checkStationsSetup = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(12599, {
        "PageNo": 1,
        "PageSize": 5
      });
      return !error && data?.List?.length >= 3;
    } catch {
      return false;
    }
  };

  const checkSMSConfig = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(12640, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [{ "name": "is_active", "op": "Equal", "value": true }]
      });
      return !error && data?.List?.length > 0;
    } catch {
      return false;
    }
  };

  const checkLicensesSetup = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(11731, {
        "PageNo": 1,
        "PageSize": 1
      });
      return !error && data?.List?.length > 0;
    } catch {
      return false;
    }
  };

  const checkCriticalAlerts = async () => {
    try {
      // Check for expiring licenses
      const { data, error } = await DatabaseService.tablePage(11731, {
        "PageNo": 1,
        "PageSize": 10,
        "Filters": [{ "name": "status", "op": "Equal", "value": "Active" }]
      });

      if (error) return 0;

      const currentDate = new Date();
      const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      let expiringCount = 0;
      data?.List?.forEach((license: any) => {
        const expiryDate = new Date(license.expiry_date);
        if (expiryDate <= thirtyDaysFromNow) {
          expiringCount++;
        }
      });

      return expiringCount;
    } catch {
      return 0;
    }
  };

  const checkPendingTasks = async () => {
    try {
      // Check for pending sales reports
      const { data, error } = await DatabaseService.tablePage(12356, {
        "PageNo": 1,
        "PageSize": 10,
        "OrderByField": "report_date",
        "IsAsc": false
      });

      if (error) return 0;

      // Count reports from today that might need review
      const today = new Date().toISOString().split('T')[0];
      const todayReports = data?.List?.filter((report: any) =>
      report.report_date?.includes(today)
      ) || [];

      return Math.max(0, 3 - todayReports.length); // Mock pending tasks
    } catch {
      return 0;
    }
  };

  // Widget definitions remain the same as RoleBasedDashboard
  const getAdministratorWidgets = (): DashboardWidget[] => [
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Overall system performance and monitoring',
    icon: <Zap className="h-6 w-6" data-id="nvc0nrn8i" data-path="src/components/EnhancedDashboard.tsx" />,
    value: `${systemStatus.systemHealth}%`,
    change: 'Operational',
    trend: 'up',
    color: 'bg-green-500',
    actionPath: '/admin/database-monitoring',
    actionLabel: 'View Details'
  },
  {
    id: 'setup-progress',
    title: 'Setup Progress',
    description: 'Initial system configuration completion',
    icon: <Target className="h-6 w-6" data-id="4ro4va2ie" data-path="src/components/EnhancedDashboard.tsx" />,
    value: `${systemStatus.setupProgress}%`,
    change: systemStatus.setupProgress === 100 ? 'Complete' : 'In Progress',
    trend: systemStatus.setupProgress === 100 ? 'up' : 'neutral',
    color: systemStatus.setupProgress === 100 ? 'bg-green-500' : 'bg-blue-500',
    actionPath: '/dashboard?tab=setup',
    actionLabel: 'Continue Setup'
  },
  {
    id: 'critical-alerts',
    title: 'Critical Alerts',
    description: 'Licenses expiring and urgent notifications',
    icon: <AlertTriangle className="h-6 w-6" data-id="4qi8d7j3v" data-path="src/components/EnhancedDashboard.tsx" />,
    value: systemStatus.criticalAlerts.toString(),
    change: systemStatus.criticalAlerts > 0 ? 'Needs attention' : 'All clear',
    trend: systemStatus.criticalAlerts > 0 ? 'down' : 'up',
    color: systemStatus.criticalAlerts > 0 ? 'bg-red-500' : 'bg-green-500',
    actionPath: '/licenses',
    actionLabel: 'Review Alerts'
  },
  {
    id: 'user-management',
    title: 'Active Users',
    description: 'Total system users and access levels',
    icon: <Users className="h-6 w-6" data-id="89yizbfy0" data-path="src/components/EnhancedDashboard.tsx" />,
    value: realTimeData.userCount.toString(),
    change: `${realTimeData.employeeCount} employees`,
    trend: 'up',
    color: 'bg-blue-500',
    actionPath: '/admin/user-management',
    actionLabel: 'Manage Users'
  },
  {
    id: 'revenue-overview',
    title: 'Total Revenue',
    description: 'All stations combined revenue',
    icon: <DollarSign className="h-6 w-6" data-id="5p543owaj" data-path="src/components/EnhancedDashboard.tsx" />,
    value: `$${realTimeData.totalRevenue.toLocaleString()}`,
    change: 'From sales reports',
    trend: 'up',
    color: 'bg-green-600',
    actionPath: '/sales',
    actionLabel: 'View Reports'
  },
  {
    id: 'station-status',
    title: 'Station Status',
    description: 'Operational status across all stations',
    icon: <CheckCircle className="h-6 w-6" data-id="jxxwylgpi" data-path="src/components/EnhancedDashboard.tsx" />,
    value: `${realTimeData.stationCount}/3`,
    change: realTimeData.stationCount === 3 ? 'All Online' : 'Setup Required',
    trend: realTimeData.stationCount === 3 ? 'up' : 'neutral',
    color: realTimeData.stationCount === 3 ? 'bg-green-500' : 'bg-yellow-500',
    actionPath: '/admin/site-management',
    actionLabel: 'Manage Stations'
  }];



  const getManagementWidgets = (): DashboardWidget[] => [
  {
    id: 'daily-sales',
    title: 'Today\'s Sales',
    description: 'Current day sales performance',
    icon: <DollarSign className="h-6 w-6" data-id="4ka28hwkt" data-path="src/components/EnhancedDashboard.tsx" />,
    value: `$${realTimeData.todaySales.toLocaleString()}`,
    change: 'Today\'s total',
    trend: 'up',
    color: 'bg-green-500',
    actionPath: '/sales',
    actionLabel: 'View Details'
  },
  {
    id: 'employee-overview',
    title: 'Active Employees',
    description: 'Currently working staff',
    icon: <Users className="h-6 w-6" data-id="grekdu7q4" data-path="src/components/EnhancedDashboard.tsx" />,
    value: realTimeData.activeEmployees.toString(),
    change: 'On duty',
    trend: 'neutral',
    color: 'bg-blue-500',
    actionPath: '/employees',
    actionLabel: 'Manage Staff'
  },
  {
    id: 'inventory-status',
    title: 'Inventory Alerts',
    description: 'Low stock and reorder notifications',
    icon: <Package className="h-6 w-6" data-id="02pathv0f" data-path="src/components/EnhancedDashboard.tsx" />,
    value: realTimeData.lowStockItems.toString(),
    change: realTimeData.lowStockItems > 0 ? 'Need restocking' : 'All stocked',
    trend: realTimeData.lowStockItems > 0 ? 'down' : 'up',
    color: realTimeData.lowStockItems > 0 ? 'bg-red-500' : 'bg-green-500',
    actionPath: '/inventory/alerts',
    actionLabel: 'Check Inventory'
  },
  {
    id: 'fuel-levels',
    title: 'Fuel Inventory',
    description: 'Current fuel tank levels',
    icon: <Truck className="h-6 w-6" data-id="g0jqk8a5l" data-path="src/components/EnhancedDashboard.tsx" />,
    value: 'Monitor',
    change: 'Check tank levels',
    trend: 'neutral',
    color: 'bg-blue-600',
    actionPath: '/inventory/gas-delivery',
    actionLabel: 'View Tanks'
  },
  {
    id: 'reports-pending',
    title: 'Pending Reports',
    description: 'Reports requiring review',
    icon: <FileText className="h-6 w-6" data-id="wqa1n6s58" data-path="src/components/EnhancedDashboard.tsx" />,
    value: systemStatus.pendingTasks.toString(),
    change: `${systemStatus.pendingTasks} from today`,
    trend: 'neutral',
    color: 'bg-purple-500',
    actionPath: '/sales/reports',
    actionLabel: 'Review Reports'
  },
  {
    id: 'vendor-orders',
    title: 'Active Orders',
    description: 'Pending vendor deliveries',
    icon: <Calendar className="h-6 w-6" data-id="cevgcx41k" data-path="src/components/EnhancedDashboard.tsx" />,
    value: realTimeData.activeOrders.toString(),
    change: 'Pending delivery',
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
    icon: <CheckCircle className="h-6 w-6" data-id="hyi2rt5f0" data-path="src/components/EnhancedDashboard.tsx" />,
    value: 'Ready',
    change: 'All systems operational',
    trend: 'up',
    color: 'bg-green-500'
  },
  {
    id: 'shift-sales',
    title: 'Shift Sales',
    description: 'Sales during my shift',
    icon: <DollarSign className="h-6 w-6" data-id="25eh67uq0" data-path="src/components/EnhancedDashboard.tsx" />,
    value: `$${realTimeData.myShiftSales.toLocaleString()}`,
    change: 'Current shift',
    trend: 'up',
    color: 'bg-blue-500',
    actionPath: '/sales/new',
    actionLabel: 'Add Sale'
  },
  {
    id: 'inventory-check',
    title: 'Inventory Items',
    description: 'Items to check or restock',
    icon: <Package className="h-6 w-6" data-id="q8syeleva" data-path="src/components/EnhancedDashboard.tsx" />,
    value: realTimeData.inventoryItems.toString(),
    change: 'Total products',
    trend: 'neutral',
    color: 'bg-yellow-500',
    actionPath: '/products',
    actionLabel: 'View Products'
  },
  {
    id: 'delivery-schedule',
    title: 'Deliveries Today',
    description: 'Expected deliveries for processing',
    icon: <Truck className="h-6 w-6" data-id="dqdvmfmjx" data-path="src/components/EnhancedDashboard.tsx" />,
    value: realTimeData.todayDeliveries.toString(),
    change: realTimeData.todayDeliveries > 0 ? 'In progress' : 'None scheduled',
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
        return <TrendingUp className="h-4 w-4 text-green-500" data-id="ukbvsa1yt" data-path="src/components/EnhancedDashboard.tsx" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" data-id="qo6qjby4g" data-path="src/components/EnhancedDashboard.tsx" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" data-id="4bongprcn" data-path="src/components/EnhancedDashboard.tsx" />;
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
      <Alert data-id="97eut8acr" data-path="src/components/EnhancedDashboard.tsx">
        <AlertTriangle className="h-4 w-4" data-id="5u7rrr0k7" data-path="src/components/EnhancedDashboard.tsx" />
        <AlertDescription data-id="26fkbsp6o" data-path="src/components/EnhancedDashboard.tsx">
          Please log in to access your personalized dashboard.
        </AlertDescription>
      </Alert>);

  }

  return (
    <div className="space-y-6" data-id="bbfsggivf" data-path="src/components/EnhancedDashboard.tsx">
      {/* Welcome Header */}
      <div className="flex items-center justify-between" data-id="1pyk8ezq7" data-path="src/components/EnhancedDashboard.tsx">
        <div data-id="cncelel6x" data-path="src/components/EnhancedDashboard.tsx">
          <h1 className="text-3xl font-bold text-gray-900" data-id="9cki6wncl" data-path="src/components/EnhancedDashboard.tsx">
            Welcome to DFS Manager Portal
          </h1>
          <p className="text-gray-600 mt-1" data-id="8xfgo6bh2" data-path="src/components/EnhancedDashboard.tsx">
            {roleAccess.userRole} Dashboard • {roleAccess.stationAccess}
          </p>
        </div>
        <div className="flex items-center gap-2" data-id="ueoe90o70" data-path="src/components/EnhancedDashboard.tsx">
          <Badge className={`${
          roleAccess.userRole === 'Administrator' ? 'bg-red-500' :
          roleAccess.userRole === 'Management' ? 'bg-blue-500' : 'bg-green-500'}`
          } data-id="lfpkbvmkh" data-path="src/components/EnhancedDashboard.tsx">
            {roleAccess.userRole}
          </Badge>
          <Badge variant="outline" data-id="ca165dptv" data-path="src/components/EnhancedDashboard.tsx">
            {roleAccess.stationAccess}
          </Badge>
        </div>
      </div>

      {/* Setup Progress Alert for Administrators */}
      {roleAccess.userRole === 'Administrator' && systemStatus.setupProgress < 100 && showSetupGuide &&
      <Alert className="border-blue-500 bg-blue-50" data-id="db7ezdo1n" data-path="src/components/EnhancedDashboard.tsx">
          <Rocket className="h-4 w-4" data-id="rh293kiyl" data-path="src/components/EnhancedDashboard.tsx" />
          <AlertDescription className="flex items-center justify-between" data-id="10vz1hlcl" data-path="src/components/EnhancedDashboard.tsx">
            <div data-id="zmzff3b8u" data-path="src/components/EnhancedDashboard.tsx">
              <strong data-id="1skisb77i" data-path="src/components/EnhancedDashboard.tsx">Complete your setup:</strong> You're {systemStatus.setupProgress}% done with initial configuration. 
              <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600 ml-1"
              onClick={() => setActiveTab('setup')} data-id="fkcjyc2yn" data-path="src/components/EnhancedDashboard.tsx">

                Continue setup →
              </Button>
            </div>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSetupGuide(false)} data-id="eqk0c4ibu" data-path="src/components/EnhancedDashboard.tsx">

              <X className="h-4 w-4" data-id="1r6krhwst" data-path="src/components/EnhancedDashboard.tsx" />
            </Button>
          </AlertDescription>
        </Alert>
      }

      {/* Critical Alerts */}
      {systemStatus.criticalAlerts > 0 &&
      <Alert className="border-red-500 bg-red-50" data-id="68r9la5nb" data-path="src/components/EnhancedDashboard.tsx">
          <AlertTriangle className="h-4 w-4" data-id="vnvp5a2v8" data-path="src/components/EnhancedDashboard.tsx" />
          <AlertDescription data-id="jyp5lch1b" data-path="src/components/EnhancedDashboard.tsx">
            <strong data-id="b6tmg1075" data-path="src/components/EnhancedDashboard.tsx">Attention Required:</strong> {systemStatus.criticalAlerts} license(s) expiring within 30 days. 
            <Button
            variant="link"
            className="p-0 h-auto font-semibold text-red-600 ml-1"
            onClick={() => navigate('/licenses')} data-id="dezpbprjk" data-path="src/components/EnhancedDashboard.tsx">

              Review licenses →
            </Button>
          </AlertDescription>
        </Alert>
      }

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} data-id="eurt6qb51" data-path="src/components/EnhancedDashboard.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="v26kgmpst" data-path="src/components/EnhancedDashboard.tsx">
          <TabsTrigger value="overview" data-id="1jh68ptcd" data-path="src/components/EnhancedDashboard.tsx">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="quickstart" data-id="135j71vhq" data-path="src/components/EnhancedDashboard.tsx">Quick Start</TabsTrigger>
          <TabsTrigger value="setup" data-id="ql83qo7bt" data-path="src/components/EnhancedDashboard.tsx">Setup Guide</TabsTrigger>
          <TabsTrigger value="analytics" data-id="ddujb6gu6" data-path="src/components/EnhancedDashboard.tsx">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6" data-id="ht2hlabkz" data-path="src/components/EnhancedDashboard.tsx">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-id="cjeliybw9" data-path="src/components/EnhancedDashboard.tsx">
            <Card className="border-l-4 border-l-green-500" data-id="fyh9efjpu" data-path="src/components/EnhancedDashboard.tsx">
              <CardContent className="pt-6" data-id="pnekw2mxt" data-path="src/components/EnhancedDashboard.tsx">
                <div className="flex items-center justify-between" data-id="2h2grey2b" data-path="src/components/EnhancedDashboard.tsx">
                  <div data-id="4wv5u05a5" data-path="src/components/EnhancedDashboard.tsx">
                    <p className="text-sm font-medium text-gray-600" data-id="d9xzpk0ll" data-path="src/components/EnhancedDashboard.tsx">System Health</p>
                    <p className="text-2xl font-bold text-green-600" data-id="rxwnwpsom" data-path="src/components/EnhancedDashboard.tsx">{systemStatus.systemHealth}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" data-id="bid0uafyr" data-path="src/components/EnhancedDashboard.tsx" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500" data-id="zo17lb1gp" data-path="src/components/EnhancedDashboard.tsx">
              <CardContent className="pt-6" data-id="gx3qid1b7" data-path="src/components/EnhancedDashboard.tsx">
                <div className="flex items-center justify-between" data-id="671fk12p9" data-path="src/components/EnhancedDashboard.tsx">
                  <div data-id="osciciug9" data-path="src/components/EnhancedDashboard.tsx">
                    <p className="text-sm font-medium text-gray-600" data-id="biladpaqa" data-path="src/components/EnhancedDashboard.tsx">Setup Progress</p>
                    <p className="text-2xl font-bold text-blue-600" data-id="f547iqusr" data-path="src/components/EnhancedDashboard.tsx">{systemStatus.setupProgress}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" data-id="535eqmmun" data-path="src/components/EnhancedDashboard.tsx" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500" data-id="f8kvpb3e4" data-path="src/components/EnhancedDashboard.tsx">
              <CardContent className="pt-6" data-id="anvkq62g4" data-path="src/components/EnhancedDashboard.tsx">
                <div className="flex items-center justify-between" data-id="w5cd9vl07" data-path="src/components/EnhancedDashboard.tsx">
                  <div data-id="j5rc9s9pp" data-path="src/components/EnhancedDashboard.tsx">
                    <p className="text-sm font-medium text-gray-600" data-id="y6brxfpi4" data-path="src/components/EnhancedDashboard.tsx">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-600" data-id="oqopphjzb" data-path="src/components/EnhancedDashboard.tsx">{systemStatus.criticalAlerts}</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-500" data-id="b6la3dwn2" data-path="src/components/EnhancedDashboard.tsx" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500" data-id="1d87c98mm" data-path="src/components/EnhancedDashboard.tsx">
              <CardContent className="pt-6" data-id="y8u77u0g3" data-path="src/components/EnhancedDashboard.tsx">
                <div className="flex items-center justify-between" data-id="j6ozwacpp" data-path="src/components/EnhancedDashboard.tsx">
                  <div data-id="gakn0medj" data-path="src/components/EnhancedDashboard.tsx">
                    <p className="text-sm font-medium text-gray-600" data-id="ajd42dm1h" data-path="src/components/EnhancedDashboard.tsx">Pending Tasks</p>
                    <p className="text-2xl font-bold text-purple-600" data-id="ky8309c20" data-path="src/components/EnhancedDashboard.tsx">{systemStatus.pendingTasks}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" data-id="8sps4mhl1" data-path="src/components/EnhancedDashboard.tsx" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-id="422jnpccq" data-path="src/components/EnhancedDashboard.tsx">
            {widgets.map((widget) =>
            <Card key={widget.id} className="hover:shadow-lg transition-shadow" data-id="1arvlsjs5" data-path="src/components/EnhancedDashboard.tsx">
                <CardHeader className="pb-2" data-id="pe6tmfaxm" data-path="src/components/EnhancedDashboard.tsx">
                  <div className="flex items-center justify-between" data-id="1dszcbu44" data-path="src/components/EnhancedDashboard.tsx">
                    <div className={`p-2 rounded-lg ${widget.color} text-white`} data-id="9flfsmh1b" data-path="src/components/EnhancedDashboard.tsx">
                      {widget.icon}
                    </div>
                    {widget.trend && getTrendIcon(widget.trend)}
                  </div>
                </CardHeader>
                <CardContent data-id="xf4irumbb" data-path="src/components/EnhancedDashboard.tsx">
                  <div className="space-y-2" data-id="6307ty9m9" data-path="src/components/EnhancedDashboard.tsx">
                    <h3 className="font-semibold text-lg" data-id="3v8z48gyy" data-path="src/components/EnhancedDashboard.tsx">{widget.title}</h3>
                    <p className="text-sm text-gray-600" data-id="0mud150oj" data-path="src/components/EnhancedDashboard.tsx">{widget.description}</p>
                    
                    {widget.value &&
                  <div className="flex items-baseline gap-2" data-id="628p91248" data-path="src/components/EnhancedDashboard.tsx">
                        <span className="text-2xl font-bold" data-id="c1b32np18" data-path="src/components/EnhancedDashboard.tsx">{widget.value}</span>
                        {widget.change &&
                    <span className={`text-sm ${
                    widget.trend === 'up' ? 'text-green-600' :
                    widget.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`
                    } data-id="25psotjcs" data-path="src/components/EnhancedDashboard.tsx">
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
                    onClick={() => handleWidgetAction(widget.actionPath)} data-id="w4kgjcxnw" data-path="src/components/EnhancedDashboard.tsx">

                        {widget.actionLabel}
                      </Button>
                  }
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <Card data-id="wgmq8de2r" data-path="src/components/EnhancedDashboard.tsx">
            <CardHeader data-id="2cywtez05" data-path="src/components/EnhancedDashboard.tsx">
              <CardTitle data-id="2t80qmt9v" data-path="src/components/EnhancedDashboard.tsx">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent data-id="p1j8c45nq" data-path="src/components/EnhancedDashboard.tsx">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-id="ht5oru7o1" data-path="src/components/EnhancedDashboard.tsx">
                {roleAccess.hasFeatureAccess('sales', 'canCreate') &&
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/sales/new')} data-id="lbi05bpmv" data-path="src/components/EnhancedDashboard.tsx">

                    <Plus className="h-4 w-4" data-id="srfppooe7" data-path="src/components/EnhancedDashboard.tsx" />
                    New Sale
                  </Button>
                }
                
                {roleAccess.hasFeatureAccess('products', 'canView') &&
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/products')} data-id="sz1otk8a5" data-path="src/components/EnhancedDashboard.tsx">

                    <Eye className="h-4 w-4" data-id="hap2iaass" data-path="src/components/EnhancedDashboard.tsx" />
                    View Products
                  </Button>
                }
                
                {roleAccess.hasFeatureAccess('delivery', 'canCreate') &&
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/delivery/new')} data-id="hka6dsszu" data-path="src/components/EnhancedDashboard.tsx">

                    <Truck className="h-4 w-4" data-id="e19dmqxqg" data-path="src/components/EnhancedDashboard.tsx" />
                    Log Delivery
                  </Button>
                }
                
                {roleAccess.hasFeatureAccess('sales', 'canExport') &&
                <Button
                  variant="outline"
                  className="flex items-center gap-2" data-id="zl2ecj6o2" data-path="src/components/EnhancedDashboard.tsx">

                    <Download className="h-4 w-4" data-id="zl9gxpuhx" data-path="src/components/EnhancedDashboard.tsx" />
                    Export Reports
                  </Button>
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quickstart" data-id="vuh77rzbw" data-path="src/components/EnhancedDashboard.tsx">
          <QuickStartGuide data-id="j8d6rpx46" data-path="src/components/EnhancedDashboard.tsx" />
        </TabsContent>

        <TabsContent value="setup" data-id="cdxivbdj1" data-path="src/components/EnhancedDashboard.tsx">
          <SetupGuidance data-id="edqqxx7sq" data-path="src/components/EnhancedDashboard.tsx" />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6" data-id="2qfmx3qa3" data-path="src/components/EnhancedDashboard.tsx">
          <Alert data-id="ei0dngqnb" data-path="src/components/EnhancedDashboard.tsx">
            <BarChart3 className="h-4 w-4" data-id="5gtik7ymb" data-path="src/components/EnhancedDashboard.tsx" />
            <AlertDescription data-id="brmrg6rgn" data-path="src/components/EnhancedDashboard.tsx">
              Advanced analytics and reporting features will be available here. 
              Complete the basic setup first to unlock full analytics capabilities.
            </AlertDescription>
          </Alert>
          
          <Card data-id="cujsyie6p" data-path="src/components/EnhancedDashboard.tsx">
            <CardHeader data-id="tjo4yv1w2" data-path="src/components/EnhancedDashboard.tsx">
              <CardTitle data-id="haqt2mdoq" data-path="src/components/EnhancedDashboard.tsx">Coming Soon: Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent data-id="1mia8zlv7" data-path="src/components/EnhancedDashboard.tsx">
              <div className="text-center py-12" data-id="txz71eicl" data-path="src/components/EnhancedDashboard.tsx">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" data-id="49w53m0d5" data-path="src/components/EnhancedDashboard.tsx" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2" data-id="gxby7txjy" data-path="src/components/EnhancedDashboard.tsx">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-500 mb-4" data-id="b390mlj8t" data-path="src/components/EnhancedDashboard.tsx">
                  Comprehensive reporting and analytics will be available once you complete the initial setup.
                </p>
                <Button onClick={() => setActiveTab('setup')} data-id="eu1tb7upa" data-path="src/components/EnhancedDashboard.tsx">
                  Complete Setup First
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default EnhancedDashboard;
