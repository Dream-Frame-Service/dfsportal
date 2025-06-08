import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, TrendingUp, AlertTriangle, Play } from 'lucide-react';
import MemoryLeakDashboard from '@/components/MemoryLeakDashboard';
import MemoryLeakPreventionGuide from '@/components/MemoryLeakPreventionGuide';
import MemoryLeakDemo from '@/components/MemoryLeakDemo';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';

const MemoryMonitoring: React.FC = () => {
  const { hasMonitoringAccess } = useAdminAccess();

  // Check admin access first
  if (!hasMonitoringAccess) {
    return (
      <AccessDenied
        feature="Memory Leak Monitoring System"
        requiredRole="Administrator" data-id="p7z38ixsv" data-path="src/pages/Admin/MemoryMonitoring.tsx" />);


  }

  return (
    <div className="container mx-auto p-6 space-y-6" data-id="rukn3ewv5" data-path="src/pages/Admin/MemoryMonitoring.tsx">
      {/* Header */}
      <div className="text-center space-y-2" data-id="8zcjazz7k" data-path="src/pages/Admin/MemoryMonitoring.tsx">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-id="m2cmsyi9u" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          Memory Leak Monitoring System
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto" data-id="xlio1qsf3" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          Comprehensive memory leak detection, prevention, and monitoring for React applications. 
          Keep your DFS Manager Portal running smoothly with real-time memory analysis.
        </p>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-id="w1r45qc8k" data-path="src/pages/Admin/MemoryMonitoring.tsx">
        <Card className="border-blue-200 bg-blue-50/50" data-id="uivkr8sm6" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <CardHeader className="pb-3" data-id="fpu3d50th" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="wwpr05ske" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <Activity className="h-8 w-8 text-blue-600" data-id="y4939j8lk" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
              <Badge variant="secondary" data-id="ehktpeodg" data-path="src/pages/Admin/MemoryMonitoring.tsx">Real-time</Badge>
            </div>
          </CardHeader>
          <CardContent data-id="3sy8p3114" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <h3 className="font-semibold text-blue-900" data-id="dzrwlusga" data-path="src/pages/Admin/MemoryMonitoring.tsx">Live Monitoring</h3>
            <p className="text-sm text-blue-700" data-id="rwhbfe5yq" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              Track memory usage and component lifecycle in real-time
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50" data-id="lmewode58" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <CardHeader className="pb-3" data-id="ep9j31bn7" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="vpm3xy1mp" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <Shield className="h-8 w-8 text-green-600" data-id="577bz5z7k" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
              <Badge variant="secondary" data-id="md8dpa757" data-path="src/pages/Admin/MemoryMonitoring.tsx">Prevention</Badge>
            </div>
          </CardHeader>
          <CardContent data-id="gixh6qod1" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <h3 className="font-semibold text-green-900" data-id="00bdn88po" data-path="src/pages/Admin/MemoryMonitoring.tsx">Leak Prevention</h3>
            <p className="text-sm text-green-700" data-id="283js099l" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              Automatic cleanup and safe resource management
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50" data-id="pzob8v48v" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <CardHeader className="pb-3" data-id="ydvohw9ie" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="5y5uxe3ic" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <TrendingUp className="h-8 w-8 text-purple-600" data-id="01n2dedah" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
              <Badge variant="secondary" data-id="f4tr8ml45" data-path="src/pages/Admin/MemoryMonitoring.tsx">Analytics</Badge>
            </div>
          </CardHeader>
          <CardContent data-id="ofqnp2j7d" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <h3 className="font-semibold text-purple-900" data-id="14sfzgwn6" data-path="src/pages/Admin/MemoryMonitoring.tsx">Memory Analytics</h3>
            <p className="text-sm text-purple-700" data-id="uh4st4guo" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              Detailed reports and memory usage patterns
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50" data-id="odkrvlfyr" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <CardHeader className="pb-3" data-id="xqpcorr35" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <div className="flex items-center justify-between" data-id="oovla6lnd" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <AlertTriangle className="h-8 w-8 text-orange-600" data-id="50i9qb8ac" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
              <Badge variant="secondary" data-id="2f1lrall9" data-path="src/pages/Admin/MemoryMonitoring.tsx">Detection</Badge>
            </div>
          </CardHeader>
          <CardContent data-id="nm3g4j75i" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <h3 className="font-semibold text-orange-900" data-id="qsbikwce8" data-path="src/pages/Admin/MemoryMonitoring.tsx">Leak Detection</h3>
            <p className="text-sm text-orange-700" data-id="8ujs2af7l" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              Automatic detection of common memory leak patterns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6" data-id="lpncs1vei" data-path="src/pages/Admin/MemoryMonitoring.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="0jv3ysz89" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <TabsTrigger value="dashboard" className="flex items-center gap-2" data-id="y59hxm41m" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <Activity className="h-4 w-4" data-id="kpgxco112" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
            Live Dashboard
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2" data-id="bav9kiwui" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <Play className="h-4 w-4" data-id="nri4zy57v" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
            Interactive Demo
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2" data-id="bztk52sky" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <Shield className="h-4 w-4" data-id="sx3wuszhu" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
            Prevention Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6" data-id="4z00zwamy" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <Card data-id="h24pesfae" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <CardHeader data-id="1kmg14yxz" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <CardTitle className="flex items-center gap-2" data-id="t2kac7klo" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                <Activity className="h-5 w-5" data-id="99itf8bge" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
                Memory Leak Dashboard
              </CardTitle>
              <CardDescription data-id="qygw00nmy" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                Real-time monitoring of memory usage, component tracking, and leak detection for your DFS Manager Portal.
              </CardDescription>
            </CardHeader>
            <CardContent data-id="i3i80vecu" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <MemoryLeakDashboard data-id="ajcisn52q" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6" data-id="pvwna82hr" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <Card data-id="yfebv93w1" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <CardHeader data-id="kgm1p7etd" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <CardTitle className="flex items-center gap-2" data-id="jhglxlolq" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                <Play className="h-5 w-5" data-id="ukkfvsic0" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
                Interactive Memory Leak Demo
              </CardTitle>
              <CardDescription data-id="p6c1zoikf" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                Experience the difference between memory-safe and leak-prone components in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent data-id="xo48ho0dl" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <MemoryLeakDemo data-id="d84ak4cjn" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6" data-id="isoskqy3p" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <Card data-id="v1f2d8sz6" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <CardHeader data-id="3zla58gu6" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <CardTitle className="flex items-center gap-2" data-id="s8yabbk08" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                <Shield className="h-5 w-5" data-id="a0to54rf7" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
                Memory Leak Prevention Guide
              </CardTitle>
              <CardDescription data-id="6e3pviyf2" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                Learn best practices, common patterns, and how to use our monitoring tools to prevent memory leaks.
              </CardDescription>
            </CardHeader>
            <CardContent data-id="wqel7l3av" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <MemoryLeakPreventionGuide data-id="s81qcvj8s" data-path="src/pages/Admin/MemoryMonitoring.tsx" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" data-id="xnl4f2c88" data-path="src/pages/Admin/MemoryMonitoring.tsx">
        <CardContent className="p-6" data-id="mg73wq8p7" data-path="src/pages/Admin/MemoryMonitoring.tsx">
          <div className="text-center space-y-2" data-id="wecy7vjmb" data-path="src/pages/Admin/MemoryMonitoring.tsx">
            <h3 className="font-semibold text-blue-900" data-id="vsqyu0wz6" data-path="src/pages/Admin/MemoryMonitoring.tsx">Memory Monitoring Status</h3>
            <div className="flex items-center justify-center gap-4 text-sm" data-id="u853qcxv9" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              <div className="flex items-center gap-1" data-id="ws0dmm9jk" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                <div className="w-2 h-2 bg-green-500 rounded-full" data-id="5oqkw1so8" data-path="src/pages/Admin/MemoryMonitoring.tsx"></div>
                <span data-id="qdx8mj1kc" data-path="src/pages/Admin/MemoryMonitoring.tsx">Monitoring Active</span>
              </div>
              <div className="flex items-center gap-1" data-id="ndymk7iim" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                <div className="w-2 h-2 bg-blue-500 rounded-full" data-id="bfijkzwxb" data-path="src/pages/Admin/MemoryMonitoring.tsx"></div>
                <span data-id="jqawkdwqz" data-path="src/pages/Admin/MemoryMonitoring.tsx">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-1" data-id="kdbhz35ps" data-path="src/pages/Admin/MemoryMonitoring.tsx">
                <div className="w-2 h-2 bg-purple-500 rounded-full" data-id="crrlibe1i" data-path="src/pages/Admin/MemoryMonitoring.tsx"></div>
                <span data-id="amhz7lzjc" data-path="src/pages/Admin/MemoryMonitoring.tsx">Leak Detection Enabled</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground" data-id="iqulrh7a0" data-path="src/pages/Admin/MemoryMonitoring.tsx">
              Memory monitoring is automatically enabled for all components using our detection hooks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default MemoryMonitoring;