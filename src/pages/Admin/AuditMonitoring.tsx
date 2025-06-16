import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';
import AuditLogDashboard from '@/components/AuditLogDashboard';
import AuditLogViewer from '@/components/AuditLogViewer';
import { Shield, Eye, BarChart3, Download, AlertTriangle, Settings } from 'lucide-react';

const AuditMonitoringPage: React.FC = () => {
  const { isAdmin } = useAdminAccess();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check admin access first
  if (!isAdmin) {
    return (
      <AccessDenied
        feature="Audit Monitoring System"
        requiredRole="Administrator" data-id="13qwurzrr" data-path="src/pages/Admin/AuditMonitoring.tsx" />);

  }

  return (
    <div className="space-y-6" data-id="z56dbhol1" data-path="src/pages/Admin/AuditMonitoring.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="dyrwudr4b" data-path="src/pages/Admin/AuditMonitoring.tsx">
        <div className="flex items-center space-x-2" data-id="aifr4w2v3" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <Shield className="h-6 w-6 text-blue-600" data-id="jx6c8tihm" data-path="src/pages/Admin/AuditMonitoring.tsx" />
          <h1 className="text-2xl font-bold" data-id="fndcmjzdw" data-path="src/pages/Admin/AuditMonitoring.tsx">Audit & Security Monitoring</h1>
        </div>
        <div className="flex items-center space-x-2" data-id="4iyjydzde" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-id="8flc9ejrb" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <Shield className="h-3 w-3 mr-1" data-id="wyrbb2sct" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            Active Monitoring
          </Badge>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="5ehtw5ced" data-path="src/pages/Admin/AuditMonitoring.tsx">
        <Card className="border-blue-200 bg-blue-50" data-id="njo7y8xym" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <CardContent className="p-6" data-id="47y4txb1y" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="v78or33d9" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <div data-id="s32ybwo9b" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <p className="text-sm font-medium text-blue-700" data-id="koxy7mb9q" data-path="src/pages/Admin/AuditMonitoring.tsx">Monitoring Status</p>
                <p className="text-2xl font-bold text-blue-800" data-id="yaxj2cc6m" data-path="src/pages/Admin/AuditMonitoring.tsx">Active</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" data-id="o7tkbqime" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            </div>
            <p className="text-xs text-blue-600 mt-2" data-id="mxc60moxl" data-path="src/pages/Admin/AuditMonitoring.tsx">
              All access attempts are being logged
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50" data-id="wvo5l3dob" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <CardContent className="p-6" data-id="ui1zdeqg7" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="575ksbl4j" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <div data-id="u939zlusk" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <p className="text-sm font-medium text-orange-700" data-id="xi1eq3lxa" data-path="src/pages/Admin/AuditMonitoring.tsx">Security Level</p>
                <p className="text-2xl font-bold text-orange-800" data-id="ocw6anxzh" data-path="src/pages/Admin/AuditMonitoring.tsx">High</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" data-id="5krtjxwhf" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            </div>
            <p className="text-xs text-orange-600 mt-2" data-id="faws9f74x" data-path="src/pages/Admin/AuditMonitoring.tsx">
              Enhanced monitoring enabled
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50" data-id="q6j4ih6d8" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <CardContent className="p-6" data-id="nnpj9lnx3" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="nvl6ty23i" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <div data-id="uyq2spmc0" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <p className="text-sm font-medium text-green-700" data-id="6t9f5rrhg" data-path="src/pages/Admin/AuditMonitoring.tsx">Compliance</p>
                <p className="text-2xl font-bold text-green-800" data-id="3o47wtw2w" data-path="src/pages/Admin/AuditMonitoring.tsx">100%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" data-id="k1dg6hvfl" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            </div>
            <p className="text-xs text-green-600 mt-2" data-id="4xjbnjezu" data-path="src/pages/Admin/AuditMonitoring.tsx">
              Meeting security standards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-id="6gxcz7ruf" data-path="src/pages/Admin/AuditMonitoring.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="t40r9us6p" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2" data-id="b77ft84er" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <BarChart3 className="h-4 w-4" data-id="1b0bhtzlx" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            <span data-id="kf06cgjeb" data-path="src/pages/Admin/AuditMonitoring.tsx">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2" data-id="uhbbtr6st" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <Eye className="h-4 w-4" data-id="w76p5ey71" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            <span data-id="jhc13p97z" data-path="src/pages/Admin/AuditMonitoring.tsx">Audit Logs</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2" data-id="pkoby6tqm" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <AlertTriangle className="h-4 w-4" data-id="e2145h9z3" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            <span data-id="zl3nuu10j" data-path="src/pages/Admin/AuditMonitoring.tsx">Security Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2" data-id="8jdcf3dek" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <Settings className="h-4 w-4" data-id="5w9qnvtl3" data-path="src/pages/Admin/AuditMonitoring.tsx" />
            <span data-id="2tzqoqaiq" data-path="src/pages/Admin/AuditMonitoring.tsx">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" data-id="wdp6i9qya" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <AuditLogDashboard data-id="kkswq7gsk" data-path="src/pages/Admin/AuditMonitoring.tsx" />
        </TabsContent>

        <TabsContent value="logs" data-id="2y3rddkqa" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <AuditLogViewer data-id="zrsihviti" data-path="src/pages/Admin/AuditMonitoring.tsx" />
        </TabsContent>

        <TabsContent value="alerts" data-id="zl5j47o14" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <Card data-id="wn2e0fam1" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <CardHeader data-id="uy9c3noj7" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="2dkdpbfaz" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <AlertTriangle className="h-5 w-5 text-orange-500" data-id="06v7zye44" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                <span data-id="6i23z9s4b" data-path="src/pages/Admin/AuditMonitoring.tsx">Security Alerts Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent data-id="y5u6gnn2j" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <div className="space-y-4" data-id="flb2f20lt" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="7yjvl8mva" data-path="src/pages/Admin/AuditMonitoring.tsx">
                  <Card className="border-yellow-200" data-id="us2blkk4b" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <CardContent className="p-4" data-id="1e7errnmw" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="t5sexfxuq" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <h4 className="font-medium" data-id="rjwiaovf3" data-path="src/pages/Admin/AuditMonitoring.tsx">Failed Login Threshold</h4>
                        <Badge className="bg-yellow-500 text-white" data-id="zryamk6gk" data-path="src/pages/Admin/AuditMonitoring.tsx">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground" data-id="pmyqmsvgz" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        Alert when more than 5 failed login attempts occur within 15 minutes
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200" data-id="vmsxr4v70" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <CardContent className="p-4" data-id="c26hgf2ke" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="2qk5eb37i" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <h4 className="font-medium" data-id="bgzv3tv08" data-path="src/pages/Admin/AuditMonitoring.tsx">Suspicious Activity Detection</h4>
                        <Badge className="bg-red-500 text-white" data-id="ce7nv2cmk" data-path="src/pages/Admin/AuditMonitoring.tsx">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground" data-id="3nkpjfvrg" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        Monitor for unusual access patterns and data modification attempts
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200" data-id="el00mz1gw" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <CardContent className="p-4" data-id="2lnkkyrga" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="n8ev66o9i" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <h4 className="font-medium" data-id="50t1t1y0e" data-path="src/pages/Admin/AuditMonitoring.tsx">Data Access Monitoring</h4>
                        <Badge className="bg-blue-500 text-white" data-id="0igdohkbn" data-path="src/pages/Admin/AuditMonitoring.tsx">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground" data-id="a0hcenjz2" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        Track all sensitive data access and modifications
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200" data-id="u1go49ohp" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <CardContent className="p-4" data-id="fvsg6fuo9" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="9qqcnefsm" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <h4 className="font-medium" data-id="n5e0i2tuj" data-path="src/pages/Admin/AuditMonitoring.tsx">Permission Changes</h4>
                        <Badge className="bg-purple-500 text-white" data-id="rn8ge4bfj" data-path="src/pages/Admin/AuditMonitoring.tsx">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground" data-id="os1fvsa2f" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        Monitor all user permission and role modifications
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" data-id="gjvk0dn1d" data-path="src/pages/Admin/AuditMonitoring.tsx">
          <Card data-id="itmc5azwn" data-path="src/pages/Admin/AuditMonitoring.tsx">
            <CardHeader data-id="myq2ieevf" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="o3u31u2mt" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <Settings className="h-5 w-5" data-id="2b48bb8ga" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                <span data-id="slne5mehg" data-path="src/pages/Admin/AuditMonitoring.tsx">Audit Logging Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent data-id="xnng59c5n" data-path="src/pages/Admin/AuditMonitoring.tsx">
              <div className="space-y-6" data-id="ctowd7nt4" data-path="src/pages/Admin/AuditMonitoring.tsx">
                <div data-id="dv75nspr5" data-path="src/pages/Admin/AuditMonitoring.tsx">
                  <h4 className="font-medium mb-3" data-id="ck4xz72ca" data-path="src/pages/Admin/AuditMonitoring.tsx">Logging Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="hpzt89llo" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <div className="space-y-2" data-id="p85fsalt3" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <label className="text-sm font-medium" data-id="7sto30w28" data-path="src/pages/Admin/AuditMonitoring.tsx">Log Retention Period</label>
                      <div className="p-3 border rounded-md bg-gray-50" data-id="kg9m8m8dg" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <span className="text-sm" data-id="60a1g8dwm" data-path="src/pages/Admin/AuditMonitoring.tsx">90 days (recommended)</span>
                      </div>
                    </div>
                    <div className="space-y-2" data-id="4o8udvk1j" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <label className="text-sm font-medium" data-id="n1hr1vrbg" data-path="src/pages/Admin/AuditMonitoring.tsx">Log Level</label>
                      <div className="p-3 border rounded-md bg-gray-50" data-id="b5q96h37q" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <span className="text-sm" data-id="5830ontwb" data-path="src/pages/Admin/AuditMonitoring.tsx">Detailed (All Events)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div data-id="2rjc6w73d" data-path="src/pages/Admin/AuditMonitoring.tsx">
                  <h4 className="font-medium mb-3" data-id="flv9rnx7k" data-path="src/pages/Admin/AuditMonitoring.tsx">Monitored Events</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2" data-id="mz0z28v0u" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    {[
                    'Login Attempts',
                    'Logout Events',
                    'Registration',
                    'Password Resets',
                    'Data Access',
                    'Data Modifications',
                    'Permission Changes',
                    'Admin Actions',
                    'File Uploads',
                    'Report Generation',
                    'System Errors',
                    'Suspicious Activity'].
                    map((event) =>
                    <div key={event} className="flex items-center space-x-2 p-2 border rounded-md" data-id="3ifp6jr6d" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        <div className="w-2 h-2 bg-green-500 rounded-full" data-id="7tl7psqcu" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                        <span className="text-xs" data-id="fsy0x13p7" data-path="src/pages/Admin/AuditMonitoring.tsx">{event}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div data-id="j0dzjgumm" data-path="src/pages/Admin/AuditMonitoring.tsx">
                  <h4 className="font-medium mb-3" data-id="12iqp0f2r" data-path="src/pages/Admin/AuditMonitoring.tsx">Export & Compliance</h4>
                  <div className="flex flex-wrap gap-2" data-id="64k8qhs8v" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <Button variant="outline" size="sm" data-id="l1jcgitfp" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <Download className="h-4 w-4 mr-2" data-id="h5j1m62fb" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                      Export Weekly Report
                    </Button>
                    <Button variant="outline" size="sm" data-id="olmm77890" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <Download className="h-4 w-4 mr-2" data-id="qmad1f9ln" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                      Export Monthly Report
                    </Button>
                    <Button variant="outline" size="sm" data-id="1zchwvp5c" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <Download className="h-4 w-4 mr-2" data-id="qh6wioxvy" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                      Compliance Report
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4" data-id="h64e2zgax" data-path="src/pages/Admin/AuditMonitoring.tsx">
                  <div className="flex items-center justify-between" data-id="eu33fbfzg" data-path="src/pages/Admin/AuditMonitoring.tsx">
                    <div data-id="9vqov3ix3" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <h4 className="font-medium" data-id="kvduo06an" data-path="src/pages/Admin/AuditMonitoring.tsx">Audit Logging Status</h4>
                      <p className="text-sm text-muted-foreground" data-id="52vzq4n6c" data-path="src/pages/Admin/AuditMonitoring.tsx">
                        All security events are being monitored and logged
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white" data-id="ltju3gj6l" data-path="src/pages/Admin/AuditMonitoring.tsx">
                      <Shield className="h-3 w-3 mr-1" data-id="vaogdiewb" data-path="src/pages/Admin/AuditMonitoring.tsx" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default AuditMonitoringPage;
