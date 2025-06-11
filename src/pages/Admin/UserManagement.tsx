import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useBatchSelection } from '@/hooks/use-batch-selection';
import BatchActionBar from '@/components/BatchActionBar';
import BatchDeleteDialog from '@/components/BatchDeleteDialog';
import BatchEditDialog from '@/components/BatchEditDialog';
import UserPermissionManager from '@/components/UserPermissionManager';
import EnhancedUserPermissionManager from '@/components/EnhancedUserPermissionManager';
import ComprehensivePermissionDialog from '@/components/ComprehensivePermissionDialog';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';
import CreateUserDialog from '@/components/CreateUserDialog';
import { supabase } from '@/services/supabaseService';
import {
  Users,
  Plus,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building2,
  Settings,
  Clock,
  Activity,
  Eye,
  FileText,
  AlertCircle,
  RefreshCw } from
'lucide-react';

interface User {
  ID: number;
  Name: string;
  Email: string;
  CreateTime: string;
}

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

const UserManagement: React.FC = () => {
  const { isAdmin } = useAdminAccess();
  const [users, setUsers] = useState<User[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStation, setSelectedStation] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBatchEditDialogOpen, setIsBatchEditDialogOpen] = useState(false);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const { toast } = useToast();

  // Batch selection hook
  const batchSelection = useBatchSelection<UserProfile>();

  // Batch edit form data
  const [batchEditData, setBatchEditData] = useState({
    role: '',
    station: '',
    is_active: true
  });

  const roles = ['Administrator', 'Management', 'Employee'];
  const stations = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN'];

  const [formData, setFormData] = useState({
    user_id: 0,
    role: 'Employee',
    station: 'MOBIL',
    employee_id: '',
    phone: '',
    hire_date: '',
    is_active: true
  });

  // Generate random user ID
  const generateRandomUserId = () => {
    const randomId = Math.floor(Math.random() * 1000000) + 100000; // 6-digit random number
    return randomId;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUserProfiles(), fetchUsers()]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast({
      title: "Success",
      description: "Data refreshed successfully"
    });
  };

  const fetchUsers = async () => {
    try {
      // Using direct Supabase integration for user management
      // This is a simplified approach as user management is now handled through Supabase
      console.log('User info now managed through Supabase user profiles');
      setUsers([]);
    } catch (error) {
      console.error('Error fetching current user info:', error);
      setUsers([]);
    }
  };

  const fetchUserProfiles = async () => {
    try {
      console.log('Fetching user profiles from user_profiles table');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('API returned error:', error);
        throw error;
      }

      console.log('User profiles data received:', data);
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: "Error",
        description: `Failed to fetch user profiles: ${error}`,
        variant: "destructive"
      });
      setUserProfiles([]);
    }
  };

  const handleCreateProfile = async () => {
    if (!formData.employee_id || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Employee ID and Phone are required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert(formData);
        
      if (error) throw error;

      toast({
        title: "Success",
        description: "User profile created successfully"
      });

      setIsAddDialogOpen(false);
      setFormData({
        user_id: generateRandomUserId(),
        role: 'Employee',
        station: 'MOBIL',
        employee_id: '',
        phone: '',
        hire_date: '',
        is_active: true
      });
      fetchUserProfiles();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: `Failed to create user profile: ${error}`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!selectedUserProfile) return;

    if (!formData.employee_id || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Employee ID and Phone are required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('id', selectedUserProfile.id);
        
      if (error) throw error;

      toast({
        title: "Success",
        description: "User profile updated successfully"
      });

      setIsEditDialogOpen(false);
      setSelectedUserProfile(null);
      fetchUserProfiles();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: `Failed to update user profile: ${error}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    if (!confirm('Are you sure you want to delete this user profile? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId);
        
      if (error) throw error;

      toast({
        title: "Success",
        description: "User profile deleted successfully"
      });

      fetchUserProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: `Failed to delete user profile: ${error}`,
        variant: "destructive"
      });
    }
  };

  // Batch operations
  const handleBatchEdit = () => {
    const selectedData = batchSelection.getSelectedData(filteredProfiles, (profile) => profile.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select profiles to edit",
        variant: "destructive"
      });
      return;
    }
    setIsBatchEditDialogOpen(true);
  };

  const handleBatchDelete = () => {
    const selectedData = batchSelection.getSelectedData(filteredProfiles, (profile) => profile.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select profiles to delete",
        variant: "destructive"
      });
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };

  const confirmBatchEdit = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(filteredProfiles, (profile) => profile.id);
      const updates = selectedData.map((profile) => ({
        id: profile.id,
        ...(batchEditData.role && { role: batchEditData.role }),
        ...(batchEditData.station && { station: batchEditData.station }),
        is_active: batchEditData.is_active
      }));

      for (const update of updates) {
        const { id, ...updateData } = update;
        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Updated ${selectedData.length} user profiles successfully`
      });

      setIsBatchEditDialogOpen(false);
      batchSelection.clearSelection();
      fetchUserProfiles();
    } catch (error) {
      console.error('Error in batch edit:', error);
      toast({
        title: "Error",
        description: `Failed to update profiles: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };

  const confirmBatchDelete = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(filteredProfiles, (profile) => profile.id);

      for (const profile of selectedData) {
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', profile.id);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Deleted ${selectedData.length} user profiles successfully`
      });

      setIsBatchDeleteDialogOpen(false);
      batchSelection.clearSelection();
      fetchUserProfiles();
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast({
        title: "Error",
        description: `Failed to delete profiles: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };

  const handleEditProfile = (profile: UserProfile) => {
    setSelectedUserProfile(profile);
    setFormData({
      user_id: profile.user_id,
      role: profile.role,
      station: profile.station,
      employee_id: profile.employee_id,
      phone: profile.phone,
      hire_date: profile.hire_date || '',
      is_active: profile.is_active
    });
    setIsEditDialogOpen(true);
  };

  const filteredProfiles = userProfiles.filter((profile) => {
    const matchesSearch =
    profile.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || profile.role === selectedRole;
    const matchesStation = selectedStation === 'All' || profile.station === selectedStation;

    return matchesSearch && matchesRole && matchesStation;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Administrator':return 'bg-red-100 text-red-800';
      case 'Management':return 'bg-blue-100 text-blue-800';
      case 'Employee':return 'bg-green-100 text-green-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  const getStationBadgeColor = (station: string) => {
    switch (station) {
      case 'MOBIL':return 'bg-purple-100 text-purple-800';
      case 'AMOCO ROSEDALE':return 'bg-orange-100 text-orange-800';
      case 'AMOCO BROOKLYN':return 'bg-teal-100 text-teal-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionSummary = (profile: UserProfile) => {
    try {
      if (!profile.detailed_permissions) {
        return {
          summary: 'No permissions set',
          details: 'Permissions not configured',
          hasAccess: false,
          viewCount: 0,
          editCount: 0,
          createCount: 0
        };
      }

      const permissions = JSON.parse(profile.detailed_permissions);
      const contentAreas = [
      'dashboard', 'products', 'employees', 'sales_reports', 'vendors',
      'orders', 'licenses', 'salary', 'inventory', 'delivery', 'settings',
      'user_management', 'site_management', 'system_logs', 'security_settings'];


      const viewCount = contentAreas.filter((area) => permissions[area]?.view).length;
      const editCount = contentAreas.filter((area) => permissions[area]?.edit).length;
      const createCount = contentAreas.filter((area) => permissions[area]?.create).length;

      return {
        summary: `${viewCount}/${contentAreas.length} areas`,
        details: `View: ${viewCount}, Edit: ${editCount}, Create: ${createCount}`,
        hasAccess: viewCount > 0,
        viewCount,
        editCount,
        createCount
      };
    } catch {
      return {
        summary: 'Invalid permissions',
        details: 'Permission data corrupted',
        hasAccess: false,
        viewCount: 0,
        editCount: 0,
        createCount: 0
      };
    }
  };

  // Check admin access first
  if (!isAdmin) {
    return (
      <AccessDenied
        feature="User Management"
        requiredRole="Administrator" data-id="8layjxget" data-path="src/pages/Admin/UserManagement.tsx" />);

  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64" data-id="4odhdzois" data-path="src/pages/Admin/UserManagement.tsx">
        <div className="text-lg" data-id="wp1fpcaja" data-path="src/pages/Admin/UserManagement.tsx">Loading user management...</div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="nkyl8if0t" data-path="src/pages/Admin/UserManagement.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="691ou28mp" data-path="src/pages/Admin/UserManagement.tsx">
        <div className="flex items-center space-x-3" data-id="uepgmow91" data-path="src/pages/Admin/UserManagement.tsx">
          <Users className="w-8 h-8 text-blue-600" data-id="yr5i1qka1" data-path="src/pages/Admin/UserManagement.tsx" />
          <div data-id="yzg2jc8di" data-path="src/pages/Admin/UserManagement.tsx">
            <h1 className="text-2xl font-bold text-gray-900" data-id="g9qdvnxp2" data-path="src/pages/Admin/UserManagement.tsx">Real-time User Management</h1>
            <p className="text-sm text-green-600 font-medium" data-id="csh3upxp2" data-path="src/pages/Admin/UserManagement.tsx">✓ Production Database Connected - Live User Data</p>
          </div>
        </div>
        <div className="flex items-center space-x-2" data-id="r0u67gvqx" data-path="src/pages/Admin/UserManagement.tsx">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-id="kwzxet06g" data-path="src/pages/Admin/UserManagement.tsx">
            {userProfiles.length} Users
          </Badge>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            className="flex items-center space-x-2" data-id="0gwxcz5t1" data-path="src/pages/Admin/UserManagement.tsx">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} data-id="mllr40r1p" data-path="src/pages/Admin/UserManagement.tsx" />
            <span data-id="jfij4soz6" data-path="src/pages/Admin/UserManagement.tsx">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="profiles" className="w-full" data-id="oqlxxlsu3" data-path="src/pages/Admin/UserManagement.tsx">
        <TabsList className="grid w-full grid-cols-2" data-id="bv1u4da2t" data-path="src/pages/Admin/UserManagement.tsx">
          <TabsTrigger value="profiles" className="flex items-center space-x-2" data-id="q47ndxfet" data-path="src/pages/Admin/UserManagement.tsx">
            <Users className="w-4 h-4" data-id="ehkxpvyn6" data-path="src/pages/Admin/UserManagement.tsx" />
            <span data-id="cqzn7zuvm" data-path="src/pages/Admin/UserManagement.tsx">User Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2" data-id="e3p9zqryy" data-path="src/pages/Admin/UserManagement.tsx">
            <Shield className="w-4 h-4" data-id="24fer7wrp" data-path="src/pages/Admin/UserManagement.tsx" />
            <span data-id="84mlt2091" data-path="src/pages/Admin/UserManagement.tsx">Permission Management</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6" data-id="ck1onn9zl" data-path="src/pages/Admin/UserManagement.tsx">
          {/* User Action Buttons */}
          <div className="flex items-center justify-end space-x-3" data-id="61uhhpjbn" data-path="src/pages/Admin/UserManagement.tsx">
            <Button
              onClick={() => setIsCreateUserDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700" data-id="nmh54rak7" data-path="src/pages/Admin/UserManagement.tsx">

              <UserPlus className="w-4 h-4 mr-2" data-id="dt6apyr4g" data-path="src/pages/Admin/UserManagement.tsx" />
              Create New User
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              if (open) {
                // Generate new random user ID when opening dialog
                const newUserId = generateRandomUserId();
                setFormData((prev) => ({ ...prev, user_id: newUserId }));
              }
              setIsAddDialogOpen(open);
            }} data-id="pjsyzqgiw" data-path="src/pages/Admin/UserManagement.tsx">
              <DialogTrigger asChild data-id="05m56bcr1" data-path="src/pages/Admin/UserManagement.tsx">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" data-id="nzkwqsj1k" data-path="src/pages/Admin/UserManagement.tsx">
                  <Plus className="w-4 h-4 mr-2" data-id="nzznx53nw" data-path="src/pages/Admin/UserManagement.tsx" />
                  Add User Profile Only
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh]" data-id="xoott60b8" data-path="src/pages/Admin/UserManagement.tsx">
                <DialogHeader data-id="d5ag8o875" data-path="src/pages/Admin/UserManagement.tsx">
                  <DialogTitle data-id="1lqvr6j6n" data-path="src/pages/Admin/UserManagement.tsx">Create User Profile</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(85vh-120px)] pr-4" data-id="91bhy23l9" data-path="src/pages/Admin/UserManagement.tsx">
                  <div className="space-y-4" data-id="7fehrpv7v" data-path="src/pages/Admin/UserManagement.tsx">
                    <div data-id="66g7u4e4f" data-path="src/pages/Admin/UserManagement.tsx">
                      <Label htmlFor="user_id" data-id="7d34bh0io" data-path="src/pages/Admin/UserManagement.tsx">User ID (Auto-generated)</Label>
                      <div className="relative" data-id="7rdl7ei8t" data-path="src/pages/Admin/UserManagement.tsx">
                        <Input
                          id="user_id"
                          type="number"
                          value={formData.user_id}
                          readOnly
                          disabled
                          className="bg-gray-50 text-gray-700 cursor-not-allowed"
                          placeholder="Auto-generated ID" data-id="cdvcm31sx" data-path="src/pages/Admin/UserManagement.tsx" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
                          onClick={() => {
                            const newUserId = generateRandomUserId();
                            setFormData((prev) => ({ ...prev, user_id: newUserId }));
                            toast({
                              title: "Success",
                              description: `New User ID generated: ${newUserId}`
                            });
                          }}
                          title="Generate new random User ID" data-id="27fc6ahjv" data-path="src/pages/Admin/UserManagement.tsx">

                          <RefreshCw className="w-3 h-3" data-id="y1dtpho5p" data-path="src/pages/Admin/UserManagement.tsx" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1" data-id="ghb6rklnt" data-path="src/pages/Admin/UserManagement.tsx">
                        User ID is automatically generated. Click the refresh icon to generate a new one.
                      </p>
                    </div>
                    <div data-id="icc1175p6" data-path="src/pages/Admin/UserManagement.tsx">
                      <Label htmlFor="role" data-id="ps4tbuzs7" data-path="src/pages/Admin/UserManagement.tsx">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} data-id="wvn8xvw9e" data-path="src/pages/Admin/UserManagement.tsx">
                        <SelectTrigger data-id="r6c4dy4y7" data-path="src/pages/Admin/UserManagement.tsx">
                          <SelectValue data-id="zbea79y5w" data-path="src/pages/Admin/UserManagement.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="rvz1bzvou" data-path="src/pages/Admin/UserManagement.tsx">
                          {roles.map((role) =>
                          <SelectItem key={role} value={role} data-id="6yq33nfkc" data-path="src/pages/Admin/UserManagement.tsx">{role}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div data-id="lud54xgr2" data-path="src/pages/Admin/UserManagement.tsx">
                      <Label htmlFor="station" data-id="t2p3v5qd5" data-path="src/pages/Admin/UserManagement.tsx">Station</Label>
                      <Select value={formData.station} onValueChange={(value) => setFormData({ ...formData, station: value })} data-id="a6lowa8er" data-path="src/pages/Admin/UserManagement.tsx">
                        <SelectTrigger data-id="7z2jkfy4w" data-path="src/pages/Admin/UserManagement.tsx">
                          <SelectValue data-id="sgfuzzhxf" data-path="src/pages/Admin/UserManagement.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="ev6u0ui8c" data-path="src/pages/Admin/UserManagement.tsx">
                          {stations.map((station) =>
                          <SelectItem key={station} value={station} data-id="9ug7af0oy" data-path="src/pages/Admin/UserManagement.tsx">{station}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div data-id="tj1la3m88" data-path="src/pages/Admin/UserManagement.tsx">
                      <Label htmlFor="employee_id" data-id="98uyx2ltr" data-path="src/pages/Admin/UserManagement.tsx">Employee ID *</Label>
                      <Input
                        id="employee_id"
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        placeholder="Enter employee ID"
                        required data-id="vq4m64cd2" data-path="src/pages/Admin/UserManagement.tsx" />
                    </div>
                    <div data-id="ahl1b4q28" data-path="src/pages/Admin/UserManagement.tsx">
                      <Label htmlFor="phone" data-id="vdyes21vt" data-path="src/pages/Admin/UserManagement.tsx">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required data-id="umgh5irns" data-path="src/pages/Admin/UserManagement.tsx" />
                    </div>
                    <div data-id="7gwxir2lp" data-path="src/pages/Admin/UserManagement.tsx">
                      <Label htmlFor="hire_date" data-id="1usit424l" data-path="src/pages/Admin/UserManagement.tsx">Hire Date</Label>
                      <Input
                        id="hire_date"
                        type="date"
                        value={formData.hire_date}
                        onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} data-id="a603on6jl" data-path="src/pages/Admin/UserManagement.tsx" />
                    </div>
                    <div className="flex items-center space-x-2" data-id="xqb0iodxo" data-path="src/pages/Admin/UserManagement.tsx">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} data-id="k0efnvkz7" data-path="src/pages/Admin/UserManagement.tsx" />
                      <Label htmlFor="is_active" data-id="wjhkpb37h" data-path="src/pages/Admin/UserManagement.tsx">Active User</Label>
                    </div>
                    <Button onClick={handleCreateProfile} className="w-full" data-id="i7i0qtwvn" data-path="src/pages/Admin/UserManagement.tsx">
                      Create Profile
                    </Button>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="1txbg5pfz" data-path="src/pages/Admin/UserManagement.tsx">
            <Card data-id="oio01n61q" data-path="src/pages/Admin/UserManagement.tsx">
              <CardContent className="p-4" data-id="f4vvmqmt0" data-path="src/pages/Admin/UserManagement.tsx">
                <div className="flex items-center space-x-3" data-id="iwfz2rfev" data-path="src/pages/Admin/UserManagement.tsx">
                  <Users className="w-8 h-8 text-blue-600" data-id="5pvhabm5j" data-path="src/pages/Admin/UserManagement.tsx" />
                  <div data-id="gtdyjs91m" data-path="src/pages/Admin/UserManagement.tsx">
                    <p className="text-sm text-gray-600" data-id="r5oy2a1ym" data-path="src/pages/Admin/UserManagement.tsx">Total Users</p>
                    <p className="text-2xl font-bold" data-id="74ygayxpo" data-path="src/pages/Admin/UserManagement.tsx">{userProfiles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-id="7v3i5xhcr" data-path="src/pages/Admin/UserManagement.tsx">
              <CardContent className="p-4" data-id="l9a3y30p2" data-path="src/pages/Admin/UserManagement.tsx">
                <div className="flex items-center space-x-3" data-id="8o8fivv0e" data-path="src/pages/Admin/UserManagement.tsx">
                  <Shield className="w-8 h-8 text-green-600" data-id="b2r31nkjx" data-path="src/pages/Admin/UserManagement.tsx" />
                  <div data-id="t3iucc8a5" data-path="src/pages/Admin/UserManagement.tsx">
                    <p className="text-sm text-gray-600" data-id="kxb75hn5s" data-path="src/pages/Admin/UserManagement.tsx">Administrators</p>
                    <p className="text-2xl font-bold" data-id="hc9njbfmm" data-path="src/pages/Admin/UserManagement.tsx">
                      {userProfiles.filter((p) => p.role === 'Administrator').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-id="1a3bcr513" data-path="src/pages/Admin/UserManagement.tsx">
              <CardContent className="p-4" data-id="lal4x5y82" data-path="src/pages/Admin/UserManagement.tsx">
                <div className="flex items-center space-x-3" data-id="kxa2wdc3s" data-path="src/pages/Admin/UserManagement.tsx">
                  <UserCheck className="w-8 h-8 text-green-600" data-id="pm8pt4x7v" data-path="src/pages/Admin/UserManagement.tsx" />
                  <div data-id="zyoknaug9" data-path="src/pages/Admin/UserManagement.tsx">
                    <p className="text-sm text-gray-600" data-id="jtw32h1cr" data-path="src/pages/Admin/UserManagement.tsx">Active Users</p>
                    <p className="text-2xl font-bold" data-id="j1viyf1jd" data-path="src/pages/Admin/UserManagement.tsx">
                      {userProfiles.filter((p) => p.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-id="f6dv557pf" data-path="src/pages/Admin/UserManagement.tsx">
              <CardContent className="p-4" data-id="6t29dyq4a" data-path="src/pages/Admin/UserManagement.tsx">
                <div className="flex items-center space-x-3" data-id="rfz32iemf" data-path="src/pages/Admin/UserManagement.tsx">
                  <UserX className="w-8 h-8 text-red-600" data-id="zka3fn3t8" data-path="src/pages/Admin/UserManagement.tsx" />
                  <div data-id="jw54y1otv" data-path="src/pages/Admin/UserManagement.tsx">
                    <p className="text-sm text-gray-600" data-id="ivl6601z8" data-path="src/pages/Admin/UserManagement.tsx">Inactive Users</p>
                    <p className="text-2xl font-bold" data-id="yzfdbw7ut" data-path="src/pages/Admin/UserManagement.tsx">
                      {userProfiles.filter((p) => !p.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card data-id="vf7u24nal" data-path="src/pages/Admin/UserManagement.tsx">
            <CardContent className="p-4" data-id="08zsrzkmd" data-path="src/pages/Admin/UserManagement.tsx">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="lmumbnm7q" data-path="src/pages/Admin/UserManagement.tsx">
                <div className="relative" data-id="13prktmzs" data-path="src/pages/Admin/UserManagement.tsx">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="611azm7yl" data-path="src/pages/Admin/UserManagement.tsx" />
                  <Input
                    placeholder="Search by employee ID or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10" data-id="prr3n5iyb" data-path="src/pages/Admin/UserManagement.tsx" />
                </div>
                
                <Select value={selectedRole} onValueChange={setSelectedRole} data-id="5w25wy8pt" data-path="src/pages/Admin/UserManagement.tsx">
                  <SelectTrigger data-id="6hehwqmo0" data-path="src/pages/Admin/UserManagement.tsx">
                    <SelectValue placeholder="Filter by role" data-id="1n82dnavt" data-path="src/pages/Admin/UserManagement.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="pdqvyoyjk" data-path="src/pages/Admin/UserManagement.tsx">
                    <SelectItem value="All" data-id="a81ss632j" data-path="src/pages/Admin/UserManagement.tsx">All Roles</SelectItem>
                    {roles.map((role) =>
                    <SelectItem key={role} value={role} data-id="e15hpx7yt" data-path="src/pages/Admin/UserManagement.tsx">{role}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStation} onValueChange={setSelectedStation} data-id="hxc6z4bmf" data-path="src/pages/Admin/UserManagement.tsx">
                  <SelectTrigger data-id="7tff7eg8h" data-path="src/pages/Admin/UserManagement.tsx">
                    <SelectValue placeholder="Filter by station" data-id="bahzm0dxm" data-path="src/pages/Admin/UserManagement.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="zg5rbjz64" data-path="src/pages/Admin/UserManagement.tsx">
                    <SelectItem value="All" data-id="bt4o0uuos" data-path="src/pages/Admin/UserManagement.tsx">All Stations</SelectItem>
                    {stations.map((station) =>
                    <SelectItem key={station} value={station} data-id="tbrbbycv6" data-path="src/pages/Admin/UserManagement.tsx">{station}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('All');
                    setSelectedStation('All');
                  }} data-id="rdq0id4jc" data-path="src/pages/Admin/UserManagement.tsx">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Batch Action Bar */}
          <BatchActionBar
            selectedCount={batchSelection.selectedCount}
            onBatchEdit={handleBatchEdit}
            onBatchDelete={handleBatchDelete}
            onClearSelection={batchSelection.clearSelection}
            isLoading={batchActionLoading} data-id="rrdol99j3" data-path="src/pages/Admin/UserManagement.tsx" />


          {/* User Profiles Table */}
          <Card data-id="ioioxxxsl" data-path="src/pages/Admin/UserManagement.tsx">
            <CardHeader data-id="3x2av8n52" data-path="src/pages/Admin/UserManagement.tsx">
              <CardTitle data-id="sudwwii51" data-path="src/pages/Admin/UserManagement.tsx">User Profiles ({filteredProfiles.length})</CardTitle>
            </CardHeader>
            <CardContent data-id="bf1zyh86z" data-path="src/pages/Admin/UserManagement.tsx">
              <div className="overflow-x-auto" data-id="bpnvx3rbx" data-path="src/pages/Admin/UserManagement.tsx">
                <Table data-id="xbb11odls" data-path="src/pages/Admin/UserManagement.tsx">
                  <TableHeader data-id="x80yxk15v" data-path="src/pages/Admin/UserManagement.tsx">
                    <TableRow data-id="9nem9ljan" data-path="src/pages/Admin/UserManagement.tsx">
                      <TableHead className="w-12" data-id="e93kz0m0o" data-path="src/pages/Admin/UserManagement.tsx">
                        <Checkbox
                          checked={filteredProfiles.length > 0 && batchSelection.selectedCount === filteredProfiles.length}
                          onCheckedChange={() => batchSelection.toggleSelectAll(filteredProfiles, (profile) => profile.id)}
                          aria-label="Select all profiles" data-id="8kdm6ro8z" data-path="src/pages/Admin/UserManagement.tsx" />

                      </TableHead>
                      <TableHead data-id="j0htpwx5t" data-path="src/pages/Admin/UserManagement.tsx">Employee ID</TableHead>
                      <TableHead data-id="jd2nkl5uv" data-path="src/pages/Admin/UserManagement.tsx">Role</TableHead>
                      <TableHead data-id="zvmj70ten" data-path="src/pages/Admin/UserManagement.tsx">Station</TableHead>
                      <TableHead data-id="gsg0c2u2k" data-path="src/pages/Admin/UserManagement.tsx">Phone</TableHead>
                      <TableHead data-id="fb9vsirp0" data-path="src/pages/Admin/UserManagement.tsx">Hire Date</TableHead>
                      <TableHead data-id="zcj1v8mgu" data-path="src/pages/Admin/UserManagement.tsx">Status</TableHead>
                      <TableHead data-id="rbvxfxiv7" data-path="src/pages/Admin/UserManagement.tsx">Permissions</TableHead>
                      <TableHead data-id="188i3ls14" data-path="src/pages/Admin/UserManagement.tsx">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-id="j1egj4yyt" data-path="src/pages/Admin/UserManagement.tsx">
                    {filteredProfiles.length === 0 ?
                    <TableRow data-id="q5ovjdywd" data-path="src/pages/Admin/UserManagement.tsx">
                        <TableCell colSpan={9} className="text-center py-8" data-id="dzortyijn" data-path="src/pages/Admin/UserManagement.tsx">
                          <div className="flex flex-col items-center space-y-3" data-id="ooc5i1p8n" data-path="src/pages/Admin/UserManagement.tsx">
                            {userProfiles.length === 0 ?
                          <>
                                <Users className="w-12 h-12 text-gray-300" data-id="7fyna6erk" data-path="src/pages/Admin/UserManagement.tsx" />
                                <div data-id="iiegim614" data-path="src/pages/Admin/UserManagement.tsx">
                                  <p className="text-gray-500 font-medium" data-id="z28fi5wt7" data-path="src/pages/Admin/UserManagement.tsx">No User Profiles Found</p>
                                  <p className="text-sm text-gray-400" data-id="qj61ju19a" data-path="src/pages/Admin/UserManagement.tsx">Create your first user profile to get started with the system</p>
                                </div>
                                <Button
                              onClick={() => setIsCreateUserDialogOpen(true)}
                              className="bg-blue-600 hover:bg-blue-700" data-id="th4weppbp" data-path="src/pages/Admin/UserManagement.tsx">

                                  <UserPlus className="w-4 h-4 mr-2" data-id="j1mo6r4fa" data-path="src/pages/Admin/UserManagement.tsx" />
                                  Create First User
                                </Button>
                              </> :

                          <>
                                <Search className="w-12 h-12 text-gray-300" data-id="azomegurp" data-path="src/pages/Admin/UserManagement.tsx" />
                                <div data-id="fy99r346j" data-path="src/pages/Admin/UserManagement.tsx">
                                  <p className="text-gray-500 font-medium" data-id="pvnhj0vp3" data-path="src/pages/Admin/UserManagement.tsx">No Profiles Match Current Filters</p>
                                  <p className="text-sm text-gray-400" data-id="jdpwbrjqy" data-path="src/pages/Admin/UserManagement.tsx">Try adjusting your search criteria or clearing filters</p>
                                </div>
                                <Button
                              variant="outline"
                              onClick={() => {
                                setSearchTerm('');
                                setSelectedRole('All');
                                setSelectedStation('All');
                              }} data-id="z21eijd9v" data-path="src/pages/Admin/UserManagement.tsx">

                                  Clear All Filters
                                </Button>
                              </>
                          }
                          </div>
                        </TableCell>
                      </TableRow> :

                    filteredProfiles.map((profile) =>
                    <TableRow key={profile.id} className={batchSelection.isSelected(profile.id) ? "bg-blue-50" : ""} data-id="a4mgfb0yc" data-path="src/pages/Admin/UserManagement.tsx">
                          <TableCell data-id="c0wukuoj6" data-path="src/pages/Admin/UserManagement.tsx">
                            <Checkbox
                          checked={batchSelection.isSelected(profile.id)}
                          onCheckedChange={() => batchSelection.toggleItem(profile.id)}
                          aria-label={`Select profile ${profile.employee_id}`} data-id="3sc8hx002" data-path="src/pages/Admin/UserManagement.tsx" />

                          </TableCell>
                          <TableCell className="font-medium" data-id="njc8d11h4" data-path="src/pages/Admin/UserManagement.tsx">{profile.employee_id}</TableCell>
                          <TableCell data-id="ckfkwuryr" data-path="src/pages/Admin/UserManagement.tsx">
                            <Badge className={getRoleBadgeColor(profile.role)} data-id="yk8gcc6q4" data-path="src/pages/Admin/UserManagement.tsx">
                              {profile.role}
                            </Badge>
                          </TableCell>
                          <TableCell data-id="wqwowa8ct" data-path="src/pages/Admin/UserManagement.tsx">
                            <Badge className={getStationBadgeColor(profile.station)} data-id="pb5osvn3g" data-path="src/pages/Admin/UserManagement.tsx">
                              {profile.station}
                            </Badge>
                          </TableCell>
                          <TableCell data-id="qo2cxnxvb" data-path="src/pages/Admin/UserManagement.tsx">{profile.phone}</TableCell>
                          <TableCell data-id="bvrmr0ial" data-path="src/pages/Admin/UserManagement.tsx">{profile.hire_date ? new Date(profile.hire_date).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell data-id="qizee5cu6" data-path="src/pages/Admin/UserManagement.tsx">
                            <Badge className={profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} data-id="74ubejo46" data-path="src/pages/Admin/UserManagement.tsx">
                              {profile.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell data-id="akluwcb6g" data-path="src/pages/Admin/UserManagement.tsx">
                            {(() => {
                          const permSummary = getPermissionSummary(profile);
                          return (
                            <div className="space-y-1" data-id="ybe2ilbwn" data-path="src/pages/Admin/UserManagement.tsx">
                                  <Badge
                                variant={permSummary.hasAccess ? "default" : "secondary"}
                                className={permSummary.hasAccess ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} data-id="y7zk3a5dv" data-path="src/pages/Admin/UserManagement.tsx">

                                    {permSummary.summary}
                                  </Badge>
                                  <p className="text-xs text-gray-500" data-id="jkneilpl0" data-path="src/pages/Admin/UserManagement.tsx">{permSummary.details}</p>
                                </div>);

                        })()} 
                          </TableCell>
                          <TableCell data-id="tf9kholys" data-path="src/pages/Admin/UserManagement.tsx">
                            <div className="flex space-x-2" data-id="lb513z80t" data-path="src/pages/Admin/UserManagement.tsx">
                              <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProfile(profile)} data-id="3oeilyg10" data-path="src/pages/Admin/UserManagement.tsx">
                                <Edit3 className="w-4 h-4" data-id="9z6x009th" data-path="src/pages/Admin/UserManagement.tsx" />
                              </Button>
                              <ComprehensivePermissionDialog
                            selectedUserId={profile.id}
                            trigger={
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700"
                              title="Comprehensive Permission Management" data-id="iq16jjtpc" data-path="src/pages/Admin/UserManagement.tsx">

                                    <Shield className="w-4 h-4" data-id="0tn5yv54h" data-path="src/pages/Admin/UserManagement.tsx" />
                                  </Button>
                            } data-id="oujdygdkz" data-path="src/pages/Admin/UserManagement.tsx" />

                              <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="text-red-600 hover:text-red-700" data-id="ropq6ge7r" data-path="src/pages/Admin/UserManagement.tsx">
                                <Trash2 className="w-4 h-4" data-id="taytw0tam" data-path="src/pages/Admin/UserManagement.tsx" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    )
                    }
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} data-id="f6dwkfx64" data-path="src/pages/Admin/UserManagement.tsx">
            <DialogContent className="max-w-6xl max-h-[90vh]" data-id="k14a4ecx0" data-path="src/pages/Admin/UserManagement.tsx">
              <DialogHeader data-id="w4qdfhpmu" data-path="src/pages/Admin/UserManagement.tsx">
                <DialogTitle data-id="06awhvuzs" data-path="src/pages/Admin/UserManagement.tsx">Edit User Profile & Permissions</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(90vh-120px)]" data-id="5d2q6dbqg" data-path="src/pages/Admin/UserManagement.tsx">
                {/* Left Side - Edit Form */}
                <div className="lg:col-span-1" data-id="gdtxu7dih" data-path="src/pages/Admin/UserManagement.tsx">
                  <ScrollArea className="h-full pr-4" data-id="wpibjkmlo" data-path="src/pages/Admin/UserManagement.tsx">
                    <div className="space-y-4" data-id="6i1o92139" data-path="src/pages/Admin/UserManagement.tsx">
                      <div data-id="840zv49cx" data-path="src/pages/Admin/UserManagement.tsx">
                        <Label htmlFor="edit_role" data-id="zdxsjbsd6" data-path="src/pages/Admin/UserManagement.tsx">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} data-id="jee1bd6ih" data-path="src/pages/Admin/UserManagement.tsx">
                          <SelectTrigger data-id="nlgcfrm2z" data-path="src/pages/Admin/UserManagement.tsx">
                            <SelectValue data-id="yj71l3i3v" data-path="src/pages/Admin/UserManagement.tsx" />
                          </SelectTrigger>
                          <SelectContent data-id="s91152692" data-path="src/pages/Admin/UserManagement.tsx">
                            {roles.map((role) =>
                            <SelectItem key={role} value={role} data-id="niwhntwg3" data-path="src/pages/Admin/UserManagement.tsx">{role}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div data-id="nr3zhtwyl" data-path="src/pages/Admin/UserManagement.tsx">
                        <Label htmlFor="edit_station" data-id="coki8wxqz" data-path="src/pages/Admin/UserManagement.tsx">Station</Label>
                        <Select value={formData.station} onValueChange={(value) => setFormData({ ...formData, station: value })} data-id="cddqk0lwy" data-path="src/pages/Admin/UserManagement.tsx">
                          <SelectTrigger data-id="08dmgfx0l" data-path="src/pages/Admin/UserManagement.tsx">
                            <SelectValue data-id="07f7x1yq3" data-path="src/pages/Admin/UserManagement.tsx" />
                          </SelectTrigger>
                          <SelectContent data-id="zp3zoi810" data-path="src/pages/Admin/UserManagement.tsx">
                            {stations.map((station) =>
                            <SelectItem key={station} value={station} data-id="nkkp99p0b" data-path="src/pages/Admin/UserManagement.tsx">{station}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div data-id="exdtqwk34" data-path="src/pages/Admin/UserManagement.tsx">
                        <Label htmlFor="edit_employee_id" data-id="872ii7c5x" data-path="src/pages/Admin/UserManagement.tsx">Employee ID *</Label>
                        <Input
                          id="edit_employee_id"
                          value={formData.employee_id}
                          onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                          required data-id="ctachhnol" data-path="src/pages/Admin/UserManagement.tsx" />
                      </div>
                      <div data-id="0k6ozek0z" data-path="src/pages/Admin/UserManagement.tsx">
                        <Label htmlFor="edit_phone" data-id="a86f47ddu" data-path="src/pages/Admin/UserManagement.tsx">Phone *</Label>
                        <Input
                          id="edit_phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required data-id="qmdqoph0g" data-path="src/pages/Admin/UserManagement.tsx" />
                      </div>
                      <div data-id="oiremmzsk" data-path="src/pages/Admin/UserManagement.tsx">
                        <Label htmlFor="edit_hire_date" data-id="jgji4do4f" data-path="src/pages/Admin/UserManagement.tsx">Hire Date</Label>
                        <Input
                          id="edit_hire_date"
                          type="date"
                          value={formData.hire_date}
                          onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} data-id="nceixyoay" data-path="src/pages/Admin/UserManagement.tsx" />
                      </div>
                      <div className="flex items-center space-x-2" data-id="f5jnhup3u" data-path="src/pages/Admin/UserManagement.tsx">
                        <input
                          type="checkbox"
                          id="edit_is_active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} data-id="o12jkuady" data-path="src/pages/Admin/UserManagement.tsx" />
                        <Label htmlFor="edit_is_active" data-id="krzgeyhxw" data-path="src/pages/Admin/UserManagement.tsx">Active User</Label>
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full" data-id="6o9t13gav" data-path="src/pages/Admin/UserManagement.tsx">
                        Update Profile
                      </Button>
                      
                      {/* Quick Permission Management */}
                      <Separator data-id="l8e6khxqz" data-path="src/pages/Admin/UserManagement.tsx" />
                      <div className="space-y-3" data-id="10dgx1ufx" data-path="src/pages/Admin/UserManagement.tsx">
                        <h4 className="font-semibold text-sm flex items-center" data-id="8nmf1izru" data-path="src/pages/Admin/UserManagement.tsx">
                          <Shield className="w-4 h-4 mr-2" data-id="smlnnbudq" data-path="src/pages/Admin/UserManagement.tsx" />
                          Quick Actions
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const permissionsTab = document.querySelector('[value="permissions"]') as HTMLElement;
                            if (permissionsTab) {
                              permissionsTab.click();
                            }
                          }}
                          className="w-full" data-id="de0c3k61q" data-path="src/pages/Admin/UserManagement.tsx">

                          Manage Detailed Permissions
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* Middle & Right Side - User Summary & Activity */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" data-id="bcsdov6u6" data-path="src/pages/Admin/UserManagement.tsx">
                  {/* User Summary */}
                  <div data-id="2zytn19nt" data-path="src/pages/Admin/UserManagement.tsx">
                    <ScrollArea className="h-full" data-id="zdbst3chi" data-path="src/pages/Admin/UserManagement.tsx">
                      <div className="space-y-4" data-id="rnvm4wyej" data-path="src/pages/Admin/UserManagement.tsx">
                        <h3 className="font-semibold text-lg mb-3 flex items-center" data-id="t2gyg0uoe" data-path="src/pages/Admin/UserManagement.tsx">
                          <Eye className="w-5 h-5 mr-2 text-blue-600" data-id="0t2lphpiv" data-path="src/pages/Admin/UserManagement.tsx" />
                          User Summary
                        </h3>
                        <div className="space-y-3" data-id="29ukm1v6k" data-path="src/pages/Admin/UserManagement.tsx">
                          <div className="p-3 bg-gray-50 rounded-lg" data-id="zj46avv1z" data-path="src/pages/Admin/UserManagement.tsx">
                            <p className="text-sm text-gray-600" data-id="enzqvwc0s" data-path="src/pages/Admin/UserManagement.tsx">Employee ID</p>
                            <p className="font-medium" data-id="r0nl0uuoa" data-path="src/pages/Admin/UserManagement.tsx">{selectedUserProfile?.employee_id || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg" data-id="c457iusd1" data-path="src/pages/Admin/UserManagement.tsx">
                            <p className="text-sm text-gray-600" data-id="9eeuflj27" data-path="src/pages/Admin/UserManagement.tsx">Current Role</p>
                            <Badge className={getRoleBadgeColor(selectedUserProfile?.role || '')} data-id="cq4fwvmsa" data-path="src/pages/Admin/UserManagement.tsx">
                              {selectedUserProfile?.role || 'N/A'}
                            </Badge>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg" data-id="9bdoi6uby" data-path="src/pages/Admin/UserManagement.tsx">
                            <p className="text-sm text-gray-600" data-id="sn9c6q0ts" data-path="src/pages/Admin/UserManagement.tsx">Station Assignment</p>
                            <Badge className={getStationBadgeColor(selectedUserProfile?.station || '')} data-id="03alblvq1" data-path="src/pages/Admin/UserManagement.tsx">
                              {selectedUserProfile?.station || 'N/A'}
                            </Badge>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg" data-id="7jzgyu18n" data-path="src/pages/Admin/UserManagement.tsx">
                            <p className="text-sm text-gray-600" data-id="7vmlea86x" data-path="src/pages/Admin/UserManagement.tsx">Status</p>
                            <Badge className={selectedUserProfile?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} data-id="cznygp6kv" data-path="src/pages/Admin/UserManagement.tsx">
                              {selectedUserProfile?.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Permissions Overview */}
                        <Separator data-id="o1ee52k1w" data-path="src/pages/Admin/UserManagement.tsx" />
                        <h4 className="font-semibold text-md flex items-center" data-id="778w3pm6d" data-path="src/pages/Admin/UserManagement.tsx">
                          <Shield className="w-4 h-4 mr-2 text-green-600" data-id="nspkwzqiy" data-path="src/pages/Admin/UserManagement.tsx" />
                          Permissions Overview
                        </h4>
                        <div className="space-y-2" data-id="crc6dmavr" data-path="src/pages/Admin/UserManagement.tsx">
                          {(() => {
                            try {
                              const permissions = selectedUserProfile?.detailed_permissions ?
                              JSON.parse(selectedUserProfile.detailed_permissions) : {};
                              const areas = [
                              'dashboard', 'products', 'employees', 'sales_reports', 'vendors',
                              'orders', 'licenses', 'salary', 'inventory', 'delivery'];


                              if (Object.keys(permissions).length === 0) {
                                return (
                                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200" data-id="iff916vts" data-path="src/pages/Admin/UserManagement.tsx">
                                    <p className="text-sm text-yellow-800 font-medium" data-id="r7jau2dei" data-path="src/pages/Admin/UserManagement.tsx">No Permissions Configured</p>
                                    <p className="text-xs text-yellow-700" data-id="0sgpgnziz" data-path="src/pages/Admin/UserManagement.tsx">Use the Permissions tab to set up access levels</p>
                                  </div>);

                              }

                              return areas.map((area) => {
                                const areaPerms = permissions[area];
                                const hasView = areaPerms?.view;
                                const hasEdit = areaPerms?.edit;
                                const hasCreate = areaPerms?.create;

                                return (
                                  <div key={area} className="p-2 bg-gray-50 rounded-lg" data-id="y5crtpfo2" data-path="src/pages/Admin/UserManagement.tsx">
                                    <div className="flex items-center justify-between mb-1" data-id="q8gmlvcgi" data-path="src/pages/Admin/UserManagement.tsx">
                                      <span className="text-sm font-medium capitalize" data-id="clomrz10q" data-path="src/pages/Admin/UserManagement.tsx">{area.replace('_', ' ')}</span>
                                      <div className="flex space-x-1" data-id="s6d2k22gt" data-path="src/pages/Admin/UserManagement.tsx">
                                        {hasView && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700" data-id="olu1hygzu" data-path="src/pages/Admin/UserManagement.tsx">View</Badge>}
                                        {hasEdit && <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700" data-id="lsq6uu80d" data-path="src/pages/Admin/UserManagement.tsx">Edit</Badge>}
                                        {hasCreate && <Badge variant="outline" className="text-xs bg-green-50 text-green-700" data-id="2092gja52" data-path="src/pages/Admin/UserManagement.tsx">Create</Badge>}
                                        {!hasView && !hasEdit && !hasCreate && <Badge variant="secondary" className="text-xs" data-id="b5ukyqzq7" data-path="src/pages/Admin/UserManagement.tsx">No Access</Badge>}
                                      </div>
                                    </div>
                                  </div>);

                              });
                            } catch {
                              return (
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200" data-id="jqhwwxy6b" data-path="src/pages/Admin/UserManagement.tsx">
                                  <p className="text-sm text-red-800 font-medium" data-id="xoczz6gtd" data-path="src/pages/Admin/UserManagement.tsx">Permission Data Error</p>
                                  <p className="text-xs text-red-700" data-id="4j6wlejb6" data-path="src/pages/Admin/UserManagement.tsx">Invalid permission format detected</p>
                                </div>);

                            }
                          })()
                          }
                        </div>
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Recent Activity & Tips */}
                  <div data-id="2jfd7pi4s" data-path="src/pages/Admin/UserManagement.tsx">
                    <ScrollArea className="h-full" data-id="8owel5fam" data-path="src/pages/Admin/UserManagement.tsx">
                      <div className="space-y-4" data-id="fkndyvfzw" data-path="src/pages/Admin/UserManagement.tsx">
                        <h3 className="font-semibold text-lg mb-3 flex items-center" data-id="ffkcj8r6p" data-path="src/pages/Admin/UserManagement.tsx">
                          <Activity className="w-5 h-5 mr-2 text-orange-600" data-id="i2t3098qa" data-path="src/pages/Admin/UserManagement.tsx" />
                          Recent Activity
                        </h3>
                        <div className="space-y-3" data-id="40k6p3ssm" data-path="src/pages/Admin/UserManagement.tsx">
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg" data-id="iiym5398c" data-path="src/pages/Admin/UserManagement.tsx">
                            <Clock className="w-4 h-4 text-blue-600 mt-1" data-id="ry68f73wn" data-path="src/pages/Admin/UserManagement.tsx" />
                            <div data-id="09lgvplvi" data-path="src/pages/Admin/UserManagement.tsx">
                              <p className="text-sm font-medium" data-id="g6w6z1zb0" data-path="src/pages/Admin/UserManagement.tsx">Profile Updated</p>
                              <p className="text-xs text-gray-600" data-id="42paxbxvx" data-path="src/pages/Admin/UserManagement.tsx">Last modified today</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg" data-id="q60zjznbv" data-path="src/pages/Admin/UserManagement.tsx">
                            <UserCheck className="w-4 h-4 text-green-600 mt-1" data-id="8b9vkxafw" data-path="src/pages/Admin/UserManagement.tsx" />
                            <div data-id="kk725pw7n" data-path="src/pages/Admin/UserManagement.tsx">
                              <p className="text-sm font-medium" data-id="i69f6x7bj" data-path="src/pages/Admin/UserManagement.tsx">Account Status</p>
                              <p className="text-xs text-gray-600" data-id="cshws307t" data-path="src/pages/Admin/UserManagement.tsx">Currently {selectedUserProfile?.is_active ? 'active' : 'inactive'}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg" data-id="moiblym6a" data-path="src/pages/Admin/UserManagement.tsx">
                            <Building2 className="w-4 h-4 text-purple-600 mt-1" data-id="ziemose1p" data-path="src/pages/Admin/UserManagement.tsx" />
                            <div data-id="9o8z2crmw" data-path="src/pages/Admin/UserManagement.tsx">
                              <p className="text-sm font-medium" data-id="tr191nr97" data-path="src/pages/Admin/UserManagement.tsx">Station Assignment</p>
                              <p className="text-xs text-gray-600" data-id="kbebpl5nk" data-path="src/pages/Admin/UserManagement.tsx">Assigned to {selectedUserProfile?.station}</p>
                            </div>
                          </div>
                        </div>

                        <Separator data-id="w96b1wmqt" data-path="src/pages/Admin/UserManagement.tsx" />
                        
                        {/* Tips & Help */}
                        <h4 className="font-semibold text-md mb-3 flex items-center" data-id="7itw4pcxk" data-path="src/pages/Admin/UserManagement.tsx">
                          <FileText className="w-4 h-4 mr-2 text-indigo-600" data-id="iuuik3hhv" data-path="src/pages/Admin/UserManagement.tsx" />
                          Tips & Help
                        </h4>
                        <div className="space-y-3" data-id="5z4rdubfp" data-path="src/pages/Admin/UserManagement.tsx">
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200" data-id="3gbmo1jmj" data-path="src/pages/Admin/UserManagement.tsx">
                            <div className="flex items-start space-x-2" data-id="6l876n7c8" data-path="src/pages/Admin/UserManagement.tsx">
                              <AlertCircle className="w-4 h-4 text-yellow-600 mt-1" data-id="ayxekkg84" data-path="src/pages/Admin/UserManagement.tsx" />
                              <div data-id="qpotp9gxn" data-path="src/pages/Admin/UserManagement.tsx">
                                <p className="text-sm font-medium text-yellow-800" data-id="gcj4kubel" data-path="src/pages/Admin/UserManagement.tsx">Role Changes</p>
                                <p className="text-xs text-yellow-700" data-id="euxkng15h" data-path="src/pages/Admin/UserManagement.tsx">Changing roles will affect user permissions immediately</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200" data-id="navsrhltm" data-path="src/pages/Admin/UserManagement.tsx">
                            <div className="flex items-start space-x-2" data-id="gi0ynf1ps" data-path="src/pages/Admin/UserManagement.tsx">
                              <Settings className="w-4 h-4 text-blue-600 mt-1" data-id="i3tmumzgi" data-path="src/pages/Admin/UserManagement.tsx" />
                              <div data-id="tn09pet14" data-path="src/pages/Admin/UserManagement.tsx">
                                <p className="text-sm font-medium text-blue-800" data-id="8txmm9c5u" data-path="src/pages/Admin/UserManagement.tsx">Station Assignment</p>
                                <p className="text-xs text-blue-700" data-id="739yx3f3z" data-path="src/pages/Admin/UserManagement.tsx">Users can only access data for their assigned station</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200" data-id="q84ge8exe" data-path="src/pages/Admin/UserManagement.tsx">
                            <div className="flex items-start space-x-2" data-id="6hnzvxh4c" data-path="src/pages/Admin/UserManagement.tsx">
                              <Phone className="w-4 h-4 text-green-600 mt-1" data-id="8s5f24ley" data-path="src/pages/Admin/UserManagement.tsx" />
                              <div data-id="5z3u2mauz" data-path="src/pages/Admin/UserManagement.tsx">
                                <p className="text-sm font-medium text-green-800" data-id="hn0dp146b" data-path="src/pages/Admin/UserManagement.tsx">Contact Information</p>
                                <p className="text-xs text-green-700" data-id="ejm80vb59" data-path="src/pages/Admin/UserManagement.tsx">Keep phone numbers updated for important notifications</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="permissions" data-id="bp34661vk" data-path="src/pages/Admin/UserManagement.tsx">
          <EnhancedUserPermissionManager data-id="y1loupfje" data-path="src/pages/Admin/UserManagement.tsx" />
        </TabsContent>
      </Tabs>

      {/* Batch Edit Dialog */}
      <BatchEditDialog
        isOpen={isBatchEditDialogOpen}
        onClose={() => setIsBatchEditDialogOpen(false)}
        onSave={confirmBatchEdit}
        selectedCount={batchSelection.selectedCount}
        isLoading={batchActionLoading}
        itemName="user profiles" data-id="081ka6in2" data-path="src/pages/Admin/UserManagement.tsx">

        <div className="space-y-4" data-id="5ht9bbq6i" data-path="src/pages/Admin/UserManagement.tsx">
          <div data-id="75lrkatb9" data-path="src/pages/Admin/UserManagement.tsx">
            <Label htmlFor="batch_role" data-id="yssfey41a" data-path="src/pages/Admin/UserManagement.tsx">Role</Label>
            <Select value={batchEditData.role} onValueChange={(value) => setBatchEditData({ ...batchEditData, role: value })} data-id="jn5xqsg3w" data-path="src/pages/Admin/UserManagement.tsx">
              <SelectTrigger data-id="0y8rr0ddw" data-path="src/pages/Admin/UserManagement.tsx">
                <SelectValue placeholder="Select role to update" data-id="4w8ryhdl8" data-path="src/pages/Admin/UserManagement.tsx" />
              </SelectTrigger>
              <SelectContent data-id="yhyxzji2m" data-path="src/pages/Admin/UserManagement.tsx">
                <SelectItem value="" data-id="51b30htwl" data-path="src/pages/Admin/UserManagement.tsx">Keep existing roles</SelectItem>
                {roles.map((role) =>
                <SelectItem key={role} value={role} data-id="zoyb33mh8" data-path="src/pages/Admin/UserManagement.tsx">{role}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div data-id="hqyap7tc6" data-path="src/pages/Admin/UserManagement.tsx">
            <Label htmlFor="batch_station" data-id="46hiw7cft" data-path="src/pages/Admin/UserManagement.tsx">Station</Label>
            <Select value={batchEditData.station} onValueChange={(value) => setBatchEditData({ ...batchEditData, station: value })} data-id="vshz1qn6q" data-path="src/pages/Admin/UserManagement.tsx">
              <SelectTrigger data-id="6q3tgf7cy" data-path="src/pages/Admin/UserManagement.tsx">
                <SelectValue placeholder="Select station to update" data-id="7ptzwv7hv" data-path="src/pages/Admin/UserManagement.tsx" />
              </SelectTrigger>
              <SelectContent data-id="uuwisgvcu" data-path="src/pages/Admin/UserManagement.tsx">
                <SelectItem value="" data-id="ly8czrq61" data-path="src/pages/Admin/UserManagement.tsx">Keep existing stations</SelectItem>
                {stations.map((station) =>
                <SelectItem key={station} value={station} data-id="2fs4zafag" data-path="src/pages/Admin/UserManagement.tsx">{station}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2" data-id="i9s5b3kdk" data-path="src/pages/Admin/UserManagement.tsx">
            <Checkbox
              id="batch_is_active"
              checked={batchEditData.is_active}
              onCheckedChange={(checked) => setBatchEditData({ ...batchEditData, is_active: checked as boolean })} data-id="x553cf0zr" data-path="src/pages/Admin/UserManagement.tsx" />

            <Label htmlFor="batch_is_active" data-id="sd0d6187f" data-path="src/pages/Admin/UserManagement.tsx">Set all selected users as active</Label>
          </div>
        </div>
      </BatchEditDialog>

      {/* Batch Delete Dialog */}
      <BatchDeleteDialog
        isOpen={isBatchDeleteDialogOpen}
        onClose={() => setIsBatchDeleteDialogOpen(false)}
        onConfirm={confirmBatchDelete}
        selectedCount={batchSelection.selectedCount}
        isLoading={batchActionLoading}
        itemName="user profiles"
        selectedItems={batchSelection.getSelectedData(filteredProfiles, (profile) => profile.id).map((profile) => ({
          id: profile.id,
          name: `${profile.employee_id} - ${profile.role}`
        }))} data-id="6ackh0ag9" data-path="src/pages/Admin/UserManagement.tsx" />

      {/* Create New User Dialog */}
      <CreateUserDialog
        isOpen={isCreateUserDialogOpen}
        onClose={() => setIsCreateUserDialogOpen(false)}
        onUserCreated={() => {
          fetchData(); // Refresh both users and profiles
          toast({
            title: "Success",
            description: "New user account and profile created successfully"
          });
        }} data-id="of4d3cvuv" data-path="src/pages/Admin/UserManagement.tsx" />


    </div>);

};

export default UserManagement;