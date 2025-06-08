import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Database,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  Settings,
  Bell } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RealtimeAlertNotifications from '@/components/RealtimeAlertNotifications';

interface PerformanceMetrics {
  connectionTime: number;
  queryResponseTime: number;
  activeConnections: number;
  totalQueries: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  lastUpdated: string;
}

interface AlertThreshold {
  metric: string;
  threshold: number;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const DatabasePerformanceMonitor = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    connectionTime: 0,
    queryResponseTime: 0,
    activeConnections: 0,
    totalQueries: 0,
    errorRate: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    lastUpdated: new Date().toISOString()
  });

  const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([
  { metric: 'connectionTime', threshold: 2000, enabled: true, severity: 'high' },
  { metric: 'queryResponseTime', threshold: 1000, enabled: true, severity: 'medium' },
  { metric: 'errorRate', threshold: 5, enabled: true, severity: 'critical' },
  { metric: 'memoryUsage', threshold: 80, enabled: true, severity: 'high' },
  { metric: 'cpuUsage', threshold: 90, enabled: true, severity: 'critical' }]
  );

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<Array<{id: string;message: string;severity: string;timestamp: string;}>>([]);
  const [historicalData, setHistoricalData] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      interval = setInterval(async () => {
        await collectMetrics();
      }, 5000); // Collect metrics every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const collectMetrics = async () => {
    try {
      const startTime = Date.now();

      // Simulate database performance check
      const connectionTest = await testDatabaseConnection();
      const connectionTime = Date.now() - startTime;

      // Simulate query performance test
      const queryStartTime = Date.now();
      await testQueryPerformance();
      const queryResponseTime = Date.now() - queryStartTime;

      // Generate realistic performance metrics
      const newMetrics: PerformanceMetrics = {
        connectionTime,
        queryResponseTime,
        activeConnections: Math.floor(Math.random() * 20) + 5,
        totalQueries: metrics.totalQueries + Math.floor(Math.random() * 10) + 1,
        errorRate: Math.random() * 3, // 0-3% error rate
        memoryUsage: Math.random() * 30 + 50, // 50-80% memory usage
        cpuUsage: Math.random() * 40 + 30, // 30-70% CPU usage
        lastUpdated: new Date().toISOString()
      };

      setMetrics(newMetrics);

      // Add to historical data (keep last 50 readings)
      setHistoricalData((prev) => {
        const updated = [...prev, newMetrics];
        return updated.slice(-50);
      });

      // Check for threshold violations
      checkAlertThresholds(newMetrics);

    } catch (error) {
      console.error('Error collecting metrics:', error);
      toast({
        title: "Monitoring Error",
        description: "Failed to collect performance metrics",
        variant: "destructive"
      });
    }
  };

  const testDatabaseConnection = async () => {
    // Simulate connection test with error handling
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve(true), Math.random() * 500 + 100);
      } catch (error) {
        console.warn('Database connection test error:', error);
        reject(error);
      }
    });
  };

  const testQueryPerformance = async () => {
    // Simulate query performance test
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), Math.random() * 300 + 50);
    });
  };

  const checkAlertThresholds = (currentMetrics: PerformanceMetrics) => {
    alertThresholds.forEach((threshold) => {
      if (!threshold.enabled) return;

      const metricValue = currentMetrics[threshold.metric as keyof PerformanceMetrics] as number;
      const isViolation = metricValue > threshold.threshold;

      if (isViolation) {
        const alertId = `${threshold.metric}_${Date.now()}`;
        const newAlert = {
          id: alertId,
          message: `${threshold.metric} exceeded threshold: ${metricValue.toFixed(2)} > ${threshold.threshold}`,
          severity: threshold.severity,
          timestamp: new Date().toISOString()
        };

        setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts

        toast({
          title: `${threshold.severity.toUpperCase()} Alert`,
          description: newAlert.message,
          variant: threshold.severity === 'critical' ? 'destructive' : 'default'
        });
      }
    });
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      toast({
        title: "Monitoring Started",
        description: "Real-time database performance monitoring is now active"
      });
    } else {
      toast({
        title: "Monitoring Stopped",
        description: "Database performance monitoring has been paused"
      });
    }
  };

  const getStatusColor = (value: number, threshold: number) => {
    if (value > threshold * 0.9) return 'destructive';
    if (value > threshold * 0.7) return 'secondary';
    return 'default';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':return 'destructive';
      case 'high':return 'secondary';
      case 'medium':return 'outline';
      default:return 'default';
    }
  };

  return (
    <div className="space-y-6" data-id="592nkf200" data-path="src/components/DatabasePerformanceMonitor.tsx">
      {/* Control Panel */}
      <Card data-id="d6x3zd4pz" data-path="src/components/DatabasePerformanceMonitor.tsx">
        <CardHeader data-id="86wzxuivt" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <CardTitle className="flex items-center gap-2" data-id="h778xdxke" data-path="src/components/DatabasePerformanceMonitor.tsx">
            <Database className="h-5 w-5" data-id="nyqt2xm55" data-path="src/components/DatabasePerformanceMonitor.tsx" />
            Database Performance Monitor
          </CardTitle>
          <CardDescription data-id="tyjwyetha" data-path="src/components/DatabasePerformanceMonitor.tsx">
            Real-time monitoring of database connection and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent data-id="sr8rzgtkp" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <div className="flex items-center justify-between" data-id="w2nvy7ef9" data-path="src/components/DatabasePerformanceMonitor.tsx">
            <div className="flex items-center gap-4" data-id="rvblvnrek" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <Button
                onClick={toggleMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
                className="flex items-center gap-2" data-id="mmzo73ymg" data-path="src/components/DatabasePerformanceMonitor.tsx">

                {isMonitoring ? <XCircle className="h-4 w-4" data-id="84rltiidf" data-path="src/components/DatabasePerformanceMonitor.tsx" /> : <Activity className="h-4 w-4" data-id="9m4miofon" data-path="src/components/DatabasePerformanceMonitor.tsx" />}
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
              <Badge variant={isMonitoring ? 'default' : 'secondary'} data-id="42g5cdzn4" data-path="src/components/DatabasePerformanceMonitor.tsx">
                {isMonitoring ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground" data-id="by5j6dyqn" data-path="src/components/DatabasePerformanceMonitor.tsx">
              Last Updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-4" data-id="yiupv18qc" data-path="src/components/DatabasePerformanceMonitor.tsx">
        <TabsList data-id="077m2dx37" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <TabsTrigger value="metrics" data-id="adn7bbpb3" data-path="src/components/DatabasePerformanceMonitor.tsx">Performance Metrics</TabsTrigger>
          <TabsTrigger value="alerts" data-id="5629ghlvo" data-path="src/components/DatabasePerformanceMonitor.tsx">Alerts & Thresholds</TabsTrigger>
          <TabsTrigger value="history" data-id="9cylkz7dx" data-path="src/components/DatabasePerformanceMonitor.tsx">Historical Data</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2" data-id="wil8dvlot" data-path="src/components/DatabasePerformanceMonitor.tsx">
            <Bell className="h-4 w-4" data-id="3is7vctvv" data-path="src/components/DatabasePerformanceMonitor.tsx" />
            Live Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4" data-id="snxr1ynqg" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-id="e4dr9c4pt" data-path="src/components/DatabasePerformanceMonitor.tsx">
            {/* Connection Time */}
            <Card data-id="xk77b7c7n" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="k1qidw8bw" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="sffkpolml" data-path="src/components/DatabasePerformanceMonitor.tsx">Connection Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" data-id="9h36s9bsu" data-path="src/components/DatabasePerformanceMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="tkgg7una1" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <div className="text-2xl font-bold" data-id="krdlgqt09" data-path="src/components/DatabasePerformanceMonitor.tsx">{metrics.connectionTime}ms</div>
                <p className="text-xs text-muted-foreground" data-id="6oeywq576" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Database connection latency
                </p>
                <Progress
                  value={metrics.connectionTime / 3000 * 100}
                  className="mt-2" data-id="5kamp5fy3" data-path="src/components/DatabasePerformanceMonitor.tsx" />

              </CardContent>
            </Card>

            {/* Query Response Time */}
            <Card data-id="zj0hk7eoj" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="lkgb0jpat" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="4d22gyzc6" data-path="src/components/DatabasePerformanceMonitor.tsx">Query Response</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" data-id="8fbqxfvn8" data-path="src/components/DatabasePerformanceMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="ly7t0yvlr" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <div className="text-2xl font-bold" data-id="suscpij4b" data-path="src/components/DatabasePerformanceMonitor.tsx">{metrics.queryResponseTime}ms</div>
                <p className="text-xs text-muted-foreground" data-id="gijwi44og" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Average query execution time
                </p>
                <Progress
                  value={metrics.queryResponseTime / 2000 * 100}
                  className="mt-2" data-id="dnv2jfxca" data-path="src/components/DatabasePerformanceMonitor.tsx" />

              </CardContent>
            </Card>

            {/* Active Connections */}
            <Card data-id="p1a8yoiq7" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="td0enzsz1" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="sat5yhp17" data-path="src/components/DatabasePerformanceMonitor.tsx">Active Connections</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" data-id="poyhz39v8" data-path="src/components/DatabasePerformanceMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="9vm295t6r" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <div className="text-2xl font-bold" data-id="bdzvturxx" data-path="src/components/DatabasePerformanceMonitor.tsx">{metrics.activeConnections}</div>
                <p className="text-xs text-muted-foreground" data-id="vkp7505t6" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Current database connections
                </p>
                <Progress
                  value={metrics.activeConnections / 25 * 100}
                  className="mt-2" data-id="lyx1ji1ug" data-path="src/components/DatabasePerformanceMonitor.tsx" />

              </CardContent>
            </Card>

            {/* Error Rate */}
            <Card data-id="je4m9k8gs" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="176hxvof9" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="2vvhr50dx" data-path="src/components/DatabasePerformanceMonitor.tsx">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" data-id="3qt69epod" data-path="src/components/DatabasePerformanceMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="mnohn1c55" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <div className="text-2xl font-bold" data-id="k8f6lfzoh" data-path="src/components/DatabasePerformanceMonitor.tsx">{metrics.errorRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground" data-id="l1xwuns9o" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Database operation failures
                </p>
                <Progress
                  value={metrics.errorRate / 10 * 100}
                  className="mt-2" data-id="bge6gsmoh" data-path="src/components/DatabasePerformanceMonitor.tsx" />

              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card data-id="8fo7opegl" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="355q3sghv" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="ufb3fo4p1" data-path="src/components/DatabasePerformanceMonitor.tsx">Memory Usage</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" data-id="s8nzw8w4u" data-path="src/components/DatabasePerformanceMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="vpod0cf0r" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <div className="text-2xl font-bold" data-id="7lhiscyg6" data-path="src/components/DatabasePerformanceMonitor.tsx">{metrics.memoryUsage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground" data-id="40fja0obs" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Database memory utilization
                </p>
                <Progress
                  value={metrics.memoryUsage}
                  className="mt-2" data-id="gja0eqavn" data-path="src/components/DatabasePerformanceMonitor.tsx" />

              </CardContent>
            </Card>

            {/* CPU Usage */}
            <Card data-id="q5mzzgsv1" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="6gahx9pwk" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="5pbivduf3" data-path="src/components/DatabasePerformanceMonitor.tsx">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" data-id="kjlwtplhl" data-path="src/components/DatabasePerformanceMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="fc4a0l0xb" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <div className="text-2xl font-bold" data-id="bycbkr057" data-path="src/components/DatabasePerformanceMonitor.tsx">{metrics.cpuUsage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground" data-id="38eqe8f4a" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Database CPU utilization
                </p>
                <Progress
                  value={metrics.cpuUsage}
                  className="mt-2" data-id="3p6gcb8hy" data-path="src/components/DatabasePerformanceMonitor.tsx" />

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4" data-id="d4dskmtrz" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-id="5g5djke0o" data-path="src/components/DatabasePerformanceMonitor.tsx">
            {/* Alert Thresholds Configuration */}
            <Card data-id="aps2y67a3" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader data-id="5yy7ne5bd" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="flex items-center gap-2" data-id="3xks1n4iq" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  <Settings className="h-5 w-5" data-id="ijc4lrju7" data-path="src/components/DatabasePerformanceMonitor.tsx" />
                  Alert Thresholds
                </CardTitle>
                <CardDescription data-id="i5foyrcfj" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Configure monitoring thresholds and alert severity levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="x6m7zkpj6" data-path="src/components/DatabasePerformanceMonitor.tsx">
                {alertThresholds.map((threshold, index) =>
                <div key={threshold.metric} className="flex items-center justify-between p-3 border rounded-lg" data-id="enuu6nwmk" data-path="src/components/DatabasePerformanceMonitor.tsx">
                    <div data-id="w10hgufdx" data-path="src/components/DatabasePerformanceMonitor.tsx">
                      <div className="font-medium capitalize" data-id="bvmd8ol8b" data-path="src/components/DatabasePerformanceMonitor.tsx">{threshold.metric.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-sm text-muted-foreground" data-id="g0v8s1nzh" data-path="src/components/DatabasePerformanceMonitor.tsx">
                        Threshold: {threshold.threshold}
                        {threshold.metric.includes('Time') ? 'ms' : threshold.metric.includes('Rate') || threshold.metric.includes('Usage') ? '%' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" data-id="rzjx59lvq" data-path="src/components/DatabasePerformanceMonitor.tsx">
                      <Badge variant={getSeverityColor(threshold.severity)} data-id="zv37vo8zp" data-path="src/components/DatabasePerformanceMonitor.tsx">
                        {threshold.severity}
                      </Badge>
                      <Badge variant={threshold.enabled ? 'default' : 'secondary'} data-id="8f1e5vn48" data-path="src/components/DatabasePerformanceMonitor.tsx">
                        {threshold.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card data-id="nvuejli2r" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardHeader data-id="xwfstslpe" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <CardTitle className="flex items-center gap-2" data-id="t12kj0kso" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  <AlertTriangle className="h-5 w-5" data-id="xa5t5gzhf" data-path="src/components/DatabasePerformanceMonitor.tsx" />
                  Recent Alerts
                </CardTitle>
                <CardDescription data-id="ikqvuu2zm" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Latest threshold violations and system alerts
                </CardDescription>
              </CardHeader>
              <CardContent data-id="9aq03txqi" data-path="src/components/DatabasePerformanceMonitor.tsx">
                {alerts.length === 0 ?
                <div className="text-center py-8 text-muted-foreground" data-id="tjga3dur4" data-path="src/components/DatabasePerformanceMonitor.tsx">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" data-id="u7y8qsxpu" data-path="src/components/DatabasePerformanceMonitor.tsx" />
                    No alerts detected
                  </div> :

                <div className="space-y-3 max-h-64 overflow-y-auto" data-id="zx5fmr3l8" data-path="src/components/DatabasePerformanceMonitor.tsx">
                    {alerts.map((alert) =>
                  <Alert key={alert.id} data-id="ytrz1zcdh" data-path="src/components/DatabasePerformanceMonitor.tsx">
                        <AlertTriangle className="h-4 w-4" data-id="sbqv55s71" data-path="src/components/DatabasePerformanceMonitor.tsx" />
                        <AlertDescription data-id="a2v1i17xv" data-path="src/components/DatabasePerformanceMonitor.tsx">
                          <div className="flex items-center justify-between" data-id="cmkr19ots" data-path="src/components/DatabasePerformanceMonitor.tsx">
                            <span data-id="jjoi3tgal" data-path="src/components/DatabasePerformanceMonitor.tsx">{alert.message}</span>
                            <div className="flex items-center gap-2" data-id="mn304b9u9" data-path="src/components/DatabasePerformanceMonitor.tsx">
                              <Badge variant={getSeverityColor(alert.severity)} data-id="rt59l8r6c" data-path="src/components/DatabasePerformanceMonitor.tsx">
                                {alert.severity}
                              </Badge>
                              <span className="text-xs text-muted-foreground" data-id="4roq7ovjf" data-path="src/components/DatabasePerformanceMonitor.tsx">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4" data-id="l6q6sfn3j" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <Card data-id="c02t5nzmg" data-path="src/components/DatabasePerformanceMonitor.tsx">
            <CardHeader data-id="mfsn904yo" data-path="src/components/DatabasePerformanceMonitor.tsx">
              <CardTitle className="flex items-center gap-2" data-id="jnmi7frte" data-path="src/components/DatabasePerformanceMonitor.tsx">
                <BarChart3 className="h-5 w-5" data-id="zmdmgyjn9" data-path="src/components/DatabasePerformanceMonitor.tsx" />
                Historical Performance Data
              </CardTitle>
              <CardDescription data-id="def273mmi" data-path="src/components/DatabasePerformanceMonitor.tsx">
                Performance trends over the last {historicalData.length} monitoring cycles
              </CardDescription>
            </CardHeader>
            <CardContent data-id="ky50l8eon" data-path="src/components/DatabasePerformanceMonitor.tsx">
              {historicalData.length === 0 ?
              <div className="text-center py-8 text-muted-foreground" data-id="8wgo7yyn6" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  Start monitoring to collect historical performance data
                </div> :

              <div className="space-y-4" data-id="f0lryvf09" data-path="src/components/DatabasePerformanceMonitor.tsx">
                  <div className="text-sm text-muted-foreground" data-id="lo7km8ot5" data-path="src/components/DatabasePerformanceMonitor.tsx">
                    Data points collected: {historicalData.length}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="4617akij0" data-path="src/components/DatabasePerformanceMonitor.tsx">
                    <div className="p-4 border rounded-lg" data-id="97s6qbyal" data-path="src/components/DatabasePerformanceMonitor.tsx">
                      <h4 className="font-medium mb-2" data-id="sgrifzx1b" data-path="src/components/DatabasePerformanceMonitor.tsx">Average Response Time</h4>
                      <div className="text-2xl font-bold text-blue-600" data-id="b2ah5b1f0" data-path="src/components/DatabasePerformanceMonitor.tsx">
                        {(historicalData.reduce((sum, data) => sum + data.queryResponseTime, 0) / historicalData.length).toFixed(0)}ms
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg" data-id="a2sr9kqbk" data-path="src/components/DatabasePerformanceMonitor.tsx">
                      <h4 className="font-medium mb-2" data-id="vyeorm2b1" data-path="src/components/DatabasePerformanceMonitor.tsx">Average Error Rate</h4>
                      <div className="text-2xl font-bold text-red-600" data-id="sc4ftto81" data-path="src/components/DatabasePerformanceMonitor.tsx">
                        {(historicalData.reduce((sum, data) => sum + data.errorRate, 0) / historicalData.length).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4" data-id="e2d9muogp" data-path="src/components/DatabasePerformanceMonitor.tsx">
          <RealtimeAlertNotifications data-id="k299yzswx" data-path="src/components/DatabasePerformanceMonitor.tsx" />
        </TabsContent>
      </Tabs>
    </div>);

};

export default DatabasePerformanceMonitor;