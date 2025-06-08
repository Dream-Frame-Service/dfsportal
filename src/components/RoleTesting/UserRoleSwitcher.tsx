import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users, Shield, User, Plus, Edit, Trash2,
  CheckCircle, XCircle, AlertTriangle, RefreshCw } from
'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedRoleAccess } from '@/hooks/use-enhanced-role-access';
import { toast } from '@/hooks/use-toast';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Management' | 'Employee';
  station: string;
  isActive: boolean;
  employeeId: string;
}

const DEMO_USERS: DemoUser[] = [
{
  id: '1',
  name: 'Admin User',
  email: 'admin@dfsmanager.com',
  role: 'Administrator',
  station: 'ALL',
  isActive: true,
  employeeId: 'EMP001'
},
{
  id: '2',
  name: 'Manager Smith',
  email: 'manager@dfsmanager.com',
  role: 'Management',
  station: 'MOBIL',
  isActive: true,
  employeeId: 'EMP002'
},
{
  id: '3',
  name: 'Employee Jones',
  email: 'employee@dfsmanager.com',
  role: 'Employee',
  station: 'AMOCO ROSEDALE',
  isActive: true,
  employeeId: 'EMP003'
},
{
  id: '4',
  name: 'Manager Davis',
  email: 'manager2@dfsmanager.com',
  role: 'Management',
  station: 'AMOCO BROOKLYN',
  isActive: true,
  employeeId: 'EMP004'
},
{
  id: '5',
  name: 'Employee Wilson',
  email: 'employee2@dfsmanager.com',
  role: 'Employee',
  station: 'MOBIL',
  isActive: false,
  employeeId: 'EMP005'
}];


const UserRoleSwitcher: React.FC = () => {
  const { userProfile } = useAuth();
  const roleAccess = useEnhancedRoleAccess();
  const [users, setUsers] = useState<DemoUser[]>(DEMO_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<DemoUser>>({
    name: '',
    email: '',
    role: 'Employee',
    station: 'MOBIL',
    isActive: true,
    employeeId: ''
  });

  const handleUserRoleUpdate = async (userId: string, newRole: 'Administrator' | 'Management' | 'Employee') => {
    if (!roleAccess.canAccessAdminArea) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can modify user roles.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // In a real application, this would call the API
      // For demo purposes, we'll simulate the API call
      setUsers((prev) => prev.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Role Updated',
        description: `User role has been changed to ${newRole}.`
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUserStatusToggle = async (userId: string) => {
    if (!roleAccess.canAccessAdminArea) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can modify user status.',
        variant: 'destructive'
      });
      return;
    }

    setUsers((prev) => prev.map((user) =>
    user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));

    const user = users.find((u) => u.id === userId);
    toast({
      title: 'Status Updated',
      description: `User has been ${user?.isActive ? 'deactivated' : 'activated'}.`
    });
  };

  const handleCreateUser = async () => {
    if (!roleAccess.canAccessAdminArea) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can create users.',
        variant: 'destructive'
      });
      return;
    }

    if (!newUser.name || !newUser.email || !newUser.employeeId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const user: DemoUser = {
      id: (users.length + 1).toString(),
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role || 'Employee',
      station: newUser.station || 'MOBIL',
      isActive: newUser.isActive !== false,
      employeeId: newUser.employeeId!
    };

    setUsers((prev) => [...prev, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'Employee',
      station: 'MOBIL',
      isActive: true,
      employeeId: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: 'User Created',
      description: `New ${user.role.toLowerCase()} user has been created.`
    });
  };

  const simulateRoleSwitch = (targetUserId: string) => {
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    toast({
      title: 'Demo Role Switch',
      description: `Simulating login as ${targetUser.name} (${targetUser.role}). In a real system, you would need to log in with different credentials.`,
      variant: 'default'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'bg-red-500';
      case 'Management':
        return 'bg-blue-500';
      case 'Employee':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      if (user.isActive) {
        acc[user.role] = (acc[user.role] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      Administrator: stats.Administrator || 0,
      Management: stats.Management || 0,
      Employee: stats.Employee || 0,
      Total: Object.values(stats).reduce((sum, count) => sum + count, 0)
    };
  };

  const stats = getRoleStats();

  return (
    <div className="space-y-6" data-id="aiowzwit7" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
      <Card data-id="4eavsk7k9" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
        <CardHeader data-id="rullfzdcq" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
          <CardTitle className="flex items-center gap-2" data-id="ifmjb7sgo" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
            <Users className="h-5 w-5" data-id="lmzm8resm" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
            User Role Management & Testing
          </CardTitle>
        </CardHeader>
        <CardContent data-id="apuvoqm7g" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="r0p31a163" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
            <div className="text-center" data-id="ymzcfzsbe" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <div className="text-2xl font-bold text-red-600" data-id="f4bh4b0ck" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{stats.Administrator}</div>
              <div className="text-sm text-gray-600" data-id="avphj7jd9" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Administrators</div>
            </div>
            <div className="text-center" data-id="5o6r2t994" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="9y4zj1rxm" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{stats.Management}</div>
              <div className="text-sm text-gray-600" data-id="qd7dg2nrw" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Management</div>
            </div>
            <div className="text-center" data-id="dyn4nf84l" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="bk5alnybg" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{stats.Employee}</div>
              <div className="text-sm text-gray-600" data-id="dfw305fa7" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Employees</div>
            </div>
            <div className="text-center" data-id="093nihlxx" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <div className="text-2xl font-bold text-gray-600" data-id="tvzfi6lnw" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{stats.Total}</div>
              <div className="text-sm text-gray-600" data-id="plvaeeaxj" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Total Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-id="vaonurgqz" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
        <CardHeader className="flex flex-row items-center justify-between" data-id="4bqeqdize" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
          <CardTitle data-id="7qb3047z9" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Demo User Accounts</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} data-id="6ddc2xo81" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
            <DialogTrigger asChild data-id="r0tdrixi6" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <Button
                size="sm"
                className="flex items-center gap-2"
                disabled={!roleAccess.canAccessAdminArea} data-id="ml7y62n5j" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                <Plus className="h-4 w-4" data-id="2jfojkcue" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent data-id="z1xvh2li2" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <DialogHeader data-id="fn6iirbf3" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                <DialogTitle data-id="cf9cxm0t1" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4" data-id="ifa1vi042" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                <div data-id="nb31eusw7" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <Label htmlFor="name" data-id="cvlfcj0xp" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name || ''}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name" data-id="t37okvgkd" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />

                </div>
                <div data-id="j8ifor7l5" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <Label htmlFor="email" data-id="gdessqq4e" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email || ''}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address" data-id="rb8y3a7p3" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />

                </div>
                <div data-id="z1tsb719c" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <Label htmlFor="employeeId" data-id="rbv2j9trz" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={newUser.employeeId || ''}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="Enter employee ID" data-id="ycocuhtrt" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />

                </div>
                <div data-id="jzjvc061o" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <Label htmlFor="role" data-id="jbhde9uao" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: any) => setNewUser((prev) => ({ ...prev, role: value }))} data-id="dh6vvxmo4" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                    <SelectTrigger data-id="tkzyqr4s9" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                      <SelectValue data-id="5dpe2u2ou" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="oig2yujmp" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                      <SelectItem value="Employee" data-id="fjhzteqxr" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Employee</SelectItem>
                      <SelectItem value="Management" data-id="xstnaxb2b" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Management</SelectItem>
                      <SelectItem value="Administrator" data-id="qm83hq5gp" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div data-id="q6couu512" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <Label htmlFor="station" data-id="nsj8ygm7f" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Station</Label>
                  <Select
                    value={newUser.station}
                    onValueChange={(value) => setNewUser((prev) => ({ ...prev, station: value }))} data-id="9iibbfuiy" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                    <SelectTrigger data-id="6tws0w0t2" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                      <SelectValue data-id="v99odf8q2" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="lr8uzfb1b" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                      <SelectItem value="ALL" data-id="pzx3uv3rf" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">All Stations</SelectItem>
                      <SelectItem value="MOBIL" data-id="1ykplkgd9" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">MOBIL</SelectItem>
                      <SelectItem value="AMOCO ROSEDALE" data-id="ybkjpwxmt" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">AMOCO ROSEDALE</SelectItem>
                      <SelectItem value="AMOCO BROOKLYN" data-id="jl2jien6j" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">AMOCO BROOKLYN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2" data-id="rzyopnw5m" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <Button onClick={handleCreateUser} className="flex-1" data-id="d4852vb79" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                    Create User
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1" data-id="kqs0e76wp" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent data-id="fv42k6njk" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
          <Table data-id="v018zlsqu" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
            <TableHeader data-id="msgd3cr23" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              <TableRow data-id="fb1l0ejw0" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                <TableHead data-id="2701ow0xs" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Name</TableHead>
                <TableHead data-id="zvsuzh2rt" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Email</TableHead>
                <TableHead data-id="tjyxv2hug" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Role</TableHead>
                <TableHead data-id="q5qioish0" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Station</TableHead>
                <TableHead data-id="8vu7dvylm" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Status</TableHead>
                <TableHead data-id="k9tdeq418" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-id="7axugwsg2" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
              {users.map((user) =>
              <TableRow key={user.id} data-id="exd2u4qtv" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                  <TableCell className="font-medium" data-id="thzz9eaia" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{user.name}</TableCell>
                  <TableCell data-id="j90on8hl5" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{user.email}</TableCell>
                  <TableCell data-id="fx4uzysav" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                    <Badge className={getRoleColor(user.role)} data-id="egds6krny" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell data-id="woh7hobgw" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                    <Badge variant="outline" data-id="t4h48k3qr" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">{user.station}</Badge>
                  </TableCell>
                  <TableCell data-id="85mufqg1v" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                    {user.isActive ?
                  <Badge variant="default" className="bg-green-600" data-id="j774ubdmb" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                        <CheckCircle className="h-3 w-3 mr-1" data-id="kfyq0aq9j" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                        Active
                      </Badge> :

                  <Badge variant="destructive" data-id="sobnxw2nn" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                        <XCircle className="h-3 w-3 mr-1" data-id="uymuzyj9m" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                        Inactive
                      </Badge>
                  }
                  </TableCell>
                  <TableCell data-id="750oiqwx5" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                    <div className="flex items-center gap-2" data-id="ug12jges6" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                      <Select
                      value={user.role}
                      onValueChange={(newRole: any) => handleUserRoleUpdate(user.id, newRole)}
                      disabled={!roleAccess.canAccessAdminArea} data-id="nt3ri9acb" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                        <SelectTrigger className="w-32" data-id="1c8plztx8" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                          <SelectValue data-id="s11c7w6ic" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="it2850p7p" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
                          <SelectItem value="Employee" data-id="4bgvbp8um" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Employee</SelectItem>
                          <SelectItem value="Management" data-id="cw8bj3dfi" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Management</SelectItem>
                          <SelectItem value="Administrator" data-id="seau8iox9" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserStatusToggle(user.id)}
                      disabled={!roleAccess.canAccessAdminArea} data-id="gykfgtkht" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => simulateRoleSwitch(user.id)}
                      title="Simulate login as this user" data-id="5pxgqed6x" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">

                        <RefreshCw className="h-4 w-4" data-id="lqvsx5v9t" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Alert data-id="oc5miyq24" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
        <Shield className="h-4 w-4" data-id="0nkzb7ta5" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx" />
        <AlertDescription data-id="2hw4cbflc" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">
          <strong data-id="fsn5a3q0t" data-path="src/components/RoleTesting/UserRoleSwitcher.tsx">Testing Note:</strong> This is a demo interface for role testing. In a production environment, 
          users would need to log in with their respective credentials to test different access levels. 
          The "Simulate Role Switch" button shows what access each role would have.
        </AlertDescription>
      </Alert>
    </div>);

};

export default UserRoleSwitcher;