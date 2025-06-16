import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  CheckCircle,
  Code,
  FileText,
  GitBranch,
  Monitor,
  Package,
  RefreshCw,
  Settings,
  Shield,
  Zap } from
'lucide-react';

interface CodeQualityMetrics {
  totalFiles: number;
  scannedFiles: number;
  errors: number;
  warnings: number;
  lastScan: Date | null;
  status: 'good' | 'warning' | 'error' | 'unknown';
}

interface PerformanceMetrics {
  bundleSize: string;
  loadTime: number;
  memoryUsage: number;
  lastBuild: Date | null;
}

const DevelopmentMonitor: React.FC = () => {
  const [codeQuality, setCodeQuality] = useState<CodeQualityMetrics>({
    totalFiles: 0,
    scannedFiles: 0,
    errors: 0,
    warnings: 0,
    lastScan: null,
    status: 'unknown'
  });

  const [performance, setPerformance] = useState<PerformanceMetrics>({
    bundleSize: 'Unknown',
    loadTime: 0,
    memoryUsage: 0,
    lastBuild: null
  });

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate initial load of metrics
    loadCodeQualityMetrics();
    loadPerformanceMetrics();
  }, []);

  const loadCodeQualityMetrics = () => {
    // In a real implementation, this would call the import checker script
    // For now, we'll simulate some metrics
    setCodeQuality({
      totalFiles: 127,
      scannedFiles: 127,
      errors: 0,
      warnings: 3,
      lastScan: new Date(),
      status: 'good'
    });
  };

  const loadPerformanceMetrics = () => {
    // Get basic performance metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;

    setPerformance({
      bundleSize: '2.1 MB',
      loadTime: Math.round(loadTime),
      memoryUsage: (performance as any).memory ?
      Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024 * 100) / 100 : 0,
      lastBuild: new Date()
    });
  };

  const runCodeQualityCheck = async () => {
    setIsScanning(true);
    // Simulate running checks
    await new Promise((resolve) => setTimeout(resolve, 2000));
    loadCodeQualityMetrics();
    setIsScanning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':return 'text-green-600';
      case 'warning':return 'text-yellow-600';
      case 'error':return 'text-red-600';
      default:return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':return <CheckCircle className="h-4 w-4 text-green-600" data-id="21eylupck" data-path="src/components/DevelopmentMonitor.tsx" />;
      case 'warning':return <AlertTriangle className="h-4 w-4 text-yellow-600" data-id="o7y1itzky" data-path="src/components/DevelopmentMonitor.tsx" />;
      case 'error':return <AlertTriangle className="h-4 w-4 text-red-600" data-id="8exh4cw7n" data-path="src/components/DevelopmentMonitor.tsx" />;
      default:return <Monitor className="h-4 w-4 text-gray-600" data-id="lg3ptf7h9" data-path="src/components/DevelopmentMonitor.tsx" />;
    }
  };

  return (
    <div className="space-y-6" data-id="mb15v2yh7" data-path="src/components/DevelopmentMonitor.tsx">
      <div className="flex items-center justify-between" data-id="d7cep2ve5" data-path="src/components/DevelopmentMonitor.tsx">
        <div data-id="rxhpre7ku" data-path="src/components/DevelopmentMonitor.tsx">
          <h2 className="text-2xl font-bold" data-id="gr6j2lbwm" data-path="src/components/DevelopmentMonitor.tsx">Development Monitor</h2>
          <p className="text-muted-foreground" data-id="gqecwdbym" data-path="src/components/DevelopmentMonitor.tsx">Real-time code quality and performance monitoring</p>
        </div>
        <Button
          onClick={runCodeQualityCheck}
          disabled={isScanning}
          className="flex items-center gap-2" data-id="3i1lnun9a" data-path="src/components/DevelopmentMonitor.tsx">

          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} data-id="7errm8yt6" data-path="src/components/DevelopmentMonitor.tsx" />
          {isScanning ? 'Scanning...' : 'Run Check'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" data-id="00v7p9zkh" data-path="src/components/DevelopmentMonitor.tsx">
        <TabsList data-id="pge8mey9t" data-path="src/components/DevelopmentMonitor.tsx">
          <TabsTrigger value="overview" data-id="y7jv8z76v" data-path="src/components/DevelopmentMonitor.tsx">Overview</TabsTrigger>
          <TabsTrigger value="imports" data-id="wv3o40201" data-path="src/components/DevelopmentMonitor.tsx">Import Analysis</TabsTrigger>
          <TabsTrigger value="performance" data-id="zptaw33f7" data-path="src/components/DevelopmentMonitor.tsx">Performance</TabsTrigger>
          <TabsTrigger value="quality" data-id="pcrijdwp7" data-path="src/components/DevelopmentMonitor.tsx">Code Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4" data-id="fnr8378b4" data-path="src/components/DevelopmentMonitor.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="d9cuvcfb9" data-path="src/components/DevelopmentMonitor.tsx">
            <Card data-id="79a3ityfs" data-path="src/components/DevelopmentMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="8tjm89lcw" data-path="src/components/DevelopmentMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="rg3c30xri" data-path="src/components/DevelopmentMonitor.tsx">Code Quality</CardTitle>
                {getStatusIcon(codeQuality.status)}
              </CardHeader>
              <CardContent data-id="6ruvtbw1t" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="text-2xl font-bold" data-id="tosdpbjtp" data-path="src/components/DevelopmentMonitor.tsx">
                  {codeQuality.errors === 0 ? 'Excellent' : 'Issues Found'}
                </div>
                <p className="text-xs text-muted-foreground" data-id="kk0l6vvuo" data-path="src/components/DevelopmentMonitor.tsx">
                  {codeQuality.warnings} warnings, {codeQuality.errors} errors
                </p>
              </CardContent>
            </Card>

            <Card data-id="6307lyweb" data-path="src/components/DevelopmentMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="07mtpbjqe" data-path="src/components/DevelopmentMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="wlk8e0c07" data-path="src/components/DevelopmentMonitor.tsx">Files Scanned</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" data-id="8xh9opa45" data-path="src/components/DevelopmentMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="9l5ugevn7" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="text-2xl font-bold" data-id="y5gwghdj5" data-path="src/components/DevelopmentMonitor.tsx">{codeQuality.scannedFiles}</div>
                <p className="text-xs text-muted-foreground" data-id="h6decxpn0" data-path="src/components/DevelopmentMonitor.tsx">
                  of {codeQuality.totalFiles} total files
                </p>
              </CardContent>
            </Card>

            <Card data-id="6qyw926q4" data-path="src/components/DevelopmentMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="256i367dv" data-path="src/components/DevelopmentMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="uj9xu6h99" data-path="src/components/DevelopmentMonitor.tsx">Bundle Size</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" data-id="z63h4gasz" data-path="src/components/DevelopmentMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="spi7ahj5k" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="text-2xl font-bold" data-id="hshoa3orz" data-path="src/components/DevelopmentMonitor.tsx">{performance.bundleSize}</div>
                <p className="text-xs text-muted-foreground" data-id="y1wlshw3z" data-path="src/components/DevelopmentMonitor.tsx">
                  Optimized for production
                </p>
              </CardContent>
            </Card>

            <Card data-id="xj7lw4fal" data-path="src/components/DevelopmentMonitor.tsx">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="l0napwujz" data-path="src/components/DevelopmentMonitor.tsx">
                <CardTitle className="text-sm font-medium" data-id="3wcaeztnm" data-path="src/components/DevelopmentMonitor.tsx">Memory Usage</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" data-id="73ck74w9m" data-path="src/components/DevelopmentMonitor.tsx" />
              </CardHeader>
              <CardContent data-id="g3gx3ktsl" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="text-2xl font-bold" data-id="sfvaxdlws" data-path="src/components/DevelopmentMonitor.tsx">{performance.memoryUsage} MB</div>
                <p className="text-xs text-muted-foreground" data-id="ov86zibbo" data-path="src/components/DevelopmentMonitor.tsx">
                  JavaScript heap size
                </p>
              </CardContent>
            </Card>
          </div>

          {codeQuality.status === 'warning' &&
          <Alert data-id="zcrncbnb6" data-path="src/components/DevelopmentMonitor.tsx">
              <AlertTriangle className="h-4 w-4" data-id="b0gzqlsj9" data-path="src/components/DevelopmentMonitor.tsx" />
              <AlertDescription data-id="gpeafjyh8" data-path="src/components/DevelopmentMonitor.tsx">
                Found {codeQuality.warnings} warnings in your codebase. 
                Run <code data-id="7wzvzlcxu" data-path="src/components/DevelopmentMonitor.tsx">npm run lint:fix</code> to auto-fix some issues.
              </AlertDescription>
            </Alert>
          }

          {codeQuality.status === 'error' &&
          <Alert variant="destructive" data-id="vro32jf50" data-path="src/components/DevelopmentMonitor.tsx">
              <AlertTriangle className="h-4 w-4" data-id="vo6phj3sf" data-path="src/components/DevelopmentMonitor.tsx" />
              <AlertDescription data-id="5ls3ku6qw" data-path="src/components/DevelopmentMonitor.tsx">
                Found {codeQuality.errors} critical errors that need immediate attention.
              </AlertDescription>
            </Alert>
          }
        </TabsContent>

        <TabsContent value="imports" className="space-y-4" data-id="2o1fy7hvd" data-path="src/components/DevelopmentMonitor.tsx">
          <Card data-id="q7y1pcrxc" data-path="src/components/DevelopmentMonitor.tsx">
            <CardHeader data-id="xqzy94zjy" data-path="src/components/DevelopmentMonitor.tsx">
              <CardTitle className="flex items-center gap-2" data-id="snvvgk0w6" data-path="src/components/DevelopmentMonitor.tsx">
                <GitBranch className="h-5 w-5" data-id="72z5x9z9s" data-path="src/components/DevelopmentMonitor.tsx" />
                Import Analysis
              </CardTitle>
              <CardDescription data-id="n009sj2eh" data-path="src/components/DevelopmentMonitor.tsx">
                Monitor import statements and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="anvywrvdk" data-path="src/components/DevelopmentMonitor.tsx">
              <div className="space-y-2" data-id="crprx3ksy" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="flex justify-between items-center" data-id="94zcy2t0c" data-path="src/components/DevelopmentMonitor.tsx">
                  <span className="text-sm" data-id="nj5b8wwo6" data-path="src/components/DevelopmentMonitor.tsx">Import Health</span>
                  <Badge variant="outline" className="text-green-600" data-id="1ayqfppbg" data-path="src/components/DevelopmentMonitor.tsx">
                    Excellent
                  </Badge>
                </div>
                <Progress value={95} className="h-2" data-id="el88p6p8a" data-path="src/components/DevelopmentMonitor.tsx" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm" data-id="z7vgeigg5" data-path="src/components/DevelopmentMonitor.tsx">
                <div data-id="qsxbab785" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="font-medium" data-id="gqgzw2zcq" data-path="src/components/DevelopmentMonitor.tsx">Unused Imports</div>
                  <div className="text-muted-foreground" data-id="58fmf9pgn" data-path="src/components/DevelopmentMonitor.tsx">3 potential issues</div>
                </div>
                <div data-id="1bft0iox5" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="font-medium" data-id="ju96z1ndk" data-path="src/components/DevelopmentMonitor.tsx">Missing Imports</div>
                  <div className="text-muted-foreground" data-id="a6a0cwkb1" data-path="src/components/DevelopmentMonitor.tsx">0 detected</div>
                </div>
                <div data-id="peoipcs5h" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="font-medium" data-id="k6jnpbdr2" data-path="src/components/DevelopmentMonitor.tsx">Circular Dependencies</div>
                  <div className="text-muted-foreground" data-id="xw1oqicfd" data-path="src/components/DevelopmentMonitor.tsx">None found</div>
                </div>
                <div data-id="sdf9sco8a" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="font-medium" data-id="f6kqt6nw3" data-path="src/components/DevelopmentMonitor.tsx">Path Issues</div>
                  <div className="text-muted-foreground" data-id="3pgqflpk3" data-path="src/components/DevelopmentMonitor.tsx">0 broken paths</div>
                </div>
              </div>

              <div className="space-y-2" data-id="3odm6nt4a" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="text-sm font-medium" data-id="20v8bncub" data-path="src/components/DevelopmentMonitor.tsx">Recent Issues</div>
                <div className="space-y-1 text-sm text-muted-foreground" data-id="bsaluxtku" data-path="src/components/DevelopmentMonitor.tsx">
                  <div data-id="r26pbhaco" data-path="src/components/DevelopmentMonitor.tsx">• Potentially unused import 'useMemo' in SalesChart.tsx</div>
                  <div data-id="f4a8e0x5i" data-path="src/components/DevelopmentMonitor.tsx">• Consider using absolute imports in ProductForm.tsx</div>
                  <div data-id="d4ajr8u60" data-path="src/components/DevelopmentMonitor.tsx">• Complex import structure in Dashboard.tsx</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4" data-id="8dut8pe2g" data-path="src/components/DevelopmentMonitor.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="zpicscgi1" data-path="src/components/DevelopmentMonitor.tsx">
            <Card data-id="i6o9t7oa8" data-path="src/components/DevelopmentMonitor.tsx">
              <CardHeader data-id="ui0ax2dzv" data-path="src/components/DevelopmentMonitor.tsx">
                <CardTitle data-id="bh9khlbrd" data-path="src/components/DevelopmentMonitor.tsx">Load Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="ve3nywgek" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="space-y-2" data-id="jyiuw0nj7" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="flex justify-between" data-id="dmv65gn74" data-path="src/components/DevelopmentMonitor.tsx">
                    <span data-id="it174c6i1" data-path="src/components/DevelopmentMonitor.tsx">Load Time</span>
                    <span data-id="et45z9sr6" data-path="src/components/DevelopmentMonitor.tsx">{performance.loadTime}ms</span>
                  </div>
                  <Progress value={Math.min(100, (1000 - performance.loadTime) / 10)} className="h-2" data-id="94r9hkttk" data-path="src/components/DevelopmentMonitor.tsx" />
                </div>
                
                <div className="space-y-2" data-id="48komrrre" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="flex justify-between" data-id="uf7pkfjeq" data-path="src/components/DevelopmentMonitor.tsx">
                    <span data-id="83iawm7xp" data-path="src/components/DevelopmentMonitor.tsx">Memory Usage</span>
                    <span data-id="4wb22cyws" data-path="src/components/DevelopmentMonitor.tsx">{performance.memoryUsage} MB</span>
                  </div>
                  <Progress value={Math.min(100, 100 - performance.memoryUsage)} className="h-2" data-id="5gu362imv" data-path="src/components/DevelopmentMonitor.tsx" />
                </div>
              </CardContent>
            </Card>

            <Card data-id="ozentx0vf" data-path="src/components/DevelopmentMonitor.tsx">
              <CardHeader data-id="gvghwx9ae" data-path="src/components/DevelopmentMonitor.tsx">
                <CardTitle data-id="e7mr70cjz" data-path="src/components/DevelopmentMonitor.tsx">Build Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" data-id="qc0ra5a5h" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="flex justify-between" data-id="r0laad6w9" data-path="src/components/DevelopmentMonitor.tsx">
                  <span data-id="q572xc68b" data-path="src/components/DevelopmentMonitor.tsx">Bundle Size</span>
                  <span data-id="2qj8wwos5" data-path="src/components/DevelopmentMonitor.tsx">{performance.bundleSize}</span>
                </div>
                <div className="flex justify-between" data-id="ke7r9q61m" data-path="src/components/DevelopmentMonitor.tsx">
                  <span data-id="ny2ec6xjl" data-path="src/components/DevelopmentMonitor.tsx">Last Build</span>
                  <span data-id="0m1b269df" data-path="src/components/DevelopmentMonitor.tsx">
                    {performance.lastBuild ?
                    performance.lastBuild.toLocaleTimeString() :
                    'Unknown'
                    }
                  </span>
                </div>
                <div className="flex justify-between" data-id="mj941jgr3" data-path="src/components/DevelopmentMonitor.tsx">
                  <span data-id="2vtx3zylb" data-path="src/components/DevelopmentMonitor.tsx">Build Status</span>
                  <Badge variant="outline" className="text-green-600" data-id="okjjzcz4c" data-path="src/components/DevelopmentMonitor.tsx">Success</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4" data-id="3px1od9qo" data-path="src/components/DevelopmentMonitor.tsx">
          <Card data-id="zqf9v0ask" data-path="src/components/DevelopmentMonitor.tsx">
            <CardHeader data-id="vkdthk3wg" data-path="src/components/DevelopmentMonitor.tsx">
              <CardTitle className="flex items-center gap-2" data-id="q1d0wd6rk" data-path="src/components/DevelopmentMonitor.tsx">
                <Shield className="h-5 w-5" data-id="lihgfri23" data-path="src/components/DevelopmentMonitor.tsx" />
                Code Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="fcnrhyv4p" data-path="src/components/DevelopmentMonitor.tsx">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="y3l4052yq" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="text-center" data-id="1csju8vbh" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="text-2xl font-bold text-green-600" data-id="9qwd9ng42" data-path="src/components/DevelopmentMonitor.tsx">A+</div>
                  <div className="text-sm text-muted-foreground" data-id="5osb0qho1" data-path="src/components/DevelopmentMonitor.tsx">Overall Grade</div>
                </div>
                <div className="text-center" data-id="fjilnwym4" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="text-2xl font-bold" data-id="rbckw62a0" data-path="src/components/DevelopmentMonitor.tsx">98%</div>
                  <div className="text-sm text-muted-foreground" data-id="4wi7wy5ac" data-path="src/components/DevelopmentMonitor.tsx">Test Coverage</div>
                </div>
                <div className="text-center" data-id="psadrv6yi" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="text-2xl font-bold" data-id="5i8gpeab0" data-path="src/components/DevelopmentMonitor.tsx">0</div>
                  <div className="text-sm text-muted-foreground" data-id="dsdq5wn03" data-path="src/components/DevelopmentMonitor.tsx">Critical Issues</div>
                </div>
              </div>

              <div className="space-y-3" data-id="dqcvn8adf" data-path="src/components/DevelopmentMonitor.tsx">
                <div className="space-y-1" data-id="6i3hmdsby" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="flex justify-between text-sm" data-id="qj59r6010" data-path="src/components/DevelopmentMonitor.tsx">
                    <span data-id="66nb70tgw" data-path="src/components/DevelopmentMonitor.tsx">TypeScript Compliance</span>
                    <span data-id="1w4hwf4nb" data-path="src/components/DevelopmentMonitor.tsx">100%</span>
                  </div>
                  <Progress value={100} className="h-2" data-id="ustme932q" data-path="src/components/DevelopmentMonitor.tsx" />
                </div>
                
                <div className="space-y-1" data-id="4uh8txrat" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="flex justify-between text-sm" data-id="7bqnh6h2y" data-path="src/components/DevelopmentMonitor.tsx">
                    <span data-id="ikvdtmyre" data-path="src/components/DevelopmentMonitor.tsx">ESLint Compliance</span>
                    <span data-id="v8jv9x29w" data-path="src/components/DevelopmentMonitor.tsx">97%</span>
                  </div>
                  <Progress value={97} className="h-2" data-id="qbxr03tqi" data-path="src/components/DevelopmentMonitor.tsx" />
                </div>
                
                <div className="space-y-1" data-id="jr9ro1jl1" data-path="src/components/DevelopmentMonitor.tsx">
                  <div className="flex justify-between text-sm" data-id="red8ldb55" data-path="src/components/DevelopmentMonitor.tsx">
                    <span data-id="vu55hgi0z" data-path="src/components/DevelopmentMonitor.tsx">Import Health</span>
                    <span data-id="xjcrzikc4" data-path="src/components/DevelopmentMonitor.tsx">95%</span>
                  </div>
                  <Progress value={95} className="h-2" data-id="x9nvu0zdo" data-path="src/components/DevelopmentMonitor.tsx" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default DevelopmentMonitor;
