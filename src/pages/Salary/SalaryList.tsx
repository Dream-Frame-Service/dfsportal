import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Eye, Edit, Trash2, Download, DollarSign, Calendar, Users, RefreshCw, FileText, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useRealtime, useRealtimeData } from '@/hooks/use-realtime';

interface SalaryRecord {
  id: number;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  pay_frequency: string;
  base_salary: number;
  hourly_rate: number;
  regular_hours: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_pay: number;
  bonus_amount: number;
  commission: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  health_insurance: number;
  retirement_401k: number;
  other_deductions: number;
  total_deductions: number;
  net_pay: number;
  station: string;
  status: string;
  notes: string;
  created_by: number;
}

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  position: string;
  station: string;
}

const SalaryList: React.FC = () => {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [realtimeUpdates, setRealtimeUpdates] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const pageSize = 10;
  const SALARY_TABLE_ID = '11788';
  const EMPLOYEES_TABLE_ID = '11727';

  // Monitor online status for real-time functionality
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleRefresh(true); // Silent refresh when coming back online
      toast({
        title: 'Back Online',
        description: 'Real-time data synchronization resumed',
        variant: 'default'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Offline',
        description: 'Real-time updates paused',
        variant: 'destructive'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchSalaryRecords();
  }, [currentPage, statusFilter, stationFilter, searchTerm]);

  // Enhanced real-time refresh with better error handling
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        handleRefresh(true); // Silent refresh only when tab is visible
      }
    }, 15000); // Increased frequency to 15 seconds for real-time feel

    return () => clearInterval(interval);
  }, [currentPage, statusFilter, stationFilter, searchTerm, isOnline]);

  // Refresh when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isOnline) {
        handleRefresh(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOnline]);

  const fetchEmployees = useCallback(async () => {
    try {
      console.log('👥 Fetching employees data...');

      const { data, error } = await window.ezsite.apis.tablePage(EMPLOYEES_TABLE_ID, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: 'first_name',
        IsAsc: true,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw error;

      const employees = data?.List || [];
      console.log('✅ Employees fetched successfully:', employees.length);

      setEmployees(employees);
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employee data',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const fetchSalaryRecords = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const filters = [];

      if (statusFilter !== 'all') {
        filters.push({ name: 'status', op: 'Equal', value: statusFilter });
      }

      if (stationFilter !== 'all') {
        filters.push({ name: 'station', op: 'Equal', value: stationFilter });
      }

      if (searchTerm) {
        filters.push({ name: 'employee_id', op: 'StringContains', value: searchTerm });
      }

      console.log('🔄 Fetching salary records - Real-time update:', {
        currentPage,
        pageSize,
        filters,
        silent,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await window.ezsite.apis.tablePage(SALARY_TABLE_ID, {
        PageNo: currentPage,
        PageSize: pageSize,
        OrderByField: 'pay_date',
        IsAsc: false,
        Filters: filters
      });

      if (error) throw error;

      const records = data?.List || [];
      const totalCount = data?.VirtualCount || 0;

      console.log('✅ Salary records fetched successfully:', {
        recordsCount: records.length,
        totalCount,
        timestamp: new Date().toISOString()
      });

      setSalaryRecords(records);
      setTotalRecords(totalCount);
      setLastUpdateTime(new Date());
      setRetryCount(0); // Reset retry count on successful fetch
    } catch (error) {
      console.error('❌ Error fetching salary records:', error);
      setRetryCount((prev) => prev + 1);

      if (!silent) {
        toast({
          title: 'Error',
          description: `Failed to fetch salary records. ${retryCount < 3 ? 'Retrying...' : 'Please check your connection.'}`,
          variant: 'destructive'
        });

        // Auto-retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          setTimeout(() => {
            console.log(`🔄 Auto-retrying... Attempt ${retryCount + 1}/3`);
            fetchSalaryRecords(true);
          }, Math.pow(2, retryCount) * 1000); // 1s, 2s, 4s delays
        }
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, stationFilter, searchTerm, toast]);

  const handleRefresh = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      console.log('🔄 Starting data refresh...', { silent, timestamp: new Date().toISOString() });

      await Promise.all([
      fetchEmployees(),
      fetchSalaryRecords(silent)]
      );

      console.log('✅ Data refresh completed successfully');

      if (!silent) {
        toast({
          title: 'Success',
          description: '🔄 Data refreshed successfully',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      if (!silent) {
        toast({
          title: 'Error',
          description: '❌ Failed to refresh data. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [fetchEmployees, fetchSalaryRecords, toast]);

  const handleViewRecord = (record: SalaryRecord) => {
    setSelectedRecord(record);
    setShowViewDialog(true);
  };

  const handleEditRecord = (record: SalaryRecord) => {
    const employeeName = getEmployeeName(record.employee_id);
    console.log('📝 Navigating to edit salary record:', { id: record.id, employee: employeeName });

    toast({
      title: 'Opening Editor',
      description: `📝 Loading salary record for ${employeeName}...`,
      variant: 'default'
    });

    navigate(`/salary/${record.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const record = salaryRecords.find((r) => r.id === id);
    const employeeName = record ? getEmployeeName(record.employee_id) : 'Unknown';

    if (!confirm(`Are you sure you want to delete the salary record for ${employeeName}?\n\nThis action cannot be undone.`)) return;

    try {
      console.log('🗑️ Deleting salary record:', id);

      const { error } = await window.ezsite.apis.tableDelete(SALARY_TABLE_ID, { ID: id });
      if (error) throw error;

      console.log('✅ Salary record deleted successfully');

      toast({
        title: 'Success',
        description: `🗑️ Salary record for ${employeeName} deleted successfully`
      });

      // Immediate real-time update
      await fetchSalaryRecords();
    } catch (error) {
      console.error('❌ Error deleting salary record:', error);
      toast({
        title: 'Error',
        description: `❌ Failed to delete salary record for ${employeeName}`,
        variant: 'destructive'
      });
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const record = salaryRecords.find((r) => r.id === id);
      if (!record) return;

      const employeeName = getEmployeeName(record.employee_id);
      console.log('🔄 Updating salary record status:', { id, newStatus, employeeName });

      const { error } = await window.ezsite.apis.tableUpdate(SALARY_TABLE_ID, {
        ID: id,
        ...record,
        status: newStatus,
        pay_period_start: new Date(record.pay_period_start).toISOString(),
        pay_period_end: new Date(record.pay_period_end).toISOString(),
        pay_date: new Date(record.pay_date).toISOString()
      });

      if (error) throw error;

      console.log('✅ Status updated successfully');

      toast({
        title: 'Success',
        description: `📋 ${employeeName}'s salary status updated to ${newStatus}`
      });

      // Immediate real-time update
      await fetchSalaryRecords();
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast({
        title: 'Error',
        description: '❌ Failed to update status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : employeeId;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':return 'default';
      case 'processed':return 'secondary';
      case 'pending':return 'outline';
      case 'cancelled':return 'destructive';
      default:return 'outline';
    }
  };

  const calculateSummaryStats = () => {
    const totalGrossPay = salaryRecords.reduce((sum, record) => sum + (record.gross_pay || 0), 0);
    const totalNetPay = salaryRecords.reduce((sum, record) => sum + (record.net_pay || 0), 0);
    const uniqueEmployees = new Set(salaryRecords.map((record) => record.employee_id)).size;

    return {
      totalGrossPay,
      totalNetPay,
      uniqueEmployees,
      totalRecords: salaryRecords.length
    };
  };

  const exportToPDF = (record: SalaryRecord) => {
    // Create a printable salary slip
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const employeeName = getEmployeeName(record.employee_id);
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Salary Slip - ${employeeName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .section { margin: 20px 0; border-top: 1px solid #ccc; padding-top: 15px; }
          .total { font-weight: bold; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DFS Manager Portal</h1>
          <h2>Salary Slip</h2>
        </div>
        
        <div class="details">
          <div class="row"><span>Employee:</span><span>${employeeName} (${record.employee_id})</span></div>
          <div class="row"><span>Station:</span><span>${record.station}</span></div>
          <div class="row"><span>Pay Period:</span><span>${format(new Date(record.pay_period_start), 'MMM dd')} - ${format(new Date(record.pay_period_end), 'MMM dd, yyyy')}</span></div>
          <div class="row"><span>Pay Date:</span><span>${format(new Date(record.pay_date), 'MMM dd, yyyy')}</span></div>
          <div class="row"><span>Pay Frequency:</span><span>${record.pay_frequency}</span></div>
        </div>

        <div class="section">
          <h3>Earnings</h3>
          <div class="row"><span>Base Salary:</span><span>$${record.base_salary?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Regular Hours (${record.regular_hours}):</span><span>$${(record.hourly_rate * record.regular_hours)?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Overtime Hours (${record.overtime_hours}):</span><span>$${record.overtime_pay?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Bonus:</span><span>$${record.bonus_amount?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Commission:</span><span>$${record.commission?.toLocaleString() || '0.00'}</span></div>
          <div class="row total"><span>Gross Pay:</span><span>$${record.gross_pay?.toLocaleString() || '0.00'}</span></div>
        </div>

        <div class="section">
          <h3>Deductions</h3>
          <div class="row"><span>Federal Tax:</span><span>$${record.federal_tax?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>State Tax:</span><span>$${record.state_tax?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Social Security:</span><span>$${record.social_security?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Medicare:</span><span>$${record.medicare?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Health Insurance:</span><span>$${record.health_insurance?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>401(k):</span><span>$${record.retirement_401k?.toLocaleString() || '0.00'}</span></div>
          <div class="row"><span>Other Deductions:</span><span>$${record.other_deductions?.toLocaleString() || '0.00'}</span></div>
          <div class="row total"><span>Total Deductions:</span><span>$${record.total_deductions?.toLocaleString() || '0.00'}</span></div>
        </div>

        <div class="section">
          <div class="row total" style="font-size: 1.5em; color: green;"><span>Net Pay:</span><span>$${record.net_pay?.toLocaleString() || '0.00'}</span></div>
        </div>

        ${record.notes ? `<div class="section"><h3>Notes</h3><p>${record.notes}</p></div>` : ''}
        
        <div style="margin-top: 50px; text-align: center; font-size: 0.9em; color: #666;">
          Generated on ${format(new Date(), 'PPpp')}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const stats = calculateSummaryStats();
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="space-y-6" data-id="0powv5sql" data-path="src/pages/Salary/SalaryList.tsx">
      <div className="flex items-center justify-between" data-id="ap4fr7id2" data-path="src/pages/Salary/SalaryList.tsx">
        <div data-id="mwsu7wgze" data-path="src/pages/Salary/SalaryList.tsx">
          <h1 className="text-3xl font-bold" data-id="ogogrlpqe" data-path="src/pages/Salary/SalaryList.tsx">Salary Management</h1>
          <p className="text-muted-foreground" data-id="91l9dxguk" data-path="src/pages/Salary/SalaryList.tsx">Manage employee salary records and payroll</p>
        </div>
        <div className="flex gap-2" data-id="4ouoryfjw" data-path="src/pages/Salary/SalaryList.tsx">
          <div className="flex items-center gap-2" data-id="9dkb1z3ot" data-path="src/pages/Salary/SalaryList.tsx">
            <Badge variant={isOnline ? 'default' : 'destructive'} className="text-xs" data-id="1sm2qf2td" data-path="src/pages/Salary/SalaryList.tsx">
              {isOnline ? '🟢 Live' : '🔴 Offline'}
            </Badge>
            {refreshing &&
            <Badge variant="secondary" className="text-xs animate-pulse" data-id="1xtbpau9j" data-path="src/pages/Salary/SalaryList.tsx">
                🔄 Syncing...
              </Badge>
            }
          </div>
          <Button
            variant="outline"
            onClick={() => handleRefresh(false)}
            disabled={refreshing} data-id="yaa0r07yy" data-path="src/pages/Salary/SalaryList.tsx">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} data-id="d6rr69cqr" data-path="src/pages/Salary/SalaryList.tsx" />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Link to="/salary/new" data-id="yj93dafu6" data-path="src/pages/Salary/SalaryList.tsx">
            <Button data-id="kxoeipfc8" data-path="src/pages/Salary/SalaryList.tsx">
              <Plus className="h-4 w-4 mr-2" data-id="fxdcxb7w1" data-path="src/pages/Salary/SalaryList.tsx" />
              Add Salary Record
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="pwseyhiro" data-path="src/pages/Salary/SalaryList.tsx">
        <Card data-id="c9axl899f" data-path="src/pages/Salary/SalaryList.tsx">
          <CardContent className="flex items-center p-4" data-id="dhs0tb1de" data-path="src/pages/Salary/SalaryList.tsx">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" data-id="5u0geog51" data-path="src/pages/Salary/SalaryList.tsx" />
            <div data-id="97hp702bw" data-path="src/pages/Salary/SalaryList.tsx">
              <p className="text-sm font-medium text-muted-foreground" data-id="o763kdvjf" data-path="src/pages/Salary/SalaryList.tsx">Total Gross Pay</p>
              <p className="text-2xl font-bold" data-id="parmyvoqr" data-path="src/pages/Salary/SalaryList.tsx">${stats.totalGrossPay.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="k4bigzqlz" data-path="src/pages/Salary/SalaryList.tsx">
          <CardContent className="flex items-center p-4" data-id="4k2d8pkit" data-path="src/pages/Salary/SalaryList.tsx">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" data-id="6otp4dadt" data-path="src/pages/Salary/SalaryList.tsx" />
            <div data-id="pn16ro3l0" data-path="src/pages/Salary/SalaryList.tsx">
              <p className="text-sm font-medium text-muted-foreground" data-id="9e84rk50z" data-path="src/pages/Salary/SalaryList.tsx">Total Net Pay</p>
              <p className="text-2xl font-bold" data-id="er0ebdr61" data-path="src/pages/Salary/SalaryList.tsx">${stats.totalNetPay.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="9i28hfw7m" data-path="src/pages/Salary/SalaryList.tsx">
          <CardContent className="flex items-center p-4" data-id="j1n5rbdv6" data-path="src/pages/Salary/SalaryList.tsx">
            <Users className="h-8 w-8 text-purple-600 mr-3" data-id="0wo0avk4a" data-path="src/pages/Salary/SalaryList.tsx" />
            <div data-id="00e9ha0gt" data-path="src/pages/Salary/SalaryList.tsx">
              <p className="text-sm font-medium text-muted-foreground" data-id="boewliuop" data-path="src/pages/Salary/SalaryList.tsx">Employees</p>
              <p className="text-2xl font-bold" data-id="bot0wk60e" data-path="src/pages/Salary/SalaryList.tsx">{stats.uniqueEmployees}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="xba105zqt" data-path="src/pages/Salary/SalaryList.tsx">
          <CardContent className="flex items-center p-4" data-id="11dn6k2zq" data-path="src/pages/Salary/SalaryList.tsx">
            <Calendar className="h-8 w-8 text-orange-600 mr-3" data-id="rh3g0rhxv" data-path="src/pages/Salary/SalaryList.tsx" />
            <div data-id="n54oooctf" data-path="src/pages/Salary/SalaryList.tsx">
              <p className="text-sm font-medium text-muted-foreground" data-id="uncjcdqdk" data-path="src/pages/Salary/SalaryList.tsx">Total Records</p>
              <p className="text-2xl font-bold" data-id="bpkinn8qk" data-path="src/pages/Salary/SalaryList.tsx">{totalRecords}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card data-id="hj4945t1w" data-path="src/pages/Salary/SalaryList.tsx">
        <CardContent className="p-4" data-id="huh6sgy09" data-path="src/pages/Salary/SalaryList.tsx">
          <div className="flex flex-wrap gap-4" data-id="bskzw0c4b" data-path="src/pages/Salary/SalaryList.tsx">
            <div className="flex-1 min-w-[200px]" data-id="4w3etcikq" data-path="src/pages/Salary/SalaryList.tsx">
              <div className="relative" data-id="aq0c36so3" data-path="src/pages/Salary/SalaryList.tsx">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" data-id="rhzyufjx8" data-path="src/pages/Salary/SalaryList.tsx" />
                <Input
                  placeholder="Search by employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8" data-id="4xzaozd8w" data-path="src/pages/Salary/SalaryList.tsx" />

              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter} data-id="qw1taunyd" data-path="src/pages/Salary/SalaryList.tsx">
              <SelectTrigger className="w-[150px]" data-id="l0gzypqe3" data-path="src/pages/Salary/SalaryList.tsx">
                <SelectValue placeholder="Status" data-id="9rxmbhkpx" data-path="src/pages/Salary/SalaryList.tsx" />
              </SelectTrigger>
              <SelectContent data-id="53e82cdg7" data-path="src/pages/Salary/SalaryList.tsx">
                <SelectItem value="all" data-id="rss701s40" data-path="src/pages/Salary/SalaryList.tsx">All Status</SelectItem>
                <SelectItem value="Pending" data-id="ba8ky5vmm" data-path="src/pages/Salary/SalaryList.tsx">Pending</SelectItem>
                <SelectItem value="Processed" data-id="61lhm7tqb" data-path="src/pages/Salary/SalaryList.tsx">Processed</SelectItem>
                <SelectItem value="Paid" data-id="ky9vbvt2j" data-path="src/pages/Salary/SalaryList.tsx">Paid</SelectItem>
                <SelectItem value="Cancelled" data-id="owqjsquyi" data-path="src/pages/Salary/SalaryList.tsx">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={stationFilter} onValueChange={setStationFilter} data-id="2cdns4zex" data-path="src/pages/Salary/SalaryList.tsx">
              <SelectTrigger className="w-[180px]" data-id="d7im2ntf9" data-path="src/pages/Salary/SalaryList.tsx">
                <SelectValue placeholder="Station" data-id="akaswewap" data-path="src/pages/Salary/SalaryList.tsx" />
              </SelectTrigger>
              <SelectContent data-id="670m8imvz" data-path="src/pages/Salary/SalaryList.tsx">
                <SelectItem value="all" data-id="4mhn7wk0x" data-path="src/pages/Salary/SalaryList.tsx">All Stations</SelectItem>
                <SelectItem value="MOBIL" data-id="rt7e1pda1" data-path="src/pages/Salary/SalaryList.tsx">MOBIL</SelectItem>
                <SelectItem value="AMOCO ROSEDALE" data-id="fvqiu9rsl" data-path="src/pages/Salary/SalaryList.tsx">AMOCO ROSEDALE</SelectItem>
                <SelectItem value="AMOCO BROOKLYN" data-id="2iasx8cnw" data-path="src/pages/Salary/SalaryList.tsx">AMOCO BROOKLYN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Salary Records Table */}
      <Card data-id="4tpqkrgif" data-path="src/pages/Salary/SalaryList.tsx">
        <CardHeader data-id="b7i0wlgza" data-path="src/pages/Salary/SalaryList.tsx">
          <CardTitle data-id="dn2v199ha" data-path="src/pages/Salary/SalaryList.tsx">Salary Records</CardTitle>
          <CardDescription data-id="frooocdey" data-path="src/pages/Salary/SalaryList.tsx">
            Showing {salaryRecords.length} of {totalRecords} salary records
            {refreshing && <span className="text-blue-600 ml-2" data-id="7wnoivrqj" data-path="src/pages/Salary/SalaryList.tsx">(🔄 Real-time sync active...)</span>}
            {!isOnline && <span className="text-red-600 ml-2" data-id="x2mspk42z" data-path="src/pages/Salary/SalaryList.tsx">(🔴 Offline mode)</span>}
            <div className="text-xs text-muted-foreground mt-1" data-id="v2c041dn5" data-path="src/pages/Salary/SalaryList.tsx">
              Last updated: {format(lastUpdateTime, 'MMM dd, yyyy · h:mm:ss a')}
              {retryCount > 0 && <span className="text-orange-600 ml-2" data-id="sxhmrr1dt" data-path="src/pages/Salary/SalaryList.tsx">(🔄 Retry {retryCount}/3)</span>}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent data-id="lm0pk6eyd" data-path="src/pages/Salary/SalaryList.tsx">
          {loading ?
          <div className="flex justify-center py-8" data-id="kbkbwhoss" data-path="src/pages/Salary/SalaryList.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-id="o0v9pulu4" data-path="src/pages/Salary/SalaryList.tsx"></div>
            </div> :

          <div className="overflow-x-auto" data-id="ypu2isqfd" data-path="src/pages/Salary/SalaryList.tsx">
              <Table data-id="xyahzryws" data-path="src/pages/Salary/SalaryList.tsx">
                <TableHeader data-id="qfp6o8vzp" data-path="src/pages/Salary/SalaryList.tsx">
                  <TableRow data-id="c1clnx037" data-path="src/pages/Salary/SalaryList.tsx">
                    <TableHead data-id="2tsrsqvuq" data-path="src/pages/Salary/SalaryList.tsx">Employee</TableHead>
                    <TableHead data-id="7g551klxi" data-path="src/pages/Salary/SalaryList.tsx">Pay Period</TableHead>
                    <TableHead data-id="o08fs84ql" data-path="src/pages/Salary/SalaryList.tsx">Pay Date</TableHead>
                    <TableHead data-id="zdduf6tg2" data-path="src/pages/Salary/SalaryList.tsx">Frequency</TableHead>
                    <TableHead data-id="6zbzutven" data-path="src/pages/Salary/SalaryList.tsx">Gross Pay</TableHead>
                    <TableHead data-id="r7ytgdpel" data-path="src/pages/Salary/SalaryList.tsx">Net Pay</TableHead>
                    <TableHead data-id="acf9xf0pr" data-path="src/pages/Salary/SalaryList.tsx">Station</TableHead>
                    <TableHead data-id="x6l018q4f" data-path="src/pages/Salary/SalaryList.tsx">Status</TableHead>
                    <TableHead data-id="g9u73n579" data-path="src/pages/Salary/SalaryList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="q5r8ti0b9" data-path="src/pages/Salary/SalaryList.tsx">
                  {salaryRecords.map((record) =>
                <TableRow key={record.id} data-id="7rmgj6rbj" data-path="src/pages/Salary/SalaryList.tsx">
                      <TableCell className="font-medium" data-id="e43nw0a46" data-path="src/pages/Salary/SalaryList.tsx">
                        {getEmployeeName(record.employee_id)}
                        <div className="text-xs text-muted-foreground" data-id="3lsakiz8q" data-path="src/pages/Salary/SalaryList.tsx">ID: {record.employee_id}</div>
                      </TableCell>
                      <TableCell data-id="kjo56nt0c" data-path="src/pages/Salary/SalaryList.tsx">
                        <div className="text-sm" data-id="9aqj1ve9h" data-path="src/pages/Salary/SalaryList.tsx">
                          {format(new Date(record.pay_period_start), 'MMM dd')} - {format(new Date(record.pay_period_end), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell data-id="l62zevn87" data-path="src/pages/Salary/SalaryList.tsx">{format(new Date(record.pay_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell data-id="e7b84xcsu" data-path="src/pages/Salary/SalaryList.tsx">{record.pay_frequency}</TableCell>
                      <TableCell className="font-medium" data-id="f1f6j3piz" data-path="src/pages/Salary/SalaryList.tsx">${record.gross_pay?.toLocaleString() || '0'}</TableCell>
                      <TableCell className="font-medium text-green-600" data-id="3bo6y4oza" data-path="src/pages/Salary/SalaryList.tsx">${record.net_pay?.toLocaleString() || '0'}</TableCell>
                      <TableCell data-id="1qcn88n2h" data-path="src/pages/Salary/SalaryList.tsx">{record.station}</TableCell>
                      <TableCell data-id="eguetxdky" data-path="src/pages/Salary/SalaryList.tsx">
                        <Select
                      value={record.status}
                      onValueChange={(value) => handleStatusUpdate(record.id, value)} data-id="yymlaaelp" data-path="src/pages/Salary/SalaryList.tsx">

                          <SelectTrigger className="w-auto h-auto p-0 border-none" data-id="lhjtbq9gc" data-path="src/pages/Salary/SalaryList.tsx">
                            <Badge variant={getStatusBadgeVariant(record.status)} data-id="aayta9k75" data-path="src/pages/Salary/SalaryList.tsx">
                              {record.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent data-id="8ehz5ksdn" data-path="src/pages/Salary/SalaryList.tsx">
                            <SelectItem value="Pending" data-id="eoa6ts7cq" data-path="src/pages/Salary/SalaryList.tsx">Pending</SelectItem>
                            <SelectItem value="Processed" data-id="xz3g5rxey" data-path="src/pages/Salary/SalaryList.tsx">Processed</SelectItem>
                            <SelectItem value="Paid" data-id="7o3pxaugc" data-path="src/pages/Salary/SalaryList.tsx">Paid</SelectItem>
                            <SelectItem value="Cancelled" data-id="bvlj5b3hu" data-path="src/pages/Salary/SalaryList.tsx">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell data-id="9h3o83bjn" data-path="src/pages/Salary/SalaryList.tsx">
                        <div className="flex items-center gap-1" data-id="ct5xk1yvn" data-path="src/pages/Salary/SalaryList.tsx">
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRecord(record)}
                        title="View Details" data-id="vpluiirjr" data-path="src/pages/Salary/SalaryList.tsx">

                            <Eye className="h-4 w-4" data-id="e4ubrgquc" data-path="src/pages/Salary/SalaryList.tsx" />
                          </Button>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRecord(record)}
                        title="Edit Record" data-id="5fkgsnh4i" data-path="src/pages/Salary/SalaryList.tsx">

                            <Edit className="h-4 w-4" data-id="07sr1vv8l" data-path="src/pages/Salary/SalaryList.tsx" />
                          </Button>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportToPDF(record)}
                        title="Export PDF" data-id="0a6fwom2k" data-path="src/pages/Salary/SalaryList.tsx">

                            <FileText className="h-4 w-4" data-id="mjv1nesdh" data-path="src/pages/Salary/SalaryList.tsx" />
                          </Button>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Record" data-id="5y92a8anz" data-path="src/pages/Salary/SalaryList.tsx">

                            <Trash2 className="h-4 w-4" data-id="uoz2muwx3" data-path="src/pages/Salary/SalaryList.tsx" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
              
              {salaryRecords.length === 0 &&
            <div className="text-center py-8 text-muted-foreground" data-id="b4djsgt0d" data-path="src/pages/Salary/SalaryList.tsx">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" data-id="881cnvoy9" data-path="src/pages/Salary/SalaryList.tsx" />
                  <p data-id="k3hty7fbm" data-path="src/pages/Salary/SalaryList.tsx">No salary records found.</p>
                  <Link to="/salary/new" className="text-primary hover:underline" data-id="41mnlo7z5" data-path="src/pages/Salary/SalaryList.tsx">
                    Create your first salary record
                  </Link>
                </div>
            }
            </div>
          }
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="flex justify-center gap-2" data-id="arcul1mww" data-path="src/pages/Salary/SalaryList.tsx">
          <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1} data-id="fhj37fow6" data-path="src/pages/Salary/SalaryList.tsx">

            Previous
          </Button>
          <span className="flex items-center px-4" data-id="gyc00fl8d" data-path="src/pages/Salary/SalaryList.tsx">
            Page {currentPage} of {totalPages}
          </span>
          <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages} data-id="raor6sfhf" data-path="src/pages/Salary/SalaryList.tsx">

            Next
          </Button>
        </div>
      }

      {/* View Record Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog} data-id="7xfyjjlri" data-path="src/pages/Salary/SalaryList.tsx">
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-id="gr15za3up" data-path="src/pages/Salary/SalaryList.tsx">
          <DialogHeader data-id="nn6hz49nu" data-path="src/pages/Salary/SalaryList.tsx">
            <DialogTitle data-id="iyi4pdxda" data-path="src/pages/Salary/SalaryList.tsx">Salary Record Details</DialogTitle>
            <DialogDescription data-id="7n73a656z" data-path="src/pages/Salary/SalaryList.tsx">
              Complete salary information for {selectedRecord ? getEmployeeName(selectedRecord.employee_id) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord &&
          <div className="space-y-6" data-id="8lzmfiupv" data-path="src/pages/Salary/SalaryList.tsx">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4" data-id="5jeaaqqe9" data-path="src/pages/Salary/SalaryList.tsx">
                <div data-id="8k5ovg2qr" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="l8fhas1n4" data-path="src/pages/Salary/SalaryList.tsx">Employee</label>
                  <p className="font-medium" data-id="9oocgfxat" data-path="src/pages/Salary/SalaryList.tsx">{getEmployeeName(selectedRecord.employee_id)} ({selectedRecord.employee_id})</p>
                </div>
                <div data-id="guu3yjq10" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="d92g11oju" data-path="src/pages/Salary/SalaryList.tsx">Station</label>
                  <p data-id="c94u8rb5b" data-path="src/pages/Salary/SalaryList.tsx">{selectedRecord.station}</p>
                </div>
                <div data-id="swfu72s76" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="dbbq73mjz" data-path="src/pages/Salary/SalaryList.tsx">Pay Period</label>
                  <p data-id="sygwvqrcl" data-path="src/pages/Salary/SalaryList.tsx">{format(new Date(selectedRecord.pay_period_start), 'MMM dd')} - {format(new Date(selectedRecord.pay_period_end), 'MMM dd, yyyy')}</p>
                </div>
                <div data-id="cygiebn2a" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="5oi5h377m" data-path="src/pages/Salary/SalaryList.tsx">Pay Date</label>
                  <p data-id="uacu4rwnk" data-path="src/pages/Salary/SalaryList.tsx">{format(new Date(selectedRecord.pay_date), 'MMM dd, yyyy')}</p>
                </div>
                <div data-id="98dk6ymms" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="za0i3liiw" data-path="src/pages/Salary/SalaryList.tsx">Pay Frequency</label>
                  <p data-id="sah810gz7" data-path="src/pages/Salary/SalaryList.tsx">{selectedRecord.pay_frequency}</p>
                </div>
                <div data-id="jzlhsxpda" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="gkh3q2pbc" data-path="src/pages/Salary/SalaryList.tsx">Status</label>
                  <Badge variant={getStatusBadgeVariant(selectedRecord.status)} data-id="1sf2r7rfd" data-path="src/pages/Salary/SalaryList.tsx">
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>

              {/* Earnings */}
              <div data-id="mjqm4190b" data-path="src/pages/Salary/SalaryList.tsx">
                <h3 className="text-lg font-semibold mb-3" data-id="5gq92m5um" data-path="src/pages/Salary/SalaryList.tsx">Earnings</h3>
                <div className="grid grid-cols-3 gap-4" data-id="0c0x2y4z5" data-path="src/pages/Salary/SalaryList.tsx">
                  <div data-id="5poyvldpr" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="rpxxpi9vg" data-path="src/pages/Salary/SalaryList.tsx">Base Salary</label>
                    <p className="font-medium" data-id="fhii8j4e1" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.base_salary?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="arghc7igi" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="iioi1575c" data-path="src/pages/Salary/SalaryList.tsx">Hourly Rate</label>
                    <p className="font-medium" data-id="gxd4o307x" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.hourly_rate?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div data-id="bnf60fury" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="m50pdbah0" data-path="src/pages/Salary/SalaryList.tsx">Regular Hours</label>
                    <p className="font-medium" data-id="wi2u638n6" data-path="src/pages/Salary/SalaryList.tsx">{selectedRecord.regular_hours || 0}</p>
                  </div>
                  <div data-id="dei2bcum1" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="keqn80qpi" data-path="src/pages/Salary/SalaryList.tsx">Overtime Hours</label>
                    <p className="font-medium" data-id="9uyw6b54x" data-path="src/pages/Salary/SalaryList.tsx">{selectedRecord.overtime_hours || 0}</p>
                  </div>
                  <div data-id="w2x1te572" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="c8tkcou1k" data-path="src/pages/Salary/SalaryList.tsx">Overtime Pay</label>
                    <p className="font-medium" data-id="dapbbieyu" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.overtime_pay?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="efxtaopd0" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="mnc2pvdby" data-path="src/pages/Salary/SalaryList.tsx">Bonus</label>
                    <p className="font-medium" data-id="1tdobr45r" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.bonus_amount?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="5eivnfjws" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="u413r7iwj" data-path="src/pages/Salary/SalaryList.tsx">Commission</label>
                    <p className="font-medium" data-id="xbzk2ud3q" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.commission?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div className="col-span-3 border-t pt-2" data-id="8akuucz76" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="7glee0q1z" data-path="src/pages/Salary/SalaryList.tsx">Gross Pay</label>
                    <p className="text-xl font-bold text-green-600" data-id="33phwny1s" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.gross_pay?.toLocaleString() || '0.00'}</p>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div data-id="54u06k8kv" data-path="src/pages/Salary/SalaryList.tsx">
                <h3 className="text-lg font-semibold mb-3" data-id="eqbtgskn7" data-path="src/pages/Salary/SalaryList.tsx">Deductions</h3>
                <div className="grid grid-cols-3 gap-4" data-id="qs226g17s" data-path="src/pages/Salary/SalaryList.tsx">
                  <div data-id="3yr787pop" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="zd430kd0v" data-path="src/pages/Salary/SalaryList.tsx">Federal Tax</label>
                    <p className="font-medium" data-id="x7hbvlwpp" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.federal_tax?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="yzd1msa8s" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="j7h89xvf3" data-path="src/pages/Salary/SalaryList.tsx">State Tax</label>
                    <p className="font-medium" data-id="8k2ozc2sm" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.state_tax?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="4wr9hllpa" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="9bx3p13s3" data-path="src/pages/Salary/SalaryList.tsx">Social Security</label>
                    <p className="font-medium" data-id="krffizqsq" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.social_security?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="k4l9ffog3" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="b3m9zy5rx" data-path="src/pages/Salary/SalaryList.tsx">Medicare</label>
                    <p className="font-medium" data-id="hhfuma2hs" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.medicare?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="cjubr6ryp" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="tg1nw28r5" data-path="src/pages/Salary/SalaryList.tsx">Health Insurance</label>
                    <p className="font-medium" data-id="khkich616" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.health_insurance?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="guyn21xza" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="l0nepgdyw" data-path="src/pages/Salary/SalaryList.tsx">401(k)</label>
                    <p className="font-medium" data-id="rekxqmmcl" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.retirement_401k?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div data-id="m8x1a4yu6" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="eewv5lbcp" data-path="src/pages/Salary/SalaryList.tsx">Other Deductions</label>
                    <p className="font-medium" data-id="ddbihmtm4" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.other_deductions?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div className="col-span-3 border-t pt-2" data-id="fmcwaruq1" data-path="src/pages/Salary/SalaryList.tsx">
                    <label className="text-sm font-medium text-muted-foreground" data-id="u9964cbpq" data-path="src/pages/Salary/SalaryList.tsx">Total Deductions</label>
                    <p className="text-xl font-bold text-red-600" data-id="ucejoofws" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.total_deductions?.toLocaleString() || '0.00'}</p>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="border-t pt-4" data-id="5qbbt2c1o" data-path="src/pages/Salary/SalaryList.tsx">
                <label className="text-sm font-medium text-muted-foreground" data-id="d7e6mgysr" data-path="src/pages/Salary/SalaryList.tsx">Net Pay</label>
                <p className="text-3xl font-bold text-green-600" data-id="n4gtsz2vn" data-path="src/pages/Salary/SalaryList.tsx">${selectedRecord.net_pay?.toLocaleString() || '0.00'}</p>
              </div>

              {/* Notes */}
              {selectedRecord.notes &&
            <div data-id="emvd20wv6" data-path="src/pages/Salary/SalaryList.tsx">
                  <label className="text-sm font-medium text-muted-foreground" data-id="46bupcz2s" data-path="src/pages/Salary/SalaryList.tsx">Notes</label>
                  <p className="mt-1 p-3 bg-muted rounded-md" data-id="un8wkz2j5" data-path="src/pages/Salary/SalaryList.tsx">{selectedRecord.notes}</p>
                </div>
            }

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t" data-id="qt7rkurkm" data-path="src/pages/Salary/SalaryList.tsx">
                <Button
                variant="outline"
                onClick={() => exportToPDF(selectedRecord)} data-id="1qsl2kp7y" data-path="src/pages/Salary/SalaryList.tsx">

                  <Download className="h-4 w-4 mr-2" data-id="9mi0a5ft5" data-path="src/pages/Salary/SalaryList.tsx" />
                  Export PDF
                </Button>
                <Button
                onClick={() => {
                  setShowViewDialog(false);
                  handleEditRecord(selectedRecord);
                }} data-id="a4634mvs6" data-path="src/pages/Salary/SalaryList.tsx">

                  <Edit className="h-4 w-4 mr-2" data-id="3fo3zrgx5" data-path="src/pages/Salary/SalaryList.tsx" />
                  Edit Record
                </Button>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

};

export default SalaryList;