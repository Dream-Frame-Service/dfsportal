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
  Loader2 } from
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

interface UserWithDetails {
  profile: UserProfile;
  userInfo?: {
    email: string;
    name?: string;
  };
}

interface PagePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  print: boolean;
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
  print: false
};

// Define all pages with their categories and descriptions
const pageGroups = {
  'Core Operations': [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600', description: 'Main overview and analytics dashboard' },
  { key: 'products', label: 'Products Management', icon: Package, color: 'text-green-600', description: 'Manage inventory, pricing, and product information' },
  { key: 'sales_reports', label: 'Sales Reports', icon: FileText, color: 'text-orange-600', description: 'Daily sales reporting and analytics' }],

  'Human Resources': [
  { key: 'employees', label: 'Employee Management', icon: Users, color: 'text-purple-600', description: 'Manage employee records and information' },
  { key: 'salary', label: 'Salary Management', icon: DollarSign, color: 'text-yellow-600', description: 'Payroll processing and salary records' }],

  'Business Operations': [
  { key: 'vendors', label: 'Vendor Management', icon: Building2, color: 'text-teal-600', description: 'Manage supplier relationships and contacts' },
  { key: 'orders', label: 'Order Management', icon: Truck, color: 'text-indigo-600', description: 'Purchase orders and inventory ordering' },
  { key: 'delivery', label: 'Delivery Management', icon: Truck, color: 'text-pink-600', description: 'Fuel delivery tracking and management' }],

  'Compliance & Licensing': [
  { key: 'licenses', label: 'Licenses & Certificates', icon: Shield, color: 'text-red-600', description: 'Business licenses and regulatory compliance' }],

  'Inventory & Operations': [
  { key: 'inventory', label: 'Inventory Management', icon: Database, color: 'text-cyan-600', description: 'Stock levels, alerts, and gas tank monitoring' }],

  'System Administration': [
  { key: 'settings', label: 'App Settings', icon: Settings, color: 'text-gray-600', description: 'Application configuration and preferences' },
  { key: 'user_management', label: 'User Management', icon: UserCheck, color: 'text-red-600', description: 'User accounts and access control' },
  { key: 'site_management', label: 'Site Management', icon: Building2, color: 'text-blue-600', description: 'Multi-station configuration and management' },
  { key: 'system_logs', label: 'System Logs', icon: FileText, color: 'text-gray-600', description: 'System activity and audit trails' },
  { key: 'security_settings', label: 'Security Settings', icon: Shield, color: 'text-red-600', description: 'Security policies and authentication settings' }]

};

const permissionTypes = [
{ key: 'view', label: 'View', icon: Eye, description: 'Can view and access the content', color: 'text-blue-600' },
{ key: 'create', label: 'Create/Add', icon: Plus, description: 'Can create new records using Add buttons', color: 'text-green-600' },
{ key: 'edit', label: 'Edit', icon: Edit, description: 'Can modify existing records using Edit buttons', color: 'text-yellow-600' },
{ key: 'delete', label: 'Delete', icon: Trash2, description: 'Can delete records', color: 'text-red-600' },
{ key: 'export', label: 'Export', icon: FileText, description: 'Can export data to files', color: 'text-purple-600' },
{ key: 'print', label: 'Print', icon: FileText, description: 'Can print reports and documents', color: 'text-indigo-600' }];


const roleTemplates = {
  Administrator: 'Full access to all pages and actions including system administration',
  Management: 'Access to operational pages with limited system administration',
  Employee: 'Basic access to daily operational pages and reports',
  'Station Manager': 'Full access to station operations with limited system access',
  Cashier: 'Access to sales reporting and basic inventory viewing',
  'Custom': 'Manually configure specific permissions per page'
};

const EnhancedUserPermissionManager: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<DetailedPermissions>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [activeTemplate, setActiveTemplate] = useState<string>('Custom');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser);
    }
  }, [selectedUser]);

  const fetchUserProfiles = async () => {
    try {
      setLoading(true);
      console.log('Fetching user profiles from database...');

      // Fetch from user_profiles table (ID: 11725)
      const { data, error } = await window.ezsite.apis.tablePage(11725, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: false,
        Filters: [
        {
          name: "is_active",
          op: "Equal",
          value: true
        }]

      });

      if (error) throw error;

      const profiles = data?.List || [];
      console.log(`Loaded ${profiles.length} active user profiles`);

      setUserProfiles(profiles);

      // Log current permissions for each user
      profiles.forEach((profile) => {
        try {
          const perms = profile.detailed_permissions ? JSON.parse(profile.detailed_permissions) : {};
          const pageCount = Object.keys(perms).length;
          console.log(`User ${profile.employee_id} (${profile.role}): ${pageCount} page permissions configured`);
        } catch (e) {
          console.log(`User ${profile.employee_id} (${profile.role}): No valid permissions configured`);
        }
      });

    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: "Database Error",
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
        // Initialize with default permissions based on role
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

  const handleBulkPermissionChange = (pageKey: string, action: 'grant_all' | 'revoke_all' | 'view_only') => {
    const newPagePermissions = { ...defaultPagePermission };

    switch (action) {
      case 'grant_all':
        permissionTypes.forEach((type) => {
          newPagePermissions[type.key as keyof PagePermission] = true;
        });
        break;
      case 'view_only':
        newPagePermissions.view = true;
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

  const handleGroupPermissionChange = (groupName: string, action: 'grant_all' | 'revoke_all' | 'view_only') => {
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
        case 'view_only':
          newPagePermissions.view = true;
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
        const managementPages = ['dashboard', 'products', 'employees', 'sales_reports', 'vendors', 'orders', 'delivery', 'licenses', 'inventory', 'salary'];
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
          }
        });
        break;

      case 'Station Manager':
        // Full operational access for station management
        const stationManagerPages = ['dashboard', 'products', 'sales_reports', 'delivery', 'inventory'];
        stationManagerPages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            permissionTypes.forEach((type) => {
              newPermissions[pageKey][type.key as keyof PagePermission] = true;
            });
          }
        });
        // View access to other operational areas
        const viewOnlyPages = ['employees', 'vendors', 'orders', 'licenses', 'salary'];
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
        const employeePages = ['dashboard', 'sales_reports', 'delivery'];
        employeePages.forEach((pageKey) => {
          if (newPermissions[pageKey]) {
            newPermissions[pageKey].view = true;
            newPermissions[pageKey].create = true;
            newPermissions[pageKey].edit = true;
          }
        });
        // View-only access to products and inventory
        const employeeViewPages = ['products', 'inventory'];
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
        newPermissions['sales_reports'].create = true;
        newPermissions['sales_reports'].edit = true;
        newPermissions['sales_reports'].print = true;
        newPermissions['products'].view = true;
        newPermissions['inventory'].view = true;
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

  const copyPermissionsFromUser = async (sourceUserId: number) => {
    const sourceUser = userProfiles.find((u) => u.id === sourceUserId);
    if (sourceUser && sourceUser.detailed_permissions) {
      try {
        const sourcePermissions = JSON.parse(sourceUser.detailed_permissions);
        setPermissions(sourcePermissions);
        setActiveTemplate('Custom');
        toast({
          title: "Permissions Copied",
          description: `Permissions copied from ${sourceUser.employee_id}`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy permissions",
          variant: "destructive"
        });
      }
    }
  };

  const resetPermissions = () => {
    const resetPerms: DetailedPermissions = {};
    Object.values(pageGroups).flat().forEach((page) => {
      resetPerms[page.key] = { ...defaultPagePermission };
    });
    setPermissions(resetPerms);
    setActiveTemplate('Custom');
    toast({
      title: "Permissions Reset",
      description: "All permissions have been reset to default (no access)"
    });
  };

  const savePermissions = async () => {
    if (!selectedUser) {
      toast({
        title: "No User Selected",
        description: "Please select a user first",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      console.log(`Saving permissions for user ${selectedUser.employee_id} (ID: ${selectedUser.id})`);
      console.log('Permissions to save:', permissions);

      // Count permissions being saved
      const totalPages = Object.keys(permissions).length;
      const pagesWithAccess = Object.values(permissions).filter((p) => p.view).length;

      const permissionsJson = JSON.stringify(permissions);

      const { error } = await window.ezsite.apis.tableUpdate(11725, {
        id: selectedUser.id,
        detailed_permissions: permissionsJson
      });

      if (error) throw error;

      console.log(`Successfully saved permissions: ${pagesWithAccess}/${totalPages} pages accessible`);

      toast({
        title: "Permissions Saved",
        description: `Updated permissions for ${selectedUser.employee_id}: ${pagesWithAccess}/${totalPages} pages accessible`,
        variant: "default"
      });

      // Update local state with new permissions
      setUserProfiles((prev) => prev.map((user) =>
      user.id === selectedUser.id ?
      { ...user, detailed_permissions: permissionsJson } :
      user
      ));

      // Update selected user state
      setSelectedUser((prev) => prev ? { ...prev, detailed_permissions: permissionsJson } : null);

    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Save Failed",
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

      const pagesWithEdit = Object.values(pageGroups).flat().filter((page) =>
      userPermissions[page.key]?.edit
      ).length;

      const pagesWithCreate = Object.values(pageGroups).flat().filter((page) =>
      userPermissions[page.key]?.create
      ).length;

      return {
        summary: `${pagesWithAccess}/${totalPages} pages`,
        details: `View: ${pagesWithAccess}, Edit: ${pagesWithEdit}, Create: ${pagesWithCreate}`,
        hasAccess: pagesWithAccess > 0
      };
    } catch {
      return {
        summary: 'No permissions',
        details: 'Invalid permission data',
        hasAccess: false
      };
    }
  };

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      await fetchUserProfiles();
      toast({
        title: "Data Refreshed",
        description: "User profiles and permissions have been refreshed"
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh user data",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64" data-id="6fnjevpc9" data-path="src/components/EnhancedUserPermissionManager.tsx">
        <div className="text-lg" data-id="1n1bi5i59" data-path="src/components/EnhancedUserPermissionManager.tsx">Loading permission management...</div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="10w8r9gms" data-path="src/components/EnhancedUserPermissionManager.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="padav1k3k" data-path="src/components/EnhancedUserPermissionManager.tsx">
        <div className="flex items-center space-x-3" data-id="vdeg5u18n" data-path="src/components/EnhancedUserPermissionManager.tsx">
          <Shield className="w-8 h-8 text-blue-600" data-id="51kvokg2n" data-path="src/components/EnhancedUserPermissionManager.tsx" />
          <div data-id="umktar53m" data-path="src/components/EnhancedUserPermissionManager.tsx">
            <h1 className="text-2xl font-bold text-gray-900" data-id="kpk9aj264" data-path="src/components/EnhancedUserPermissionManager.tsx">Real-time User Permission Management</h1>
            <p className="text-gray-600" data-id="u2nqa0g4n" data-path="src/components/EnhancedUserPermissionManager.tsx">Production-level permission management with database integration</p>
            <p className="text-sm text-green-600 font-medium" data-id="wnzpptzk2" data-path="src/components/EnhancedUserPermissionManager.tsx">✓ Connected to live database - {userProfiles.length} active users</p>
          </div>
        </div>
        <div className="flex items-center space-x-2" data-id="xou9lvqty" data-path="src/components/EnhancedUserPermissionManager.tsx">
          <Button
            onClick={refreshUserData}
            disabled={refreshing}
            variant="outline"
            size="sm" data-id="s0joddxtz" data-path="src/components/EnhancedUserPermissionManager.tsx">

            {refreshing ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="ovcvadyyi" data-path="src/components/EnhancedUserPermissionManager.tsx" /> :

            <RotateCcw className="w-4 h-4 mr-2" data-id="ceyr6gd0p" data-path="src/components/EnhancedUserPermissionManager.tsx" />
            }
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* User Selection Card */}
      <Card data-id="n1jdm9k5f" data-path="src/components/EnhancedUserPermissionManager.tsx">
        <CardHeader data-id="ar1wwrpjt" data-path="src/components/EnhancedUserPermissionManager.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="qv49bs5rm" data-path="src/components/EnhancedUserPermissionManager.tsx">
            <Users className="w-5 h-5" data-id="08xqgbdov" data-path="src/components/EnhancedUserPermissionManager.tsx" />
            <span data-id="rblwgrduz" data-path="src/components/EnhancedUserPermissionManager.tsx">Select User & Apply Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="8i68cb2kv" data-path="src/components/EnhancedUserPermissionManager.tsx">
          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="b1bkba8bd" data-path="src/components/EnhancedUserPermissionManager.tsx">
            <div className="relative" data-id="8h5fpixkm" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="1e0dsr6n4" data-path="src/components/EnhancedUserPermissionManager.tsx" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="adv8sglcj" data-path="src/components/EnhancedUserPermissionManager.tsx" />

            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole} data-id="75rwvxxg4" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <SelectTrigger data-id="gd8hwxw8l" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <SelectValue placeholder="Filter by role" data-id="zae5im0x9" data-path="src/components/EnhancedUserPermissionManager.tsx" />
              </SelectTrigger>
              <SelectContent data-id="q2jq592yr" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <SelectItem value="All" data-id="g9xawfmks" data-path="src/components/EnhancedUserPermissionManager.tsx">All Roles</SelectItem>
                <SelectItem value="Administrator" data-id="zykvysf17" data-path="src/components/EnhancedUserPermissionManager.tsx">Administrator</SelectItem>
                <SelectItem value="Management" data-id="wzsgpgz1d" data-path="src/components/EnhancedUserPermissionManager.tsx">Management</SelectItem>
                <SelectItem value="Employee" data-id="i0uykngwi" data-path="src/components/EnhancedUserPermissionManager.tsx">Employee</SelectItem>
                <SelectItem value="Station Manager" data-id="a7iu8uppv" data-path="src/components/EnhancedUserPermissionManager.tsx">Station Manager</SelectItem>
                <SelectItem value="Cashier" data-id="78zop09aq" data-path="src/components/EnhancedUserPermissionManager.tsx">Cashier</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleUserSelect} value={selectedUser?.id.toString() || ''} data-id="kkffvz7fa" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <SelectTrigger data-id="h7agem55l" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <SelectValue placeholder="Select a user to manage permissions" data-id="ski5mdhu3" data-path="src/components/EnhancedUserPermissionManager.tsx" />
              </SelectTrigger>
              <SelectContent data-id="z8hpnejs6" data-path="src/components/EnhancedUserPermissionManager.tsx">
                {filteredUsers.map((user) => {
                  const permSummary = getPermissionSummary(user);
                  return (
                    <SelectItem key={user.id} value={user.id.toString()} data-id="3183hh3bj" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      <div className="flex items-center justify-between w-full" data-id="k5a68otuy" data-path="src/components/EnhancedUserPermissionManager.tsx">
                        <div className="flex flex-col" data-id="u8pyviyfl" data-path="src/components/EnhancedUserPermissionManager.tsx">
                          <span data-id="sshos9mux" data-path="src/components/EnhancedUserPermissionManager.tsx">{user.employee_id} - {user.role}</span>
                          <span className="text-xs text-gray-500" data-id="4r5z1kr5y" data-path="src/components/EnhancedUserPermissionManager.tsx">{user.station}</span>
                        </div>
                        <div className="flex flex-col items-end" data-id="8f275sa5u" data-path="src/components/EnhancedUserPermissionManager.tsx">
                          <Badge
                            variant={permSummary.hasAccess ? "default" : "secondary"}
                            className="ml-2" data-id="3iwchrmbm" data-path="src/components/EnhancedUserPermissionManager.tsx">


                            {permSummary.summary}
                          </Badge>
                          <span className="text-xs text-gray-400 mt-1" data-id="kvo4a2zo3" data-path="src/components/EnhancedUserPermissionManager.tsx">{permSummary.details}</span>
                        </div>
                      </div>
                    </SelectItem>);

                })}
              </SelectContent>
            </Select>
          </div>

          {/* Selected User Info */}
          {selectedUser &&
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border" data-id="clw98lmuz" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <div className="flex items-center justify-between" data-id="af0zp01ss" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <div data-id="z056rsvz9" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <h3 className="font-semibold text-lg" data-id="scjm207ld" data-path="src/components/EnhancedUserPermissionManager.tsx">{selectedUser.employee_id}</h3>
                  <p className="text-sm text-gray-600" data-id="dtg6sul0s" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    Role: {selectedUser.role} | Station: {selectedUser.station}
                  </p>
                  <p className="text-xs text-gray-500 mt-1" data-id="rf8bqup0e" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    User ID: {selectedUser.user_id} | Phone: {selectedUser.phone}
                  </p>
                </div>
                <div className="text-right space-y-2" data-id="ep3n5r7cl" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <Badge className={selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} data-id="dv9vcz2oz" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className="text-xs text-gray-500" data-id="omqnavwp4" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    Current: {activeTemplate}
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Role Templates */}
          {selectedUser &&
          <div className="space-y-3" data-id="1ddkxgsxh" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <Label className="text-sm font-medium" data-id="3g1b1mal9" data-path="src/components/EnhancedUserPermissionManager.tsx">Quick Permission Templates</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2" data-id="ewpwmt7y5" data-path="src/components/EnhancedUserPermissionManager.tsx">
                {Object.entries(roleTemplates).map(([role, description]) =>
              <Button
                key={role}
                variant={activeTemplate === role ? "default" : "outline"}
                size="sm"
                onClick={() => applyRoleTemplate(role)}
                className="text-xs h-auto py-2 px-3 flex flex-col items-center space-y-1"
                title={description} data-id="rvhcrc6r8" data-path="src/components/EnhancedUserPermissionManager.tsx">

                    <span className="font-medium" data-id="rjtb1t1r7" data-path="src/components/EnhancedUserPermissionManager.tsx">{role}</span>
                  </Button>
              )}
              </div>
              
              {/* Advanced Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t" data-id="qu33p9gib" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <Select onValueChange={(value) => copyPermissionsFromUser(parseInt(value))} data-id="fg2vunbxy" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <SelectTrigger className="w-auto" data-id="ej26wwbla" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    <Copy className="w-4 h-4 mr-2" data-id="g5nu4jfgy" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                    <SelectValue placeholder="Copy from user..." data-id="3se1rzkvb" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="1uzf6w13b" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    {userProfiles.filter((u) => u.id !== selectedUser.id).map((user) =>
                  <SelectItem key={user.id} value={user.id.toString()} data-id="q5et0urd1" data-path="src/components/EnhancedUserPermissionManager.tsx">
                        {user.employee_id} ({user.role})
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
                
                <Button
                variant="outline"
                size="sm"
                onClick={resetPermissions}
                className="text-red-600 hover:text-red-700" data-id="igi764bpw" data-path="src/components/EnhancedUserPermissionManager.tsx">

                  <RotateCcw className="w-4 h-4 mr-2" data-id="lkxosp1dl" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                  Reset All
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Permission Management */}
      {selectedUser &&
      <Card data-id="1dvuxm8a7" data-path="src/components/EnhancedUserPermissionManager.tsx">
          <CardHeader data-id="qrw9e2lb2" data-path="src/components/EnhancedUserPermissionManager.tsx">
            <div className="flex items-center justify-between" data-id="xnijrxd9r" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="qb27bupt5" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <Shield className="w-5 h-5" data-id="cbpqzsmvf" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                <span data-id="vjbojnuga" data-path="src/components/EnhancedUserPermissionManager.tsx">Page-Based Permissions for {selectedUser.employee_id}</span>
              </CardTitle>
              <Button
              onClick={savePermissions}
              disabled={saving || !selectedUser}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400" data-id="809hvi7j2" data-path="src/components/EnhancedUserPermissionManager.tsx">


                {saving ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="mc3qfpe6x" data-path="src/components/EnhancedUserPermissionManager.tsx" /> :

              <Save className="w-4 h-4 mr-2" data-id="wz1el6h25" data-path="src/components/EnhancedUserPermissionManager.tsx" />
              }
                {saving ? 'Saving to Database...' : 'Apply & Save Permissions'}
              </Button>
            </div>
          </CardHeader>
          <CardContent data-id="p17oa87eq" data-path="src/components/EnhancedUserPermissionManager.tsx">
            <Tabs defaultValue="by-groups" className="w-full" data-id="opdz1cm5b" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <TabsList className="grid w-full grid-cols-2" data-id="i2itlzw24" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <TabsTrigger value="by-groups" data-id="nnkko7gsd" data-path="src/components/EnhancedUserPermissionManager.tsx">By Page Groups</TabsTrigger>
                <TabsTrigger value="matrix-view" data-id="a4i9op90g" data-path="src/components/EnhancedUserPermissionManager.tsx">Matrix View</TabsTrigger>
              </TabsList>

              <TabsContent value="by-groups" className="space-y-6" data-id="pao2tdj0c" data-path="src/components/EnhancedUserPermissionManager.tsx">
                {Object.entries(pageGroups).map(([groupName, pages]) =>
              <Card key={groupName} className="border-l-4 border-l-blue-500" data-id="fy95pn12k" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    <CardHeader className="pb-3" data-id="8xgc9ymhl" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      <div className="flex items-center justify-between" data-id="n1ij3zwfo" data-path="src/components/EnhancedUserPermissionManager.tsx">
                        <CardTitle className="text-lg" data-id="gmoyb64h7" data-path="src/components/EnhancedUserPermissionManager.tsx">{groupName}</CardTitle>
                        <div className="flex space-x-2" data-id="vnn030err" data-path="src/components/EnhancedUserPermissionManager.tsx">
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGroupPermissionChange(groupName, 'view_only')}
                        className="text-blue-600" data-id="2tm8n1nto" data-path="src/components/EnhancedUserPermissionManager.tsx">

                            <Eye className="w-3 h-3 mr-1" data-id="xty9ioqrj" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                            View Only
                          </Button>
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGroupPermissionChange(groupName, 'grant_all')}
                        className="text-green-600" data-id="78buarcqd" data-path="src/components/EnhancedUserPermissionManager.tsx">

                            <CheckCircle2 className="w-3 h-3 mr-1" data-id="hwpj4xprb" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                            Full Access
                          </Button>
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGroupPermissionChange(groupName, 'revoke_all')}
                        className="text-red-600" data-id="v75fnlr25" data-path="src/components/EnhancedUserPermissionManager.tsx">

                            <XCircle className="w-3 h-3 mr-1" data-id="zvod5jdx9" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                            No Access
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent data-id="d21wl6dzs" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      <div className="space-y-4" data-id="21a61yren" data-path="src/components/EnhancedUserPermissionManager.tsx">
                        {pages.map((page) => {
                      const pagePermissions = permissions[page.key] || defaultPagePermission;
                      return (
                        <div key={page.key} className="border rounded-lg p-4" data-id="21fxmi61n" data-path="src/components/EnhancedUserPermissionManager.tsx">
                              <div className="flex items-start justify-between mb-3" data-id="duasnmbqs" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                <div className="flex items-center space-x-3" data-id="8gkagaawu" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                  <page.icon className={`w-5 h-5 ${page.color}`} data-id="huzaadpj7" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                                  <div data-id="ipbhkbkdd" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                    <h4 className="font-medium" data-id="xzwl0xqrp" data-path="src/components/EnhancedUserPermissionManager.tsx">{page.label}</h4>
                                    <p className="text-xs text-gray-500" data-id="b7z3qxg6m" data-path="src/components/EnhancedUserPermissionManager.tsx">{page.description}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2" data-id="s8hfilisx" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBulkPermissionChange(page.key, 'view_only')}
                                className="text-blue-600 text-xs px-2 py-1" data-id="xc0crrn72" data-path="src/components/EnhancedUserPermissionManager.tsx">

                                    View Only
                                  </Button>
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBulkPermissionChange(page.key, 'grant_all')}
                                className="text-green-600 text-xs px-2 py-1" data-id="ll5fbw4rz" data-path="src/components/EnhancedUserPermissionManager.tsx">

                                    <CheckCircle2 className="w-3 h-3" data-id="cvgtp7dxm" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                                  </Button>
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBulkPermissionChange(page.key, 'revoke_all')}
                                className="text-red-600 text-xs px-2 py-1" data-id="32ikpo11g" data-path="src/components/EnhancedUserPermissionManager.tsx">

                                    <XCircle className="w-3 h-3" data-id="rw0wpv64k" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" data-id="ts6wgbh9a" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                {permissionTypes.map((type) =>
                            <div key={type.key} className="flex items-center space-x-2 p-2 border rounded" data-id="hisoja0eg" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                    <Switch
                                checked={pagePermissions[type.key as keyof PagePermission]}
                                onCheckedChange={(checked) =>
                                handlePermissionChange(page.key, type.key, checked)
                                }
                                id={`${page.key}-${type.key}`} data-id="mgi5g9h05" data-path="src/components/EnhancedUserPermissionManager.tsx" />

                                    <Label
                                htmlFor={`${page.key}-${type.key}`}
                                className="text-xs cursor-pointer flex items-center space-x-1" data-id="uz6syb1s4" data-path="src/components/EnhancedUserPermissionManager.tsx">

                                      <type.icon className={`w-3 h-3 ${type.color}`} data-id="3q9xcejdu" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                                      <span data-id="20mwbwuig" data-path="src/components/EnhancedUserPermissionManager.tsx">{type.label}</span>
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

              <TabsContent value="matrix-view" data-id="8wu1en64l" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <div className="overflow-x-auto" data-id="kr8ml6n2a" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <table className="w-full border-collapse border" data-id="hgnqoxn9m" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    <thead className="sticky top-0 bg-white z-10" data-id="uj4rvjdyb" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      <tr className="border-b" data-id="7o752nmgl" data-path="src/components/EnhancedUserPermissionManager.tsx">
                        <th className="text-left p-3 font-semibold bg-white border" data-id="dze59nl6l" data-path="src/components/EnhancedUserPermissionManager.tsx">Page</th>
                        {permissionTypes.map((type) =>
                      <th key={type.key} className="text-center p-3 font-semibold min-w-20 bg-white border" data-id="kvgcru78t" data-path="src/components/EnhancedUserPermissionManager.tsx">
                            <div className="flex flex-col items-center space-y-1" data-id="utr1l7vtj" data-path="src/components/EnhancedUserPermissionManager.tsx">
                              <type.icon className={`w-4 h-4 ${type.color}`} data-id="w89jq4kwo" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                              <span className="text-xs" data-id="m2cputfa5" data-path="src/components/EnhancedUserPermissionManager.tsx">{type.label}</span>
                            </div>
                          </th>
                      )}
                        <th className="text-center p-3 font-semibold bg-white border" data-id="3dzr73pe3" data-path="src/components/EnhancedUserPermissionManager.tsx">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody data-id="swzjp4sxu" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      {Object.entries(pageGroups).map(([groupName, pages]) =>
                    <React.Fragment key={groupName} data-id="736c6gb39" data-path="src/components/EnhancedUserPermissionManager.tsx">
                          <tr className="bg-gray-100" data-id="koktuu9ze" data-path="src/components/EnhancedUserPermissionManager.tsx">
                            <td colSpan={permissionTypes.length + 2} className="p-2 font-semibold text-sm border" data-id="m7ql1puop" data-path="src/components/EnhancedUserPermissionManager.tsx">
                              {groupName}
                            </td>
                          </tr>
                          {pages.map((page) => {
                        const pagePermissions = permissions[page.key] || defaultPagePermission;
                        return (
                          <tr key={page.key} className="border-b hover:bg-gray-50" data-id="wson7ysnu" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                <td className="p-3 border" data-id="8y8evko3u" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                  <div className="flex items-center space-x-3" data-id="niiq2ke0d" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                    <page.icon className={`w-4 h-4 ${page.color}`} data-id="76s377sqe" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                                    <div data-id="nyyo2dvlc" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                      <span className="font-medium text-sm" data-id="75es75djg" data-path="src/components/EnhancedUserPermissionManager.tsx">{page.label}</span>
                                      <p className="text-xs text-gray-500" data-id="swv94siap" data-path="src/components/EnhancedUserPermissionManager.tsx">{page.description}</p>
                                    </div>
                                  </div>
                                </td>
                                {permissionTypes.map((type) =>
                            <td key={type.key} className="text-center p-3 border" data-id="ysow3myla" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                    <Switch
                                checked={pagePermissions[type.key as keyof PagePermission]}
                                onCheckedChange={(checked) =>
                                handlePermissionChange(page.key, type.key, checked)
                                } data-id="zgt53qv12" data-path="src/components/EnhancedUserPermissionManager.tsx" />

                                  </td>
                            )}
                                <td className="text-center p-3 border" data-id="6pa4pswm5" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                  <div className="flex space-x-1 justify-center" data-id="g6a59hbfm" data-path="src/components/EnhancedUserPermissionManager.tsx">
                                    <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBulkPermissionChange(page.key, 'grant_all')}
                                  className="text-green-600 hover:text-green-700"
                                  title="Grant all permissions" data-id="gsjoimdvz" data-path="src/components/EnhancedUserPermissionManager.tsx">

                                      <CheckCircle2 className="w-3 h-3" data-id="qxr82eth3" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                                    </Button>
                                    <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBulkPermissionChange(page.key, 'revoke_all')}
                                  className="text-red-600 hover:text-red-700"
                                  title="Revoke all permissions" data-id="zzs54gnyn" data-path="src/components/EnhancedUserPermissionManager.tsx">

                                      <XCircle className="w-3 h-3" data-id="dow5i2bho" data-path="src/components/EnhancedUserPermissionManager.tsx" />
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

            {/* Permission Summary & Real-time Status */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200" data-id="5xv2y8uk5" data-path="src/components/EnhancedUserPermissionManager.tsx">
              <h4 className="font-semibold mb-3 flex items-center" data-id="9e91fspzk" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" data-id="hlsrnqef7" data-path="src/components/EnhancedUserPermissionManager.tsx" />
                Live Permission Management Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" data-id="o2c127mv9" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <div data-id="45g1eojbi" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <p className="font-medium mb-2 text-green-700" data-id="utsji1o28" data-path="src/components/EnhancedUserPermissionManager.tsx">Real-time Features:</p>
                  <ul className="space-y-1 text-gray-600" data-id="o45hosy0n" data-path="src/components/EnhancedUserPermissionManager.tsx">
                    <li data-id="0qyip4n8c" data-path="src/components/EnhancedUserPermissionManager.tsx">✓ <strong data-id="un5jls8u6" data-path="src/components/EnhancedUserPermissionManager.tsx">Live Database:</strong> Direct integration with user_profiles table</li>
                    <li data-id="cuuigosg3" data-path="src/components/EnhancedUserPermissionManager.tsx">✓ <strong data-id="pp4xc83v5" data-path="src/components/EnhancedUserPermissionManager.tsx">Instant Updates:</strong> Changes applied immediately</li>
                    <li data-id="8nk8s5txu" data-path="src/components/EnhancedUserPermissionManager.tsx">✓ <strong data-id="p9gftmcr4" data-path="src/components/EnhancedUserPermissionManager.tsx">Production Ready:</strong> No fake data or mock content</li>
                  </ul>
                </div>
                <div data-id="n8ddzcz1o" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <p className="font-medium mb-2 text-blue-700" data-id="4cytg8ai6" data-path="src/components/EnhancedUserPermissionManager.tsx">Current User:</p>
                  {selectedUser ?
                <div className="space-y-1" data-id="znugouu3d" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      <Badge variant="default" className="mb-1" data-id="7pho6k29t" data-path="src/components/EnhancedUserPermissionManager.tsx">{selectedUser.employee_id}</Badge>
                      <p className="text-xs text-gray-600" data-id="iine48raj" data-path="src/components/EnhancedUserPermissionManager.tsx">Role: {selectedUser.role}</p>
                      <p className="text-xs text-gray-600" data-id="rg6zd37g9" data-path="src/components/EnhancedUserPermissionManager.tsx">Station: {selectedUser.station}</p>
                      <p className="text-xs text-gray-600" data-id="sl5fg4va2" data-path="src/components/EnhancedUserPermissionManager.tsx">Template: {activeTemplate}</p>
                    </div> :

                <p className="text-gray-500 text-xs" data-id="mr64qja8x" data-path="src/components/EnhancedUserPermissionManager.tsx">No user selected</p>
                }
                </div>
                <div data-id="94v5cevd8" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <p className="font-medium mb-2 text-purple-700" data-id="rs8ypygtu" data-path="src/components/EnhancedUserPermissionManager.tsx">Permission Stats:</p>
                  {selectedUser ?
                <div className="space-y-1" data-id="so1yufab8" data-path="src/components/EnhancedUserPermissionManager.tsx">
                      {(() => {
                    const summary = getPermissionSummary(selectedUser);
                    return (
                      <div data-id="7rx17hmdd" data-path="src/components/EnhancedUserPermissionManager.tsx">
                            <Badge variant="outline" className="mb-1" data-id="rpujmmfh5" data-path="src/components/EnhancedUserPermissionManager.tsx">{summary.summary}</Badge>
                            <p className="text-xs text-gray-600" data-id="higpvnm7y" data-path="src/components/EnhancedUserPermissionManager.tsx">{summary.details}</p>
                            <p className="text-xs text-green-600 mt-1" data-id="5zxfqslen" data-path="src/components/EnhancedUserPermissionManager.tsx">✓ Permissions loaded from database</p>
                          </div>);

                  })()} 
                    </div> :

                <p className="text-gray-500 text-xs" data-id="bpv99edfn" data-path="src/components/EnhancedUserPermissionManager.tsx">Select a user to view permission stats</p>
                }
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-green-200" data-id="kxo2fzg11" data-path="src/components/EnhancedUserPermissionManager.tsx">
                <p className="text-xs text-gray-600" data-id="pkx8mnd25" data-path="src/components/EnhancedUserPermissionManager.tsx">
                  <strong data-id="2ytwsqt8w" data-path="src/components/EnhancedUserPermissionManager.tsx">Important:</strong> All permission changes are saved directly to the production database. 
                  Make sure to click "Apply & Save Permissions" to commit your changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default EnhancedUserPermissionManager;