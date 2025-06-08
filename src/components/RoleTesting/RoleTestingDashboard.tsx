import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, User, Users, Settings, Eye, Edit, Plus, Trash2, Download, Upload, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedRoleAccess } from '@/hooks/use-enhanced-role-access';
import { toast } from '@/hooks/use-toast';

interface RoleTestScenario {
  id: string;
  name: string;
  description: string;
  feature: string;
  action: string;
  expectedResult: 'allow' | 'deny';
  role: 'Administrator' | 'Management' | 'Employee';
}

const TEST_SCENARIOS: RoleTestScenario[] = [
{
  id: '1',
  name: 'Admin Dashboard Access',
  description: 'Administrator accessing admin dashboard',
  feature: 'admin',
  action: 'canView',
  expectedResult: 'allow',
  role: 'Administrator'
},
{
  id: '2',
  name: 'Employee Admin Restriction',
  description: 'Employee trying to access admin area',
  feature: 'admin',
  action: 'canView',
  expectedResult: 'deny',
  role: 'Employee'
},
{
  id: '3',
  name: 'Management User Management',
  description: 'Management trying to manage users',
  feature: 'employees',
  action: 'canManageUsers',
  expectedResult: 'deny',
  role: 'Management'
},
{
  id: '4',
  name: 'Employee Product Creation',
  description: 'Employee trying to create products',
  feature: 'products',
  action: 'canCreate',
  expectedResult: 'deny',
  role: 'Employee'
},
{
  id: '5',
  name: 'Management Sales Report',
  description: 'Management viewing sales reports',
  feature: 'sales',
  action: 'canViewReports',
  expectedResult: 'allow',
  role: 'Management'
},
{
  id: '6',
  name: 'Employee Salary Access',
  description: 'Employee trying to view salary information',
  feature: 'salary',
  action: 'canView',
  expectedResult: 'deny',
  role: 'Employee'
},
{
  id: '7',
  name: 'Admin Monitoring Access',
  description: 'Administrator accessing monitoring features',
  feature: 'monitoring',
  action: 'canAccessMonitoring',
  expectedResult: 'allow',
  role: 'Administrator'
},
{
  id: '8',
  name: 'Management Delete Restriction',
  description: 'Management trying to delete records',
  feature: 'products',
  action: 'canDelete',
  expectedResult: 'deny',
  role: 'Management'
}];


const RoleTestingDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const roleAccess = useEnhancedRoleAccess();
  const [selectedRole, setSelectedRole] = useState<'Administrator' | 'Management' | 'Employee'>('Employee');
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runRoleTest = (scenario: RoleTestScenario) => {
    const hasAccess = roleAccess.hasFeatureAccess(
      scenario.feature as any,
      scenario.action as any
    );

    const result = scenario.expectedResult === 'allow' && hasAccess ||
    scenario.expectedResult === 'deny' && !hasAccess ? 'pass' : 'fail';

    setTestResults((prev) => ({ ...prev, [scenario.id]: result }));

    toast({
      title: result === 'pass' ? 'Test Passed' : 'Test Failed',
      description: `${scenario.name}: ${result === 'pass' ? 'Behaving as expected' : 'Unexpected behavior'}`,
      variant: result === 'pass' ? 'default' : 'destructive'
    });

    return result;
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    for (const scenario of TEST_SCENARIOS) {
      if (scenario.role === roleAccess.userRole) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate test delay
        runRoleTest(scenario);
      }
    }

    setIsRunningTests(false);

    const passedTests = Object.values(testResults).filter((result) => result === 'pass').length;
    const totalTests = Object.keys(testResults).length;

    toast({
      title: 'Test Suite Complete',
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? 'default' : 'destructive'
    });
  };

  const getFeatureMatrix = () => {
    const features = ['dashboard', 'products', 'employees', 'sales', 'vendors', 'orders', 'licenses', 'salary', 'inventory', 'delivery', 'settings', 'admin', 'monitoring'];
    const actions = ['canView', 'canEdit', 'canCreate', 'canDelete', 'canExport', 'canManageUsers', 'canViewReports', 'canAccessMonitoring'];

    return features.map((feature) => ({
      feature,
      permissions: actions.reduce((acc, action) => {
        acc[action] = roleAccess.hasFeatureAccess(feature as any, action as any);
        return acc;
      }, {} as Record<string, boolean>)
    }));
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

  const getTestResultIcon = (result: 'pass' | 'fail' | 'pending') => {
    switch (result) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" data-id="bmu6blw8i" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" data-id="sm07mpyqk" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" data-id="x76dil7x2" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx" />;
    }
  };

  const currentRoleScenarios = TEST_SCENARIOS.filter((scenario) => scenario.role === roleAccess.userRole);

  return (
    <div className="space-y-6" data-id="irwyby7v7" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
      <Card data-id="sfj4ni055" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
        <CardHeader data-id="6azm9vukw" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          <CardTitle className="flex items-center gap-2" data-id="wyfpuvwxn" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
            <Shield className="h-5 w-5" data-id="apjvvq023" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx" />
            Role Testing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent data-id="hprt7ze8y" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="2ljrkk88o" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
            <div className="flex items-center gap-2" data-id="f8ekmdxhe" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <Label data-id="rtsmwdu6h" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Current Role:</Label>
              <Badge className={getRoleColor(roleAccess.userRole || 'Unknown')} data-id="ag8xjtk0y" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                {roleAccess.userRole || 'No Role'}
              </Badge>
            </div>
            <div className="flex items-center gap-2" data-id="f1sjqdu23" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <Label data-id="o7fq44c1h" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Station Access:</Label>
              <Badge variant="outline" data-id="4pmvqotdi" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{roleAccess.stationAccess}</Badge>
            </div>
            <div className="flex items-center gap-2" data-id="4o60qzks7" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <Label data-id="l8wesm9ni" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Admin Access:</Label>
              <Badge variant={roleAccess.canAccessAdminArea ? 'default' : 'destructive'} data-id="97iddd6ye" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                {roleAccess.canAccessAdminArea ? 'Granted' : 'Restricted'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="matrix" className="space-y-4" data-id="00cb9mpho" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="2dnqoa84b" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          <TabsTrigger value="matrix" data-id="lw3dorr6g" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Permission Matrix</TabsTrigger>
          <TabsTrigger value="tests" data-id="jb3qgd02q" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Automated Tests</TabsTrigger>
          <TabsTrigger value="scenarios" data-id="tuwbi3m9t" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Test Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4" data-id="ro1tqkshh" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          <Card data-id="6zbt76cpp" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
            <CardHeader data-id="61ap053n3" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <CardTitle data-id="ihckvn89e" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Feature Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent data-id="ov8g0cfr4" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <div className="overflow-x-auto" data-id="lqhxj59ro" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                <Table data-id="t8otix2u1" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                  <TableHeader data-id="ntl6raxah" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                    <TableRow data-id="kj1tvuta4" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                      <TableHead data-id="nj530jpq9" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Feature</TableHead>
                      <TableHead data-id="vctm0hft8" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">View</TableHead>
                      <TableHead data-id="t3t8k5s6q" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Edit</TableHead>
                      <TableHead data-id="r0lh18om3" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Create</TableHead>
                      <TableHead data-id="vcqph5oqr" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Delete</TableHead>
                      <TableHead data-id="y4z10byzc" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Export</TableHead>
                      <TableHead data-id="txrlzw2vo" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Manage Users</TableHead>
                      <TableHead data-id="bs481b6op" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">View Reports</TableHead>
                      <TableHead data-id="li85qf5r4" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Monitoring</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-id="a4wbvu5yf" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                    {getFeatureMatrix().map(({ feature, permissions }) =>
                    <TableRow key={feature} data-id="rhvvyjaqa" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                        <TableCell className="font-medium capitalize" data-id="i2i62jb2p" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{feature}</TableCell>
                        <TableCell data-id="mxf6bfywq" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canView ? 'default' : 'destructive'} data-id="n8cotpag0" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canView ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="a4pmrr88u" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canEdit ? 'default' : 'destructive'} data-id="9qo1po0tt" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canEdit ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="sjgm0x6cz" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canCreate ? 'default' : 'destructive'} data-id="yavsreg51" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canCreate ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="xt0wx1qfk" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canDelete ? 'default' : 'destructive'} data-id="9rntotl60" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canDelete ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="dgd3sii9c" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canExport ? 'default' : 'destructive'} data-id="58w8rhuzk" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canExport ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="9omtuumwl" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canManageUsers ? 'default' : 'destructive'} data-id="rymkcg2oi" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canManageUsers ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="t4k8z20bg" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canViewReports ? 'default' : 'destructive'} data-id="r0efxzlpj" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canViewReports ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell data-id="99amuk9um" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <Badge variant={permissions.canAccessMonitoring ? 'default' : 'destructive'} data-id="08s24t0ty" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            {permissions.canAccessMonitoring ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4" data-id="tss716o2v" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          <Card data-id="hbvm9tstn" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
            <CardHeader data-id="jp8rclezq" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <CardTitle className="flex items-center justify-between" data-id="tyc9v99km" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                Automated Role Tests
                <Button
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  className="flex items-center gap-2" data-id="v1g6wukda" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">

                  <BarChart3 className="h-4 w-4" data-id="mng7wd2nx" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx" />
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent data-id="qw78zzc0x" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <div className="space-y-3" data-id="60gouoobw" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                {currentRoleScenarios.map((scenario) =>
                <div key={scenario.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="me43xf51m" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                    <div className="flex-1" data-id="apcq9zpcz" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                      <div className="flex items-center gap-2" data-id="fdmtesqgv" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                        {getTestResultIcon(testResults[scenario.id] || 'pending')}
                        <span className="font-medium" data-id="6j0j50y66" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{scenario.name}</span>
                        <Badge variant="outline" className="text-xs" data-id="rl2pifbp8" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          {scenario.expectedResult === 'allow' ? 'Should Allow' : 'Should Deny'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1" data-id="rcl513jp6" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{scenario.description}</p>
                    </div>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runRoleTest(scenario)}
                    disabled={isRunningTests} data-id="df9d9j89w" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">

                      Test
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4" data-id="loac68v5g" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          <Card data-id="at4vin0l2" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
            <CardHeader data-id="g2zuv36m6" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <CardTitle data-id="j8hrs2ydt" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">Test Scenarios by Role</CardTitle>
            </CardHeader>
            <CardContent data-id="b1a0gch9j" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
              <div className="space-y-4" data-id="sohsmx2be" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                {['Administrator', 'Management', 'Employee'].map((role) =>
                <div key={role} className="border rounded-lg p-4" data-id="9zvlzuvvg" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                    <div className="flex items-center gap-2 mb-3" data-id="8s3wlr55f" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                      <Badge className={getRoleColor(role)} data-id="kue99dscx" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{role}</Badge>
                      <span className="text-sm text-gray-600" data-id="06atqs3zw" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                        ({TEST_SCENARIOS.filter((s) => s.role === role).length} scenarios)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-id="0707r8sex" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                      {TEST_SCENARIOS.filter((s) => s.role === role).map((scenario) =>
                    <div key={scenario.id} className="text-sm p-2 bg-gray-50 rounded" data-id="m6uy5kysv" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                          <div className="font-medium" data-id="hi1pq8qp6" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{scenario.name}</div>
                          <div className="text-gray-600" data-id="q0zsasxgt" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{scenario.description}</div>
                          <div className="flex items-center gap-2 mt-1" data-id="c4p9gcqz0" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                            <Badge variant="outline" className="text-xs" data-id="8korzeyu6" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                              {scenario.feature}
                            </Badge>
                            <Badge variant={scenario.expectedResult === 'allow' ? 'default' : 'destructive'} className="text-xs" data-id="1unxq62nr" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
                              {scenario.expectedResult}
                            </Badge>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert data-id="chqp2ydem" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
        <Shield className="h-4 w-4" data-id="g7ay9gcyc" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx" />
        <AlertDescription data-id="euhsc4wnq" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">
          This testing dashboard verifies that role-based access controls are working correctly. 
          Test results are based on your current role: <strong data-id="7anskkapf" data-path="src/components/RoleTesting/RoleTestingDashboard.tsx">{roleAccess.userRole}</strong>. 
          To test different roles, ask an administrator to temporarily change your role or use different user accounts.
        </AlertDescription>
      </Alert>
    </div>);

};

export default RoleTestingDashboard;