import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Download, Filter } from 'lucide-react';

const AuditLogViewer: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);

  // Sample audit log data
  const sampleLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:22',
    eventType: 'Login',
    user: 'admin@dfsmanager.com',
    status: 'Success',
    riskLevel: 'Low',
    resource: '/dashboard',
    action: 'View',
    station: 'MOBIL',
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:25:15',
    eventType: 'Failed Login',
    user: 'unknown',
    status: 'Failed',
    riskLevel: 'Medium',
    resource: '/login',
    action: 'Authenticate',
    station: 'N/A',
    ipAddress: '203.0.113.10'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:20:08',
    eventType: 'Data Access',
    user: 'manager@dfsmanager.com',
    status: 'Success',
    riskLevel: 'Low',
    resource: '/sales/reports',
    action: 'View',
    station: 'AMOCO ROSEDALE',
    ipAddress: '192.168.1.150'
  }];


  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical':return 'bg-red-500 hover:bg-red-600';
      case 'High':return 'bg-orange-500 hover:bg-orange-600';
      case 'Medium':return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low':return 'bg-green-500 hover:bg-green-600';
      default:return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Success':return 'bg-green-500 hover:bg-green-600';
      case 'Failed':return 'bg-red-500 hover:bg-red-600';
      case 'Blocked':return 'bg-orange-500 hover:bg-orange-600';
      case 'Suspicious':return 'bg-purple-500 hover:bg-purple-600';
      default:return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const exportLogs = () => {
    // Sample CSV export functionality
    const csv = [
    'Timestamp,Event Type,User,Status,Risk Level,Resource,Action,Station,IP Address',
    ...sampleLogs.map((log) =>
    `"${log.timestamp}","${log.eventType}","${log.user}","${log.status}","${log.riskLevel}","${log.resource}","${log.action}","${log.station}","${log.ipAddress}"`
    )].
    join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" data-id="zjh88nkoy" data-path="src/components/AuditLogViewer.tsx">
      <Card data-id="0zzq47j8j" data-path="src/components/AuditLogViewer.tsx">
        <CardHeader data-id="y15y2dv3b" data-path="src/components/AuditLogViewer.tsx">
          <div className="flex items-center justify-between" data-id="wr5p8dj2b" data-path="src/components/AuditLogViewer.tsx">
            <div className="flex items-center space-x-2" data-id="8totejbsp" data-path="src/components/AuditLogViewer.tsx">
              <Shield className="h-5 w-5 text-blue-600" data-id="62hydt0ab" data-path="src/components/AuditLogViewer.tsx" />
              <CardTitle data-id="qzxatmyr6" data-path="src/components/AuditLogViewer.tsx">Audit Log Viewer</CardTitle>
            </div>
            <div className="flex items-center space-x-2" data-id="m09f2t7pr" data-path="src/components/AuditLogViewer.tsx">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)} data-id="cykriaptw" data-path="src/components/AuditLogViewer.tsx">

                <Filter className="h-4 w-4 mr-2" data-id="d9vw9h0xp" data-path="src/components/AuditLogViewer.tsx" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs} data-id="vy5zt25uf" data-path="src/components/AuditLogViewer.tsx">

                <Download className="h-4 w-4 mr-2" data-id="geql21rs4" data-path="src/components/AuditLogViewer.tsx" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        {showFilters &&
        <CardContent className="border-t" data-id="u402kfsha" data-path="src/components/AuditLogViewer.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4" data-id="zof5jrc1j" data-path="src/components/AuditLogViewer.tsx">
              <div data-id="hcmcae8r3" data-path="src/components/AuditLogViewer.tsx">
                <label className="text-sm font-medium mb-1 block" data-id="pdtw0e75t" data-path="src/components/AuditLogViewer.tsx">Event Type</label>
                <Select data-id="wjm9tipb0" data-path="src/components/AuditLogViewer.tsx">
                  <SelectTrigger data-id="0l1gf9ium" data-path="src/components/AuditLogViewer.tsx">
                    <SelectValue placeholder="All events" data-id="neslsgxvs" data-path="src/components/AuditLogViewer.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="jkrxf8e2y" data-path="src/components/AuditLogViewer.tsx">
                    <SelectItem value="" data-id="au1blpgju" data-path="src/components/AuditLogViewer.tsx">All Events</SelectItem>
                    <SelectItem value="Login" data-id="mtwasko7a" data-path="src/components/AuditLogViewer.tsx">Login</SelectItem>
                    <SelectItem value="Logout" data-id="pbql2s7fx" data-path="src/components/AuditLogViewer.tsx">Logout</SelectItem>
                    <SelectItem value="Failed Login" data-id="m8pnj42r5" data-path="src/components/AuditLogViewer.tsx">Failed Login</SelectItem>
                    <SelectItem value="Data Access" data-id="f6scpjvld" data-path="src/components/AuditLogViewer.tsx">Data Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div data-id="rb98owkvx" data-path="src/components/AuditLogViewer.tsx">
                <label className="text-sm font-medium mb-1 block" data-id="023stavyq" data-path="src/components/AuditLogViewer.tsx">Status</label>
                <Select data-id="skyl9ntzf" data-path="src/components/AuditLogViewer.tsx">
                  <SelectTrigger data-id="mcaliz4c7" data-path="src/components/AuditLogViewer.tsx">
                    <SelectValue placeholder="All statuses" data-id="saeprc8fk" data-path="src/components/AuditLogViewer.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="41510hper" data-path="src/components/AuditLogViewer.tsx">
                    <SelectItem value="" data-id="85b94lzkg" data-path="src/components/AuditLogViewer.tsx">All Statuses</SelectItem>
                    <SelectItem value="Success" data-id="dmnn9eveq" data-path="src/components/AuditLogViewer.tsx">Success</SelectItem>
                    <SelectItem value="Failed" data-id="ch23swhd5" data-path="src/components/AuditLogViewer.tsx">Failed</SelectItem>
                    <SelectItem value="Blocked" data-id="cnqp1p6na" data-path="src/components/AuditLogViewer.tsx">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div data-id="48zunsb5o" data-path="src/components/AuditLogViewer.tsx">
                <label className="text-sm font-medium mb-1 block" data-id="n561fuxi6" data-path="src/components/AuditLogViewer.tsx">Risk Level</label>
                <Select data-id="kw28cgytf" data-path="src/components/AuditLogViewer.tsx">
                  <SelectTrigger data-id="x9c6k0fgl" data-path="src/components/AuditLogViewer.tsx">
                    <SelectValue placeholder="All risk levels" data-id="r1y5zr1vx" data-path="src/components/AuditLogViewer.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="ydbie7dg0" data-path="src/components/AuditLogViewer.tsx">
                    <SelectItem value="" data-id="4w6q5l10w" data-path="src/components/AuditLogViewer.tsx">All Risk Levels</SelectItem>
                    <SelectItem value="Low" data-id="zspsl206w" data-path="src/components/AuditLogViewer.tsx">Low</SelectItem>
                    <SelectItem value="Medium" data-id="oc1i81ymv" data-path="src/components/AuditLogViewer.tsx">Medium</SelectItem>
                    <SelectItem value="High" data-id="1lp8eun8l" data-path="src/components/AuditLogViewer.tsx">High</SelectItem>
                    <SelectItem value="Critical" data-id="hctuawidu" data-path="src/components/AuditLogViewer.tsx">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div data-id="r8ucv5en4" data-path="src/components/AuditLogViewer.tsx">
                <label className="text-sm font-medium mb-1 block" data-id="s8kxgdor7" data-path="src/components/AuditLogViewer.tsx">Username</label>
                <Input placeholder="Search username..." data-id="kn0m7lblc" data-path="src/components/AuditLogViewer.tsx" />
              </div>
            </div>
          </CardContent>
        }

        <CardContent data-id="sivwcauac" data-path="src/components/AuditLogViewer.tsx">
          <div className="rounded-md border" data-id="m28c3roaz" data-path="src/components/AuditLogViewer.tsx">
            <Table data-id="xmxd6v5om" data-path="src/components/AuditLogViewer.tsx">
              <TableHeader data-id="8vfj6jwxf" data-path="src/components/AuditLogViewer.tsx">
                <TableRow data-id="16rg2qjtk" data-path="src/components/AuditLogViewer.tsx">
                  <TableHead data-id="7eq4om1i2" data-path="src/components/AuditLogViewer.tsx">Timestamp</TableHead>
                  <TableHead data-id="dxxzdpfn4" data-path="src/components/AuditLogViewer.tsx">Event Type</TableHead>
                  <TableHead data-id="lu5fp66l8" data-path="src/components/AuditLogViewer.tsx">User</TableHead>
                  <TableHead data-id="ee0v4tqgr" data-path="src/components/AuditLogViewer.tsx">Status</TableHead>
                  <TableHead data-id="oxt40fim9" data-path="src/components/AuditLogViewer.tsx">Risk Level</TableHead>
                  <TableHead data-id="wo8aku71h" data-path="src/components/AuditLogViewer.tsx">Resource</TableHead>
                  <TableHead data-id="e8kia8wvk" data-path="src/components/AuditLogViewer.tsx">Action</TableHead>
                  <TableHead data-id="mlesf66zd" data-path="src/components/AuditLogViewer.tsx">Station</TableHead>
                  <TableHead data-id="5nkdqscsa" data-path="src/components/AuditLogViewer.tsx">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-id="ry8dwf13h" data-path="src/components/AuditLogViewer.tsx">
                {sampleLogs.map((log) =>
                <TableRow key={log.id} data-id="09lb7h43l" data-path="src/components/AuditLogViewer.tsx">
                    <TableCell className="text-sm" data-id="f8r0norka" data-path="src/components/AuditLogViewer.tsx">
                      {log.timestamp}
                    </TableCell>
                    <TableCell data-id="jvh6t4yxi" data-path="src/components/AuditLogViewer.tsx">
                      <Badge variant="outline" data-id="gvyslnmoh" data-path="src/components/AuditLogViewer.tsx">{log.eventType}</Badge>
                    </TableCell>
                    <TableCell data-id="elx3v6ncb" data-path="src/components/AuditLogViewer.tsx">
                      {log.user}
                    </TableCell>
                    <TableCell data-id="4pgfy5eb5" data-path="src/components/AuditLogViewer.tsx">
                      <Badge className={`text-white ${getStatusBadgeColor(log.status)}`} data-id="ndy0vcgxv" data-path="src/components/AuditLogViewer.tsx">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell data-id="6zp2urptn" data-path="src/components/AuditLogViewer.tsx">
                      <Badge className={`text-white ${getRiskBadgeColor(log.riskLevel)}`} data-id="nfb24hlbu" data-path="src/components/AuditLogViewer.tsx">
                        {log.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm" data-id="gqv702xtx" data-path="src/components/AuditLogViewer.tsx">
                      {log.resource}
                    </TableCell>
                    <TableCell className="text-sm" data-id="mpguejzac" data-path="src/components/AuditLogViewer.tsx">
                      {log.action}
                    </TableCell>
                    <TableCell data-id="f9lcwh5gr" data-path="src/components/AuditLogViewer.tsx">
                      {log.station}
                    </TableCell>
                    <TableCell className="text-sm" data-id="wnhvhi1hg" data-path="src/components/AuditLogViewer.tsx">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default AuditLogViewer;
