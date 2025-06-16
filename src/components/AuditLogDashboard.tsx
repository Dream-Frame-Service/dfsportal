import React, { useState, useEffect } from 'react';
import DatabaseService from '@/services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, TrendingUp, RefreshCw, Clock, User, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLogEntry {
  id: number;
  event_type: string;
  username: string;
  ip_address: string;
  event_timestamp: string;
  event_status: string;
  resource_accessed: string;
  action_performed: string;
  failure_reason: string;
  risk_level: string;
  station: string;
}

interface AuditStats {
  totalEvents: number;
  failedAttempts: number;
  suspiciousActivity: number;
  securityScore: number;
}

const AuditLogDashboard: React.FC = () => {
  const [auditStats, setAuditStats] = useState<AuditStats>({
    totalEvents: 0,
    failedAttempts: 0,
    suspiciousActivity: 0,
    securityScore: 100
  });
  const [recentEvents, setRecentEvents] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      // Fetching real-time audit log data

      // Fetch recent audit logs (table ID: 12706)
      const { data: auditData, error: auditError } = await DatabaseService.tablePage(12706, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "event_timestamp",
        IsAsc: false,
        Filters: []
      });

      if (auditError) {
        console.error('Error fetching audit logs:', auditError);
        throw new Error(auditError);
      }

      const logs = auditData?.List || [];
      // Audit logs loaded: ${logs.length} entries

      // Calculate statistics from real data
      const totalEvents = logs.length;
      const failedAttempts = logs.filter((log: AuditLogEntry) =>
      log.event_status === 'Failed' || log.event_status === 'Blocked'
      ).length;
      const suspiciousActivity = logs.filter((log: AuditLogEntry) =>
      log.risk_level === 'High' || log.risk_level === 'Critical'
      ).length;

      // Calculate security score based on success rate
      const successfulEvents = logs.filter((log: AuditLogEntry) => log.event_status === 'Success').length;
      const securityScore = totalEvents > 0 ? Math.round(successfulEvents / totalEvents * 100) : 100;

      setAuditStats({
        totalEvents,
        failedAttempts,
        suspiciousActivity,
        securityScore
      });

      // Set recent events (last 10)
      setRecentEvents(logs.slice(0, 10));

    } catch (error) {
      console.error('Error fetching audit data:', error);
      toast({
        title: "Error Loading Audit Data",
        description: "Failed to fetch audit log information. Please try again.",
        variant: "destructive"
      });

      // Set default values if fetch fails
      setAuditStats({
        totalEvents: 0,
        failedAttempts: 0,
        suspiciousActivity: 0,
        securityScore: 100
      });
      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAuditData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Audit log data has been updated with latest information."
    });
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const formatTimeAgo = (timestamp: string): string => {
    if (!timestamp) return 'unknown time';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getEventStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'failed':
      case 'blocked':
        return 'bg-red-500 text-white';
      case 'suspicious':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'login':
      case 'logout':
        return <User className="h-4 w-4" data-id="0a3690c00" data-path="src/components/AuditLogDashboard.tsx" />;
      case 'data access':
      case 'data modification':
        return <Eye className="h-4 w-4" data-id="b9r7um42s" data-path="src/components/AuditLogDashboard.tsx" />;
      default:
        return <Activity className="h-4 w-4" data-id="sq8twpucg" data-path="src/components/AuditLogDashboard.tsx" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" data-id="hify41ayy" data-path="src/components/AuditLogDashboard.tsx">
        <div className="text-center" data-id="p566pt8ji" data-path="src/components/AuditLogDashboard.tsx">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" data-id="289uaepv8" data-path="src/components/AuditLogDashboard.tsx" />
          <p className="text-sm text-muted-foreground" data-id="5mb0u5op0" data-path="src/components/AuditLogDashboard.tsx">Loading real-time audit data...</p>
        </div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="r2pnqw7te" data-path="src/components/AuditLogDashboard.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="xxg4ajmqx" data-path="src/components/AuditLogDashboard.tsx">
        <div data-id="3zifu7u9c" data-path="src/components/AuditLogDashboard.tsx">
          <h2 className="text-2xl font-bold tracking-tight" data-id="jt75dnfwk" data-path="src/components/AuditLogDashboard.tsx">Audit Log Dashboard</h2>
          <p className="text-muted-foreground" data-id="e3jywcgsq" data-path="src/components/AuditLogDashboard.tsx">
            Real-time security monitoring and audit trail analysis
          </p>
        </div>
        <Button
          onClick={refreshData}
          disabled={refreshing}
          variant="outline"
          size="sm" data-id="f5maulso4" data-path="src/components/AuditLogDashboard.tsx">

          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} data-id="ry5bo743u" data-path="src/components/AuditLogDashboard.tsx" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-id="ht2wng9tr" data-path="src/components/AuditLogDashboard.tsx">
        <Card data-id="3emdkbnr5" data-path="src/components/AuditLogDashboard.tsx">
          <CardContent className="p-6" data-id="8qaavbrvn" data-path="src/components/AuditLogDashboard.tsx">
            <div className="flex items-center justify-between" data-id="ul1otx129" data-path="src/components/AuditLogDashboard.tsx">
              <div data-id="7mn2tazzg" data-path="src/components/AuditLogDashboard.tsx">
                <p className="text-sm font-medium text-muted-foreground" data-id="mf0n4mqrl" data-path="src/components/AuditLogDashboard.tsx">Total Events</p>
                <p className="text-3xl font-bold" data-id="fgicf3s6j" data-path="src/components/AuditLogDashboard.tsx">{auditStats.totalEvents.toLocaleString()}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" data-id="487e9n5cj" data-path="src/components/AuditLogDashboard.tsx" />
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-id="0ueojg1ks" data-path="src/components/AuditLogDashboard.tsx">
              All recorded events
            </p>
          </CardContent>
        </Card>

        <Card data-id="5bcsk31r1" data-path="src/components/AuditLogDashboard.tsx">
          <CardContent className="p-6" data-id="di3zexgo8" data-path="src/components/AuditLogDashboard.tsx">
            <div className="flex items-center justify-between" data-id="j4l8aid0l" data-path="src/components/AuditLogDashboard.tsx">
              <div data-id="16dqxc7xr" data-path="src/components/AuditLogDashboard.tsx">
                <p className="text-sm font-medium text-muted-foreground" data-id="1s12axy1a" data-path="src/components/AuditLogDashboard.tsx">Failed Attempts</p>
                <p className="text-3xl font-bold text-red-600" data-id="1wihcsj7t" data-path="src/components/AuditLogDashboard.tsx">{auditStats.failedAttempts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" data-id="pxgrtgn1m" data-path="src/components/AuditLogDashboard.tsx" />
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-id="natwcsang" data-path="src/components/AuditLogDashboard.tsx">
              {auditStats.totalEvents > 0 ?
              `${(auditStats.failedAttempts / auditStats.totalEvents * 100).toFixed(1)}% of total events` :
              'No events recorded'
              }
            </p>
          </CardContent>
        </Card>

        <Card data-id="ayp8eozto" data-path="src/components/AuditLogDashboard.tsx">
          <CardContent className="p-6" data-id="tx2gtubwg" data-path="src/components/AuditLogDashboard.tsx">
            <div className="flex items-center justify-between" data-id="6rnq3fnr4" data-path="src/components/AuditLogDashboard.tsx">
              <div data-id="f0e5f36jr" data-path="src/components/AuditLogDashboard.tsx">
                <p className="text-sm font-medium text-muted-foreground" data-id="nrn0wiaae" data-path="src/components/AuditLogDashboard.tsx">Suspicious Activity</p>
                <p className="text-3xl font-bold text-orange-600" data-id="nuhb5cs7j" data-path="src/components/AuditLogDashboard.tsx">{auditStats.suspiciousActivity}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" data-id="70v59bdml" data-path="src/components/AuditLogDashboard.tsx" />
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-id="50wszmwdg" data-path="src/components/AuditLogDashboard.tsx">
              {auditStats.suspiciousActivity > 0 ? 'Requires attention' : 'All clear'}
            </p>
          </CardContent>
        </Card>

        <Card data-id="w6fqigzga" data-path="src/components/AuditLogDashboard.tsx">
          <CardContent className="p-6" data-id="eszjf2hsg" data-path="src/components/AuditLogDashboard.tsx">
            <div className="flex items-center justify-between" data-id="4elfc5paw" data-path="src/components/AuditLogDashboard.tsx">
              <div data-id="10txq5bqe" data-path="src/components/AuditLogDashboard.tsx">
                <p className="text-sm font-medium text-muted-foreground" data-id="zhwcioqm2" data-path="src/components/AuditLogDashboard.tsx">Security Score</p>
                <p className={`text-3xl font-bold ${
                auditStats.securityScore >= 95 ? 'text-green-600' :
                auditStats.securityScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`
                } data-id="6d4swc7v1" data-path="src/components/AuditLogDashboard.tsx">{auditStats.securityScore}%</p>
              </div>
              <TrendingUp className={`h-8 w-8 ${
              auditStats.securityScore >= 95 ? 'text-green-600' :
              auditStats.securityScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`
              } data-id="jyt7kv3v9" data-path="src/components/AuditLogDashboard.tsx" />
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-id="1vdt8dc28" data-path="src/components/AuditLogDashboard.tsx">
              Based on security events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {auditStats.suspiciousActivity > 0 &&
      <Alert className="border-orange-500 bg-orange-50" data-id="axroxzppr" data-path="src/components/AuditLogDashboard.tsx">
          <AlertTriangle className="h-4 w-4 text-orange-600" data-id="dobl2ezdj" data-path="src/components/AuditLogDashboard.tsx" />
          <AlertDescription data-id="6jd5n4ibc" data-path="src/components/AuditLogDashboard.tsx">
            <strong data-id="lapnalaty" data-path="src/components/AuditLogDashboard.tsx">Security Alert:</strong> {auditStats.suspiciousActivity} suspicious activities detected. 
            Review the recent events below for more details.
          </AlertDescription>
        </Alert>
      }

      {auditStats.securityScore < 80 &&
      <Alert className="border-red-500 bg-red-50" data-id="ni3d6khyj" data-path="src/components/AuditLogDashboard.tsx">
          <AlertTriangle className="h-4 w-4 text-red-600" data-id="2ofarw3d0" data-path="src/components/AuditLogDashboard.tsx" />
          <AlertDescription data-id="s3360y3tb" data-path="src/components/AuditLogDashboard.tsx">
            <strong data-id="v2zu9wp0c" data-path="src/components/AuditLogDashboard.tsx">Low Security Score:</strong> Your system security score is {auditStats.securityScore}%. 
            This indicates a high number of failed or blocked events that require investigation.
          </AlertDescription>
        </Alert>
      }

      {/* Recent Activity */}
      <Card data-id="mtap99zn9" data-path="src/components/AuditLogDashboard.tsx">
        <CardHeader data-id="12s96qkdz" data-path="src/components/AuditLogDashboard.tsx">
          <CardTitle data-id="7pb6o1rl3" data-path="src/components/AuditLogDashboard.tsx">Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent data-id="bsmf5rmw4" data-path="src/components/AuditLogDashboard.tsx">
          {recentEvents.length === 0 ?
          <div className="text-center py-8 text-gray-500" data-id="5cdm99ez6" data-path="src/components/AuditLogDashboard.tsx">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" data-id="z7v9zpnmg" data-path="src/components/AuditLogDashboard.tsx" />
              <p data-id="oa4k82bjs" data-path="src/components/AuditLogDashboard.tsx">No audit events recorded yet.</p>
              <p className="text-sm mt-1" data-id="ej3iv5ztw" data-path="src/components/AuditLogDashboard.tsx">Security events will appear here as they occur.</p>
            </div> :

          <div className="space-y-3" data-id="7u0wuanng" data-path="src/components/AuditLogDashboard.tsx">
              {recentEvents.map((event) =>
            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="yxf0qffqw" data-path="src/components/AuditLogDashboard.tsx">
                  <div className="flex items-center space-x-3" data-id="zyyn4ch08" data-path="src/components/AuditLogDashboard.tsx">
                    <Badge className={getEventStatusColor(event.event_status)} data-id="ptd5m8cn9" data-path="src/components/AuditLogDashboard.tsx">
                      {getEventIcon(event.event_type)}
                      <span className="ml-1" data-id="4ufk1zqs8" data-path="src/components/AuditLogDashboard.tsx">{event.event_status}</span>
                    </Badge>
                    <div data-id="6rj3wlkzt" data-path="src/components/AuditLogDashboard.tsx">
                      <p className="text-sm font-medium" data-id="b7uidzl5p" data-path="src/components/AuditLogDashboard.tsx">
                        {event.event_type}: {event.action_performed || event.resource_accessed || 'System action'}
                      </p>
                      <p className="text-xs text-muted-foreground" data-id="do6p2e2b8" data-path="src/components/AuditLogDashboard.tsx">
                        {event.username || 'Unknown user'} from {event.ip_address || 'unknown IP'}
                        {event.station && ` • Station: ${event.station}`}
                        {event.failure_reason && ` • Reason: ${event.failure_reason}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right" data-id="s0pw98620" data-path="src/components/AuditLogDashboard.tsx">
                    <span className="text-xs text-muted-foreground flex items-center" data-id="rxm6br0hc" data-path="src/components/AuditLogDashboard.tsx">
                      <Clock className="w-3 h-3 mr-1" data-id="12wvleia0" data-path="src/components/AuditLogDashboard.tsx" />
                      {formatTimeAgo(event.event_timestamp)}
                    </span>
                    {event.risk_level && event.risk_level !== 'Low' &&
                <Badge
                  variant={event.risk_level === 'Critical' ? 'destructive' : 'secondary'}
                  className="mt-1 text-xs" data-id="wic1c9mrm" data-path="src/components/AuditLogDashboard.tsx">

                        {event.risk_level} Risk
                      </Badge>
                }
                  </div>
                </div>
            )}
            </div>
          }
        </CardContent>
      </Card>
    </div>);

};

export default AuditLogDashboard;
