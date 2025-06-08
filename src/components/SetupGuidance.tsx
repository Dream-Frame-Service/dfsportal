import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle, Circle, Clock, AlertTriangle, Settings, Users,
  Building, Shield, MessageSquare, Package, FileText, Database,
  ArrowRight, ExternalLink, Info, Lightbulb, Zap } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'in_progress' | 'pending' | 'attention_needed';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  actionPath?: string;
  actionLabel: string;
  category: 'admin' | 'operations' | 'security' | 'testing';
  dependencies?: string[];
  tips?: string[];
}

const SetupGuidance: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([]);

  useEffect(() => {
    initializeSetupSteps();
  }, []);

  const initializeSetupSteps = async () => {
    const steps: SetupStep[] = [
    // Admin Setup Steps
    {
      id: 'admin-accounts',
      title: 'Create Admin User Accounts',
      description: 'Set up initial administrator accounts for system management',
      icon: <Users className="h-5 w-5" data-id="6a8jyhunj" data-path="src/components/SetupGuidance.tsx" />,
      status: await checkAdminAccountsStatus(),
      priority: 'high',
      estimatedTime: '10 minutes',
      actionPath: '/admin/user-management',
      actionLabel: 'Manage Users',
      category: 'admin',
      tips: [
      'Create separate admin accounts for each key manager',
      'Use strong passwords and enable two-factor authentication',
      'Assign roles based on responsibility levels']

    },
    {
      id: 'station-config',
      title: 'Configure Station Information',
      description: 'Set up details for MOBIL, AMOCO ROSEDALE, and AMOCO BROOKLYN',
      icon: <Building className="h-5 w-5" data-id="lji3btxsg" data-path="src/components/SetupGuidance.tsx" />,
      status: await checkStationConfigStatus(),
      priority: 'high',
      estimatedTime: '15 minutes',
      actionPath: '/admin/site-management',
      actionLabel: 'Configure Stations',
      category: 'admin',
      dependencies: ['admin-accounts'],
      tips: [
      'Include accurate address and contact information',
      'Set proper operating hours for each station',
      'Configure manager assignments']

    },
    {
      id: 'sms-alerts',
      title: 'Configure SMS Alert Settings',
      description: 'Set up SMS notifications for license expiry and critical alerts',
      icon: <MessageSquare className="h-5 w-5" data-id="xxndkn0tv" data-path="src/components/SetupGuidance.tsx" />,
      status: await checkSMSConfigStatus(),
      priority: 'high',
      estimatedTime: '20 minutes',
      actionPath: '/admin/sms-alert-management',
      actionLabel: 'Setup SMS Alerts',
      category: 'admin',
      dependencies: ['admin-accounts'],
      tips: [
      'Configure Twilio credentials for SMS delivery',
      'Add contact numbers for each station',
      'Test SMS delivery before going live']

    },
    {
      id: 'employee-profiles',
      title: 'Set Up Employee Profiles',
      description: 'Create employee accounts and assign proper access permissions',
      icon: <Users className="h-5 w-5" data-id="coonse82f" data-path="src/components/SetupGuidance.tsx" />,
      status: await checkEmployeeProfilesStatus(),
      priority: 'medium',
      estimatedTime: '30 minutes',
      actionPath: '/employees',
      actionLabel: 'Manage Employees',
      category: 'operations',
      dependencies: ['admin-accounts', 'station-config'],
      tips: [
      'Upload identification documents for each employee',
      'Set appropriate salary and position information',
      'Assign station-specific access rights']

    },
    {
      id: 'product-inventory',
      title: 'Import Product Inventory',
      description: 'Add existing product data and set up inventory tracking',
      icon: <Package className="h-5 w-5" data-id="jphupyfb6" data-path="src/components/SetupGuidance.tsx" />,
      status: await checkProductInventoryStatus(),
      priority: 'medium',
      estimatedTime: '45 minutes',
      actionPath: '/products',
      actionLabel: 'Manage Products',
      category: 'operations',
      dependencies: ['admin-accounts'],
      tips: [
      'Use barcode scanning for efficient product entry',
      'Set minimum stock levels for automatic alerts',
      'Configure pricing and profit margins']

    },
    {
      id: 'licenses-certificates',
      title: 'Upload Licenses & Certificates',
      description: 'Add all business licenses and set expiry notifications',
      icon: <FileText className="h-5 w-5" data-id="rl8d90azf" data-path="src/components/SetupGuidance.tsx" />,
      status: await checkLicensesStatus(),
      priority: 'high',
      estimatedTime: '25 minutes',
      actionPath: '/licenses',
      actionLabel: 'Manage Licenses',
      category: 'operations',
      dependencies: ['sms-alerts'],
      tips: [
      'Scan and upload all license documents',
      'Set reminder alerts 30-60 days before expiry',
      'Include renewal contact information']

    },
    {
      id: 'dashboard-customization',
      title: 'Customize Dashboard Widgets',
      description: 'Configure dashboard layout based on operational needs',
      icon: <Settings className="h-5 w-5" data-id="nsq2h26v1" data-path="src/components/SetupGuidance.tsx" />,
      status: 'pending',
      priority: 'low',
      estimatedTime: '15 minutes',
      actionPath: '/admin/role-testing',
      actionLabel: 'Customize Dashboard',
      category: 'operations',
      dependencies: ['employee-profiles'],
      tips: [
      'Set up role-based dashboard views',
      'Configure relevant widgets for each user type',
      'Test different user perspectives']

    },
    {
      id: 'visual-editing',
      title: 'Test Visual Editing Tools',
      description: 'Verify visual editing functionality across components',
      icon: <Zap className="h-5 w-5" data-id="gq1j8t05q" data-path="src/components/SetupGuidance.tsx" />,
      status: 'pending',
      priority: 'low',
      estimatedTime: '10 minutes',
      actionPath: '/',
      actionLabel: 'Test Editing',
      category: 'testing',
      tips: [
      'Try editing text content in different sections',
      'Test image uploads and replacements',
      'Verify changes are saved properly']

    },
    {
      id: 'security-settings',
      title: 'Configure Security Settings',
      description: 'Set up access controls and security policies',
      icon: <Shield className="h-5 w-5" data-id="9h5qszcyv" data-path="src/components/SetupGuidance.tsx" />,
      status: 'pending',
      priority: 'medium',
      estimatedTime: '20 minutes',
      actionPath: '/admin/security',
      actionLabel: 'Security Settings',
      category: 'security',
      dependencies: ['admin-accounts'],
      tips: [
      'Enable audit logging for all user actions',
      'Set session timeout policies',
      'Configure password requirements']

    },
    {
      id: 'database-monitoring',
      title: 'Setup Database Monitoring',
      description: 'Configure performance monitoring and alerts',
      icon: <Database className="h-5 w-5" data-id="d7jut44wg" data-path="src/components/SetupGuidance.tsx" />,
      status: 'pending',
      priority: 'medium',
      estimatedTime: '15 minutes',
      actionPath: '/admin/database-monitoring',
      actionLabel: 'Setup Monitoring',
      category: 'admin',
      dependencies: ['admin-accounts'],
      tips: [
      'Configure performance thresholds',
      'Set up automated backups',
      'Monitor connection health']

    }];


    setSetupSteps(steps);
  };

  // Status checking functions (mock implementations)
  const checkAdminAccountsStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11725, {
        "PageNo": 1,
        "PageSize": 5,
        "Filters": [
        { "name": "role", "op": "Equal", "value": "Administrator" }]

      });
      if (error) return 'attention_needed';
      return data?.List?.length > 0 ? 'completed' : 'pending';
    } catch {
      return 'pending';
    }
  };

  const checkStationConfigStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(12599, {
        "PageNo": 1,
        "PageSize": 5
      });
      if (error) return 'attention_needed';
      return data?.List?.length >= 3 ? 'completed' : 'pending';
    } catch {
      return 'pending';
    }
  };

  const checkSMSConfigStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(12640, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [
        { "name": "is_active", "op": "Equal", "value": true }]

      });
      if (error) return 'attention_needed';
      return data?.List?.length > 0 ? 'completed' : 'pending';
    } catch {
      return 'pending';
    }
  };

  const checkEmployeeProfilesStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11727, {
        "PageNo": 1,
        "PageSize": 5
      });
      if (error) return 'attention_needed';
      return data?.List?.length > 0 ? 'completed' : 'pending';
    } catch {
      return 'pending';
    }
  };

  const checkProductInventoryStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11726, {
        "PageNo": 1,
        "PageSize": 5
      });
      if (error) return 'attention_needed';
      return data?.List?.length > 0 ? 'completed' : 'pending';
    } catch {
      return 'pending';
    }
  };

  const checkLicensesStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11731, {
        "PageNo": 1,
        "PageSize": 5
      });
      if (error) return 'attention_needed';
      return data?.List?.length > 0 ? 'completed' : 'pending';
    } catch {
      return 'pending';
    }
  };

  const getStatusIcon = (status: SetupStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" data-id="1v4oxwloc" data-path="src/components/SetupGuidance.tsx" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" data-id="uwgumuqse" data-path="src/components/SetupGuidance.tsx" />;
      case 'attention_needed':
        return <AlertTriangle className="h-5 w-5 text-red-500" data-id="loxlrt9mm" data-path="src/components/SetupGuidance.tsx" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" data-id="0em9mciax" data-path="src/components/SetupGuidance.tsx" />;
    }
  };

  const getStatusBadge = (status: SetupStep['status']) => {
    const statusConfig = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      attention_needed: { label: 'Needs Attention', className: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status];
    return <Badge className={config.className} data-id="e7ws2lv4s" data-path="src/components/SetupGuidance.tsx">{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: SetupStep['priority']) => {
    const priorityConfig = {
      high: { label: 'High Priority', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' }
    };

    const config = priorityConfig[priority];
    return <Badge variant="outline" className={config.className} data-id="kumlejqro" data-path="src/components/SetupGuidance.tsx">{config.label}</Badge>;
  };

  const calculateProgress = () => {
    const completed = setupSteps.filter((step) => step.status === 'completed').length;
    return Math.round(completed / setupSteps.length * 100);
  };

  const getHighPrioritySteps = () => {
    return setupSteps.filter((step) =>
    step.priority === 'high' && step.status !== 'completed'
    ).slice(0, 3);
  };

  const getStepsByCategory = (category: string) => {
    return setupSteps.filter((step) => step.category === category);
  };

  const handleStepAction = (step: SetupStep) => {
    if (step.actionPath) {
      navigate(step.actionPath);
      toast({
        title: "Navigating to Setup",
        description: `Opening ${step.title} configuration...`
      });
    }
  };

  const progress = calculateProgress();
  const highPrioritySteps = getHighPrioritySteps();

  return (
    <div className="space-y-6" data-id="v0xsp3fna" data-path="src/components/SetupGuidance.tsx">
      {/* Setup Progress Overview */}
      <Card className="border-l-4 border-l-blue-500" data-id="bh7dtacca" data-path="src/components/SetupGuidance.tsx">
        <CardHeader data-id="k5knzsdgw" data-path="src/components/SetupGuidance.tsx">
          <div className="flex items-center justify-between" data-id="o1g8jmioj" data-path="src/components/SetupGuidance.tsx">
            <div data-id="ka1q2ndid" data-path="src/components/SetupGuidance.tsx">
              <CardTitle className="flex items-center gap-2" data-id="3gbecdqw0" data-path="src/components/SetupGuidance.tsx">
                <Settings className="h-6 w-6" data-id="pmz36qxry" data-path="src/components/SetupGuidance.tsx" />
                DFS Manager Setup Progress
              </CardTitle>
              <p className="text-gray-600 mt-1" data-id="wm4ripmri" data-path="src/components/SetupGuidance.tsx">
                Complete these essential steps to get your gas station management system ready
              </p>
            </div>
            <div className="text-right" data-id="qzga6okox" data-path="src/components/SetupGuidance.tsx">
              <div className="text-3xl font-bold text-blue-600" data-id="m1rj8045e" data-path="src/components/SetupGuidance.tsx">{progress}%</div>
              <p className="text-sm text-gray-500" data-id="mjvdmzigv" data-path="src/components/SetupGuidance.tsx">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="novp723xx" data-path="src/components/SetupGuidance.tsx">
          <Progress value={progress} className="h-3 mb-4" data-id="squd1as2l" data-path="src/components/SetupGuidance.tsx" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="kydxb6wvn" data-path="src/components/SetupGuidance.tsx">
            <div className="text-center" data-id="lks1e15nn" data-path="src/components/SetupGuidance.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="nxm3z4mvy" data-path="src/components/SetupGuidance.tsx">
                {setupSteps.filter((s) => s.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600" data-id="4ynwkjr6f" data-path="src/components/SetupGuidance.tsx">Completed</p>
            </div>
            <div className="text-center" data-id="3jaxzvopd" data-path="src/components/SetupGuidance.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="8z3uwdn5z" data-path="src/components/SetupGuidance.tsx">
                {setupSteps.filter((s) => s.status === 'in_progress').length}
              </div>
              <p className="text-sm text-gray-600" data-id="7gvcmqpzv" data-path="src/components/SetupGuidance.tsx">In Progress</p>
            </div>
            <div className="text-center" data-id="lm1be5p57" data-path="src/components/SetupGuidance.tsx">
              <div className="text-2xl font-bold text-red-600" data-id="48enptvge" data-path="src/components/SetupGuidance.tsx">
                {setupSteps.filter((s) => s.status === 'attention_needed').length}
              </div>
              <p className="text-sm text-gray-600" data-id="70be5s7fl" data-path="src/components/SetupGuidance.tsx">Need Attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Next Steps */}
      {highPrioritySteps.length > 0 &&
      <Card className="border-l-4 border-l-red-500" data-id="48496zwnl" data-path="src/components/SetupGuidance.tsx">
          <CardHeader data-id="k30tzm390" data-path="src/components/SetupGuidance.tsx">
            <CardTitle className="flex items-center gap-2 text-red-700" data-id="lkg9ywk0r" data-path="src/components/SetupGuidance.tsx">
              <AlertTriangle className="h-5 w-5" data-id="t15m3rc2d" data-path="src/components/SetupGuidance.tsx" />
              Immediate Action Required
            </CardTitle>
            <p className="text-gray-600" data-id="palifb0ia" data-path="src/components/SetupGuidance.tsx">
              These high-priority steps should be completed first for optimal system operation
            </p>
          </CardHeader>
          <CardContent data-id="d3j32ogd6" data-path="src/components/SetupGuidance.tsx">
            <div className="space-y-4" data-id="z2zw6dema" data-path="src/components/SetupGuidance.tsx">
              {highPrioritySteps.map((step) =>
            <div key={step.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg" data-id="nfkmvkx0t" data-path="src/components/SetupGuidance.tsx">
                  <div className="flex items-center gap-3" data-id="kf1ke8qmt" data-path="src/components/SetupGuidance.tsx">
                    {getStatusIcon(step.status)}
                    <div data-id="8yyyi392a" data-path="src/components/SetupGuidance.tsx">
                      <h4 className="font-semibold" data-id="nzkhwnwpa" data-path="src/components/SetupGuidance.tsx">{step.title}</h4>
                      <p className="text-sm text-gray-600" data-id="hqmwp33kx" data-path="src/components/SetupGuidance.tsx">{step.description}</p>
                      <div className="flex items-center gap-2 mt-1" data-id="4i5m0onvc" data-path="src/components/SetupGuidance.tsx">
                        {getPriorityBadge(step.priority)}
                        <span className="text-xs text-gray-500" data-id="nd4jowsg3" data-path="src/components/SetupGuidance.tsx">
                          Est. {step.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                onClick={() => handleStepAction(step)}
                className="bg-red-600 hover:bg-red-700" data-id="mt60r267u" data-path="src/components/SetupGuidance.tsx">

                    {step.actionLabel}
                    <ArrowRight className="h-4 w-4 ml-2" data-id="blco4ezmb" data-path="src/components/SetupGuidance.tsx" />
                  </Button>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* Detailed Setup Steps */}
      <Card data-id="7nlg014x5" data-path="src/components/SetupGuidance.tsx">
        <CardHeader data-id="uc3r3lun4" data-path="src/components/SetupGuidance.tsx">
          <CardTitle data-id="jkxvwzhgm" data-path="src/components/SetupGuidance.tsx">Complete Setup Guide</CardTitle>
          <p className="text-gray-600" data-id="vv1p0pnm1" data-path="src/components/SetupGuidance.tsx">
            Follow these steps to fully configure your DFS Manager Portal
          </p>
        </CardHeader>
        <CardContent data-id="804jfbkka" data-path="src/components/SetupGuidance.tsx">
          <Tabs value={activeTab} onValueChange={setActiveTab} data-id="bw19s6vf3" data-path="src/components/SetupGuidance.tsx">
            <TabsList className="grid w-full grid-cols-4" data-id="50fxmc13g" data-path="src/components/SetupGuidance.tsx">
              <TabsTrigger value="overview" data-id="hmq97k1vq" data-path="src/components/SetupGuidance.tsx">Overview</TabsTrigger>
              <TabsTrigger value="admin" data-id="23otp7kcn" data-path="src/components/SetupGuidance.tsx">Admin Setup</TabsTrigger>
              <TabsTrigger value="operations" data-id="ur3k7kcwg" data-path="src/components/SetupGuidance.tsx">Operations</TabsTrigger>
              <TabsTrigger value="security" data-id="gjuy40hmq" data-path="src/components/SetupGuidance.tsx">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4" data-id="jo3j9xo04" data-path="src/components/SetupGuidance.tsx">
              <Alert data-id="7azfde1cf" data-path="src/components/SetupGuidance.tsx">
                <Info className="h-4 w-4" data-id="pv4za7m1w" data-path="src/components/SetupGuidance.tsx" />
                <AlertDescription data-id="r2pu0xosx" data-path="src/components/SetupGuidance.tsx">
                  This overview shows all setup steps across categories. Use the tabs above to focus on specific areas.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4" data-id="u4eh86ulg" data-path="src/components/SetupGuidance.tsx">
                {setupSteps.map((step) =>
                <div key={step.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50" data-id="j0t2be1yw" data-path="src/components/SetupGuidance.tsx">
                    <div className="flex items-center gap-4" data-id="x7165so26" data-path="src/components/SetupGuidance.tsx">
                      {getStatusIcon(step.status)}
                      <div className="p-2 bg-gray-100 rounded-lg" data-id="xfn0wdg6c" data-path="src/components/SetupGuidance.tsx">
                        {step.icon}
                      </div>
                      <div className="flex-1" data-id="xm2jzc827" data-path="src/components/SetupGuidance.tsx">
                        <div className="flex items-center gap-2 mb-1" data-id="zqhrauhoe" data-path="src/components/SetupGuidance.tsx">
                          <h4 className="font-semibold" data-id="1ub6r09ir" data-path="src/components/SetupGuidance.tsx">{step.title}</h4>
                          {getStatusBadge(step.status)}
                          {getPriorityBadge(step.priority)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2" data-id="mn78o01wr" data-path="src/components/SetupGuidance.tsx">{step.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500" data-id="kbvv2bm48" data-path="src/components/SetupGuidance.tsx">
                          <span data-id="7bzpot3me" data-path="src/components/SetupGuidance.tsx">⏱️ {step.estimatedTime}</span>
                          <span data-id="0uepkqu82" data-path="src/components/SetupGuidance.tsx">📁 {step.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                    variant="outline"
                    onClick={() => handleStepAction(step)}
                    disabled={step.status === 'completed'} data-id="7s6q5t4mh" data-path="src/components/SetupGuidance.tsx">

                      {step.actionLabel}
                      <ExternalLink className="h-4 w-4 ml-2" data-id="wovx9ay54" data-path="src/components/SetupGuidance.tsx" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4" data-id="l6vd61tji" data-path="src/components/SetupGuidance.tsx">
              {getStepsByCategory('admin').map((step) =>
              <div key={step.id} className="p-4 border rounded-lg" data-id="yg20xlrnu" data-path="src/components/SetupGuidance.tsx">
                  <div className="flex items-start justify-between mb-3" data-id="3504vdfv3" data-path="src/components/SetupGuidance.tsx">
                    <div className="flex items-center gap-3" data-id="tfxze2i9d" data-path="src/components/SetupGuidance.tsx">
                      {getStatusIcon(step.status)}
                      <div data-id="vrgw9sfvf" data-path="src/components/SetupGuidance.tsx">
                        <h4 className="font-semibold" data-id="3nc47l6gg" data-path="src/components/SetupGuidance.tsx">{step.title}</h4>
                        <p className="text-sm text-gray-600" data-id="83las1rb8" data-path="src/components/SetupGuidance.tsx">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2" data-id="p7vd6cfgo" data-path="src/components/SetupGuidance.tsx">
                      {getStatusBadge(step.status)}
                      {getPriorityBadge(step.priority)}
                    </div>
                  </div>
                  
                  {step.tips &&
                <div className="mt-3 p-3 bg-blue-50 rounded-lg" data-id="gaanst4z8" data-path="src/components/SetupGuidance.tsx">
                      <div className="flex items-center gap-2 mb-2" data-id="vjli8l9jw" data-path="src/components/SetupGuidance.tsx">
                        <Lightbulb className="h-4 w-4 text-blue-600" data-id="xciy0d8p6" data-path="src/components/SetupGuidance.tsx" />
                        <span className="text-sm font-medium text-blue-800" data-id="q6kaprcvp" data-path="src/components/SetupGuidance.tsx">Setup Tips:</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1" data-id="4jiq45cdy" data-path="src/components/SetupGuidance.tsx">
                        {step.tips.map((tip, index) =>
                    <li key={index} className="flex items-start gap-2" data-id="ghqt2w1m3" data-path="src/components/SetupGuidance.tsx">
                            <span className="text-blue-500 mt-1" data-id="pczxbx2uf" data-path="src/components/SetupGuidance.tsx">•</span>
                            {tip}
                          </li>
                    )}
                      </ul>
                    </div>
                }
                  
                  <div className="flex items-center justify-between mt-4" data-id="43s3zjq9t" data-path="src/components/SetupGuidance.tsx">
                    <span className="text-sm text-gray-500" data-id="8abmdrbqc" data-path="src/components/SetupGuidance.tsx">
                      Estimated time: {step.estimatedTime}
                    </span>
                    <Button onClick={() => handleStepAction(step)} data-id="yghpts71n" data-path="src/components/SetupGuidance.tsx">
                      {step.actionLabel}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="operations" className="space-y-4" data-id="3ra743uia" data-path="src/components/SetupGuidance.tsx">
              {getStepsByCategory('operations').map((step) =>
              <div key={step.id} className="p-4 border rounded-lg" data-id="xdr81k7x7" data-path="src/components/SetupGuidance.tsx">
                  <div className="flex items-start justify-between mb-3" data-id="u7ca0u038" data-path="src/components/SetupGuidance.tsx">
                    <div className="flex items-center gap-3" data-id="2baqe60s1" data-path="src/components/SetupGuidance.tsx">
                      {getStatusIcon(step.status)}
                      <div data-id="42smy1k11" data-path="src/components/SetupGuidance.tsx">
                        <h4 className="font-semibold" data-id="bpjjgevbm" data-path="src/components/SetupGuidance.tsx">{step.title}</h4>
                        <p className="text-sm text-gray-600" data-id="33lq7cktx" data-path="src/components/SetupGuidance.tsx">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2" data-id="kpglmn3u3" data-path="src/components/SetupGuidance.tsx">
                      {getStatusBadge(step.status)}
                      {getPriorityBadge(step.priority)}
                    </div>
                  </div>
                  
                  {step.dependencies &&
                <div className="mt-2 p-2 bg-yellow-50 rounded text-sm" data-id="9uqbh1521" data-path="src/components/SetupGuidance.tsx">
                      <span className="font-medium text-yellow-800" data-id="asvyyvfoc" data-path="src/components/SetupGuidance.tsx">Prerequisites:</span>
                      <span className="text-yellow-700" data-id="rf5baqdgs" data-path="src/components/SetupGuidance.tsx"> Complete {step.dependencies.join(', ')} first</span>
                    </div>
                }
                  
                  {step.tips &&
                <div className="mt-3 p-3 bg-green-50 rounded-lg" data-id="q381qe9tm" data-path="src/components/SetupGuidance.tsx">
                      <div className="flex items-center gap-2 mb-2" data-id="1auqkrki6" data-path="src/components/SetupGuidance.tsx">
                        <Lightbulb className="h-4 w-4 text-green-600" data-id="xah3x156u" data-path="src/components/SetupGuidance.tsx" />
                        <span className="text-sm font-medium text-green-800" data-id="xqogjewog" data-path="src/components/SetupGuidance.tsx">Best Practices:</span>
                      </div>
                      <ul className="text-sm text-green-700 space-y-1" data-id="jve5f64et" data-path="src/components/SetupGuidance.tsx">
                        {step.tips.map((tip, index) =>
                    <li key={index} className="flex items-start gap-2" data-id="oz5f2u87d" data-path="src/components/SetupGuidance.tsx">
                            <span className="text-green-500 mt-1" data-id="8vign6l1c" data-path="src/components/SetupGuidance.tsx">•</span>
                            {tip}
                          </li>
                    )}
                      </ul>
                    </div>
                }
                  
                  <div className="flex items-center justify-between mt-4" data-id="7zrusf8fx" data-path="src/components/SetupGuidance.tsx">
                    <span className="text-sm text-gray-500" data-id="v1jjprnx7" data-path="src/components/SetupGuidance.tsx">
                      Estimated time: {step.estimatedTime}
                    </span>
                    <Button onClick={() => handleStepAction(step)} data-id="vbxze62g3" data-path="src/components/SetupGuidance.tsx">
                      {step.actionLabel}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4" data-id="683w7yyfu" data-path="src/components/SetupGuidance.tsx">
              {getStepsByCategory('security').concat(getStepsByCategory('testing')).map((step) =>
              <div key={step.id} className="p-4 border rounded-lg" data-id="fc9vedwt1" data-path="src/components/SetupGuidance.tsx">
                  <div className="flex items-start justify-between mb-3" data-id="dr6luklb1" data-path="src/components/SetupGuidance.tsx">
                    <div className="flex items-center gap-3" data-id="kx2yiqfj1" data-path="src/components/SetupGuidance.tsx">
                      {getStatusIcon(step.status)}
                      <div data-id="r3zp2rclp" data-path="src/components/SetupGuidance.tsx">
                        <h4 className="font-semibold" data-id="c5bdfsxlj" data-path="src/components/SetupGuidance.tsx">{step.title}</h4>
                        <p className="text-sm text-gray-600" data-id="x4vhctnvu" data-path="src/components/SetupGuidance.tsx">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2" data-id="t7hco4yuu" data-path="src/components/SetupGuidance.tsx">
                      {getStatusBadge(step.status)}
                      {getPriorityBadge(step.priority)}
                    </div>
                  </div>
                  
                  {step.tips &&
                <div className="mt-3 p-3 bg-purple-50 rounded-lg" data-id="xxbj06gtw" data-path="src/components/SetupGuidance.tsx">
                      <div className="flex items-center gap-2 mb-2" data-id="jsu5wxech" data-path="src/components/SetupGuidance.tsx">
                        <Shield className="h-4 w-4 text-purple-600" data-id="rdjvyjhnx" data-path="src/components/SetupGuidance.tsx" />
                        <span className="text-sm font-medium text-purple-800" data-id="ni4xsz9qu" data-path="src/components/SetupGuidance.tsx">Security Notes:</span>
                      </div>
                      <ul className="text-sm text-purple-700 space-y-1" data-id="u7ezuilzf" data-path="src/components/SetupGuidance.tsx">
                        {step.tips.map((tip, index) =>
                    <li key={index} className="flex items-start gap-2" data-id="jtav91p9o" data-path="src/components/SetupGuidance.tsx">
                            <span className="text-purple-500 mt-1" data-id="by39ac3i3" data-path="src/components/SetupGuidance.tsx">•</span>
                            {tip}
                          </li>
                    )}
                      </ul>
                    </div>
                }
                  
                  <div className="flex items-center justify-between mt-4" data-id="50831ai3u" data-path="src/components/SetupGuidance.tsx">
                    <span className="text-sm text-gray-500" data-id="4m8pvatm4" data-path="src/components/SetupGuidance.tsx">
                      Estimated time: {step.estimatedTime}
                    </span>
                    <Button onClick={() => handleStepAction(step)} data-id="p1k6di4lr" data-path="src/components/SetupGuidance.tsx">
                      {step.actionLabel}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);

};

export default SetupGuidance;