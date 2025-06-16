import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Trash2,
  Download,
  TrendingUp,
  Cpu,
  HardDrive,
  Zap } from
'lucide-react';
import { MemoryLeakMonitor } from '@/services/memoryLeakMonitor';
import { useToast } from '@/hooks/use-toast';
import { getMemoryUsage } from '../utils/memoryLeakIntegration';

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ComponentTracker {
  name: string;
  mountTime: number;
  unmountTime?: number;
  leakReports: any[];
  memoryUsageOnMount: MemoryStats | null;
  memoryUsageOnUnmount: MemoryStats | null;
}

const MemoryLeakDashboard: React.FC = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [components, setComponents] = useState<ComponentTracker[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<{timestamp: number;memory: MemoryStats;}[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const { toast } = useToast();

  const monitor = MemoryLeakMonitor.getInstance();

  const refreshData = () => {
    try {
      const info = monitor.getCurrentMemoryInfo();
      const componentStats = monitor.getComponentStats() as ComponentTracker[];
      const history = monitor.getMemoryHistory();

      setMemoryInfo(info);
      setComponents(Array.isArray(componentStats) ? componentStats : []);
      setMemoryHistory(history);
    } catch (error) {
      console.warn('Error refreshing memory data:', error);
      // Set safe fallback values
      setMemoryInfo({
        current: null,
        baseline: null,
        growth: 0,
        pressure: 0,
        componentsTracked: 0,
        totalLeakReports: 0,
        leakOccurrences: 0,
        isCriticalLeakDetected: false,
        nextAlertTime: 0
      });
      setComponents([]);
      setMemoryHistory([]);
    }
  };

  useEffect(() => {
    refreshData();

    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getMemoryPressureColor = (pressure: number): string => {
    if (pressure < 0.5) return 'text-green-600';
    if (pressure < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryPressureLabel = (pressure: number): string => {
    if (pressure < 0.5) return 'Low';
    if (pressure < 0.7) return 'Medium';
    return 'High';
  };

  const handleForceGC = () => {
    const success = monitor.forceGarbageCollection();
    if (success) {
      toast({
        title: "Garbage Collection Triggered",
        description: "Manual garbage collection has been executed."
      });
      setTimeout(refreshData, 1000); // Refresh after GC
    } else {
      toast({
        title: "Garbage Collection Unavailable",
        description: "Enable garbage collection in Chrome DevTools with --js-flags=\"--expose-gc\"",
        variant: "destructive"
      });
    }
  };

  const handleResetBaseline = () => {
    monitor.resetBaseline();
    toast({
      title: "Baseline Reset",
      description: "Memory monitoring baseline has been reset."
    });
    refreshData();
  };

  const handleDownloadReport = () => {
    const report = monitor.generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-leak-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Memory leak report has been saved to your downloads."
    });
  };

  const suspiciousComponents = components.
  filter((comp) => comp.leakReports.length > 0).
  sort((a, b) => b.leakReports.length - a.leakReports.length);

  if (!memoryInfo) {
    return (
      <Card data-id="62vvbrrgx" data-path="src/components/MemoryLeakDashboard.tsx">
        <CardContent className="p-6" data-id="o3z57cxow" data-path="src/components/MemoryLeakDashboard.tsx">
          <div className="flex items-center justify-center" data-id="e96gb2p7w" data-path="src/components/MemoryLeakDashboard.tsx">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" data-id="q3bzjjxbq" data-path="src/components/MemoryLeakDashboard.tsx" />
            Loading memory data...
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6" data-id="pl89o3zrw" data-path="src/components/MemoryLeakDashboard.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="pg80m2cbt" data-path="src/components/MemoryLeakDashboard.tsx">
        <div data-id="cclzd8nys" data-path="src/components/MemoryLeakDashboard.tsx">
          <h1 className="text-3xl font-bold" data-id="g4g1rn4dd" data-path="src/components/MemoryLeakDashboard.tsx">Memory Leak Monitor</h1>
          <p className="text-muted-foreground" data-id="00sfzfdld" data-path="src/components/MemoryLeakDashboard.tsx">
            Real-time memory usage and leak detection dashboard
          </p>
        </div>
        <div className="flex gap-2" data-id="3h1rgxwko" data-path="src/components/MemoryLeakDashboard.tsx">
          <Button onClick={refreshData} variant="outline" size="sm" data-id="iwbudp01p" data-path="src/components/MemoryLeakDashboard.tsx">
            <RefreshCw className="h-4 w-4 mr-2" data-id="nrm94hy6u" data-path="src/components/MemoryLeakDashboard.tsx" />
            Refresh
          </Button>
          <Button onClick={handleForceGC} variant="outline" size="sm" data-id="uzjg7g6j6" data-path="src/components/MemoryLeakDashboard.tsx">
            <Trash2 className="h-4 w-4 mr-2" data-id="6aau26t48" data-path="src/components/MemoryLeakDashboard.tsx" />
            Force GC
          </Button>
          <Button onClick={handleResetBaseline} variant="outline" size="sm" data-id="fikgzzm54" data-path="src/components/MemoryLeakDashboard.tsx">
            <Zap className="h-4 w-4 mr-2" data-id="hw057gm1s" data-path="src/components/MemoryLeakDashboard.tsx" />
            Reset Baseline
          </Button>
          <Button onClick={handleDownloadReport} variant="outline" size="sm" data-id="dpe83i16q" data-path="src/components/MemoryLeakDashboard.tsx">
            <Download className="h-4 w-4 mr-2" data-id="6ttb5ej83" data-path="src/components/MemoryLeakDashboard.tsx" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Memory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="dsequu6fb" data-path="src/components/MemoryLeakDashboard.tsx">
        <Card data-id="2i8g5fy9y" data-path="src/components/MemoryLeakDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="txhbijqfm" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="80gsuwhyr" data-path="src/components/MemoryLeakDashboard.tsx">Current Memory</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" data-id="7i52fx8x6" data-path="src/components/MemoryLeakDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="aslkh6tc6" data-path="src/components/MemoryLeakDashboard.tsx">
            <div className="text-2xl font-bold" data-id="t58hfutum" data-path="src/components/MemoryLeakDashboard.tsx">
              {memoryInfo.current ? formatBytes(memoryInfo.current.usedJSHeapSize) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground" data-id="6w6qbkk4u" data-path="src/components/MemoryLeakDashboard.tsx">
              of {memoryInfo.current ? formatBytes(memoryInfo.current.jsHeapSizeLimit) : 'N/A'} limit
            </p>
          </CardContent>
        </Card>

        <Card data-id="r48889ylo" data-path="src/components/MemoryLeakDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="haohp4wz1" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="eiak81y9r" data-path="src/components/MemoryLeakDashboard.tsx">Memory Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" data-id="78rae63qy" data-path="src/components/MemoryLeakDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="9awfcnl3p" data-path="src/components/MemoryLeakDashboard.tsx">
            <div className="text-2xl font-bold" data-id="1eou6w9ah" data-path="src/components/MemoryLeakDashboard.tsx">
              {formatBytes(memoryInfo.growth)}
            </div>
            <p className="text-xs text-muted-foreground" data-id="37msaqe0h" data-path="src/components/MemoryLeakDashboard.tsx">
              since baseline
            </p>
          </CardContent>
        </Card>

        <Card data-id="quxl4blq3" data-path="src/components/MemoryLeakDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="uvvmjyu7x" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="alonk06cj" data-path="src/components/MemoryLeakDashboard.tsx">Memory Pressure</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" data-id="nle9mo4ez" data-path="src/components/MemoryLeakDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="jh9sqz24q" data-path="src/components/MemoryLeakDashboard.tsx">
            <div className={`text-2xl font-bold ${getMemoryPressureColor(memoryInfo.pressure)}`} data-id="4tf3pcduk" data-path="src/components/MemoryLeakDashboard.tsx">
              {(memoryInfo.pressure * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground" data-id="v3i3p8s6d" data-path="src/components/MemoryLeakDashboard.tsx">
              {getMemoryPressureLabel(memoryInfo.pressure)} pressure
            </p>
            <Progress value={memoryInfo.pressure * 100} className="mt-2" data-id="kbgz3kyzr" data-path="src/components/MemoryLeakDashboard.tsx" />
          </CardContent>
        </Card>

        <Card data-id="m8x9aql45" data-path="src/components/MemoryLeakDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="i3kg4ksnk" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="f216e9sys" data-path="src/components/MemoryLeakDashboard.tsx">Components Tracked</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" data-id="9kmdoi000" data-path="src/components/MemoryLeakDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="7assyqn1r" data-path="src/components/MemoryLeakDashboard.tsx">
            <div className="text-2xl font-bold" data-id="g641hs5xn" data-path="src/components/MemoryLeakDashboard.tsx">{memoryInfo.componentsTracked}</div>
            <p className="text-xs text-muted-foreground" data-id="si16w2kb1" data-path="src/components/MemoryLeakDashboard.tsx">
              {memoryInfo.totalLeakReports} leak reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Memory Pressure Alert */}
      {memoryInfo.pressure > 0.7 &&
      <Alert data-id="52d8ozvxk" data-path="src/components/MemoryLeakDashboard.tsx">
          <AlertTriangle className="h-4 w-4" data-id="j7ne468uo" data-path="src/components/MemoryLeakDashboard.tsx" />
          <AlertDescription data-id="cxyaew4rf" data-path="src/components/MemoryLeakDashboard.tsx">
            High memory pressure detected ({(memoryInfo.pressure * 100).toFixed(1)}%). 
            Consider triggering garbage collection or investigating memory leaks.
          </AlertDescription>
        </Alert>
      }

      {/* Tabs for detailed views */}
      <Tabs defaultValue="components" className="space-y-4" data-id="458rb6ykx" data-path="src/components/MemoryLeakDashboard.tsx">
        <TabsList data-id="xfmbwfj6f" data-path="src/components/MemoryLeakDashboard.tsx">
          <TabsTrigger value="components" data-id="q48l8aqm2" data-path="src/components/MemoryLeakDashboard.tsx">Component Tracking</TabsTrigger>
          <TabsTrigger value="leaks" data-id="gthxwh9ra" data-path="src/components/MemoryLeakDashboard.tsx">
            Leak Reports
            {suspiciousComponents.length > 0 &&
            <Badge variant="destructive" className="ml-2" data-id="9y4adnzif" data-path="src/components/MemoryLeakDashboard.tsx">
                {suspiciousComponents.length}
              </Badge>
            }
          </TabsTrigger>
          <TabsTrigger value="history" data-id="pa3e7nylm" data-path="src/components/MemoryLeakDashboard.tsx">Memory History</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4" data-id="r4fe43hkd" data-path="src/components/MemoryLeakDashboard.tsx">
          <Card data-id="700c0ro9m" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardHeader data-id="0cra8lmit" data-path="src/components/MemoryLeakDashboard.tsx">
              <CardTitle data-id="xfkkvabns" data-path="src/components/MemoryLeakDashboard.tsx">Component Tracking</CardTitle>
              <CardDescription data-id="kd6p0o7nk" data-path="src/components/MemoryLeakDashboard.tsx">
                Real-time tracking of React components and their memory impact
              </CardDescription>
            </CardHeader>
            <CardContent data-id="hxj26vlda" data-path="src/components/MemoryLeakDashboard.tsx">
              {components.length === 0 ?
              <p className="text-center text-muted-foreground py-8" data-id="p9r938xuo" data-path="src/components/MemoryLeakDashboard.tsx">
                  No components are currently being tracked
                </p> :

              <div className="space-y-4" data-id="y596hhyxe" data-path="src/components/MemoryLeakDashboard.tsx">
                  {components.map((component, index) =>
                <div key={index} className="border rounded-lg p-4" data-id="784xje5yt" data-path="src/components/MemoryLeakDashboard.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="0mjj3ss0h" data-path="src/components/MemoryLeakDashboard.tsx">
                        <h3 className="font-semibold" data-id="x83fxs1f4" data-path="src/components/MemoryLeakDashboard.tsx">{component.name}</h3>
                        <div className="flex gap-2" data-id="nmrygczsg" data-path="src/components/MemoryLeakDashboard.tsx">
                          {component.leakReports.length > 0 &&
                      <Badge variant="destructive" data-id="xrx7aenar" data-path="src/components/MemoryLeakDashboard.tsx">
                              {component.leakReports.length} leaks
                            </Badge>
                      }
                          <Badge variant={component.unmountTime ? "secondary" : "default"} data-id="amqs2zlmf" data-path="src/components/MemoryLeakDashboard.tsx">
                            {component.unmountTime ? "Unmounted" : "Mounted"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" data-id="6ngljka6n" data-path="src/components/MemoryLeakDashboard.tsx">
                        <div data-id="l4rd7pptc" data-path="src/components/MemoryLeakDashboard.tsx">
                          <span className="text-muted-foreground" data-id="8s6ma3w6n" data-path="src/components/MemoryLeakDashboard.tsx">Mount Time:</span>
                          <p data-id="kpknh0jx9" data-path="src/components/MemoryLeakDashboard.tsx">{new Date(component.mountTime).toLocaleTimeString()}</p>
                        </div>
                        {component.unmountTime &&
                    <div data-id="jqwvsdrok" data-path="src/components/MemoryLeakDashboard.tsx">
                            <span className="text-muted-foreground" data-id="dvw67g50f" data-path="src/components/MemoryLeakDashboard.tsx">Unmount Time:</span>
                            <p data-id="9q2f1cj8d" data-path="src/components/MemoryLeakDashboard.tsx">{new Date(component.unmountTime).toLocaleTimeString()}</p>
                          </div>
                    }
                        {component.memoryUsageOnMount &&
                    <div data-id="9e5crdyhf" data-path="src/components/MemoryLeakDashboard.tsx">
                            <span className="text-muted-foreground" data-id="t01xhaq1u" data-path="src/components/MemoryLeakDashboard.tsx">Memory on Mount:</span>
                            <p data-id="fook6tyt9" data-path="src/components/MemoryLeakDashboard.tsx">{formatBytes(component.memoryUsageOnMount.usedJSHeapSize)}</p>
                          </div>
                    }
                        {component.memoryUsageOnUnmount &&
                    <div data-id="28v9jkwf9" data-path="src/components/MemoryLeakDashboard.tsx">
                            <span className="text-muted-foreground" data-id="50swxrsc9" data-path="src/components/MemoryLeakDashboard.tsx">Memory on Unmount:</span>
                            <p data-id="t8y3atboh" data-path="src/components/MemoryLeakDashboard.tsx">{formatBytes(component.memoryUsageOnUnmount.usedJSHeapSize)}</p>
                          </div>
                    }
                      </div>
                    </div>
                )}
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaks" className="space-y-4" data-id="jp75qbwh8" data-path="src/components/MemoryLeakDashboard.tsx">
          <Card data-id="y3otabrxv" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardHeader data-id="3ulnvlm1u" data-path="src/components/MemoryLeakDashboard.tsx">
              <CardTitle data-id="owipjd038" data-path="src/components/MemoryLeakDashboard.tsx">Leak Reports</CardTitle>
              <CardDescription data-id="qv29llsg0" data-path="src/components/MemoryLeakDashboard.tsx">
                Components with detected memory leak patterns
              </CardDescription>
            </CardHeader>
            <CardContent data-id="jmywi2fwg" data-path="src/components/MemoryLeakDashboard.tsx">
              {suspiciousComponents.length === 0 ?
              <div className="text-center py-8" data-id="9bwdaazum" data-path="src/components/MemoryLeakDashboard.tsx">
                  <div className="text-green-600 mb-2" data-id="n3eqzbapl" data-path="src/components/MemoryLeakDashboard.tsx">✅ No memory leaks detected</div>
                  <p className="text-muted-foreground" data-id="tk5bxpj15" data-path="src/components/MemoryLeakDashboard.tsx">All components are clean!</p>
                </div> :

              <div className="space-y-4" data-id="d6xfunas9" data-path="src/components/MemoryLeakDashboard.tsx">
                  {suspiciousComponents.map((component, index) =>
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50" data-id="mcdyt5tct" data-path="src/components/MemoryLeakDashboard.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="c3157s6qy" data-path="src/components/MemoryLeakDashboard.tsx">
                        <h3 className="font-semibold text-red-900" data-id="oimhmx9af" data-path="src/components/MemoryLeakDashboard.tsx">{component.name}</h3>
                        <Badge variant="destructive" data-id="zrbab2dmm" data-path="src/components/MemoryLeakDashboard.tsx">
                          {component.leakReports.length} issues
                        </Badge>
                      </div>
                      
                      <div className="space-y-2" data-id="7zeb6fzxi" data-path="src/components/MemoryLeakDashboard.tsx">
                        {component.leakReports.map((report, reportIndex) =>
                    <div key={reportIndex} className="text-sm bg-white rounded p-2" data-id="6mktx3z7p" data-path="src/components/MemoryLeakDashboard.tsx">
                            <div className="flex items-center justify-between" data-id="kthmniunp" data-path="src/components/MemoryLeakDashboard.tsx">
                              <span className="font-medium" data-id="u1g2o14v2" data-path="src/components/MemoryLeakDashboard.tsx">{report.leakType}</span>
                              <span className="text-muted-foreground" data-id="ia9tkh8z7" data-path="src/components/MemoryLeakDashboard.tsx">
                                {new Date(report.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            {report.metadata &&
                      <pre className="mt-1 text-xs text-gray-600 bg-gray-100 p-1 rounded overflow-x-auto" data-id="tkbl1xqjd" data-path="src/components/MemoryLeakDashboard.tsx">
                                {JSON.stringify(report.metadata, null, 2)}
                              </pre>
                      }
                          </div>
                    )}
                      </div>
                    </div>
                )}
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4" data-id="hk9b0wpy7" data-path="src/components/MemoryLeakDashboard.tsx">
          <Card data-id="k9ne761xj" data-path="src/components/MemoryLeakDashboard.tsx">
            <CardHeader data-id="gv8schxxb" data-path="src/components/MemoryLeakDashboard.tsx">
              <CardTitle data-id="80ow5urim" data-path="src/components/MemoryLeakDashboard.tsx">Memory Usage History</CardTitle>
              <CardDescription data-id="66qzvmxcb" data-path="src/components/MemoryLeakDashboard.tsx">
                Historical memory usage data over time
              </CardDescription>
            </CardHeader>
            <CardContent data-id="unwmrnvc1" data-path="src/components/MemoryLeakDashboard.tsx">
              {memoryHistory.length === 0 ?
              <p className="text-center text-muted-foreground py-8" data-id="e4q04pdyp" data-path="src/components/MemoryLeakDashboard.tsx">
                  No memory history data available
                </p> :

              <div className="space-y-2 max-h-96 overflow-y-auto" data-id="zofrr3bae" data-path="src/components/MemoryLeakDashboard.tsx">
                  {memoryHistory.
                slice(-20) // Show last 20 entries
                .reverse().
                map((entry, index) =>
                <div key={index} className="flex items-center justify-between py-2 border-b" data-id="9po6apcd6" data-path="src/components/MemoryLeakDashboard.tsx">
                        <span className="text-sm text-muted-foreground" data-id="bk2r8hkx7" data-path="src/components/MemoryLeakDashboard.tsx">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                        <div className="text-right" data-id="0xc91doil" data-path="src/components/MemoryLeakDashboard.tsx">
                          <div className="font-medium" data-id="81zn67r4n" data-path="src/components/MemoryLeakDashboard.tsx">
                            {formatBytes(entry.memory.usedJSHeapSize)}
                          </div>
                          <div className="text-xs text-muted-foreground" data-id="345t6k9p3" data-path="src/components/MemoryLeakDashboard.tsx">
                            {(entry.memory.usedJSHeapSize / entry.memory.jsHeapSizeLimit * 100).toFixed(1)}% of limit
                          </div>
                        </div>
                      </div>
                )}
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default MemoryLeakDashboard;
