import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Users,
  Database,
  FileText,
  Package,
  Truck,
  DollarSign,
  UserCheck,
  Settings,
  BarChart3,
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Plus,
  Trash2,
  Save,
  Search,
  Copy,
  RotateCcw,
  AlertTriangle,
  Lock,
  Unlock,
  Download,
  Printer,
  Bell,
  Calendar,
  Archive,
  CheckSquare,
  Home,
  Map,
  MoreHorizontal } from
'lucide-react';

interface UserProfile {
  id: number;
  user_id: number;
  role: string;
  station: string;
  employee_id: string;
  phone: string;
  hire_date: string;
  is_active: boolean;
  detailed_permissions: string;
}

interface PagePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  print: boolean;
  approve?: boolean;
  bulk_operations?: boolean;
  advanced_features?: boolean;
}

interface DetailedPermissions {
  [key: string]: PagePermission;
}

const defaultPagePermission: PagePermission = {
  view: false,
  create: false,
  edit: false,
  delete: false,
  export: false,
  print: false,
  approve: false,
  bulk_operations: false,
  advanced_features: false
};

// Comprehensive page definitions with all system pages
const pageGroups = {
  'Core Operations': [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    color: 'text-blue-600',
    description: 'Main overview, analytics, quick access toolbar',
    features: ['View reports', 'Quick actions', 'Analytics widgets']
  },
  {
    key: 'products',
    label: 'Products Management',
    icon: Package,
    color: 'text-green-600',
    description: 'Product inventory, pricing, barcode scanning',
    features: ['Add/Edit products', 'Barcode scanning', 'Price management', 'Stock tracking']
  },
  {
    key: 'product_form',
    label: 'Product Form',
    icon: Edit,
    color: 'text-green-500',
    description: 'Add and edit individual product records',
    features: ['Product creation', 'Information editing', 'File uploads']
  }],


  'Sales & Reporting': [
  {
    key: 'sales_reports',
    label: 'Sales Reports List',
    icon: FileText,
    color: 'text-orange-600',
    description: 'Daily sales reporting, enhanced print dialogs',
    features: ['View sales reports', 'Print enhanced reports', 'Export data']
  },
  {
    key: 'sales_report_form',
    label: 'Sales Report Form',
    icon: Edit,
    color: 'text-orange-500',
    description: 'Create and edit daily sales reports',
    features: ['Gas/grocery sales', 'Lottery sales', 'Expenses', 'Document uploads', 'Cash collection']
  }],


  'Human Resources': [
  {
    key: 'employees',
    label: 'Employee List',
    icon: Users,
    color: 'text-purple-600',
    description: 'Employee records and information management',
    features: ['View employees', 'Add/Edit employees', 'Search/Filter']
  },
  {
    key: 'employee_form',
    label: 'Employee Form',
    icon: UserCheck,
    color: 'text-purple-500',
    description: 'Add and edit employee records with file uploads',
    features: ['Employee creation', 'Document uploads', 'Contact management']
  },
  {
    key: 'salary',
    label: 'Salary List',
    icon: DollarSign,
    color: 'text-yellow-600',
    description: 'Payroll processing and salary records',
    features: ['View salary records', 'Pay period management', 'Export reports']
  },
  {
    key: 'salary_form',
    label: 'Salary Form',
    icon: Calendar,
    color: 'text-yellow-500',
    description: 'Create and edit salary records',
    features: ['Payroll processing', 'Deduction calculations', 'Pay period setup']
  }],


  'Business Operations': [
  {
    key: 'vendors',
    label: 'Vendor List',
    icon: Building2,
    color: 'text-teal-600',
    description: 'Supplier relationships and vendor contacts',
    features: ['View vendors', 'Add/Edit vendors', 'Contact management']
  },
  {
    key: 'vendor_form',
    label: 'Vendor Form',
    icon: Building2,
    color: 'text-teal-500',
    description: 'Add and edit vendor information',
    features: ['Vendor creation', 'Contact details', 'Payment terms']
  },
  {
    key: 'orders',
    label: 'Order List',
    icon: Truck,
    color: 'text-indigo-600',
    description: 'Purchase orders and inventory ordering',
    features: ['View orders', 'Order tracking', 'Status management']
  },
  {
    key: 'order_form',
    label: 'Order Form',
    icon: Archive,
    color: 'text-indigo-500',
    description: 'Create and edit purchase orders',
    features: ['Order creation', 'Item selection', 'Vendor management']
  }],


  'Delivery & Inventory': [
  {
    key: 'delivery',
    label: 'Delivery List',
    icon: Truck,
    color: 'text-pink-600',
    description: 'Fuel delivery tracking with enhanced print dialogs',
    features: ['View deliveries', 'Enhanced print reports', 'BOL tracking']
  },
  {
    key: 'delivery_form',
    label: 'Delivery Form',
    icon: Map,
    color: 'text-pink-500',
    description: 'Create and edit delivery records',
    features: ['Delivery creation', 'Tank volume tracking', 'BOL management']
  },
  {
    key: 'inventory_alerts',
    label: 'Inventory Alerts',
    icon: Bell,
    color: 'text-red-600',
    description: 'Stock level alerts and notifications',
    features: ['View alerts', 'Stock monitoring', 'Alert management']
  },
  {
    key: 'alert_settings',
    label: 'Alert Settings',
    icon: Settings,
    color: 'text-red-500',
    description: 'Configure inventory alert thresholds',
    features: ['Alert configuration', 'Threshold settings', 'Notification preferences']
  },
  {
    key: 'gas_delivery_inventory',
    label: 'Gas Delivery Inventory',
    icon: Database,
    color: 'text-cyan-600',
    description: 'Gas tank monitoring and delivery tracking',
    features: ['Tank levels', 'Delivery tracking', 'Volume calculations']
  }],


  'Compliance & Licensing': [
  {
    key: 'licenses',
    label: 'License List',
    icon: Shield,
    color: 'text-red-600',
    description: 'Business licenses and regulatory compliance with enhanced print',
    features: ['View licenses', 'Enhanced print dialogs', 'Expiry tracking']
  },
  {
    key: 'license_form',
    label: 'License Form',
    icon: CheckSquare,
    color: 'text-red-500',
    description: 'Add and edit license records with file uploads',
    features: ['License creation', 'Document uploads', 'Expiry management']
  }],


  'System Administration': [
  {
    key: 'settings',
    label: 'App Settings',
    icon: Settings,
    color: 'text-gray-600',
    description: 'Application configuration, image compression, demo features',
    features: ['App configuration', 'Image compression settings', 'System preferences']
  },
  {
    key: 'user_management',
    label: 'User Management',
    icon: UserCheck,
    color: 'text-red-600',
    description: 'User accounts, permission management, enhanced controls',
    features: ['User accounts', 'Permission management', 'Enhanced controls']
  },
  {
    key: 'site_management',
    label: 'Site Management',
    icon: Building2,
    color: 'text-blue-600',
    description: 'Multi-station configuration and management',
    features: ['Station configuration', 'Site settings', 'Multi-location management']
  },
  {
    key: 'system_logs',
    label: 'System Logs',
    icon: FileText,
    color: 'text-gray-600',
    description: 'System activity and audit trails',
    features: ['Activity logs', 'Audit trails', 'System monitoring']
  },
  {
    key: 'security_settings',
    label: 'Security Settings',
    icon: Shield,
    color: 'text-red-600',
    description: 'Security policies and authentication settings',
    features: ['Security policies', 'Authentication settings', 'Access controls']
  }]

};

// Enhanced permission types with descriptions
const permissionTypes = [
{ key: 'view', label: 'View', icon: Eye, description: 'Can view and access the page/content', color: 'text-blue-600' },
{ key: 'create', label: 'Add/Create', icon: Plus, description: 'Can use Add buttons and create new records', color: 'text-green-600' },
{ key: 'edit', label: 'Edit/Modify', icon: Edit, description: 'Can use Edit buttons and modify existing records', color: 'text-yellow-600' },
{ key: 'delete', label: 'Delete', icon: Trash2, description: 'Can delete records and use delete buttons', color: 'text-red-600' },
{ key: 'export', label: 'Export', icon: Download, description: 'Can export data to files (CSV, Excel, etc.)', color: 'text-purple-600' },
{ key: 'print', label: 'Print', icon: Printer, description: 'Can print reports and use enhanced print dialogs', color: 'text-indigo-600' },
{ key: 'approve', label: 'Approve', icon: CheckCircle2, description: 'Can approve transactions and records', color: 'text-green-700' },
{ key: 'bulk_operations', label: 'Bulk Ops', icon: MoreHorizontal, description: 'Can perform bulk operations on multiple records', color: 'text-orange-600' },
{ key: 'advanced_features', label: 'Advanced', icon: Settings, description: 'Can access advanced features and configurations', color: 'text-gray-700' }];


// Enhanced role templates with detailed descriptions
const roleTemplates = {
  Administrator: 'Full system access including all pages, buttons, and administrative functions',
  Management: 'Full operational access with limited system administration capabilities',
  'Station Manager': 'Complete station operations with inventory, sales, and delivery management',
  Employee: 'Basic operational access to daily tasks and reporting',
  Cashier: 'Sales reporting and basic inventory viewing with limited editing',
  'Custom': 'Manually configured permissions for specific business needs'
};

interface ComprehensivePermissionDialogProps {
  trigger: React.ReactNode;
  selectedUserId?: number;
}

const ComprehensivePermissionDialog: React.FC<ComprehensivePermissionDialogProps> = ({
  trigger,
  selectedUserId
}) => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<DetailedPermissions>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [activeTemplate, setActiveTemplate] = useState<string>('Custom');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchUserProfiles();
    }
  }, [open]);

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUserId && userProfiles.length > 0) {
      const user = userProfiles.find((u) => u.id === selectedUserId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [selectedUserId, userProfiles]);

  const fetchUserProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(11725, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;
      setUserProfiles(data?.List || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: "Error",
        description: `Failed to fetch user profiles: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPermissions = (user: UserProfile) => {
    try {
      if (user.detailed_permissions) {
        const existingPermissions = JSON.parse(user.detailed_permissions);
        setPermissions(existingPermissions);
        setActiveTemplate('Custom');
      } else {
        applyRoleTemplate(user.role, false);
      }
    } catch (error) {
      console.error('Error parsing permissions:', error);
      applyRoleTemplate(user.role, false);
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = userProfiles.find((u) => u.id.toString() === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handlePermissionChange = (pageKey: string, permissionType: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [pageKey]: {
        ...(prev[pageKey] || defaultPagePermission),
        [permissionType]: value
      }
    }));
    setActiveTemplate('Custom');
  };

  const handleBulkPermissionChange = (pageKey: string, action: 'grant_all' | 'revoke_all' | 'view_only' | 'operational') => {
    const newPagePermissions = { ...defaultPagePermission };

    switch (action) {
      case 'grant_all':
        permissionTypes.forEach((type) => {
          newPagePermissions[type.key as keyof PagePermission] = true;
        });
        break;
      case 'operational':
        newPagePermissions.view = true;
        newPagePermissions.create = true;
        newPagePermissions.edit = true;
        newPagePermissions.export = true;
        newPagePermissions.print = true;
        break;
      case 'view_only':
        newPagePermissions.view = true;
        newPagePermissions.export = true;
        break;
      case 'revoke_all':
        // All permissions remain false
        break;
    }

    setPermissions((prev) => ({
      ...prev,
      [pageKey]: newPagePermissions
    }));
    setActiveTemplate('Custom');
  };

  const handleGroupPermissionChange = (groupName: string, action: 'grant_all' | 'revoke_all' | 'view_only' | 'operational') => {
    const groupPages = pageGroups[groupName as keyof typeof pageGroups] || [];
    const newPermissions = { ...permissions };

    groupPages.forEach((page) => {
      const newPagePermissions = { ...defaultPagePermission };

      switch (action) {
        case 'grant_all':
          permissionTypes.forEach((type) => {
            newPagePermissions[type.key as keyof PagePermission] = true;
          });
          break;
        case 'operational':
          newPagePermissions.view = true;
          newPagePermissions.create = true;
          newPagePermissions.edit = true;
          newPagePermissions.export = true;
          newPagePermissions.print = true;
          break;
        case 'view_only':
          newPagePermissions.view = true;
          newPagePermissions.export = true;
          break;
        case 'revoke_all':
          // All permissions remain false
          break;
      }

      newPermissions[page.key] = newPagePermissions;
    });

    setPermissions(newPermissions);
    setActiveTemplate('Custom');
  };

  const applyRoleTemplate = (role: string, showToast: boolean = true) => {
    let newPermissions: DetailedPermissions = {};

    // Initialize all pages with default permissions
    Object.values(pageGroups).flat().forEach((page) => {
      newPermissions[page.key] = { ...defaultPagePermission };
    });

    switch (role) {
      case 'Administrator':
        // Full access to everything
        Object.keys(newPermissions).forEach((pageKey) => {
          permissionTypes.forEach((type) => {
            newPermissions[pageKey][type.key as keyof PagePermission] = true;
          });
        });
        break;

      case 'Management':
        // Full access to operations, limited admin access
        const managementPages = [
        'dashboard', 'products', 'product_form', 'employees', 'employee_form',
        'sales_reports', 'sales_report_form', 'vendors', 'vendor_form',
        'orders', 'order_form', 'delivery', 'delivery_form', 'licenses',
        'license_form', 'inventory_alerts', 'alert_settings', 'gas_delivery_inventory',
        'salary', 'salary_form'];

        managementPages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            permissionTypes.forEach((type) => {
              newPermissions[pageKey][type.key as keyof PagePermission] = true;
            });
          }
        });
        // Limited admin access
        const limitedAdminPages = ['settings', 'user_management'];
        limitedAdminPages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            newPermissions[pageKey].view = true;
            newPermissions[pageKey].edit = true;
            newPermissions[pageKey].export = true;
          }
        });
        break;

      case 'Station Manager':
        // Full operational access for station management
        const stationManagerPages = [
        'dashboard', 'products', 'product_form', 'sales_reports', 'sales_report_form',
        'delivery', 'delivery_form', 'inventory_alerts', 'alert_settings', 'gas_delivery_inventory'];

        stationManagerPages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            permissionTypes.slice(0, 6).forEach((type) => {// Exclude advanced permissions
              newPermissions[pageKey][type.key as keyof PagePermission] = true;
            });
          }
        });
        // View access to other operational areas
        const viewOnlyPages = ['employees', 'employee_form', 'vendors', 'vendor_form', 'orders', 'order_form', 'licenses', 'license_form', 'salary'];
        viewOnlyPages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            newPermissions[pageKey].view = true;
            newPermissions[pageKey].export = true;
            newPermissions[pageKey].print = true;
          }
        });
        break;

      case 'Employee':
        // Basic operational access
        const employeePages = ['dashboard', 'sales_reports', 'sales_report_form', 'delivery', 'delivery_form'];
        employeePages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            newPermissions[pageKey].view = true;
            newPermissions[pageKey].create = true;
            newPermissions[pageKey].edit = true;
            newPermissions[pageKey].print = true;
          }
        });
        // View-only access to products and inventory
        const employeeViewPages = ['products', 'inventory_alerts', 'gas_delivery_inventory'];
        employeeViewPages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            newPermissions[pageKey].view = true;
          }
        });
        break;

      case 'Cashier':
        // Sales and basic inventory access
        newPermissions['dashboard'].view = true;
        newPermissions['sales_reports'].view = true;
        newPermissions['sales_reports'].export = true;
        newPermissions['sales_reports'].print = true;
        newPermissions['sales_report_form'].view = true;
        newPermissions['sales_report_form'].create = true;
        newPermissions['sales_report_form'].edit = true;
        newPermissions['products'].view = true;
        newPermissions['inventory_alerts'].view = true;
        newPermissions['gas_delivery_inventory'].view = true;
        break;

      default:
        // Custom or unknown role - minimal access
        newPermissions['dashboard'].view = true;
        break;
    }

    setPermissions(newPermissions);
    setActiveTemplate(role);

    if (showToast) {
      toast({
        title: "Template Applied",
        description: `${role} permission template has been applied`
      });
    }
  };

  const savePermissions = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      const { error } = await window.ezsite.apis.tableUpdate(11725, {
        id: selectedUser.id,
        detailed_permissions: JSON.stringify(permissions)
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User permissions updated successfully"
      });

      // Update local state
      setUserProfiles((prev) => prev.map((user) =>
      user.id === selectedUser.id ?
      { ...user, detailed_permissions: JSON.stringify(permissions) } :
      user
      ));
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error",
        description: `Failed to save permissions: ${error}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getPermissionSummary = (user: UserProfile) => {
    try {
      const userPermissions = user.detailed_permissions ?
      JSON.parse(user.detailed_permissions) :
      {};

      const totalPages = Object.values(pageGroups).flat().length;
      const pagesWithAccess = Object.values(pageGroups).flat().filter((page) =>
      userPermissions[page.key]?.view
      ).length;

      return `${pagesWithAccess}/${totalPages}`;
    } catch {
      return '0';
    }
  };

  const filteredUsers = userProfiles.filter((user) => {
    const matchesSearch =
    user.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} data-id="65ijpc519" data-path="src/components/ComprehensivePermissionDialog.tsx">
      <DialogTrigger asChild data-id="w0p2pa39c" data-path="src/components/ComprehensivePermissionDialog.tsx">
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden" data-id="57swavewo" data-path="src/components/ComprehensivePermissionDialog.tsx">
        <DialogHeader data-id="3q72qb9qv" data-path="src/components/ComprehensivePermissionDialog.tsx">
          <DialogTitle className="flex items-center space-x-2" data-id="miwd1ea8c" data-path="src/components/ComprehensivePermissionDialog.tsx">
            <Shield className="w-6 h-6 text-blue-600" data-id="17al0u436" data-path="src/components/ComprehensivePermissionDialog.tsx" />
            <span data-id="jruh2d8ww" data-path="src/components/ComprehensivePermissionDialog.tsx">Comprehensive User Permission Management</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden" data-id="2sjgfn073" data-path="src/components/ComprehensivePermissionDialog.tsx">
          <ScrollArea className="h-full" data-id="d42nlfv1b" data-path="src/components/ComprehensivePermissionDialog.tsx">
            <div className="space-y-6 pr-4" data-id="rdfabz9dm" data-path="src/components/ComprehensivePermissionDialog.tsx">
              {/* User Selection */}
              <Card data-id="t64xa0b1n" data-path="src/components/ComprehensivePermissionDialog.tsx">
                <CardHeader data-id="dhcxbs3ge" data-path="src/components/ComprehensivePermissionDialog.tsx">
                  <CardTitle className="flex items-center space-x-2" data-id="kkrzm8l67" data-path="src/components/ComprehensivePermissionDialog.tsx">
                    <Users className="w-5 h-5" data-id="a1aotr2ha" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                    <span data-id="0ayes67ja" data-path="src/components/ComprehensivePermissionDialog.tsx">Select User & Apply Templates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" data-id="xjkuoqmy1" data-path="src/components/ComprehensivePermissionDialog.tsx">
                  {loading ?
                  <div className="text-center py-4" data-id="i81u1xj05" data-path="src/components/ComprehensivePermissionDialog.tsx">Loading users...</div> :

                  <>
                      {/* Search and Filter */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="cx8swhnw9" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        <div className="relative" data-id="oo6z6tn8s" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="tf16uj5b5" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                          <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10" data-id="m1qq0gdib" data-path="src/components/ComprehensivePermissionDialog.tsx" />

                        </div>
                        <Select value={selectedRole} onValueChange={setSelectedRole} data-id="7uph4xx10" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <SelectTrigger data-id="j2ezsex0m" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <SelectValue placeholder="Filter by role" data-id="ibg5dgg8z" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                          </SelectTrigger>
                          <SelectContent data-id="hmdfkprmq" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <SelectItem value="All" data-id="8ajr5gqng" data-path="src/components/ComprehensivePermissionDialog.tsx">All Roles</SelectItem>
                            <SelectItem value="Administrator" data-id="10qhcjbcr" data-path="src/components/ComprehensivePermissionDialog.tsx">Administrator</SelectItem>
                            <SelectItem value="Management" data-id="540yf0ibw" data-path="src/components/ComprehensivePermissionDialog.tsx">Management</SelectItem>
                            <SelectItem value="Station Manager" data-id="vfq0gv00q" data-path="src/components/ComprehensivePermissionDialog.tsx">Station Manager</SelectItem>
                            <SelectItem value="Employee" data-id="sqiw8k60h" data-path="src/components/ComprehensivePermissionDialog.tsx">Employee</SelectItem>
                            <SelectItem value="Cashier" data-id="m1ismj212" data-path="src/components/ComprehensivePermissionDialog.tsx">Cashier</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select onValueChange={handleUserSelect} value={selectedUser?.id.toString() || ''} data-id="1z0d2krv5" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <SelectTrigger data-id="bpoyr3pkf" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <SelectValue placeholder="Select user to manage" data-id="e05ckscra" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                          </SelectTrigger>
                          <SelectContent data-id="89ugdlkz6" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            {filteredUsers.map((user) =>
                          <SelectItem key={user.id} value={user.id.toString()} data-id="r9v6xw1f9" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                <div className="flex items-center justify-between w-full" data-id="i7kxkslmq" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                  <span data-id="7ufhbumdf" data-path="src/components/ComprehensivePermissionDialog.tsx">{user.employee_id} - {user.role}</span>
                                  <Badge variant="outline" className="ml-2" data-id="bzw0hdu9q" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                    {getPermissionSummary(user)}
                                  </Badge>
                                </div>
                              </SelectItem>
                          )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Selected User Info */}
                      {selectedUser &&
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border" data-id="vrmad2njy" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <div className="flex items-center justify-between" data-id="3qatnapuy" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <div data-id="23a415qib" data-path="src/components/ComprehensivePermissionDialog.tsx">
                              <h3 className="font-semibold text-lg" data-id="3bzgl6siv" data-path="src/components/ComprehensivePermissionDialog.tsx">{selectedUser.employee_id}</h3>
                              <p className="text-sm text-gray-600" data-id="a54ozgoag" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                Role: {selectedUser.role} | Station: {selectedUser.station}
                              </p>
                            </div>
                            <div className="text-right space-y-2" data-id="gwc6gfbor" data-path="src/components/ComprehensivePermissionDialog.tsx">
                              <Badge className={selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} data-id="aqq4duvno" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                {selectedUser.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <div className="text-xs text-gray-500" data-id="ji6s5oo5e" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                Template: {activeTemplate}
                              </div>
                            </div>
                          </div>
                        </div>
                    }

                      {/* Role Templates */}
                      {selectedUser &&
                    <div className="space-y-3" data-id="rpfkktohg" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <Label className="text-sm font-medium" data-id="ztjbw2uz4" data-path="src/components/ComprehensivePermissionDialog.tsx">Quick Permission Templates</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2" data-id="ijl9kw5mn" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            {Object.entries(roleTemplates).map(([role, description]) =>
                        <Button
                          key={role}
                          variant={activeTemplate === role ? "default" : "outline"}
                          size="sm"
                          onClick={() => applyRoleTemplate(role)}
                          className="text-xs h-auto py-2 px-3 flex flex-col items-center space-y-1"
                          title={description} data-id="lcb8g35zr" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                <span className="font-medium" data-id="0r23yrq60" data-path="src/components/ComprehensivePermissionDialog.tsx">{role}</span>
                              </Button>
                        )}
                          </div>
                        </div>
                    }
                    </>
                  }
                </CardContent>
              </Card>

              {/* Permission Management */}
              {selectedUser &&
              <Card data-id="m50cf9ils" data-path="src/components/ComprehensivePermissionDialog.tsx">
                  <CardHeader data-id="1nyq616tl" data-path="src/components/ComprehensivePermissionDialog.tsx">
                    <div className="flex items-center justify-between" data-id="v194dmy7d" data-path="src/components/ComprehensivePermissionDialog.tsx">
                      <CardTitle className="flex items-center space-x-2" data-id="mmtj50py7" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        <Shield className="w-5 h-5" data-id="2pkyq4epm" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                        <span data-id="42qpmtixd" data-path="src/components/ComprehensivePermissionDialog.tsx">Detailed Permissions for {selectedUser.employee_id}</span>
                      </CardTitle>
                      <Button
                      onClick={savePermissions}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700" data-id="ih2t9uox4" data-path="src/components/ComprehensivePermissionDialog.tsx">

                        <Save className="w-4 h-4 mr-2" data-id="rv3ebknf7" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                        {saving ? 'Saving...' : 'Save Permissions'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent data-id="5xbl3su13" data-path="src/components/ComprehensivePermissionDialog.tsx">
                    <Tabs defaultValue="by-groups" className="w-full" data-id="z2owbua49" data-path="src/components/ComprehensivePermissionDialog.tsx">
                      <TabsList className="grid w-full grid-cols-2" data-id="tulwshqgk" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        <TabsTrigger value="by-groups" data-id="g8bs793wa" data-path="src/components/ComprehensivePermissionDialog.tsx">By Page Groups</TabsTrigger>
                        <TabsTrigger value="matrix-view" data-id="ljq0qswwu" data-path="src/components/ComprehensivePermissionDialog.tsx">Matrix View</TabsTrigger>
                      </TabsList>

                      <TabsContent value="by-groups" className="space-y-6" data-id="rwjh785eb" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        {Object.entries(pageGroups).map(([groupName, pages]) =>
                      <Card key={groupName} className="border-l-4 border-l-blue-500" data-id="na9jpmpg4" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <CardHeader className="pb-3" data-id="bkev4dcl5" data-path="src/components/ComprehensivePermissionDialog.tsx">
                              <div className="flex items-center justify-between" data-id="vjouhlp6a" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                <CardTitle className="text-lg" data-id="fd0j4qppm" data-path="src/components/ComprehensivePermissionDialog.tsx">{groupName}</CardTitle>
                                <div className="flex space-x-2" data-id="b7m3lb4f0" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGroupPermissionChange(groupName, 'view_only')}
                                className="text-blue-600" data-id="0eoiyw2pn" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                    <Eye className="w-3 h-3 mr-1" data-id="p4m33kjzb" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                    View Only
                                  </Button>
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGroupPermissionChange(groupName, 'operational')}
                                className="text-orange-600" data-id="1jl677xrm" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                    <Settings className="w-3 h-3 mr-1" data-id="63er8dh1i" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                    Operational
                                  </Button>
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGroupPermissionChange(groupName, 'grant_all')}
                                className="text-green-600" data-id="2ywtbeiwj" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                    <CheckCircle2 className="w-3 h-3 mr-1" data-id="t1khxcta1" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                    Full Access
                                  </Button>
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGroupPermissionChange(groupName, 'revoke_all')}
                                className="text-red-600" data-id="mjo6qnoyc" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                    <XCircle className="w-3 h-3 mr-1" data-id="ek7vo82yj" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                    No Access
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent data-id="b9qt7grgh" data-path="src/components/ComprehensivePermissionDialog.tsx">
                              <div className="space-y-4" data-id="d9p2qu1t2" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                {pages.map((page) => {
                              const pagePermissions = permissions[page.key] || defaultPagePermission;
                              return (
                                <div key={page.key} className="border rounded-lg p-4" data-id="amfgv2emn" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                      <div className="flex items-start justify-between mb-3" data-id="vwu5vr6dt" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                        <div className="flex items-center space-x-3" data-id="5h6m5331o" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                          <page.icon className={`w-5 h-5 ${page.color}`} data-id="425c757qk" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                          <div data-id="9gklx3f6c" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                            <h4 className="font-medium" data-id="fkdwkjvjp" data-path="src/components/ComprehensivePermissionDialog.tsx">{page.label}</h4>
                                            <p className="text-xs text-gray-500" data-id="7t2womzw1" data-path="src/components/ComprehensivePermissionDialog.tsx">{page.description}</p>
                                            {page.features &&
                                        <div className="mt-1" data-id="x929q0kqd" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                                {page.features.map((feature, idx) =>
                                          <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1" data-id="nocf6qsat" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                                    {feature}
                                                  </Badge>
                                          )}
                                              </div>
                                        }
                                          </div>
                                        </div>
                                        <div className="flex space-x-1" data-id="uttldrycc" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                          <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkPermissionChange(page.key, 'view_only')}
                                        className="text-blue-600 text-xs px-2 py-1" data-id="drea5ej0p" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                            View
                                          </Button>
                                          <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkPermissionChange(page.key, 'operational')}
                                        className="text-orange-600 text-xs px-2 py-1" data-id="hiteu6adm" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                            Ops
                                          </Button>
                                          <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkPermissionChange(page.key, 'grant_all')}
                                        className="text-green-600 text-xs px-2 py-1" data-id="zezd2358l" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                            <CheckCircle2 className="w-3 h-3" data-id="wjnc3u6s8" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                          </Button>
                                          <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkPermissionChange(page.key, 'revoke_all')}
                                        className="text-red-600 text-xs px-2 py-1" data-id="459fs5oxp" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                            <XCircle className="w-3 h-3" data-id="y646avx3x" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3" data-id="r2aksgd4v" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                        {permissionTypes.map((type) =>
                                    <div key={type.key} className="flex items-center space-x-2 p-2 border rounded" data-id="97lela3ds" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                            <Switch
                                        checked={pagePermissions[type.key as keyof PagePermission] || false}
                                        onCheckedChange={(checked) =>
                                        handlePermissionChange(page.key, type.key, checked)
                                        }
                                        id={`${page.key}-${type.key}`} data-id="7yntyt1zu" data-path="src/components/ComprehensivePermissionDialog.tsx" />

                                            <Label
                                        htmlFor={`${page.key}-${type.key}`}
                                        className="text-xs cursor-pointer flex items-center space-x-1" data-id="hbth1zjx7" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                              <type.icon className={`w-3 h-3 ${type.color}`} data-id="52115gmps" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                              <span data-id="1ke0hot6s" data-path="src/components/ComprehensivePermissionDialog.tsx">{type.label}</span>
                                            </Label>
                                          </div>
                                    )}
                                      </div>
                                    </div>);

                            })}
                              </div>
                            </CardContent>
                          </Card>
                      )}
                      </TabsContent>

                      <TabsContent value="matrix-view" data-id="2m4m8h65q" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        <div className="overflow-x-auto" data-id="gm1jgog86" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <table className="w-full border-collapse border" data-id="oclvx4nvd" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <thead className="sticky top-0 bg-white z-10" data-id="l97e6jtm6" data-path="src/components/ComprehensivePermissionDialog.tsx">
                              <tr className="border-b" data-id="vhg1dacuc" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                <th className="text-left p-3 font-semibold bg-white border min-w-48" data-id="ilea1axjs" data-path="src/components/ComprehensivePermissionDialog.tsx">Page</th>
                                {permissionTypes.map((type) =>
                              <th key={type.key} className="text-center p-3 font-semibold min-w-20 bg-white border" data-id="buwz8ws85" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                    <div className="flex flex-col items-center space-y-1" data-id="6n4ljevv7" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                      <type.icon className={`w-4 h-4 ${type.color}`} data-id="jxmk61pl0" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                      <span className="text-xs" data-id="u01sfky5w" data-path="src/components/ComprehensivePermissionDialog.tsx">{type.label}</span>
                                    </div>
                                  </th>
                              )}
                                <th className="text-center p-3 font-semibold bg-white border" data-id="z44dq8444" data-path="src/components/ComprehensivePermissionDialog.tsx">Quick Actions</th>
                              </tr>
                            </thead>
                            <tbody data-id="jiyb20u9g" data-path="src/components/ComprehensivePermissionDialog.tsx">
                              {Object.entries(pageGroups).map(([groupName, pages]) =>
                            <React.Fragment key={groupName} data-id="9ifr6svyw" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                  <tr className="bg-gray-100" data-id="ame0uo5lj" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                    <td colSpan={permissionTypes.length + 2} className="p-2 font-semibold text-sm border" data-id="5ycrcryrk" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                      {groupName}
                                    </td>
                                  </tr>
                                  {pages.map((page) => {
                                const pagePermissions = permissions[page.key] || defaultPagePermission;
                                return (
                                  <tr key={page.key} className="border-b hover:bg-gray-50" data-id="nvvxoe8jm" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                        <td className="p-3 border" data-id="we88sfb8s" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                          <div className="flex items-center space-x-3" data-id="9foxjqckw" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                            <page.icon className={`w-4 h-4 ${page.color}`} data-id="3w6vgxh8w" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                            <div data-id="aavaiv7nk" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                              <span className="font-medium text-sm" data-id="p3yz4wlxk" data-path="src/components/ComprehensivePermissionDialog.tsx">{page.label}</span>
                                              <p className="text-xs text-gray-500" data-id="o3hxwrc6j" data-path="src/components/ComprehensivePermissionDialog.tsx">{page.description}</p>
                                            </div>
                                          </div>
                                        </td>
                                        {permissionTypes.map((type) =>
                                    <td key={type.key} className="text-center p-3 border" data-id="hd295cxad" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                            <Switch
                                        checked={pagePermissions[type.key as keyof PagePermission] || false}
                                        onCheckedChange={(checked) =>
                                        handlePermissionChange(page.key, type.key, checked)
                                        } data-id="tvu9zocux" data-path="src/components/ComprehensivePermissionDialog.tsx" />

                                          </td>
                                    )}
                                        <td className="text-center p-3 border" data-id="d5sdjeo3s" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                          <div className="flex space-x-1 justify-center" data-id="vt741ur4x" data-path="src/components/ComprehensivePermissionDialog.tsx">
                                            <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleBulkPermissionChange(page.key, 'grant_all')}
                                          className="text-green-600 hover:text-green-700"
                                          title="Grant all permissions" data-id="zx1txtzki" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                              <CheckCircle2 className="w-3 h-3" data-id="nitlki05w" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                            </Button>
                                            <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleBulkPermissionChange(page.key, 'revoke_all')}
                                          className="text-red-600 hover:text-red-700"
                                          title="Revoke all permissions" data-id="dgzg4e49t" data-path="src/components/ComprehensivePermissionDialog.tsx">

                                              <XCircle className="w-3 h-3" data-id="z9z3k64lt" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>);

                              })}
                                </React.Fragment>
                            )}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Permission Summary */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg" data-id="romfo2syl" data-path="src/components/ComprehensivePermissionDialog.tsx">
                      <h4 className="font-semibold mb-3 flex items-center" data-id="ocpgwi9k8" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        <AlertTriangle className="w-4 h-4 mr-2 text-blue-600" data-id="nc6feid33" data-path="src/components/ComprehensivePermissionDialog.tsx" />
                        Permission Summary & Add/Edit Button Controls
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" data-id="pwwle4ecx" data-path="src/components/ComprehensivePermissionDialog.tsx">
                        <div data-id="k5mes00mw" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <p className="font-medium mb-2" data-id="ekez0lf4s" data-path="src/components/ComprehensivePermissionDialog.tsx">Button Controls:</p>
                          <ul className="space-y-1 text-gray-600" data-id="s5batcs6o" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            <li data-id="fv0r1ve3m" data-path="src/components/ComprehensivePermissionDialog.tsx">• <strong data-id="k35kp52ld" data-path="src/components/ComprehensivePermissionDialog.tsx">Add/Create:</strong> Controls "Add" buttons throughout the system</li>
                            <li data-id="y754em1vx" data-path="src/components/ComprehensivePermissionDialog.tsx">• <strong data-id="y6sn00lcq" data-path="src/components/ComprehensivePermissionDialog.tsx">Edit/Modify:</strong> Controls "Edit" buttons and modification features</li>
                            <li data-id="9uc9syvwq" data-path="src/components/ComprehensivePermissionDialog.tsx">• <strong data-id="ao9qwaphl" data-path="src/components/ComprehensivePermissionDialog.tsx">Delete:</strong> Controls delete actions and buttons</li>
                            <li data-id="mrvdrmbtu" data-path="src/components/ComprehensivePermissionDialog.tsx">• <strong data-id="v8dvsc207" data-path="src/components/ComprehensivePermissionDialog.tsx">Print:</strong> Controls enhanced print dialogs and report printing</li>
                          </ul>
                        </div>
                        <div data-id="wqwqyp7vf" data-path="src/components/ComprehensivePermissionDialog.tsx">
                          <p className="font-medium mb-2" data-id="1h43a9kvy" data-path="src/components/ComprehensivePermissionDialog.tsx">Current Configuration:</p>
                          <Badge variant="outline" className="mb-2" data-id="8jugrerrk" data-path="src/components/ComprehensivePermissionDialog.tsx">{activeTemplate}</Badge>
                          <p className="text-gray-600 text-xs" data-id="u5nw4ctt5" data-path="src/components/ComprehensivePermissionDialog.tsx">
                            {roleTemplates[activeTemplate as keyof typeof roleTemplates] || 'Custom permissions configured'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              }
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>);

};

export default ComprehensivePermissionDialog;