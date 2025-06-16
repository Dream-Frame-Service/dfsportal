import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Eye } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MemoryLeakMonitor } from '@/services/memoryLeakMonitor';
import useAdminAccess from '@/hooks/use-admin-access';

interface MemoryInfo {
  current: {usedJSHeapSize: number;jsHeapSizeLimit: number;} | null;
  pressure: number;
  componentsTracked: number;
  totalLeakReports: number;
  growth: number;
}

const MemoryMonitoringWidget: React.FC = () => {
  const { hasMonitoringAccess } = useAdminAccess();
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only run if user has monitoring access
    if (!hasMonitoringAccess) {
      return;
    }

    // Check if memory monitoring is available
    if (typeof window !== 'undefined' && window.performance?.memory) {
      setIsAvailable(true);

      // Get initial memory info
      const monitor = MemoryLeakMonitor.getInstance();
      const info = monitor.getCurrentMemoryInfo();
      setMemoryInfo(info);

      // Set up periodic updates
      const interval = setInterval(() => {
        const updatedInfo = monitor.getCurrentMemoryInfo();
        setMemoryInfo(updatedInfo);
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    } else {
      setIsAvailable(false);
    }
  }, [hasMonitoringAccess]);

  // Return null if user doesn't have monitoring access
  if (!hasMonitoringAccess) {
    return null;
  }

  const formatBytes = (bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  const getMemoryStatus = () => {
    if (!memoryInfo || !memoryInfo.current) return { status: 'unknown', color: 'gray' };

    const pressure = memoryInfo.pressure;
    const hasLeaks = memoryInfo.totalLeakReports > 0;

    if (hasLeaks && pressure > 0.7) {
      return { status: 'critical', color: 'red', icon: AlertTriangle };
    } else if (hasLeaks || pressure > 0.7) {
      return { status: 'warning', color: 'orange', icon: AlertTriangle };
    } else if (pressure > 0.5) {
      return { status: 'moderate', color: 'yellow', icon: Activity };
    } else {
      return { status: 'good', color: 'green', icon: CheckCircle };
    }
  };

  const handleViewDetails = () => {
    navigate('/admin/memory-monitoring');
  };

  if (!isAvailable) {
    return (
      <Card className="border-gray-200" data-id="53lczy4hx" data-path="src/components/MemoryMonitoringWidget.tsx">
        <CardHeader className="pb-3" data-id="diwzy1flh" data-path="src/components/MemoryMonitoringWidget.tsx">
          <CardTitle className="flex items-center gap-2 text-gray-600" data-id="jquxn0rm6" data-path="src/components/MemoryMonitoringWidget.tsx">
            <Activity className="h-5 w-5" data-id="xki7pjutg" data-path="src/components/MemoryMonitoringWidget.tsx" />
            Memory Monitor
          </CardTitle>
        </CardHeader>
        <CardContent data-id="w04dsfy5y" data-path="src/components/MemoryMonitoringWidget.tsx">
          <div className="text-center py-4" data-id="648urpvfp" data-path="src/components/MemoryMonitoringWidget.tsx">
            <p className="text-sm text-gray-500 mb-2" data-id="jka146xb7" data-path="src/components/MemoryMonitoringWidget.tsx">
              Memory monitoring not available in this environment
            </p>
            <Badge variant="secondary" data-id="bgilrybzi" data-path="src/components/MemoryMonitoringWidget.tsx">Disabled</Badge>
          </div>
        </CardContent>
      </Card>);

  }

  if (!memoryInfo) {
    return (
      <Card className="border-gray-200" data-id="61om6kl1k" data-path="src/components/MemoryMonitoringWidget.tsx">
        <CardHeader className="pb-3" data-id="5apu1u1nt" data-path="src/components/MemoryMonitoringWidget.tsx">
          <CardTitle className="flex items-center gap-2" data-id="ohprr6thp" data-path="src/components/MemoryMonitoringWidget.tsx">
            <Activity className="h-5 w-5 animate-spin" data-id="h5wal3y5b" data-path="src/components/MemoryMonitoringWidget.tsx" />
            Memory Monitor
          </CardTitle>
        </CardHeader>
        <CardContent data-id="5jaziq9dw" data-path="src/components/MemoryMonitoringWidget.tsx">
          <div className="text-center py-4" data-id="y0lccusuj" data-path="src/components/MemoryMonitoringWidget.tsx">
            <p className="text-sm text-gray-500" data-id="uucy1zct0" data-path="src/components/MemoryMonitoringWidget.tsx">Loading memory data...</p>
          </div>
        </CardContent>
      </Card>);

  }

  const status = getMemoryStatus();
  const StatusIcon = status.icon;

  return (
    <Card className={`border-${status.color}-200 bg-${status.color}-50/30`} data-id="22slkp8v9" data-path="src/components/MemoryMonitoringWidget.tsx">
      <CardHeader className="pb-3" data-id="rsxp1xfze" data-path="src/components/MemoryMonitoringWidget.tsx">
        <div className="flex items-center justify-between" data-id="qoi0a73bk" data-path="src/components/MemoryMonitoringWidget.tsx">
          <CardTitle className="flex items-center gap-2" data-id="jkirepgg8" data-path="src/components/MemoryMonitoringWidget.tsx">
            <Activity className="h-5 w-5" data-id="a2su7dteu" data-path="src/components/MemoryMonitoringWidget.tsx" />
            Memory Monitor
          </CardTitle>
          <Badge
            variant={status.color === 'green' ? 'default' : 'destructive'}
            className="capitalize" data-id="onv0hnj7g" data-path="src/components/MemoryMonitoringWidget.tsx">

            <StatusIcon className="h-3 w-3 mr-1" data-id="ixrnn9isi" data-path="src/components/MemoryMonitoringWidget.tsx" />
            {status.status}
          </Badge>
        </div>
        <CardDescription data-id="94afr3ms4" data-path="src/components/MemoryMonitoringWidget.tsx">
          Real-time memory usage and leak detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-id="207z4hm6e" data-path="src/components/MemoryMonitoringWidget.tsx">
        {/* Memory Usage */}
        {memoryInfo.current &&
        <div data-id="lvz96f36p" data-path="src/components/MemoryMonitoringWidget.tsx">
            <div className="flex items-center justify-between mb-2" data-id="jp9ul303b" data-path="src/components/MemoryMonitoringWidget.tsx">
              <span className="text-sm font-medium" data-id="o1rjgl5lh" data-path="src/components/MemoryMonitoringWidget.tsx">Memory Usage</span>
              <span className="text-sm text-muted-foreground" data-id="l7vmbkx3g" data-path="src/components/MemoryMonitoringWidget.tsx">
                {formatBytes(memoryInfo.current.usedJSHeapSize)}
              </span>
            </div>
            <Progress
            value={memoryInfo.pressure * 100}
            className={`h-2 ${
            memoryInfo.pressure > 0.8 ? 'text-red-600' :
            memoryInfo.pressure > 0.6 ? 'text-yellow-600' :
            'text-green-600'}`
            } data-id="ekzm9g6c2" data-path="src/components/MemoryMonitoringWidget.tsx" />

            <div className="flex justify-between text-xs text-muted-foreground mt-1" data-id="mn6ygc8lc" data-path="src/components/MemoryMonitoringWidget.tsx">
              <span data-id="qr7cu5lf7" data-path="src/components/MemoryMonitoringWidget.tsx">0MB</span>
              <span data-id="u4xh8a2pa" data-path="src/components/MemoryMonitoringWidget.tsx">{formatBytes(memoryInfo.current.jsHeapSizeLimit)}</span>
            </div>
          </div>
        }

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm" data-id="4s887j4wn" data-path="src/components/MemoryMonitoringWidget.tsx">
          <div className="bg-white/60 rounded-lg p-3" data-id="0guf7rw3f" data-path="src/components/MemoryMonitoringWidget.tsx">
            <div className="flex items-center gap-2 mb-1" data-id="eh426j3jf" data-path="src/components/MemoryMonitoringWidget.tsx">
              <TrendingUp className="h-4 w-4 text-blue-600" data-id="x4ycvwo05" data-path="src/components/MemoryMonitoringWidget.tsx" />
              <span className="font-medium" data-id="bsdm3kz0j" data-path="src/components/MemoryMonitoringWidget.tsx">Components</span>
            </div>
            <div className="text-lg font-bold" data-id="ptfhdx88d" data-path="src/components/MemoryMonitoringWidget.tsx">{memoryInfo.componentsTracked}</div>
            <div className="text-xs text-muted-foreground" data-id="suxcns8tp" data-path="src/components/MemoryMonitoringWidget.tsx">Tracked</div>
          </div>
          
          <div className="bg-white/60 rounded-lg p-3" data-id="4oi6s3rkf" data-path="src/components/MemoryMonitoringWidget.tsx">
            <div className="flex items-center gap-2 mb-1" data-id="d0ygmjoya" data-path="src/components/MemoryMonitoringWidget.tsx">
              <AlertTriangle className={`h-4 w-4 ${
              memoryInfo.totalLeakReports > 0 ? 'text-red-600' : 'text-green-600'}`
              } data-id="idbdnwi5r" data-path="src/components/MemoryMonitoringWidget.tsx" />
              <span className="font-medium" data-id="mz8i3bzfm" data-path="src/components/MemoryMonitoringWidget.tsx">Leaks</span>
            </div>
            <div className={`text-lg font-bold ${
            memoryInfo.totalLeakReports > 0 ? 'text-red-600' : 'text-green-600'}`
            } data-id="g6h6os67d" data-path="src/components/MemoryMonitoringWidget.tsx">
              {memoryInfo.totalLeakReports}
            </div>
            <div className="text-xs text-muted-foreground" data-id="ka39n7jde" data-path="src/components/MemoryMonitoringWidget.tsx">Detected</div>
          </div>
        </div>

        {/* Memory Growth Alert */}
        {memoryInfo.growth > 50 * 1024 * 1024 && // 50MB threshold
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3" data-id="t94z8pw1v" data-path="src/components/MemoryMonitoringWidget.tsx">
            <div className="flex items-center gap-2 mb-1" data-id="0bvfenga4" data-path="src/components/MemoryMonitoringWidget.tsx">
              <AlertTriangle className="h-4 w-4 text-orange-600" data-id="20dnkjrmx" data-path="src/components/MemoryMonitoringWidget.tsx" />
              <span className="text-sm font-medium text-orange-800" data-id="8cxrj6gve" data-path="src/components/MemoryMonitoringWidget.tsx">Memory Growth Alert</span>
            </div>
            <p className="text-xs text-orange-700" data-id="47hr9uz1b" data-path="src/components/MemoryMonitoringWidget.tsx">
              Memory usage has grown by {formatBytes(memoryInfo.growth)} since baseline
            </p>
          </div>
        }

        {/* Leak Reports Alert */}
        {memoryInfo.totalLeakReports > 0 &&
        <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-id="afekfa92j" data-path="src/components/MemoryMonitoringWidget.tsx">
            <div className="flex items-center gap-2 mb-1" data-id="jvzpcttlz" data-path="src/components/MemoryMonitoringWidget.tsx">
              <AlertTriangle className="h-4 w-4 text-red-600" data-id="9l82xdkjc" data-path="src/components/MemoryMonitoringWidget.tsx" />
              <span className="text-sm font-medium text-red-800" data-id="jnbxs1k5w" data-path="src/components/MemoryMonitoringWidget.tsx">Leak Detection</span>
            </div>
            <p className="text-xs text-red-700" data-id="jokb6jqu8" data-path="src/components/MemoryMonitoringWidget.tsx">
              {memoryInfo.totalLeakReports} potential memory leak(s) detected
            </p>
          </div>
        }

        {/* Success State */}
        {memoryInfo.totalLeakReports === 0 && memoryInfo.pressure < 0.5 &&
        <div className="bg-green-50 border border-green-200 rounded-lg p-3" data-id="jh01dpylu" data-path="src/components/MemoryMonitoringWidget.tsx">
            <div className="flex items-center gap-2 mb-1" data-id="4b151dubk" data-path="src/components/MemoryMonitoringWidget.tsx">
              <CheckCircle className="h-4 w-4 text-green-600" data-id="tthkecizj" data-path="src/components/MemoryMonitoringWidget.tsx" />
              <span className="text-sm font-medium text-green-800" data-id="jvk00556x" data-path="src/components/MemoryMonitoringWidget.tsx">All Clear</span>
            </div>
            <p className="text-xs text-green-700" data-id="z21ui1qaw" data-path="src/components/MemoryMonitoringWidget.tsx">
              No memory leaks detected, low memory pressure
            </p>
          </div>
        }

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2" data-id="bso9l7sku" data-path="src/components/MemoryMonitoringWidget.tsx">
          <Button
            onClick={handleViewDetails}
            size="sm"
            variant="outline"
            className="flex-1" data-id="ahpf2u712" data-path="src/components/MemoryMonitoringWidget.tsx">

            <Eye className="h-3 w-3 mr-1" data-id="hxphbvj5g" data-path="src/components/MemoryMonitoringWidget.tsx" />
            View Details
          </Button>
          {memoryInfo.totalLeakReports > 0 &&
          <Button
            onClick={() => navigate('/admin/memory-monitoring?tab=guide')}
            size="sm"
            variant="destructive"
            className="flex-1" data-id="kzogx9761" data-path="src/components/MemoryMonitoringWidget.tsx">

              <Zap className="h-3 w-3 mr-1" data-id="pl5uri3rg" data-path="src/components/MemoryMonitoringWidget.tsx" />
              Fix Leaks
            </Button>
          }
        </div>
      </CardContent>
    </Card>);

};

export default MemoryMonitoringWidget;
