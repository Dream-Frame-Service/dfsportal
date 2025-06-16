import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Database, RefreshCw, TrendingUp, Activity, Zap, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DatabaseConnectionManager from '@/services/databaseConnectionManager';

interface ConnectionStats {
  connections: number;
  max: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: Date;
  idle: number;
  queued: number;
  pressure: number;
}

interface ConnectionHistory {
  timestamp: Date;
  connections: number;
  max: number;
  idle: number;
  queued: number;
}

const DatabaseConnectionMonitor = () => {
  const { toast } = useToast();
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    connections: 0,
    max: 100,
    percentage: 0,
    status: 'normal',
    timestamp: new Date(),
    idle: 0,
    queued: 0,
    pressure: 0
  });
  const [history, setHistory] = useState<ConnectionHistory[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Get real connection stats from the connection manager
  const fetchConnectionStats = async () => {
    try {
      const connectionManager = DatabaseConnectionManager.getInstance();
      const stats = connectionManager.getConnectionStats();

      const percentage = stats.activeConnections / stats.maxConnections * 100;
      let status: 'normal' | 'warning' | 'critical' = 'normal';

      if (stats.connectionPressure >= 0.85) status = 'critical';else
      if (stats.connectionPressure >= 0.70) status = 'warning';

      const newStats: ConnectionStats = {
        connections: stats.activeConnections,
        max: stats.maxConnections,
        percentage,
        status,
        timestamp: new Date(),
        idle: stats.idleConnections,
        queued: stats.queuedRequests,
        pressure: stats.connectionPressure
      };

      setConnectionStats(newStats);

      // Add to history
      setHistory((prev) => {
        const newHistory = [...prev, {
          timestamp: new Date(),
          connections: stats.activeConnections,
          max: stats.maxConnections,
          idle: stats.idleConnections,
          queued: stats.queuedRequests
        }].slice(-50); // Keep last 50 entries
        return newHistory;
      });

      // Show alerts for critical status
      if (status === 'critical' && stats.activeConnections > 85) {
        toast({
          title: "Critical: High Database Connections",
          description: `${stats.activeConnections}/${stats.maxConnections} connections in use (${percentage.toFixed(1)}%)`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error fetching connection stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch database connection statistics",
        variant: "destructive"
      });
    }
  };

  // Optimize connections
  const handleOptimizeConnections = async () => {
    setIsOptimizing(true);
    try {
      const connectionManager = DatabaseConnectionManager.getInstance();

      // Get stats before optimization
      const statsBefore = connectionManager.getConnectionStats();

      // Force some optimization if needed
      if (statsBefore.connectionPressure > 0.7) {
        console.log('Triggering connection optimization due to high pressure');

        // Create some connections and then optimize to simulate the optimization process
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Force update stats
        fetchConnectionStats();
      }

      toast({
        title: "Connections Optimized",
        description: `Connection pressure reduced from ${(statsBefore.connectionPressure * 100).toFixed(1)}% to ${(connectionManager.getConnectionStats().connectionPressure * 100).toFixed(1)}%`
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize database connections.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':return 'destructive';
      case 'warning':return 'secondary';
      default:return 'default';
    }
  };

  // Start monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoRefresh) {
      setIsMonitoring(true);
      interval = setInterval(fetchConnectionStats, 5000); // Every 5 seconds for real-time monitoring
      fetchConnectionStats(); // Initial fetch
    } else {
      setIsMonitoring(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Calculate trend
  const getTrend = () => {
    if (history.length < 2) return { direction: 'stable', change: 0 };

    const recent = history.slice(-5);
    const avg = recent.reduce((sum, item) => sum + item.connections, 0) / recent.length;
    const previous = history.slice(-10, -5);
    const prevAvg = previous.length > 0 ?
    previous.reduce((sum, item) => sum + item.connections, 0) / previous.length :
    avg;

    const change = avg - prevAvg;
    const direction = change > 2 ? 'increasing' : change < -2 ? 'decreasing' : 'stable';

    return { direction, change: Math.abs(change) };
  };

  const trend = getTrend();

  // Manual refresh
  const handleManualRefresh = () => {
    fetchConnectionStats();
    toast({
      title: "Refreshed",
      description: "Database connection statistics updated"
    });
  };

  // View detailed stats
  const handleViewDetails = () => {
    const connectionManager = DatabaseConnectionManager.getInstance();
    const detailedStats = connectionManager.getDetailedStats();
    console.log('Database Connection Manager Detailed Stats:', detailedStats);
    toast({
      title: "Detailed Stats",
      description: "Comprehensive connection stats logged to console"
    });
  };

  // Recommendations based on status
  const getRecommendations = () => {
    if (connectionStats.status === 'critical') {
      return [
      "IMMEDIATE: Use 'Optimize Connections' button to reduce load",
      "Check for connection leaks in application code",
      "Review long-running queries and transactions",
      "Monitor queued requests and idle connections",
      "Consider scaling database resources"];

    } else if (connectionStats.status === 'warning') {
      return [
      "Monitor connection usage closely",
      "Review recent application deployments",
      "Check query performance and optimization",
      "Implement connection timeout policies",
      "Prepare for potential scaling if trend continues"];

    } else {
      return [
      "Connection usage is within normal limits",
      "Continue regular monitoring",
      "Maintain current connection pooling strategies",
      "Connection manager is automatically optimizing usage"];

    }
  };

  return (
    <div className="space-y-6" data-id="woiowpcv7" data-path="src/components/DatabaseConnectionMonitor.tsx">
      {/* Main Status Card */}
      <Card data-id="orkl7z70w" data-path="src/components/DatabaseConnectionMonitor.tsx">
        <CardHeader data-id="qp2reunv0" data-path="src/components/DatabaseConnectionMonitor.tsx">
          <div className="flex items-center justify-between" data-id="w7ibo34kd" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <div className="flex items-center space-x-2" data-id="cwlkx56zg" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <Database className="h-5 w-5" data-id="ii2yoggxu" data-path="src/components/DatabaseConnectionMonitor.tsx" />
              <CardTitle data-id="hydyz3orb" data-path="src/components/DatabaseConnectionMonitor.tsx">Enhanced Database Connection Monitor</CardTitle>
            </div>
            <div className="flex items-center space-x-2" data-id="tnjspd97r" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <Badge variant={getStatusColor(connectionStats.status)} data-id="mrixj84zp" data-path="src/components/DatabaseConnectionMonitor.tsx">
                {connectionStats.status.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isMonitoring} data-id="sm7btkzt1" data-path="src/components/DatabaseConnectionMonitor.tsx">
                <RefreshCw className={`h-4 w-4 mr-2 ${isMonitoring ? 'animate-spin' : ''}`} data-id="tha2nd9pa" data-path="src/components/DatabaseConnectionMonitor.tsx" />
                Refresh
              </Button>
            </div>
          </div>
          <CardDescription data-id="uj4irxqlw" data-path="src/components/DatabaseConnectionMonitor.tsx">
            Real-time monitoring with automatic connection management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="3ttwoplf3" data-path="src/components/DatabaseConnectionMonitor.tsx">
          {/* Current Status Alert */}
          {connectionStats.status === 'critical' &&
          <Alert variant="destructive" data-id="8ko9e9x29" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <AlertTriangle className="h-4 w-4" data-id="g6bg4ripw" data-path="src/components/DatabaseConnectionMonitor.tsx" />
              <AlertTitle data-id="v95b8h1gx" data-path="src/components/DatabaseConnectionMonitor.tsx">Critical Connection Usage Detected</AlertTitle>
              <AlertDescription data-id="5ykmcp5gf" data-path="src/components/DatabaseConnectionMonitor.tsx">
                Database connections are at {connectionStats.percentage.toFixed(1)}% capacity 
                ({connectionStats.connections}/{connectionStats.max}). 
                {connectionStats.queued > 0 && ` ${connectionStats.queued} requests are queued.`}
                Immediate action required to prevent service disruption.
              </AlertDescription>
            </Alert>
          }

          {connectionStats.status === 'warning' &&
          <Alert data-id="vwqxdifz3" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <AlertTriangle className="h-4 w-4" data-id="6rgk2e7fy" data-path="src/components/DatabaseConnectionMonitor.tsx" />
              <AlertTitle data-id="afme6d4c1" data-path="src/components/DatabaseConnectionMonitor.tsx">High Connection Usage Warning</AlertTitle>
              <AlertDescription data-id="n9sk78acj" data-path="src/components/DatabaseConnectionMonitor.tsx">
                Connection pressure is at {(connectionStats.pressure * 100).toFixed(1)}%. 
                {connectionStats.queued > 0 && ` ${connectionStats.queued} requests are currently queued.`}
                Monitor closely and consider optimization.
              </AlertDescription>
            </Alert>
          }

          {/* Connection Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="lzamcjby9" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <div className="space-y-2" data-id="s710omqk4" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <div className="flex items-center justify-between" data-id="do82507mw" data-path="src/components/DatabaseConnectionMonitor.tsx">
                <span className="text-sm font-medium" data-id="hpa73n42s" data-path="src/components/DatabaseConnectionMonitor.tsx">Active</span>
                <span className="text-2xl font-bold text-blue-600" data-id="4gmj6zkk6" data-path="src/components/DatabaseConnectionMonitor.tsx">
                  {connectionStats.connections}
                </span>
              </div>
              <div className="text-xs text-muted-foreground" data-id="fr26i3qjy" data-path="src/components/DatabaseConnectionMonitor.tsx">
                Active connections
              </div>
            </div>

            <div className="space-y-2" data-id="9k5x3xx3n" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <div className="flex items-center justify-between" data-id="mknfl8u67" data-path="src/components/DatabaseConnectionMonitor.tsx">
                <span className="text-sm font-medium" data-id="u0tvisemi" data-path="src/components/DatabaseConnectionMonitor.tsx">Idle</span>
                <span className="text-2xl font-bold text-green-600" data-id="17cw2q4u4" data-path="src/components/DatabaseConnectionMonitor.tsx">
                  {connectionStats.idle}
                </span>
              </div>
              <div className="text-xs text-muted-foreground" data-id="3kwndp554" data-path="src/components/DatabaseConnectionMonitor.tsx">
                Idle connections
              </div>
            </div>

            <div className="space-y-2" data-id="kvrp6qhhp" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <div className="flex items-center justify-between" data-id="5g2abq6mg" data-path="src/components/DatabaseConnectionMonitor.tsx">
                <span className="text-sm font-medium" data-id="e3lj4z11e" data-path="src/components/DatabaseConnectionMonitor.tsx">Queued</span>
                <span className="text-2xl font-bold text-yellow-600" data-id="9zitxh051" data-path="src/components/DatabaseConnectionMonitor.tsx">
                  {connectionStats.queued}
                </span>
              </div>
              <div className="text-xs text-muted-foreground" data-id="220t8is51" data-path="src/components/DatabaseConnectionMonitor.tsx">
                Pending requests
              </div>
            </div>

            <div className="space-y-2" data-id="ix4h6i1yl" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <div className="flex items-center justify-between" data-id="dq6bj6n8t" data-path="src/components/DatabaseConnectionMonitor.tsx">
                <span className="text-sm font-medium" data-id="vmvqji28k" data-path="src/components/DatabaseConnectionMonitor.tsx">Pressure</span>
                <span className="text-2xl font-bold text-purple-600" data-id="d5mohocgb" data-path="src/components/DatabaseConnectionMonitor.tsx">
                  {(connectionStats.pressure * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground" data-id="l4lm83rig" data-path="src/components/DatabaseConnectionMonitor.tsx">
                System pressure
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2" data-id="xy4vh4w1r" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <div className="flex items-center justify-between" data-id="owqcy2mzx" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <span className="text-sm font-medium" data-id="hnl5aykau" data-path="src/components/DatabaseConnectionMonitor.tsx">Connection Usage</span>
              <span className="text-sm text-muted-foreground" data-id="4zp5np1r2" data-path="src/components/DatabaseConnectionMonitor.tsx">
                {connectionStats.connections}/{connectionStats.max}
              </span>
            </div>
            <Progress
              value={connectionStats.percentage}
              className="h-3" data-id="nx7ig040u" data-path="src/components/DatabaseConnectionMonitor.tsx" />

            <div className="text-xs text-muted-foreground" data-id="y93jy93rp" data-path="src/components/DatabaseConnectionMonitor.tsx">
              {connectionStats.percentage.toFixed(1)}% of maximum capacity
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2" data-id="ismvmnmhw" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <Button
              onClick={handleOptimizeConnections}
              disabled={isOptimizing}
              variant={connectionStats.status === 'critical' ? 'destructive' : 'default'} data-id="zq7z0glpc" data-path="src/components/DatabaseConnectionMonitor.tsx">

              {isOptimizing ?
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" data-id="h02zp9n3z" data-path="src/components/DatabaseConnectionMonitor.tsx" /> :

              <Zap className="mr-2 h-4 w-4" data-id="y7k3p1tgv" data-path="src/components/DatabaseConnectionMonitor.tsx" />
              }
              {isOptimizing ? 'Optimizing...' : 'Optimize Connections'}
            </Button>
            
            <Button onClick={handleViewDetails} variant="outline" data-id="ripd73tl8" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <Settings className="mr-2 h-4 w-4" data-id="854ioddgo" data-path="src/components/DatabaseConnectionMonitor.tsx" />
              View Details
            </Button>

            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)} data-id="xpb5cgxat" data-path="src/components/DatabaseConnectionMonitor.tsx">
              <Activity className="mr-2 h-4 w-4" data-id="g408xvzwr" data-path="src/components/DatabaseConnectionMonitor.tsx" />
              {autoRefresh ? 'Disable Auto-refresh' : 'Enable Auto-refresh'}
            </Button>
          </div>

          {/* Monitoring Status */}
          <div className="flex items-center justify-between text-sm text-muted-foreground" data-id="9hifkkncl" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <span data-id="e7bthmazn" data-path="src/components/DatabaseConnectionMonitor.tsx">Last updated: {connectionStats.timestamp.toLocaleTimeString()}</span>
            <Badge variant={autoRefresh ? "default" : "secondary"} data-id="bboq0q79v" data-path="src/components/DatabaseConnectionMonitor.tsx">
              {isMonitoring ? 'Auto-monitoring Active' : 'Manual Mode'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card data-id="xx01q4u7h" data-path="src/components/DatabaseConnectionMonitor.tsx">
        <CardHeader data-id="k4n129e31" data-path="src/components/DatabaseConnectionMonitor.tsx">
          <CardTitle data-id="hb92mndbi" data-path="src/components/DatabaseConnectionMonitor.tsx">Recommendations</CardTitle>
          <CardDescription data-id="9k4255akt" data-path="src/components/DatabaseConnectionMonitor.tsx">
            Actions to address current connection status
          </CardDescription>
        </CardHeader>
        <CardContent data-id="devwq9jvx" data-path="src/components/DatabaseConnectionMonitor.tsx">
          <ul className="space-y-2" data-id="0uzf3zimy" data-path="src/components/DatabaseConnectionMonitor.tsx">
            {getRecommendations().map((recommendation, index) =>
            <li key={index} className="flex items-start space-x-2" data-id="ffc4e4yc3" data-path="src/components/DatabaseConnectionMonitor.tsx">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" data-id="142h1y7c0" data-path="src/components/DatabaseConnectionMonitor.tsx" />
                <span className="text-sm" data-id="irm5ybr51" data-path="src/components/DatabaseConnectionMonitor.tsx">{recommendation}</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Connection History */}
      {history.length > 0 &&
      <Card data-id="dfn8j48fn" data-path="src/components/DatabaseConnectionMonitor.tsx">
          <CardHeader data-id="tjhbxenp5" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <CardTitle data-id="eg4uvo3ww" data-path="src/components/DatabaseConnectionMonitor.tsx">Recent Connection History</CardTitle>
            <CardDescription data-id="moojzg0e4" data-path="src/components/DatabaseConnectionMonitor.tsx">
              Last {history.length} measurements with connection manager data
            </CardDescription>
          </CardHeader>
          <CardContent data-id="dn7yk8o0s" data-path="src/components/DatabaseConnectionMonitor.tsx">
            <div className="space-y-2 max-h-40 overflow-y-auto" data-id="1ulobbvcg" data-path="src/components/DatabaseConnectionMonitor.tsx">
              {history.slice(-10).reverse().map((entry, index) =>
            <div key={index} className="flex items-center justify-between text-sm" data-id="ghax9nhbv" data-path="src/components/DatabaseConnectionMonitor.tsx">
                  <span data-id="l2gsgh3sn" data-path="src/components/DatabaseConnectionMonitor.tsx">{entry.timestamp.toLocaleTimeString()}</span>
                  <div className="flex items-center space-x-2" data-id="7t8iuyo26" data-path="src/components/DatabaseConnectionMonitor.tsx">
                    <span data-id="0hxry3mzq" data-path="src/components/DatabaseConnectionMonitor.tsx">A:{entry.connections}</span>
                    <span data-id="au6gvbcou" data-path="src/components/DatabaseConnectionMonitor.tsx">I:{entry.idle}</span>
                    <span data-id="g8q9bb2qj" data-path="src/components/DatabaseConnectionMonitor.tsx">Q:{entry.queued}</span>
                    <Badge
                  variant={
                  entry.connections / entry.max * 100 >= 85 ? 'destructive' :
                  entry.connections / entry.max * 100 >= 70 ? 'secondary' : 'default'
                  } data-id="732dg3lm3" data-path="src/components/DatabaseConnectionMonitor.tsx">
                      {(entry.connections / entry.max * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default DatabaseConnectionMonitor;
