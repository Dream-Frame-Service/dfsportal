import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Save } from
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

interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  print: boolean;
}

interface DetailedPermissions {
  dashboard: Permission;
  products: Permission;
  employees: Permission;
  sales_reports: Permission;
  vendors: Permission;
  orders: Permission;
  licenses: Permission;
  salary: Permission;
  inventory: Permission;
  delivery: Permission;
  settings: Permission;
  user_management: Permission;
  site_management: Permission;
  system_logs: Permission;
  security_settings: Permission;
}

const defaultPermissions: Permission = {
  view: false,
  create: false,
  edit: false,
  delete: false,
  export: false,
  print: false
};

const defaultDetailedPermissions: DetailedPermissions = {
  dashboard: { ...defaultPermissions, view: true },
  products: { ...defaultPermissions },
  employees: { ...defaultPermissions },
  sales_reports: { ...defaultPermissions },
  vendors: { ...defaultPermissions },
  orders: { ...defaultPermissions },
  licenses: { ...defaultPermissions },
  salary: { ...defaultPermissions },
  inventory: { ...defaultPermissions },
  delivery: { ...defaultPermissions },
  settings: { ...defaultPermissions },
  user_management: { ...defaultPermissions },
  site_management: { ...defaultPermissions },
  system_logs: { ...defaultPermissions },
  security_settings: { ...defaultPermissions }
};

const contentAreas = [
{ key: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
{ key: 'products', label: 'Products', icon: Package, color: 'text-green-600' },
{ key: 'employees', label: 'Employees', icon: Users, color: 'text-purple-600' },
{ key: 'sales_reports', label: 'Sales Reports', icon: FileText, color: 'text-orange-600' },
{ key: 'vendors', label: 'Vendors', icon: Building2, color: 'text-teal-600' },
{ key: 'orders', label: 'Orders', icon: Truck, color: 'text-indigo-600' },
{ key: 'licenses', label: 'Licenses', icon: Shield, color: 'text-red-600' },
{ key: 'salary', label: 'Salary Management', icon: DollarSign, color: 'text-yellow-600' },
{ key: 'inventory', label: 'Inventory', icon: Database, color: 'text-cyan-600' },
{ key: 'delivery', label: 'Delivery', icon: Truck, color: 'text-pink-600' },
{ key: 'settings', label: 'App Settings', icon: Settings, color: 'text-gray-600' },
{ key: 'user_management', label: 'User Management', icon: UserCheck, color: 'text-red-600' },
{ key: 'site_management', label: 'Site Management', icon: Building2, color: 'text-blue-600' },
{ key: 'system_logs', label: 'System Logs', icon: FileText, color: 'text-gray-600' },
{ key: 'security_settings', label: 'Security Settings', icon: Shield, color: 'text-red-600' }];


const permissionTypes = [
{ key: 'view', label: 'View', icon: Eye, description: 'Can view and access the content' },
{ key: 'create', label: 'Create', icon: Plus, description: 'Can create new records' },
{ key: 'edit', label: 'Edit', icon: Edit, description: 'Can modify existing records' },
{ key: 'delete', label: 'Delete', icon: Trash2, description: 'Can delete records' },
{ key: 'export', label: 'Export', icon: FileText, description: 'Can export data' },
{ key: 'print', label: 'Print', icon: FileText, description: 'Can print reports' }];


const UserPermissionManager: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<DetailedPermissions>(defaultDetailedPermissions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    try {
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

  const handleUserSelect = (userId: string) => {
    const user = userProfiles.find((u) => u.id.toString() === userId);
    if (user) {
      setSelectedUser(user);
      // Parse existing permissions or use defaults
      try {
        const existingPermissions = user.detailed_permissions ?
        JSON.parse(user.detailed_permissions) :
        defaultDetailedPermissions;
        setPermissions(existingPermissions);
      } catch (error) {
        console.error('Error parsing permissions:', error);
        setPermissions(defaultDetailedPermissions);
      }
    }
  };

  const handlePermissionChange = (contentArea: string, permissionType: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [contentArea]: {
        ...prev[contentArea as keyof DetailedPermissions],
        [permissionType]: value
      }
    }));
  };

  const handleBulkPermissionChange = (contentArea: string, action: 'grant_all' | 'revoke_all') => {
    const allTrue = permissionTypes.reduce((acc, type) => ({ ...acc, [type.key]: true }), {});
    const allFalse = permissionTypes.reduce((acc, type) => ({ ...acc, [type.key]: false }), {});

    setPermissions((prev) => ({
      ...prev,
      [contentArea]: action === 'grant_all' ? allTrue as Permission : allFalse as Permission
    }));
  };

  const applyRoleTemplate = (role: string) => {
    let newPermissions: DetailedPermissions;

    switch (role) {
      case 'Administrator':
        // Administrators get full access to everything
        newPermissions = Object.keys(defaultDetailedPermissions).reduce((acc, area) => ({
          ...acc,
          [area]: permissionTypes.reduce((perms, type) => ({ ...perms, [type.key]: true }), {})
        }), {} as DetailedPermissions);
        break;

      case 'Management':
        // Management gets most permissions except admin functions
        newPermissions = Object.keys(defaultDetailedPermissions).reduce((acc, area) => {
          const isAdminArea = ['user_management', 'site_management', 'system_logs', 'security_settings'].includes(area);
          return {
            ...acc,
            [area]: isAdminArea ?
            { ...defaultPermissions, view: true } :
            permissionTypes.reduce((perms, type) => ({ ...perms, [type.key]: true }), {})
          };
        }, {} as DetailedPermissions);
        break;

      case 'Employee':
        // Employees get basic access to operational areas
        newPermissions = {
          ...defaultDetailedPermissions,
          dashboard: { ...defaultPermissions, view: true },
          products: { ...defaultPermissions, view: true },
          sales_reports: { ...defaultPermissions, view: true, create: true, edit: true },
          inventory: { ...defaultPermissions, view: true },
          delivery: { ...defaultPermissions, view: true, create: true, edit: true }
        };
        break;

      default:
        newPermissions = defaultDetailedPermissions;
    }

    setPermissions(newPermissions);
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

      // Update the local state
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
      defaultDetailedPermissions;

      const totalAreas = contentAreas.length;
      const areasWithAccess = contentAreas.filter((area) =>
      userPermissions[area.key]?.view
      ).length;

      return `${areasWithAccess}/${totalAreas} areas`;
    } catch {
      return '0/15 areas';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64" data-id="yl3kzkgx0" data-path="src/components/UserPermissionManager.tsx">
        <div className="text-lg" data-id="pc3c7x45j" data-path="src/components/UserPermissionManager.tsx">Loading permission management...</div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="914sgh6x3" data-path="src/components/UserPermissionManager.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="44faqm06q" data-path="src/components/UserPermissionManager.tsx">
        <div className="flex items-center space-x-3" data-id="as40xemmt" data-path="src/components/UserPermissionManager.tsx">
          <Shield className="w-8 h-8 text-blue-600" data-id="l9h9a0mto" data-path="src/components/UserPermissionManager.tsx" />
          <h1 className="text-2xl font-bold text-gray-900" data-id="hqnpvibuw" data-path="src/components/UserPermissionManager.tsx">User Permission Management</h1>
        </div>
      </div>

      {/* User Selection */}
      <Card data-id="4j6c2qnmj" data-path="src/components/UserPermissionManager.tsx">
        <CardHeader data-id="edh3k3v43" data-path="src/components/UserPermissionManager.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="s3kldhxuy" data-path="src/components/UserPermissionManager.tsx">
            <Users className="w-5 h-5" data-id="ps1b5kq0f" data-path="src/components/UserPermissionManager.tsx" />
            <span data-id="3k0jltd40" data-path="src/components/UserPermissionManager.tsx">Select User to Manage Permissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="ffbjvq0cb" data-path="src/components/UserPermissionManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="us20t9wje" data-path="src/components/UserPermissionManager.tsx">
            <div data-id="j0yzhaj55" data-path="src/components/UserPermissionManager.tsx">
              <Label data-id="3qx59trsk" data-path="src/components/UserPermissionManager.tsx">User to Manage</Label>
              <Select onValueChange={handleUserSelect} value={selectedUser?.id.toString() || ''} data-id="jr4o3bhzj" data-path="src/components/UserPermissionManager.tsx">
                <SelectTrigger data-id="l9s2rhhvh" data-path="src/components/UserPermissionManager.tsx">
                  <SelectValue placeholder="Select a user to manage permissions" data-id="3to7u8u1s" data-path="src/components/UserPermissionManager.tsx" />
                </SelectTrigger>
                <SelectContent data-id="2tqsn3kcs" data-path="src/components/UserPermissionManager.tsx">
                  {userProfiles.map((user) =>
                  <SelectItem key={user.id} value={user.id.toString()} data-id="st3z4kf4u" data-path="src/components/UserPermissionManager.tsx">
                      <div className="flex items-center justify-between w-full" data-id="j9o6mg6xr" data-path="src/components/UserPermissionManager.tsx">
                        <span data-id="79x95je07" data-path="src/components/UserPermissionManager.tsx">{user.employee_id} - {user.role}</span>
                        <Badge variant="outline" className="ml-2" data-id="m6cterl07" data-path="src/components/UserPermissionManager.tsx">
                          {getPermissionSummary(user)}
                        </Badge>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedUser &&
            <div data-id="21mzkc74r" data-path="src/components/UserPermissionManager.tsx">
                <Label data-id="zp0zuj46b" data-path="src/components/UserPermissionManager.tsx">Apply Role Template</Label>
                <div className="flex flex-col space-y-2" data-id="9ph66l178" data-path="src/components/UserPermissionManager.tsx">
                  <div className="flex space-x-2" data-id="1nvbuqpm8" data-path="src/components/UserPermissionManager.tsx">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyRoleTemplate('Administrator')}
                    className="flex-1" data-id="lmkltuwpj" data-path="src/components/UserPermissionManager.tsx">
                      Admin Template
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyRoleTemplate('Management')}
                    className="flex-1" data-id="bfbyt4bdh" data-path="src/components/UserPermissionManager.tsx">
                      Manager Template
                    </Button>
                  </div>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyRoleTemplate('Employee')}
                  className="w-full" data-id="x058kmagy" data-path="src/components/UserPermissionManager.tsx">
                    Employee Template
                  </Button>
                </div>
              </div>
            }
          </div>

          {selectedUser &&
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border" data-id="uhz9fb24r" data-path="src/components/UserPermissionManager.tsx">
              <div className="flex items-center justify-between" data-id="adq5zerxu" data-path="src/components/UserPermissionManager.tsx">
                <div data-id="87xg3nvnx" data-path="src/components/UserPermissionManager.tsx">
                  <h3 className="font-semibold text-lg" data-id="qcakaykul" data-path="src/components/UserPermissionManager.tsx">{selectedUser.employee_id}</h3>
                  <p className="text-sm text-gray-600" data-id="jrldkfj8n" data-path="src/components/UserPermissionManager.tsx">
                    Role: {selectedUser.role} | Station: {selectedUser.station}
                  </p>
                  <p className="text-xs text-gray-500 mt-1" data-id="xl4ol7s6u" data-path="src/components/UserPermissionManager.tsx">
                    User ID: {selectedUser.user_id} | Phone: {selectedUser.phone}
                  </p>
                </div>
                <div className="text-right" data-id="medo3t5gm" data-path="src/components/UserPermissionManager.tsx">
                  <Badge className={selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} data-id="nb5p6qy4x" data-path="src/components/UserPermissionManager.tsx">
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      {selectedUser &&
      <Card data-id="ssdywrmwp" data-path="src/components/UserPermissionManager.tsx">
          <CardHeader data-id="86vqwhcdf" data-path="src/components/UserPermissionManager.tsx">
            <div className="flex items-center justify-between" data-id="aqt0r20m8" data-path="src/components/UserPermissionManager.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="l6utgpgc8" data-path="src/components/UserPermissionManager.tsx">
                <Shield className="w-5 h-5" data-id="88tqgcs4n" data-path="src/components/UserPermissionManager.tsx" />
                <span data-id="2l77s66qf" data-path="src/components/UserPermissionManager.tsx">Detailed Permissions for {selectedUser.employee_id}</span>
              </CardTitle>
              <Button
              onClick={savePermissions}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700" data-id="bmx3ubqte" data-path="src/components/UserPermissionManager.tsx">

                <Save className="w-4 h-4 mr-2" data-id="ugy45pm4f" data-path="src/components/UserPermissionManager.tsx" />
                {saving ? 'Saving...' : 'Save Permissions'}
              </Button>
            </div>
          </CardHeader>
          <CardContent data-id="nz3ng0ytt" data-path="src/components/UserPermissionManager.tsx">
            <ScrollArea className="h-[600px]" data-id="klht1evjb" data-path="src/components/UserPermissionManager.tsx">
              <div className="overflow-x-auto" data-id="huoshp8qk" data-path="src/components/UserPermissionManager.tsx">
                <table className="w-full border-collapse" data-id="k4v7fpgwc" data-path="src/components/UserPermissionManager.tsx">
                  <thead className="sticky top-0 bg-white z-10" data-id="tdm1kg02r" data-path="src/components/UserPermissionManager.tsx">
                    <tr className="border-b" data-id="w96ivl24u" data-path="src/components/UserPermissionManager.tsx">
                      <th className="text-left p-3 font-semibold bg-white" data-id="xc65oylyh" data-path="src/components/UserPermissionManager.tsx">Content Area</th>
                      {permissionTypes.map((type) =>
                    <th key={type.key} className="text-center p-3 font-semibold min-w-20 bg-white" data-id="hh267f0s5" data-path="src/components/UserPermissionManager.tsx">
                          <div className="flex flex-col items-center space-y-1" data-id="np0qxggo6" data-path="src/components/UserPermissionManager.tsx">
                            <type.icon className="w-4 h-4" data-id="1q1jginmq" data-path="src/components/UserPermissionManager.tsx" />
                            <span className="text-xs" data-id="4mwivd54y" data-path="src/components/UserPermissionManager.tsx">{type.label}</span>
                          </div>
                        </th>
                    )}
                      <th className="text-center p-3 font-semibold bg-white" data-id="oa8g6z2ok" data-path="src/components/UserPermissionManager.tsx">Actions</th>
                    </tr>
                  </thead>
                  <tbody data-id="aqznfamvd" data-path="src/components/UserPermissionManager.tsx">
                    {contentAreas.map((area) => {
                    const areaPermissions = permissions[area.key as keyof DetailedPermissions];
                    return (
                      <tr key={area.key} className="border-b hover:bg-gray-50" data-id="anjh5zo12" data-path="src/components/UserPermissionManager.tsx">
                          <td className="p-3" data-id="w33o81bcf" data-path="src/components/UserPermissionManager.tsx">
                            <div className="flex items-center space-x-3" data-id="hhf57gxm9" data-path="src/components/UserPermissionManager.tsx">
                              <area.icon className={`w-5 h-5 ${area.color}`} data-id="1l2axdhin" data-path="src/components/UserPermissionManager.tsx" />
                              <span className="font-medium" data-id="wnprau85l" data-path="src/components/UserPermissionManager.tsx">{area.label}</span>
                            </div>
                          </td>
                          {permissionTypes.map((type) =>
                        <td key={type.key} className="text-center p-3" data-id="8fitfqa6q" data-path="src/components/UserPermissionManager.tsx">
                              <Switch
                            checked={areaPermissions[type.key as keyof Permission]}
                            onCheckedChange={(checked) =>
                            handlePermissionChange(area.key, type.key, checked)
                            } data-id="uiwa3hnl7" data-path="src/components/UserPermissionManager.tsx" />
                            </td>
                        )}
                          <td className="text-center p-3" data-id="93bhktmrg" data-path="src/components/UserPermissionManager.tsx">
                            <div className="flex space-x-1 justify-center" data-id="4bhhs7o1b" data-path="src/components/UserPermissionManager.tsx">
                              <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBulkPermissionChange(area.key, 'grant_all')}
                              className="text-green-600 hover:text-green-700"
                              title="Grant all permissions" data-id="a1rlf9trt" data-path="src/components/UserPermissionManager.tsx">
                                <CheckCircle2 className="w-3 h-3" data-id="py2pqnqo3" data-path="src/components/UserPermissionManager.tsx" />
                              </Button>
                              <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBulkPermissionChange(area.key, 'revoke_all')}
                              className="text-red-600 hover:text-red-700"
                              title="Revoke all permissions" data-id="cihutzz93" data-path="src/components/UserPermissionManager.tsx">
                                <XCircle className="w-3 h-3" data-id="r5ncc1rnz" data-path="src/components/UserPermissionManager.tsx" />
                              </Button>
                            </div>
                          </td>
                        </tr>);
                  })}
                  </tbody>
                </table>
              </div>
            </ScrollArea>

            {/* Permission Types Legend */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg" data-id="kpsxo63if" data-path="src/components/UserPermissionManager.tsx">
              <h4 className="font-semibold mb-3" data-id="4dmfgnho6" data-path="src/components/UserPermissionManager.tsx">Permission Types:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" data-id="d7pf47dxz" data-path="src/components/UserPermissionManager.tsx">
                {permissionTypes.map((type) =>
              <div key={type.key} className="flex items-center space-x-2" data-id="lwhlq5c1d" data-path="src/components/UserPermissionManager.tsx">
                    <type.icon className="w-4 h-4 text-gray-600" data-id="k9shto9w3" data-path="src/components/UserPermissionManager.tsx" />
                    <span className="font-medium" data-id="zmot4w4by" data-path="src/components/UserPermissionManager.tsx">{type.label}:</span>
                    <span className="text-sm text-gray-600" data-id="6daomb95l" data-path="src/components/UserPermissionManager.tsx">{type.description}</span>
                  </div>
              )}
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default UserPermissionManager;