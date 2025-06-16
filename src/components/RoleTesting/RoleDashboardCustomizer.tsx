import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  User, Users, Settings, Shield, Eye, Edit, Plus, Trash2,
  Download, Upload, BarChart3, Monitor, AlertTriangle,
  CheckCircle, XCircle, Layout, FileText } from
'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedRoleAccess } from '@/hooks/use-enhanced-role-access';
import { toast } from '@/hooks/use-toast';

interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  category: 'summary' | 'reports' | 'management' | 'monitoring';
  requiredRole: 'Administrator' | 'Management' | 'Employee' | 'Any';
  requiredPermissions: string[];
  isEnabled: boolean;
  position: number;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
{
  id: 'sales-summary',
  name: 'Sales Summary',
  description: 'Daily sales overview and metrics',
  category: 'summary',
  requiredRole: 'Any',
  requiredPermissions: ['sales.canView'],
  isEnabled: true,
  position: 1
},
{
  id: 'station-status',
  name: 'Station Status',
  description: 'Real-time station operational status',
  category: 'summary',
  requiredRole: 'Any',
  requiredPermissions: ['dashboard.canView'],
  isEnabled: true,
  position: 2
},
{
  id: 'inventory-alerts',
  name: 'Inventory Alerts',
  description: 'Low stock and inventory warnings',
  category: 'summary',
  requiredRole: 'Management',
  requiredPermissions: ['inventory.canView'],
  isEnabled: true,
  position: 3
},
{
  id: 'employee-management',
  name: 'Employee Management',
  description: 'Quick access to employee operations',
  category: 'management',
  requiredRole: 'Management',
  requiredPermissions: ['employees.canView', 'employees.canEdit'],
  isEnabled: true,
  position: 4
},
{
  id: 'financial-reports',
  name: 'Financial Reports',
  description: 'Revenue and expense reporting',
  category: 'reports',
  requiredRole: 'Management',
  requiredPermissions: ['sales.canViewReports'],
  isEnabled: true,
  position: 5
},
{
  id: 'user-management',
  name: 'User Management',
  description: 'System user administration',
  category: 'management',
  requiredRole: 'Administrator',
  requiredPermissions: ['admin.canManageUsers'],
  isEnabled: true,
  position: 6
},
{
  id: 'system-monitoring',
  name: 'System Monitoring',
  description: 'Application health and performance',
  category: 'monitoring',
  requiredRole: 'Administrator',
  requiredPermissions: ['monitoring.canAccessMonitoring'],
  isEnabled: true,
  position: 7
},
{
  id: 'audit-logs',
  name: 'Audit Logs',
  description: 'Security and access logging',
  category: 'monitoring',
  requiredRole: 'Administrator',
  requiredPermissions: ['admin.canViewLogs'],
  isEnabled: true,
  position: 8
},
{
  id: 'license-tracking',
  name: 'License Tracking',
  description: 'License expiration and renewal alerts',
  category: 'summary',
  requiredRole: 'Management',
  requiredPermissions: ['licenses.canView'],
  isEnabled: true,
  position: 9
},
{
  id: 'task-management',
  name: 'Task Management',
  description: 'Daily tasks and shift assignments',
  category: 'summary',
  requiredRole: 'Employee',
  requiredPermissions: ['dashboard.canView'],
  isEnabled: true,
  position: 10
}];


const RoleDashboardCustomizer: React.FC = () => {
  const { userProfile } = useAuth();
  const roleAccess = useEnhancedRoleAccess();
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [previewRole, setPreviewRole] = useState<'Administrator' | 'Management' | 'Employee'>(
    roleAccess.userRole || 'Employee'
  );

  const canAccessWidget = (widget: DashboardWidget, forRole?: string): boolean => {
    const targetRole = forRole || roleAccess.userRole;

    // Check role requirement
    if (widget.requiredRole !== 'Any') {
      if (targetRole === 'Employee' && widget.requiredRole !== 'Employee') return false;
      if (targetRole === 'Management' && widget.requiredRole === 'Administrator') return false;
    }

    // Check permissions (simplified for preview)
    return true;
  };

  const getAvailableWidgetsForRole = (role: string) => {
    return widgets.filter((widget) => canAccessWidget(widget, role) && widget.isEnabled);
  };

  const toggleWidget = (widgetId: string) => {
    if (!roleAccess.canAccessAdminArea) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can customize dashboard layouts.',
        variant: 'destructive'
      });
      return;
    }

    setWidgets((prev) => prev.map((widget) =>
    widget.id === widgetId ?
    { ...widget, isEnabled: !widget.isEnabled } :
    widget
    ));

    toast({
      title: 'Widget Updated',
      description: 'Dashboard layout has been modified.'
    });
  };

  const updateWidgetPosition = (widgetId: string, newPosition: number) => {
    if (!roleAccess.canAccessAdminArea) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can reorder dashboard widgets.',
        variant: 'destructive'
      });
      return;
    }

    setWidgets((prev) => prev.map((widget) =>
    widget.id === widgetId ?
    { ...widget, position: newPosition } :
    widget
    ));
  };

  const resetToDefaults = () => {
    if (!roleAccess.canAccessAdminArea) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can reset dashboard layouts.',
        variant: 'destructive'
      });
      return;
    }

    setWidgets(DEFAULT_WIDGETS);
    toast({
      title: 'Reset Complete',
      description: 'Dashboard layout has been reset to defaults.'
    });
  };

  const exportConfiguration = () => {
    const config = {
      widgets,
      exportDate: new Date().toISOString(),
      exportedBy: userProfile?.employee_id || 'Unknown'
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-config.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Configuration Exported',
      description: 'Dashboard configuration has been downloaded.'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'summary':
        return <BarChart3 className="h-4 w-4" data-id="x894qnfmm" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />;
      case 'reports':
        return <FileText className="h-4 w-4" data-id="ua3c85n51" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />;
      case 'management':
        return <Users className="h-4 w-4" data-id="t7wz7g2m1" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />;
      case 'monitoring':
        return <Monitor className="h-4 w-4" data-id="1zevlranp" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />;
      default:
        return <Layout className="h-4 w-4" data-id="bw22tjt3c" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />;
    }
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

  const categories = ['summary', 'reports', 'management', 'monitoring'];

  return (
    <div className="space-y-6" data-id="6j04swo7h" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
      <Card data-id="azbowcubo" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
        <CardHeader data-id="90dckfauv" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          <CardTitle className="flex items-center gap-2" data-id="wpyu1rfia" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
            <Settings className="h-5 w-5" data-id="wafsmohj2" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
            Dashboard Customization
          </CardTitle>
        </CardHeader>
        <CardContent data-id="izj61olii" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="ck77u9y2m" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
            <div className="flex items-center gap-2" data-id="ddkpmszrt" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <Label data-id="mn0tvep2l" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Your Role:</Label>
              <Badge className={getRoleColor(roleAccess.userRole || 'Unknown')} data-id="2bqy7daqu" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                {roleAccess.userRole || 'No Role'}
              </Badge>
            </div>
            <div className="flex items-center gap-2" data-id="4ycrmczru" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <Label data-id="3pis06l8c" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Admin Access:</Label>
              <Badge variant={roleAccess.canAccessAdminArea ? 'default' : 'destructive'} data-id="2feczgci0" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                {roleAccess.canAccessAdminArea ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center gap-2" data-id="r0pgsjhp7" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <Label data-id="5pilekdtf" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Preview Role:</Label>
              <Select value={previewRole} onValueChange={(value: any) => setPreviewRole(value)} data-id="hls2j3qiy" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                <SelectTrigger className="w-32" data-id="etdcovjuy" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  <SelectValue data-id="liwdlpfx9" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
                </SelectTrigger>
                <SelectContent data-id="v7a1d423v" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  <SelectItem value="Administrator" data-id="3y7ec2ize" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Administrator</SelectItem>
                  <SelectItem value="Management" data-id="utmje5805" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Management</SelectItem>
                  <SelectItem value="Employee" data-id="5x1advxyg" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2" data-id="ey0k5jozi" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <Button variant="outline" size="sm" onClick={exportConfiguration} data-id="jth0295xm" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                <Download className="h-4 w-4 mr-1" data-id="6lun8anhv" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={resetToDefaults} data-id="j3splp3rz" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="widgets" className="space-y-4" data-id="3yk8j114e" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="r8nxxppgj" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          <TabsTrigger value="widgets" data-id="lfa9v42zs" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Widget Configuration</TabsTrigger>
          <TabsTrigger value="preview" data-id="mizd147rj" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Role Preview</TabsTrigger>
          <TabsTrigger value="analytics" data-id="u7qf5ou37" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Access Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-4" data-id="3yjq8zwd9" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          {categories.map((category) =>
          <Card key={category} data-id="ead1e7r2g" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <CardHeader data-id="ih3466pzb" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                <CardTitle className="flex items-center gap-2 capitalize" data-id="gvi14ilyl" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  {getCategoryIcon(category)}
                  {category} Widgets
                </CardTitle>
              </CardHeader>
              <CardContent data-id="1r9e29yqh" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                <div className="space-y-3" data-id="nz3m6wp1m" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  {widgets.filter((w) => w.category === category).map((widget) =>
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="039qb6e65" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                      <div className="flex-1" data-id="jvv68dg1w" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                        <div className="flex items-center gap-2" data-id="ze1ilgi5u" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <span className="font-medium" data-id="l7g84ruei" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{widget.name}</span>
                          <Badge variant="outline" className="text-xs" data-id="y6fwhu15v" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                            {widget.requiredRole}
                          </Badge>
                          {widget.isEnabled ?
                      <CheckCircle className="h-4 w-4 text-green-500" data-id="pgqarvdoy" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" /> :

                      <XCircle className="h-4 w-4 text-red-500" data-id="qarhb3yrz" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
                      }
                        </div>
                        <p className="text-sm text-gray-600 mt-1" data-id="sdjwl7ffw" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{widget.description}</p>
                      </div>
                      <div className="flex items-center gap-2" data-id="ho5u3wauk" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                        <Label className="text-xs" data-id="dnz7pdtbi" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Position:</Label>
                        <Select
                      value={widget.position.toString()}
                      onValueChange={(value) => updateWidgetPosition(widget.id, parseInt(value))} data-id="c16rnrrkj" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">

                          <SelectTrigger className="w-16" data-id="z28e7b150" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                            <SelectValue data-id="ahuj4lo8j" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
                          </SelectTrigger>
                          <SelectContent data-id="ijtunv3td" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                            {Array.from({ length: 10 }, (_, i) =>
                        <SelectItem key={i + 1} value={(i + 1).toString()} data-id="en4cmt42z" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{i + 1}</SelectItem>
                        )}
                          </SelectContent>
                        </Select>
                        <Switch
                      checked={widget.isEnabled}
                      onCheckedChange={() => toggleWidget(widget.id)}
                      disabled={!roleAccess.canAccessAdminArea} data-id="z080bfzku" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />

                      </div>
                    </div>
                )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4" data-id="477iqip06" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          <Card data-id="gkilux1zm" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
            <CardHeader data-id="w8ggdsv9b" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <CardTitle className="flex items-center gap-2" data-id="ww5r7q83k" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                <Eye className="h-5 w-5" data-id="z7ayg3rzz" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
                Dashboard Preview for {previewRole}
              </CardTitle>
            </CardHeader>
            <CardContent data-id="97f5pn44a" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-id="pbnf73xlr" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                {getAvailableWidgetsForRole(previewRole).
                sort((a, b) => a.position - b.position).
                map((widget) =>
                <div key={widget.id} className="border rounded-lg p-4 bg-gray-50" data-id="evqif8yeq" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                    <div className="flex items-center justify-between mb-2" data-id="3jf0ei3t0" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                      <span className="font-medium text-sm" data-id="plv2gvglo" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{widget.name}</span>
                      <Badge variant="outline" className="text-xs" data-id="5qded6q3x" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                        #{widget.position}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600" data-id="taqq7hzbi" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{widget.description}</p>
                    <div className="flex items-center gap-1 mt-2" data-id="9ihkkjtrc" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                      {getCategoryIcon(widget.category)}
                      <span className="text-xs capitalize" data-id="jwtitiqgq" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{widget.category}</span>
                    </div>
                  </div>
                )}
              </div>
              {getAvailableWidgetsForRole(previewRole).length === 0 &&
              <Alert data-id="39z7f6e89" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  <AlertTriangle className="h-4 w-4" data-id="f4wdvthpl" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
                  <AlertDescription data-id="gzwgfqkyf" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                    No widgets are available for the {previewRole} role with current configuration.
                  </AlertDescription>
                </Alert>
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-id="pjgzcjecr" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          <Card data-id="oq7tj6k0m" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
            <CardHeader data-id="wu03cudud" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <CardTitle data-id="h30ju2gp0" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Widget Access Analytics</CardTitle>
            </CardHeader>
            <CardContent data-id="zg4g8aul9" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
              <Table data-id="kknr27ozw" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                <TableHeader data-id="cd1f66u85" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  <TableRow data-id="ef6k13t7l" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                    <TableHead data-id="59nzgf9ed" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Role</TableHead>
                    <TableHead data-id="2e8fwzfcz" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Available Widgets</TableHead>
                    <TableHead data-id="aly77fj4n" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Summary</TableHead>
                    <TableHead data-id="vei6sn7hy" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Reports</TableHead>
                    <TableHead data-id="p6niiemkc" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Management</TableHead>
                    <TableHead data-id="fbpcfws99" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">Monitoring</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="gnwb7wsz4" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                  {['Administrator', 'Management', 'Employee'].map((role) => {
                    const availableWidgets = getAvailableWidgetsForRole(role);
                    const byCategory = categories.reduce((acc, cat) => {
                      acc[cat] = availableWidgets.filter((w) => w.category === cat).length;
                      return acc;
                    }, {} as Record<string, number>);

                    return (
                      <TableRow key={role} data-id="m0jhdujh8" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                        <TableCell data-id="xfwe6hkck" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <Badge className={getRoleColor(role)} data-id="myoq5ltoi" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{role}</Badge>
                        </TableCell>
                        <TableCell data-id="oh7c20kjr" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <Badge variant="outline" data-id="hmeeeotcu" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{availableWidgets.length}</Badge>
                        </TableCell>
                        <TableCell data-id="pip25wm6k" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <Badge variant="outline" data-id="slf8qn90i" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{byCategory.summary}</Badge>
                        </TableCell>
                        <TableCell data-id="u2du33p7r" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <Badge variant="outline" data-id="07lhxgd4y" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{byCategory.reports}</Badge>
                        </TableCell>
                        <TableCell data-id="26y263pik" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <Badge variant="outline" data-id="szxv3vsaw" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{byCategory.management}</Badge>
                        </TableCell>
                        <TableCell data-id="869n4wiit" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
                          <Badge variant="outline" data-id="o5gzlu2ae" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">{byCategory.monitoring}</Badge>
                        </TableCell>
                      </TableRow>);

                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert data-id="yhzwcaaxa" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
        <Shield className="h-4 w-4" data-id="t8akoiofe" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx" />
        <AlertDescription data-id="svr4fialq" data-path="src/components/RoleTesting/RoleDashboardCustomizer.tsx">
          Dashboard customization allows administrators to control which widgets are visible to different user roles. 
          Changes affect all users with the respective roles across all stations.
        </AlertDescription>
      </Alert>
    </div>);

};

export default RoleDashboardCustomizer;
