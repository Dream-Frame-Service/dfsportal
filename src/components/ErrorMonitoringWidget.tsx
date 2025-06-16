import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  Bell,
  CheckCircle,
  XCircle,
  Clock } from
'lucide-react';
import { EnhancedErrorLogger } from '@/services/enhancedErrorLogger';
import { useToast } from '@/hooks/use-toast';
import useAdminAccess from '@/hooks/use-admin-access';

interface ErrorAlert {
  id: string;
  type: 'spike' | 'pattern' | 'critical' | 'recovery';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
}

const ErrorMonitoringWidget: React.FC = () => {
  const { hasMonitoringAccess } = useAdminAccess();
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [activeAlerts, setActiveAlerts] = useState<ErrorAlert[]>([]);
  const [errorTrend, setErrorTrend] = useState<'increasing' | 'stable' | 'decreasing'>('stable');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  const errorLogger = EnhancedErrorLogger.getInstance();

  const checkSystemHealth = () => {
    const analytics = errorLogger.getAnalytics();
    if (!analytics) return;

    const newAlerts: ErrorAlert[] = [];
    let newStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check for error spikes
    if (analytics.trends.hourly > 5) {
      newStatus = 'critical';
      newAlerts.push({
        id: `spike-${Date.now()}`,
        type: 'spike',
        message: `High error rate detected: ${analytics.trends.hourly} errors in the last hour`,
        timestamp: new Date(),
        severity: 'critical',
        acknowledged: false
      });
    } else if (analytics.trends.hourly > 2) {
      newStatus = 'warning';
      newAlerts.push({
        id: `spike-${Date.now()}`,
        type: 'spike',
        message: `Elevated error rate: ${analytics.trends.hourly} errors in the last hour`,
        timestamp: new Date(),
        severity: 'medium',
        acknowledged: false
      });
    }

    // Check for critical patterns
    const criticalPatterns = errorLogger.getCriticalPatterns();
    if (criticalPatterns.length > 0) {
      newStatus = Math.max(newStatus === 'critical' ? 2 : newStatus === 'warning' ? 1 : 0, 1) === 2 ? 'critical' : 'warning';
      criticalPatterns.forEach((pattern) => {
        newAlerts.push({
          id: `pattern-${pattern.id}-${Date.now()}`,
          type: 'pattern',
          message: `Critical pattern detected: ${pattern.name} (${pattern.frequency} occurrences)`,
          timestamp: new Date(),
          severity: pattern.severity,
          acknowledged: false
        });
      });
    }

    // Determine trend
    const recentErrors = analytics.trends.hourly;
    const olderErrors = analytics.trends.daily - analytics.trends.hourly;
    const avgOlderRate = olderErrors / 23; // Average per hour for the other 23 hours

    if (recentErrors > avgOlderRate * 1.5) {
      setErrorTrend('increasing');
    } else if (recentErrors < avgOlderRate * 0.5) {
      setErrorTrend('decreasing');
    } else {
      setErrorTrend('stable');
    }

    // Update state
    setSystemStatus(newStatus);
    setActiveAlerts((prev) => {
      const existingIds = prev.map((alert) => alert.id);
      const uniqueNewAlerts = newAlerts.filter((alert) => !existingIds.includes(alert.id));
      return [...prev, ...uniqueNewAlerts].slice(-10); // Keep last 10 alerts
    });
    setLastUpdate(new Date());

    // Show toast for critical alerts
    newAlerts.forEach((alert) => {
      if (alert.severity === 'critical') {
        toast({
          title: "Critical Error Alert",
          description: alert.message,
          variant: "destructive"
        });
      }
    });
  };

  useEffect(() => {
    // Only run if user has monitoring access
    if (!hasMonitoringAccess) return;

    // Initial check
    checkSystemHealth();

    // Set up periodic monitoring
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [hasMonitoringAccess, checkSystemHealth]);

  // Return null if user doesn't have monitoring access
  if (!hasMonitoringAccess) {
    return null;
  }

  const acknowledgeAlert = (alertId: string) => {
    setActiveAlerts((prev) =>
    prev.map((alert) =>
    alert.id === alertId ? { ...alert, acknowledged: true } : alert
    )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':return 'text-red-600 bg-red-50 border-red-200';
      default:return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':return <TrendingUp className="w-4 h-4 text-red-500" data-id="y7uvpfv9i" data-path="src/components/ErrorMonitoringWidget.tsx" />;
      case 'decreasing':return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" data-id="0aapbtcre" data-path="src/components/ErrorMonitoringWidget.tsx" />;
      default:return <Activity className="w-4 h-4 text-blue-500" data-id="t55nmqev4" data-path="src/components/ErrorMonitoringWidget.tsx" />;
    }
  };

  const unacknowledgedAlerts = activeAlerts.filter((alert) => !alert.acknowledged);

  return (
    <div className="space-y-4" data-id="f6lziyonu" data-path="src/components/ErrorMonitoringWidget.tsx">
      {/* System Status Card */}
      <Card data-id="ixqljkxlq" data-path="src/components/ErrorMonitoringWidget.tsx">
        <CardHeader className="pb-3" data-id="l8br4u42v" data-path="src/components/ErrorMonitoringWidget.tsx">
          <CardTitle className="flex items-center justify-between" data-id="m0dhjobu3" data-path="src/components/ErrorMonitoringWidget.tsx">
            <div className="flex items-center gap-2" data-id="dbzrvx2wz" data-path="src/components/ErrorMonitoringWidget.tsx">
              <Shield className="h-5 w-5" data-id="p9b5nibet" data-path="src/components/ErrorMonitoringWidget.tsx" />
              System Health Monitor
            </div>
            <Badge className={getStatusColor(systemStatus)} data-id="rk1bxayk2" data-path="src/components/ErrorMonitoringWidget.tsx">
              {systemStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="qjevbbgpp" data-path="src/components/ErrorMonitoringWidget.tsx">
          <div className="grid grid-cols-3 gap-4" data-id="ihkp34h02" data-path="src/components/ErrorMonitoringWidget.tsx">
            <div className="text-center" data-id="03tk18pwh" data-path="src/components/ErrorMonitoringWidget.tsx">
              <div className="flex items-center justify-center mb-1" data-id="akick3tt1" data-path="src/components/ErrorMonitoringWidget.tsx">
                {systemStatus === 'healthy' ?
                <CheckCircle className="h-6 w-6 text-green-500" data-id="acnoq5ql9" data-path="src/components/ErrorMonitoringWidget.tsx" /> :
                systemStatus === 'warning' ?
                <AlertTriangle className="h-6 w-6 text-yellow-500" data-id="o3fihbljk" data-path="src/components/ErrorMonitoringWidget.tsx" /> :

                <XCircle className="h-6 w-6 text-red-500" data-id="a6nco9mmi" data-path="src/components/ErrorMonitoringWidget.tsx" />
                }
              </div>
              <div className="text-sm font-medium" data-id="inejoymzs" data-path="src/components/ErrorMonitoringWidget.tsx">Status</div>
              <div className="text-xs text-muted-foreground" data-id="bc5ilhbek" data-path="src/components/ErrorMonitoringWidget.tsx">{systemStatus}</div>
            </div>
            
            <div className="text-center" data-id="l90830kex" data-path="src/components/ErrorMonitoringWidget.tsx">
              <div className="flex items-center justify-center mb-1" data-id="1yzcihpq6" data-path="src/components/ErrorMonitoringWidget.tsx">
                {getTrendIcon(errorTrend)}
              </div>
              <div className="text-sm font-medium" data-id="8srrd41e6" data-path="src/components/ErrorMonitoringWidget.tsx">Trend</div>
              <div className="text-xs text-muted-foreground" data-id="od8jelzl1" data-path="src/components/ErrorMonitoringWidget.tsx">{errorTrend}</div>
            </div>
            
            <div className="text-center" data-id="47ycmk1xa" data-path="src/components/ErrorMonitoringWidget.tsx">
              <div className="flex items-center justify-center mb-1" data-id="tjo39rvie" data-path="src/components/ErrorMonitoringWidget.tsx">
                <Bell className={`h-6 w-6 ${unacknowledgedAlerts.length > 0 ? 'text-orange-500' : 'text-gray-400'}`} data-id="s80kqr25d" data-path="src/components/ErrorMonitoringWidget.tsx" />
              </div>
              <div className="text-sm font-medium" data-id="s4ah9msux" data-path="src/components/ErrorMonitoringWidget.tsx">Alerts</div>
              <div className="text-xs text-muted-foreground" data-id="2sjds5pzb" data-path="src/components/ErrorMonitoringWidget.tsx">{unacknowledgedAlerts.length} new</div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t" data-id="5g7x7kgf0" data-path="src/components/ErrorMonitoringWidget.tsx">
            <div className="flex items-center justify-between text-xs text-muted-foreground" data-id="3yjxluoby" data-path="src/components/ErrorMonitoringWidget.tsx">
              <span data-id="3ksd2wl9j" data-path="src/components/ErrorMonitoringWidget.tsx">Last updated: {lastUpdate.toLocaleTimeString()}</span>
              <div className="flex items-center gap-1" data-id="z3lffhxqd" data-path="src/components/ErrorMonitoringWidget.tsx">
                <Clock className="w-3 h-3" data-id="s1oa3ml80" data-path="src/components/ErrorMonitoringWidget.tsx" />
                <span data-id="phko5ixuv" data-path="src/components/ErrorMonitoringWidget.tsx">Auto-refresh: 30s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 &&
      <Card data-id="xwk68ajaw" data-path="src/components/ErrorMonitoringWidget.tsx">
          <CardHeader className="pb-3" data-id="3cleqq0sx" data-path="src/components/ErrorMonitoringWidget.tsx">
            <CardTitle className="flex items-center gap-2" data-id="sj5ngixnp" data-path="src/components/ErrorMonitoringWidget.tsx">
              <Bell className="h-5 w-5" data-id="w9x11vhhx" data-path="src/components/ErrorMonitoringWidget.tsx" />
              Recent Alerts
              {unacknowledgedAlerts.length > 0 &&
            <Badge variant="destructive" className="ml-2" data-id="e2tpas92d" data-path="src/components/ErrorMonitoringWidget.tsx">
                  {unacknowledgedAlerts.length} new
                </Badge>
            }
            </CardTitle>
          </CardHeader>
          <CardContent data-id="e65hhehq6" data-path="src/components/ErrorMonitoringWidget.tsx">
            <div className="space-y-3" data-id="iswi5hji6" data-path="src/components/ErrorMonitoringWidget.tsx">
              {activeAlerts.slice(-5).reverse().map((alert) =>
            <Alert
              key={alert.id}
              className={`${alert.acknowledged ? 'opacity-60' : ''} ${
              alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
              alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
              alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'}`
              } data-id="zdf5ezrlr" data-path="src/components/ErrorMonitoringWidget.tsx">

                  <AlertTriangle className="h-4 w-4" data-id="2y46sojnx" data-path="src/components/ErrorMonitoringWidget.tsx" />
                  <AlertDescription data-id="7513vrlev" data-path="src/components/ErrorMonitoringWidget.tsx">
                    <div className="flex items-start justify-between" data-id="elq0bc6i8" data-path="src/components/ErrorMonitoringWidget.tsx">
                      <div className="flex-1" data-id="m1rq180iz" data-path="src/components/ErrorMonitoringWidget.tsx">
                        <div className="flex items-center gap-2 mb-1" data-id="k8d75yf5u" data-path="src/components/ErrorMonitoringWidget.tsx">
                          <Badge
                        variant="outline"
                        className={`text-xs ${
                        alert.severity === 'critical' ? 'border-red-300 text-red-700' :
                        alert.severity === 'high' ? 'border-orange-300 text-orange-700' :
                        alert.severity === 'medium' ? 'border-yellow-300 text-yellow-700' :
                        'border-blue-300 text-blue-700'}`
                        } data-id="p1crntfp6" data-path="src/components/ErrorMonitoringWidget.tsx">

                            {alert.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs" data-id="4djipllm4" data-path="src/components/ErrorMonitoringWidget.tsx">
                            {alert.type}
                          </Badge>
                          {alert.acknowledged &&
                      <Badge variant="secondary" className="text-xs" data-id="5qepf1cqo" data-path="src/components/ErrorMonitoringWidget.tsx">
                              acknowledged
                            </Badge>
                      }
                        </div>
                        <p className="text-sm" data-id="u05dgmjtr" data-path="src/components/ErrorMonitoringWidget.tsx">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1" data-id="vi9bsv76h" data-path="src/components/ErrorMonitoringWidget.tsx">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                      {!alert.acknowledged &&
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="ml-2" data-id="alo9eh9hr" data-path="src/components/ErrorMonitoringWidget.tsx">

                          Acknowledge
                        </Button>
                  }
                    </div>
                  </AlertDescription>
                </Alert>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* No Alerts State */}
      {activeAlerts.length === 0 &&
      <Card data-id="uwqrezwhr" data-path="src/components/ErrorMonitoringWidget.tsx">
          <CardContent className="pt-6" data-id="r1e4hy16v" data-path="src/components/ErrorMonitoringWidget.tsx">
            <div className="text-center py-4" data-id="9grudydw2" data-path="src/components/ErrorMonitoringWidget.tsx">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" data-id="ypx1qdox6" data-path="src/components/ErrorMonitoringWidget.tsx" />
              <p className="text-sm text-muted-foreground" data-id="ucr1s69uh" data-path="src/components/ErrorMonitoringWidget.tsx">
                No active alerts. System is operating normally.
              </p>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default ErrorMonitoringWidget;
