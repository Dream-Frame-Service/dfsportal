import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, TestTube, Settings, Layout, Info } from 'lucide-react';
import { useSmartAuth } from '@/hooks/use-smart-auth';
import { useEnhancedRoleAccess } from '@/hooks/use-enhanced-role-access';
import RoleTestingDashboard from '@/components/RoleTesting/RoleTestingDashboard';
import RoleDashboardCustomizer from '@/components/RoleTesting/RoleDashboardCustomizer';
import RoleBasedDashboard from '@/components/RoleTesting/RoleBasedDashboard';
import UserRoleSwitcher from '@/components/RoleTesting/UserRoleSwitcher';
import { AccessDenied } from '@/components/AccessDenied';

const RoleTestingPage: React.FC = () => {
  const authContext = useSmartAuth();
  const { userProfile } = authContext || {};
  const roleAccess = useEnhancedRoleAccess();

  // Show access denied for non-administrators trying to access testing tools
  if (!roleAccess.canAccessAdminArea) {
    return (
      <div className="space-y-6" data-id="almjwbr32" data-path="src/pages/Admin/RoleTestingPage.tsx">
        <RoleBasedDashboard data-id="6s0gztuxp" data-path="src/pages/Admin/RoleTestingPage.tsx" />
        <Alert data-id="x6ulnx5jn" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <Shield className="h-4 w-4" data-id="bx7nhz0do" data-path="src/pages/Admin/RoleTestingPage.tsx" />
          <AlertDescription data-id="1lq4pwzjm" data-path="src/pages/Admin/RoleTestingPage.tsx">
            Role testing and customization tools are available to administrators only. 
            Above is your role-based dashboard view.
          </AlertDescription>
        </Alert>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="so0p1q4ft" data-path="src/pages/Admin/RoleTestingPage.tsx">
      <Card data-id="qmpp9zxsl" data-path="src/pages/Admin/RoleTestingPage.tsx">
        <CardHeader data-id="ba1ir4oeq" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <CardTitle className="flex items-center gap-2" data-id="ob28cr17p" data-path="src/pages/Admin/RoleTestingPage.tsx">
            <TestTube className="h-5 w-5" data-id="0nt3lfkgj" data-path="src/pages/Admin/RoleTestingPage.tsx" />
            Role Testing & Customization Center
          </CardTitle>
        </CardHeader>
        <CardContent data-id="siitkoqki" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="k7k0jglw5" data-path="src/pages/Admin/RoleTestingPage.tsx">
            <div className="flex items-center gap-2" data-id="j3ape6v6u" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <span className="text-sm font-medium" data-id="75ktyequc" data-path="src/pages/Admin/RoleTestingPage.tsx">Current Role:</span>
              <Badge className={`${
              roleAccess.userRole === 'Administrator' ? 'bg-red-500' :
              roleAccess.userRole === 'Management' ? 'bg-blue-500' : 'bg-green-500'}`
              } data-id="ruujzdbpz" data-path="src/pages/Admin/RoleTestingPage.tsx">
                {roleAccess.userRole}
              </Badge>
            </div>
            <div className="flex items-center gap-2" data-id="kw2jec2oc" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <span className="text-sm font-medium" data-id="tcmp0aurw" data-path="src/pages/Admin/RoleTestingPage.tsx">Station Access:</span>
              <Badge variant="outline" data-id="af8p41m0d" data-path="src/pages/Admin/RoleTestingPage.tsx">{roleAccess.stationAccess}</Badge>
            </div>
            <div className="flex items-center gap-2" data-id="bufyazuai" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <span className="text-sm font-medium" data-id="ngkma3hn6" data-path="src/pages/Admin/RoleTestingPage.tsx">Testing Access:</span>
              <Badge variant={roleAccess.canAccessAdminArea ? 'default' : 'destructive'} data-id="b17251nlr" data-path="src/pages/Admin/RoleTestingPage.tsx">
                {roleAccess.canAccessAdminArea ? 'Full Access' : 'Restricted'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-4" data-id="utdpnjcag" data-path="src/pages/Admin/RoleTestingPage.tsx">
        <TabsList className="grid w-full grid-cols-5" data-id="d855jtxa6" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <TabsTrigger value="dashboard" data-id="yaxsu68pz" data-path="src/pages/Admin/RoleTestingPage.tsx">Dashboard Preview</TabsTrigger>
          <TabsTrigger value="testing" data-id="v03txldqz" data-path="src/pages/Admin/RoleTestingPage.tsx">Role Testing</TabsTrigger>
          <TabsTrigger value="customizer" data-id="hu5nx8h07" data-path="src/pages/Admin/RoleTestingPage.tsx">Dashboard Customizer</TabsTrigger>
          <TabsTrigger value="users" data-id="tj3cudefd" data-path="src/pages/Admin/RoleTestingPage.tsx">User Management</TabsTrigger>
          <TabsTrigger value="info" data-id="6aj3mn66j" data-path="src/pages/Admin/RoleTestingPage.tsx">Testing Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4" data-id="a9q4s2i6e" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <Card data-id="o1hj2h3nu" data-path="src/pages/Admin/RoleTestingPage.tsx">
            <CardHeader data-id="1xpywe60k" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <CardTitle className="flex items-center gap-2" data-id="13j7wvzxu" data-path="src/pages/Admin/RoleTestingPage.tsx">
                <Layout className="h-5 w-5" data-id="ixfcrqbm5" data-path="src/pages/Admin/RoleTestingPage.tsx" />
                Role-Based Dashboard Preview
              </CardTitle>
            </CardHeader>
            <CardContent data-id="ep6pb4obe" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <Alert className="mb-4" data-id="c4vhxpqxn" data-path="src/pages/Admin/RoleTestingPage.tsx">
                <Info className="h-4 w-4" data-id="imwa7puwo" data-path="src/pages/Admin/RoleTestingPage.tsx" />
                <AlertDescription data-id="9lolt9mfw" data-path="src/pages/Admin/RoleTestingPage.tsx">
                  This shows how the dashboard appears for your current role: <strong data-id="ofaeyu1uj" data-path="src/pages/Admin/RoleTestingPage.tsx">{roleAccess.userRole}</strong>
                </AlertDescription>
              </Alert>
              <RoleBasedDashboard data-id="41g0axg5y" data-path="src/pages/Admin/RoleTestingPage.tsx" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4" data-id="e9lao3cjl" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <RoleTestingDashboard data-id="eh1huftvz" data-path="src/pages/Admin/RoleTestingPage.tsx" />
        </TabsContent>

        <TabsContent value="customizer" className="space-y-4" data-id="9xa5wj5sc" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <RoleDashboardCustomizer data-id="9yuem345i" data-path="src/pages/Admin/RoleTestingPage.tsx" />
        </TabsContent>

        <TabsContent value="users" className="space-y-4" data-id="kjktz6wdu" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <UserRoleSwitcher data-id="gbrnvt1zh" data-path="src/pages/Admin/RoleTestingPage.tsx" />
        </TabsContent>

        <TabsContent value="info" className="space-y-4" data-id="8akmlseu4" data-path="src/pages/Admin/RoleTestingPage.tsx">
          <Card data-id="437s97gm6" data-path="src/pages/Admin/RoleTestingPage.tsx">
            <CardHeader data-id="rpr8mk0la" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <CardTitle data-id="e4vrsmsxp" data-path="src/pages/Admin/RoleTestingPage.tsx">Role Testing Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="emnekrpw2" data-path="src/pages/Admin/RoleTestingPage.tsx">
              <div className="space-y-4" data-id="x2gx4hprd" data-path="src/pages/Admin/RoleTestingPage.tsx">
                <div data-id="ygxnsvumx" data-path="src/pages/Admin/RoleTestingPage.tsx">
                  <h3 className="font-semibold text-lg mb-2" data-id="riejvi4w4" data-path="src/pages/Admin/RoleTestingPage.tsx">Testing Different Roles</h3>
                  <div className="space-y-2 text-sm" data-id="s75oa77u8" data-path="src/pages/Admin/RoleTestingPage.tsx">
                    <p data-id="3mtqui2pj" data-path="src/pages/Admin/RoleTestingPage.tsx"><strong data-id="b1htydslc" data-path="src/pages/Admin/RoleTestingPage.tsx">Administrator Role:</strong> Has full access to all features including user management, monitoring, and system configuration.</p>
                    <p data-id="vfg0kko80" data-path="src/pages/Admin/RoleTestingPage.tsx"><strong data-id="1o36cpmf1" data-path="src/pages/Admin/RoleTestingPage.tsx">Management Role:</strong> Can access most operational features but cannot manage users or access monitoring tools.</p>
                    <p data-id="kjkxbljvj" data-path="src/pages/Admin/RoleTestingPage.tsx"><strong data-id="p0ktfk59v" data-path="src/pages/Admin/RoleTestingPage.tsx">Employee Role:</strong> Limited to basic operations like sales entry and product viewing. Cannot access sensitive areas.</p>
                  </div>
                </div>

                <div data-id="yuuz13wek" data-path="src/pages/Admin/RoleTestingPage.tsx">
                  <h3 className="font-semibold text-lg mb-2" data-id="l9a4zwep5" data-path="src/pages/Admin/RoleTestingPage.tsx">How to Test Roles</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm" data-id="yz1eox2yk" data-path="src/pages/Admin/RoleTestingPage.tsx">
                    <li data-id="pka8djid6" data-path="src/pages/Admin/RoleTestingPage.tsx">Use the "Role Testing" tab to run automated tests for your current role</li>
                    <li data-id="fn6wnrru9" data-path="src/pages/Admin/RoleTestingPage.tsx">Create additional user accounts with different roles for comprehensive testing</li>
                    <li data-id="7gxcvv2qu" data-path="src/pages/Admin/RoleTestingPage.tsx">Use the "Dashboard Customizer" to preview how different roles see the interface</li>
                    <li data-id="jpw41be08" data-path="src/pages/Admin/RoleTestingPage.tsx">Check the permission matrix to understand what each role can access</li>
                  </ol>
                </div>

                <div data-id="e0ij8fsz1" data-path="src/pages/Admin/RoleTestingPage.tsx">
                  <h3 className="font-semibold text-lg mb-2" data-id="485rt0ef7" data-path="src/pages/Admin/RoleTestingPage.tsx">Expected Behaviors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="3li46d5ls" data-path="src/pages/Admin/RoleTestingPage.tsx">
                    <Card className="border-red-200" data-id="05j4ouwv1" data-path="src/pages/Admin/RoleTestingPage.tsx">
                      <CardHeader className="pb-2" data-id="zryu8md0b" data-path="src/pages/Admin/RoleTestingPage.tsx">
                        <Badge className="bg-red-500 w-fit" data-id="88nylkgqu" data-path="src/pages/Admin/RoleTestingPage.tsx">Administrator</Badge>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1" data-id="l3bq6vzvs" data-path="src/pages/Admin/RoleTestingPage.tsx">
                        <p data-id="mvusgoox2" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can access all admin pages</p>
                        <p data-id="nh99umqlq" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can manage other users</p>
                        <p data-id="8ygglaxvz" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can access monitoring tools</p>
                        <p data-id="2enqs1wpo" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can customize dashboards</p>
                        <p data-id="fg5q7fbb6" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can export/import data</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200" data-id="lcblnu1wc" data-path="src/pages/Admin/RoleTestingPage.tsx">
                      <CardHeader className="pb-2" data-id="r3dvsm06b" data-path="src/pages/Admin/RoleTestingPage.tsx">
                        <Badge className="bg-blue-500 w-fit" data-id="j23iuo5c5" data-path="src/pages/Admin/RoleTestingPage.tsx">Management</Badge>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1" data-id="qey6mldrm" data-path="src/pages/Admin/RoleTestingPage.tsx">
                        <p data-id="j8fow6yri" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can view reports and analytics</p>
                        <p data-id="urt8i3yhd" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can manage operations</p>
                        <p data-id="1ctimsijt" data-path="src/pages/Admin/RoleTestingPage.tsx">✗ Cannot access admin settings</p>
                        <p data-id="hp5w3ha3t" data-path="src/pages/Admin/RoleTestingPage.tsx">✗ Cannot manage other users</p>
                        <p data-id="m7hrtpcki" data-path="src/pages/Admin/RoleTestingPage.tsx">✗ Limited delete permissions</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200" data-id="5330669ur" data-path="src/pages/Admin/RoleTestingPage.tsx">
                      <CardHeader className="pb-2" data-id="0vyeuz7hf" data-path="src/pages/Admin/RoleTestingPage.tsx">
                        <Badge className="bg-green-500 w-fit" data-id="5h72ng2op" data-path="src/pages/Admin/RoleTestingPage.tsx">Employee</Badge>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1" data-id="iay5qbqzq" data-path="src/pages/Admin/RoleTestingPage.tsx">
                        <p data-id="cc7s4335n" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can enter sales data</p>
                        <p data-id="7xpf0dn8q" data-path="src/pages/Admin/RoleTestingPage.tsx">✓ Can view basic inventory</p>
                        <p data-id="ki6074iqy" data-path="src/pages/Admin/RoleTestingPage.tsx">✗ Cannot access financial data</p>
                        <p data-id="swipu36c2" data-path="src/pages/Admin/RoleTestingPage.tsx">✗ Cannot manage other employees</p>
                        <p data-id="scstumf74" data-path="src/pages/Admin/RoleTestingPage.tsx">✗ Cannot access admin areas</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div data-id="g2v7fshqw" data-path="src/pages/Admin/RoleTestingPage.tsx">
                  <h3 className="font-semibold text-lg mb-2" data-id="q7bi2tddd" data-path="src/pages/Admin/RoleTestingPage.tsx">Troubleshooting</h3>
                  <div className="space-y-2 text-sm" data-id="txysilorr" data-path="src/pages/Admin/RoleTestingPage.tsx">
                    <p data-id="xgtpfgxjz" data-path="src/pages/Admin/RoleTestingPage.tsx"><strong data-id="mslalpiqj" data-path="src/pages/Admin/RoleTestingPage.tsx">If tests fail:</strong> Check that the user profile has the correct role assigned and that permissions are properly configured.</p>
                    <p data-id="bhhm41m1h" data-path="src/pages/Admin/RoleTestingPage.tsx"><strong data-id="bm5u1o921" data-path="src/pages/Admin/RoleTestingPage.tsx">If access is denied unexpectedly:</strong> Verify the user's station assignment and ensure the feature is enabled for their role.</p>
                    <p data-id="0jscq3ake" data-path="src/pages/Admin/RoleTestingPage.tsx"><strong data-id="yzwekbeo0" data-path="src/pages/Admin/RoleTestingPage.tsx">For custom permissions:</strong> Check the detailed_permissions field in the user profile for specific overrides.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default RoleTestingPage;
