import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useBatchSelection } from '@/hooks/use-batch-selection';
import BatchActionBar from '@/components/BatchActionBar';
import BatchDeleteDialog from '@/components/BatchDeleteDialog';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';
import { supabase } from '@/lib/supabase';
import {
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Database,
  Shield,
  Mail,
  Calendar } from
'lucide-react';

interface LogEntry {
  id: number;
  event_type: string;
  user_id: number;
  username: string;
  ip_address: string;
  user_agent: string;
  event_timestamp: string;
  event_status: string;
  resource_accessed: string;
  action_performed: string;
  failure_reason: string;
  session_id: string;
  risk_level: string;
  additional_data: string;
  station: string;
  geo_location: string;
}

const SystemLogs: React.FC = () => {
  const { isAdmin } = useAdminAccess();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState('today');
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const { toast } = useToast();

  // Batch selection hook
  const batchSelection = useBatchSelection<LogEntry>();

  const logLevels = ['Success', 'Failed', 'Blocked', 'Suspicious'];
  const categories = ['Login', 'Logout', 'Failed Login', 'Registration', 'Password Reset', 'Data Access', 'Data Modification', 'Permission Change', 'Admin Action'];
  const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'all', label: 'All time' }];


  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      console.log('Fetching audit logs from database...');
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('event_timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching audit logs:', error);
        // Show empty state instead of fake data
        setLogs([]);
        return;
      }

      console.log('Audit logs data received:', data);
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system logs",
        variant: "destructive"
      });
      setLogs([]);
    }
  };

  const refreshLogs = async () => {
    setLoading(true);
    try {
      await fetchAuditLogs();
      toast({
        title: "Logs Refreshed",
        description: "System logs have been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const filteredLogs = getFilteredLogs();
    const csvContent = [
    ['Timestamp', 'Event Type', 'Status', 'User', 'Action', 'Resource', 'IP Address', 'Station'],
    ...filteredLogs.map((log) => [
    log.event_timestamp,
    log.event_type,
    log.event_status,
    log.username || '',
    log.action_performed || '',
    log.resource_accessed || '',
    log.ip_address || '',
    log.station || '']
    )].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Audit logs have been exported to CSV file"
    });
  };

  // Batch operations
  const handleBatchDelete = () => {
    const selectedData = batchSelection.getSelectedData(filteredLogs, (log) => log.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select log entries to delete",
        variant: "destructive"
      });
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };

  const confirmBatchDelete = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(filteredLogs, (log) => log.id);
      const selectedIds = selectedData.map((log) => log.id);

      // Filter out selected logs
      const remainingLogs = logs.filter((log) => !selectedIds.includes(log.id));
      setLogs(remainingLogs);

      toast({
        title: "Success",
        description: `Deleted ${selectedData.length} log entries successfully`
      });

      setIsBatchDeleteDialogOpen(false);
      batchSelection.clearSelection();
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast({
        title: "Error",
        description: `Failed to delete log entries: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };

  const getFilteredLogs = () => {
    return logs.filter((log) => {
      const matchesSearch =
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action_performed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username && log.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = selectedLevel === 'All' || log.event_status === selectedLevel;
      const matchesCategory = selectedCategory === 'All' || log.event_type === selectedCategory;

      // Date filtering logic based on dateRange
      const logDate = new Date(log.event_timestamp);
      const now = new Date();
      let matchesDate = true;

      switch (dateRange) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
        }
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesLevel && matchesCategory && matchesDate;
    });
  };

  const getLevelIcon = (status: string) => {
    switch (status) {
      case 'Failed':return <XCircle className="w-4 h-4 text-red-500" data-id="kbwzuc4mn" data-path="src/pages/Admin/SystemLogs.tsx" />;
      case 'Blocked':return <AlertTriangle className="w-4 h-4 text-yellow-500" data-id="6ttoi0u2y" data-path="src/pages/Admin/SystemLogs.tsx" />;
      case 'Success':return <CheckCircle className="w-4 h-4 text-green-500" data-id="stjlw64ec" data-path="src/pages/Admin/SystemLogs.tsx" />;
      case 'Suspicious':return <AlertTriangle className="w-4 h-4 text-orange-500" data-id="3487124i0" data-path="src/pages/Admin/SystemLogs.tsx" />;
      default:return <Info className="w-4 h-4 text-blue-500" data-id="p5y04jlx7" data-path="src/pages/Admin/SystemLogs.tsx" />;
    }
  };

  const getLevelBadgeColor = (status: string) => {
    switch (status) {
      case 'Failed':return 'bg-red-100 text-red-800';
      case 'Blocked':return 'bg-yellow-100 text-yellow-800';
      case 'Success':return 'bg-green-100 text-green-800';
      case 'Suspicious':return 'bg-orange-100 text-orange-800';
      default:return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (eventType: string) => {
    switch (eventType) {
      case 'Login':
      case 'Logout':
      case 'Failed Login':
      case 'Registration':
      case 'Password Reset':
        return <User className="w-4 h-4" data-id="x00vtwcvk" data-path="src/pages/Admin/SystemLogs.tsx" />;
      case 'Data Access':
      case 'Data Modification':
        return <Database className="w-4 h-4" data-id="23k13zghk" data-path="src/pages/Admin/SystemLogs.tsx" />;
      case 'Permission Change':
      case 'Admin Action':
        return <Shield className="w-4 h-4" data-id="w7uy00y0p" data-path="src/pages/Admin/SystemLogs.tsx" />;
      default:return <FileText className="w-4 h-4" data-id="66qujkux6" data-path="src/pages/Admin/SystemLogs.tsx" />;
    }
  };

  const filteredLogs = getFilteredLogs();
  const errorCount = logs.filter((log) => log.event_status === 'Failed').length;
  const warningCount = logs.filter((log) => log.event_status === 'Blocked').length;
  const infoCount = logs.filter((log) => log.event_status === 'Success').length;

  // Check admin access first
  if (!isAdmin) {
    return (
      <AccessDenied
        feature="System Logs"
        requiredRole="Administrator" data-id="49ufucymf" data-path="src/pages/Admin/SystemLogs.tsx" />);

  }

  return (
    <div className="space-y-6" data-id="ua4eu9031" data-path="src/pages/Admin/SystemLogs.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="ju5w5zxnt" data-path="src/pages/Admin/SystemLogs.tsx">
        <div className="flex items-center space-x-3" data-id="ho2ddx6qg" data-path="src/pages/Admin/SystemLogs.tsx">
          <FileText className="w-8 h-8 text-blue-600" data-id="lrkmur89g" data-path="src/pages/Admin/SystemLogs.tsx" />
          <h1 className="text-2xl font-bold text-gray-900" data-id="mpi30rdx8" data-path="src/pages/Admin/SystemLogs.tsx">Audit Logs</h1>
        </div>
        
        <div className="flex space-x-2" data-id="tr18jjetq" data-path="src/pages/Admin/SystemLogs.tsx">
          <Button onClick={refreshLogs} disabled={loading} variant="outline" data-id="it1488dm7" data-path="src/pages/Admin/SystemLogs.tsx">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} data-id="9oulje1j7" data-path="src/pages/Admin/SystemLogs.tsx" />
            Refresh
          </Button>
          <Button onClick={exportLogs} variant="outline" data-id="udt39q3jj" data-path="src/pages/Admin/SystemLogs.tsx">
            <Download className="w-4 h-4 mr-2" data-id="kj835nv2c" data-path="src/pages/Admin/SystemLogs.tsx" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="8xn2n5y9v" data-path="src/pages/Admin/SystemLogs.tsx">
        <Card data-id="tq87vreir" data-path="src/pages/Admin/SystemLogs.tsx">
          <CardContent className="p-4" data-id="rkpyx5ojz" data-path="src/pages/Admin/SystemLogs.tsx">
            <div className="flex items-center space-x-3" data-id="5smymc5cp" data-path="src/pages/Admin/SystemLogs.tsx">
              <FileText className="w-8 h-8 text-blue-600" data-id="wcc3jsu9u" data-path="src/pages/Admin/SystemLogs.tsx" />
              <div data-id="mzdfhckct" data-path="src/pages/Admin/SystemLogs.tsx">
                <p className="text-sm text-gray-600" data-id="7revijfi1" data-path="src/pages/Admin/SystemLogs.tsx">Total Logs</p>
                <p className="text-2xl font-bold" data-id="walmhu5e1" data-path="src/pages/Admin/SystemLogs.tsx">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="kfri51inx" data-path="src/pages/Admin/SystemLogs.tsx">
          <CardContent className="p-4" data-id="a1p55810v" data-path="src/pages/Admin/SystemLogs.tsx">
            <div className="flex items-center space-x-3" data-id="v0nj93p9o" data-path="src/pages/Admin/SystemLogs.tsx">
              <XCircle className="w-8 h-8 text-red-600" data-id="bilsljezf" data-path="src/pages/Admin/SystemLogs.tsx" />
              <div data-id="q404gyfzt" data-path="src/pages/Admin/SystemLogs.tsx">
                <p className="text-sm text-gray-600" data-id="dkid6bkht" data-path="src/pages/Admin/SystemLogs.tsx">Errors</p>
                <p className="text-2xl font-bold text-red-600" data-id="1qvooi621" data-path="src/pages/Admin/SystemLogs.tsx">{errorCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="hdtbsf464" data-path="src/pages/Admin/SystemLogs.tsx">
          <CardContent className="p-4" data-id="6ttarok9y" data-path="src/pages/Admin/SystemLogs.tsx">
            <div className="flex items-center space-x-3" data-id="ybe9k9rof" data-path="src/pages/Admin/SystemLogs.tsx">
              <AlertTriangle className="w-8 h-8 text-yellow-600" data-id="4vnmcah9h" data-path="src/pages/Admin/SystemLogs.tsx" />
              <div data-id="trumyixto" data-path="src/pages/Admin/SystemLogs.tsx">
                <p className="text-sm text-gray-600" data-id="c7cf4tukk" data-path="src/pages/Admin/SystemLogs.tsx">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600" data-id="kyzieblo6" data-path="src/pages/Admin/SystemLogs.tsx">{warningCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="r1ltjtn2o" data-path="src/pages/Admin/SystemLogs.tsx">
          <CardContent className="p-4" data-id="y515n4a1u" data-path="src/pages/Admin/SystemLogs.tsx">
            <div className="flex items-center space-x-3" data-id="f680p65uy" data-path="src/pages/Admin/SystemLogs.tsx">
              <Info className="w-8 h-8 text-blue-600" data-id="3kogsm6jd" data-path="src/pages/Admin/SystemLogs.tsx" />
              <div data-id="w7vzcyuhg" data-path="src/pages/Admin/SystemLogs.tsx">
                <p className="text-sm text-gray-600" data-id="gjgfwj8gb" data-path="src/pages/Admin/SystemLogs.tsx">Info</p>
                <p className="text-2xl font-bold text-blue-600" data-id="5mjymgg09" data-path="src/pages/Admin/SystemLogs.tsx">{infoCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedCount={batchSelection.selectedCount}
        onBatchDelete={handleBatchDelete}
        onClearSelection={batchSelection.clearSelection}
        isLoading={batchActionLoading}
        showEdit={false} data-id="tz4bvya39" data-path="src/pages/Admin/SystemLogs.tsx" />


      {/* Filters */}
      <Card data-id="d32mpezmv" data-path="src/pages/Admin/SystemLogs.tsx">
        <CardContent className="p-4" data-id="z5pw0yq6l" data-path="src/pages/Admin/SystemLogs.tsx">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4" data-id="4nemg2jlw" data-path="src/pages/Admin/SystemLogs.tsx">
            <div className="relative" data-id="z6536lg8o" data-path="src/pages/Admin/SystemLogs.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="t8op5o5er" data-path="src/pages/Admin/SystemLogs.tsx" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="8ihm0enaj" data-path="src/pages/Admin/SystemLogs.tsx" />

            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel} data-id="c4p0ghwsi" data-path="src/pages/Admin/SystemLogs.tsx">
              <SelectTrigger data-id="pgvrt3d6p" data-path="src/pages/Admin/SystemLogs.tsx">
                <SelectValue placeholder="Filter by level" data-id="8djwraf9q" data-path="src/pages/Admin/SystemLogs.tsx" />
              </SelectTrigger>
              <SelectContent data-id="508t7cip3" data-path="src/pages/Admin/SystemLogs.tsx">
                <SelectItem value="All" data-id="d7z9lvk1l" data-path="src/pages/Admin/SystemLogs.tsx">All Levels</SelectItem>
                {logLevels.map((level) =>
                <SelectItem key={level} value={level} data-id="mqeg1vxz6" data-path="src/pages/Admin/SystemLogs.tsx">{level}</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory} data-id="y29mvpldx" data-path="src/pages/Admin/SystemLogs.tsx">
              <SelectTrigger data-id="4iz9isrpr" data-path="src/pages/Admin/SystemLogs.tsx">
                <SelectValue placeholder="Filter by category" data-id="lqo9pp0cz" data-path="src/pages/Admin/SystemLogs.tsx" />
              </SelectTrigger>
              <SelectContent data-id="hybbw23bd" data-path="src/pages/Admin/SystemLogs.tsx">
                <SelectItem value="All" data-id="7h24njj4o" data-path="src/pages/Admin/SystemLogs.tsx">All Categories</SelectItem>
                {categories.map((category) =>
                <SelectItem key={category} value={category} data-id="nip8ms1al" data-path="src/pages/Admin/SystemLogs.tsx">{category}</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange} data-id="u1l31gk2q" data-path="src/pages/Admin/SystemLogs.tsx">
              <SelectTrigger data-id="2lvhp00sf" data-path="src/pages/Admin/SystemLogs.tsx">
                <SelectValue data-id="wz0n4sivu" data-path="src/pages/Admin/SystemLogs.tsx" />
              </SelectTrigger>
              <SelectContent data-id="07s15y4i3" data-path="src/pages/Admin/SystemLogs.tsx">
                {dateRanges.map((range) =>
                <SelectItem key={range.value} value={range.value} data-id="26oedtozu" data-path="src/pages/Admin/SystemLogs.tsx">{range.label}</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('All');
                setSelectedCategory('All');
                setDateRange('today');
              }} data-id="ucjbd0y99" data-path="src/pages/Admin/SystemLogs.tsx">

              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card data-id="kwpr4iolj" data-path="src/pages/Admin/SystemLogs.tsx">
        <CardHeader data-id="0fgfudjrj" data-path="src/pages/Admin/SystemLogs.tsx">
          <CardTitle data-id="sebemfpyd" data-path="src/pages/Admin/SystemLogs.tsx">Audit Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent data-id="ec3dbps4d" data-path="src/pages/Admin/SystemLogs.tsx">
          <div className="overflow-x-auto" data-id="t2mp601ls" data-path="src/pages/Admin/SystemLogs.tsx">
            <Table data-id="gn3fvyk7n" data-path="src/pages/Admin/SystemLogs.tsx">
              <TableHeader data-id="m7rk9or8w" data-path="src/pages/Admin/SystemLogs.tsx">
                <TableRow data-id="5fy5l0zd0" data-path="src/pages/Admin/SystemLogs.tsx">
                  <TableHead className="w-12" data-id="92d0ujp25" data-path="src/pages/Admin/SystemLogs.tsx">
                    <Checkbox
                      checked={filteredLogs.length > 0 && batchSelection.selectedCount === filteredLogs.length}
                      onCheckedChange={() => batchSelection.toggleSelectAll(filteredLogs, (log) => log.id)}
                      aria-label="Select all logs" data-id="jo9egy25k" data-path="src/pages/Admin/SystemLogs.tsx" />

                  </TableHead>
                  <TableHead data-id="6iwbc3pte" data-path="src/pages/Admin/SystemLogs.tsx">Time</TableHead>
                  <TableHead data-id="iit8j0eda" data-path="src/pages/Admin/SystemLogs.tsx">Status</TableHead>
                  <TableHead data-id="3ssswnzsc" data-path="src/pages/Admin/SystemLogs.tsx">Event Type</TableHead>
                  <TableHead data-id="mmm6e3aly" data-path="src/pages/Admin/SystemLogs.tsx">Action</TableHead>
                  <TableHead data-id="wkkj926tv" data-path="src/pages/Admin/SystemLogs.tsx">User</TableHead>
                  <TableHead data-id="ucnyajokf" data-path="src/pages/Admin/SystemLogs.tsx">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-id="hyokjbil2" data-path="src/pages/Admin/SystemLogs.tsx">
                {filteredLogs.map((log) =>
                <TableRow key={log.id} className={batchSelection.isSelected(log.id) ? "bg-blue-50" : ""} data-id="g43nbkvz1" data-path="src/pages/Admin/SystemLogs.tsx">
                    <TableCell data-id="7d5p1845s" data-path="src/pages/Admin/SystemLogs.tsx">
                      <Checkbox
                      checked={batchSelection.isSelected(log.id)}
                      onCheckedChange={() => batchSelection.toggleItem(log.id)}
                      aria-label={`Select log ${log.id}`} data-id="4u87jwabo" data-path="src/pages/Admin/SystemLogs.tsx" />

                    </TableCell>
                    <TableCell className="font-mono text-sm" data-id="bf90zqcp9" data-path="src/pages/Admin/SystemLogs.tsx">
                      <div className="flex items-center space-x-2" data-id="9igw8h1da" data-path="src/pages/Admin/SystemLogs.tsx">
                        <Clock className="w-3 h-3 text-gray-400" data-id="oo79np60e" data-path="src/pages/Admin/SystemLogs.tsx" />
                        <span data-id="p69pzu7yn" data-path="src/pages/Admin/SystemLogs.tsx">{new Date(log.event_timestamp).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell data-id="twt7k9632" data-path="src/pages/Admin/SystemLogs.tsx">
                      <div className="flex items-center space-x-2" data-id="sxb68ui3f" data-path="src/pages/Admin/SystemLogs.tsx">
                        {getLevelIcon(log.event_status)}
                        <Badge className={getLevelBadgeColor(log.event_status)} data-id="az5r318an" data-path="src/pages/Admin/SystemLogs.tsx">
                          {log.event_status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell data-id="jgs8kb3ah" data-path="src/pages/Admin/SystemLogs.tsx">
                      <div className="flex items-center space-x-2" data-id="3w6mvwm1o" data-path="src/pages/Admin/SystemLogs.tsx">
                        {getCategoryIcon(log.event_type)}
                        <span data-id="2yljbkli2" data-path="src/pages/Admin/SystemLogs.tsx">{log.event_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md" data-id="w4dhaebx0" data-path="src/pages/Admin/SystemLogs.tsx">
                      <div className="truncate" title={log.action_performed} data-id="saxl8wf1z" data-path="src/pages/Admin/SystemLogs.tsx">
                        {log.action_performed}
                      </div>
                      {log.failure_reason &&
                    <div className="text-xs text-red-600 mt-1" data-id="bfsw8o6j1" data-path="src/pages/Admin/SystemLogs.tsx">
                          Reason: {log.failure_reason}
                        </div>
                    }
                      {log.additional_data && log.additional_data !== '{}' &&
                    <details className="mt-1" data-id="dpolfbrcf" data-path="src/pages/Admin/SystemLogs.tsx">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700" data-id="uzv32o9md" data-path="src/pages/Admin/SystemLogs.tsx">
                            View details
                          </summary>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto" data-id="meo4rd1tf" data-path="src/pages/Admin/SystemLogs.tsx">
                            {JSON.stringify(JSON.parse(log.additional_data), null, 2)}
                          </pre>
                        </details>
                    }
                    </TableCell>
                    <TableCell data-id="zj46vc48t" data-path="src/pages/Admin/SystemLogs.tsx">
                      {log.username &&
                    <div className="flex items-center space-x-1" data-id="5i2rdz088" data-path="src/pages/Admin/SystemLogs.tsx">
                          <User className="w-3 h-3 text-gray-400" data-id="713ijjyhg" data-path="src/pages/Admin/SystemLogs.tsx" />
                          <span className="text-sm" data-id="tohrlo0l2" data-path="src/pages/Admin/SystemLogs.tsx">{log.username}</span>
                        </div>
                    }
                    </TableCell>
                    <TableCell className="font-mono text-sm" data-id="pm3qj4xx8" data-path="src/pages/Admin/SystemLogs.tsx">
                      {log.ip_address}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 &&
          <div className="text-center py-8 text-gray-500" data-id="ap5bm3g8q" data-path="src/pages/Admin/SystemLogs.tsx">
              No logs found matching the current filters.
            </div>
          }
        </CardContent>
      </Card>

      {/* Batch Delete Dialog */}
      <BatchDeleteDialog
        isOpen={isBatchDeleteDialogOpen}
        onClose={() => setIsBatchDeleteDialogOpen(false)}
        onConfirm={confirmBatchDelete}
        selectedCount={batchSelection.selectedCount}
        isLoading={batchActionLoading}
        itemName="log entries"
        selectedItems={batchSelection.getSelectedData(filteredLogs, (log) => log.id).map((log) => ({
          id: log.id,
          name: `${log.level} - ${log.category} - ${log.message.substring(0, 50)}...`
        }))} data-id="w9lkclf8z" data-path="src/pages/Admin/SystemLogs.tsx" />

    </div>);

};

export default SystemLogs;