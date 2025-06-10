import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Shield, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock, Calendar as CalendarIcon, Database, User, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  userId: number;
  userName: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  resourceAccessed: string;
  actionPerformed: string;
  eventStatus: 'Success' | 'Failed' | 'Blocked' | 'Suspicious';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  sessionId: string;
  geoLocation: string;
  station: string;
  additionalData: any;
  failureReason?: string;
  dataChanges?: {
    before: any;
    after: any;
    fieldsChanged: string[];
  };
}

interface AuditMetrics {
  totalEvents: number;
  eventsToday: number;
  successRate: number;
  highRiskEvents: number;
  failedLogins: number;
  suspiciousActivity: number;
  averageSessionDuration: number;
  mostActiveUser: string;
}

interface AuditFilter {
  dateRange: {from: Date | null;to: Date | null;};
  eventType: string;
  riskLevel: string;
  status: string;
  user: string;
  station: string;
  searchTerm: string;
}

const EnhancedAuditTrail: React.FC = () => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [metrics, setMetrics] = useState<AuditMetrics>({
    totalEvents: 0,
    eventsToday: 0,
    successRate: 0,
    highRiskEvents: 0,
    failedLogins: 0,
    suspiciousActivity: 0,
    averageSessionDuration: 0,
    mostActiveUser: ''
  });
  const [filters, setFilters] = useState<AuditFilter>({
    dateRange: { from: null, to: null },
    eventType: 'all',
    riskLevel: 'all',
    status: 'all',
    user: 'all',
    station: 'all',
    searchTerm: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const { toast } = useToast();

  // Initialize with sample audit data
  useEffect(() => {
    generateSampleAuditData();
  }, []);

  // Real-time audit logging simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      generateRandomAuditEvent();
      updateMetrics();
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, auditEvents]);

  const generateSampleAuditData = () => {
    const sampleEvents: AuditEvent[] = [
    {
      id: 'audit_1',
      timestamp: new Date(Date.now() - 300000),
      eventType: 'Login',
      userId: 1,
      userName: 'john.doe@gasstation.com',
      userRole: 'Administrator',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resourceAccessed: '/admin/dashboard',
      actionPerformed: 'login',
      eventStatus: 'Success',
      riskLevel: 'Low',
      sessionId: `sess_${  Math.random().toString(36).substr(2, 9)}`,
      geoLocation: 'New York, NY, USA',
      station: 'MOBIL',
      additionalData: { loginMethod: 'password', rememberMe: true }
    },
    {
      id: 'audit_2',
      timestamp: new Date(Date.now() - 240000),
      eventType: 'Data Modification',
      userId: 2,
      userName: 'sarah.manager@gasstation.com',
      userRole: 'Management',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resourceAccessed: 'products',
      actionPerformed: 'update',
      eventStatus: 'Success',
      riskLevel: 'Medium',
      sessionId: `sess_${  Math.random().toString(36).substr(2, 9)}`,
      geoLocation: 'Brooklyn, NY, USA',
      station: 'AMOCO BROOKLYN',
      additionalData: { recordId: 123 },
      dataChanges: {
        before: { price: 9.99, quantity: 50 },
        after: { price: 10.99, quantity: 45 },
        fieldsChanged: ['price', 'quantity']
      }
    },
    {
      id: 'audit_3',
      timestamp: new Date(Date.now() - 180000),
      eventType: 'Failed Login',
      userId: 0,
      userName: 'unknown@attacker.com',
      userRole: 'Unknown',
      ipAddress: '45.123.45.67',
      userAgent: 'curl/7.68.0',
      resourceAccessed: '/login',
      actionPerformed: 'login_attempt',
      eventStatus: 'Failed',
      riskLevel: 'High',
      sessionId: '',
      geoLocation: 'Unknown Location',
      station: '',
      additionalData: { attempts: 5, blocked: true },
      failureReason: 'Invalid credentials - multiple attempts detected'
    },
    {
      id: 'audit_4',
      timestamp: new Date(Date.now() - 120000),
      eventType: 'Permission Change',
      userId: 1,
      userName: 'john.doe@gasstation.com',
      userRole: 'Administrator',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resourceAccessed: 'user_management',
      actionPerformed: 'permission_update',
      eventStatus: 'Success',
      riskLevel: 'Critical',
      sessionId: `sess_${  Math.random().toString(36).substr(2, 9)}`,
      geoLocation: 'New York, NY, USA',
      station: 'ALL',
      additionalData: {
        targetUserId: 3,
        permissionChanges: ['added_admin_access', 'removed_station_restriction']
      }
    }];


    setAuditEvents(sampleEvents);
  };

  const generateRandomAuditEvent = useCallback(() => {
    const eventTypes = ['Login', 'Logout', 'Data Access', 'Data Modification', 'Failed Login', 'Permission Change', 'Admin Action'];
    const users = [
    { id: 1, name: 'john.doe@gasstation.com', role: 'Administrator' },
    { id: 2, name: 'sarah.manager@gasstation.com', role: 'Management' },
    { id: 3, name: 'mike.employee@gasstation.com', role: 'Employee' }];

    const stations = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN', 'ALL'];
    const resources = ['products', 'employees', 'sales_reports', 'licenses', 'orders', 'vendors'];
    const statuses: ('Success' | 'Failed' | 'Blocked' | 'Suspicious')[] = ['Success', 'Failed', 'Blocked', 'Suspicious'];
    const riskLevels: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];

    const shouldGenerate = Math.random() < 0.4; // 40% chance
    if (!shouldGenerate) return;

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const isFailedAttempt = Math.random() < 0.1; // 10% chance of failure

    const newEvent: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      eventType,
      userId: isFailedAttempt ? 0 : user.id,
      userName: isFailedAttempt ? 'suspicious@attacker.com' : user.name,
      userRole: isFailedAttempt ? 'Unknown' : user.role,
      ipAddress: isFailedAttempt ? `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : `192.168.1.${  100 + Math.floor(Math.random() * 10)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resourceAccessed: resources[Math.floor(Math.random() * resources.length)],
      actionPerformed: isFailedAttempt ? 'unauthorized_access_attempt' : ['view', 'create', 'update', 'delete'][Math.floor(Math.random() * 4)],
      eventStatus: isFailedAttempt ? statuses[Math.floor(Math.random() * 3) + 1] : 'Success',
      riskLevel: isFailedAttempt ? Math.random() < 0.5 ? 'High' : 'Critical' : riskLevels[Math.floor(Math.random() * 2)],
      sessionId: isFailedAttempt ? '' : `sess_${  Math.random().toString(36).substr(2, 9)}`,
      geoLocation: isFailedAttempt ? 'Unknown Location' : 'New York, NY, USA',
      station: stations[Math.floor(Math.random() * stations.length)],
      additionalData: {
        timestamp: new Date().toISOString(),
        suspicious: isFailedAttempt
      },
      failureReason: isFailedAttempt ? 'Unauthorized access attempt detected' : undefined
    };

    setAuditEvents((prev) => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
  }, []);

  const updateMetrics = useCallback(() => {
    const today = new Date().toDateString();
    const eventsToday = auditEvents.filter((e) => e.timestamp.toDateString() === today).length;
    const successfulEvents = auditEvents.filter((e) => e.eventStatus === 'Success').length;
    const highRiskEvents = auditEvents.filter((e) => e.riskLevel === 'High' || e.riskLevel === 'Critical').length;
    const failedLogins = auditEvents.filter((e) => e.eventType === 'Failed Login').length;
    const suspiciousActivity = auditEvents.filter((e) => e.eventStatus === 'Suspicious' || e.eventStatus === 'Blocked').length;

    // Calculate most active user
    const userActivity = auditEvents.reduce((acc, event) => {
      acc[event.userName] = (acc[event.userName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveUser = Object.entries(userActivity).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    setMetrics({
      totalEvents: auditEvents.length,
      eventsToday,
      successRate: auditEvents.length > 0 ? successfulEvents / auditEvents.length * 100 : 0,
      highRiskEvents,
      failedLogins,
      suspiciousActivity,
      averageSessionDuration: Math.random() * 120 + 30, // Simulated 30-150 minutes
      mostActiveUser
    });
  }, [auditEvents]);

  const getFilteredEvents = (): AuditEvent[] => {
    return auditEvents.filter((event) => {
      // Date range filter
      if (filters.dateRange.from && event.timestamp < filters.dateRange.from) return false;
      if (filters.dateRange.to && event.timestamp > filters.dateRange.to) return false;

      // Other filters
      if (filters.eventType !== 'all' && event.eventType !== filters.eventType) return false;
      if (filters.riskLevel !== 'all' && event.riskLevel !== filters.riskLevel) return false;
      if (filters.status !== 'all' && event.eventStatus !== filters.status) return false;
      if (filters.station !== 'all' && event.station !== filters.station) return false;
      if (filters.user !== 'all' && !event.userName.includes(filters.user)) return false;

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          event.userName.toLowerCase().includes(searchLower) ||
          event.resourceAccessed.toLowerCase().includes(searchLower) ||
          event.actionPerformed.toLowerCase().includes(searchLower) ||
          event.ipAddress.includes(searchLower));

      }

      return true;
    });
  };

  const exportAuditData = () => {
    const filteredEvents = getFilteredEvents();

    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(filteredEvents, null, 2);
      downloadFile(dataStr, 'audit-trail.json', 'application/json');
    } else if (exportFormat === 'csv') {
      const csvHeaders = 'Timestamp,Event Type,User,IP Address,Resource,Action,Status,Risk Level,Station,Details\n';
      const csvData = filteredEvents.map((event) =>
      `${event.timestamp.toISOString()},${event.eventType},${event.userName},${event.ipAddress},${event.resourceAccessed},${event.actionPerformed},${event.eventStatus},${event.riskLevel},${event.station},"${JSON.stringify(event.additionalData).replace(/"/g, '""')}"`
      ).join('\n');
      downloadFile(csvHeaders + csvData, 'audit-trail.csv', 'text/csv');
    }

    toast({
      title: "Export Complete",
      description: `Audit data exported as ${exportFormat.toUpperCase()}`
    });
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':return 'bg-green-500 text-white';
      case 'Medium':return 'bg-yellow-500 text-white';
      case 'High':return 'bg-orange-500 text-white';
      case 'Critical':return 'bg-red-500 text-white';
      default:return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':return <CheckCircle className="h-4 w-4 text-green-500" data-id="vn0n9juqh" data-path="src/components/EnhancedAuditTrail.tsx" />;
      case 'Failed':return <AlertTriangle className="h-4 w-4 text-red-500" data-id="hcqjxe161" data-path="src/components/EnhancedAuditTrail.tsx" />;
      case 'Blocked':return <Shield className="h-4 w-4 text-orange-500" data-id="xlpcjtlm2" data-path="src/components/EnhancedAuditTrail.tsx" />;
      case 'Suspicious':return <AlertTriangle className="h-4 w-4 text-yellow-500" data-id="aujznkym3" data-path="src/components/EnhancedAuditTrail.tsx" />;
      default:return <Clock className="h-4 w-4 text-gray-500" data-id="wl2qz0c8g" data-path="src/components/EnhancedAuditTrail.tsx" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      eventType: 'all',
      riskLevel: 'all',
      status: 'all',
      user: 'all',
      station: 'all',
      searchTerm: ''
    });
  };

  return (
    <div className="space-y-6" data-id="2yq6k0hnu" data-path="src/components/EnhancedAuditTrail.tsx">
      {/* Header Stats */}
      <Card data-id="4ybbesiuu" data-path="src/components/EnhancedAuditTrail.tsx">
        <CardHeader data-id="5t433as9c" data-path="src/components/EnhancedAuditTrail.tsx">
          <div className="flex items-center justify-between" data-id="d2kopwzb6" data-path="src/components/EnhancedAuditTrail.tsx">
            <CardTitle className="flex items-center gap-2" data-id="emjhvton5" data-path="src/components/EnhancedAuditTrail.tsx">
              <Shield className="h-5 w-5" data-id="ar5qtdy46" data-path="src/components/EnhancedAuditTrail.tsx" />
              Enhanced Audit Trail
            </CardTitle>
            <div className="flex items-center gap-2" data-id="gxfs3sgu9" data-path="src/components/EnhancedAuditTrail.tsx">
              <Badge variant={isRealTimeEnabled ? "default" : "secondary"} data-id="59bly9fzs" data-path="src/components/EnhancedAuditTrail.tsx">
                {isRealTimeEnabled ? "Real-time" : "Paused"}
              </Badge>
              <Button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                variant={isRealTimeEnabled ? "destructive" : "default"}
                size="sm" data-id="25ykf5m7x" data-path="src/components/EnhancedAuditTrail.tsx">

                {isRealTimeEnabled ? "Pause" : "Start"} Logging
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="j18i5xfzu" data-path="src/components/EnhancedAuditTrail.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-id="76sd8285l" data-path="src/components/EnhancedAuditTrail.tsx">
            <div className="text-center" data-id="4g97zgwoy" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="mp379tquh" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.totalEvents}</div>
              <div className="text-sm text-gray-600" data-id="67oz3e764" data-path="src/components/EnhancedAuditTrail.tsx">Total Events</div>
            </div>
            <div className="text-center" data-id="rdn0ssg6f" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="n9ig9woj6" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.eventsToday}</div>
              <div className="text-sm text-gray-600" data-id="dt4vhc3xx" data-path="src/components/EnhancedAuditTrail.tsx">Today</div>
            </div>
            <div className="text-center" data-id="ar04swqm8" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="a6e1fxesk" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.successRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600" data-id="92a26o8gk" data-path="src/components/EnhancedAuditTrail.tsx">Success Rate</div>
            </div>
            <div className="text-center" data-id="w9a09avle" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-red-600" data-id="edciz366d" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.highRiskEvents}</div>
              <div className="text-sm text-gray-600" data-id="7y6t2sf4o" data-path="src/components/EnhancedAuditTrail.tsx">High Risk</div>
            </div>
            <div className="text-center" data-id="tqtc5fkeq" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-orange-600" data-id="twebnfqxo" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.failedLogins}</div>
              <div className="text-sm text-gray-600" data-id="p64jgaas3" data-path="src/components/EnhancedAuditTrail.tsx">Failed Logins</div>
            </div>
            <div className="text-center" data-id="1fwtd54fl" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-yellow-600" data-id="wrqp4ity5" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.suspiciousActivity}</div>
              <div className="text-sm text-gray-600" data-id="mgo1y8ax3" data-path="src/components/EnhancedAuditTrail.tsx">Suspicious</div>
            </div>
            <div className="text-center" data-id="c4msnxc2m" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-2xl font-bold text-indigo-600" data-id="davgwgyqa" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.averageSessionDuration.toFixed(0)}m</div>
              <div className="text-sm text-gray-600" data-id="jypu2o3eu" data-path="src/components/EnhancedAuditTrail.tsx">Avg Session</div>
            </div>
            <div className="text-center" data-id="1oeu9wz59" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="text-lg font-bold text-teal-600 truncate" data-id="po85t0zwl" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.mostActiveUser.split('@')[0]}</div>
              <div className="text-sm text-gray-600" data-id="xiyiplfri" data-path="src/components/EnhancedAuditTrail.tsx">Most Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="w-full" data-id="1e58rggc5" data-path="src/components/EnhancedAuditTrail.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="xhn3bsyaw" data-path="src/components/EnhancedAuditTrail.tsx">
          <TabsTrigger value="events" data-id="r1d6tta46" data-path="src/components/EnhancedAuditTrail.tsx">Audit Events ({getFilteredEvents().length})</TabsTrigger>
          <TabsTrigger value="analytics" data-id="sfco1gxsr" data-path="src/components/EnhancedAuditTrail.tsx">Security Analytics</TabsTrigger>
          <TabsTrigger value="compliance" data-id="6re8to00w" data-path="src/components/EnhancedAuditTrail.tsx">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4" data-id="qihfuokax" data-path="src/components/EnhancedAuditTrail.tsx">
          {/* Filters */}
          <Card data-id="ygf71zknn" data-path="src/components/EnhancedAuditTrail.tsx">
            <CardContent className="pt-4" data-id="th5dxtz29" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4" data-id="4gh2lv0xp" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="space-y-2" data-id="lpw1dk4yr" data-path="src/components/EnhancedAuditTrail.tsx">
                  <label className="text-sm font-medium" data-id="kggyc4bxl" data-path="src/components/EnhancedAuditTrail.tsx">Search</label>
                  <div className="relative" data-id="vt56gz3vm" data-path="src/components/EnhancedAuditTrail.tsx">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" data-id="mncrlaalg" data-path="src/components/EnhancedAuditTrail.tsx" />
                    <Input
                      placeholder="Search events..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                      className="pl-8" data-id="dj6oyla6o" data-path="src/components/EnhancedAuditTrail.tsx" />

                  </div>
                </div>

                <div className="space-y-2" data-id="tshtb6zdy" data-path="src/components/EnhancedAuditTrail.tsx">
                  <label className="text-sm font-medium" data-id="r0lv6fa0r" data-path="src/components/EnhancedAuditTrail.tsx">Event Type</label>
                  <Select value={filters.eventType} onValueChange={(value) => setFilters((prev) => ({ ...prev, eventType: value }))} data-id="rreif90ab" data-path="src/components/EnhancedAuditTrail.tsx">
                    <SelectTrigger data-id="flv5ktxjv" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectValue data-id="w0kdlf2f5" data-path="src/components/EnhancedAuditTrail.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="e33ufnka4" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectItem value="all" data-id="0ofpme5dr" data-path="src/components/EnhancedAuditTrail.tsx">All Types</SelectItem>
                      <SelectItem value="Login" data-id="euiex1r4f" data-path="src/components/EnhancedAuditTrail.tsx">Login</SelectItem>
                      <SelectItem value="Logout" data-id="i489kgb45" data-path="src/components/EnhancedAuditTrail.tsx">Logout</SelectItem>
                      <SelectItem value="Data Modification" data-id="0nuvnqol8" data-path="src/components/EnhancedAuditTrail.tsx">Data Modification</SelectItem>
                      <SelectItem value="Failed Login" data-id="2s0wxf9d5" data-path="src/components/EnhancedAuditTrail.tsx">Failed Login</SelectItem>
                      <SelectItem value="Permission Change" data-id="1hchegvbg" data-path="src/components/EnhancedAuditTrail.tsx">Permission Change</SelectItem>
                      <SelectItem value="Admin Action" data-id="obf5637pz" data-path="src/components/EnhancedAuditTrail.tsx">Admin Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2" data-id="jtt40zv6i" data-path="src/components/EnhancedAuditTrail.tsx">
                  <label className="text-sm font-medium" data-id="qanq2uw9q" data-path="src/components/EnhancedAuditTrail.tsx">Risk Level</label>
                  <Select value={filters.riskLevel} onValueChange={(value) => setFilters((prev) => ({ ...prev, riskLevel: value }))} data-id="4y5lty2yo" data-path="src/components/EnhancedAuditTrail.tsx">
                    <SelectTrigger data-id="68bfmso4v" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectValue data-id="ww08vk2um" data-path="src/components/EnhancedAuditTrail.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="m0650at9n" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectItem value="all" data-id="o6g4xkreu" data-path="src/components/EnhancedAuditTrail.tsx">All Levels</SelectItem>
                      <SelectItem value="Low" data-id="wo5b6lb08" data-path="src/components/EnhancedAuditTrail.tsx">Low</SelectItem>
                      <SelectItem value="Medium" data-id="w7715qoxz" data-path="src/components/EnhancedAuditTrail.tsx">Medium</SelectItem>
                      <SelectItem value="High" data-id="3hw014o29" data-path="src/components/EnhancedAuditTrail.tsx">High</SelectItem>
                      <SelectItem value="Critical" data-id="86mv8bwaf" data-path="src/components/EnhancedAuditTrail.tsx">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2" data-id="lbc8dtvj2" data-path="src/components/EnhancedAuditTrail.tsx">
                  <label className="text-sm font-medium" data-id="a6ol64yos" data-path="src/components/EnhancedAuditTrail.tsx">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))} data-id="tg4h84132" data-path="src/components/EnhancedAuditTrail.tsx">
                    <SelectTrigger data-id="39l3e18ho" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectValue data-id="s0dyl8una" data-path="src/components/EnhancedAuditTrail.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="rqaau8d3r" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectItem value="all" data-id="ys0fw606u" data-path="src/components/EnhancedAuditTrail.tsx">All Status</SelectItem>
                      <SelectItem value="Success" data-id="zc8w1bidl" data-path="src/components/EnhancedAuditTrail.tsx">Success</SelectItem>
                      <SelectItem value="Failed" data-id="l1gfik6fe" data-path="src/components/EnhancedAuditTrail.tsx">Failed</SelectItem>
                      <SelectItem value="Blocked" data-id="qwu1c402r" data-path="src/components/EnhancedAuditTrail.tsx">Blocked</SelectItem>
                      <SelectItem value="Suspicious" data-id="1sdyjpj78" data-path="src/components/EnhancedAuditTrail.tsx">Suspicious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2" data-id="1hs6yls8v" data-path="src/components/EnhancedAuditTrail.tsx">
                  <label className="text-sm font-medium" data-id="ac2nj6dfu" data-path="src/components/EnhancedAuditTrail.tsx">Station</label>
                  <Select value={filters.station} onValueChange={(value) => setFilters((prev) => ({ ...prev, station: value }))} data-id="plhy67wms" data-path="src/components/EnhancedAuditTrail.tsx">
                    <SelectTrigger data-id="axgpvlke8" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectValue data-id="kv5n2oi9f" data-path="src/components/EnhancedAuditTrail.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="oeddmqmb5" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectItem value="all" data-id="d910d742f" data-path="src/components/EnhancedAuditTrail.tsx">All Stations</SelectItem>
                      <SelectItem value="MOBIL" data-id="kedz5ikpk" data-path="src/components/EnhancedAuditTrail.tsx">MOBIL</SelectItem>
                      <SelectItem value="AMOCO ROSEDALE" data-id="f02e5r4m3" data-path="src/components/EnhancedAuditTrail.tsx">AMOCO ROSEDALE</SelectItem>
                      <SelectItem value="AMOCO BROOKLYN" data-id="7vn2rbpp3" data-path="src/components/EnhancedAuditTrail.tsx">AMOCO BROOKLYN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2" data-id="r16vnlmbw" data-path="src/components/EnhancedAuditTrail.tsx">
                  <Button variant="outline" onClick={clearFilters} size="sm" data-id="b2npo8mws" data-path="src/components/EnhancedAuditTrail.tsx">
                    <Filter className="h-4 w-4 mr-1" data-id="quh0yils8" data-path="src/components/EnhancedAuditTrail.tsx" />
                    Clear
                  </Button>
                  <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)} data-id="5qasiuey1" data-path="src/components/EnhancedAuditTrail.tsx">
                    <SelectTrigger className="w-20" data-id="qfxqwnbky" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectValue data-id="65z9tn6ru" data-path="src/components/EnhancedAuditTrail.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="2brrctu7u" data-path="src/components/EnhancedAuditTrail.tsx">
                      <SelectItem value="csv" data-id="jn130vfur" data-path="src/components/EnhancedAuditTrail.tsx">CSV</SelectItem>
                      <SelectItem value="json" data-id="d6kr99dje" data-path="src/components/EnhancedAuditTrail.tsx">JSON</SelectItem>
                      <SelectItem value="pdf" data-id="5kueda0v5" data-path="src/components/EnhancedAuditTrail.tsx">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={exportAuditData} size="sm" data-id="9mfu900nr" data-path="src/components/EnhancedAuditTrail.tsx">
                    <Download className="h-4 w-4 mr-1" data-id="sw8rafdcx" data-path="src/components/EnhancedAuditTrail.tsx" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <ScrollArea className="h-96" data-id="bc7ixdang" data-path="src/components/EnhancedAuditTrail.tsx">
            <div className="space-y-2" data-id="nd54oq435" data-path="src/components/EnhancedAuditTrail.tsx">
              <AnimatePresence data-id="m760nddco" data-path="src/components/EnhancedAuditTrail.tsx">
                {getFilteredEvents().map((event, index) =>
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }} data-id="louw4n0r7" data-path="src/components/EnhancedAuditTrail.tsx">

                    <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)} data-id="328yd8sc4" data-path="src/components/EnhancedAuditTrail.tsx">
                      <CardContent className="pt-4" data-id="0a58qofju" data-path="src/components/EnhancedAuditTrail.tsx">
                        <div className="flex items-center justify-between mb-2" data-id="qscejiz4b" data-path="src/components/EnhancedAuditTrail.tsx">
                          <div className="flex items-center gap-3" data-id="q0bq99tjk" data-path="src/components/EnhancedAuditTrail.tsx">
                            {getStatusIcon(event.eventStatus)}
                            <div data-id="gbnxan0t9" data-path="src/components/EnhancedAuditTrail.tsx">
                              <p className="font-medium text-sm" data-id="js1wof2ln" data-path="src/components/EnhancedAuditTrail.tsx">{event.eventType}</p>
                              <p className="text-xs text-gray-600" data-id="4a5ubngyg" data-path="src/components/EnhancedAuditTrail.tsx">
                                {event.userName} • {event.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" data-id="x6l7uyen3" data-path="src/components/EnhancedAuditTrail.tsx">
                            <Badge className={getRiskLevelColor(event.riskLevel)} data-id="hm6ziy4oq" data-path="src/components/EnhancedAuditTrail.tsx">
                              {event.riskLevel}
                            </Badge>
                            <Badge variant="outline" data-id="muo0k1ecl" data-path="src/components/EnhancedAuditTrail.tsx">
                              {event.station || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" data-id="7mbwzac30" data-path="src/components/EnhancedAuditTrail.tsx">
                          <div data-id="0607hug5d" data-path="src/components/EnhancedAuditTrail.tsx">
                            <span className="font-medium" data-id="i3b5kxtk1" data-path="src/components/EnhancedAuditTrail.tsx">Resource:</span>
                            <span className="ml-1" data-id="b7uh9wsq9" data-path="src/components/EnhancedAuditTrail.tsx">{event.resourceAccessed}</span>
                          </div>
                          <div data-id="0vxmfp0kx" data-path="src/components/EnhancedAuditTrail.tsx">
                            <span className="font-medium" data-id="u2y5wdpoe" data-path="src/components/EnhancedAuditTrail.tsx">Action:</span>
                            <span className="ml-1" data-id="23ke8awfe" data-path="src/components/EnhancedAuditTrail.tsx">{event.actionPerformed}</span>
                          </div>
                          <div data-id="aoxulglom" data-path="src/components/EnhancedAuditTrail.tsx">
                            <span className="font-medium" data-id="mcu0tjjag" data-path="src/components/EnhancedAuditTrail.tsx">IP:</span>
                            <span className="ml-1" data-id="8l22qunlg" data-path="src/components/EnhancedAuditTrail.tsx">{event.ipAddress}</span>
                          </div>
                          <div data-id="earvm5fz7" data-path="src/components/EnhancedAuditTrail.tsx">
                            <span className="font-medium" data-id="uju0k5e8d" data-path="src/components/EnhancedAuditTrail.tsx">Location:</span>
                            <span className="ml-1" data-id="43sjrcljd" data-path="src/components/EnhancedAuditTrail.tsx">{event.geoLocation}</span>
                          </div>
                        </div>

                        {event.failureReason &&
                      <Alert className="mt-2" data-id="3e3en39d5" data-path="src/components/EnhancedAuditTrail.tsx">
                            <AlertTriangle className="h-4 w-4" data-id="couzhasdi" data-path="src/components/EnhancedAuditTrail.tsx" />
                            <AlertDescription className="text-xs" data-id="1hm8mqbvi" data-path="src/components/EnhancedAuditTrail.tsx">
                              {event.failureReason}
                            </AlertDescription>
                          </Alert>
                      }
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-id="1jeb8vtpg" data-path="src/components/EnhancedAuditTrail.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="rg8r3fy96" data-path="src/components/EnhancedAuditTrail.tsx">
            <Card data-id="k91dxco89" data-path="src/components/EnhancedAuditTrail.tsx">
              <CardHeader data-id="78o7b2axr" data-path="src/components/EnhancedAuditTrail.tsx">
                <CardTitle className="flex items-center gap-2" data-id="lu1ompjsz" data-path="src/components/EnhancedAuditTrail.tsx">
                  <Activity className="h-5 w-5" data-id="iua7av84e" data-path="src/components/EnhancedAuditTrail.tsx" />
                  Security Metrics
                </CardTitle>
              </CardHeader>
              <CardContent data-id="b0fjqlqo8" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="space-y-4" data-id="1q1cu6n60" data-path="src/components/EnhancedAuditTrail.tsx">
                  <div data-id="fu916w8vi" data-path="src/components/EnhancedAuditTrail.tsx">
                    <div className="flex justify-between mb-2" data-id="123x01fjh" data-path="src/components/EnhancedAuditTrail.tsx">
                      <span data-id="d7v7mdtte" data-path="src/components/EnhancedAuditTrail.tsx">Authentication Success Rate</span>
                      <span data-id="0f7rwtck7" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.successRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.successRate} className="h-3" data-id="p5vebn8ft" data-path="src/components/EnhancedAuditTrail.tsx" />
                  </div>
                  <div data-id="u45b7kmri" data-path="src/components/EnhancedAuditTrail.tsx">
                    <div className="flex justify-between mb-2" data-id="dqyxwzv99" data-path="src/components/EnhancedAuditTrail.tsx">
                      <span data-id="nvfww7572" data-path="src/components/EnhancedAuditTrail.tsx">Risk Level Distribution</span>
                      <span data-id="kgobhmdat" data-path="src/components/EnhancedAuditTrail.tsx">{(metrics.highRiskEvents / metrics.totalEvents * 100).toFixed(1)}% High/Critical</span>
                    </div>
                    <Progress value={metrics.highRiskEvents / metrics.totalEvents * 100} className="h-3" data-id="x9vtqwp8u" data-path="src/components/EnhancedAuditTrail.tsx" />
                  </div>
                  <div data-id="9ff0zg0n4" data-path="src/components/EnhancedAuditTrail.tsx">
                    <div className="flex justify-between mb-2" data-id="5bucbw26i" data-path="src/components/EnhancedAuditTrail.tsx">
                      <span data-id="nd03o2be0" data-path="src/components/EnhancedAuditTrail.tsx">Security Incident Rate</span>
                      <span data-id="my39quypp" data-path="src/components/EnhancedAuditTrail.tsx">{(metrics.suspiciousActivity / metrics.totalEvents * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.suspiciousActivity / metrics.totalEvents * 100} className="h-3" data-id="4zvl5u8eb" data-path="src/components/EnhancedAuditTrail.tsx" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="18rdc0udc" data-path="src/components/EnhancedAuditTrail.tsx">
              <CardHeader data-id="lzr99z2sf" data-path="src/components/EnhancedAuditTrail.tsx">
                <CardTitle className="flex items-center gap-2" data-id="3qg9fy692" data-path="src/components/EnhancedAuditTrail.tsx">
                  <User className="h-5 w-5" data-id="hzaw6b6ok" data-path="src/components/EnhancedAuditTrail.tsx" />
                  User Activity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent data-id="3puoye9q3" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="space-y-4" data-id="hah0pkyf6" data-path="src/components/EnhancedAuditTrail.tsx">
                  <div className="flex justify-between" data-id="d3wifxc5o" data-path="src/components/EnhancedAuditTrail.tsx">
                    <span data-id="errqrkhqj" data-path="src/components/EnhancedAuditTrail.tsx">Most Active User:</span>
                    <Badge variant="outline" data-id="iqx5af3wd" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.mostActiveUser}</Badge>
                  </div>
                  <div className="flex justify-between" data-id="1vr1t5vws" data-path="src/components/EnhancedAuditTrail.tsx">
                    <span data-id="zqnrftz6r" data-path="src/components/EnhancedAuditTrail.tsx">Average Session Duration:</span>
                    <Badge variant="outline" data-id="okqfo1jgi" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.averageSessionDuration.toFixed(0)} minutes</Badge>
                  </div>
                  <div className="flex justify-between" data-id="ni79rkqcu" data-path="src/components/EnhancedAuditTrail.tsx">
                    <span data-id="hg17pg2zf" data-path="src/components/EnhancedAuditTrail.tsx">Failed Login Attempts:</span>
                    <Badge variant="destructive" data-id="ndebzrb86" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.failedLogins}</Badge>
                  </div>
                  <div className="flex justify-between" data-id="n69wkzdid" data-path="src/components/EnhancedAuditTrail.tsx">
                    <span data-id="9ohb1ekik" data-path="src/components/EnhancedAuditTrail.tsx">Blocked Activities:</span>
                    <Badge variant="secondary" data-id="6c9e0k307" data-path="src/components/EnhancedAuditTrail.tsx">{metrics.suspiciousActivity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert data-id="oa9ti4mxb" data-path="src/components/EnhancedAuditTrail.tsx">
            <Shield className="h-4 w-4" data-id="8cdvfei88" data-path="src/components/EnhancedAuditTrail.tsx" />
            <AlertDescription data-id="2zegw7gfu" data-path="src/components/EnhancedAuditTrail.tsx">
              Security analytics help identify patterns and potential threats. Regular monitoring and analysis of audit trails 
              are essential for maintaining system security and compliance.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4" data-id="qnpgch8la" data-path="src/components/EnhancedAuditTrail.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="p2iygwt8i" data-path="src/components/EnhancedAuditTrail.tsx">
            <Card data-id="zx4j6q9r2" data-path="src/components/EnhancedAuditTrail.tsx">
              <CardHeader data-id="5pcjfy2u6" data-path="src/components/EnhancedAuditTrail.tsx">
                <CardTitle className="text-center" data-id="m0cag366y" data-path="src/components/EnhancedAuditTrail.tsx">SOX Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-center" data-id="q9fwl9kuh" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="text-3xl font-bold text-green-600 mb-2" data-id="aflkb3rat" data-path="src/components/EnhancedAuditTrail.tsx">98.5%</div>
                <p className="text-sm text-gray-600" data-id="sctp0hgds" data-path="src/components/EnhancedAuditTrail.tsx">Audit Trail Coverage</p>
                <Progress value={98.5} className="mt-2" data-id="7miqezcts" data-path="src/components/EnhancedAuditTrail.tsx" />
              </CardContent>
            </Card>

            <Card data-id="242pl7v4k" data-path="src/components/EnhancedAuditTrail.tsx">
              <CardHeader data-id="18n73hn2p" data-path="src/components/EnhancedAuditTrail.tsx">
                <CardTitle className="text-center" data-id="vcoc6r0cb" data-path="src/components/EnhancedAuditTrail.tsx">GDPR Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-center" data-id="ylf1acjnr" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="text-3xl font-bold text-blue-600 mb-2" data-id="8ucbchlfr" data-path="src/components/EnhancedAuditTrail.tsx">95.2%</div>
                <p className="text-sm text-gray-600" data-id="bwy74p2uk" data-path="src/components/EnhancedAuditTrail.tsx">Data Protection Score</p>
                <Progress value={95.2} className="mt-2" data-id="67vmayd0a" data-path="src/components/EnhancedAuditTrail.tsx" />
              </CardContent>
            </Card>

            <Card data-id="ek10m03vl" data-path="src/components/EnhancedAuditTrail.tsx">
              <CardHeader data-id="n8vh9poc1" data-path="src/components/EnhancedAuditTrail.tsx">
                <CardTitle className="text-center" data-id="2ld6u7tzi" data-path="src/components/EnhancedAuditTrail.tsx">PCI DSS</CardTitle>
              </CardHeader>
              <CardContent className="text-center" data-id="2po4huf1g" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="text-3xl font-bold text-purple-600 mb-2" data-id="fhyf9mb73" data-path="src/components/EnhancedAuditTrail.tsx">92.8%</div>
                <p className="text-sm text-gray-600" data-id="94u245nqw" data-path="src/components/EnhancedAuditTrail.tsx">Security Standards</p>
                <Progress value={92.8} className="mt-2" data-id="cqbm17zwo" data-path="src/components/EnhancedAuditTrail.tsx" />
              </CardContent>
            </Card>
          </div>

          <Card data-id="35spjtcgl" data-path="src/components/EnhancedAuditTrail.tsx">
            <CardHeader data-id="s715lrpvh" data-path="src/components/EnhancedAuditTrail.tsx">
              <CardTitle data-id="n859wyyve" data-path="src/components/EnhancedAuditTrail.tsx">Compliance Summary</CardTitle>
            </CardHeader>
            <CardContent data-id="u2ppz8ag0" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="space-y-4" data-id="dn5kqyswi" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="flex justify-between items-center" data-id="wcykpxnq3" data-path="src/components/EnhancedAuditTrail.tsx">
                  <span data-id="wzlq8mcpy" data-path="src/components/EnhancedAuditTrail.tsx">All administrative actions logged</span>
                  <CheckCircle className="h-5 w-5 text-green-500" data-id="vvjpdznq2" data-path="src/components/EnhancedAuditTrail.tsx" />
                </div>
                <div className="flex justify-between items-center" data-id="7y0hif9o5" data-path="src/components/EnhancedAuditTrail.tsx">
                  <span data-id="4tz73ommd" data-path="src/components/EnhancedAuditTrail.tsx">Failed access attempts monitored</span>
                  <CheckCircle className="h-5 w-5 text-green-500" data-id="mapmumhsv" data-path="src/components/EnhancedAuditTrail.tsx" />
                </div>
                <div className="flex justify-between items-center" data-id="35tux5np0" data-path="src/components/EnhancedAuditTrail.tsx">
                  <span data-id="hl05h093s" data-path="src/components/EnhancedAuditTrail.tsx">Data modifications tracked</span>
                  <CheckCircle className="h-5 w-5 text-green-500" data-id="j7561iqb1" data-path="src/components/EnhancedAuditTrail.tsx" />
                </div>
                <div className="flex justify-between items-center" data-id="rwzogp7gi" data-path="src/components/EnhancedAuditTrail.tsx">
                  <span data-id="k6ff6x1kw" data-path="src/components/EnhancedAuditTrail.tsx">User session management</span>
                  <CheckCircle className="h-5 w-5 text-green-500" data-id="6dob797x8" data-path="src/components/EnhancedAuditTrail.tsx" />
                </div>
                <div className="flex justify-between items-center" data-id="y74gfjrra" data-path="src/components/EnhancedAuditTrail.tsx">
                  <span data-id="i4m3tgnbn" data-path="src/components/EnhancedAuditTrail.tsx">Geographic access logging</span>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" data-id="nljsz6gu3" data-path="src/components/EnhancedAuditTrail.tsx" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)} data-id="5mod2j0bm" data-path="src/components/EnhancedAuditTrail.tsx">
        <DialogContent className="max-w-4xl" data-id="8srajwkw1" data-path="src/components/EnhancedAuditTrail.tsx">
          <DialogHeader data-id="i3645fi40" data-path="src/components/EnhancedAuditTrail.tsx">
            <DialogTitle data-id="dzyrfmkhs" data-path="src/components/EnhancedAuditTrail.tsx">Audit Event Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent &&
          <div className="space-y-4" data-id="0bt98r1ol" data-path="src/components/EnhancedAuditTrail.tsx">
              <div className="grid grid-cols-2 gap-4" data-id="xiqc0xgws" data-path="src/components/EnhancedAuditTrail.tsx">
                <div className="space-y-2" data-id="eaviwz75m" data-path="src/components/EnhancedAuditTrail.tsx">
                  <h4 className="font-medium" data-id="jt5og5cs5" data-path="src/components/EnhancedAuditTrail.tsx">Event Information</h4>
                  <div className="space-y-1 text-sm" data-id="1si39j34o" data-path="src/components/EnhancedAuditTrail.tsx">
                    <div data-id="cuxouvhal" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="5abqp00tf" data-path="src/components/EnhancedAuditTrail.tsx">Type:</span> {selectedEvent.eventType}</div>
                    <div data-id="5k4h3sz6j" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="w4yewgn8w" data-path="src/components/EnhancedAuditTrail.tsx">Timestamp:</span> {selectedEvent.timestamp.toLocaleString()}</div>
                    <div data-id="brgu3vn1j" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="xkr2qju4s" data-path="src/components/EnhancedAuditTrail.tsx">Status:</span> 
                      <Badge className={`ml-2 ${getRiskLevelColor(selectedEvent.riskLevel)}`} data-id="a0iacz0kh" data-path="src/components/EnhancedAuditTrail.tsx">
                        {selectedEvent.eventStatus}
                      </Badge>
                    </div>
                    <div data-id="c026jw8u5" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="gnxbluw6n" data-path="src/components/EnhancedAuditTrail.tsx">Risk Level:</span> 
                      <Badge className={`ml-2 ${getRiskLevelColor(selectedEvent.riskLevel)}`} data-id="3pxa7fg4q" data-path="src/components/EnhancedAuditTrail.tsx">
                        {selectedEvent.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2" data-id="wv05qh05b" data-path="src/components/EnhancedAuditTrail.tsx">
                  <h4 className="font-medium" data-id="3fvi209dc" data-path="src/components/EnhancedAuditTrail.tsx">User Information</h4>
                  <div className="space-y-1 text-sm" data-id="7iu28o9ig" data-path="src/components/EnhancedAuditTrail.tsx">
                    <div data-id="strhayw9c" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="ug7xeh1g3" data-path="src/components/EnhancedAuditTrail.tsx">User:</span> {selectedEvent.userName}</div>
                    <div data-id="h654fxeyk" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="5p71nc76a" data-path="src/components/EnhancedAuditTrail.tsx">Role:</span> {selectedEvent.userRole}</div>
                    <div data-id="qh4z0kac9" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="8wmgzzhmp" data-path="src/components/EnhancedAuditTrail.tsx">IP Address:</span> {selectedEvent.ipAddress}</div>
                    <div data-id="ezuy3zjdz" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="b0wc6g0tv" data-path="src/components/EnhancedAuditTrail.tsx">Location:</span> {selectedEvent.geoLocation}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2" data-id="1x9g9wxfb" data-path="src/components/EnhancedAuditTrail.tsx">
                <h4 className="font-medium" data-id="htob7apbo" data-path="src/components/EnhancedAuditTrail.tsx">Action Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm" data-id="dzrhz90j4" data-path="src/components/EnhancedAuditTrail.tsx">
                  <div data-id="i7288t02c" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="0ccm885pj" data-path="src/components/EnhancedAuditTrail.tsx">Resource:</span> {selectedEvent.resourceAccessed}</div>
                  <div data-id="x9saiw5dc" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="ogd33rq42" data-path="src/components/EnhancedAuditTrail.tsx">Action:</span> {selectedEvent.actionPerformed}</div>
                  <div data-id="0rvfsp1dq" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="pse2ogu6f" data-path="src/components/EnhancedAuditTrail.tsx">Station:</span> {selectedEvent.station}</div>
                  <div data-id="lzyp9t85a" data-path="src/components/EnhancedAuditTrail.tsx"><span className="font-medium" data-id="0yu0yc5ox" data-path="src/components/EnhancedAuditTrail.tsx">Session ID:</span> {selectedEvent.sessionId}</div>
                </div>
              </div>

              {selectedEvent.dataChanges &&
            <div className="space-y-2" data-id="x56jso4o6" data-path="src/components/EnhancedAuditTrail.tsx">
                  <h4 className="font-medium" data-id="umeqgpfcx" data-path="src/components/EnhancedAuditTrail.tsx">Data Changes</h4>
                  <div className="grid grid-cols-2 gap-4" data-id="vp5y1dst7" data-path="src/components/EnhancedAuditTrail.tsx">
                    <div data-id="iuupg44zv" data-path="src/components/EnhancedAuditTrail.tsx">
                      <p className="text-sm font-medium mb-1" data-id="fwytxuru4" data-path="src/components/EnhancedAuditTrail.tsx">Before:</p>
                      <code className="text-xs bg-red-50 p-2 rounded block" data-id="xcojho9ok" data-path="src/components/EnhancedAuditTrail.tsx">
                        {JSON.stringify(selectedEvent.dataChanges.before, null, 2)}
                      </code>
                    </div>
                    <div data-id="3d6d1bngw" data-path="src/components/EnhancedAuditTrail.tsx">
                      <p className="text-sm font-medium mb-1" data-id="rjv9abjbf" data-path="src/components/EnhancedAuditTrail.tsx">After:</p>
                      <code className="text-xs bg-green-50 p-2 rounded block" data-id="96bfr1ro2" data-path="src/components/EnhancedAuditTrail.tsx">
                        {JSON.stringify(selectedEvent.dataChanges.after, null, 2)}
                      </code>
                    </div>
                  </div>
                  <div data-id="2cf4wwug7" data-path="src/components/EnhancedAuditTrail.tsx">
                    <p className="text-sm font-medium" data-id="kaf814iwl" data-path="src/components/EnhancedAuditTrail.tsx">Fields Changed:</p>
                    <div className="flex gap-1 mt-1" data-id="8p66ipn6v" data-path="src/components/EnhancedAuditTrail.tsx">
                      {selectedEvent.dataChanges.fieldsChanged.map((field) =>
                  <Badge key={field} variant="outline" className="text-xs" data-id="akghpfv0c" data-path="src/components/EnhancedAuditTrail.tsx">
                          {field}
                        </Badge>
                  )}
                    </div>
                  </div>
                </div>
            }

              <div className="space-y-2" data-id="si85et533" data-path="src/components/EnhancedAuditTrail.tsx">
                <h4 className="font-medium" data-id="85l232uie" data-path="src/components/EnhancedAuditTrail.tsx">Additional Data</h4>
                <code className="text-xs bg-gray-100 p-3 rounded block" data-id="0ksosj9m7" data-path="src/components/EnhancedAuditTrail.tsx">
                  {JSON.stringify(selectedEvent.additionalData, null, 2)}
                </code>
              </div>

              {selectedEvent.failureReason &&
            <Alert className="border-red-200" data-id="a42j9mkwn" data-path="src/components/EnhancedAuditTrail.tsx">
                  <AlertTriangle className="h-4 w-4" data-id="anbrixve4" data-path="src/components/EnhancedAuditTrail.tsx" />
                  <AlertDescription data-id="7syaq0qvq" data-path="src/components/EnhancedAuditTrail.tsx">
                    <span className="font-medium" data-id="a5xhj4z5r" data-path="src/components/EnhancedAuditTrail.tsx">Failure Reason: </span>
                    {selectedEvent.failureReason}
                  </AlertDescription>
                </Alert>
            }
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

};

export default EnhancedAuditTrail;